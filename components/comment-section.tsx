import { createCommentAction, deleteCommentAction } from "@/app/posts/[id]/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Comment } from "@/lib/comments";

interface CommentSectionProps {
  postId: number;
  comments: Comment[];
}

export function CommentSection({ postId, comments }: CommentSectionProps) {
  return (
    <Card id="comments" className="mt-6 rounded-3xl border border-border bg-card shadow-sm">
      <CardHeader className="border-b border-border/70 pb-4">
        <CardTitle className="text-xl text-foreground">댓글</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <form action={createCommentAction.bind(null, postId)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
            <div className="space-y-2">
              <label htmlFor="author" className="block text-sm font-medium text-foreground">
                작성자
              </label>
              <Input id="author" name="author" placeholder="이름을 입력하세요" />
            </div>
            <div className="space-y-2">
              <label htmlFor="content" className="block text-sm font-medium text-foreground">
                댓글 내용
              </label>
              <Textarea
                id="content"
                name="content"
                placeholder="의견이나 응원의 말을 남겨보세요"
                required
                rows={4}
                className="min-h-28 rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="h-11 px-6 font-medium">
              댓글 남기기
            </Button>
          </div>
        </form>

        <div className="space-y-3 border-t border-border/70 pt-6">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <article
                key={comment.id}
                className="rounded-2xl border border-border bg-background px-4 py-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{comment.author}</p>
                    <p className="text-xs text-muted-foreground">{comment.date}</p>
                  </div>
                  <form action={deleteCommentAction.bind(null, postId, comment.id)}>
                    <Button type="submit" variant="ghost" size="sm" className="text-muted-foreground">
                      삭제
                    </Button>
                  </form>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-foreground">
                  {comment.content}
                </p>
              </article>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-background px-4 py-8 text-center text-sm text-muted-foreground">
              아직 댓글이 없어요. 첫 번째 이야기를 남겨보세요.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}