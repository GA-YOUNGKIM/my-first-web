"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Sun, Moon, LogOut, User, FileEdit } from "lucide-react";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

// 헤더의 내부 기능을 컴포넌트로 분리하여 상태관리가 깔끔하게 작동하도록 처리
function HeaderNavigation() {
  const { user } = useAuth();
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 로그아웃 처리 함수
  async function handleLogout() {
    if (confirm("로그아웃 하시겠습니까?")) {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.refresh();
      router.push("/posts");
    }
  }

  // 다크/라이트 모드 가상 토글 기능 (디자인 전환용 토글 상태 유지)
  function toggleDarkMode() {
    setIsDarkMode(!isDarkMode);
    // 참고: 실제 테마 적용 시 document.documentElement.classList.toggle('dark') 등을 연동할 수 있습니다.
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">

        {/* 왼쪽 로고 (홈 링크) */}
        <Link href="/posts" className="text-base font-bold tracking-tight text-zinc-900 transition-opacity hover:opacity-75">
          ✦ 내 블로그
        </Link>

        {/* 오른쪽 내비게이션 바 메뉴들 */}
        <nav className="flex items-center gap-1 sm:gap-3 text-sm font-medium text-zinc-600">
          <Link href="/" className="rounded-xl px-2.5 py-1.5 transition-colors hover:bg-zinc-50 hover:text-zinc-900">
            홈
          </Link>
          <Link href="/posts" className="rounded-xl px-2.5 py-1.5 transition-colors hover:bg-zinc-50 hover:text-zinc-900">
            게시글 목록
          </Link>

          {/* 로그인 상태에 따라 다르게 보여주는 회원정보 영역 */}
          {user ? (
            <>
              <Link href="/mypage" className="flex items-center gap-1 rounded-xl px-2.5 py-1.5 transition-colors hover:bg-zinc-50 hover:text-zinc-900">
                <User className="h-4 w-4 text-zinc-400" />
                <span>마이페이지</span>
              </Link>

              <Link href="/posts/new" className="flex items-center gap-1 rounded-xl bg-zinc-900 px-3 py-1.5 font-medium text-white shadow-sm transition-all hover:bg-zinc-800">
                <FileEdit className="h-3.5 w-3.5" />
                <span>새 글 쓰기</span>
              </Link>

              {/* 로그아웃 버튼 */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-zinc-500 transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">로그아웃</span>
              </button>

              {/* 로그인 중인 사용자 이메일 아이디 정보 표시 */}
              <span className="ml-1 hidden border-l border-zinc-200 pl-3 text-xs text-blue-600 font-semibold md:inline">
                {user.email}
              </span>
            </>
          ) : (
            <>
              {/* 비로그인 상태일 때 표기 */}
              <Link href="/login" className="rounded-xl px-3 py-1.5 text-zinc-900 transition-colors hover:bg-zinc-50">
                로그인
              </Link>
              <Link href="/register" className="rounded-xl bg-zinc-900 px-3 py-1.5 text-white transition-all hover:bg-zinc-800">
                회원가입
              </Link>
            </>
          )}

          {/* 다크/라이트 모드 전환 토글 아이콘 버튼 */}
          <button
            onClick={toggleDarkMode}
            className="ml-1 rounded-full p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
            aria-label="테마 전환"
          >
            {isDarkMode ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4" />}
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
    <html lang="ko" className="h-full antialiased">
      <body className={`${inter.className} flex h-full flex-col bg-[#FAFAFA] text-zinc-900`}>
        <AuthProvider>
          {/* 위에서 정의한 만능 헤더 배치 */}
          <HeaderNavigation />

          {/* 메인 본문 콘텐츠 */}
          <main className="flex-1">{children}</main>

          {/* 푸터 */}
          <footer className="border-t border-zinc-100 bg-white py-8 text-center text-xs text-zinc-400">
            © {new Date().getFullYear()} 내 블로그. All rights reserved.
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}