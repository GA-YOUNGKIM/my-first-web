import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

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
    <html lang="ko">
      <body className="antialiased font-sans text-gray-900 bg-gray-50/50">
        <nav className="sticky top-0 z-50 bg-gray-800/90 backdrop-blur-md text-white px-6 py-4 shadow-lg">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <Link href="/" className="font-bold text-xl tracking-tight hover:text-blue-400过渡 transition-colors">
              내 블로그
            </Link>
            <div className="flex gap-6">
              <Link href="/" className="text-sm font-medium hover:text-blue-400 transition-colors">홈</Link>
              <Link href="/posts" className="text-sm font-medium hover:text-blue-400 transition-colors">게시글 목록</Link>
            </div>
          </div>
        </nav>
        <main className="max-w-4xl mx-auto p-6 min-h-[calc(100vh-160px)]">
          {children}
        </main>
        <footer className="bg-white border-t border-gray-100 mt-12">
          <div className="max-w-4xl mx-auto py-10 px-6 text-center text-gray-400 text-sm">
            © 2026 내 블로그. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
