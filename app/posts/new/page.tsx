import Link from 'next/link';
import { createPostAction } from '@/app/posts/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function NewPostPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8 space-y-4">
        <Button asChild variant="ghost" className="px-0 text-sm font-medium text-muted-foreground hover:text-foreground">
          <Link href="/posts">← 목록으로 돌아가기</Link>
        </Button>
        <div className="space-y-2">
          <p className="text-sm font-medium tracking-[0.2em] text-muted-foreground uppercase">write</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">새 게시글 작성</h1>
          <p className="text-sm leading-7 text-muted-foreground sm:text-base">제목과 내용을 차분하게 작성해 보세요.</p>
        </div>
      </div>

      <Card className="border border-border bg-card shadow-sm">
        <CardHeader className="border-b border-border/70 pb-4">
          <CardTitle className="text-xl text-foreground">작성 폼</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form action={createPostAction} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-foreground">
                제목
              </label>
              <Input
                type="text"
                id="title"
                name="title"
                placeholder="제목을 입력하세요"
                required
                className="h-11 rounded-xl px-4"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="block text-sm font-medium text-foreground">
                내용
              </label>
              <textarea
                id="content"
                name="content"
                placeholder="여기에 내용을 작성하세요..."
                required
                rows={10}
                className="min-h-64 w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              />
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Button type="submit" size="lg" className="h-11 flex-1 font-medium">
                게시글 저장하기
              </Button>
              <Button asChild variant="outline" size="lg" className="h-11 flex-1 font-medium sm:flex-none sm:px-8">
                <Link href="/posts">취소</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
