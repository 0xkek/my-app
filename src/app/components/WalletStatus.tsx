// src/components/WalletStatus.tsx (Corrected truncateAddress function)
'use client'; // Mark as Client Component

import { useWallet } from '@solana/wallet-adapter-react';
import React from 'react';

// Helper function to shorten the address
const truncateAddress = (address: string) => {
  if (!address) return '';
  // --- CORRECTED RETURN using template literal ---
  return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
  // ---------------------------------------------
};

export function WalletStatus() {
  // Use the hook to get wallet state
  const { connected, publicKey } = useWallet();

  // Render different message based on connection status
  return (
    <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-center text-sm">
      {connected && publicKey ? (
        <p className="text-green-600 dark:text-green-400 font-medium">
          {/* This call will now get the correct string */}
          Connected: <span className="font-mono">{truncateAddress(publicKey.toBase58())}</span>
        </p>
      ) : (
        <p className="text-slate-600 dark:text-slate-400">
          Please connect your wallet to interact with features.
        </p>
      )}
    </div>
  );
}