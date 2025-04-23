// src/app/blog/[slug]/page.tsx (Correct async pattern + Props type for Next.js 15)

import { getPostData, getAllPostIds } from '../../../../lib/posts';
import { CommentSection } from '../../components/CommentSection'; // Correct path
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';

// --- CORRECT Props Type Definition for Next.js 15 Async Params ---
type Props = {
  params: Promise<{ slug: string }>; // Params is expected as a Promise
};
// --------------------------------------------------------------------

export async function generateStaticParams() {
   try {
     const paths = getAllPostIds();
     return paths.map(path => ({ slug: path.params.slug }));
   } catch (error) { console.error("Error generating static params:", error); return []; }
}

// generateMetadata receives Props (where params is Promise)
export async function generateMetadata({ params: paramsPromise }: Props): Promise<Metadata> {
  try {
    const params = await paramsPromise; // Must await the params Promise
    const slug = params.slug;
    if (!slug) { throw new Error("Slug missing after await in generateMetadata"); }

    const postData = await getPostData(slug);
    return {
      title: postData.title,
      description: postData.excerpt || `Read the post: ${postData.title}`,
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return { title: 'Post Not Found' };
  }
}

// PostPage receives Props (where params is Promise)
export default async function PostPage({ params: paramsPromise }: Props) {
  const params = await paramsPromise; // Must await the params Promise
  const postId = params.slug;
  if (!postId) { notFound(); }

  try {
    const postData = await getPostData(postId);

    return (
      <div className="py-8 md:py-12">
         <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline group mb-8">
           <span aria-hidden="true" className="transition-transform group-hover:-translate-x-1">&larr;</span> Back to Blog List
         </Link>
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 border-b border-slate-200 dark:border-slate-700 pb-6">
            <h1 className="!text-3xl sm:!text-4xl lg:!text-5xl font-bold text-slate-900 dark:text-slate-100 mb-3">
              {postData.title}
            </h1>
            <p className="text-base text-slate-500 dark:text-slate-400 mt-0">
              Published on {postData.date}
            </p>
          </div>
          <article className="prose prose-lg dark:prose-invert max-w-none"
                   dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
          {/* Use the CommentSection component confirmed stable earlier */}
          <CommentSection postId={postId} />
        </div>
      </div>
    );
  } catch (error) {
    console.error(`Error fetching post data for slug "${postId}":`, error);
    notFound();
  }
}