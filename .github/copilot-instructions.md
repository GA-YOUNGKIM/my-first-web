# Copilot Instructions

## Tech Stack

- **Framework**: Next.js 16.2.1 (App Router ONLY)
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript 5

## Coding Conventions

- 모든 컴포넌트는 **Server Component**를 기본으로 작성한다.
- 클라이언트 컴포넌트가 필요한 경우에만 `"use client"` 디렉티브를 추가한다.
- 스타일링은 **Tailwind CSS만** 사용한다. 인라인 스타일(`style` 속성)이나 CSS Modules를 사용하지 않는다.

## Known AI Mistakes

- ❌ `next/router` 사용 금지 → ✅ `next/navigation`을 사용할 것.
- ❌ Pages Router(`pages/` 디렉토리) 패턴 금지 → ✅ App Router(`app/` 디렉토리)만 사용할 것.
- ❌ `params`를 동기적으로 접근 금지 → ✅ `params`는 반드시 `await`하여 사용할 것.

```tsx
// ❌ 잘못된 예시
import { useRouter } from "next/router";

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params; // 동기 접근 금지
}

// ✅ 올바른 예시
import { useRouter } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // await 필수
}
```
