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

  // 좋아요 상태 고도화
  const [likesCount, setLikesCount] = useState<number>(0);
  const [isLikedByMe, setIsLikedByMe] = useState<boolean>(false); // 내가 눌렀는지 여부
  const [isLiking, setIsLiking] = useState<boolean>(false);

  // 댓글 관련 상태
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [isSubmittingComment, setIsSubmittingComment] = useState<boolean>(false);

  useEffect(() => {
    async function fetchPostAndData() {
      try {
        let decodedId = decodeURIComponent(id).trim().replace(/\/$/, "");
        const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(decodedId);

        if (!isValidUUID) {
          setErrorMsg("잘못된 형식의 게시글 ID입니다.");
          setLoading(false);
          return;
        }

        const supabase = createClient();

        // 1. 게시글 상세 조회
        const { data: postData, error: postError } = await supabase
          .from("posts")
          .select("id, title, content, created_at, user_id")
          .eq("id", decodedId)
          .maybeSingle();

        if (postError || !postData) {
          setErrorMsg("존재하지 않거나 불러올 수 없는 게시글입니다.");
          return;
        }
        setPost(postData);

        // 2. 좋아요 총 개수 및 내가 눌렀는지 실시간 조회
        const { data: likesData, error: likesError } = await supabase
          .from("likes")
          .select("user_id")
          .eq("post_id", decodedId);

        if (!likesError && likesData) {
          setLikesCount(likesData.length);
          // 로그인한 유저의 ID가 likes 목록에 있는지 검사
          if (user) {
            setIsLikedByMe(likesData.some((like) => like.user_id === user.id));
          }
        }

        // 3. 댓글 목록 받아오기
        const { data: commentData, error: commentError } = await supabase
          .from("comments")
          .select("id, content, created_at, user_id")
          .eq("post_id", decodedId)
          .order("created_at", { ascending: true });

        if (!commentError && commentData) setComments(commentData);

      } catch (err) {
        console.error(err);
        setErrorMsg("게시글 로드 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      fetchPostAndData();
    }
  }, [id, user, authLoading]);

  // ★ 1계정당 1좋아요 (토글 방식: 다시 누르면 취소) 처리 핸들러
  async function handleLike() {
    if (!user) {
      alert("로그인한 사용자만 좋아요를 누를 수 있습니다.");
      router.push("/login");
      return;
    }

    if (isLiking || !post) return;
    setIsLiking(true);

    const supabase = createClient();

    try {
      if (isLikedByMe) {
        // 이미 눌렀다면 ➡️ 좋아요 취소 (DELETE)
        const { error } = await supabase
          .from("likes")
          .delete()
          .eq("post_id", post.id)
          .eq("user_id", user.id);

        if (!error) {
          setLikesCount((prev) => Math.max(0, prev - 1));
          setIsLikedByMe(false);
        }
      } else {
        // 안 눌렀다면 ➡️ 좋아요 추가 (INSERT)
        const { error } = await supabase
          .from("likes")
          .insert({ post_id: post.id, user_id: user.id });

        if (!error) {
          setLikesCount((prev) => prev + 1);
          setIsLikedByMe(true);
        } else {
          // 혹시 모를 중복 에러 캐치
          console.error("좋아요 실패 (이미 존재할 수 있음):", error);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLiking(false);
    }
  }

  // 댓글 등록
  async function handleCommentSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return router.push("/login");
    if (!newComment.trim() || isSubmittingComment || !post) return;
    setIsSubmittingComment(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("comments")
        .insert({ post_id: post.id, user_id: user.id, content: newComment.trim() })
        .select().single();

      if (data && !error) {
        setComments([...comments, data]);
        setNewComment("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingComment(false);
    }
  }

  // 댓글 삭제
  async function handleCommentDelete(commentId: string) {
    if (!confirm("댓글을 정말 삭제하시겠습니까?")) return;
    try {
      const supabase = createClient();
      const { error } = await supabase.from("comments").delete().eq("id", commentId);
      if (!error) setComments(comments.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error(err);
    }
  }

  if (loading || authLoading) {
    return <div className="p-8 text-center text-zinc-400">불러오는 중...</div>;
  }

  if (errorMsg || !post) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 text-center text-zinc-500">
        {errorMsg || "게시글을 찾을 수 없습니다."}
      </div>
    );
  }

  const canManagePost = user?.id === post.user_id;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12 animate-in fade-in duration-300">
      <div className="mb-6 flex items-center justify-between gap-3">
        <Button asChild variant="ghost" className="h-10 px-3 text-muted-foreground hover:text-foreground rounded-xl">
          <Link href="/posts">← 목록으로 돌아가기</Link>
        </Button>
      </div>

      {/* 본문 카드 */}
      <Card className="overflow-hidden rounded-3xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
        <CardContent className="p-0">
          <header className="border-b border-zinc-100 dark:border-zinc-800 px-6 py-8 text-center">
            <time className="text-xs text-zinc-400">{new Date(post.created_at).toLocaleDateString("ko-KR")}</time>
            <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-3xl">{post.title}</h1>
            <p className="mt-4 text-[11px] text-zinc-400">작성자: {post.user_id.slice(0, 8)}...</p>
          </header>

          <div className="px-6 py-8 sm:px-10">
            <div className="whitespace-pre-wrap text-base leading-relaxed text-zinc-800 dark:text-zinc-200">{post.content}</div>

            {/* 영구 보존용 좋아요 버튼 컴포넌트 구조 */}
            <div className="mt-12 flex justify-center border-t border-zinc-100 dark:border-zinc-800 pt-6">
              <Button
                type="button"
                onClick={handleLike}
                disabled={isLiking}
                variant="outline"
                size="lg"
                className={`h-12 gap-2 rounded-full px-6 transition-all active:scale-95 ${isLikedByMe
                  ? "bg-red-50 dark:bg-red-950/20 text-red-600 border-red-200 dark:border-red-900/50"
                  : "hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  }`}
              >
                <Heart className={`h-5 w-5 transition-transform ${isLikedByMe ? "fill-red-500 text-red-500 scale-110" : "text-zinc-400"}`} />
                <span className="font-semibold text-sm">{isLikedByMe ? "좋아요 취소" : "좋아요"}</span>
                <span className="ml-1 rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 text-xs font-bold">
                  {likesCount}
                </span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 댓글 컴포넌트 */}
      <Card className="mt-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
        <CardContent className="p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-4">
            <MessageSquare className="h-5 w-5 text-zinc-400" />
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50">댓글 ({comments.length})</h2>
          </div>

          <form onSubmit={handleCommentSubmit} className="mb-6 space-y-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={user ? "따뜻한 댓글을 남겨보세요..." : "로그인 후 댓글을 작성할 수 있습니다."}
              disabled={!user || isSubmittingComment}
              rows={3}
              className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 resize-none"
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={!user || !newComment.trim() || isSubmittingComment} className="rounded-xl h-9 px-4 text-sm">
                댓글 등록
              </Button>
            </div>
          </form>

          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-center text-xs text-zinc-400 py-4">첫 댓글을 자리에 채워보세요.</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="group flex items-start justify-between border-b border-zinc-50 dark:border-zinc-800/50 pb-4 last:border-0">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-zinc-400">
                      <span>{comment.user_id === post.user_id ? "작성자" : `유저(${comment.user_id.slice(0, 4)})`}</span>
                      <span>•</span>
                      <span>{new Date(comment.created_at).toLocaleDateString("ko-KR")}</span>
                    </div>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">{comment.content}</p>
                  </div>
                  {user?.id === comment.user_id && (
                    <button onClick={() => handleCommentDelete(comment.id)} className="text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {canManagePost && <PostDetailActions postId={String(post.id)} postUserId={post.user_id} />}
    </div>
  );
}