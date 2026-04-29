# Copilot Instructions

## Tech Stack

- **Next.js**: 16.2.1 (App Router ONLY)
- **Tailwind CSS**: 4
- **React**: 19.2.4
- **TypeScript**: 5

## Coding Conventions

- **Server Component 기본**: 모든 컴포넌트는 기본적으로 Server Component로 작성한다. Client Component가 필요한 경우에만 `"use client"` 디렉티브를 추가한다.
- **Tailwind CSS만 사용**: 스타일링은 반드시 Tailwind CSS만 사용한다. 인라인 스타일(`style={}`)이나 CSS Modules, styled-components 등은 사용하지 않는다.

## Design Tokens

- **색상 토큰 사용**: 하드코딩 색상 대신 토큰 기반 클래스를 사용한다.
	- 배경: `bg-background`
	- 본문 텍스트: `text-foreground`
	- 카드 배경: `bg-card`
	- 보조 배경/텍스트: `bg-muted`, `text-muted-foreground`
	- 주요 액션: `bg-primary`, `text-primary-foreground`
	- 테두리/입력/포커스: `border-border`, `border-input`, `ring-ring`
- **간격/레이아웃 토큰**: `max-w-4xl mx-auto`, `space-y-6`, `grid-cols-1 md:grid-cols-2`를 기본 레이아웃 기준으로 사용한다.

## Component Rules

- UI 구성은 shadcn/ui 컴포넌트를 우선 사용한다 (`@/components/ui/*`).
- 버튼/네비게이션/액션: `Button`
- 목록/정보 블록: `Card`, `CardHeader`, `CardContent`, `CardFooter`
- 입력 폼: `Input` (본문 입력은 필요 시 기본 `textarea` 허용)
- 삭제 확인/중요 확인: `Dialog`
- 동일 역할 UI를 직접 div/button으로 재구현하지 말고, 먼저 shadcn/ui 컴포넌트 사용 가능 여부를 확인한다.

## Known AI Mistakes

> ⚠️ 아래 실수를 절대 하지 마세요.

| ❌ 하지 말 것 | ✅ 올바른 방법 | 이유 |
|---|---|---|
| `import { useRouter } from 'next/router'` | `import { useRouter } from 'next/navigation'` | `next/router`는 Pages Router 전용이며 App Router에서 동작하지 않음 |
| Pages Router (`pages/` 디렉토리) 사용 | App Router (`app/` 디렉토리) 사용 | 이 프로젝트는 App Router만 사용함 |
| `params`를 동기적으로 접근 | `params`는 반드시 `await` 후 사용 | Next.js 15+에서 `params`는 Promise이므로 `await`이 필수 |
