// src/components/CommentSection.tsx (FINAL STABLE UI + SIMULATION)
'use client';

import React, { useState, useCallback, FormEvent } from 'react';
// Only import useWallet for this version
import { useWallet } from '@solana/wallet-adapter-react';
import dynamic from 'next/dynamic';

// Dynamic import for the reliable button
const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

// Define Comment type for local state
type TempComment = { id: string; author: string; timestamp: string; text: string; };
interface CommentSectionProps { postId: string; }

// Helper function
const truncateAddress = (address: string | undefined | null): string => {
  if (!address) return '';
  const start = address.substring(0, 4);
  const end = address.substring(address.length - 4);
  return start + '...' + end;
};

// Helper function (keep in case comments loaded later)
const formatTimestamp = (isoString: string): string => {
    try { return new Date(isoString).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short'}); }
    catch { return isoString; }
};

export function CommentSection({ postId }: CommentSectionProps) {
  // Get necessary values from useWallet
  const { connected, publicKey, signMessage } = useWallet();

  // State for the form and local optimistic updates
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<TempComment[]>([]); // Local state only
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [messageStatus, setMessageStatus] = useState<string>(''); // Keep for simulation feedback

  // Removed useEffect for loading real comments for now

  // Handler that simulates signing and posting
  const handleSubmit = useCallback(async (event: FormEvent) => {
    event.preventDefault();
    const trimmedComment = newComment.trim();
    // Check required state, including signMessage availability for button logic
    if (!connected || !publicKey || !signMessage || !trimmedComment) {
        setSubmitStatus('Wallet not connected, cannot sign, or comment empty.');
        return;
    }
    setIsSubmitting(true); setSubmitStatus('');
    setMessageStatus('Simulating signature request...'); // Indicate simulation step

    try {
      // Simulate signing delay
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Simulated signing step complete.');
      setMessageStatus('Simulating submission...'); // Update status

      // Simulate backend delay & data prep
      await new Promise(resolve => setTimeout(resolve, 500));
      const payload = { postId, text: trimmedComment, author: publicKey.toBase58(), signature: 'simulated_base64_signature' };
      console.log('Simulating submit to backend with payload:', payload);

      // Optimistic Update
      const optimisticComment: TempComment = { id: `temp-${Date.now()}`, author: publicKey.toBase58(), timestamp: new Date().toLocaleDateString('en-CA'), text: trimmedComment };
      setComments(prev => [optimisticComment, ...prev]);
      setNewComment('');
      setSubmitStatus('Comment added (simulation)!');
      setMessageStatus('');

    } catch (error: unknown) { // Catch any unexpected error in simulation
      console.error('Comment submission error simulation:', error);
      setSubmitStatus(`Error: Simulation failed.`);
      setMessageStatus('');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(''), 4000);
    }
  }, [connected, publicKey, signMessage, newComment, postId]); // Keep dependencies

  return (
    <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
      <h2 className="text-2xl font-semibold mb-6 text-slate-800 dark:text-slate-200">Leave a Comment</h2>
      {!connected ? (
        <div className="mb-8 p-4 flex flex-col items-center">
          {/* Use the reliable button when disconnected */}
          <WalletMultiButtonDynamic style={{ height: '38px', fontSize: '14px' }} />
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Connect your wallet to leave a comment.</p>
        </div>
      ) : publicKey ? (
        // Form shown when connected
        <form onSubmit={handleSubmit} className="mb-8">
           <label htmlFor="comment-textarea" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Your Comment:</label>
           <textarea
             id="comment-textarea" value={newComment} onChange={(e) => setNewComment(e.target.value)}
             placeholder="Share your thoughts..." rows={4} required
             className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-slate-700 dark:text-slate-100 disabled:opacity-70"
             disabled={isSubmitting} // Only disable while submitting simulation
           />
           {/* Warning if wallet might not support signing */}
           {!signMessage && <p className="text-xs text-red-500 mt-1">Warning: Your connected wallet may not support message signing.</p>}
           <div className="flex justify-between items-center mt-3 gap-4">
             {/* Show submission status */}
             {submitStatus && <p className="text-xs text-slate-500 dark:text-slate-400 flex-grow text-left italic">{submitStatus}</p>}
             <button
               type="submit"
               // Disable based on state and input, check signMessage availability too
               disabled={isSubmitting || !newComment.trim() || !signMessage}
               className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-semibold py-2 px-5 rounded-md shadow transition-colors disabled:cursor-not-allowed"
             >
               {isSubmitting ? 'Posting...' : 'Post Comment'}
             </button>
           </div>
            {/* Show intermediate message status */}
            {messageStatus && (
              <p className={`text-xs mt-2 text-orange-600 dark:text-orange-400 text-right`}>
                {messageStatus}
              </p>
            )}
        </form>
      ) : null }

      <h3 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">Comments ({comments.length})</h3>
      <div className="space-y-4">
         {/* Comment list logic - only shows optimistically added comments */}
         {comments.length > 0 ? (
           comments.map(comment => (
             <div key={comment.id} className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
               <p className="text-slate-800 dark:text-slate-200 mb-2 whitespace-pre-wrap">{comment.text}</p>
               <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700 pt-2 mt-2">
                 <span className="font-mono break-all" title={comment.author}>By: {truncateAddress(comment.author)}</span>
                 <span className="whitespace-nowrap">{formatTimestamp(comment.timestamp)}</span>
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