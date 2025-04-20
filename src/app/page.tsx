// src/app/page.tsx (Including WalletStatus Component)

import Link from 'next/link';
// --- Import the new WalletStatus component ---
// Using ./components because your components folder is inside app
import { WalletStatus } from './components/WalletStatus';
// -----------------------------------------

export default function Home() {
  return (
    // Using fragment, assuming <main> is provided by layout adds container/padding
    <>
      {/* Hero Section */}
      <section className="text-center py-16 px-4 mb-12 bg-gradient-to-b from-white to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-lg shadow-sm">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Welcome to the Playground!
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
          Exploring Solana, smart contracts, and web3 ideas. This is a space for learning, building, and sharing thoughts on blockchain development.
        </p>

        {/* --- Wallet Status Display Area --- */}
        {/* Added a container to control width, centered */}
        <div className="max-w-md mx-auto mb-8">
            <WalletStatus /> {/* Use the WalletStatus component here */}
        </div>
        {/* -------------------------------- */}

        {/* Call-to-action Buttons/Links */}
        {/* Added mt-0 to this div as WalletStatus now provides space above */}
        <div className="flex flex-wrap justify-center gap-4 mt-0">
            <Link href="/blog" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-md shadow transition-colors">
                Read Thoughts
            </Link>
            <Link href="/projects" className="inline-block bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-5 rounded-md shadow transition-colors">
                View Projects
            </Link>
        </div>
      </section>

      {/* Content Sections in a Grid */}
      <section className="px-4">
        {/* Grid: 1 column on small screens, 2 columns on medium screens and up */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Latest Thoughts Card */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 flex flex-col">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
              Latest Thoughts
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 flex-grow">
              Check out the blog for articles and ideas on Solana development, web3 concepts, and project updates.
            </p>
             <Link href="/blog" className="text-blue-600 dark:text-blue-400 hover:underline self-start">
               Go to Blog &rarr;
             </Link>
          </div>

          {/* Projects Showcase Card */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 flex flex-col">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
              Projects Showcase
            </h2>
             <p className="text-slate-600 dark:text-slate-400 mb-4 flex-grow">
               Explore the protocols and experiments being built here. Dive into the code and concepts behind the projects.
             </p>
             <Link href="/projects" className="text-blue-600 dark:text-blue-400 hover:underline self-start">
               View Projects &rarr;
             </Link>
          </div>

        </div>
      </section>
    </>
  );
}