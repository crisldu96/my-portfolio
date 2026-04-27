import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

export type BlogPostFrontmatter = {
  title: string;
  description: string;
  date: string;
  tags: string[];
  slug: string;
  author: string;
  image?: string;
};

export type BlogPost = BlogPostFrontmatter & {
  readingTime: string;
  content: string;
};

function getMdxFiles(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"));
}

function parsePost(filename: string): BlogPost | null {
  const filePath = path.join(CONTENT_DIR, filename);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  const frontmatter = data as BlogPostFrontmatter;

  if (!frontmatter.title || !frontmatter.date || !frontmatter.slug) {
    return null;
  }

  return {
    ...frontmatter,
    content,
    readingTime: readingTime(content).text,
  };
}

export function getAllPosts(): BlogPost[] {
  return getMdxFiles()
    .map(parsePost)
    .filter((post): post is BlogPost => post !== null)
    .sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
}

export function getPostBySlug(slug: string): BlogPost | null {
  const files = getMdxFiles();

  for (const filename of files) {
    const post = parsePost(filename);
    if (post?.slug === slug) return post;
  }

  return null;
}

export function getAllSlugs(): string[] {
  return getAllPosts().map((post) => post.slug);
}

export function getRecentPosts(limit = 3): BlogPost[] {
  return getAllPosts().slice(0, limit);
}
