// src/app/blog/[slug]/page.tsx (Restored Full Version)

import { getPostData, getAllPostIds } from '../../../../lib/posts'; // Check lib path (4 dots likely correct)
import { CommentSection } from '../../components/CommentSection';   // Use CORRECT components path (2 dots)
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  // Assuming getAllPostIds works correctly
  try {
    const paths = getAllPostIds();
    return paths.map(path => ({ slug: path.params.slug }));
  } catch (error) { console.error("Error generating static params:", error); return []; }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Assuming getPostData works correctly
   try {
    // Using params directly - deferring the 'params promise' issue for now
    const postData = await getPostData(params.slug);
    return {
      title: postData.title,
      description: postData.excerpt || `Read the post: ${postData.title}`,
    };
  } catch (error) { return { title: 'Post Not Found' }; }
}

export default async function PostPage({ params }: Props) {
  // Using params directly - deferring the 'params promise' issue for now
  const postId = params.slug;

  if (!postId) {
    notFound(); return null;
  }

  try {
    // Re-enable fetching post data
    const postData = await getPostData(postId);

    return (
      <div className="py-8 md:py-12">
         <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline group mb-8">
           <span aria-hidden="true" className="transition-transform group-hover:-translate-x-1">&larr;</span> Back to Blog List
         </Link>

        <div className="max-w-3xl mx-auto">
          {/* Restore Post Header */}
          <div className="mb-8 border-b border-slate-200 dark:border-slate-700 pb-6">
            <h1 className="!text-3xl sm:!text-4xl lg:!text-5xl font-bold text-slate-900 dark:text-slate-100 mb-3">
              {postData.title}
            </h1>
            <p className="text-base text-slate-500 dark:text-slate-400 mt-0">
              Published on {postData.date}
              {/* Author logic removed earlier */}
            </p>
          </div>

          {/* Restore Article content rendering */}
          {/* Revert prose class to original responsive default */}
          <article className="prose lg:prose-xl dark:prose-invert max-w-none"
                   dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />

          {/* Restore Comment Section */}
          <CommentSection postId={postId} />
        </div>
      </div>
    );
  } catch (error) {
    console.error(`Error fetching post data for slug "${postId}":`, error);
    notFound();
  }
}