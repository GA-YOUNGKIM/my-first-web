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

interface PostDetailActionsProps {
  postId: string;
  postUserId: string;
}

export function PostDetailActions({ postId, postUserId }: PostDetailActionsProps) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  // UI 분기만 담당한다. 실제 권한 보안은 Ch11 RLS에서 강제한다.
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
        setErrorMessage("게시글을 삭제하지 못했습니다.");
        return;
      }

      router.push("/posts");
      router.refresh();
    } catch {
      setErrorMessage("게시글을 삭제하지 못했습니다.");
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