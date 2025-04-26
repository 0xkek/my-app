// src/app/page.tsx (Adding Yellow Borders and Hover Glow)
'use client'; // Keep as client component because WalletStatus uses hooks

import Link from 'next/link';
import Image from 'next/image'; // Import Image component
// Import WalletStatus component (ensure path is correct: ./components/WalletStatus)
import { WalletStatus } from './components/WalletStatus';
// --- Import the Particle Background component ---
import { ParticleBackground } from './components/ParticleBackground'; // Ensure path is correct

// --- Ensure this default export is correct ---
export default function Home() {
// -------------------------------------------

  // Use the specific accent color provided by the user
  const accentColor = '#FFAE00'; // User's Accent Color
  const glowColorRgba = 'rgba(255, 174, 0, 0.5)'; // Matching glow color from other pages

  return (
    // Outermost div from user's code #444
    // Add relative positioning to allow z-index stacking if needed
    <div className="relative">
        {/* --- Add the Particle Background component here --- */}
        {/* It positions itself fixed behind everything else */}
        <ParticleBackground />
        {/* ----------------------------------------------- */}

      {/* Hero Section - Container from user's code #444 */}
      {/* Added z-10 to ensure content is above background */}
      <div className="container mx-auto px-4 py-16 sm:py-24 relative z-10">
        <section className="text-center mb-16 sm:mb-24">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            {/* --- Using YOUR logo details --- */}
            <Image
              src="/full-logo-black-bg-black-e.png" // YOUR logo filename
              alt="sendbox.fun logo"
              width={1736} // YOUR logo actual width
              height={1537} // YOUR logo actual height
              priority // Load logo quickly
              // Using YOUR rendered size class
              className="w-72 h-auto"
            />
            {/* ------------------------------------ */}
          </div>

          {/* Tagline/Description */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight text-white"> {/* Ensure text color */}
            Your Solana Dev Playground.
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Experimenting with web3, smart contracts, and blockchain ideas. A space to build, learn, and share the journey.
          </p>

          {/* Wallet Status */}
          <div className="max-w-md mx-auto mb-10">
             {/* Use existing WalletStatus component */}
             <WalletStatus />
          </div>

          {/* Call-to-action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
              {/* Use updated accent color for primary button */}
              <Link href="/blog"
                    style={{ backgroundColor: accentColor }} // Apply updated accent color
                    className="inline-block hover:opacity-90 text-black font-semibold py-3 px-6 rounded-md shadow-md transition-all duration-300 hover:shadow-[0_0_8px_rgba(255,174,0,0.6)]">
                  Read the Blog
              </Link>
              <Link href="/projects"
                    className="inline-block bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-md shadow-md transition-colors">
                  View Projects
              </Link>
          </div>
        </section>
      </div>

      {/* Content Sections Grid - Container from user's code #444 */}
      {/* Added z-10 to ensure content is above background */}
      <div className="container mx-auto px-4 pb-16 sm:pb-24 relative z-10">
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1: Latest Thoughts - Updated with yellow border and hover glow */}
            <div className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-lg shadow-lg 
                            border border-[#FFAE00] 
                            flex flex-col 
                            transition-all duration-300 ease-in-out
                            hover:shadow-[0_0_15px_3px_rgba(255,174,0,0.5)]
                            hover:border-yellow-400
                            hover:-translate-y-1">
              <h2 className="text-2xl font-semibold text-white mb-3">Latest Thoughts</h2>
              <p className="text-slate-300 mb-4 flex-grow">Dive into blog posts covering Solana development, web3 concepts, project ideas, and learning updates.</p>
               <Link href="/blog"
                     style={{ color: accentColor }} // Use updated accent color for link
                     className="hover:underline font-medium self-start mt-auto">
                 Go to Blog &rarr;
               </Link>
            </div>
            {/* Card 2: Projects Showcase - Updated with yellow border and hover glow */}
            <div className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-lg shadow-lg 
                            border border-[#FFAE00] 
                            flex flex-col 
                            transition-all duration-300 ease-in-out
                            hover:shadow-[0_0_15px_3px_rgba(255,174,0,0.5)]
                            hover:border-yellow-400
                            hover:-translate-y-1">
              <h2 className="text-2xl font-semibold text-white mb-3">Projects Showcase</h2>
               <p className="text-slate-300 mb-4 flex-grow">Explore the protocols and experiments being built here. Check out the code and concepts behind the work.</p>
               <Link href="/projects"
                     style={{ color: accentColor }} // Use updated accent color for link
                     className="hover:underline font-medium self-start mt-auto">
                 View Projects &rarr;
               </Link>
            </div>
          </div>
        </section>
      </div>
    </div> // Closing outermost div
  );
} // Closing function brace