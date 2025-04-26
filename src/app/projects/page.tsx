// src/app/projects/page.tsx (Uniform Border Thickness - FINAL)
'use client'; // Keep client if using hooks, can be server if just displaying static list

import Link from 'next/link';
// --- Import Particle Background ---
import { ParticleBackground } from '../components/ParticleBackground'; // Adjust path if needed

export default function ProjectsPage() {
  // Placeholder data - update with your actual projects
  const projects = [
    {
      id: 'wallet-comments',
      title: 'Wallet-Based Comments',
      description: 'Exploring a comment system using Solana wallet signatures for identity instead of traditional logins.',
      tags: ['Identity', 'Comments', 'Web3', 'Next'],
      href: '/blog/wallet-as-identity-idea'
    },
    {
      id: 'spl-token-study',
      title: 'SPL Token Experiments',
      description: 'Exploring creation and management of SPL tokens on Solana network.',
      tags: ['Tokens', 'SPL', 'Learning'],
      href: '#' // Placeholder link
    },
    {
      id: 'anchor-basics',
      title: 'Anchor Framework Intro',
      description: 'Learning the fundamentals of building Solana programs with Anchor.',
      tags: ['Anchor', 'Rust', 'Development'],
      href: '#' // Placeholder link
    },
  ];

  const accentColor = '#FFAE00'; // Your accent color
  const glowColorRgba = 'rgba(255, 174, 0, 0.7)'; // Glow color

  return (
    // Add relative positioning for z-index stacking
    <div className="relative">
      {/* --- Add Particle Background --- */}
      <ParticleBackground />
      {/* ----------------------------- */}

      {/* Add container for centering and padding - Add relative z-10 */}
      <div className="container mx-auto px-4 py-16 sm:py-24 relative z-10">
        {/* Page Title and Description - Dark Theme */}
        <h1 className="text-4xl font-bold text-white mb-4 text-center"> {/* Use text-white */}
          Projects & Protocols
        </h1>
        <p className="text-lg text-slate-200 mb-10 text-center max-w-2xl mx-auto"> {/* Use text-slate-200 */}
          A showcase of Solana protocols, dApps, and experiments developed in this playground.
        </p>

        {/* Grid Container for Project Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">

          {/* Map over the projects array */}
          {projects.map((project) => (
            // --- CORRECTED Border Classes ---
            // Removed border-t-4 and the duplicate border-t-[#FFAE00]
            <div key={project.id}
                 className={`
                    bg-slate-900/50 backdrop-blur-sm rounded-lg shadow-lg
                    border border-[#FFAE00] /* Correct: Single 1px yellow border */
                    flex flex-col justify-between overflow-hidden
                    transition-all duration-300 ease-in-out
                    hover:shadow-xl hover:-translate-y-1
                    hover:shadow-[0_0_8px_3px_${glowColorRgba}] /* Keep yellow glow */
                 `}
            >
            {/* ----------------------------- */}

              {/* Card Content Area */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {project.title}
                </h3>
                <p className="text-slate-300 text-base mb-4 flex-grow">
                  {project.description}
                </p>

                {/* Tags Area */}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map(tag => (
                      <span key={tag} className="bg-yellow-900/50 text-[#FFAE00] border border-[#FFAE00]/50 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer Area (Button) */}
              <div className="border-t border-slate-700 px-6 py-4 bg-slate-800/50 rounded-b-lg">
                 <Link href={project.href || '#'}
                       style={{ backgroundColor: accentColor }}
                       className="inline-block hover:opacity-90 text-black text-sm font-semibold py-2 px-4 rounded shadow-sm transition-opacity">
                   {project.href === '#' || !project.href ? 'Coming Soon' : (project.href.startsWith('/blog/') ? 'Read Post' : 'Details')} &rarr;
                 </Link>
              </div>
            </div>
          ))}

          {/* Message if no projects listed */}
          {projects.length === 0 && (
             <p className="italic text-slate-500 md:col-span-2 lg:col-span-3 text-center">
               No projects listed yet. Check back soon!
             </p>
          )}
        </div>
      </div>
    </div>
  );
}
