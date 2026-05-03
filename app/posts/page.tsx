import Link from "next/link";
import { getPosts } from "@/lib/post-repository";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-6 border-b border-border/70 px-5 py-7 sm:px-8 sm:py-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="text-xs font-semibold tracking-[0.24em] text-muted-foreground uppercase">
              posts
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              전체 게시글
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              최신 글부터 차분하게 읽어보세요. 글이 많아져도 목록이 보기 쉽게 유지됩니다.
            </p>
          </div>

          <Button asChild size="lg" className="h-11 px-6 font-medium whitespace-nowrap">
            <Link href="/posts/new">
              <span className="text-xl">+</span> 새 글 쓰기
            </Link>
          </Button>
        </div>

        <div className="px-5 py-5 sm:px-8 sm:py-6">
          <div className="mb-5 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>총 {posts.length}개의 글</span>
            <span>최근 글이 위에 표시됩니다</span>
          </div>

          {posts.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-2">
              {posts.map((post) => (
                <Card
                  key={post.id}
                  className="group h-full overflow-hidden rounded-2xl border border-border bg-background py-0 shadow-sm transition-colors hover:border-primary/30"
                >
                  <CardHeader className="space-y-3 px-5 pt-5 sm:px-6 sm:pt-6">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="rounded-full bg-muted px-2.5 py-1 font-semibold text-muted-foreground">
                        Post
                      </span>
                      <time className="text-muted-foreground" dateTime={post.date}>
                        {post.date}
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

                  <CardFooter className="flex flex-col gap-3 border-t border-border/70 bg-transparent px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-foreground">
                        {post.author[0]}
                      </div>
                      <div className="leading-tight">
                        <p className="text-sm font-medium text-foreground">{post.author}</p>
                        <p className="text-xs text-muted-foreground">작성자</p>
                      </div>
                    </div>
                    <Button
                      asChild
                      size="default"
                      variant="ghost"
                      className="h-10 px-3 font-medium text-foreground hover:bg-background"
                    >
                      <Link href={`/posts/${post.id}`}>글 읽기 →</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-dashed border-border bg-background">
              <CardContent className="flex flex-col items-center justify-center gap-4 px-6 py-12 text-center">
                <p className="text-base font-medium text-foreground">아직 글이 없어요</p>
                <p className="max-w-md text-sm leading-7 text-muted-foreground">
                  첫 글을 작성하면 이 공간에 카드 형태로 차곡차곡 쌓입니다.
                </p>
                <Button asChild className="h-11 px-6 font-medium">
                  <Link href="/posts/new">첫 글 쓰기</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
