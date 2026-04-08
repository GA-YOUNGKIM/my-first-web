import Link from "next/link";
import { posts } from "@/lib/posts";

export default function PostsPage() {
  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">전체 게시글</h1>
          <p className="text-gray-500 mt-2">다양한 주제의 이야기를 만나보세요.</p>
        </div>
        <Link 
          href="/posts/new" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95"
        >
          <span className="text-xl">+</span> 새 글 쓰기
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post) => (
          <article key={post.id} className="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <Link href={`/posts/${post.id}`} className="flex flex-col h-full p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full">Blog</span>
                <time className="text-xs text-gray-400" dateTime={post.date}>{post.date}</time>
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {post.title}
              </h2>
              
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">
                {post.content}
              </p>
              
              <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                    {post.author[0]}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{post.author}</span>
                </div>
                <span className="text-blue-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  Read more <span className="text-lg">→</span>
                </span>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
