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
    .select("id, title, content, created_at, user_id, author_email"); // 💡 작성자 표시를 위해 author_email 컬럼이 있다면 select에 추가합니다.

  if (search) {
    queryBuilder = queryBuilder.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
  }

  const { data: postList, error } = await queryBuilder.order("created_at", { ascending: false });

  if (error) {
    console.error("게시글 목록을 불러오지 못했습니다.", error);
    throw new Error("게시글 목록을 불러오지 못했습니다.");
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-12">
      <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-6 border-b border-border/70 px-5 py-7 sm:px-8 sm:py-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="text-xs font-semibold tracking-[0.24em] text-muted-foreground uppercase">
              posts
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
              {search ? `"${search}" 검색 결과` : "전체 게시글"}
            </h1>
            <p className="max-w-2xl text-xs sm:text-sm leading-6 sm:leading-7 text-muted-foreground">
              {search
                ? `입력하신 검색어에 해당하는 결과를 Supabase DB에서 조회했습니다.`
                : `최신 글부터 차분하게 읽어보세요. 글이 많아져도 목록이 보기 쉽게 유지됩니다.`
              }
            </p>
          </div>

          <div className="flex gap-2">
            {search && (
              <Button asChild variant="outline" size="sm" className="h-10 px-4 font-medium whitespace-nowrap rounded-xl">
                <Link href="/posts">전체 목록</Link>
              </Button>
            )}
            <Button asChild size="sm" className="h-10 px-4 font-medium whitespace-nowrap rounded-xl">
              <Link href="/posts/new">
                <span className="text-lg mr-1">+</span> 새 글 쓰기
              </Link>
            </Button>
          </div>
        </div>

        <div className="px-5 py-5 sm:px-8 sm:py-6">
          <div className="mb-5 flex flex-col gap-1 text-xs sm:text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>
              {search ? `"${search}" 검색 결과: ` : ""}총 {postList?.length ?? 0}개의 글
            </span>
            <span className="text-[11px] sm:text-xs">최근 글이 위에 표시됩니다</span>
          </div>

          {postList && postList.length > 0 ? (
            // 💡 md:grid-cols-2 구조로 태블릿/데스크톱에서는 격자, 모바일에서는 1열 세로 배열로 자동 스케일링됩니다.
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {postList.map((post) => {
                // 💡 마크다운 이미지 정규식 매칭 분석 및 본문 분리
                const imageRegex = /!\[.*?\]\s*\((https?:\/\/[^\s)]+)\)/;
                const match = post.content ? post.content.match(imageRegex) : null;
                const cleanContent = post.content ? post.content.replace(imageRegex, "").trim() : "";
                const imageUrl = match ? match[1] : null;

                return (
                  <Card
                    key={post.id}
                    className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-background py-0 shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md"
                  >
                    <div>
                      <CardHeader className="space-y-3 px-4 pt-4 sm:px-6 sm:pt-6">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="rounded-full bg-muted px-2 py-0.5 font-semibold text-[10px] sm:text-xs text-muted-foreground">
                              Post
                            </span>
                            <time
                              className="text-muted-foreground text-[11px] sm:text-xs"
                              dateTime={post.created_at}
                            >
                              {new Date(post.created_at).toLocaleDateString("ko-KR")}
                            </time>
                          </div>
                          {/* 작성자 표시 영역 (디자인 고도화) */}
                          <span className="text-[11px] text-muted-foreground/80 max-w-[120px] truncate">
                            {post.author_email || "익명"}
                          </span>
                        </div>

                        <CardTitle className="line-clamp-1 text-base font-bold leading-7 text-foreground transition-colors group-hover:text-primary sm:text-lg">
                          <Link href={`/posts/${post.id}`}>{post.title}</Link>
                        </CardTitle>
                      </CardHeader>

                      {/* 💡 컨텐츠 내부 반응형 미디어 배치 구조 */}
                      <CardContent className="px-4 sm:px-6 space-y-3">
                        <div className="flex flex-col sm:flex-row gap-3 items-start">

                          {/* 이미지가 있을 경우 모바일/데스크톱 규격에 맞는 가변 썸네일 노출 */}
                          {imageUrl && (
                            <div className="w-full sm:w-24 sm:h-24 h-36 flex-shrink-0 overflow-hidden rounded-xl border border-border bg-muted/30">
                              <img
                                src={imageUrl}
                                alt="썸네일"
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            </div>
                          )}

                          {/* 텍스트 내용 */}
                          <p className="line-clamp-3 text-xs sm:text-sm leading-relaxed text-muted-foreground break-all flex-1">
                            {cleanContent || "사진이 포함된 스토리입니다. 자세한 내용을 읽어보세요."}
                          </p>
                        </div>
                      </CardContent>
                    </div>

                    <div className="border-t border-border/50 px-4 py-3 sm:px-6 flex items-center justify-between">
                      <Button
                        asChild
                        size="sm"
                        variant="ghost"
                        className="h-9 px-2 text-xs font-semibold text-foreground hover:bg-muted"
                      >
                        <Link href={`/posts/${post.id}`}>글 읽기 →</Link>
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="border-dashed border-border bg-background">
              <CardContent className="flex flex-col items-center justify-center gap-4 px-6 py-12 text-center">
                <p className="text-sm text-muted-foreground">
                  {search ? "검색 결과에 맞는 게시글이 없습니다." : "글이 없습니다."}
                </p>
                <Button asChild className="h-11 px-6 font-medium rounded-xl">
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