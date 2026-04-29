import Link from "next/link";
import { deletePostAction } from "@/app/posts/actions";
import { getPostById } from "@/lib/post-repository";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const postId = Number(id);
  const post = await getPostById(postId);

  if (!post) {
    return (
      <div className="py-24 text-center">
        <div className="w-20 h-20 bg-muted text-muted-foreground rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
          ⚠️
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-4">
          게시글을 찾을 수 없습니다
        </h1>
        <p className="text-muted-foreground mb-10">요청하신 데이터가 존재하지 않거나 삭제되었을 수 있습니다.</p>
        <Button asChild>
          <Link href="/posts">← 목록으로 돌아가기</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12">
      <Button asChild variant="ghost" className="mb-8 text-muted-foreground hover:text-primary">
        <Link href="/posts">← 목록으로 돌아가기</Link>
      </Button>

      <Card className="rounded-xl border bg-card">
        <CardContent className="p-6 sm:p-8">
          <header className="mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-5">
              <span className="px-3 py-1 text-xs font-semibold bg-muted text-muted-foreground rounded-full uppercase tracking-wide">Development</span>
              <time className="text-xs text-muted-foreground font-medium" dateTime={post.date}>{post.date}</time>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-snug mb-6">
              {post.title}
            </h1>
            <div className="flex items-center justify-center gap-3 pt-6 border-t border-border max-w-xs mx-auto">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-foreground text-sm font-semibold">
                {post.author[0]}
              </div>
              <span className="text-foreground font-medium">{post.author}</span>
            </div>
          </header>

          <div className="prose prose-sm sm:prose-base max-w-none text-foreground leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>

          <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row flex-wrap gap-3 justify-end">
            <Button asChild variant="outline" size="lg">
              <Link href={`/posts/${post.id}/edit`}>수정</Link>
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" size="lg">삭제</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>게시글을 삭제할까요?</DialogTitle>
                  <DialogDescription>
                    삭제한 게시글은 복구할 수 없습니다. 정말 삭제하시겠어요?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:justify-end">
                  <DialogClose asChild>
                    <Button variant="outline">취소</Button>
                  </DialogClose>
                  <form action={deletePostAction.bind(null, post.id)}>
                    <Button type="submit" variant="destructive">
                      삭제하기
                    </Button>
                  </form>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mt-8 rounded-xl border bg-card">
        <CardContent className="p-6 sm:p-8 text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">도움이 되셨나요?</h3>
          <p className="text-sm text-muted-foreground mb-6">더 많은 글을 읽어보세요.</p>
          <Button asChild className="font-medium">
            <Link href="/posts">다른 글 보기</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
