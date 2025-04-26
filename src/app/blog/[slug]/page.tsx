// src/app/blog/[slug]/page.tsx (Always White Title)

import { getPostData, getAllPostIds } from '../../../../lib/posts'; // Ensure path is correct (5 levels up for lib)
import { CommentSection } from '../../components/CommentSection';   // Ensure path is correct (2 levels up for components in app)
import { ParticleBackground } from '../../components/ParticleBackground'; // Import Particle Background
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';

// Standard Props type for Server Components (assuming Next.js 14)
type Props = {
  params: { slug: string };
};

// Standard generateStaticParams
export async function generateStaticParams() {
   try {
     const paths = getAllPostIds();
     return paths.map(path => ({ slug: path.params.slug }));
   } catch (error) { console.error("Error generating static params:", error); return []; }
}

// Standard generateMetadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const slug = params.slug; // Access directly
    if (!slug) { throw new Error("Slug missing for metadata"); }
    const postData = await getPostData(slug);
    return {
      title: `${postData.title} | sendbox.fun`, // Add site name to title
      description: postData.excerpt || `Read the post: ${postData.title}`,
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return { title: 'Post Not Found | sendbox.fun' };
  }
}

// Standard Async Server Component page
export default async function PostPage({ params }: Props) {
  const postId = params.slug; // Access directly
  if (!postId) { notFound(); }

  try {
    const postData = await getPostData(postId);

    return (
      // Add relative positioning for particle background
      <div className="relative">
        {/* --- Add Particle Background --- */}
        <ParticleBackground />
        {/* ----------------------------- */}

        {/* Container for centering and padding - Add relative z-10 */}
        <div className="container mx-auto px-4 py-16 sm:py-24 relative z-10">
           <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline group mb-8">
             <span aria-hidden="true" className="transition-transform group-hover:-translate-x-1">&larr;</span> Back to Blog List
           </Link>
          {/* Max-width container for content */}
          <div className="max-w-3xl mx-auto">

            {/* --- Post Header SECTION (Outside Article) --- */}
            <div className="mb-8 border-b border-slate-700 pb-6">
              {/* --- Title uses text-white for both light and dark --- */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white dark:text-white mb-3"> {/* Changed text-slate-900 to text-white */}
                {postData.title}
              </h1>
              {/* --------------------------------------------- */}
              <p className="text-base text-slate-500 dark:text-slate-400 mt-0">
                Published on {postData.date ? new Date(postData.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric'}) : 'Unknown Date'}
              </p>
            </div>
            {/* --- End Post Header SECTION --- */}


            {/* --- Post Content ARTICLE --- */}
            <article className="prose prose-lg dark:prose-invert max-w-none"
                     dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
            {/* --- End Post Content ARTICLE --- */}


            {/* Comment Section */}
            <CommentSection postId={postId} />
          </div>
        </div>
      </div> // Closing outer relative div
    );
  } catch (error) {
    console.error(`Error fetching post data for slug "${postId}":`, error);
    notFound();
  }
}
