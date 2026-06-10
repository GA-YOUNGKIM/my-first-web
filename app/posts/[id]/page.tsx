"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PostDetailActions } from "@/components/post-detail-actions";
import { Heart, MessageSquare, Trash2 } from "lucide-react";
import { getUserFriendlyErrorMessage } from "@/lib/error-message";

export default function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // 게시글 관련 상태
  const [post, setPost] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [likesCount, setLikesCount] = useState<number>(0);
  const [isLiking, setIsLiking] = useState<boolean>(false);

  // 댓글 관련 상태 계층 추가
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState<string>(" ");
  const [isSubmittingComment, setIsSubmittingComment] = useState<boolean>(false);

  useEffect(() => {
    async function fetchPostAndComments() {
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

        // 1. 게시글 상세 정보 받아오기
        const { data: postData, error: postError } = await supabase
          .from("posts")
          .select("id, title, content, created_at, user_id")
          .eq("id", decodedId)
          .maybeSingle();

        if (postError) {
          console.error("게시글 상세 조회 실패:", postError);
          setErrorMsg("게시글 상세를 불러오지 못했습니다.");
          return;
        }

        if (!postData) {
          setErrorMsg("존재하지 않는 게시글입니다.");
          return;
        }

        setPost(postData);
        // DB 스키마 예외에 맞춘 로컬 좋아요 카운트 동기화
        setLikesCount(0);

        // 2. 해당 게시글에 매핑된 실시간 댓글 목록 받아오기
        const { data: commentData, error: commentError } = await supabase
          .from("comments")
          .select("id, content, created_at, user_id")
          .eq("post_id", decodedId)
          .order("created_at", { ascending: true });

        if (!commentError && commentData) {
          setComments(commentData);
        } else if (commentError) {
          console.error("댓글 로드 실패:", commentError);
        }
      } catch (err) {
        console.error("예외 발생:", err);
        setErrorMsg("게시글 상세를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    }

    fetchPostAndComments();
  }, [id]);

  // 좋아요 클릭 핸들러 (UI 로컬 상태 반영 구조 보존)
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
      setLikesCount(nextLikesCount);
    } catch (err) {
      console.error("좋아요 중 예외 발생:", err);
    } finally {
      setIsLiking(false);
    }
  }

  // 댓글 작성 처리 함수 (INSERT)
  async function handleCommentSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      alert("로그인한 사용자만 댓글을 작성할 수 있습니다.");
      router.push("/login");
      return;
    }

    if (!newComment.trim() || isSubmittingComment || !post) return;
    setIsSubmittingComment(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("comments")
        .insert({
          post_id: post.id,
          user_id: user.id,
          content: newComment.trim(),
        })
        .select()
        .single();

      if (error) {
        console.error("댓글 등록 실패:", error);
        alert("댓글을 등록하지 못했습니다. RLS 정책이나 테이블 구성을 확인해 주세요.");
        return;
      }

      if (data) {
        setComments([...comments, data]);
        setNewComment("");
      }
    } catch (err) {
      console.error("댓글 등록 중 예외 발생:", err);
    } finally {
      setIsSubmittingComment(false);
    }
  }

  // 댓글 삭제 처리 함수 (DELETE)
  async function handleCommentDelete(commentId: string) {
    if (!confirm("댓글을 정말 삭제하시겠습니까?")) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId);

      if (error) {
        console.error("댓글 삭제 실패:", error);
        alert("댓글 삭제 권한이 없거나 실패했습니다.");
        return;
      }

      setComments(comments.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error("댓글 삭제 중 예외 발생:", err);
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
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm h-64 animate-pulse" />
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

      {/* 게시글 메인 카드 영역 */}
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

      {/* 실시간 댓글 UI 컴포넌트 추가 계층 */}
      <Card className="mt-6 rounded-3xl border border-border bg-card shadow-sm">
        <CardContent className="p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-2 border-b border-border/50 pb-4">
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">댓글 ({comments.length})</h2>
          </div>

          {/* 댓글 입력 영역 */}
          <form onSubmit={handleCommentSubmit} className="mb-8 space-y-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={user ? "댓글을 입력하세요..." : "로그인 후 댓글을 작성할 수 있습니다."}
              disabled={!user || isSubmittingComment}
              rows={3}
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none focus:ring-0 disabled:opacity-60 resize-none transition-all"
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={!user || !newComment.trim() || isSubmittingComment} className="rounded-xl h-10 px-5 text-sm">
                {isSubmittingComment ? "등록 중..." : "댓글 등록"}
              </Button>
            </div>
          </form>

          {/* 댓글 출력 리스트 */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-4">등록된 댓글이 없습니다. 첫 댓글을 남겨보세요!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="group border-b border-border/40 pb-4 last:border-b-0 last:pb-0 flex items-start justify-between gap-4">
                  <div className="space-y-1 max-w-[85%]">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-muted-foreground truncate max-w-[150px]">
                        {comment.user_id === post.user_id ? "작성자" : `유저 (${comment.user_id.slice(0, 4)})`}
                      </span>
                      <span className="text-[10px] text-muted-foreground/70">
                        {new Date(comment.created_at).toLocaleDateString("ko-KR")}
                      </span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                  </div>

                  {/* 댓글 작성자만 삭제 버튼 활성화 */}
                  {user?.id === comment.user_id && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCommentDelete(comment.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))
            )}
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