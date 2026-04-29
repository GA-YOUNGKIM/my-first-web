import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function SketchHome() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <section className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6 px-5 py-8 sm:px-8 sm:py-10">
            <div className="space-y-3">
              <p className="text-sm font-medium tracking-[0.2em] text-muted-foreground uppercase">
                personal blog
              </p>
              <h1 className="max-w-xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                읽기 편하고 조용한 개인 블로그
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                하루의 기록, 짧은 생각, 사진 메모를 차분하게 정리하는 공간입니다.
              </p>
            </div>

            <div className="space-y-3 rounded-2xl border border-border bg-background p-4 sm:p-5">
              <p className="text-sm font-medium text-foreground">검색</p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                  type="search"
                  placeholder="제목 또는 내용 검색"
                  className="h-11 rounded-xl bg-background px-4"
                />
                <Button size="lg" className="h-11 whitespace-nowrap px-6 font-medium">
                  검색
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="font-medium">
                <Link href="/posts">글 목록 보기</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="font-medium">
                <Link href="/posts/new">새 글 쓰기</Link>
              </Button>
            </div>
          </div>

          <div className="border-t border-border bg-muted/30 p-5 lg:border-l lg:border-t-0 sm:p-8">
            <Card className="h-full border-border/70 bg-background/80">
              <CardHeader className="space-y-2 border-b border-border/70">
                <CardDescription>오늘의 블로그</CardDescription>
                <CardTitle className="text-2xl">Gayoung&apos;s page</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="aspect-[4/3] rounded-xl border border-border bg-secondary/40" />
                <p className="text-sm leading-7 text-foreground">
                  짧은 기록도 부담 없이 남길 수 있는 블로그를 목표로 합니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}