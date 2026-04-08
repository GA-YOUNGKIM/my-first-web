import Link from "next/link";
import { posts } from "@/lib/posts";

export default function Home() {
  return (
    <>
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">내 블로그</h1>
        <p className="text-gray-500">
          다양한 개발 이야기를 공유하는 블로그입니다.
        </p>
        <nav className="mt-4 flex gap-4 text-sm">
          <Link href="/" className="text-blue-600 font-semibold hover:underline">
            홈
          </Link>
          <Link href="/posts" className="text-gray-600 hover:text-blue-600 hover:underline">
            게시글 목록
          </Link>
        </nav>
      </header>

      <main>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">최근 게시글</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition"
            >
              <Link href={`/posts/${post.id}`}>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {post.content}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{post.author}</span>
                  <time dateTime={post.date}>{post.date}</time>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </main>

      <footer className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-400">
        © 2026 내 블로그. All rights reserved.
      </footer>
    </>
  );
}
