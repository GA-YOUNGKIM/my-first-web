"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}

export default function GlobalError({ error, unstable_retry }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="ko">
      <body className="bg-background text-foreground antialiased">
        <div className="mx-auto flex min-h-screen w-full max-w-4xl items-center px-4 py-12 sm:px-6">
          <Card className="w-full overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <CardContent className="space-y-6 px-6 py-12 text-center sm:px-8">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                !
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  앱에 문제가 발생했습니다.
                </h1>
                <p className="text-sm leading-7 text-muted-foreground">
                  잠시 후 다시 시도해 주세요. 계속 문제가 있으면 홈으로 돌아가서 다른 페이지를 열어 보세요.
                </p>
              </div>
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <Button onClick={unstable_retry} className="h-11 px-6 font-medium">
                  다시 시도
                </Button>
                <Button asChild variant="outline" className="h-11 px-6 font-medium">
                  <Link href="/">홈으로 이동</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  );
}