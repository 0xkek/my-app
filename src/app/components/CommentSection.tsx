// src/components/CommentSection.tsx (FINAL - Build Stable Simulation - Ignoring unused postId)
'use client';

import React, { useState, useCallback, FormEvent } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import dynamic from 'next/dynamic';
import { Buffer } from 'buffer'; // Keep Buffer for simulation signature

// Removed Action/Type imports - not used in simulation version
// Removed useEffect, useConnection, web3js, spl-token imports

const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

// Keep helper functions defined
const truncateAddress = (address: string | undefined | null): string => {
  if (!address) return '';
  const start = address.substring(0, 4);
  const end = address.substring(address.length - 4);
  return start + '...' + end;
};
const formatTimestamp = (isoString: string): string => {
    try { return new Date(isoString).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short'}); }
    catch { return isoString; }
};

// Keep types/interfaces used by this component
type TempComment = { id: string; author: string; timestamp: string; text: string; };
interface CommentSectionProps { postId: string; }


// --- Added ESLint disable comment for unused postId prop in this simulation state ---
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function CommentSection({ postId }: CommentSectionProps) {
// ---------------------------------------------------------------------------------
  // Removed unused signMessage from destructuring for simulation version
  const { connected, publicKey } = useWallet();
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<TempComment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  // Removed unused messageStatus state

  // Removed useEffect for loading comments

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

    // Simulation logic
    setTimeout(() => {
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
  // Removed postId and signMessage from dependency array
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