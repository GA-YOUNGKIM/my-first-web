export default function Home() {
  const posts = [
    {
      title: "React와 Next.js로 블로그 시작하기",
      excerpt: "Next.js 앱 라우팅과 서버 컴포넌트를 활용해 빠르게 블로그를 구축하는 방법을 알아봅니다.",
      author: "김가영",
      date: "2026-03-30",
    },
    {
      title: "스타일링 기본: Tailwind CSS와 CSS 모듈 비교",
      excerpt: "Tailwind와 CSS 모듈 중 어떤 선택이 적합한지 간단한 장단점을 중심으로 정리합니다.",
      author: "김가영",
      date: "2026-03-28",
    },
    {
      title: "퍼포먼스 팁: 렌더링 최적화와 이미지 로딩",
      excerpt: "웹 페이지 로딩 속도를 올리는 실용적인 팁과 Next.js Image 컴포넌트 활용법을 공유합니다.",
      author: "김가영",
      date: "2026-03-25",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-6">
          <h1 className="text-3xl font-bold">My Dev Blog</h1>
          <nav>
            <ul className="flex gap-4 text-sm font-medium text-slate-600">
              <li><a href="#" className="hover:text-slate-900">홈</a></li>
              <li><a href="#" className="hover:text-slate-900">포스트</a></li>
              <li><a href="#" className="hover:text-slate-900">소개</a></li>
              <li><a href="#" className="hover:text-slate-900">연락</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-6 px-4 py-8">
        {posts.map((post) => (
          <article key={post.title} className="bg-white rounded-lg shadow p-6 transition-shadow duration-200 hover:shadow-lg">
            <h2 className="text-lg font-bold text-slate-900">{post.title}</h2>
            <p className="mt-3 text-gray-600">{post.excerpt}</p>
            <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
              <span>작성자: {post.author}</span>
              <time dateTime={post.date}>{post.date}</time>
            </div>
          </article>
        ))}
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4 text-sm text-slate-600">© 2026 My Dev Blog. All rights reserved.</div>
      </footer>
    </div>
  );
}
