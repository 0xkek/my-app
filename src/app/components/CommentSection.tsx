// src/components/CommentSection.tsx (Using WalletMultiButton trigger)
'use client';

import React, { useState, useCallback, FormEvent, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
// No useWalletModal needed in this version
import dynamic from 'next/dynamic'; // Needed for button
import { Buffer } from 'buffer';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddressSync } from '@solana/spl-token'; // Keep this import

const WalletMultiButtonDynamic = dynamic( // Keep dynamic import
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

// Keep helper function and constant
const truncateAddress = (address: string) => { if (!address) return ''; const start = address.substring(0, 4); const end = address.substring(address.length - 4); return start + '...' + end; };
const USDC_DEVNET_MINT = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU');
type Comment = { id: string; author: string; timestamp: string; text: string; };
interface CommentSectionProps { postId: string; }

export function CommentSection({ postId }: CommentSectionProps) {
  const { connection } = useConnection();
  const { connected, publicKey, signMessage } = useWallet();
  // Keep state variables
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [isLoadingSol, setIsLoadingSol] = useState(false);
  const [solError, setSolError] = useState('');
  const [usdcBalance, setUsdcBalance] = useState<number | null>(null);
  const [isLoadingUsdc, setIsLoadingUsdc] = useState(false);
  const [usdcError, setUsdcError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [messageStatus, setMessageStatus] = useState<string>('');

  // Keep useEffect for fetching balances
  useEffect(() => { /* ... same balance fetching logic ... */ }, [connected, publicKey, connection]);

  // Keep handleSubmit with simulation
  const handleSubmit = useCallback(async (event: FormEvent) => { /* ... same submit logic ... */ }, [connected, publicKey, signMessage, newComment, postId]);

  return (
    <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
      <h2 className="text-2xl font-semibold mb-6 text-slate-800 dark:text-slate-200">Leave a Comment</h2>

      {!connected ? (
        // --- Use WalletMultiButton for disconnected state ---
        <div className="mb-8 p-4 flex justify-center">
          <WalletMultiButtonDynamic style={{ height: '38px', fontSize: '14px' }} />
        </div>
        // --- End Change ---
      ) : publicKey ? (
        // Connected state form
        <form onSubmit={handleSubmit} className="mb-8">
           <label htmlFor="comment-textarea" className="...">Your Comment (Signed with Wallet):</label>
          <textarea id="comment-textarea" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Share your thoughts..." rows={4} required className="..." disabled={isSubmitting} />
          <div className="flex justify-between items-center mt-3 gap-4">
             {submitStatus && <p className="text-xs ...">{submitStatus}</p>}
            <button type="submit" disabled={!publicKey || !signMessage || isSubmitting || !newComment.trim()} className="..."> {isSubmitting ? 'Posting...' : 'Post Comment'} </button>
          </div>
           {messageStatus && ( <p className={`text-xs mt-2 ...`}> {messageStatus} </p> )}
        </form>
      ) : null }

      <h3 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">Comments</h3>
      <div className="space-y-4">
         {comments.length > 0 ? (
           comments.map(comment => (
             <div key={comment.id} className="p-4 ...">
               <p className="...">{comment.text}</p>
               <div className="flex justify-between ...">
                 <span className="font-mono ..." title={comment.author}>
                   By: {truncateAddress(comment.author)}
                 </span>
                 <span className="whitespace-nowrap">{comment.timestamp}</span>
               </div>
             </div>
           ))
         ) : (
           <p className="text-slate-500 dark:text-slate-400 italic">Be the first to comment!</p>
         )}
      </div>
    </div>
  );
}