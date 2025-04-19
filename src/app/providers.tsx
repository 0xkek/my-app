// src/app/providers.tsx
'use client'; // Mark this component as a Client Component

import React, { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
// Import adapters for the wallets you want to support
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

// Import the styles for the pre-built UI components
import '@solana/wallet-adapter-react-ui/styles.css';

export function Providers({ children }: { children: React.ReactNode }) {
  // Set the network (devnet, testnet, or mainnet-beta)
  // Use devnet for development!
  const network = WalletAdapterNetwork.Devnet;

  // Use Solana's clusterApiUrl to get a public RPC endpoint
  // OR use a custom RPC endpoint from services like Helius, QuickNode, Triton, etc.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  // Example using a custom endpoint (replace with your actual endpoint if you have one)
  // const endpoint = 'YOUR_CUSTOM_RPC_ENDPOINT_HERE';

  // Define the list of wallets you want to support
  const wallets = useMemo(
    () => [
        new PhantomWalletAdapter(),
        new SolflareWalletAdapter({ network }),
        // Add others like: new BackpackWalletAdapter(), new LedgerWalletAdapter(), ...
    ],
    [network] // Dependency array includes network if wallets depend on it
  );

  return (
    // Provides connection context
    <ConnectionProvider endpoint={endpoint}>
      {/* Provides wallet state context, requires wallet list */}
      <WalletProvider wallets={wallets} autoConnect>
        {/* Provides the UI modal for selecting wallets */}
        <WalletModalProvider>
          {children} {/* This is where your page components will render */}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}