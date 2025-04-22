// src/actions/commentActions.ts (FULL CODE - using tweetnacl, fixing _e lint error)
'use server';

import { kv } from '@vercel/kv'; // Vercel KV client SDK
import { PublicKey } from '@solana/web3.js'; // For validating public key
import nacl from 'tweetnacl'; // Use tweetnacl for verification
import { Buffer } from 'buffer'; // Needed for handling byte arrays

// Comment type definition (Exporting for use in client)
export interface Comment {
  id: string;        // Unique ID for the comment
  postId: string;    // Slug of the post it belongs to
  author: string;    // Base58 public key string of the commenter
  timestamp: string; // ISO 8601 timestamp string
  text: string;      // The comment content
}

// --- Action to GET comments for a specific post ---
export async function getCommentsAction(postId: string): Promise<Comment[]> {
  if (!postId) {
    console.error("[getCommentsAction] Error: postId is required.");
    return []; // Return empty if no postId provided
  }
  try {
    // Comments for a post are stored as a Redis List
    // Key is "comments:[postId]" (e.g., "comments:my-first-post")
    const comments = await kv.lrange<Comment>(`comments:${postId}`, 0, -1);
    console.log(`[getCommentsAction] Fetched ${comments?.length ?? 0} comments for ${postId}`);
    return comments || []; // Return the array or empty if null/not found
  } catch (error) {
    console.error(`[getCommentsAction] Error fetching comments for post ${postId}:`, error);
    return []; // Return empty array on error
  }
}

// --- Action to SUBMIT a new comment ---

// Type for the data expected from the client
interface SubmitPayload {
    postId: string;
    text: string;
    author: string; // Base58 public key string
    signature: string; // Base64 encoded signature string from signMessage
}

// Exporting SubmitResult type for use in client component
export interface SubmitResult {
    success: boolean;
    error?: string;
    newComment?: Comment; // Return the created comment on success
}

export async function submitCommentAction(payload: SubmitPayload): Promise<SubmitResult> {
  console.log("[submitCommentAction] Received payload:", payload);

  // --- Input Validation ---
  if (!payload.postId || !payload.text || !payload.author || !payload.signature) {
    console.warn("[submitCommentAction] Validation failed: Missing required data.");
    return { success: false, error: "Missing required comment data." };
  }
  const trimmedText = payload.text.trim();
  if (!trimmedText) {
      console.warn("[submitCommentAction] Validation failed: Comment text empty.");
      return { success: false, error: "Comment text cannot be empty."};
  }
  if (trimmedText.length > 1000) { // Example length limit
      console.warn("[submitCommentAction] Validation failed: Comment too long.");
      return { success: false, error: "Comment text exceeds 1000 characters." };
  }
  try {
      // Validate public key format before using it
      new PublicKey(payload.author);
  } catch (e) { // Changed _e to e and log it
      console.error("[submitCommentAction] Invalid author public key format for:", payload.author, "Error:", e);
      return { success: false, error: "Invalid author public key format." };
  }
  // --- End Validation ---

  try {
    // --- Signature Verification using tweetnacl ---
    console.log("[submitCommentAction] Verifying signature using tweetnacl...");
    // Ensure this message EXACTLY matches the one signed on the client
    const messageToVerify = `Comment on post "${payload.postId}":\n\n${payload.text}`;
    const messageBytes = new TextEncoder().encode(messageToVerify);
    const publicKeyBytes = new PublicKey(payload.author).toBytes();
    const signatureBytes = Buffer.from(payload.signature, 'base64');

    const isVerified = nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);

    if (!isVerified) {
      console.warn("[submitCommentAction] Signature verification FAILED!");
      // Log details for debugging mismatch
      console.log("Message Signed (bytes):", messageBytes);
      console.log("Signature (bytes):", signatureBytes);
      console.log("PublicKey (bytes):", publicKeyBytes);
      return { success: false, error: "Signature verification failed. Comment not saved." };
    }
    console.log("[submitCommentAction] Signature verified successfully!");
    // --- End Signature Verification ---


    // --- If verified, create and store the comment ---
    const commentToStore: Comment = {
      id: `cmt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      postId: payload.postId,
      author: payload.author,
      text: trimmedText, // Store the trimmed version
      timestamp: new Date().toISOString(),
    };

    await kv.lpush<Comment>(`comments:${payload.postId}`, commentToStore);
    console.log("[submitCommentAction] Comment saved successfully to Vercel KV:", commentToStore.id);
    return { success: true, newComment: commentToStore };
    // --- End Store comment ---

  } catch (error) { // Catch any other errors during verification or KV saving
    console.error("[submitCommentAction] Error during submission:", error);
    return { success: false, error: "Failed to save comment due to a server error." };
  }
}