// src/components/WalletStatus.tsx (Fetching and displaying SOL balance)
'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react'; // Import useConnection
import React, { useState, useCallback, useEffect } from 'react'; // Import useEffect, useState
import { Buffer } from 'buffer';
import { LAMPORTS_PER_SOL } from '@solana/web3.js'; // Import constant for conversion

// Helper function to shorten the address
const truncateAddress = (address: string) => {
  if (!address) return '';
  const start = address.substring(0, 4);
  const end = address.substring(address.length - 4);
  return start + '...' + end;
};

export function WalletStatus() {
  // Get connection and wallet objects
  const { connection } = useConnection();
  const { connected, publicKey, signMessage } = useWallet();

  // State for balance and loading/error status
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [balanceError, setBalanceError] = useState('');

  // State for sign message feedback
  const [messageStatus, setMessageStatus] = useState<string>('');

  // --- Effect Hook to Fetch Balance ---
  useEffect(() => {
    // Only fetch if connected, publicKey and connection are available
    if (connected && publicKey && connection) {
      setIsLoadingBalance(true);
      setBalanceError('');
      setBalance(null); // Reset balance initially

      const fetchBalance = async () => {
        try {
          // Fetch balance in lamports
          const lamports = await connection.getBalance(publicKey);
          // Convert lamports to SOL (1 SOL = 1,000,000,000 Lamports)
          const solBalance = lamports / LAMPORTS_PER_SOL;
          setBalance(solBalance);
        } catch (error) {
          console.error('Failed to get balance:', error);
          setBalanceError('Could not fetch balance');
        } finally {
          setIsLoadingBalance(false);
        }
      };

      fetchBalance();
    } else {
      // Reset balance if disconnected
      setBalance(null);
      setIsLoadingBalance(false);
      setBalanceError('');
    }
  }, [connected, publicKey, connection]); // Re-run effect if these change
  // ------------------------------------

  // Function to handle sign message (remains the same)
  const handleSignMessage = useCallback(async () => {
     // ... (sign message logic) ...
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
    // Increased bottom padding slightly
    <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-center text-sm space-y-3 pb-5">
      {connected && publicKey ? (
        <>
          <p className="text-green-600 dark:text-green-400 font-medium">
            Connected: <span className="font-mono text-xs">{truncateAddress(publicKey.toBase58())}</span>
          </p>

          {/* --- Display Balance --- */}
          <div className="text-xs text-slate-600 dark:text-slate-400">
            {isLoadingBalance && <span>Loading balance...</span>}
            {balanceError && <span className="text-red-500">{balanceError}</span>}
            {balance !== null && !isLoadingBalance && !balanceError && (
              <span>Balance: {balance.toFixed(4)} SOL</span> // Show SOL balance, formatted
            )}
          </div>
          {/* --------------------- */}

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