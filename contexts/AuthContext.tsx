"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  signInWithEmail as signInWithEmailHelper,
  signUpWithEmail as signUpWithEmailHelper,
  signOut as signOutHelper,
} from "@/lib/auth";

interface AuthContextValue {
  user: any | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<any>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const supabase = createClient();

    let isMounted = true;

    async function initializeUser() {
      try {
        const { data } = await supabase.auth.getUser();

        if (!isMounted) {
          return;
        }

        setUser(data.user ?? null);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    initializeUser();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      if (!isMounted) {
        return;
      }

      setUser(session?.user ?? null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function signInWithEmail(email: string, password: string) {
    return signInWithEmailHelper(email, password);
  }

  async function signUpWithEmail(email: string, password: string, name: string) {
    return signUpWithEmailHelper(email, password, name);
  }

  async function handleSignOut() {
    const result = await signOutHelper();
    if (!result.error) {
      setUser(null);
    }
    return result;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithEmail,
        signUpWithEmail,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
