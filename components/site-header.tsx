"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export function SiteHeader() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  async function handleSignOut() {
    const result = await signOut();

    if (!result.error) {
      router.push("/");
    }
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-4xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-foreground transition-colors hover:text-primary"
        >
          내 블로그
        </Link>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Link
            href="/"
            className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            홈
          </Link>
          <Link
            href="/posts"
            className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            게시글 목록
          </Link>

          {loading ? (
            <div className="flex items-center gap-2">
              <div className="h-8 w-24 animate-pulse rounded-full bg-muted"></div>
              <div className="h-8 w-20 animate-pulse rounded-full bg-muted"></div>
            </div>
          ) : user ? (
            <>
              <Link
                href="/mypage"
                className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                마이페이지
              </Link>
              <Link
                href="/posts/new"
                className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                새 글 쓰기
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={loading}
                className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                로그아웃
              </button>
              <span className="rounded-full px-3 py-2 text-sm font-medium text-primary">
                {user.email}
              </span>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
