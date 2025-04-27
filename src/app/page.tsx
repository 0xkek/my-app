// src/app/page.tsx (Without Footer)
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { WalletStatus } from './components/WalletStatus';
import { ParticleBackground } from './components/ParticleBackground';

export default function Home() {
  const accentColor = '#FFAE00';

  return (
    <div className="relative">
        <ParticleBackground />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <section className="text-center">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image
              src="/e-logo-yellow-square-white-e.png"
              alt="sendbox.fun logo"
              width={150}
              height={150}
              priority
              className="w-36 h-auto"
            />
          </div>

          {/* Tagline/Description */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight text-white">
            Your Solana Dev Playground.
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Experimenting with web3, smart contracts, and blockchain ideas. A space to build, learn, and share the journey.
          </p>

          {/* Wallet Status - Yellow text for emphasis */}
          <div className="max-w-md mx-auto">
             <div className="border border-[#FFAE00] rounded-md overflow-hidden bg-gradient-to-br from-stone-800 via-stone-900 to-amber-950/80 backdrop-blur-sm">
               <div className="p-3">
                 <span className="text-[#FFAE00] font-medium">Please connect your wallet to interact with features.</span>
               </div>
             </div>
          </div>
          
          {/* SPACING - 14px (unchanged) */}
          <div className="h-14"></div>

          {/* Call-to-action Buttons - INCREASED GAP between buttons */}
          <div className="flex flex-wrap justify-center gap-8">
              <Link href="/blog"
                    style={{ backgroundColor: accentColor }}
                    className="inline-block hover:opacity-90 hover:scale-105 text-black font-semibold py-3 px-5 rounded-md shadow-md transition-all duration-300 hover:shadow-[0_0_12px_rgba(255,174,0,0.7)]">
                  Read the Blog
              </Link>
              <Link href="/projects"
                    style={{ backgroundColor: accentColor }}
                    className="inline-block hover:opacity-90 hover:scale-105 text-black font-semibold py-3 px-5 rounded-md shadow-md transition-all duration-300 hover:shadow-[0_0_12px_rgba(255,174,0,0.7)]">
                  View Projects
              </Link>
          </div>
          
          {/* REDUCED SPACING - 9px */}
          <div className="h-9"></div>
        </section>
      </div>

      {/* Content Sections Grid */}
      <div className="container mx-auto px-4 pb-16 relative z-10">
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1: Latest Thoughts */}
            <div className="bg-gradient-to-br from-stone-800 via-stone-900 to-amber-950/80 backdrop-blur-sm p-6 rounded-lg shadow-lg 
                            border border-[#FFAE00] 
                            flex flex-col 
                            transition-all duration-300 ease-in-out
                            hover:shadow-[0_0_15px_3px_rgba(255,174,0,0.5)]
                            hover:border-yellow-400
                            hover:-translate-y-1">
              <h2 className="text-2xl font-semibold text-white mb-3">Latest Thoughts</h2>
              <p className="text-slate-300 mb-4 flex-grow">Dive into blog posts covering Solana development, web3 concepts, project ideas, and learning updates.</p>
               <Link href="/blog"
                     style={{ color: accentColor }}
                     className="hover:underline hover:text-yellow-400 font-medium self-start mt-auto transition-colors">
                 Go to Blog &rarr;
               </Link>
            </div>
            {/* Card 2: Projects Showcase */}
            <div className="bg-gradient-to-br from-stone-800 via-stone-900 to-amber-950/80 backdrop-blur-sm p-6 rounded-lg shadow-lg 
                            border border-[#FFAE00] 
                            flex flex-col 
                            transition-all duration-300 ease-in-out
                            hover:shadow-[0_0_15px_3px_rgba(255,174,0,0.5)]
                            hover:border-yellow-400
                            hover:-translate-y-1">
              <h2 className="text-2xl font-semibold text-white mb-3">Projects Showcase</h2>
               <p className="text-slate-300 mb-4 flex-grow">Explore the protocols and experiments being built here. Check out the code and concepts behind the work.</p>
               <Link href="/projects"
                     style={{ color: accentColor }}
                     className="hover:underline hover:text-yellow-400 font-medium self-start mt-auto transition-colors">
                 View Projects &rarr;
               </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}