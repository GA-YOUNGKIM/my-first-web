"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PostDetailActions } from "@/components/post-detail-actions";
import { Heart } from "lucide-react";
import { getUserFriendlyErrorMessage } from "@/lib/error-message";

export default function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [post, setPost] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [likesCount, setLikesCount] = useState<number>(0);
  const [isLiking, setIsLiking] = useState<boolean>(false);

  useEffect(() => {
    async function fetchPost() {
      try {
        let decodedId = decodeURIComponent(id).trim();
        decodedId = decodedId.replace(/\/$/, "");
        
        const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(decodedId);

        if (!isValidUUID) {
          console.error("정규식 검증 실패한 ID 값:", decodedId);
          setErrorMsg("잘못된 형식의 게시글 ID입니다.");
          setLoading(false);
          return;
        }

        const supabase = createClient();
        const { data, error } = await supabase
          .from("posts")
          .select("id, title, content, created_at, user_id")
          .eq("id", decodedId)
          .maybeSingle();

        if (error) {
          console.error("게시글 상세 조회 실패:", error);
          setErrorMsg("게시글 상세를 불러오지 못했습니다.");
          return;
        }

        if (!data) {
          setErrorMsg("존재하지 않는 게시글입니다.");
          return;
        }

        setPost(data);
        // DB에 likes_count 컬럼이 없으므로 로컬 상태로만 관리
        setLikesCount(0);
      } catch (err) {
        console.error("예외 발생:", err);
        setErrorMsg("게시글 상세를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [id]);

  async function handleLike() {
    if (!user) {
      alert("로그인한 사용자만 좋아요를 누를 수 있습니다.");
      router.push("/login");
      return;
    }

    if (isLiking || !post) return;
    setIsLiking(true);

    try {
      const nextLikesCount = likesCount + 1;
      
      // DB에 likes_count 컬럼이 존재하지 않으므로 API 호출 제거 (UI 상태만 업데이트)
      setLikesCount(nextLikesCount);
    } catch (err) {
      console.error("좋아요 중 예외 발생:", err);
    } finally {
      setIsLiking(false);
    }
  }

  if (loading || authLoading) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-3">
            <div className="h-10 w-36 animate-pulse rounded-full bg-muted" />
            <div className="h-4 w-32 animate-pulse rounded-full bg-muted" />
          </div>

          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="px-5 py-7 text-center sm:px-8 sm:py-10">
              <div className="mx-auto max-w-2xl space-y-4">
                <div className="h-4 w-full animate-pulse rounded-full bg-muted" />
                <div className="h-4 w-11/12 animate-pulse rounded-full bg-muted" />
                <div className="h-4 w-10/12 animate-pulse rounded-full bg-muted" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (errorMsg || !post) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        <Card className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <CardContent className="px-6 py-10 text-center text-sm text-muted-foreground">
            {errorMsg || "게시글을 찾을 수 없습니다."}
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentUserId = user?.id ?? null;
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

            {/* 좋아요(추천) 버튼 추가 */}
            <div className="mt-12 flex justify-center border-t border-border/70 pt-6">
              <Button
                type="button"
                onClick={handleLike}
                disabled={isLiking}
                variant="outline"
                size="lg"
                className="h-12 gap-2 rounded-full px-6 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all active:scale-95"
              >
                <Heart className={`h-5 w-5 ${likesCount > 0 ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
                <span className="font-semibold text-sm">좋아요</span>
                <span className="ml-1 rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground font-bold">
                  {likesCount}
                </span>
              </Button>
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
