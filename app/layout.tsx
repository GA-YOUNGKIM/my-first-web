import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "내 블로그",
  description: "개발 블로그입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={cn("font-sans", geist.variable)}>
      <body className="antialiased bg-background text-foreground">
        <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="mx-auto flex max-w-4xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <Link href="/" className="text-lg font-semibold tracking-tight text-foreground transition-colors hover:text-primary">
              내 블로그
            </Link>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Link href="/" className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                홈
              </Link>
              <Link href="/posts" className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                게시글 목록
              </Link>
              <Link href="/login" className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                로그인
              </Link>
              <Link href="/signup" className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                회원가입
              </Link>
            </div>
          </div>
        </nav>
        <main className="mx-auto min-h-[calc(100vh-160px)] max-w-4xl px-4 py-6 sm:px-6">
          {children}
        </main>
        <footer className="mt-12 border-t border-border bg-background">
          <div className="mx-auto max-w-4xl px-4 py-10 text-center text-sm text-muted-foreground sm:px-6">
            © 2026 내 블로그. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
