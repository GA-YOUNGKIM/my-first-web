import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getPosts } from "@/lib/post-repository";

export async function SketchHome() {
  const posts = await getPosts();
  const recentPosts = posts.slice(0, 3);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8 px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
            <div className="space-y-4">
              <p className="text-xs font-semibold tracking-[0.24em] text-muted-foreground uppercase">
                personal blog
              </p>
              <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                읽기 편한 속도로
                <span className="block text-primary">기록을 쌓는 개인 블로그</span>
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                하루의 생각, 배운 점, 짧은 메모를 부담 없이 남길 수 있는 공간입니다.
                화려한 장식보다 읽기 쉬운 구조를 먼저 생각했습니다.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-background p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Input
                  type="search"
                  placeholder="제목 또는 내용 검색"
                  className="h-11 rounded-xl bg-background px-4"
                />
                <Button size="lg" className="h-11 whitespace-nowrap px-6 font-medium">
                  검색
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-11 px-6 font-medium">
                <Link href="/posts">글 목록 보기</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-11 px-6 font-medium">
                <Link href="/posts/new">새 글 쓰기</Link>
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Card className="border-border/70 bg-background">
                <CardContent className="p-4">
                  <p className="text-xs font-medium text-muted-foreground">읽기</p>
                  <p className="mt-2 text-sm font-semibold text-foreground">짧고 편안한 글 목록</p>
                </CardContent>
              </Card>
              <Card className="border-border/70 bg-background">
                <CardContent className="p-4">
                  <p className="text-xs font-medium text-muted-foreground">작성</p>
                  <p className="mt-2 text-sm font-semibold text-foreground">로그인 후 글 작성</p>
                </CardContent>
              </Card>
              <Card className="border-border/70 bg-background">
                <CardContent className="p-4">
                  <p className="text-xs font-medium text-muted-foreground">관리</p>
                  <p className="mt-2 text-sm font-semibold text-foreground">마이페이지에서 정리</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="border-t border-border bg-muted/25 p-5 lg:border-l lg:border-t-0 sm:p-8 lg:p-10">
            <Card className="h-full border-border/70 bg-background">
              <CardHeader className="space-y-2 border-b border-border/70 pb-5">
                <CardDescription>오늘의 블로그</CardDescription>
                <CardTitle className="text-2xl">Gayoung&apos;s page</CardTitle>
              </CardHeader>

              <CardContent className="space-y-6 pt-5">
                <div className="space-y-3 rounded-2xl border border-border bg-secondary/30 p-4">
                  <p className="text-sm font-medium text-foreground">블로그 소개</p>
                  <p className="text-sm leading-7 text-muted-foreground">
                    짧은 기록도 편하게 남길 수 있도록, 밝고 조용한 분위기로 정리했습니다.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">최근 글</p>
                    <Link href="/posts" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      전체 보기
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {recentPosts.length > 0 ? (
                      recentPosts.map((post) => (
                        <Link
                          key={post.id}
                          href={`/posts/${post.id}`}
                          className="block rounded-2xl border border-border bg-background px-4 py-3 transition-colors hover:border-primary/30 hover:bg-primary/5"
                        >
                          <p className="text-sm font-medium text-foreground line-clamp-1">
                            {post.title}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                            {post.content}
                          </p>
                        </Link>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-dashed border-border bg-background px-4 py-6 text-sm text-muted-foreground">
                        아직 글이 없어요. 첫 글을 작성해보세요.
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>

              <CardContent className="pt-0">
                <div className="rounded-2xl border border-border bg-background px-4 py-4">
                  <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
                    note
                  </p>
                  <p className="mt-2 text-sm leading-7 text-foreground">
                    글이 많아져도 편하게 읽히도록, 화면은 최대한 단정하게 유지합니다.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}