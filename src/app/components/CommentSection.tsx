// src/components/CommentSection.tsx (Applying Final Lint Fixes)
'use client';

// Keep useState, useCallback, FormEvent. Remove useEffect.
import React, { useState, useCallback, FormEvent } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import dynamic from 'next/dynamic';
import { Buffer } from 'buffer';
// Keep action imports and Comment type (exported from actions)
import { submitCommentAction, Comment } from '../../actions/commentActions';

const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

// Keep helper function defined within component scope
const truncateAddress = (address: string | undefined | null): string => {
  if (!address) return '';
  const start = address.substring(0, 4);
  const end = address.substring(address.length - 4);
  return start + '...' + end;
};

interface CommentSectionProps { postId: string; }

export function CommentSection({ postId }: CommentSectionProps) {
  const { connected, publicKey, signMessage } = useWallet();
  const [newComment, setNewComment] = useState('');
  // Use Comment type for state (assuming optimistic update matches server structure)
  const [comments, setComments] = useState<Comment[]>([]);
  // Removed isLoadingComments and loadingError state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [messageStatus, setMessageStatus] = useState<string>('');

  // Removed useEffect for initial comment loading

  const handleSubmit = useCallback(async (event: FormEvent) => {
    event.preventDefault();
    const trimmedComment = newComment.trim();
    if (!connected || !publicKey || !signMessage || !trimmedComment) {
        setSubmitStatus('Wallet not connected, cannot sign, or comment empty.');
        return;
    }
    setIsSubmitting(true); setSubmitStatus('');
    setMessageStatus('Please sign message in wallet...');

    try {
      // --- Use CORRECT message format ---
      const messageToSign = `Comment on post "<span class="math-inline">\{postId\}"\:\\n\\n</span>{trimmedComment}`;
      // ---------------------------------
      const messageBytes = new TextEncoder().encode(messageToSign);

      console.log('Attempting to sign message...');
      const signature = await signMessage(messageBytes); // Real signing call
      console.log('signMessage call succeeded in component.');

      const signatureBase64 = Buffer.from(signature).toString('base64');
      console.log("Signature received (Base64):", signatureBase64);
      setMessageStatus('Signature received! Posting comment...');

      const payload = { postId, text: trimmedComment, author: publicKey.toBase58(), signature: signatureBase64 };
      // Call server action (still has verification disabled inside)
      const result = await submitCommentAction(payload);

      if (result.success && result.newComment) {
        setComments(prev => [result.newComment!, ...prev]);
        setNewComment('');
        setSubmitStatus('Comment posted (verification skipped)!'); // Update message
        setMessageStatus('');
      } else {
        setSubmitStatus(`Error: ${result.error || 'Failed.'}`);
        setMessageStatus('');
      }
    } catch (error: unknown) { // Use unknown type
      console.error('[CommentSection] Error during handleSubmit:', error);
      let errorMsg = 'Submission failed.';
      // Safer type checking for error code
      const rejectedByUser = error instanceof Error && (error.message?.includes('User rejected') || (typeof error === 'object' && error !== null && 'code' in error && error.code === 4001));
      if (rejectedByUser) { errorMsg = 'Signature rejected in wallet.'; }
      else if (error instanceof Error) { errorMsg = error.message; }
      setSubmitStatus(`Error: ${errorMsg}`);
      setMessageStatus('');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(''), 5000);
    }
  }, [connected, publicKey, signMessage, newComment, postId]);

  // Keep formatTimestamp if displaying real comments later, otherwise remove
  const formatTimestamp = (isoString: string): string => { try { return new Date(isoString).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short'}); } catch { return isoString; } };

  return (
     <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
       <h2 className="text-2xl font-semibold mb-6 text-slate-800 dark:text-slate-200">Leave a Comment</h2>
       {!connected ? ( <div className="mb-8 p-4 flex flex-col items-center"> <WalletMultiButtonDynamic style={{ height: '38px', fontSize: '14px' }} /> <p className="text-sm text-slate-500 dark:text-slate-400 mt-2"> Connect your wallet to leave a comment. </p> </div> )
       : publicKey ? (
         <form onSubmit={handleSubmit} className="mb-8">
            <label htmlFor="comment-textarea" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Your Comment (Signed with Wallet):</label>
            <textarea id="comment-textarea" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Share your thoughts..." rows={4} required className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-slate-700 dark:text-slate-100 disabled:opacity-70" disabled={isSubmitting || !signMessage} />
            {!signMessage && <p className="text-xs text-red-500 mt-1">Warning: Your connected wallet may not support message signing.</p>}
            <div className="flex justify-between items-center mt-3 gap-4">
               {submitStatus && <p className="text-xs text-slate-500 dark:text-slate-400 flex-grow text-left italic">{submitStatus}</p>}
              <button type="submit" disabled={!publicKey || !signMessage || isSubmitting || !newComment.trim()} className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-semibold py-2 px-5 rounded-md shadow transition-colors disabled:cursor-not-allowed">
                {isSubmitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
             {messageStatus && ( <p className={`text-xs mt-2 text-orange-600 dark:text-orange-400 text-right`}> {messageStatus} </p> )}
         </form>
       ) : null }
       <h3 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">Comments ({comments.length})</h3>
       <div className="space-y-4">
          {/* Removed isLoading/loadingError checks */}
          {comments.length > 0 ? (
            comments.map(comment => (
              <div key={comment.id} className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
                <p className="text-slate-800 dark:text-slate-200 mb-2 whitespace-pre-wrap">{comment.text}</p>
                <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700 pt-2 mt-2">
                  <span className="font-mono break-all" title={comment.author}>By: {truncateAddress(comment.author)}</span>
                  {/* Use formatTimestamp */}
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