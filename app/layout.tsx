import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "내 블로그",
  description: "내 블로그입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <nav className="bg-gray-800 text-white px-6 py-4 flex items-center gap-6">
          <Link href="/" className="font-bold text-lg hover:text-gray-300">
            내 블로그
          </Link>
          <Link href="/posts" className="hover:text-gray-300">
            게시글
          </Link>
        </nav>
        <main className="max-w-4xl mx-auto p-6">
          {children}
        </main>
        <footer className="text-center text-gray-500 py-4">
          © 2026 내 블로그
        </footer>
      </body>
    </html>
  );
}
