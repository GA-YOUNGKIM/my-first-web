import { createClient } from "@/lib/supabase/server";

export interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  date: string;
}

export async function getCommentsByPostId(postId: string): Promise<Comment[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("comments")
    .select(`
      id,
      post_id,
      user_id,
      content,
      created_at,
      profiles (
        username
      )
    `)
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("댓글 조회 실패:", error);
    return [];
  }

  return (data || []).map((item: any) => ({
    id: item.id,
    postId: item.post_id,
    author: item.profiles?.username || "익명",
    content: item.content,
    date: new Date(item.created_at).toLocaleDateString("ko-KR"),
  }));
}

export async function createComment(input: { postId: string; content: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  const { data, error } = await supabase
    .from("comments")
    .insert({
      post_id: input.postId,
      user_id: user.id,
      content: input.content,
    })
    .select()
    .single();

  if (error) {
    throw new Error("댓글 작성에 실패했습니다: " + error.message);
  }

  return data;
}

export async function deleteComment(postId: string, commentId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error("댓글 삭제에 실패했습니다: " + error.message);
  }

  return true;
}