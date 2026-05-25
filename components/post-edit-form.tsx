"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface PostEditFormProps {
  postId: string;
  postUserId: string;
  initialTitle: string;
  initialContent: string;
}

export function PostEditForm({ postId, postUserId, initialTitle, initialContent }: PostEditFormProps) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [title, setTitle] = useState<string>(initialTitle);
  const [content, setContent] = useState<string>(initialContent);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // UI 분기만으로 권한을 보장하지 않는다. 실제 보안은 Ch11 RLS에서 처리한다.

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, router, user]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setErrorMessage("");

    if (!user) {
      setErrorMessage("로그인이 필요합니다.");
      router.replace("/login");
      return;
    }

    if (user.id !== postUserId) {
      setErrorMessage("이 글을 수정할 수 없습니다.");
      return;
    }

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      setErrorMessage("제목과 내용을 입력해 주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("posts")
        .update({ title: trimmedTitle, content: trimmedContent })
        .eq("id", postId);

      if (error) {
        setErrorMessage("게시글을 수정하지 못했습니다.");
        return;
      }

      router.push("/posts");
      router.refresh();
    } catch {
      setErrorMessage("게시글을 수정하지 못했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return (
      <Card className="border border-border bg-card shadow-sm">
        <CardContent className="px-6 py-10 text-center text-sm text-muted-foreground">
          불러오는 중
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="border border-border bg-card shadow-sm">
        <CardContent className="px-6 py-10 text-center text-sm text-muted-foreground">
          로그인 후 이용해 주세요.
        </CardContent>
      </Card>
    );
  }

  if (user.id !== postUserId) {
    return (
      <Card className="border border-border bg-card shadow-sm">
        <CardContent className="px-6 py-10 text-center text-sm text-muted-foreground">
          이 글을 수정할 수 없습니다.
        </CardContent>
      </Card>
    );
  }

  return (
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
              value={title}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setTitle(event.target.value)}
              required
              className="h-11 rounded-xl px-4"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="block text-sm font-medium text-foreground">
              내용
            </label>
            <Textarea
              id="content"
              name="content"
              value={content}
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setContent(event.target.value)}
              required
              rows={10}
              className="min-h-64 rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Button type="submit" size="lg" className="h-11 flex-1 font-medium" disabled={isSubmitting}>
              {isSubmitting ? "저장 중" : "수정사항 저장"}
            </Button>
            <Button asChild variant="outline" size="lg" className="h-11 flex-1 font-medium sm:flex-none sm:px-8">
              <Link href={`/posts/${postId}`}>취소</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}