import Link from "next/link";
import { signInAction } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : "";
  const message = typeof params.message === "string" ? params.message : "";

  return (
    <section className="mx-auto w-full max-w-md px-4 py-12">
      <Card className="border bg-card">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">로그인</CardTitle>
          <CardDescription>이메일과 비밀번호로 로그인해 글을 관리하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          {message ? (
            <p className="mb-4 rounded-md border border-border bg-muted px-3 py-2 text-sm text-muted-foreground">
              {message}
            </p>
          ) : null}

          {error ? (
            <p className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <form action={signInAction} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                이메일
              </label>
              <Input id="email" name="email" type="email" required placeholder="you@example.com" />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                비밀번호
              </label>
              <Input id="password" name="password" type="password" required minLength={8} />
            </div>

            <Button type="submit" className="w-full">
              로그인
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            계정이 없나요?{" "}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              회원가입
            </Link>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}