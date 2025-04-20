// src/app/blog/[slug]/page.tsx (Using prose-lg for content size - Checked)

// Corrected import path for your structure
import { getPostData, getAllPostIds } from '../../../../lib/posts';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';

type Props = {
  params: { slug: string };
};

// Optional but recommended: generateStaticParams
export async function generateStaticParams() {
  const paths = getAllPostIds();
  return paths.map(path => ({
    slug: path.params.slug,
  }));
}

// Optional: Generate dynamic metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const postData = await getPostData(params.slug);
    return {
      title: postData.title,
      description: postData.excerpt || `Read the post: ${postData.title}`,
    };
  } catch (error) {
    return { title: 'Post Not Found' };
  }
}

// The main page component
export default async function PostPage({ params }: Props) {
  const postId = params.slug;

  try {
    const postData = await getPostData(postId);

    return (
      // Overall vertical padding
      <div className="py-8 md:py-12">
         {/* Back link */}
        <Link href="/blog"
              className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline group mb-8">
           <span aria-hidden="true" className="transition-transform group-hover:-translate-x-1">&larr;</span> Back to Blog List
        </Link>

        {/* Centered content column */}
        <div className="max-w-3xl mx-auto">
          {/* Post Header section */}
          <div className="mb-8 border-b border-slate-200 dark:border-slate-700 pb-6">
            <h1 className="!text-3xl sm:!text-4xl lg:!text-5xl font-bold text-slate-900 dark:text-slate-100 mb-3">
              {postData.title}
            </h1>
            <p className="text-base text-slate-500 dark:text-slate-400 mt-0">
              Published on {postData.date}
              {postData.author && <span className="italic"> by {postData.author}</span>}
            </p>
          </div>

          {/* Article content styled by prose */}
          {/* --- Ensure this line uses prose-lg --- */}
          <article className="prose prose-lg dark:prose-invert max-w-none"
                   dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
          {/* -------------------------------------- */}
        </div>
      </div>
    );
  } catch (error) {
    // If post not found, show 404
    console.error(`Error fetching post data for slug "${postId}":`, error);
    notFound();
  }
}