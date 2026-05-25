"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient, getCurrentUser } from "@/lib/supabase/server";

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

  const supabase = await createClient();
  const { data: post, error } = await supabase
    .from("posts")
    .insert({
      title,
      content,
      user_id: user.id,
    })
    .select("id")
    .single();

  if (error || !post) {
    throw new Error("게시글을 저장할 수 없습니다.");
  }

  revalidatePath("/posts");
  redirect(`/posts/${post.id}`);
}

export async function updatePostAction(id: string, formData: FormData) {
  const title = readString(formData, "title");
  const content = readString(formData, "content");

  if (!title || !content) {
    throw new Error("제목과 내용을 입력해 주세요.");
  }

  const supabase = await createClient();
  const { data: post, error } = await supabase
    .from("posts")
    .update({ title, content })
    .eq("id", id)
    .select("id")
    .single();

  if (error || !post) {
    throw new Error("수정할 게시글이 없습니다.");
  }

  revalidatePath("/posts");
  revalidatePath(`/posts/${id}`);
  redirect(`/posts/${id}`);
}

export async function deletePostAction(id: number) {
  const supabase = await createClient();
  const { error } = await supabase.from("posts").delete().eq("id", id);

  if (error) {
    throw new Error("게시글을 삭제할 수 없습니다.");
  }

  revalidatePath("/posts");
  redirect("/posts");
}
