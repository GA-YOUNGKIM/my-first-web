import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PostNotFound() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <Card className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <CardContent className="space-y-6 px-6 py-12 text-center sm:px-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted text-2xl text-muted-foreground">
            ?
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              게시글을 찾을 수 없어요.
            </h1>
            <p className="text-sm leading-7 text-muted-foreground">
              삭제되었거나 잘못된 주소일 수 있습니다. 목록에서 다른 글을 확인해 보세요.
            </p>
          </div>
          <Button asChild className="h-11 px-6 font-medium">
            <Link href="/posts">목록으로 돌아가기</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}