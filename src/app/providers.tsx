// src/app/providers.tsx (Restoring Solflare, autoConnect=false - From response #239)
'use client';

import React, { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
// Import both adapters again
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

// Make sure styles are imported
import '@solana/wallet-adapter-react-ui/styles.css';

export function Providers({ children }: { children: React.ReactNode }) {
  // Set network to Devnet
  const network = WalletAdapterNetwork.Devnet;
  // Derive endpoint based on network
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // --- Restore both wallets in the list ---
  const wallets = useMemo(
    () => [
        new PhantomWalletAdapter(),
        new SolflareWalletAdapter({ network }), // Added back Solflare
    ],
    [network] // Network dependency needed for Solflare adapter config
  );
  // ---------------------------------------

  return (
    <ConnectionProvider endpoint={endpoint}>
      {/* --- Keep autoConnect false --- */}
      <WalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}