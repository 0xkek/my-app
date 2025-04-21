// src/app/about/page.tsx (Corrected Image Details)
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="py-8 md:py-12">
      <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-8 text-center md:mb-12">
        About This Playground
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">

        {/* Column 1: Image */}
        <div className="flex justify-center md:justify-start">
          {/* --- Corrected Image Details --- */}
          <Image
            src="/smoovbrain-logo.png" // Correct filename
            alt="Smoothbrain Logo"    // Updated Alt Text (Adjust if needed)
            width={300}               // Desired width
            height={300}              // Desired height
            className="rounded-lg shadow-lg object-cover max-w-full h-auto"
            priority={true}
          />
          {/* ------------------------------- */}
        </div>

        {/* Column 2: Text Content */}
        <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
            Purpose
          </h2>
          <p className="text-lg text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
            Welcome! This site serves as my personal digital playground and notebook for exploring the world of Solana development, web3 concepts, and blockchain technology in general.
          </p>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
            What You'll Find
          </h2>
          <p className="text-lg text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
            Here, I plan to document experiments, share thoughts on the ecosystem (like the blog posts on NFT and betting ideas!), and potentially showcase small projects or protocol interactions I build. Think of it as learning in public.
          </p>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
            The Goal
          </h2>
          <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
            The main goal is simply to learn, tinker, and share. If you find something interesting or it sparks an idea for you, that's fantastic!
          </p>
        </div>

      </div>
    </div>
  );
}