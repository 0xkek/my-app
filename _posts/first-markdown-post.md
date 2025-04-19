// lib/posts.ts
import fs from 'fs'; // Node.js file system module
import path from 'path'; // Node.js path module
import matter from 'gray-matter'; // Library to parse frontmatter

// Find the absolute path to the '_posts' directory
const postsDirectory = path.join(process.cwd(), '_posts');

// Define the expected structure of your frontmatter data
interface PostFrontmatter {
  title: string;
  date: string;
  excerpt?: string; // Optional fields marked with ?
  author?: string;
}

// Define the structure for the data we'll return for each post in the list
export interface PostListData {
  id: string; // This will be the filename without .md (the 'slug')
  title: string;
  date: string;
  excerpt?: string;
  author?: string;
}

export function getSortedPostsData(): PostListData[] {
  // Get all filenames inside the '_posts' directory
  const fileNames = fs.readdirSync(postsDirectory);

  const allPostsData = fileNames
    // Optional: Filter out any non-markdown files
    .filter((fileName) => fileName.endsWith('.md'))
    // Process each markdown file
    .map((fileName) => {
      // Create the post ID (slug) by removing '.md' from the filename
      const id = fileName.replace(/\.md$/, '');

      // Construct the full path to the markdown file
      const fullPath = path.join(postsDirectory, fileName);
      // Read the content of the file
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // Use gray-matter to parse the frontmatter and content
      // We only need the 'data' (frontmatter) for this function
      const matterResult = matter(fileContents);

      // Combine the extracted data (frontmatter) with the id
      const postData = {
        id,
        ...(matterResult.data as PostFrontmatter), // Type assertion here
      };
      return postData;
  });

  // Sort posts by date, newest first
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1; // a should come after b
    } else {
      return -1; // a should come before b
    }
  });
}

// --- We still need to add functions later to get FULL post content including HTML ---