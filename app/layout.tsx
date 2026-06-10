"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Sun, Moon, LogOut, User, FileEdit } from "lucide-react";
import { ThemeProvider, useTheme } from "next-themes"; // 다크모드 핵심 라이브러리 복구

const inter = Inter({ subsets: ["latin"] });

// 상단 내비게이션 바 컴포넌트
function HeaderNavigation() {
  const { user } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme(); // 실제 다크모드 테마 훅 연동

  // 로그아웃 처리 함수
  async function handleLogout() {
    if (confirm("로그아웃 하시겠습니까?")) {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.refresh();
      router.push("/posts");
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-100 bg-white/80 dark:border-zinc-800 dark:bg-zinc-900/80 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">

        {/* 왼쪽 로고 (홈 링크) */}
        <Link href="/posts" className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-50 transition-opacity hover:opacity-75">
          ✦ 내 블로그
        </Link>

        {/* 오른쪽 내비게이션 바 메뉴들 */}
        <nav className="flex items-center gap-1 sm:gap-3 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          <Link href="/" className="rounded-xl px-2.5 py-1.5 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-50">
            홈
          </Link>
          <Link href="/posts" className="rounded-xl px-2.5 py-1.5 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-50">
            게시글 목록
          </Link>

          {/* 로그인 상태에 따른 유동적 메뉴 구성 */}
          {user ? (
            <>
              <Link href="/mypage" className="flex items-center gap-1 rounded-xl px-2.5 py-1.5 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-50">
                <User className="h-4 w-4 text-zinc-400" />
                <span>마이페이지</span>
              </Link>

              <Link href="/posts/new" className="flex items-center gap-1 rounded-xl bg-zinc-900 px-3 py-1.5 font-medium text-white dark:bg-zinc-50 dark:text-zinc-950 shadow-sm transition-all hover:bg-zinc-800 dark:hover:bg-zinc-200">
                <FileEdit className="h-3.5 w-3.5" />
                <span>새 글 쓰기</span>
              </Link>

              {/* 로그아웃 버튼 */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-zinc-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">로그아웃</span>
              </button>

              {/* 로그인 중인 사용자 이메일 아이디 정보 표시 */}
              <span className="ml-1 hidden border-l border-zinc-200 dark:border-zinc-700 pl-3 text-xs text-blue-600 dark:text-blue-400 font-semibold md:inline">
                {user.email}
              </span>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-xl px-3 py-1.5 text-zinc-900 dark:text-zinc-50 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800">
                로그인
              </Link>
              <Link href="/register" className="rounded-xl bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-950 transition-all hover:bg-zinc-800 dark:hover:bg-zinc-200">
                회원가입
              </Link>
            </>
          )}

          {/* [핵심 수정] 다크/라이트 모드 실제 토글 버튼 시스템 복구 */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="ml-1 rounded-full p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
            aria-label="테마 전환"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-amber-500" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
        </nav>

      </div>
    </header>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="h-full antialiased" suppressHydrationWarning>
      <body className={`${inter.className} flex h-full flex-col bg-[#FAFAFA] text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 transition-colors`}>
        {/* ThemeProvider로 앱을 감싸주어 실제 테마 상태 동기화 */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>

            {/* 상단 내비게이션 바 헤더 */}
            <HeaderNavigation />

            {/* 메인 본문 콘텐츠 */}
            <main className="flex-1">{children}</main>

            {/* 푸터 */}
            <footer className="border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-8 text-center text-xs text-zinc-400 dark:text-zinc-500">
              © {new Date().getFullYear()} 내 블로그. All rights reserved.
            </footer>

          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}