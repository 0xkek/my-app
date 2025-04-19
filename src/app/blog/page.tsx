// src/app/blog/page.tsx (Displaying dynamic post list)

import Link from 'next/link';
// Import our new function to get post data
import { getSortedPostsData } from '../../../lib/posts'; // Adjust path if needed, should be correct

export default function BlogIndexPage() {
  // Call the function to get sorted post data (id, title, date, excerpt...)
  const allPostsData = getSortedPostsData();

  return (
    // Using fragment, assuming <main> is provided by layout
    <>
      <h1 className="text-4xl font-bold text-slate-800 mb-6">
        My Thoughts & Ideas
      </h1>
      <p className="text-lg text-slate-700 mb-4">
        Exploring Solana development, web3 concepts, and project updates.
      </p>

      {/* Section to display the list of posts */}
      <section className="mt-8">
        {/* Check if there are any posts */}
        {allPostsData.length > 0 ? (
          // If yes, create an unordered list
          <ul className="space-y-4"> {/* space-y adds vertical space between list items */}
            {/* Loop through each post data object */}
            {allPostsData.map(({ id, date, title, excerpt }) => (
              // Each list item needs a unique 'key' prop - the post id is perfect
              <li key={id} className="p-4 border border-slate-300 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                {/* Link to the specific post page using its id (slug) */}
                <Link href={`/blog/${id}`} className="text-xl font-semibold text-blue-700 hover:underline">
                  {title} {/* Display the post title */}
                </Link>
                <p className="text-sm text-gray-500 mt-1">
                  Published on {date} {/* Display the post date */}
                </p>
                {/* Only display the excerpt if it exists in the frontmatter */}
                {excerpt && (
                  <p className="mt-2 text-slate-600 text-sm">
                    {excerpt}
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          // If no posts found, display the placeholder message
          <p className="italic text-slate-500">No posts published yet.</p>
        )}
      </section>
    </>
  );
}