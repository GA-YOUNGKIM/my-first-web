import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PostEditForm } from "@/components/post-edit-form";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: post, error } = await supabase
    .from("posts")
    .select("id, title, content, user_id")
    .eq("id", id)
    .maybeSingle();

  if (error || !post) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <Button asChild variant="ghost" className="text-sm font-medium text-muted-foreground hover:text-primary">
          <Link href={`/posts/${post.id}`}>← 상세로 돌아가기</Link>
        </Button>
        <h1 className="text-3xl font-bold text-foreground mt-6 tracking-tight">게시글 수정</h1>
      </div>

      <PostEditForm
        postId={post.id}
        postUserId={post.user_id}
        initialTitle={post.title}
        initialContent={post.content}
      />
    </div>
  );
}
