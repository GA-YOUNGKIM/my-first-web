import { promises as fs } from "node:fs";
import path from "node:path";

export interface Comment {
  id: number;
  postId: number;
  author: string;
  content: string;
  date: string;
}

const dataDir = path.join(process.cwd(), "data");
const commentsFile = path.join(dataDir, "comments.json");

async function ensureCommentsFile() {
  await fs.mkdir(dataDir, { recursive: true });

  try {
    await fs.access(commentsFile);
  } catch {
    await fs.writeFile(commentsFile, "[]", "utf8");
  }
}

async function readComments(): Promise<Comment[]> {
  await ensureCommentsFile();
  const raw = await fs.readFile(commentsFile, "utf8");

  try {
    const parsed = JSON.parse(raw) as Comment[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeComments(comments: Comment[]) {
  await fs.writeFile(commentsFile, JSON.stringify(comments, null, 2), "utf8");
}

export async function getCommentsByPostId(postId: number) {
  const comments = await readComments();
  return comments
    .filter((comment) => comment.postId === postId)
    .sort((a, b) => a.id - b.id);
}

export async function createComment(input: { postId: number; author: string; content: string }) {
  const comments = await readComments();
  const nextId = comments.length ? Math.max(...comments.map((comment) => comment.id)) + 1 : 1;

  const comment: Comment = {
    id: nextId,
    postId: input.postId,
    author: input.author,
    content: input.content,
    date: new Date().toISOString().slice(0, 10),
  };

  comments.push(comment);
  await writeComments(comments);

  return comment;
}

export async function deleteComment(postId: number, commentId: number) {
  const comments = await readComments();
  const nextComments = comments.filter(
    (comment) => !(comment.postId === postId && comment.id === commentId)
  );

  if (nextComments.length === comments.length) {
    return false;
  }

  await writeComments(nextComments);
  return true;
}