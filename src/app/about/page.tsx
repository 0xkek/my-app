// src/app/about/page.tsx (Adding Framed Style to Text Content)
'use client'; // Keep if needed for Image component features

import Image from 'next/image';
// --- Import Particle Background ---
import { ParticleBackground } from '../components/ParticleBackground'; // Assuming components is inside app folder

export default function AboutPage() {
  // Define accent color if needed for this page
  // const accentColor = '#FFAE00';

  return (
    // Add relative positioning to the main page wrapper
    <div className="relative">
        {/* --- Add Particle Background --- */}
        <ParticleBackground />
        {/* ----------------------------- */}

        {/* Container for centering and padding - Add relative z-10 */}
        <div className="container mx-auto px-4 py-16 sm:py-24 relative z-10">

            {/* Grid Container: items-center for vertical alignment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">

                {/* Column 1: Image */}
                <div className="flex justify-center"> {/* Center image horizontally */}
                    <Image
                        src="/e-logo-yellow-square-white-e.png" // YOUR NEW logo filename
                        alt="sendbox.fun 'e' logo"             // Updated Alt Text
                        width={784}                             // YOUR NEW logo actual width
                        height={796}                            // YOUR NEW logo actual height
                        priority
                        // Keep smaller max-width
                        className="rounded-lg shadow-lg object-cover max-w-[16rem] h-auto" // Max width 16rem (256px)
                    />
                </div>

                {/* Column 2: Title and Text Content */}
                {/* --- Moved H1 inside this column --- */}
                <div>
                    {/* --- Title Now Aligned Left with text below --- */}
                    <h1 className="text-4xl font-bold text-white mb-8 md:mb-12"> {/* Removed text-center */}
                        About This Playground
                    </h1>
                    {/* ------------------------------------------- */}

                    {/* --- Wrapper Div for Framed Text Content --- */}
                    <div className="bg-gradient-to-br from-stone-800 via-stone-900 to-amber-950/80 backdrop-blur-sm rounded-lg shadow-lg
                                    border border-[#FFAE00] p-6  /* Added padding here */
                                    transition-all duration-300 ease-in-out
                                    hover:shadow-[0_0_15px_3px_rgba(255,174,0,0.5)]
                                    hover:border-yellow-400
                                    hover:-translate-y-1">

                        {/* Inner Div for Text content styling (size, color, spacing) */}
                        <div className="text-lg text-slate-300 space-y-5 leading-relaxed">
                            <h2 className="text-2xl font-semibold text-white mb-3">
                                Purpose
                            </h2>
                            <p>
                                Welcome! This site serves as my personal digital playground and notebook for exploring the world of Solana development, web3 concepts, and blockchain technology in general.
                            </p>

                            <h2 className="text-2xl font-semibold text-white mb-3">
                                What You&apos;ll Find
                            </h2>
                            <p>
                                Here, I plan to document experiments, share thoughts on the ecosystem (like the blog posts!), and potentially showcase small projects or protocol interactions I build. Think of it as learning in public.
                            </p>

                            <h2 className="text-2xl font-semibold text-white mb-3">
                                The Goal
                            </h2>
                            <p>
                                The main goal is simply to learn, tinker, and share. If you find something interesting or it sparks an idea for you, that&apos;s fantastic!
                            </p>
                        </div>
                        {/* --- End Inner Text Div --- */}

                    </div>
                    {/* --- End Wrapper Framed Div --- */}

                </div>
                {/* --- End Column 2 --- */}

            </div>
        </div>
    </div> // Closing outer relative div
  );
} // Closing function brace