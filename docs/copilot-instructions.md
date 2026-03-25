# Copilot Instructions

## Tech Stack

- **Next.js**: 16.2.1 (App Router ONLY)
- **Tailwind CSS**: 4
- **React**: 19.2.4
- **TypeScript**: 5

## Coding Conventions

- **Server Component 기본**: 모든 컴포넌트는 기본적으로 Server Component로 작성한다. Client Component가 필요한 경우에만 `"use client"` 디렉티브를 추가한다.
- **Tailwind CSS만 사용**: 스타일링은 반드시 Tailwind CSS만 사용한다. 인라인 스타일(`style={}`)이나 CSS Modules, styled-components 등은 사용하지 않는다.

## Known AI Mistakes

> ⚠️ 아래 실수를 절대 하지 마세요.

| ❌ 하지 말 것 | ✅ 올바른 방법 | 이유 |
|---|---|---|
| `import { useRouter } from 'next/router'` | `import { useRouter } from 'next/navigation'` | `next/router`는 Pages Router 전용이며 App Router에서 동작하지 않음 |
| Pages Router (`pages/` 디렉토리) 사용 | App Router (`app/` 디렉토리) 사용 | 이 프로젝트는 App Router만 사용함 |
| `params`를 동기적으로 접근 | `params`는 반드시 `await` 후 사용 | Next.js 15+에서 `params`는 Promise이므로 `await`이 필수 |
