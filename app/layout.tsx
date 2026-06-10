import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Minimal Archive",
  description: "생각과 기록을 담는 정갈한 공간",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className={`${inter.className} flex h-full flex-col bg-[#FAFAFA] text-zinc-900`}>
        <AuthProvider>
          {/* 글래스모피즘 트렌디 헤더 */}
          <header className="sticky top-0 z-50 w-full border-b border-zinc-100 bg-white/70 backdrop-blur-md transition-all">
            <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-8">
              <Link
                href="/posts"
                className="text-base font-bold tracking-tight text-zinc-900 transition-opacity hover:opacity-70"
              >
                ✦ 나의 정갈한 블로그
              </Link>

              <nav className="flex items-center gap-2">
                <Link
                  href="/posts"
                  className="rounded-xl px-4 py-2 text-sm font-medium text-zinc-600 transition-all hover:bg-zinc-100/80 hover:text-zinc-900"
                >
                  글 목록
                </Link>
                <Link
                  href="/posts/new"
                  className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-zinc-800 active:scale-95"
                >
                  새 글 쓰기
                </Link>
              </nav>
            </div>
          </header>

          {/* 메인 뷰포트 영역 (여백 확보) */}
          <main className="flex-1 pb-20">{children}</main>

          {/* 미니멀 푸터 */}
          <footer className="border-t border-zinc-100 bg-white py-8 text-center text-xs tracking-wide text-zinc-400">
            © {new Date().getFullYear()} Minimal Archive. Crafted with purity.
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}