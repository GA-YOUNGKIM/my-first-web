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
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium tracking-[0.2em] text-muted-foreground uppercase">
            posts
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            전체 게시글
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            다양한 주제의 이야기를 만나보세요.
          </p>
        </div>

        <Button asChild size="lg" className="whitespace-nowrap font-medium">
          <Link href="/posts/new">
            <span className="text-xl">+</span> 새 글 쓰기
          </Link>
        </Button>
      </section>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-2">
        {posts.map((post) => (
          <Card
            key={post.id}
            className="group h-full overflow-hidden rounded-2xl border border-border bg-card py-0 shadow-sm transition-transform duration-300 hover:-translate-y-0.5"
          >
            <CardHeader className="space-y-2 px-5 pt-5 sm:px-6 sm:pt-6">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-muted px-2.5 py-1 font-semibold text-muted-foreground">
                  Blog
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
              <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                {post.content}
              </p>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 border-t border-border/70 bg-transparent px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-foreground text-xs font-semibold">
                  {post.author[0]}
                </div>
                <span className="text-sm font-medium text-foreground">{post.author}</span>
              </div>
              <Button asChild size="default" variant="ghost" className="h-10 px-3 font-medium text-foreground hover:bg-background">
                <Link href={`/posts/${post.id}`}>글 읽기 →</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
