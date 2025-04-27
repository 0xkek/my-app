// src/components/SiteHeader.tsx (Updated with stone background)
'use client';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import React from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image'; // Import Image

const WalletMultiButtonDynamic = dynamic( async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton, { ssr: false } );

export function SiteHeader() {
  const pathname = usePathname();
  const baseLinkClass = "transition-colors";
  const getLinkClass = (path: string) => { const isActive = (path === '/' && pathname === path) || (path !== '/' && pathname.startsWith(path)); return isActive ? 'text-white font-semibold' : 'text-slate-400 hover:text-slate-100'; };
  const accentColorHex = '#FFAE00'; // Define accent color hex

  return (
    // Updated background to a clean stone color
    <header
        className="bg-stone-900 text-white sticky top-0 z-50 border-b"
        style={{ borderColor: accentColorHex }} // Apply border color using inline style
    >
      {/* Container to center header content */}
      <div className="container mx-auto flex flex-wrap items-center justify-between p-4 gap-y-2">

        {/* Updated Image Logo Link with new transparent logo */}
        <Link href="/" className="mr-auto sm:mr-4 flex items-center" aria-label="Go to Homepage">
           <Image
              src="/transparent-text-logo-white.png" // New transparent logo
              alt="sendbox.fun logo"
              width={200} // Adjusted width
              height={48} // Adjusted height
              priority
              className="h-8 w-auto"
            />
        </Link>

        {/* Navigation and Wallet Button */}
        <div className="flex items-center gap-x-4 sm:gap-x-6">
          <nav className="flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-1 items-center">
            {/* Using text-2xl for nav links */}
            <Link href="/" className={`${baseLinkClass} text-2xl ${getLinkClass('/')}`}>Home</Link>
            <Link href="/about" className={`${baseLinkClass} text-2xl ${getLinkClass('/about')}`}>About</Link>
            <Link href="/blog" className={`${baseLinkClass} text-2xl ${getLinkClass('/blog')}`}>Blog</Link>
            <Link href="/projects" className={`${baseLinkClass} text-2xl ${getLinkClass('/projects')}`}>Projects</Link>
          </nav>
          <div>
            <WalletMultiButtonDynamic style={{ height: '38px', fontSize: '14px', backgroundColor: accentColorHex, color: 'black' }} />
          </div>
        </div>
      </div>
    </header>
  );
}