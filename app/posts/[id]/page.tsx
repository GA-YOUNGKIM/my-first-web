import Link from "next/link";
import { deletePostAction } from "@/app/posts/actions";
import { CommentSection } from "@/components/comment-section";
import { getCommentsByPostId } from "@/lib/comments";
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
  const comments = await getCommentsByPostId(postId);

  if (!post) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted text-3xl text-muted-foreground">
          ⚠️
        </div>
        <h1 className="mb-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          게시글을 찾을 수 없습니다
        </h1>
        <p className="mb-10 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base">
          요청하신 글이 존재하지 않거나 삭제되었을 수 있습니다. 목록으로 돌아가 다른 글을
          읽어보세요.
        </p>
        <Button asChild size="lg" className="h-11 px-6 font-medium">
          <Link href="/posts">목록으로 돌아가기</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-6 flex items-center justify-between gap-3">
        <Button asChild variant="ghost" className="h-10 px-3 text-muted-foreground hover:text-foreground">
          <Link href="/posts">← 목록으로 돌아가기</Link>
        </Button>
        <p className="text-sm text-muted-foreground">읽기 편한 본문 중심 페이지</p>
      </div>

      <Card className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <CardContent className="p-0">
          <header className="border-b border-border/70 px-5 py-7 text-center sm:px-8 sm:py-8">
            <div className="mb-4 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="rounded-full bg-muted px-3 py-1 font-semibold uppercase tracking-wide text-muted-foreground">
                post
              </span>
              <time className="font-medium text-muted-foreground" dateTime={post.date}>
                {post.date}
              </time>
            </div>

            <h1 className="mx-auto max-w-3xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>

            <div className="mt-6 flex items-center justify-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-foreground">
                {post.author[0]}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">{post.author}</p>
                <p className="text-xs text-muted-foreground">작성자</p>
              </div>
            </div>
          </header>

          <div className="px-5 py-7 sm:px-8 sm:py-10">
            <div className="mx-auto max-w-2xl whitespace-pre-wrap text-base leading-8 text-foreground sm:text-[1.05rem]">
              {post.content}
            </div>

            <div className="mt-10 flex flex-col gap-3 border-t border-border/70 pt-6 sm:flex-row sm:justify-end">
              <Button asChild variant="outline" size="lg" className="h-11 px-6 font-medium">
                <Link href={`/posts/${post.id}/edit`}>수정</Link>
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="lg" className="h-11 px-6 font-medium">
                    삭제
                  </Button>
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
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6 rounded-3xl border border-border bg-background">
        <CardContent className="flex flex-col items-center gap-4 px-6 py-8 text-center sm:px-8">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">도움이 되셨나요?</h3>
            <p className="text-sm leading-7 text-muted-foreground">
              더 많은 글을 읽고 싶다면 목록으로 돌아가 보세요.
            </p>
          </div>
          <Button asChild className="h-11 px-6 font-medium">
            <Link href="/posts">다른 글 보기</Link>
          </Button>
        </CardContent>
      </Card>

      <CommentSection postId={postId} comments={comments} />
    </div>
  );
}
