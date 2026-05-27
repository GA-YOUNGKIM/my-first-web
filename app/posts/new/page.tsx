"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function NewPostPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
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

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, router, user]);

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

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("posts")
        .insert({
          title: trimmedTitle,
          content: trimmedContent,
          user_id: user.id,
        })
        .select("id")
        .single();

      if (error || !data) {
        console.error("게시글 작성에 실패했습니다.", error);
        setFormError("게시글을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.");
        return;
      }

      router.push(`/posts/${data.id}`);
    } catch (error) {
      console.error("게시글 작성 중 예외가 발생했습니다.", error);
      setFormError("게시글을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
        <Card className="border border-border bg-card shadow-sm">
          <CardContent className="px-6 py-10 text-center text-sm text-muted-foreground">
            불러오는 중
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
        <Card className="border border-border bg-card shadow-sm">
          <CardContent className="px-6 py-10 text-center text-sm text-muted-foreground">
            로그인 후 이용해 주세요.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8 space-y-4">
        <Button asChild variant="ghost" className="px-0 text-sm font-medium text-muted-foreground hover:text-foreground">
          <Link href="/posts">← 목록으로 돌아가기</Link>
        </Button>
        <div className="space-y-2">
          <p className="text-sm font-medium tracking-[0.2em] text-muted-foreground uppercase">write</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">새 게시글 작성</h1>
          <p className="text-sm leading-7 text-muted-foreground sm:text-base">제목과 내용을 차분하게 작성해 보세요.</p>
        </div>
      </div>

      <Card className="border border-border bg-card shadow-sm">
        <CardHeader className="border-b border-border/70 pb-4">
          <CardTitle className="text-xl text-foreground">작성 폼</CardTitle>
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
                {isSubmitting ? "저장 중" : "게시글 저장하기"}
              </Button>
              <Button asChild variant="outline" size="lg" className="h-11 flex-1 font-medium sm:flex-none sm:px-8">
                <Link href="/posts">취소</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}