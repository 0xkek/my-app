// src/actions/commentActions.ts (Re-enabling Verification)
'use server';

import { kv } from '@vercel/kv';
import { revalidatePath } from 'next/cache';
import nacl from 'tweetnacl';
import { Buffer } from 'buffer'; // Use Buffer for decoding
import { PublicKey } from '@solana/web3.js'; // Use PublicKey for validation

// Define Comment type (used by client and server)
export type Comment = {
  id: string;
  postId: string;
  author: string; // Wallet public key (base58)
  text: string;
  timestamp: string; // ISO string
};

// Type for the payload coming from the client
type SubmitCommentPayload = {
  postId: string;
  text: string;
  author: string; // base58 public key
  signature: string; // base64 encoded signature
  message: string; // Original message that was signed
};

// Get comments for a post
export async function getCommentsAction(postId: string): Promise<Comment[]> {
  try {
    const commentIds = await kv.zrange(`comments:${postId}`, 0, -1, { rev: true });
    if (!commentIds || commentIds.length === 0) {
      return [];
    }
    // Use pipeline for efficient fetching if many comments are expected
    const pipeline = kv.pipeline();
    commentIds.forEach(id => pipeline.hgetall(`comment:${id}`));
    const results = await pipeline.exec<Comment[]>();
    // Filter out potential null results if a comment was deleted between zrange and hgetall
    return results.filter((comment): comment is Comment => comment !== null);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return []; // Return empty array on error
  }
}

// Submit a new comment
export async function submitCommentAction(
  payload: SubmitCommentPayload
): Promise<{ success: boolean; comment?: Comment; error?: string }> {
  const { postId, text, author, signature, message } = payload;

  // --- 1. Input Validation ---
  if (!postId || !text || !author || !signature || !message) {
    return { success: false, error: 'Missing required fields.' };
  }
  if (text.length > 500) { // Example length limit
    return { success: false, error: 'Comment text exceeds maximum length.' };
  }
  try {
     // Validate author is a valid Solana public key address
     new PublicKey(author);
  } catch (e) {
     console.error("Invalid author public key format:", author, e);
     return { success: false, error: 'Invalid author public key.' };
  }


  // --- 2. Signature Verification ---
  try {
    const messageBytes = new TextEncoder().encode(message);
    const signatureBytes = Buffer.from(signature, 'base64'); // Decode base64 signature
    const publicKeyBytes = new PublicKey(author).toBytes(); // Get public key bytes

    // Verify using tweetnacl
    const isVerified = nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);

    if (!isVerified) {
      console.warn("Signature verification failed for author:", author);
      return { success: false, error: 'Signature verification failed.' };
    }
    console.log("Signature verified successfully for:", author);

  } catch (error) {
    console.error("Error during signature verification:", error);
    return { success: false, error: 'An error occurred during signature verification.' };
  }

  // --- 3. Create and Save Comment ---
  try {
    const newComment: Comment = {
      id: crypto.randomUUID(), // Generate unique ID
      postId: postId,
      author: author,
      text: text,
      timestamp: new Date().toISOString(), // Use ISO string for consistency
    };

    // Use Vercel KV to store the comment
    // Store the comment hash
    await kv.hset(`comment:${newComment.id}`, newComment);
    // Add comment ID to the sorted set for the post (score by timestamp)
    await kv.zadd(`comments:${postId}`, { score: Date.now(), member: newComment.id });

    console.log(`Comment ${newComment.id} saved for post ${postId}`);

    // --- 4. Revalidation (Optional but recommended) ---
    // Revalidate the blog post page cache so others see the new comment sooner
    revalidatePath(`/blog/${postId}`);

    // --- 5. Return Success ---
    return { success: true, comment: newComment };

  } catch (error) {
    console.error("Error saving comment to KV:", error);
    return { success: false, error: 'Failed to save comment.' };
  }
}