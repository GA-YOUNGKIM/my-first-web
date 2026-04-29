"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function toQuery(path: string, key: string, message: string) {
  return `${path}?${key}=${encodeURIComponent(message)}`;
}

export async function signInAction(formData: FormData) {
  const email = readString(formData, "email");
  const password = readString(formData, "password");

  if (!email || !password) {
    redirect(toQuery("/login", "error", "이메일과 비밀번호를 입력해 주세요."));
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      redirect(toQuery("/login", "error", "로그인에 실패했습니다. 이메일과 비밀번호를 확인해 주세요."));
    }
  } catch {
    redirect(toQuery("/login", "error", "Supabase 설정을 먼저 완료해 주세요."));
  }

  redirect("/posts");
}

export async function signUpAction(formData: FormData) {
  const email = readString(formData, "email");
  const password = readString(formData, "password");

  if (!email || !password) {
    redirect(toQuery("/signup", "error", "이메일과 비밀번호를 입력해 주세요."));
  }

  if (password.length < 8) {
    redirect(toQuery("/signup", "error", "비밀번호는 8자 이상으로 입력해 주세요."));
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      redirect(toQuery("/signup", "error", "회원가입에 실패했습니다. 이미 가입된 이메일인지 확인해 주세요."));
    }
  } catch {
    redirect(toQuery("/signup", "error", "Supabase 설정을 먼저 완료해 주세요."));
  }

  redirect(toQuery("/login", "message", "회원가입이 완료되었습니다. 이메일 인증 후 로그인해 주세요."));
}