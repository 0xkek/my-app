// src/app/blog/page.tsx

export default function BlogIndexPage() {
    return (
      // Removed main tag here assuming layout provides it
      <>
        <h1 className="text-4xl font-bold text-slate-800 mb-6">
          My Thoughts & Ideas
        </h1>
        <p className="text-lg text-slate-700 mb-4">
          Posts about Solana development, web3 concepts, and project updates will appear here soon.
        </p>
        {/* Placeholder for future post list */}
        <div className="mt-8">
          {/* Example: <BlogPostPreview title="My First Post Idea" date="2025-04-19" /> */}
          <p className="italic text-slate-500">No posts published yet.</p>
        </div>
      </>
    );
  }