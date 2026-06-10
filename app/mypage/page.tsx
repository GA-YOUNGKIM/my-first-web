import Link from "next/link";
import { getCurrentUser, createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";

export default async function MyPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const profileEmail = user.email || "사용자";

  const supabase = await createClient();
  const { data: myPosts, error } = await supabase
    .from("posts")
    .select("id, title, content, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("내가 쓴 글 목록을 불러오지 못했습니다.", error);
  }

  const activePosts = myPosts || [];
  const recentDate = activePosts.length > 0
    ? new Date(activePosts[0].created_at).toLocaleDateString("ko-KR")
    : "-";

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <section className="space-y-6">
        <div className="space-y-3">
          <p className="text-xs font-semibold tracking-[0.24em] text-muted-foreground uppercase">
            my page
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            내 블로그 현황
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            작성자 프로필과 내가 쓴 글을 한 번에 볼 수 있는 개인 관리 공간입니다.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
          <Card className="rounded-3xl border border-border bg-card shadow-sm">
            <CardHeader className="border-b border-border/70 pb-4">
              <CardTitle className="text-xl text-foreground">프로필</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-semibold text-foreground">
                {profileEmail[0]?.toUpperCase() ?? "U"}
              </div>
              <div className="space-y-2">
                <p className="text-lg font-semibold text-foreground">{profileEmail}</p>
                <p className="text-sm leading-7 text-muted-foreground">
                  Supabase 인증 사용자입니다. 안전하게 블로그를 작성하고 관리할 수 있습니다.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-border bg-background px-4 py-3">
                  <p className="text-xs text-muted-foreground">총 글 수</p>
                  <p className="mt-1 text-2xl font-semibold text-foreground">{activePosts.length}</p>
                </div>
                <div className="rounded-2xl border border-border bg-background px-4 py-3">
                  <p className="text-xs text-muted-foreground">최근 활동</p>
                  <p className="mt-1 text-2xl font-semibold text-foreground">
                    {recentDate}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3 pt-2">
                <Button asChild className="h-11 px-6 font-medium">
                  <Link href="/posts/new">새 글 쓰기</Link>
                </Button>
                <Button asChild variant="outline" className="h-11 px-6 font-medium">
                  <Link href="/posts">전체 글 보기</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-border bg-card shadow-sm">
            <CardHeader className="border-b border-border/70 pb-4">
              <CardTitle className="text-xl text-foreground">내가 쓴 글</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-6">
              {activePosts.length > 0 ? (
                activePosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/posts/${post.id}`}
                    className="block rounded-2xl border border-border bg-background px-4 py-4 transition-colors hover:border-primary/30 hover:bg-primary/5"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-1">
                        <p className="text-base font-semibold text-foreground">{post.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">{post.content}</p>
                      </div>
                      <time className="text-xs text-muted-foreground" dateTime={post.created_at}>
                        {new Date(post.created_at).toLocaleDateString("ko-KR")}
                      </time>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-background px-4 py-8 text-center text-sm text-muted-foreground">
                  아직 내 이름으로 작성된 글이 없어요.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}