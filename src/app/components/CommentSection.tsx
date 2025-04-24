// src/components/CommentSection.tsx (FINAL - Fixing Syntax Errors)
'use client';

import React, { useState, useCallback, FormEvent, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import dynamic from 'next/dynamic';
import { Buffer } from 'buffer';
// Import actions AND types correctly
import { getCommentsAction, submitCommentAction, Comment, SubmitResult, GetCommentsResult } from '../../actions/commentActions'; // Adjust path if needed

const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

// Helper functions
const truncateAddress = (address: string | undefined | null): string => { if (!address) return ''; return `${address.substring(0,4)}...${address.substring(address.length - 4)}`; };
const formatTimestamp = (isoString: string): string => { try { return new Date(isoString).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short'}); } catch { return isoString; } };

interface CommentSectionProps { postId: string; }

const COMMENTS_PER_PAGE = 5; // Load 5 comments at a time

export function CommentSection({ postId }: CommentSectionProps) {
  const { connected, publicKey, signMessage } = useWallet();
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true); // For initial load
  const [isLoadingMore, setIsLoadingMore] = useState(false); // Separate state for loading more
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [totalCommentCount, setTotalCommentCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [messageStatus, setMessageStatus] = useState<string>('');

  // useEffect Hook for INITIAL comment load
  // Depends ONLY on postId
  useEffect(() => {
    const fetchInitialComments = async () => {
      if (!postId) { setIsLoadingComments(false); return; }
      setIsLoadingComments(true); setLoadingError(null); setComments([]);
      setTotalCommentCount(0); setHasMore(false);
      console.log(`[CommentSection] useEffect: Fetching initial comments for ${postId}`);
      try {
          const result: GetCommentsResult = await getCommentsAction(postId, 0, COMMENTS_PER_PAGE);
          setComments(result.comments);
          setTotalCommentCount(result.totalCount);
          setHasMore(result.comments.length < result.totalCount);
          console.log(`[CommentSection] useEffect: Received ${result.comments.length}/${result.totalCount}. HasMore: ${result.comments.length < result.totalCount}`);
      } catch (err) { console.error("[CommentSection] useEffect: Error fetching comments:", err); setLoadingError('Failed to load comments.'); }
      finally { setIsLoadingComments(false); }
    };
    fetchInitialComments();
  }, [postId]); // Only depends on postId


  // handleLoadMore - Fetch next batch
  // Wrapped in useCallback, depends on postId, comments, isLoadingMore, totalCommentCount, hasMore
  const handleLoadMore = useCallback(async () => {
      if (!postId || isLoadingMore || !hasMore) return;
      setIsLoadingMore(true); setLoadingError(null);
      const currentOffset = comments.length;
      console.log(`[CommentSection] handleLoadMore: Loading more for ${postId}, offset: ${currentOffset}`);
      try {
          const result: GetCommentsResult = await getCommentsAction(postId, currentOffset, COMMENTS_PER_PAGE);
          const fetchedComments = result.comments || [];
          const totalCount = result.totalCount || 0;
          setComments(prev => [...prev, ...fetchedComments]);
          setTotalCommentCount(totalCount);
          const newTotalLoaded = comments.length + fetchedComments.length;
          setHasMore(newTotalLoaded < totalCount);
          console.log(`[CommentSection] handleLoadMore: Received ${fetchedComments.length}. Total loaded: ${newTotalLoaded}. Total available: ${totalCount}. HasMore: ${newTotalLoaded < totalCount}`);
      } catch (err) { console.error("[CommentSection] handleLoadMore: Error loading more comments:", err); setLoadingError('Failed to load more comments.'); }
      finally { setIsLoadingMore(false); }
  }, [postId, comments, isLoadingMore, hasMore, totalCommentCount]); // Correct dependencies


  // handleSubmit function
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
      const result: SubmitResult = await submitCommentAction(payload);

      if (result.success && result.newComment !== undefined) {
        const newlySavedComment: Comment = result.newComment;
        setComments(prev => [newlySavedComment, ...prev]);
        setTotalCommentCount(prev => prev + 1);
        setNewComment('');
        setSubmitStatus('Comment posted successfully!');
        setMessageStatus('');
        setHasMore(comments.length + 1 < totalCommentCount + 1);
      } else { throw new Error(result.error || 'Failed.'); }
    } catch (error: unknown) {
      console.error('[CommentSection] Error during handleSubmit:', error);
      let errorMsg = 'Submission failed.';
      if (error instanceof Error) {
        const rejected = error.message?.includes('User rejected') || (typeof error === 'object' && error !== null && 'code' in error && error.code === 4001);
        if (rejected) { errorMsg = 'Signature rejected.'; } else { errorMsg = error.message; }
      }
      setSubmitStatus(`Error: ${errorMsg}`);
      setMessageStatus('');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(''), 5000);
    }
  // Ensure all dependencies are correct and syntax is valid
  }, [connected, publicKey, signMessage, newComment, postId, comments.length, totalCommentCount]); // Removed loadComments dependency


  // --- Full JSX Structure ---
  return (
    <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
      <h2 className="text-2xl font-semibold mb-6 text-slate-800 dark:text-slate-200">Leave a Comment</h2>
      {!connected ? (
         <div className="mb-8 p-4 flex flex-col items-center">
           <WalletMultiButtonDynamic style={{ height: '38px', fontSize: '14px' }} />
           <p className="text-sm text-slate-500 dark:text-slate-400 mt-2"> Connect your wallet to leave a comment. </p>
         </div>
       ) : publicKey ? (
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

       <h3 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">Comments ({isLoadingComments && comments.length === 0 ? '...' : totalCommentCount})</h3>
       <div className="space-y-4">
          {/* Initial Loading State */}
          {isLoadingComments && comments.length === 0 && <p className="text-slate-500 dark:text-slate-400 italic">Loading comments...</p>}
          {/* Loading Error State */}
          {loadingError && <p className="text-red-500 italic">{loadingError}</p>}
          {/* Comment List */}
          {!loadingError && comments.map(comment => {
              // Use standard truncateAddress function
              return (
                <div key={comment.id} className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
                  <p className="text-slate-800 dark:text-slate-200 mb-2 whitespace-pre-wrap">{comment.text}</p>
                  <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700 pt-2 mt-2">
                    <span className="font-mono break-all" title={comment.author}>By: {truncateAddress(comment.author)}</span>
                    <span className="whitespace-nowrap">{formatTimestamp(comment.timestamp)}</span>
                  </div>
                </div>
              );
          })}
          {/* Empty State */}
          {!isLoadingComments && !loadingError && comments.length === 0 && totalCommentCount === 0 && (
              <p className="text-slate-500 dark:text-slate-400 italic">Be the first to comment!</p>
          )}
        </div>

        {/* Load More Button */}
        {!isLoadingMore && hasMore && ( // Check isLoadingMore here
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={handleLoadMore} // Use the specific handler
              className="text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50"
              disabled={isLoadingMore} // Disable while loading more
            >
              Load More Comments
            </button>
          </div>
        )}
        {/* Show separate indicator when loading MORE comments */}
        {isLoadingMore && <p className="text-slate-500 dark:text-slate-400 italic text-center mt-4">Loading more...</p>}

         {/* Message Status Display (moved outside form) */}
        {/* {messageStatus && ( <p className={`text-xs mt-4 ...`}> {messageStatus} </p> )} */}
     </div>
  ); // Final closing brace and parenthesis for return
} // Final closing brace for component function
