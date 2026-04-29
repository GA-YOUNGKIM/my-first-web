# Copilot Instructions

## Tech Stack

- Next.js 16.2.1 (App Router only)
- React 19.2.4
- Tailwind CSS 4
- shadcn/ui (`components/ui/`)

## Coding Conventions

- 기본은 Server Component로 작성하고, 상호작용이 필요할 때만 `"use client"`를 사용한다.
- 라우팅은 `app/` 디렉토리(App Router)만 사용한다.
- 스타일링은 Tailwind 유틸리티 + 디자인 토큰을 사용한다.

## Design Tokens

- Primary: `--primary`, `--primary-foreground`
- Surface: `--background`, `--card`, `--popover`
- Text: `--foreground`, `--muted-foreground`
- Border/Input/Ring: `--border`, `--input`, `--ring`
- Tailwind 클래스는 토큰 기반으로 사용한다.
- 예: `bg-background`, `text-foreground`, `bg-card`, `border-border`, `text-muted-foreground`

## Component Rules

- UI는 shadcn/ui 컴포넌트를 우선 사용한다.
- 버튼/액션: `Button`
- 목록/콘텐츠 블록: `Card` 계열 컴포넌트
- 폼 입력: `Input` + 필요 시 기본 `textarea`
- 중요한 확인/파괴적 액션: `Dialog`
- 컴포넌트 import 경로는 반드시 `@/components/ui/*`를 사용한다.

## Known AI Mistakes

- `next/router` 사용 금지, 필요 시 `next/navigation` 사용
- `pages/` 라우터 파일 생성 금지
- 하드코딩 색상(`bg-blue-500` 등) 남용 금지, 토큰 우선

추가 상세 규칙은 `AGENT.md`를 참조한다.