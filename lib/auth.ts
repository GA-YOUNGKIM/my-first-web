import { createClient } from "@/lib/supabase/client";

export async function signInWithEmail(email: string, password: string) {
  const supabase = createClient();
  const result = await supabase.auth.signInWithPassword({ email, password });

  return {
    data: result.data,
    error: result.error,
  };
}

export async function signUpWithEmail(email: string, password: string, name: string) {
  const supabase = createClient();
  const result = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });

  return {
    data: result.data,
    error: result.error,
  };
}

export async function signOut() {
  const supabase = createClient();
  const result = await supabase.auth.signOut();

  return {
    data: result.data,
    error: result.error,
  };
}
