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
    <div className="py-8 px-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">전체 게시글</h1>
          <p className="text-muted-foreground mt-2">다양한 주제의 이야기를 만나보세요.</p>
        </div>
        <Button asChild size="lg" className="font-bold whitespace-nowrap">
          <Link href="/posts/new">
            <span className="text-xl">+</span> 새 글 쓰기
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post) => (
          <Card
            key={post.id}
            className="group rounded-2xl border bg-card py-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 text-xs font-semibold text-primary bg-muted rounded-full">Blog</span>
                <time className="text-xs text-muted-foreground" dateTime={post.date}>{post.date}</time>
              </div>
              <CardTitle className="text-lg sm:text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                <Link href={`/posts/${post.id}`}>{post.title}</Link>
              </CardTitle>
            </CardHeader>

            <CardContent className="px-4 sm:px-6">
              <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-4 flex-grow">
                {post.content}
              </p>
            </CardContent>

            <CardFooter className="px-4 sm:px-6 py-4 sm:py-6 bg-transparent border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-foreground text-xs font-semibold">
                  {post.author[0]}
                </div>
                <span className="text-sm font-medium text-foreground">{post.author}</span>
              </div>
              <Button asChild size="sm" variant="ghost" className="font-medium">
                <Link href={`/posts/${post.id}`}>글 읽기 →</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
