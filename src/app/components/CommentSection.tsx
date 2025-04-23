// src/components/CommentSection.tsx (Stable UI - Simulates Submit Only)
'use client';
import React, { useState, useCallback, FormEvent } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import dynamic from 'next/dynamic';
// Removed Buffer/Action imports for this stable version

const WalletMultiButtonDynamic = dynamic( async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton, { ssr: false } );

// Simplified Comment type for local display only
type TempComment = { id: string; author: string; timestamp: string; text: string; };
interface CommentSectionProps { postId: string; }

// Helper function
const truncateAddress = (address: string | undefined | null): string => { if (!address) return ''; return `${address.substring(0,4)}...${address.substring(address.length - 4)}`; };
// Helper function
const formatTimestamp = (isoString: string): string => { try { return new Date(isoString).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short'}); } catch { return isoString; } };

export function CommentSection({ postId }: CommentSectionProps) {
  // Only need connected and publicKey for simulation logic
  const { connected, publicKey } = useWallet();
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<TempComment[]>([]); // Local state only
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  // Removed messageStatus

  // Removed useEffect for loading

  // Simulation handleSubmit
  const handleSubmit = useCallback((event: FormEvent) => {
    event.preventDefault();
    const trimmedComment = newComment.trim();
    if (!connected || !publicKey || !trimmedComment) {
        setSubmitStatus('Wallet not connected or comment empty.');
        return;
    }
    console.log("Simulating comment add for:", trimmedComment);
    setIsSubmitting(true);
    setSubmitStatus('Adding comment locally...');

    setTimeout(() => { // Simulate delay
        const optimisticComment: TempComment = {
          id: `temp-${Date.now()}`,
          author: publicKey.toBase58(),
          timestamp: new Date().toLocaleDateString('en-CA'),
          text: trimmedComment
        };
        setComments(prev => [optimisticComment, ...prev]);
        setNewComment('');
        setSubmitStatus('Comment added locally (will disappear on refresh).');
        setIsSubmitting(false);
        setTimeout(() => setSubmitStatus(''), 4000);
    }, 500);
  // Removed signMessage from dependency array, postId not used inside simulation
  }, [connected, publicKey, newComment]);

  return (
    <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
      <h2 className="text-2xl font-semibold mb-6 text-slate-800 dark:text-slate-200">Leave a Comment</h2>
      {!connected ? (
        <div className="mb-8 p-4 flex flex-col items-center">
          <WalletMultiButtonDynamic style={{ height: '38px', fontSize: '14px' }} />
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Connect your wallet to leave a comment.</p>
        </div>
      ) : publicKey ? (
        <form onSubmit={handleSubmit} className="mb-8">
           <label htmlFor="comment-textarea" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Your Comment:</label>
           <textarea id="comment-textarea" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Share your thoughts..." rows={4} required className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-slate-700 dark:text-slate-100 disabled:opacity-70" disabled={isSubmitting} />
           <div className="flex justify-between items-center mt-3 gap-4">
             {submitStatus && <p className="text-xs text-slate-500 dark:text-slate-400 flex-grow text-left italic">{submitStatus}</p>}
             <button type="submit" disabled={isSubmitting || !newComment.trim()} className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-semibold py-2 px-5 rounded-md shadow transition-colors disabled:cursor-not-allowed">
               {isSubmitting ? 'Posting...' : 'Post Comment'}
             </button>
           </div>
        </form>
      ) : null }
      <h3 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">Comments ({comments.length})</h3>
      <div className="space-y-4">
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