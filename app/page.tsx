import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:py-16">
      <section className="rounded-2xl border bg-card px-6 py-10 text-center sm:px-10 sm:py-14">
        <p className="mb-3 text-sm font-medium text-muted-foreground">Personal Dev Journal</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          내 블로그
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          다양한 개발 경험을 차분하게 기록하고 공유하는 공간입니다.
          빠르게 훑어볼 수도 있고, 천천히 읽어도 편안한 흐름을 목표로 만들고 있습니다.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/posts">글 목록 보기</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
            <Link href="/posts/new">새 글 쓰기</Link>
          </Button>
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="border bg-card">
          <CardHeader>
            <CardTitle>읽기 쉬운 글</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-6 text-muted-foreground">
            핵심 내용을 먼저 보여주고, 필요한 설명은 자연스럽게 이어지는 구조로 작성합니다.
          </CardContent>
        </Card>

        <Card className="border bg-card">
          <CardHeader>
            <CardTitle>꾸준한 업데이트</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-6 text-muted-foreground">
            공부한 내용과 시행착오를 꾸준히 정리해, 나중에 다시 찾아보기 쉬운 기록을 남깁니다.
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
