// src/components/CommentSection.tsx (Using WalletMultiButton trigger - From response #237)
'use client';

import React, { useState, useCallback, FormEvent, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
// No useWalletModal needed
import dynamic from 'next/dynamic'; // Needed for button
import { Buffer } from 'buffer';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';

// Dynamically import WalletMultiButton with SSR disabled
const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

// Helper function to shorten the address
const truncateAddress = (address: string) => {
  if (!address) return '';
  const start = address.substring(0, 4);
  const end = address.substring(address.length - 4);
  return start + '...' + end;
};

// Define the Devnet USDC Mint address
const USDC_DEVNET_MINT = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU');

// Comment type
type Comment = { id: string; author: string; timestamp: string; text: string; };

// Props interface
interface CommentSectionProps { postId: string; }

export function CommentSection({ postId }: CommentSectionProps) {
  const { connection } = useConnection();
  const { connected, publicKey, signMessage } = useWallet();

  // Ref for the hidden button NOT needed in this version
  // const walletButtonRef = useRef<HTMLButtonElement>(null);

  // State variables
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [isLoadingSol, setIsLoadingSol] = useState(false);
  const [solError, setSolError] = useState('');
  const [usdcBalance, setUsdcBalance] = useState<number | null>(null);
  const [isLoadingUsdc, setIsLoadingUsdc] = useState(false);
  const [usdcError, setUsdcError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]); // Start empty
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [messageStatus, setMessageStatus] = useState<string>('');

  // Effect Hook to Fetch Balances
  useEffect(() => {
    if (connected && publicKey && connection) {
        setIsLoadingSol(true); setSolError(''); setSolBalance(null);
        setIsLoadingUsdc(true); setUsdcError(''); setUsdcBalance(null);
        setMessageStatus('');
        const fetchSolBalance = async () => { try { const l = await connection.getBalance(publicKey); setSolBalance(l / LAMPORTS_PER_SOL); } catch (e) { console.error("SOL Fetch Error:", e); setSolError('No SOL'); } finally { setIsLoadingSol(false); }};
        const fetchUsdcBalance = async () => { try { const a = getAssociatedTokenAddressSync(USDC_DEVNET_MINT, publicKey); const b = await connection.getTokenAccountBalance(a); setUsdcBalance(b.value?.uiAmount ?? 0); } catch (e: any) { console.error("USDC Fetch Error:", e); if (e.message?.includes('find account')) { setUsdcBalance(0); } else { setUsdcError('No USDC'); } } finally { setIsLoadingUsdc(false); }};
        fetchSolBalance(); fetchUsdcBalance();
    } else {
        setSolBalance(null); setUsdcBalance(null); setIsLoadingSol(false); setIsLoadingUsdc(false); setSolError(''); setUsdcError(''); setMessageStatus('');
    }
  }, [connected, publicKey, connection]);

  // Submit Handler (with simulation)
  const handleSubmit = useCallback(async (event: FormEvent) => {
    event.preventDefault(); if (!connected || !publicKey || !signMessage || !newComment.trim()) return; setIsSubmitting(true); setSubmitStatus('Preparing...'); setMessageStatus(''); try { setMessageStatus('Please sign message...'); const msg = `Comment on post ${postId}: ${newComment}`; const msgBytes = new TextEncoder().encode(msg); await new Promise(r => setTimeout(r, 1000)); const sig = Buffer.from('sim_sig').toString('base64'); console.log('Sim Sig:', sig); setMessageStatus('Sig received! Submitting...'); await new Promise(r => setTimeout(r, 1500)); console.log('Sim submit:', { postId, text: newComment, author: publicKey.toBase58() }); const opComment: Comment = { id: `temp-${Date.now()}`, author: publicKey.toBase58(), timestamp: new Date().toLocaleDateString('en-CA'), text: newComment }; setComments(prev => [opComment, ...prev]); setNewComment(''); setSubmitStatus('Comment added (sim)!'); setMessageStatus(''); } catch (e: any) { console.error('Comment submission error:', e); const eMsg = e.message?.includes('User rejected') ? 'Sig rejected.' : 'Submit failed.'; setSubmitStatus(`Error: ${eMsg}`); setMessageStatus(''); } finally { setIsSubmitting(false); setTimeout(() => setSubmitStatus(''), 4000); }
  }, [connected, publicKey, signMessage, newComment, postId]);

  // Handler to click the hidden button NOT needed
  // const handleConnectClick = () => { ... };

  return (
    <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
      <h2 className="text-2xl font-semibold mb-6 text-slate-800 dark:text-slate-200">Leave a Comment</h2>

      {/* --- Comment Submission Area --- */}
      {!connected ? (
        // --- Use WalletMultiButton for disconnected state ---
        <div className="mb-8 p-4 flex justify-center">
          <WalletMultiButtonDynamic style={{ height: '38px', fontSize: '14px' }} />
        </div>
        // --- End Change ---
      ) : publicKey ? (
        // Connected state form
        <form onSubmit={handleSubmit} className="mb-8">
           <label htmlFor="comment-textarea" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Your Comment (Signed with Wallet):</label>
           <textarea id="comment-textarea" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Share your thoughts..." rows={4} required className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-slate-700 dark:text-slate-100 disabled:opacity-70" disabled={isSubmitting} />
           <div className="flex justify-between items-center mt-3 gap-4">
              {submitStatus && <p className="text-xs text-slate-500 dark:text-slate-400 flex-grow text-left italic">{submitStatus}</p>}
             <button type="submit" disabled={!publicKey || !signMessage || isSubmitting || !newComment.trim()} className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-semibold py-2 px-5 rounded-md shadow transition-colors disabled:cursor-not-allowed">
               {isSubmitting ? 'Posting...' : 'Post Comment'}
             </button>
           </div>
            {messageStatus && ( <p className={`text-xs mt-2 text-red-500 text-right`}> {messageStatus} </p> )}
        </form>
      ) : null }

      {/* --- Display Existing Comments Area --- */}
      <h3 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">Comments</h3>
      <div className="space-y-4">
         {comments.length > 0 ? (
           comments.map(comment => (
             <div key={comment.id} className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
               <p className="text-slate-800 dark:text-slate-200 mb-2 whitespace-pre-wrap">{comment.text}</p>
               <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700 pt-2 mt-2">
                 <span className="font-mono break-all" title={comment.author}>
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