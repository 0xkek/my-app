// src/app/blog/[slug]/page.tsx (Restored Full Logic + await params Fix)

import { getPostData, getAllPostIds } from '../../../../lib/posts';
import { CommentSection } from '../../components/CommentSection'; // Use 2 dots path
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

export async function generateMetadata({ params: paramsPromise }: Props): Promise<Metadata> { // Rename prop
  try {
    const params = await paramsPromise; // Await the prop
    const slug = params.slug;
    if (!slug) { throw new Error("Slug not found after await for metadata"); }

    // Re-enable data fetching
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

export default async function PostPage({ params: paramsPromise }: Props) { // Rename prop
  const params = await paramsPromise; // Await the prop
  const postId = params.slug; // Use the resolved params

  if (!postId) {
      console.error("No slug found after await for PostPage");
      notFound();
      return null;
  }

  try {
    // Re-enable data fetching
    const postData = await getPostData(postId);

    // Restore full return JSX
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
            </p>
          </div>

          {/* Restore Article content rendering */}
          {/* Use prose-lg based on Step 75 */}
          <article className="prose prose-lg dark:prose-invert max-w-none"
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