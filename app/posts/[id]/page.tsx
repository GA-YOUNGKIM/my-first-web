import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PostDetailActions } from "@/components/post-detail-actions";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const currentUserResult = await supabase.auth.getUser();
  const { data: post, error } = await supabase
    .from("posts")
    .select("id, title, content, created_at, user_id")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error(`게시글 ${id} 상세를 불러오지 못했습니다.`, error);
    throw new Error("게시글 상세를 불러오지 못했습니다.");
  }

  if (!post) {
    notFound();
  }

  // 이 UI 분기(canManagePost)는 단순히 사용자 편의를 위한 버튼 노출 제어용입니다.
  // 실제 수정 및 삭제 동작에 대한 강력한 보안 통제는 데이터베이스 레벨의 Ch11 RLS 정책이 담당합니다.
  const currentUserId = currentUserResult.data.user?.id ?? null;
  const canManagePost = currentUserId === post.user_id;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-6 flex items-center justify-between gap-3">
        <Button asChild variant="ghost" className="h-10 px-3 text-muted-foreground hover:text-foreground">
          <Link href="/posts">← 목록으로 돌아가기</Link>
        </Button>
        <p className="text-sm text-muted-foreground">읽기 편한 본문 중심 페이지</p>
      </div>

      <Card className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <CardContent className="p-0">
          <header className="border-b border-border/70 px-5 py-7 text-center sm:px-8 sm:py-8">
            <div className="mb-4 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="rounded-full bg-muted px-3 py-1 font-semibold uppercase tracking-wide text-muted-foreground">
                post
              </span>
              <time className="font-medium text-muted-foreground" dateTime={post.created_at}>
                {new Date(post.created_at).toLocaleDateString("ko-KR")}
              </time>
            </div>

            <h1 className="mx-auto max-w-3xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>

            <p className="mt-6 text-xs text-muted-foreground">작성자 ID: {post.user_id}</p>
          </header>

          <div className="px-5 py-7 sm:px-8 sm:py-10">
            <div className="mx-auto max-w-2xl whitespace-pre-wrap text-base leading-8 text-foreground sm:text-[1.05rem]">
              {post.content}
            </div>

          </div>
        </CardContent>
      </Card>

      <Card className="mt-6 rounded-3xl border border-border bg-background">
        <CardContent className="flex flex-col items-center gap-4 px-6 py-8 text-center sm:px-8">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">도움이 되셨나요?</h3>
            <p className="text-sm leading-7 text-muted-foreground">
              더 많은 글을 읽고 싶다면 목록으로 돌아가 보세요.
            </p>
          </div>
          <Button asChild className="h-11 px-6 font-medium">
            <Link href="/posts">다른 글 보기</Link>
          </Button>
        </CardContent>
      </Card>

      {canManagePost ? (
        <PostDetailActions postId={String(post.id)} postUserId={post.user_id} />
      ) : null}
    </div>
  );
}
