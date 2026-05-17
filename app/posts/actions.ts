"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createPost, deletePost, updatePost } from "@/lib/post-repository";
import { getCurrentUser } from "@/lib/supabase/server";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function createPostAction(formData: FormData) {
  const title = readString(formData, "title");
  const content = readString(formData, "content");

  if (!title || !content) {
    throw new Error("제목과 내용을 입력해 주세요.");
  }

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const post = await createPost({
    title,
    content,
    author: user.email || "익명",
  });

  revalidatePath("/posts");
  redirect(`/posts/${post.id}`);
}

export async function updatePostAction(id: number, formData: FormData) {
  const title = readString(formData, "title");
  const content = readString(formData, "content");

  if (!title || !content) {
    throw new Error("제목과 내용을 입력해 주세요.");
  }

  const post = await updatePost(id, { title, content });

  if (!post) {
    throw new Error("수정할 게시글이 없습니다.");
  }

  revalidatePath("/posts");
  revalidatePath(`/posts/${id}`);
  redirect(`/posts/${id}`);
}

export async function deletePostAction(id: number) {
  await deletePost(id);
  revalidatePath("/posts");
  redirect("/posts");
}
