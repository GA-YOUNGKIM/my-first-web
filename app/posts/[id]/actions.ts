"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createComment, deleteComment } from "@/lib/comments";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function createCommentAction(postId: string, formData: FormData) {
  const content = readString(formData, "content");

  if (!content) {
    throw new Error("댓글 내용을 입력해 주세요.");
  }

  await createComment({ postId, content });

  revalidatePath(`/posts/${postId}`);
  redirect(`/posts/${postId}#comments`);
}

export async function deleteCommentAction(postId: string, commentId: string) {
  await deleteComment(postId, commentId);

  revalidatePath(`/posts/${postId}`);
  redirect(`/posts/${postId}#comments`);
}