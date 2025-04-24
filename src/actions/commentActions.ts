// src/actions/commentActions.ts (FINAL CORRECTED VERSION - Exports Types, Accepts Offset/Limit)
'use server';

import { kv } from '@vercel/kv'; // Vercel KV client
import { PublicKey } from '@solana/web3.js'; // For validating public key
import nacl from 'tweetnacl'; // Using tweetnacl for verification
import { Buffer } from 'buffer'; // For handling signature bytes from base64
import { revalidatePath } from 'next/cache'; // For updating cached pages

// ---- SHARED TYPES ----

// Exporting Comment type for use in client components
export interface Comment {
  id: string;        // Unique ID for the comment
  postId: string;    // Slug of the post it belongs to
  author: string;    // Base58 public key string of the commenter
  timestamp: string; // ISO 8601 timestamp string (e.g., new Date().toISOString())
  text: string;      // The comment content
}

// Exporting SubmitResult type for use in client components
export interface SubmitResult {
    success: boolean;
    error?: string;
    newComment?: Comment; // Return the created comment on success
}

// Exporting GetCommentsResult type for use in client components
export interface GetCommentsResult {
    comments: Comment[]; // The array of comments for the current page
    totalCount: number;  // Total number of comments for the post
}

// Type for the payload coming from the client for submission (internal use)
interface SubmitPayload {
    postId: string;
    text: string;
    author: string;     // Base58 public key string
    signature: string;  // Base64 encoded signature string
    message: string;    // Original message string that was signed
}


// --- SERVER ACTION: Get Comments (with pagination) ---
// Accepts offset and limit parameters
export async function getCommentsAction(
    postId: string,
    offset: number = 0, // Default offset (start index)
    limit: number = 5     // Default number of comments per "page"
): Promise<GetCommentsResult> {
  const functionName = "[getCommentsAction]"; // For logging context
  if (!postId) {
    console.error(`${functionName} Error: postId is required.`);
    return { comments: [], totalCount: 0 }; // Return empty result
  }
  console.log(`${functionName} Fetching for ${postId}, offset: ${offset}, limit: ${limit}`);

  try {
    const listKey = `comments:${postId}`; // Key for the Redis List holding comment JSON strings

    // Use pipeline to get total count and the requested range efficiently
    const pipeline = kv.pipeline();
    pipeline.llen(listKey); // Get total number of items in the list
    // Fetch the specific range (page) of comments
    pipeline.lrange(listKey, offset, offset + limit - 1); // Get the specific range

    // KV returns [totalCount, arrayOfParsedObjectsOrNulls]
    const [totalCountResult, rawComments] = await pipeline.exec<[number | null, (Comment | null)[] | null]>();

    const totalCount = totalCountResult ?? 0;
    console.log(`${functionName} Total comments found: ${totalCount}`);

    if (!rawComments || rawComments.length === 0) {
      return { comments: [], totalCount: totalCount }; // No comments in this range
    }
    console.log(`${functionName} Fetched ${rawComments.length} raw comment entries.`);

    // Filter out nulls directly (kv.lrange<Comment> already attempted parsing)
    const comments: Comment[] = rawComments.filter((comment): comment is Comment => comment !== null);

    // LPUSH adds to head, LRANGE reads from head. Already newest first.
    console.log(`${functionName} Returning ${comments.length} successfully parsed comments.`);
    return { comments: comments, totalCount: totalCount };

  } catch (error) {
    console.error(`${functionName} Error fetching comments for post ${postId}:`, error);
    return { comments: [], totalCount: 0 }; // Return empty on error
  }
}


// --- SERVER ACTION: Submit a new comment ---
export async function submitCommentAction(payload: SubmitPayload): Promise<SubmitResult> {
  const functionName = "[submitCommentAction]"; // For logging context
  console.log(`${functionName} Received payload for post:`, payload.postId);

  // --- 1. Input Validation ---
  if (!payload.postId || !payload.text || !payload.author || !payload.signature || !payload.message) {
    console.warn(`${functionName} Validation failed: Missing required fields.`);
    return { success: false, error: "Missing required fields." };
  }
  const trimmedText = payload.text.trim();
  if (!trimmedText) {
      console.warn(`${functionName} Validation failed: Comment text empty.`);
      return { success: false, error: "Comment text cannot be empty."};
  }
  if (trimmedText.length > 1000) { // Example length limit
      console.warn(`${functionName} Validation failed: Comment too long.`);
      return { success: false, error: "Comment text exceeds 1000 characters." };
  }
  try {
      new PublicKey(payload.author); // Validate pubkey format is valid Base58
  } catch (e) {
      console.error(`${functionName} Invalid author public key format for:`, payload.author, "Error:", e);
      return { success: false, error: "Invalid author public key format." };
  }
  // --- End Validation ---

  try {
    // --- 2. Signature Verification using tweetnacl ---
    console.log(`${functionName} Verifying signature using tweetnacl...`);
    // Ensure the message verified EXACTLY matches the message signed on client
    const messageBytes = new TextEncoder().encode(payload.message);
    const signatureBytes = Buffer.from(payload.signature, 'base64');
    const publicKeyBytes = new PublicKey(payload.author).toBytes();

    // Verify using tweetnacl (synchronous)
    const isVerified = nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);

    if (!isVerified) {
      console.warn(`${functionName} Signature verification FAILED!`);
      return { success: false, error: "Signature verification failed. Comment not saved." };
    }
    console.log(`${functionName} Signature verified successfully!`);
    // --- End Signature Verification ---


    // --- 3. Create and Store Comment ---
    const commentToStore: Comment = {
      id: crypto.randomUUID(), // Use built-in crypto for unique IDs
      postId: payload.postId,
      author: payload.author,
      text: trimmedText, // Store the trimmed version
      timestamp: new Date().toISOString(), // Use standard ISO string format
    };

    // Store the STRINGIFIED comment object in the list
    await kv.lpush(`comments:${payload.postId}`, JSON.stringify(commentToStore));
    console.log(`${functionName} Comment saved successfully to Vercel KV:`, commentToStore.id);

    // --- 4. Revalidate Path Cache ---
    revalidatePath(`/blog/${payload.postId}`);
    revalidatePath('/blog');

    // --- 5. Return Success ---
    return { success: true, newComment: commentToStore }; // Return the saved comment

  } catch (error) { // Catch any errors during verification or KV saving
    console.error(`${functionName} Error during submission:`, error);
    return { success: false, error: "Failed to save comment due to a server error." };
  }
}
