// src/actions/commentActions.ts (FINAL Corrected Version)
'use server';

import { kv } from '@vercel/kv';
import { PublicKey } from '@solana/web3.js';
import nacl from 'tweetnacl';
import { Buffer } from 'buffer';
import { revalidatePath } from 'next/cache';

// Export Comment type
export interface Comment {
  id: string;
  postId: string;
  author: string; // Base58 public key string
  timestamp: string; // ISO 8601 timestamp string
  text: string;
}

// Export SubmitResult type
export interface SubmitResult {
    success: boolean;
    error?: string;
    newComment?: Comment; // Optional 'newComment' on success
}

// Type for payload from client (internal)
interface SubmitPayload {
    postId: string;
    text: string;
    author: string;
    signature: string; // Base64 encoded signature
    message: string; // Original message that was signed
}


// --- Action to GET comments for a specific post ---
export async function getCommentsAction(postId: string): Promise<Comment[]> {
  if (!postId) {
    console.error("[getCommentsAction] Error: postId is required.");
    return [];
  }
  try {
    // Fetch all comments from the list for this post ID
    const comments = await kv.lrange<Comment>(`comments:${postId}`, 0, -1);
    console.log(`[getCommentsAction] Fetched ${comments?.length ?? 0} comments for ${postId}`);
    // Reverse locally if you want newest first (lpush adds to left/head)
    return comments?.reverse() || [];
  } catch (error) {
    console.error(`[getCommentsAction] Error fetching comments for post ${postId}:`, error);
    return [];
  }
}

// --- Action to SUBMIT a new comment ---
export async function submitCommentAction(payload: SubmitPayload): Promise<SubmitResult> {
  console.log("[submitCommentAction] Received payload for post:", payload.postId);

  // --- Input Validation ---
  if (!payload.postId || !payload.text || !payload.author || !payload.signature || !payload.message) {
    console.warn("[submitCommentAction] Validation failed: Missing required fields.");
    return { success: false, error: "Missing required fields." };
  }
  const trimmedText = payload.text.trim();
  if (!trimmedText) {
      console.warn("[submitCommentAction] Validation failed: Comment empty.");
      return { success: false, error: "Comment text cannot be empty."};
  }
  if (trimmedText.length > 1000) {
      console.warn("[submitCommentAction] Validation failed: Comment too long.");
      return { success: false, error: "Comment text exceeds 1000 characters." };
  }
  try {
      new PublicKey(payload.author); // Validate pubkey format
  } catch (e) {
      console.error("[submitCommentAction] Invalid author public key format for:", payload.author, "Error:", e);
      return { success: false, error: "Invalid author public key format." };
  }
  // --- End Validation ---

  try {
    // --- Signature Verification using tweetnacl ---
    console.log("[submitCommentAction] Verifying signature using tweetnacl...");
    const messageBytes = new TextEncoder().encode(payload.message); // Use message from payload
    const signatureBytes = Buffer.from(payload.signature, 'base64');
    const publicKeyBytes = new PublicKey(payload.author).toBytes();

    const isVerified = nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);

    if (!isVerified) {
      console.warn("[submitCommentAction] Signature verification FAILED!");
      return { success: false, error: "Signature verification failed. Comment not saved." };
    }
    console.log("[submitCommentAction] Signature verified successfully!");
    // --- End Signature Verification ---

    // --- Create and Store Comment ---
    const commentToStore: Comment = {
      id: crypto.randomUUID(), // Use crypto.randomUUID for better uniqueness
      postId: payload.postId,
      author: payload.author,
      text: trimmedText, // Store trimmed version
      timestamp: new Date().toISOString(),
    };

    // Add comment to the START of the list associated with the post ID
    await kv.lpush<Comment>(`comments:${payload.postId}`, commentToStore);
    console.log("[submitCommentAction] Comment saved successfully:", commentToStore.id);

    // Revalidate the path so the list updates for others
    revalidatePath(`/blog/${payload.postId}`);

    // Return success and the new comment object
    return { success: true, newComment: commentToStore }; // Use correct property name

  } catch (error) {
    console.error("[submitCommentAction] Error during submission:", error);
    return { success: false, error: "Failed to save comment due to a server error." };
  }
}