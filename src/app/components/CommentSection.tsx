// src/components/CommentSection.tsx (FIXED)
'use client';

import React, { useState, useCallback, FormEvent, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import dynamic from 'next/dynamic';
import { Buffer } from 'buffer';
// Import actions AND the exported types correctly
import { getCommentsAction, submitCommentAction, Comment, SubmitResult } from '../../actions/commentActions'; // Ensure path is correct

const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

// Helper functions - FIXED truncateAddress function
const truncateAddress = (address: string | undefined | null): string => { 
  if (!address) return ''; 
  return `${address.substring(0,4)}...${address.substring(address.length - 4)}`; 
};

const formatTimestamp = (isoString: string): string => { 
  try { 
    return new Date(isoString).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short'}); 
  } catch { 
    return isoString; 
  } 
};

interface CommentSectionProps { postId: string; }

export function CommentSection({ postId }: CommentSectionProps) {
  const { connected, publicKey, signMessage } = useWallet();
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [messageStatus, setMessageStatus] = useState<string>('');

  // Function to load comments
  const loadComments = useCallback(async () => {
      if (!postId) return;
      setIsLoadingComments(true); setLoadingError(null);
      console.log(`[CommentSection] Fetching comments for ${postId}`);
      try {
          const fetchedComments = await getCommentsAction(postId);
          setComments(fetchedComments);
          console.log(`[CommentSection] Received ${fetchedComments.length} comments.`);
      } catch (err) {
          console.error("[CommentSection] Error fetching comments:", err);
          setLoadingError('Failed to load comments.');
      } finally {
          setIsLoadingComments(false);
      }
  }, [postId]);

  // Load comments on initial mount
  useEffect(() => {
    loadComments();
  }, [loadComments]); // Use loadComments function in dependency array


  // Handle comment submission
  const handleSubmit = useCallback(async (event: FormEvent) => {
    event.preventDefault();
    const trimmedComment = newComment.trim();
    if (!connected || !publicKey || !signMessage || !trimmedComment) { return; }
    setIsSubmitting(true); setSubmitStatus(''); setMessageStatus('Please sign message...');

    try {
      const messageToSign = `Comment on post "${postId}":\n\n${trimmedComment}`;
      const messageBytes = new TextEncoder().encode(messageToSign);
      const signature = await signMessage(messageBytes);
      const signatureBase64 = Buffer.from(signature).toString('base64');
      setMessageStatus('Signature received! Posting comment...');
      const payload = { postId, text: trimmedComment, author: publicKey.toBase58(), signature: signatureBase64, message: messageToSign };
      const result: SubmitResult = await submitCommentAction(payload); // Call action

      // --- Corrected Handling of SubmitResult ---
      if (result.success && result.newComment !== undefined) { // Explicitly check if newComment is not undefined
        console.log('[CommentSection] submitCommentAction succeeded');
        const newlySavedComment: Comment = result.newComment; // Assign to typed variable first
        setComments(prev => [newlySavedComment, ...prev]); // Use the typed variable
        setNewComment('');
        setSubmitStatus('Comment posted successfully!');
        setMessageStatus('');
        // Optionally reload comments explicitly after success
        // loadComments();
      } else {
        // Throw error using the message from the server action result
        throw new Error(result.error || 'Failed to post comment.');
      }
      // -----------------------------------------

    } catch (error: unknown) {
      console.error('[CommentSection] Error during handleSubmit:', error);
      let errorMsg = 'Submission failed.';
      // Safer type checking for error rejection/message
      if (error instanceof Error) {
        const rejected = error.message?.includes('User rejected') || (typeof error === 'object' && error !== null && 'code' in error && error.code === 4001);
        if (rejected) { errorMsg = 'Signature rejected.'; }
        else { errorMsg = error.message; }
      }
      setSubmitStatus(`Error: ${errorMsg}`);
      setMessageStatus('');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(''), 5000);
    }
  }, [connected, publicKey, signMessage, newComment, postId, loadComments]); // Added loadComments to dependencies

  // --- Full JSX Structure ---
  return (
    <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
      <h2 className="text-2xl font-semibold mb-6 text-slate-800 dark:text-slate-200">Leave a Comment</h2>
      {!connected ? (
         <div className="mb-8 p-4 flex flex-col items-center">
           <WalletMultiButtonDynamic style={{ height: '38px', fontSize: '14px' }} />
           <p className="text-sm text-slate-500 dark:text-slate-400 mt-2"> Connect your wallet to leave a comment. </p>
         </div>
       ) : publicKey ? ( // Check publicKey existence
         <form onSubmit={handleSubmit} className="mb-8">
            <label htmlFor="comment-textarea" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Your Comment (Signed):</label>
            <textarea id="comment-textarea" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Share your thoughts..." rows={4} required className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-slate-700 dark:text-slate-100 disabled:opacity-70" disabled={isSubmitting || !signMessage}/>
            {!signMessage && <p className="text-xs text-red-500 mt-1">Warning: Wallet may not support signing.</p>}
            <div className="flex justify-between items-center mt-3 gap-4">
              {submitStatus && <p className="text-xs text-slate-500 dark:text-slate-400 flex-grow text-left italic">{submitStatus}</p>}
              <button type="submit" disabled={isSubmitting || !newComment.trim() || !signMessage} className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-semibold py-2 px-5 rounded-md shadow transition-colors disabled:cursor-not-allowed">
                {isSubmitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
             {messageStatus && ( <p className={`text-xs mt-2 text-orange-600 dark:text-orange-400 text-right`}> {messageStatus} </p> )}
         </form>
       ) : null }
       <h3 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">Comments ({isLoadingComments ? '...' : comments.length})</h3>
       <div className="space-y-4">
          {isLoadingComments && <p className="text-slate-500 dark:text-slate-400 italic">Loading comments...</p>}
          {loadingError && <p className="text-red-500 italic">{loadingError}</p>}
          {!isLoadingComments && !loadingError && (
              comments.length > 0 ? ( comments.map(comment => (
                <div key={comment.id} className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
                  <p className="text-slate-800 dark:text-slate-200 mb-2 whitespace-pre-wrap">{comment.text}</p>
                  <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700 pt-2 mt-2">
                    <span className="font-mono break-all" title={comment.author}>By: {truncateAddress(comment.author)}</span>
                    <span className="whitespace-nowrap">{formatTimestamp(comment.timestamp)}</span>
                  </div>
                </div>
              )))
              : ( <p className="text-slate-500 dark:text-slate-400 italic">Be the first to comment!</p> )
          )}
        </div>
    </div>
  );
}