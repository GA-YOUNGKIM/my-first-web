import Link from "next/link";
import { posts } from "@/lib/posts";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = posts.find((p) => p.id === Number(id));

  if (!post) {
    return (
      <div className="py-24 text-center">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
          ⚠️
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          게시글을 찾을 수 없습니다
        </h1>
        <p className="text-gray-500 mb-10">요청하신 데이터가 존재하지 않거나 삭제되었을 수 있습니다.</p>
        <Link
          href="/posts"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
        >
          ← 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12">
      <Link
        href="/posts"
        className="group inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mb-10 font-medium"
      >
        <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
        목록으로 돌아가기
      </Link>

      <article className="bg-white rounded-3xl border border-gray-100 p-8 md:p-12 shadow-sm">
        <header className="mb-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="px-4 py-1 text-xs font-bold text-blue-600 bg-blue-50 rounded-full uppercase tracking-wider">Development</span>
            <time className="text-sm text-gray-400 font-medium" dateTime={post.date}>{post.date}</time>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-3 pt-6 border-t border-gray-50 max-w-xs mx-auto">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
              {post.author[0]}
            </div>
            <span className="text-gray-900 font-semibold">{post.author}</span>
          </div>
        </header>

        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
          {post.content}
        </div>
      </article>
      
      <div className="mt-12 text-center p-8 bg-blue-50 rounded-3xl">
        <h3 className="text-lg font-bold text-blue-900 mb-2">도움이 되셨나요?</h3>
        <p className="text-blue-700 text-sm mb-6">더 많은 개발 정보가 필요하시다면 목록을 확인해 보세요.</p>
        <Link
          href="/posts"
          className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
        >
          다른 게시글 읽기
        </Link>
      </div>
    </div>
  );
}
