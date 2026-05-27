"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface PostsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PostsError({ error, reset }: PostsErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <Card className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <CardContent className="space-y-6 px-6 py-12 text-center sm:px-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            !
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              게시글을 불러오지 못했습니다.
            </h1>
            <p className="text-sm leading-7 text-muted-foreground">
              잠시 후 다시 시도해 주세요. 문제가 계속되면 새로고침하거나 목록으로 돌아가 보세요.
            </p>
          </div>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button onClick={reset} className="h-11 px-6 font-medium">
              다시 시도
            </Button>
            <Button asChild variant="outline" className="h-11 px-6 font-medium">
              <Link href="/posts">목록으로 이동</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}