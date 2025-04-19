// src/components/SiteHeader.tsx (Adding Active Link Styling)
'use client';

import Link from 'next/link';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import React from 'react';
// --- Import usePathname ---
import { usePathname } from 'next/navigation';
// --------------------------
// Import dynamic for WalletMultiButton (already done previously)
import dynamic from 'next/dynamic';

const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

export function SiteHeader() {
  // --- Get the current URL path ---
  const pathname = usePathname();
  // --------------------------------

  // Helper function to determine base class names
  const baseLinkClass = "transition-colors text-sm sm:text-base";
  // Helper function to determine active/inactive class names
  const getLinkClass = (path: string) => {
    // Check for exact match or if it's a parent route (e.g., /blog should be active for /blog/post-1)
    const isActive = (path === '/' && pathname === path) || (path !== '/' && pathname.startsWith(path));
    return isActive
      ? 'text-white font-semibold' // Active state style
      : 'text-slate-400 hover:text-slate-200'; // Inactive state style + hover
  };

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
            {/* Apply dynamic classes to each Link */}
            <Link href="/" className={`${baseLinkClass} ${getLinkClass('/')}`}>
              Home
            </Link>
            <Link href="/about" className={`${baseLinkClass} ${getLinkClass('/about')}`}>
              About
            </Link>
            <Link href="/blog" className={`${baseLinkClass} ${getLinkClass('/blog')}`}>
              Blog
            </Link>
            <Link href="/projects" className={`${baseLinkClass} ${getLinkClass('/projects')}`}>
              Projects
            </Link>
          </nav>

          {/* Wallet Button Area */}
          <div>
            <WalletMultiButtonDynamic style={{ height: '38px', fontSize: '14px', backgroundColor: '#5850ec' }} />
          </div>
        </div>

      </div>
    </header>
  );
}