// src/components/CommentSection.tsx (STEP 3: Add Submission State & Simulation)
'use client';

import React, { useState, useCallback, FormEvent } from 'react'; // Added useCallback
import { useWallet } from '@solana/wallet-adapter-react';
import dynamic from 'next/dynamic';
import { Buffer } from 'buffer'; // Needed for simulation/later use

const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

interface CommentSectionProps { postId: string; }
type Comment = { id: string; author: string; timestamp: string; text: string; };

// Keep helper function defined within component scope
const truncateAddress = (address: string) => {
    if (!address) return '';
    const start = address.substring(0, 4);
    const end = address.substring(address.length - 4);
    return start + '...' + end;
};

export function CommentSection({ postId }: CommentSectionProps) {
  // Add signMessage back to the hook destructuring
  const { connected, publicKey, signMessage } = useWallet();
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);

  // --- Add back state variables for submission ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [messageStatus, setMessageStatus] = useState<string>(''); // For signing steps
  // ---------------------------------------------

  // --- Replace placeholder handleSubmit with detailed version (using simulation) ---
  const handleSubmit = useCallback(async (event: FormEvent) => {
    event.preventDefault();
    // Added check for signMessage function availability
    if (!connected || !publicKey || !signMessage || !newComment.trim()) {
        setSubmitStatus('Wallet not connected, signMessage unavailable, or comment is empty.');
        return;
    }

    setIsSubmitting(true);
    setSubmitStatus(''); // Clear previous submit status
    setMessageStatus('Please sign message in your wallet to post comment...'); // Prompt user

    try {
      // Simulate signing step
      const messageToSign = `Comment on post "<span class="math-inline">\{postId\}"\:\\n\\n</span>{newComment}`;
      // const messageBytes = new TextEncoder().encode(messageToSign); // Prepare bytes for real signing later
      // const signature = await signMessage(messageBytes); // Real signing commented out for now
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate signing delay
      const simulatedSignature = Buffer.from('simulated_signature').toString('base64'); // Placeholder
      console.log('Simulated Signature:', simulatedSignature);
      setMessageStatus('Signature received! Submitting comment...'); // Update status

      // Simulate backend submission
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call delay
      const payload = {
        postId,
        text: newComment,
        author: publicKey.toBase58(),
        signature: simulatedSignature // Include placeholder signature
      };
      console.log('Simulating submit to backend with payload:', payload);

      // Optimistic Update (add comment to list locally)
      const optimisticComment: Comment = {
          id: `temp-${Date.now()}`,
          author: publicKey.toBase58(),
          timestamp: new Date().toLocaleDateString('en-CA'), // YYYY-MM-DD
          text: newComment
      };
      setComments(prev => [optimisticComment, ...prev]); // Add to top
      setNewComment(''); // Clear textarea
      setSubmitStatus('Comment added (simulation)!');
      setMessageStatus(''); // Clear signing message

    } catch (error: any) {
      console.error('Comment submission error simulation:', error);
      // Provide specific feedback based on error type if possible
      const errorMsg = error.message?.includes('User rejected') || error.code === 4001
                       ? 'Signature rejected.' // This won't happen in simulation
                       : 'Submission failed (simulation).';
      setSubmitStatus(`Error: ${errorMsg}`);
      setMessageStatus(''); // Clear signing message
    } finally {
      setIsSubmitting(false);
      // Clear status message after a few seconds
      setTimeout(() => setSubmitStatus(''), 4000);
    }
  }, [connected, publicKey, signMessage, newComment, postId]); // Dependencies for useCallback
  // ---------------------------------------------------------------------

  return (
    <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
      <h2 className="text-2xl font-semibold mb-6 text-slate-800 dark:text-slate-200">Leave a Comment</h2>

      {!connected ? (
        <div className="mb-8 p-4 flex flex-col items-center">
          <WalletMultiButtonDynamic style={{ height: '38px', fontSize: '14px' }} />
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Connect your wallet to leave a comment.
          </p>
        </div>
      ) : publicKey ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <label htmlFor="comment-textarea" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Your Comment (Signed with Wallet):
          </label>
          <textarea
            id="comment-textarea" value={newComment} onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..." rows={4} required
            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-slate-700 dark:text-slate-100 disabled:opacity-70"
            disabled={isSubmitting || !signMessage} // Disable if submitting or no sign capability
          />
          {/* Show message if wallet doesn't support signing */}
           {!signMessage && <p className="text-xs text-red-500 mt-1">Warning: Your connected wallet may not support message signing.</p>}

          {/* --- Re-add status displays and button logic --- */}
          <div className="flex justify-between items-center mt-3 gap-4">
             {/* Display submission status (left aligned) */}
             {submitStatus && <p className="text-xs text-slate-500 dark:text-slate-400 flex-grow text-left italic">{submitStatus}</p>}
            <button
              type="submit"
              // Update disabled logic
              disabled={!publicKey || !signMessage || isSubmitting || !newComment.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-semibold py-2 px-5 rounded-md shadow transition-colors disabled:cursor-not-allowed"
            >
              {/* Make button text dynamic */}
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
           {/* Display Sign Message status below button */}
           {messageStatus && (
             <p className={`text-xs mt-2 text-orange-600 dark:text-orange-400 text-right`}>
               {messageStatus}
             </p>
           )}
           {/* --------------------------------------------- */}
        </form>
      ) : null }

      <h3 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">Comments</h3>
      <div className="space-y-4">
        {/* Display comments from state */}
        {comments.length > 0 ? (
           comments.map(comment => (
             <div key={comment.id} className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
               <p className="text-slate-800 dark:text-slate-200 mb-2 whitespace-pre-wrap">{comment.text}</p>
               <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700 pt-2 mt-2">
                 <span className="font-mono break-all" title={comment.author}>By: {truncateAddress(comment.author)}</span>
                 <span className="whitespace-nowrap">{comment.timestamp}</span>
               </div>
             </div>
           ))
        ) : (
          <p className="text-slate-500 dark:text-slate-400 italic">No comments yet.</p>
        )}
      </div>
    </div>
  );
}