import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-4xl items-center px-4 py-12 sm:px-6">
      <Card className="w-full overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <CardContent className="space-y-6 px-6 py-12 text-center sm:px-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted text-2xl text-muted-foreground">
            404
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              페이지를 찾을 수 없어요.
            </h1>
            <p className="text-sm leading-7 text-muted-foreground">
              주소가 잘못되었거나 페이지가 이동되었습니다. 홈 또는 게시글 목록으로 이동해 보세요.
            </p>
          </div>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild className="h-11 px-6 font-medium">
              <Link href="/">홈으로 이동</Link>
            </Button>
            <Button asChild variant="outline" className="h-11 px-6 font-medium">
              <Link href="/posts">게시글 목록</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}