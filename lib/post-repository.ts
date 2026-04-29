import { promises as fs } from "node:fs";
import path from "node:path";
import { seedPosts, type Post } from "@/lib/posts";

const dataDir = path.join(process.cwd(), "data");
const postsFile = path.join(dataDir, "posts.json");

async function ensurePostsFile() {
  await fs.mkdir(dataDir, { recursive: true });

  try {
    await fs.access(postsFile);
  } catch {
    await fs.writeFile(postsFile, JSON.stringify(seedPosts, null, 2), "utf8");
  }
}

async function readPosts(): Promise<Post[]> {
  await ensurePostsFile();
  const raw = await fs.readFile(postsFile, "utf8");

  try {
    const parsed = JSON.parse(raw) as Post[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writePosts(posts: Post[]) {
  await fs.writeFile(postsFile, JSON.stringify(posts, null, 2), "utf8");
}

export async function getPosts() {
  const posts = await readPosts();
  return posts.sort((a, b) => b.id - a.id);
}

export async function getPostById(id: number) {
  const posts = await readPosts();
  return posts.find((post) => post.id === id) ?? null;
}

export async function createPost(input: { title: string; content: string; author: string }) {
  const posts = await readPosts();
  const nextId = posts.length ? Math.max(...posts.map((post) => post.id)) + 1 : 1;

  const post: Post = {
    id: nextId,
    title: input.title,
    content: input.content,
    author: input.author,
    date: new Date().toISOString().slice(0, 10),
  };

  posts.push(post);
  await writePosts(posts);
  return post;
}

export async function updatePost(
  id: number,
  input: { title: string; content: string }
): Promise<Post | null> {
  const posts = await readPosts();
  const index = posts.findIndex((post) => post.id === id);

  if (index === -1) {
    return null;
  }

  const updatedPost: Post = {
    ...posts[index],
    title: input.title,
    content: input.content,
  };

  posts[index] = updatedPost;
  await writePosts(posts);
  return updatedPost;
}

export async function deletePost(id: number) {
  const posts = await readPosts();
  const nextPosts = posts.filter((post) => post.id !== id);

  if (nextPosts.length === posts.length) {
    return false;
  }

  await writePosts(nextPosts);
  return true;
}
