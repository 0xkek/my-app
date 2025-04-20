// src/app/projects/page.tsx (Checked for syntax near return)

import Link from 'next/link'; // Make sure Link is imported

export default function ProjectsPage() {
  // Placeholder data - replace with real project info later
  const projects = [
    {
      id: 'spl-token-study',
      title: 'SPL Token Experiments',
      description: 'Exploring creation and management of SPL tokens on Solana network.',
      tags: ['Tokens', 'SPL', 'Learning']
    },
    {
      id: 'onchain-voting',
      title: 'Simple On-Chain Voting dApp',
      description: 'A basic on-chain voting system concept using simple program logic.',
      tags: ['dApp', 'Concept', 'Governance']
    },
    {
      id: 'anchor-basics',
      title: 'Anchor Framework Introduction',
      description: 'Learning the fundamentals of building Solana programs with Anchor.',
      tags: ['Anchor', 'Rust', 'Development']
    },
  ];

  // --- Start of return statement ---
  // Ensure 'return' is immediately followed by '('
  return (
    // Ensure '<div...' is the first thing after the opening parenthesis '('
    <div className="py-8 md:py-12">
      {/* Page Title and Description */}
      <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4 text-center">
        Projects & Protocols
      </h1>
      <p className="text-lg text-slate-600 dark:text-slate-300 mb-10 text-center max-w-2xl mx-auto">
        A showcase of Solana protocols, dApps, and experiments developed in this playground.
      </p>

      {/* Grid Container for Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">

        {/* Map over the projects array to create a card for each */}
        {projects.map((project) => (
          <div key={project.id}
               className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700
                          flex flex-col justify-between
                          transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">

            {/* Card Content Area */}
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                {project.title}
              </h3>
              <p className="text-slate-700 dark:text-slate-300 text-base mb-4 flex-grow">
                {project.description}
              </p>
              {/* Display Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map(tag => (
                  <span key={tag} className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Card Footer Area */}
            <div className="border-t border-slate-200 dark:border-slate-700 px-6 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-b-lg">
               <Link href={`/projects/${project.id}`} /* Link will 404 for now */
                     className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-1.5 px-4 rounded-md shadow-sm transition-colors">
                 Details &rarr;
               </Link>
            </div>
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
    // --- End of return statement ---
    // Ensure the closing parenthesis ')' and semicolon ';' (optional) are here
  );
} // --- End of component function ---