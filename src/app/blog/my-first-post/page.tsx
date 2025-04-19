// src/app/blog/my-first-post/page.tsx

export default function FirstPostPage() {
    return (
      // Using article tag for semantic meaning, style as needed
      <article className="prose lg:prose-xl"> {/* Basic Tailwind typography styling */}
        <h1>My First Post Title</h1>
        <p className="text-sm text-gray-500">Published on April 19, 2025</p>
  
        <p>
          This is the content of my first blog post. Here I can start writing about
          my ideas for Solana, web3 development, or anything else I want to share.
        </p>
        <p>
          Later, we can explore ways to write these posts more easily using formats
          like Markdown.
        </p>
  
        <h2>Subheading Example</h2>
        <p>
          More content can go here. We can add code blocks, images, lists, etc.
        </p>
      </article>
    );
  }