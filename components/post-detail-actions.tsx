"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getUserFriendlyErrorMessage } from "@/lib/error-message";

interface PostDetailActionsProps {
  postId: string;
  postUserId: string;
}

export function PostDetailActions({ postId, postUserId }: PostDetailActionsProps) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  // 클라이언트 측의 권한 분기는 단순히 UI 상에서 편의를 위해 버튼을 노출/제어하는 용도입니다.
  // 실제 쓰기/수정/삭제 권한에 대한 강력한 보안 통제는 데이터베이스의 Ch11 RLS(Row Level Security) 정책이 담당합니다.
  const canManage = user?.id === postUserId;

  useEffect(() => {
    if (!loading && !user) {
      setErrorMessage("로그인이 필요합니다.");
    }
  }, [loading, user]);

  async function handleDelete(): Promise<void> {
    if (!user) {
      setErrorMessage("로그인이 필요합니다.");
      router.replace("/login");
      return;
    }

    if (user.id !== postUserId) {
      setErrorMessage("이 글을 삭제할 수 없습니다.");
      return;
    }

    setErrorMessage("");
    setIsDeleting(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.from("posts").delete().eq("id", postId);

      if (error) {
        setErrorMessage(getUserFriendlyErrorMessage(error));
        return;
      }

      router.push("/posts");
      router.refresh();
    } catch (error) {
      setErrorMessage(getUserFriendlyErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  }

  if (!canManage) {
    return null;
  }

  return (
    <>
      <div className="mt-10 flex flex-col gap-3 border-t border-border/70 pt-6 sm:flex-row sm:justify-end">
        <Button asChild variant="outline" size="lg" className="h-11 px-6 font-medium">
          <Link href={`/posts/${postId}/edit`}>수정</Link>
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" size="lg" className="h-11 px-6 font-medium">
              삭제
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>게시글을 삭제할까요?</DialogTitle>
              <DialogDescription>
                삭제한 게시글은 복구할 수 없습니다. 정말 삭제하시겠어요?
              </DialogDescription>
            </DialogHeader>
            {errorMessage ? (
              <p className="text-sm text-destructive">{errorMessage}</p>
            ) : null}
            <DialogFooter className="gap-2 sm:justify-end">
              <DialogClose asChild>
                <Button variant="outline">취소</Button>
              </DialogClose>
              <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? "삭제 중" : "삭제하기"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {errorMessage ? <p className="mt-3 text-sm text-destructive">{errorMessage}</p> : null}
    </>
  );
}