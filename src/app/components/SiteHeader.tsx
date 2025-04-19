// src/app/components/SiteHeader.tsx
'use client'; // Mark this component as a Client Component

import Link from 'next/link';
// Import the pre-built wallet button component
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

// --- Make sure 'export' is here ---
export function SiteHeader() {
// ----------------------------------
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

          {/* Wallet Connect Button */}
          <div>
            <WalletMultiButton style={{ height: '38px', fontSize: '14px', backgroundColor: '#5850ec' }} />
          </div>
        </div>

      </div>
    </header>
  );
}