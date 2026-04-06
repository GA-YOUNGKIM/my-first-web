import Link from "next/link";
import { posts } from "@/lib/posts";

export default function PostsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">게시글 목록</h1>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/posts/${post.id}`}>
              <div className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow cursor-pointer">
                <h2 className="text-lg font-semibold text-gray-800">{post.title}</h2>
                <p className="text-gray-500 text-sm mt-1">{post.author} · {post.date}</p>
                <p className="text-gray-600 mt-2 line-clamp-2">{post.content}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
