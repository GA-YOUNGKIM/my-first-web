import Link from "next/link";
import { updatePostAction } from "@/app/posts/actions";
import { getPostById } from "@/lib/post-repository";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default async function EditPostPage({
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
        <h1 className="text-3xl font-bold text-foreground mb-4">수정할 게시글이 없습니다</h1>
        <Button asChild>
          <Link href="/posts">← 목록으로 돌아가기</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="mb-8">
        <Button asChild variant="ghost" className="text-sm font-medium text-muted-foreground hover:text-primary">
          <Link href={`/posts/${post.id}`}>← 상세로 돌아가기</Link>
        </Button>
        <h1 className="text-3xl font-bold text-foreground mt-6 tracking-tight">게시글 수정</h1>
      </div>

      <Card className="border border-border bg-card shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-foreground">수정 폼</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            action={updatePostAction.bind(null, post.id)}
            className="space-y-8"
          >
            <div>
              <label htmlFor="title" className="block text-sm font-bold text-foreground mb-2 ml-1">
                제목
              </label>
              <Input
                type="text"
                id="title"
                name="title"
                defaultValue={post.title}
                placeholder="제목을 입력하세요"
                required
                className="h-10 rounded-lg px-3"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-bold text-foreground mb-2 ml-1">
                내용
              </label>
              <Textarea
                id="content"
                name="content"
                defaultValue={post.content}
                placeholder="여기에 내용을 작성하세요..."
                required
                rows={10}
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground placeholder-muted-foreground"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                type="submit"
                size="lg"
                className="flex-1 font-bold"
              >
                수정사항 저장
              </Button>
              <Button asChild variant="outline" size="lg" className="flex-1 sm:flex-none sm:px-8 font-bold">
                <Link href={`/posts/${post.id}`}>취소</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
