"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getUserFriendlyErrorMessage } from "@/lib/error-message";

export default function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user, loading } = useAuth();

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [postUserId, setPostUserId] = useState<string>("");
  const [fetching, setFetching] = useState<boolean>(true);

  const [titleError, setTitleError] = useState<string>("");
  const [contentError, setContentError] = useState<string>("");
  const [formError, setFormError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  function validateTitle(value: string): string {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return "제목을 입력해 주세요.";
    }

    if (trimmedValue.length < 2) {
      return "제목은 2자 이상 입력해 주세요.";
    }

    return "";
  }

  function validateContent(value: string): string {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return "내용을 입력해 주세요.";
    }

    if (trimmedValue.length < 10) {
      return "내용은 10자 이상 입력해 주세요.";
    }

    return "";
  }

  // 게시글 정보 불러오기
  useEffect(() => {
    async function fetchPost() {
      try {
        const supabase = createClient();
        const { data: post, error } = await supabase
          .from("posts")
          .select("id, title, content, user_id")
          .eq("id", id)
          .maybeSingle();

        if (error) {
          console.error("게시글 수정 화면 조회 실패:", error);
          setFormError("게시글 정보를 불러오지 못했습니다.");
          return;
        }

        if (!post) {
          setFormError("존재하지 않는 게시글입니다.");
          return;
        }

        setTitle(post.title);
        setContent(post.content);
        setPostUserId(post.user_id);
      } catch (err) {
        console.error("예외 발생:", err);
        setFormError("게시글 정보를 불러오지 못했습니다.");
      } finally {
        setFetching(false);
      }
    }

    fetchPost();
  }, [id]);

  // 비로그인 및 권한 검사 리다이렉트
  // 클라이언트 측 if문을 통한 이 검증은 보안이 아니며 사용자 UI 제어용입니다.
  // 실제 보안은 데이터베이스 레벨의 Ch11 RLS(Row Level Security) 정책에 의해 처리됩니다.
  useEffect(() => {
    if (!loading && !fetching) {
      if (!user) {
        router.replace("/login");
      } else if (postUserId && user.id !== postUserId) {
        // 본인 글이 아니면 돌려보냄
        router.replace(`/posts/${id}`);
      }
    }
  }, [loading, fetching, user, postUserId, id, router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setFormError("");

    const nextTitleError = validateTitle(title);
    const nextContentError = validateContent(content);

    setTitleError(nextTitleError);
    setContentError(nextContentError);

    if (nextTitleError || nextContentError) {
      return;
    }

    if (!user) {
      setFormError("로그인이 필요합니다.");
      router.replace("/login");
      return;
    }

    // 클라이언트 측의 권한 분기는 UI 편의용이며, 실제 보안은 DB RLS가 담당합니다.
    if (user.id !== postUserId) {
      setFormError("본인의 게시글만 수정할 수 있습니다.");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("posts")
        .update({
          title: title.trim(),
          content: content.trim(),
        })
        .eq("id", id);

      if (error) {
        console.error("게시글 수정에 실패했습니다.", error);
        setFormError(getUserFriendlyErrorMessage(error));
        return;
      }

      router.push("/posts"); // 성공 후 목록으로 이동
    } catch (error) {
      console.error("게시글 수정 중 예외가 발생했습니다.", error);
      setFormError(getUserFriendlyErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading || fetching) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
        <Card className="border border-border bg-card shadow-sm">
          <CardContent className="px-6 py-10 text-center text-sm text-muted-foreground">
            불러오는 중...
          </CardContent>
        </Card>
      </div>
    );
  }

  // 권한이 없는 경우 안내 화면 (클라이언트 단의 제어이며 실제 보안은 RLS가 담당)
  if (!user || user.id !== postUserId) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
        <Card className="border border-border bg-card shadow-sm">
          <CardContent className="px-6 py-10 text-center text-sm text-muted-foreground">
            {formError || "수정 권한이 없습니다."}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8 space-y-4">
        <Button asChild variant="ghost" className="px-0 text-sm font-medium text-muted-foreground hover:text-foreground">
          <Link href={`/posts/${id}`}>← 상세로 돌아가기</Link>
        </Button>
        <div className="space-y-2">
          <p className="text-sm font-medium tracking-[0.2em] text-muted-foreground uppercase">edit</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">게시글 수정</h1>
          <p className="text-sm leading-7 text-muted-foreground sm:text-base">게시글 내용을 수정할 수 있습니다.</p>
        </div>
      </div>

      <Card className="border border-border bg-card shadow-sm">
        <CardHeader className="border-b border-border/70 pb-4">
          <CardTitle className="text-xl text-foreground">수정 폼</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-foreground">
                제목
              </label>
              <Input
                type="text"
                id="title"
                name="title"
                placeholder="제목을 입력하세요"
                value={title}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const nextValue = event.target.value;
                  setTitle(nextValue);
                  setTitleError(validateTitle(nextValue));
                }}
                required
                aria-invalid={Boolean(titleError)}
                aria-describedby={titleError ? "title-error" : undefined}
                className="h-11 rounded-xl px-4"
              />
              {titleError ? (
                <p id="title-error" className="text-sm text-destructive">
                  {titleError}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="block text-sm font-medium text-foreground">
                내용
              </label>
              <Textarea
                id="content"
                name="content"
                placeholder="여기에 내용을 작성하세요..."
                value={content}
                onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                  const nextValue = event.target.value;
                  setContent(nextValue);
                  setContentError(validateContent(nextValue));
                }}
                required
                rows={10}
                aria-invalid={Boolean(contentError)}
                aria-describedby={contentError ? "content-error" : undefined}
                className="min-h-64 rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground"
              />
              {contentError ? (
                <p id="content-error" className="text-sm text-destructive">
                  {contentError}
                </p>
              ) : null}
            </div>

            {formError ? (
              <p className="text-sm text-destructive">{formError}</p>
            ) : null}

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Button type="submit" size="lg" className="h-11 flex-1 font-medium" disabled={isSubmitting}>
                {isSubmitting ? "저장 중" : "수정 완료"}
              </Button>
              <Button asChild variant="outline" size="lg" className="h-11 flex-1 font-medium sm:flex-none sm:px-8">
                <Link href={`/posts/${id}`}>취소</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
