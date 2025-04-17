// src/app/page.tsx

// No imports are needed for this basic version yet
// (If you had 'import Image...' before and deleted the footer, you don't need it now)

export default function Home() {
  return (
    // The <main> tag is the single top-level element being returned.
    // The className adds some padding around the content.
    <main className="p-8">

        {/* Your main heading */}
        <h1 className="text-3xl font-bold mb-4">
            Welcome to my Solana Ideas Playground!
        </h1>

        {/* A paragraph describing the site */}
        <p className="mb-4">
            This is where I'll share my thoughts and experiments with Solana smart contracts and blockchain technology.
        </p>

        {/* A subheading for a section */}
        <h2 className="text-2xl font-semibold mt-6 mb-2">
            Latest Thoughts
        </h2>

        {/* An example list */}
        <ul>
          <li className="mb-1">Idea 1: Exploring SPL Tokens</li>
          <li className="mb-1">Idea 2: Building a simple voting dApp</li>
          <li>Idea 3: Understanding transaction costs</li>
        </ul>

        {/* You can add more content or sections below here later */}

    </main>
    // Ensure there are no other tags like <div> outside and next to <main> here
  );
}