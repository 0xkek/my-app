// src/app/blog/page.tsx

import Link from 'next/link'; // Import the Link component

export default function BlogIndexPage() {
  // Get current date for placeholder - replace with actual post dates later
  const currentDate = new Date().toLocaleDateString('en-CA'); // Format: YYYY-MM-DD

  return (
    // Using fragment, assuming <main> is provided by layout
    <>
      <h1 className="text-4xl font-bold text-slate-800 mb-6">
        My Thoughts & Ideas
      </h1>
      <p className="text-lg text-slate-700 mb-4">
        Posts about Solana development, web3 concepts, and project updates will appear here soon.
      </p>

      {/* List of posts */}
      <div className="mt-8 space-y-4"> {/* Adds space between post links */}

        {/* --- START: Link to the first post --- */}
        <div className="p-4 border border-slate-300 rounded-lg shadow-sm hover:shadow-md transition-shadow"> {/* Basic card style */}
          <Link href="/blog/my-first-post" className="text-xl font-semibold text-blue-700 hover:underline">
            My First Post Title
          </Link>
          {/* Using today's date as a placeholder */}
          <p className="text-sm text-gray-500 mt-1">Published on {currentDate}</p>
          {/* You could add an excerpt here later */}
          <p className="mt-2 text-slate-600 text-sm">
             Click here to read the first sample post...
          </p>
        </div>
        {/* --- END: Link to the first post --- */}

        {/* The original placeholder is removed/commented out */}
        {/* <p className="italic text-slate-500">No posts published yet.</p> */}

        {/* More post links would go here in the future */}

      </div>
    </>
  );
}