import Link from "next/link";
import { signUpAction } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : "";

  return (
    <section className="mx-auto w-full max-w-md px-4 py-12">
      <Card className="border bg-card">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">회원가입</CardTitle>
          <CardDescription>새 계정을 만들고 블로그 기능을 사용해 보세요.</CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <form action={signUpAction} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                이메일
              </label>
              <Input id="email" name="email" type="email" required placeholder="you@example.com" />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                비밀번호 (8자 이상)
              </label>
              <Input id="password" name="password" type="password" required minLength={8} />
            </div>

            <Button type="submit" className="w-full">
              회원가입
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            이미 계정이 있나요?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              로그인
            </Link>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}