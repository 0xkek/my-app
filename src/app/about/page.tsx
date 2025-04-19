// src/app/about/page.tsx (Styled with two-column layout)
import Image from 'next/image';

export default function AboutPage() {
  return (
    // Add some vertical padding to the page overall
    <div className="py-8 md:py-12">

      {/* Page Title */}
      <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-8 text-center md:mb-12">
        About This Site
      </h1>

      {/* Grid Container: 1 column default, 2 columns on medium screens (md:) and up */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">

        {/* Column 1: Image */}
        <div className="flex justify-center md:justify-start"> {/* Center on small, start on medium */}
          {/* --- Make sure to use your actual image details below --- */}
          <Image
            src="/smoovbrain logo.png" // <-- IMPORTANT: Replace with YOUR image path from /public
            alt="A descriptive alt text for your image" // <-- IMPORTANT: Add good alt text
            width={300}           // <-- IMPORTANT: Adjust to your image width
            height={300}          // <-- IMPORTANT: Adjust to your image height
            className="rounded-lg shadow-lg object-cover max-w-full h-auto" // Style image: rounded, shadow, cover ensures aspect ratio
            priority={true}       // Add priority=true if image is visible above the fold on load
          />
        </div>

        {/* Column 2: Text Content */}
        {/* Added text size, color, and spacing between paragraphs */}
        <div className="text-lg text-slate-700 dark:text-slate-300 space-y-5 leading-relaxed">
          <p>
            Welcome to the playground! This site serves as a personal space to document my journey exploring Solana development, web3 concepts, and smart contract protocols.
          </p>
          <p>
            Here, I'll share code experiments, thoughts on the ecosystem, and walkthroughs of projects I'm building. Consider it a learning lab and a place to tinker with blockchain technology.
          </p>
          <p>
            Feel free to look around, and maybe you'll find something interesting or useful for your own web3 adventures. The goal is learning and sharing in the open.
          </p>
          {/* Add more paragraphs or relevant content here */}
        </div>

      </div>
    </div>
  );
}