"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createComment, deleteComment } from "@/lib/comments";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function createCommentAction(postId: number, formData: FormData) {
  const author = readString(formData, "author") || "익명";
  const content = readString(formData, "content");

  if (!content) {
    throw new Error("댓글 내용을 입력해 주세요.");
  }

  await createComment({ postId, author, content });

  revalidatePath(`/posts/${postId}`);
  redirect(`/posts/${postId}#comments`);
}

export async function deleteCommentAction(postId: number, commentId: number) {
  await deleteComment(postId, commentId);

  revalidatePath(`/posts/${postId}`);
  redirect(`/posts/${postId}#comments`);
}