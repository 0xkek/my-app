// src/components/WalletStatus.tsx (Using string concatenation for truncation)
'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import React, { useState, useCallback } from 'react';
import { Buffer } from 'buffer';

// Helper function - Changed return statement
const truncateAddress = (address: string) => {
  if (!address) return '';
  const start = address.substring(0, 4);
  const end = address.substring(address.length - 4);
  // --- Use simple concatenation ---
  return start + '...' + end;
  // ------------------------------
};

export function WalletStatus() {
  const { connected, publicKey, signMessage } = useWallet();
  const [messageStatus, setMessageStatus] = useState<string>('');

  const handleSignMessage = useCallback(async () => {
    // ... sign message logic remains the same ...
     setMessageStatus('');
     if (!publicKey || !signMessage) {
       setMessageStatus('Wallet not connected or does not support message signing.');
       return;
     }
     try {
       const message = new TextEncoder().encode(
         'Hello from smoothbrain.xyz! Please sign this message to verify ownership.'
       );
       const signature = await signMessage(message);
       console.log("Signature:", Buffer.from(signature).toString('base64'));
       setMessageStatus('Message Signed Successfully!');
     } catch (error: any) {
       console.error('Error signing message:', error);
       setMessageStatus(`Sign Message Failed: ${error.message}`);
     }
  }, [publicKey, signMessage]);

  return (
    <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-center text-sm space-y-3">
      {connected && publicKey ? (
        <>
          <p className="text-green-600 dark:text-green-400 font-medium">
            {/* --- Use the helper function again --- */}
            Connected: <span className="font-mono text-xs">{truncateAddress(publicKey.toBase58())}</span>
            {/* ------------------------------------ */}
          </p>
          <button
            onClick={handleSignMessage}
            disabled={!signMessage}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white text-xs font-semibold py-1.5 px-3 rounded-md shadow-sm transition-colors disabled:cursor-not-allowed"
          >
            Sign Message
          </button>
          {messageStatus && (
            <p className={`text-xs ${messageStatus.startsWith('Error') || messageStatus.startsWith('Sign Message Failed') ? 'text-red-500' : 'text-green-500'}`}>
              {messageStatus}
            </p>
          )}
        </>
      ) : (
        <p className="text-slate-600 dark:text-slate-400">
          Please connect your wallet to interact with features.
        </p>
      )}
    </div>
  );
}