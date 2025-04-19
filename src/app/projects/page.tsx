// src/app/projects/page.tsx (Styled with placeholder project cards)
import Link from 'next/link'; // Using Link for potential project detail pages

export default function ProjectsPage() {
  // Placeholder data - you'll replace this with real project info later
  // Maybe fetched from Markdown files or another source eventually
  const projects = [
    {
      id: 'spl-token-study', // Used for key and potentially URL slug
      title: 'SPL Token Experiments',
      description: 'Exploring the creation, minting, and transfer of SPL tokens on the Solana network using various tools.'
    },
    {
      id: 'onchain-voting',
      title: 'Simple On-Chain Voting dApp',
      description: 'A conceptual project exploring how basic voting logic could be implemented using Solana smart contracts.'
    },
    {
      id: 'anchor-basics',
      title: 'Anchor Framework Introduction',
      description: 'Learning the fundamentals of Solana program development with the Anchor framework for faster Rust development.'
    },
    // Add more placeholder projects as needed
  ];

  return (
    <div className="py-8 md:py-12"> {/* Vertical padding */}
      {/* Page Title and Description */}
      <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4 text-center">
        Projects & Protocols
      </h1>
      <p className="text-lg text-slate-600 dark:text-slate-300 mb-10 text-center max-w-2xl mx-auto">
        A showcase of Solana protocols, dApps, and experiments developed in this playground.
      </p>

      {/* Grid Container for Project Cards */}
      {/* Adjust columns: 1 on small, 2 on medium, 3 on large screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">

        {/* Map over the projects array to create a card for each */}
        {projects.map((project) => (
          <div key={project.id}
               className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700
                          flex flex-col justify-between {/* Ensure content stretches and link stays at bottom */}
                          transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
            <div> {/* Wrapper for content above the link */}
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                {project.title}
              </h3>
              <p className="text-slate-700 dark:text-slate-300 text-base mb-4">
                {project.description}
              </p>
            </div>
             {/* Placeholder Link - Assumes project detail pages might exist later */}
             {/* These links will 404 for now */}
            <Link href={`/projects/${project.id}`} className="text-blue-600 dark:text-blue-400 hover:underline font-medium self-start mt-4">
               Details &rarr; {/* Use mt-4 to push down, self-start aligns left */}
            </Link>
          </div>
        ))}

        {/* Message if no projects are listed */}
        {projects.length === 0 && (
           <p className="italic text-slate-500 md:col-span-2 lg:col-span-3 text-center">
             No projects listed yet. Check back soon!
           </p>
        )}

      </div>
    </div>
  );
}