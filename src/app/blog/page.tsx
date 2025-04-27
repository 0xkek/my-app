// src/app/blog/page.tsx (Revised Hover Glow & Background Implementation)

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
                <li key={id}
                    // UPDATED BACKGROUND CLASS HERE:
                    className="bg-gradient-to-br from-stone-800 via-stone-900 to-amber-950/80 backdrop-blur-sm rounded-lg shadow-lg
                               border border-[#FFAE00]
                               transition-all duration-300 ease-in-out
                               hover:shadow-[0_0_15px_3px_rgba(255,174,0,0.5)]
                               hover:border-yellow-400
                               hover:-translate-y-1"
                >
                  <div className="p-6">
                    {/* Title */}
                    <Link href={`/blog/${id}`}>
                      <h2 className="text-2xl font-bold text-white mb-2 hover:text-[#FFAE00] transition-colors cursor-pointer">
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