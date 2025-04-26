// src/app/blog/page.tsx (Tighter Hover Glow)

// Keep as Server Component
import Link from 'next/link';
// Import the data fetching function
import { getSortedPostsData, PostListData } from '../../../lib/posts'; // Ensure path is correct
// Import Particle Background
import { ParticleBackground } from '../components/ParticleBackground'; // Adjust path if needed

export default function BlogIndexPage() {
  // Fetch data directly on the server
  const allPostsData: PostListData[] = getSortedPostsData();
  const accentColor = '#FFAE00'; // Your accent color hex
  // Define the glow color using RGBA for transparency - used in hover shadow below
  // Increased opacity slightly for more vibrance
  const glowColorRgba = 'rgba(255, 174, 0, 0.7)'; // #FFAE00 at 70% opacity

  return (
    // Add relative positioning for z-index stacking
    <div className="relative">
      {/* Add Particle Background */}
      <ParticleBackground />

      {/* Add container for centering and padding - Add relative z-10 */}
      <div className="container mx-auto px-4 py-16 sm:py-24 relative z-10">
        {/* Page Title and Description - Dark Theme */}
        <h1 className="text-4xl font-bold text-white mb-4 text-center md:text-left">
          My Thoughts & Ideas
        </h1>
        {/* Brighter Description Text */}
        <p className="text-lg text-slate-200 mb-10 text-center md:text-left max-w-2xl md:max-w-none">
          Exploring Solana development, web3 concepts, project ideas, and learning updates.
        </p>

        {/* Section to display the list of posts */}
        <section>
          {allPostsData.length > 0 ? (
            <ul className="space-y-6">
              {allPostsData.map(({ id, date, title, excerpt }) => (
                // --- Tighter Hover Glow Effect ---
                <li key={id}
                    className={`
                      bg-slate-900/50 backdrop-blur-sm rounded-lg shadow-lg
                      border border-[#FFAE00]
                      transition-all duration-300 ease-in-out
                      hover:shadow-xl hover:-translate-y-1
                      hover:shadow-[0_0_8px_3px_${glowColorRgba}] /* Reduced blur, small spread, increased opacity */
                    `}
                >
                {/* ----------------------------- */}
                  <div className="p-6">
                    {/* Title */}
                    <Link href={`/blog/${id}`}>
                      <h2 className={`text-2xl font-bold text-white mb-2 hover:text-[#FFAE00] transition-colors cursor-pointer`}>
                        {title || "Untitled Post"}
                      </h2>
                    </Link>
                    {/* Date - Brighter */}
                    <p className="text-sm text-slate-300 mb-3">
                      {date ? new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric'}) : 'Unknown Date'}
                    </p>
                    {/* Excerpt - Brighter */}
                    {excerpt && (
                      <p className="text-slate-200 text-base mb-4">
                        {excerpt}
                      </p>
                    )}
                    {/* Read More Link */}
                    <Link href={`/blog/${id}`}
                          style={{ color: accentColor }}
                          className="hover:underline font-medium">
                      Read more &rarr;
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="italic text-slate-500 text-center">No posts published yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}
