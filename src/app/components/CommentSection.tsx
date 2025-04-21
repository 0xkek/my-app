// src/components/CommentSection.tsx (STEP 2d: Remove WIP from button)
'use client';

import React, { useState, FormEvent } from 'react'; // Only useState/FormEvent needed for this state
import { useWallet } from '@solana/wallet-adapter-react';
import dynamic from 'next/dynamic';

const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

interface CommentSectionProps { postId: string; }
type Comment = { id: string; author: string; timestamp: string; text: string; };

export function CommentSection({ postId }: CommentSectionProps) {
  console.log('Rendering Comment Section STEP 2d for post:', postId);
  const { connected, publicKey } = useWallet();
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault(); console.log('Form submitted (placeholder)');
    if (!publicKey) return;
    const optimisticComment: Comment = { id: `temp-${Date.now()}`, author: publicKey.toBase58(), timestamp: new Date().toLocaleDateString('en-CA'), text: newComment };
    setComments(prev => [optimisticComment, ...prev]); setNewComment('');
  };

  const truncateAddress = (address: string) => {
    if (!address) return '';
    const start = address.substring(0, 4);
    const end = address.substring(address.length - 4);
    return start + '...' + end;
  };

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
            Your Comment:
          </label>
          <textarea
            id="comment-textarea" value={newComment} onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..." rows={4} required
            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-slate-700 dark:text-slate-100"
          />
          <div className="flex justify-end items-center mt-3 gap-4">
            <button type="submit" disabled={!newComment.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-semibold py-2 px-5 rounded-md shadow transition-colors disabled:cursor-not-allowed">
              {/* --- Removed (WIP) --- */}
              Post Comment
              {/* --------------------- */}
            </button>
          </div>
        </form>
      ) : null }

      <h3 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">Comments</h3>
      <div className="space-y-4">
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