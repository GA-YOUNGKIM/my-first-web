import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  const supabase = await createClient();

  let queryBuilder = supabase
    .from("posts")
    .select("id, title, content, created_at, user_id");

  if (search) {
    queryBuilder = queryBuilder.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
  }

  const { data: postList, error } = await queryBuilder.order("created_at", { ascending: false });

  if (error) {
    console.error("게시글 목록을 불러오지 못했습니다.", error);
    throw new Error("게시글 목록을 불러오지 못했습니다.");
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-6 border-b border-border/70 px-5 py-7 sm:px-8 sm:py-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="text-xs font-semibold tracking-[0.24em] text-muted-foreground uppercase">
              posts
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {search ? `"${search}" 검색 결과` : "전체 게시글"}
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              {search 
                ? `입력하신 검색어에 해당하는 결과를 Supabase DB에서 조회했습니다.`
                : `최신 글부터 차분하게 읽어보세요. 글이 많아져도 목록이 보기 쉽게 유지됩니다.`
              }
            </p>
          </div>

          <div className="flex gap-2">
            {search && (
              <Button asChild variant="outline" size="lg" className="h-11 px-6 font-medium whitespace-nowrap">
                <Link href="/posts">전체 목록</Link>
              </Button>
            )}
            <Button asChild size="lg" className="h-11 px-6 font-medium whitespace-nowrap">
              <Link href="/posts/new">
                <span className="text-xl">+</span> 새 글 쓰기
              </Link>
            </Button>
          </div>
        </div>

        <div className="px-5 py-5 sm:px-8 sm:py-6">
          <div className="mb-5 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>
              {search ? `"${search}" 검색 결과: ` : ""}총 {postList?.length ?? 0}개의 글
            </span>
            <span>최근 글이 위에 표시됩니다</span>
          </div>

          {postList && postList.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-2">
              {postList.map((post) => (
                <Card
                  key={post.id}
                  className="group h-full overflow-hidden rounded-2xl border border-border bg-background py-0 shadow-sm transition-colors hover:border-primary/30"
                >
                  <CardHeader className="space-y-3 px-5 pt-5 sm:px-6 sm:pt-6">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="rounded-full bg-muted px-2.5 py-1 font-semibold text-muted-foreground">
                        Post
                      </span>
                      <time
                        className="text-muted-foreground"
                        dateTime={post.created_at}
                      >
                        {new Date(post.created_at).toLocaleDateString("ko-KR")}
                      </time>
                    </div>

                    <CardTitle className="line-clamp-2 text-lg font-semibold leading-7 text-foreground transition-colors group-hover:text-primary sm:text-xl">
                      <Link href={`/posts/${post.id}`}>{post.title}</Link>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="px-5 sm:px-6">
                    <p className="line-clamp-4 text-sm leading-7 text-muted-foreground">
                      {post.content}
                    </p>
                  </CardContent>

                  <div className="border-t border-border/70 px-5 py-5 sm:px-6">
                    <Button
                      asChild
                      size="default"
                      variant="ghost"
                      className="h-10 px-3 font-medium text-foreground hover:bg-background"
                    >
                      <Link href={`/posts/${post.id}`}>글 읽기 →</Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-dashed border-border bg-background">
              <CardContent className="flex flex-col items-center justify-center gap-4 px-6 py-12 text-center">
                <p className="text-sm text-muted-foreground">
                  {search ? "검색 결과에 맞는 게시글이 없습니다." : "글이 없습니다."}
                </p>
                <Button asChild className="h-11 px-6 font-medium">
                  <Link href={search ? "/posts" : "/posts/new"}>
                    {search ? "전체 글 보기" : "첫 글 쓰기"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
