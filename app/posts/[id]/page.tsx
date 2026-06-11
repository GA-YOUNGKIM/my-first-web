"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft, Trash2, Edit } from "lucide-react";

export default function PostDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { user } = useAuth();

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [likesCount, setLikesCount] = useState(0);
  const [isLikedByMe, setIsLikedByMe] = useState(false);

  // 💡 초기값을 확실하게 빈 배열([])로 고정해 둡니다.
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (id) {
      fetchPostDetails();
      fetchComments();
    }
  }, [id, user]);

  async function fetchPostDetails() {
    try {
      setLoading(true);
      const supabase = createClient();

      const { data: postData, error: postError } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      if (postError) throw postError;
      setPost(postData);

      const { data: likesData, error: likesError } = await supabase
        .from("likes")
        .select("*")
        .eq("post_id", id);

      if (likesError) throw likesError;
      setLikesCount(likesData ? likesData.length : 0);

      if (user && likesData) {
        setIsLikedByMe(likesData.some((like: any) => like.user_id === user.id));
      }
    } catch (error) {
      console.error("게시글 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchComments() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error("댓글 로드 실패:", error);
      // 💡 에러가 나더라도 다음 컴포넌트가 뻗지 않도록 강제로 빈 배열을 먹여 줍니다.
      setComments([]);
    }
  }

  async function handleCommentSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!newComment.trim()) return;

    try {
      const supabase = createClient();
      const { error } = await supabase.from("comments").insert([
        {
          post_id: id,
          user_id: user.id,
          content: newComment.trim()
        },
      ]);

      if (error) {
        const { error: retryError } = await supabase.from("comments").insert([
          {
            post_id: id,
            user_id: user.id,
            content: newComment.trim(),
            author_email: user.email
          },
        ]);
        if (retryError) throw retryError;
      }

      setNewComment("");
      fetchComments();
    } catch (error: any) {
      console.error("최종 댓글 등록 실패 로그:", error);
      alert(`댓글 작성에 실패했습니다.\n사유: ${error.message || "권한(RLS) 제한 혹은 테이블 필드 불일치"}`);
    }
  }

  async function handleCommentDelete(commentId: string) {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;
    try {
      const supabase = createClient();
      const { error } = await supabase.from("comments").delete().eq("id", commentId);
      if (error) throw error;
      fetchComments();
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
    }
  }

  async function handleLikeToggle() {
    if (!user) {
      alert("로그인이 필요한 서비스입니다.");
      router.push("/login");
      return;
    }

    const supabase = createClient();

    if (isLikedByMe) {
      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("post_id", id)
        .eq("user_id", user.id);

      if (!error) {
        setIsLikedByMe(false);
        setLikesCount((prev) => prev - 1);
      }
    } else {
      const { error } = await supabase
        .from("likes")
        .insert([{ post_id: id, user_id: user.id }]);

      if (!error) {
        setIsLikedByMe(true);
        setLikesCount((prev) => prev + 1);
      }
    }
  }

  async function handleDeletePost() {
    if (!confirm("정말로 이 게시글을 삭제하시겠습니까?")) return;

    try {
      const supabase = createClient();
      const { error } = await supabase.from("posts").delete().eq("id", id);
      if (error) throw error;

      alert("게시글이 성공적으로 삭제되었습니다.");
      router.push("/posts");
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제에 실패했습니다.");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-zinc-500">
        게시글을 불러오는 중입니다...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="text-zinc-500 dark:text-zinc-400">게시글을 찾을 수 없습니다.</p>
        <Button asChild variant="link" className="mt-4">
          <Link href="/posts">목록으로 돌아가기</Link>
        </Button>
      </div>
    );
  }

  const isAuthor = user && post.user_id === user.id;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-12">
      <Button asChild variant="ghost" className="mb-4 -ml-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50">
        <Link href="/posts" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          <span>목록으로</span>
        </Link>
      </Button>

      {/* 게시글 본문 카드 */}
      <Card className="border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 rounded-2xl overflow-hidden">
        <CardHeader className="space-y-3 p-4 sm:p-8">
          <div className="space-y-2">
            <CardTitle className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl break-all">
              {post.title}
            </CardTitle>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-400 dark:text-zinc-500">
              <span className="font-medium text-zinc-600 dark:text-zinc-400 truncate max-w-[150px] sm:max-w-none">
                {post.author_email || "익명 작성자"}
              </span>
              <span className="text-zinc-300 dark:text-zinc-700">•</span>
              <span>
                {new Date(post.created_at).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 p-4 pt-0 sm:p-8 sm:pt-0">
          <div className="whitespace-pre-wrap break-words text-sm sm:text-base leading-relaxed text-zinc-700 dark:text-zinc-300 space-y-4">
            {(() => {
              const imageRegex = /!\[.*?\]\s*\((https?:\/\/[^\s)]+)\)/;
              const match = post.content ? post.content.match(imageRegex) : null;

              if (match) {
                const cleanContent = post.content.replace(imageRegex, "").trim();
                const imageUrl = match[1];

                return (
                  <div className="flex flex-col gap-4">
                    {cleanContent ? <p className="whitespace-pre-wrap break-words">{cleanContent}</p> : null}
                    <div className="mt-2 overflow-hidden rounded-xl border border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
                      <img
                        src={imageUrl}
                        alt="첨부 이미지"
                        className="w-full h-auto max-h-[300px] sm:max-h-[600px] object-contain mx-auto"
                      />
                    </div>
                  </div>
                );
              }

              return <p className="whitespace-pre-wrap break-words">{post.content}</p>;
            })()}
          </div>

          {/* 하단 좋아요 & 수정/삭제 버튼 바 */}
          <div className="flex items-center justify-between border-t border-zinc-100 pt-4 sm:pt-6 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLikeToggle}
                className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 transition-colors ${isLikedByMe
                  ? "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400"
                  : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  }`}
              >
                <Heart className={`h-4 w-4 ${isLikedByMe ? "fill-current" : ""}`} />
                <span className="font-semibold text-xs">{likesCount}</span>
              </Button>
            </div>

            {isAuthor && (
              <div className="flex items-center gap-1">
                <Button asChild variant="ghost" size="sm" className="rounded-xl h-8 px-2 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                  <Link href={`/posts/${id}/edit`} className="flex items-center gap-1 text-xs">
                    <Edit className="h-3.5 w-3.5" />
                    <span className="hidden xs:inline">수정</span>
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDeletePost}
                  className="rounded-xl h-8 px-2 text-xs text-zinc-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="hidden xs:inline">삭제</span>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 댓글 UI 영역 반응형 최적화 */}
      <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
        {/* 💡 안전 가드 보강: comments가 유효하지 않을 때 런타임 다운 방지 */}
        <h3 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-50">댓글 {(comments || []).length}개</h3>

        <form onSubmit={handleCommentSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder={user ? "댓글을 입력하세요..." : "로그인 후 댓글을 작성할 수 있습니다."}
            disabled={!user}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
          />
          <Button type="submit" disabled={!user || !newComment.trim()} size="sm" className="rounded-xl h-9 sm:h-auto px-4 font-medium">
            등록
          </Button>
        </form>

        {/* 댓글 리스트 카드 */}
        <div className="space-y-2.5">
          {/* 💡 안전 가드 보강: 데이터 꼬임 현상 전면 차단 */}
          {(comments || []).length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="flex items-start justify-between rounded-xl border border-zinc-100 bg-zinc-50/50 p-3 sm:p-4 dark:border-zinc-800/60 dark:bg-zinc-900/50 gap-2">
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11px] sm:text-xs text-zinc-400">
                    <span className="font-medium text-zinc-600 dark:text-zinc-400 truncate max-w-[120px] sm:max-w-none">{comment.author_email || "익명"}</span>
                    <span>•</span>
                    <span>{new Date(comment.created_at).toLocaleDateString("ko-KR")}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 break-words leading-relaxed">{comment.content}</p>
                </div>
                {user && comment.user_id === user.id && (
                  <Button variant="ghost" size="icon" onClick={() => handleCommentDelete(comment.id)} className="h-7 w-7 text-zinc-400 hover:text-red-600 flex-shrink-0">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-xs text-zinc-400 py-4">첫 댓글을 남겨보세요!</p>
          )}
        </div>
      </div>
    </div>
  );
}