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
      <div className="py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          게시글을 찾을 수 없습니다
        </h1>
        <Link
          href="/posts"
          className="text-blue-600 hover:underline"
        >
          ← 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12">
      <Link
        href="/posts"
        className="text-blue-600 hover:underline text-sm"
      >
        ← 목록으로 돌아가기
      </Link>

      <article className="mt-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {post.title}
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          {post.author} · {post.date}
        </p>
        <div className="text-gray-700 leading-relaxed whitespace-pre-line">
          {post.content}
        </div>
      </article>
    </div>
  );
}
