"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft, Trash2, Edit } from "lucide-react";
// 💡 만약 프로젝트 내에 기존 댓글 컴포넌트가 따로 있었다면 아래 주석을 풀거나 경로를 맞춰주세요.
// import Comments from "@/components/Comments"; 

export default function PostDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { user } = useAuth();

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [likesCount, setLikesCount] = useState(0);
  const [isLikedByMe, setIsLikedByMe] = useState(false);

  // 💡 자체 댓글 상태 (만약 하단에 직접 구현하는 방식이었다면 사용됩니다)
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (id) {
      fetchPostDetails();
      fetchComments(); // 댓글 불러오기 실행
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

  // 💡 댓글 가져오기 함수 복구
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
    }
  }

  // 💡 댓글 작성 함수 복구
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
          content: newComment.trim(),
          author_email: user.email // 작성자 이메일 저장
        },
      ]);

      if (error) throw error;
      setNewComment("");
      fetchComments(); // 댓글 목록 새로고침
    } catch (error) {
      console.error("댓글 작성 실패:", error);
      alert("댓글 작성에 실패했습니다.");
    }
  }

  // 💡 댓글 삭제 함수 복구
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
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:py-12">
      <Button asChild variant="ghost" className="mb-6 -ml-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50">
        <Link href="/posts" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          <span>목록으로</span>
        </Link>
      </Button>

      {/* 게시글 본문 카드 */}
      <Card className="border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <CardHeader className="space-y-4 p-6 sm:p-8">
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
              {post.title}
            </CardTitle>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-400 dark:text-zinc-500">
              <span className="font-medium text-zinc-600 dark:text-zinc-400">
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

        <CardContent className="space-y-6 p-6 pt-0 sm:p-8 sm:pt-0">
          <div className="whitespace-pre-wrap text-base leading-relaxed text-zinc-700 dark:text-zinc-300 space-y-4">
            {(() => {
              const imageRegex = /!\[.*?\]\s*\((https?:\/\/[^\s)]+)\)/;
              const match = post.content ? post.content.match(imageRegex) : null;

              if (match) {
                const cleanContent = post.content.replace(imageRegex, "").trim();
                const imageUrl = match[1];

                return (
                  <div className="flex flex-col gap-4">
                    {cleanContent ? <p className="whitespace-pre-wrap">{cleanContent}</p> : null}
                    <div className="mt-2 overflow-hidden rounded-xl border border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
                      <img
                        src={imageUrl}
                        alt="첨부 이미지"
                        className="w-full h-auto max-h-[600px] object-contain mx-auto"
                      />
                    </div>
                  </div>
                );
              }

              return <p className="whitespace-pre-wrap">{post.content}</p>;
            })()}
          </div>

          <div className="flex items-center justify-between border-t border-zinc-100 pt-6 dark:border-zinc-800">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLikeToggle}
                className={`flex items-center gap-2 rounded-xl px-3 py-1.5 transition-colors ${isLikedByMe
                  ? "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400"
                  : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  }`}
              >
                <Heart className={`h-4 w-4 ${isLikedByMe ? "fill-current" : ""}`} />
                <span className="font-semibold text-xs">{likesCount}</span>
              </Button>
            </div>

            {isAuthor && (
              <div className="flex items-center gap-1.5">
                <Button asChild variant="ghost" size="sm" className="rounded-xl text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                  <Link href={`/posts/${id}/edit`} className="flex items-center gap-1.5">
                    <Edit className="h-3.5 w-3.5" />
                    <span>수정</span>
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDeletePost}
                  className="rounded-xl text-zinc-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>삭제</span>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 💡 복구된 댓글 UI 영역 */}
      <div className="mt-8 space-y-6">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">댓글 {comments.length}개</h3>

        {/* 댓글 작성 폼 */}
        <form onSubmit={handleCommentSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder={user ? "댓글을 입력하세요..." : "로그인 후 댓글을 작성할 수 있습니다."}
            disabled={!user}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
          />
          <Button type="submit" disabled={!user || !newComment.trim()} size="sm" className="rounded-xl px-4">
            등록
          </Button>
        </form>

        {/* 댓글 목록 */}
        <div className="space-y-3">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="flex items-start justify-between rounded-xl border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800/60 dark:bg-zinc-900/50">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <span className="font-medium text-zinc-600 dark:text-zinc-400">{comment.author_email || "익명"}</span>
                    <span>•</span>
                    <span>{new Date(comment.created_at).toLocaleDateString("ko-KR")}</span>
                  </div>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300">{comment.content}</p>
                </div>
                {user && comment.user_id === user.id && (
                  <Button variant="ghost" size="icon" onClick={() => handleCommentDelete(comment.id)} className="h-7 w-7 text-zinc-400 hover:text-red-600">
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