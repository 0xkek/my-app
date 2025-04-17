// src/app/page.tsx (with example Tailwind styling)
import Image from 'next/image';
// No extra wrapper needed here if layout.tsx provides <main> and padding
export default function Home() {
    return (
      // Using a React Fragment (<>...</>) because the main layout likely provides the <main> tag
      <>
          {/* Style the main heading */}
          <h1 className="text-4xl font-bold text-slate-800 mb-6">
              Welcome to my Solana Ideas Playground!
          </h1>
  
          {/* Style the introductory paragraph */}
          <p className="text-lg text-slate-700 mb-4">
              This is where I'll share my thoughts and experiments with Solana smart contracts and blockchain technology.
          </p>
  
          {/* Style the subheading */}
          <h2 className="text-2xl font-semibold text-slate-800 mt-8 mb-3">
              Latest Thoughts
          </h2>
  
          {/* Style the list */}
          <ul className="list-disc list-inside space-y-2 text-slate-700">
              {/* space-y-2 adds vertical space between list items automatically */}
              <li>Idea 1: Exploring SPL Tokens</li>
              <li>Idea 2: Building a simple voting dApp</li>
              <li>Idea 3: Understanding transaction costs</li>
          </ul>
   {/* --- Add the Image component --- */}
   <Image
        src="/smoovbrain logo.png" // IMPORTANT: Path starts with '/' and matches the filename in /public
        alt="smoovbrain logo"      // IMPORTANT: Describe the image for accessibility
        width={200}           // REQUIRED: The actual width of the image in pixels
        height={50}           // REQUIRED: The actual height of the image in pixels
        className="mt-4 mb-4 rounded md" // Optional: Add Tailwind classes for styling (e.g., margins)
      />
      {/* --- End Image component --- */}
          {/* You could add a styled "Projects" section similarly */}
          {/* <h2 className="text-2xl font-semibold text-slate-800 mt-8 mb-3">Projects</h2> */}
          {/* <p className="text-lg text-slate-700">Coming soon...</p> */}
  
      </> // Closing the React Fragment
    );
  }