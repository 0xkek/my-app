// src/app/blog/page.tsx (Styling the post list items as cards)

import Link from 'next/link';
import { getSortedPostsData } from '../../../lib/posts'; // Ensure path is correct

export default function BlogIndexPage() {
  const allPostsData = getSortedPostsData();

  return (
    <>
      <h1 className="text-4xl font-bold text-slate-800 mb-4 dark:text-slate-100">
        My Thoughts & Ideas
      </h1>
      <p className="text-lg text-slate-600 mb-10 dark:text-slate-300">
        Exploring Solana development, web3 concepts, and project updates.
      </p>

      {/* Section to display the list of posts */}
      <section>
        {allPostsData.length > 0 ? (
          <ul className="space-y-6"> {/* Increased space between cards */}
            {/* Loop through each post data object */}
            {allPostsData.map(({ id, date, title, excerpt }) => (
              // --- START: Updated Card Styling for li ---
              <li key={id}
                  className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700
                             transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
                {/* Increased padding inside the card */}
                <div className="p-6">
                  {/* Make the title larger and the main link target */}
                  <Link href={`/blog/${id}`}>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                      {title ? title : "Untitled Post"}
                    </h2>
                  </Link>
                  {/* Style the date */}
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                    {date ? date : 'Unknown Date'}
                  </p>
                  {/* Style the excerpt */}
                  {excerpt && (
                    <p className="text-slate-700 dark:text-slate-300 text-base mb-4">
                      {excerpt}
                    </p>
                  )}
                  {/* Add an explicit "Read More" link */}
                  <Link href={`/blog/${id}`} className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                    Read more &rarr;
                  </Link>
                </div>
              </li>
               // --- END: Updated Card Styling for li ---
            ))}
          </ul>
        ) : (
          <p className="italic text-slate-500">No posts published yet.</p>
        )}
      </section>
    </>
  );
}