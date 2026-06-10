"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, BookOpen } from "lucide-react";

export default function PostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("posts")
          .select("id, title, content, created_at")
          .order("created_at", { ascending: false });

        if (!error && data) setPosts(data);
      } catch (err) {
        console.error("데이터 로드 에러:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  // 스켈레톤 로딩 UI 마저도 감성적으로 디자인
  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-8">
        <div className="space-y-6">
          <div className="h-10 w-48 animate-pulse rounded-2xl bg-zinc-200/60" />
          <div className="grid gap-6 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-44 animate-pulse rounded-3xl bg-zinc-200/50" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-8 animate-in fade-in duration-500">
      {/* 상단 타이틀 영단 감성 섹션 */}
      <div className="mb-14 border-b border-zinc-100 pb-8">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400">
          <BookOpen className="h-3.5 w-3.5" /> Archive
        </div>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
          기록된 생각들
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          단상과 일상, 축적된 {posts.length}개의 아카이브가 숨쉬고 있습니다.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-zinc-200 bg-white/50 py-20 text-center shadow-sm">
          <p className="text-sm text-zinc-400">아직 서재가 비어있습니다.</p>
          <Link
            href="/posts/new"
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-zinc-900 underline underline-offset-4 hover:opacity-75"
          >
            첫 이야기 적어보기 →
          </Link>
        </div>
      ) : (
        /* 고급스러운 카드 그리드 정렬 */
        <div className="grid gap-6 sm:grid-cols-2">
          {posts.map((post) => (
            <Link key={post.id} href={`/posts/${post.id}`} className="group block">
              <Card className="h-full overflow-hidden rounded-3xl border border-zinc-100/80 bg-white p-7 shadow-[0_2px_8px_rgba(0,0,0,0,02)] transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-zinc-200 group-hover:shadow-[0_12px_24px_rgba(0,0,0,0.04)]">
                <CardContent className="p-0 flex flex-col h-full justify-between">
                  <div>
                    {/* 정갈한 날짜 포맷 */}
                    <time className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                      {new Date(post.created_at).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>

                    {/* 글 제목 */}
                    <h2 className="mt-3 text-lg font-bold leading-snug tracking-tight text-zinc-900 group-hover:text-zinc-900">
                      {post.title}
                    </h2>

                    {/* 본문 서머리 (line-clamp 처리) */}
                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-zinc-400 font-normal">
                      {post.content}
                    </p>
                  </div>

                  {/* 카드 하단 화살표 링크 인터랙션 */}
                  <div className="mt-8 flex items-center justify-between text-xs font-bold text-zinc-900">
                    <span className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      읽어보기
                    </span>
                    <div className="rounded-full bg-zinc-50 p-2 text-zinc-400 transition-colors group-hover:bg-zinc-900 group-hover:text-white">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}