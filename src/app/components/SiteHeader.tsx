// src/components/SiteHeader.tsx (Setting nav link size to text-2xl)
'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import React from 'react';
import { usePathname } from 'next/navigation'; // Ensure usePathname is imported

const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

export function SiteHeader() {
  const pathname = usePathname();

  // Helper function to determine base class names (adjust base size here if needed)
  const baseLinkClass = "transition-colors"; // Removed specific size from base

  // Helper function to determine active/inactive class names
  const getLinkClass = (path: string) => {
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
             {/* --- Updated className for each link: text-2xl --- */}
            <Link href="/" className={`${baseLinkClass} text-2xl ${getLinkClass('/')}`}>
              Home
            </Link>
            <Link href="/about" className={`${baseLinkClass} text-2xl ${getLinkClass('/about')}`}>
              About
            </Link>
            <Link href="/blog" className={`${baseLinkClass} text-2xl ${getLinkClass('/blog')}`}>
              Blog
            </Link>
            <Link href="/projects" className={`${baseLinkClass} text-2xl ${getLinkClass('/projects')}`}>
              Projects
            </Link>
             {/* ------------------------------------------ */}
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