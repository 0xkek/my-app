// src/app/blog/[slug]/page.tsx (Using await params workaround for Next.js 15)

import { getPostData, getAllPostIds } from '../../../../lib/posts'; // Check path
import { CommentSection } from '../../components/CommentSection';   // Check path (2 dots)
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  try {
    const paths = getAllPostIds();
    return paths.map(path => ({ slug: path.params.slug }));
  } catch (error) { console.error("Error generating static params:", error); return []; }
}

// Using await params pattern
export async function generateMetadata({ params: paramsPromise }: Props): Promise<Metadata> {
  try {
    const params = await paramsPromise; // Await prop
    const slug = params.slug;
    if (!slug) { throw new Error("Slug not found after await for metadata"); }

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

// Using await params pattern
export default async function PostPage({ params: paramsPromise }: Props) {
  const params = await paramsPromise; // Await prop
  const postId = params.slug;

  if (!postId) {
      console.error("No slug found after await for PostPage");
      notFound();
      return null; // Required after notFound in async component
  }

  try {
    const postData = await getPostData(postId);

    // Restore full return JSX (using prose-lg from previous state)
    return (
      <div className="py-8 md:py-12">
         <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline group mb-8">
           <span aria-hidden="true" className="transition-transform group-hover:-translate-x-1">&larr;</span> Back to Blog List
         </Link>

        <div className="max-w-3xl mx-auto">
          {/* Post Header */}
          <div className="mb-8 border-b border-slate-200 dark:border-slate-700 pb-6">
            <h1 className="!text-3xl sm:!text-4xl lg:!text-5xl font-bold text-slate-900 dark:text-slate-100 mb-3">
              {postData.title}
            </h1>
            <p className="text-base text-slate-500 dark:text-slate-400 mt-0">
              Published on {postData.date}
            </p>
          </div>

          {/* Post Content */}
          <article className="prose prose-lg dark:prose-invert max-w-none"
                   dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />

          {/* Comment Section */}
          <CommentSection postId={postId} />
        </div>
      </div>
    );
  } catch (error) {
    console.error(`Error fetching post data for slug "${postId}":`, error);
    notFound();
  }
}