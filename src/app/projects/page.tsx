// src/app/projects/page.tsx

export default function ProjectsPage() {
    return (
      // Using fragment, assuming <main> is provided by layout
      <>
        <h1 className="text-4xl font-bold text-slate-800 mb-6">
          My Projects & Protocols
        </h1>
        <p className="text-lg text-slate-700 mb-4">
          Here I'll showcase the Solana protocols and other projects I'm working on or experimenting with.
        </p>
        {/* Placeholder for future project list */}
        <div className="mt-8">
          <p className="italic text-slate-500">Project details coming soon.</p>
          {/* Example structure for later:
          <div className="p-4 border rounded-lg mb-4">
            <h2 className="text-xl font-semibold">Project Alpha</h2>
            <p>Description of Project Alpha...</p>
          </div>
          */}
        </div>
      </>
    );
  }