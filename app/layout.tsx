import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/contexts/AuthContext";
import { SiteHeader } from "@/components/site-header";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "내 블로그",
  description: "개발 블로그입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={cn("font-sans", geist.variable)}>
      <body className="antialiased bg-background text-foreground">
        <AuthProvider>
          <SiteHeader />
          <main className="mx-auto min-h-[calc(100vh-160px)] max-w-4xl px-4 py-6 sm:px-6">
            {children}
          </main>
          <footer className="mt-12 border-t border-border bg-background">
            <div className="mx-auto max-w-4xl px-4 py-10 text-center text-sm text-muted-foreground sm:px-6">
              © 2026 내 블로그. All rights reserved.
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
