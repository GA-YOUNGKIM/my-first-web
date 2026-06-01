import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { updatePostAction } from "@/app/posts/actions";

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

  if (error) {
    console.error(`게시글 ${id} 수정 화면을 불러오지 못했습니다.`, error);
    throw new Error("게시글 수정 화면을 불러오지 못했습니다.");
  }

  if (!post) {
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

      <form action={updatePostAction.bind(null, String(post.id))} className="space-y-6">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-foreground">제목</label>
          <input
            name="title"
            defaultValue={post.title}
            required
            className="w-full h-11 rounded-xl border border-border px-4"
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-foreground">내용</label>
          <textarea
            name="content"
            defaultValue={post.content}
            required
            rows={10}
            className="w-full min-h-64 rounded-xl border border-border px-4 py-3"
          />
        </div>

        <div className="flex gap-3">
          <button type="submit" className="h-11 rounded-xl bg-primary px-6 text-primary-foreground">
            저장
          </button>
          <Link href={`/posts/${post.id}`} className="h-11 rounded-xl border px-6 py-2">
            취소
          </Link>
        </div>
      </form>
    </div>
  );
}
