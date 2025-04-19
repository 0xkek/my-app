// src/components/SiteHeader.tsx (Using dynamic import for wallet button)
'use client';

import Link from 'next/link';
// Import dynamic from next/dynamic
import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import WalletMultiButton with SSR disabled
// This ensures it only renders on the client side
const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false } // Disable server-side rendering
);

export function SiteHeader() {
  // No need for useWallet or truncateAddress here anymore

  return (
    <header className="bg-slate-800 text-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto flex flex-wrap items-center justify-between p-4 gap-y-2">

        {/* Site Title/Logo Link */}
        <Link href="/" className="text-xl font-bold hover:text-slate-300 transition-colors mr-auto sm:mr-4">
          smoothbrain.xyz
        </Link>

        {/* Right side items (Nav + Wallet Button) */}
        <div className="flex items-center gap-x-4 sm:gap-x-6">
          {/* Navigation Links */}
          <nav className="flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-1 items-center">
            <Link href="/" className="hover:text-slate-300 transition-colors text-sm sm:text-base">Home</Link>
            <Link href="/about" className="hover:text-slate-300 transition-colors text-sm sm:text-base">About</Link>
            <Link href="/blog" className="hover:text-slate-300 transition-colors text-sm sm:text-base">Blog</Link>
            <Link href="/projects" className="hover:text-slate-300 transition-colors text-sm sm:text-base">Projects</Link>
          </nav>

          {/* Wallet Button Area */}
          <div>
            {/* Use the dynamically imported button */}
            <WalletMultiButtonDynamic style={{ height: '38px', fontSize: '14px', backgroundColor: '#5850ec' }} />
          </div>
        </div>

      </div>
    </header>
  );
}