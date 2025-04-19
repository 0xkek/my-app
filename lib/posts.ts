// lib/posts.ts (Cleaned up - Final Version for now)
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), '_posts');

interface PostFrontmatter {
  title: string;
  date: string;
  excerpt?: string;
  author?: string;
}

export interface PostListData {
  id: string;
  title: string;
  date: string;
  excerpt?: string;
  author?: string;
}

export interface PostFullData extends PostListData {
    contentHtml: string;
}

export function getSortedPostsData(): PostListData[] {
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames
      .filter((fileName) => fileName.endsWith('.md'))
      .map((fileName) => {
        const id = fileName.replace(/\.md$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);
        const postData = {
          id,
          ...(matterResult.data as PostFrontmatter),
        };
        return postData;
    });
    return allPostsData.sort((a, b) => {
      const dateA = a.date || '1970-01-01';
      const dateB = b.date || '1970-01-01';
      if (dateA < dateB) return 1;
      if (dateA > dateB) return -1;
      return 0;
    });
  } catch (error) {
      console.error("Error reading posts directory or files:", error);
      return [];
  }
}

export async function getPostData(id: string): Promise<PostFullData> {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  if (!fs.existsSync(fullPath)) {
     throw new Error(`Post file not found for id: ${id}`);
  }
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();
  const postData = {
    id,
    contentHtml,
    ...(matterResult.data as PostFrontmatter),
  };
  return postData;
}

export function getAllPostIds() {
    try {
        const fileNames = fs.readdirSync(postsDirectory);
        const paths = fileNames
            .filter((fileName) => fileName.endsWith('.md'))
            .map((fileName) => {
                return {
                    params: {
                        slug: fileName.replace(/\.md$/, ''),
                    },
                };
            });
        return paths;
    } catch (error) {
        console.error("Error reading post IDs:", error);
        return [];
    }
}