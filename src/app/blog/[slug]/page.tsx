// src/app/blog/[slug]/page.tsx

// Corrected import path
import { getPostData, getAllPostIds } from '../../../../lib/posts';
import { notFound } from 'next/navigation'; // Import notFound for handling errors
import type { Metadata } from 'next'; // For setting page title
import Link from 'next/link'; // Import Link for back navigation

// Define props type, including the 'slug' param from the folder name '[slug]'
type Props = {
  params: {
    slug: string; // This 'slug' matches the folder name '[slug]'
  };
};

// --- Optional but recommended: generateStaticParams ---
// This tells Next.js ahead of time which slugs exist, improving performance
// If you skip this, pages will be generated on demand the first time they are visited
export async function generateStaticParams() {
  const paths = getAllPostIds();
  // The paths should look like: [ { params: { slug: 'post-1' } }, { params: { slug: 'post-2' } } ]
  // We just need the slug values: [ { slug: 'post-1' }, { slug: 'post-2' } ]
  return paths.map(path => ({
    slug: path.params.slug,
  }));
}

// Optional: Function to generate metadata (like page title) dynamically
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const postData = await getPostData(params.slug);
    return {
      title: postData.title, // Set browser tab title to post title
      description: postData.excerpt || 'A blog post.', // Use excerpt for meta description
    };
  } catch (error) {
    return {
      title: 'Post Not Found',
    };
  }
}


// The main page component - needs to be async to fetch data
export default async function PostPage({ params }: Props) {
  const postId = params.slug; // Get the slug (e.g., 'first-markdown-post') from the URL

  try {
    // Fetch the specific post data, including HTML content, based on the slug
    const postData = await getPostData(postId);

    // Render the post
    return (
      <div> {/* Added a wrapper div */}
        {/* Back link */}
        <Link href="/blog" className="text-blue-600 hover:underline mb-6 inline-block">
          &larr; Back to Blog List
        </Link>

        <article className="prose lg:prose-xl max-w-none dark:prose-invert">
          {/* Post Title */}
          <h1 className="mb-2">{postData.title}</h1>
          {/* Post Date & Author */}
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-0 mb-8">
            Published on {postData.date}
            {postData.author && ` by ${postData.author}`} {/* Conditionally show author */}
          </div>

          {/* Post Content (rendered from HTML string) */}
          <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        </article>
      </div>
    );
  } catch (error) {
    // If getPostData fails (e.g., file not found for the slug), show Next.js 404 page
    console.error(`Error fetching post data for slug "${postId}":`, error);
    notFound();
  }
}