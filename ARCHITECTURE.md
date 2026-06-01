# ARCHITECTURE — my-first-web

이 문서는 개인 블로그 프로젝트의 설계 방향을 초보자도 이해하기 쉽게 정리한 문서입니다.
현재는 프로젝트 목표, App Router 기준 페이지 맵, 주요 유저 플로우를 담고 있습니다.
컴포넌트 구조와 데이터 모델도 아래에 함께 정리했습니다.

## 1. 프로젝트 목표

- 목적: 누구나 글을 쉽게 읽고, 작성자는 로그인 후 글을 안전하게 작성하고 관리할 수 있는 개인 블로그를 만드는 것.
- 핵심 원칙:
  - 읽기 편해야 한다.
  - 글 작성 흐름은 단순해야 한다.
  - 나중에 댓글, 검색, 카테고리 같은 기능을 쉽게 더할 수 있어야 한다.

## 2. 기술 스택

- 프레임워크: Next.js 16.2.1 (App Router only)
- UI: Tailwind CSS 4 + shadcn/ui
- 인증 및 데이터베이스: Supabase (Auth + PostgreSQL)
- 렌더링 기준: Server Component 기본, 상호작용이 필요할 때만 Client Component 사용
- UX 기준: 데이터가 비는 상태는 안내 카드로, 로딩은 `loading.tsx`로, 예외는 `error.tsx`/`global-error.tsx`로 분리한다

## 2-1. 버전 정책

- 교재 기준
  - Next.js: 16.2.1
  - React: 19.2.4
  - TypeScript: 5.x
  - Tailwind CSS: 4.x
  - shadcn/ui: 최신
  - `@supabase/supabase-js`: 2.47.12
  - `@supabase/ssr`: 0.5.2
- 현재 설치 기준 (`package.json`)
  - Next.js: 16.2.1
  - React: 19.2.4
  - TypeScript: ^5
  - Tailwind CSS: ^4
  - shadcn: ^4.6.0
  - `@supabase/supabase-js`: ^2.105.4
  - `@supabase/ssr`: ^0.10.3
- 문서와 예제는 교재 기준으로 적고, 실제 오류 확인과 구현 검증은 현재 설치 기준을 따릅니다.

  ## 3. 페이지 맵 (App Router URL 기준)

| 페이지 | URL | 파일 경로(예시) | 설명 | 접근 권한 |
|---|---|---|---|---|
| 홈 | `/` | `app/page.tsx` | 블로그 소개와 최신 글 진입점 | 누구나 |
| 글 목록 | `/posts` | `app/posts/page.tsx` | 전체 포스트를 한눈에 보는 페이지 | 누구나 |
| 글 상세 | `/posts/[id]` | `app/posts/[id]/page.tsx` | 한 글의 본문을 읽는 페이지 | 누구나 |
| 글 작성 | `/posts/new` | `app/posts/new/page.tsx` | 새 글을 작성하는 페이지 | 로그인한 사용자 |
| 글 수정 | `/posts/[id]/edit` | `app/posts/[id]/edit/page.tsx` | 이미 쓴 글을 고치는 페이지 | 작성자 전용 |
| 로그인 | `/login` | `app/login/page.tsx` | 이메일과 비밀번호로 로그인 | 비로그인 사용자 |
| 회원가입 | `/signup` | `app/signup/page.tsx` | 새 계정을 만드는 페이지 | 누구나 |
| 마이페이지 | `/mypage` | `app/mypage/page.tsx` | 내 프로필과 내가 쓴 글을 보는 페이지 | 로그인한 사용자 |

### 라우팅 메모

- `app/page.tsx` → `/`
- `app/posts/page.tsx` → `/posts`
- `app/posts/new/page.tsx` → `/posts/new`
- `app/posts/[id]/page.tsx` → `/posts/[id]`
- `app/posts/[id]/edit/page.tsx` → `/posts/[id]/edit`
- `app/login/page.tsx` → `/login`
- `app/signup/page.tsx` → `/signup`
- `app/mypage/page.tsx` → `/mypage`

## 4. 유저 플로우

아래 흐름은 사용자가 실제로 어떻게 이동하는지 보여줍니다.

### 4-1. 글 읽기 플로우

1. 사용자가 `/`(홈)에 들어옵니다.
2. `글 목록`을 눌러 `/posts`로 이동합니다.
3. 관심 있는 글 카드를 눌러 `/posts/[id]`로 들어갑니다.
4. 본문을 읽고 목록이나 다른 글로 이동합니다.

### 4-2. 인증 플로우 (Ch9)

1. 사용자가 `/signup`에서 이름, 이메일, 비밀번호를 입력해 회원가입합니다.
2. 가입 성공 후 `/login`으로 이동해 로그인합니다.
3. Supabase Auth가 세션을 저장하고 `AuthProvider`가 전역 상태를 업데이트합니다.
4. 새로고침해도 `getUser()`와 `onAuthStateChange()` 구독으로 로그인 상태가 유지됩니다.
5. Header는 `useAuth()`를 통해 로그인 상태를 읽고, 링크/버튼을 분기해 표시합니다.
6. 로그아웃 버튼 클릭 시 `signOut()`을 호출하고, 상태가 업데이트되며 `/`로 이동합니다.

### 4-3. 글 작성 플로우

1. 로그인 상태가 아니면 `새 글 쓰기` 클릭 시 `middleware.ts`가 `/login`으로 리다이렉트합니다.
2. 로그인한 사용자는 `/posts/new`에 접근할 수 있고, 제목과 본문을 입력합니다.
3. 제목과 본문을 입력하고 저장합니다.
4. 저장 후 `/posts/[새글ID]`로 이동해 결과를 확인합니다.

### 4-4. 마이페이지 확인 플로우

1. 로그인한 사용자가 `/mypage`로 이동합니다. (비로그인이면 `middleware.ts`가 `/login`으로 리다이렉트)
2. 프로필 정보와 내가 쓴 글 목록을 확인합니다.
3. 글을 선택해 `/posts/[id]`로 이동합니다.
4. 필요하면 `/posts/[id]/edit`에서 글을 수정합니다.

## 5. 컴포넌트 구조 (shadcn/ui 기준)

이 프로젝트는 shadcn/ui의 기본 컴포넌트를 중심으로 화면을 구성합니다.
화면을 작게 쪼개기보다, 읽기 쉬운 큰 덩어리로 나누고 필요한 곳에만 인터랙션 컴포넌트를 사용합니다.

### 5-1. Button

- 페이지 이동: 홈, 글 목록, 글 상세, 로그인, 회원가입, 마이페이지 이동
- 주요 행동: 글 작성, 저장, 수정, 삭제, 목록으로 돌아가기
- 사용 위치 예시:
  - 홈 상단의 `글 목록 보기`, `새 글 쓰기`
  - 글 목록의 `글 읽기`
  - 글 상세의 `수정`, `삭제`
  - 로그인/회원가입 폼의 제출 버튼

### 5-2. Card

- 독립된 정보 블록을 보여줄 때 사용합니다.
- 사용 위치 예시:
  - 홈의 소개 영역과 최근 글 카드
  - 글 목록의 각 포스트 카드
  - 글 상세의 본문 영역
  - 로그인/회원가입 폼 전체
  - 마이페이지의 프로필 요약과 글 목록

### 5-3. Input

- 한 줄 입력에 사용합니다.
- 사용 위치 예시:
  - 검색창
  - 글 작성/수정 페이지의 제목 입력
  - 로그인/회원가입 페이지의 이메일, 비밀번호 입력

### 5-4. Dialog

- 삭제처럼 되돌리기 어려운 행동을 한 번 더 확인할 때 사용합니다.
- 사용 위치 예시:
  - 글 상세 페이지의 삭제 확인
  - 앞으로 마이페이지나 설정 화면에서 중요한 변경을 확인할 때

## 6. 디자인 토큰

이 프로젝트는 `app/globals.css`에 정의된 색상 토큰을 기준으로 화면을 구성합니다.

- 배경: `bg-background`
- 본문 텍스트: `text-foreground`
- 카드 배경: `bg-card`
- 보조 배경: `bg-muted`
- 보조 텍스트: `text-muted-foreground`
- 주요 버튼: `bg-primary`, `text-primary-foreground`
- 테두리: `border-border`
- 입력 테두리: `border-input`
- 포커스 링: `ring-ring`

## 7. 데이터 모델 (Supabase PostgreSQL)

이 프로젝트는 사용자 정보와 게시글 정보를 분리해서 관리합니다.
한 명의 사용자가 여러 개의 글을 작성할 수 있으므로, `profiles` 와 `posts` 는 1:N 관계입니다.

### 7-1. profiles 테이블

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | uuid | PRIMARY KEY, auth.users(id) 참조 | 사용자 고유 식별자 |
| username | text | NOT NULL | 화면에 표시할 이름 |
| avatar_url | text | NULL | 프로필 이미지 주소 |
| role | text | NOT NULL | 사용자 역할 |

### 7-2. posts 테이블

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | uuid | PRIMARY KEY | 게시글 고유 식별자 |
| user_id | uuid | NOT NULL, FK → profiles.id | 작성자 |
| title | text | NOT NULL | 제목 |
| content | text | NOT NULL | 본문 |
| created_at | timestamptz | DEFAULT now() | 생성 시각 |

### 7-3. 관계

```
profiles (1) ---- (N) posts
posts.user_id -> profiles.id
```

- 한 명의 사용자는 여러 개의 게시글을 가질 수 있습니다.
- 각 게시글은 정확히 한 명의 작성자에 속합니다.
- 마이페이지는 이 관계를 이용해 현재 로그인한 사용자의 글만 보여줍니다.

- 위 컬럼명은 임의로 바꾸지 않습니다.

### 7-4. Copilot 검토 메모

- Copilot에게 요청한 결과도 `profiles` + `posts` 1:N 구조가 블로그에 가장 자연스럽다는 방향으로 정리되었습니다.
- `profiles`는 Supabase `auth.users(id)`를 참조하고, `posts.user_id`가 작성자를 연결하는 방식이 핵심입니다.

## 8. 페이지별 주요 컴포넌트와 데이터 흐름

### 8-1. 홈 (/)

- 주요 컴포넌트: `Button`, `Card`, `CardHeader`, `CardContent`, `CardTitle`, `Input`
- 데이터 흐름: 정적 소개 영역을 보여주고, 검색창과 버튼 클릭으로 `/posts` 또는 `/posts/new`로 이동한다.

### 8-2. 포스트 목록 (/posts)

- 주요 컴포넌트: `Button`, `Card`, `CardContent`, `CardHeader`, `CardTitle`
- 데이터 흐름: 서버에서 Supabase `posts`를 `select`로 가져와 `created_at` 내림차순으로 카드 목록을 보여주고, 각 카드 클릭 시 `/posts/[id]`로 이동한다.
- 상태: 로딩은 `app/posts/loading.tsx`, 빈 목록은 최소 문구와 작성 버튼으로 처리한다.

### 8-3. 포스트 작성 (/posts/new)

- 주요 컴포넌트: `Button`, `Card`, `CardContent`, `CardHeader`, `CardTitle`, `Input`, `Textarea`
- 데이터 흐름: 제목과 본문을 입력한 뒤 Supabase `insert`로 저장하고, 저장 후 새 글 상세 페이지로 이동한다.
- 상태: 로그인하지 않았으면 안내 후 `/login`으로 이동하고, 로딩과 실패 문구를 최소로 표시한다.

### 8-4. 포스트 상세 (/posts/[id])

- 주요 컴포넌트: `Button`, `Card`, `CardContent`, `Dialog`
- 데이터 흐름: 동적 라우트의 `id`로 Supabase `select`를 수행해 본문을 보여주고, 수정/삭제는 작성자 기준으로 UI만 분기한다. 삭제는 Dialog로 한 번 더 확인한다.
- 상태: 없는 글은 `notFound()`로 처리하고, 로딩은 `app/posts/[id]/loading.tsx`가 담당한다.

### 8-5. 포스트 수정 (/posts/[id]/edit)

- 주요 컴포넌트: `Button`, `Card`, `CardContent`, `CardHeader`, `CardTitle`, `Input`, `Textarea`
- 데이터 흐름: 기존 글을 `select`로 불러와 제목과 본문을 수정하고, Supabase `update`의 대상은 `posts.id`다.
- 상태: 작성자만 폼을 볼 수 있고, 로그인하지 않았으면 `/login`으로 이동한다.

### 8-6. 포스트 CRUD 컴포넌트 구조

- `components/post-detail-actions.tsx`: 상세 화면의 수정/삭제 버튼과 삭제 확인 다이얼로그를 담당한다.
- `components/post-edit-form.tsx`: 수정 화면의 제목/내용 폼과 update 제출을 담당한다.
- `app/posts/actions.ts`: 작성, 수정, 삭제 서버 액션을 모아둔다.
- `app/posts/loading.tsx`, `app/posts/[id]/loading.tsx`: 목록과 상세의 최소 로딩 상태를 담당한다.

## 8-2. 인증 상태 관리 (Ch9)

### 전역 상태 구조

- **AuthProvider** (`contexts/AuthContext.tsx`): Supabase 세션을 구독하고 전역 상태로 제공
- **useAuth Hook**: 어디서나 `const { user, loading, signInWithEmail, signUpWithEmail, signOut } = useAuth()`로 접근

### 초기화 흐름

1. 앱 시작 시 `AuthProvider`의 `useEffect`에서 `getUser()`로 현재 세션 확인
2. 세션이 있으면 `user` 상태 업데이트, 없으면 `null`로 설정
3. `onAuthStateChange()` 구독으로 로그인/로그아웃 변화 감지
4. cleanup에서 `subscription.unsubscribe()` 호출

### 보호 라우트

- **middleware.ts**: `/posts/new`, `/mypage`, `/mypage/:path*`, `/posts/:path*/edit` 경로를 보호
- 비로그인 사용자가 접근하면 `/login`으로 리다이렉트

### 공개 경로와 보호 경로

- 공개 경로: `/`, `/posts`, `/posts/[id]`, `/login`, `/signup`
- 보호 경로: `/posts/new`, `/posts/[id]/edit`, `/mypage`, `/mypage/:path*`

## 8-3. 에러 메시지와 폼 검증 (Ch12)

- `lib/error-message.ts`는 Supabase/네트워크 에러를 사용자 문구로 변환합니다.
- 변환 규칙:
  - `42501` 또는 `row-level security` 포함: `이 작업을 수행할 권한이 없습니다.`
  - `Failed to fetch` 포함: `인터넷 연결을 확인해주세요.`
  - `not found` 계열: `요청한 게시글을 찾을 수 없습니다.`
  - 그 외: `일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.`
- `app/login/page.tsx`와 `app/signup/page.tsx`는 Supabase 원문을 `console.error()`로 남기고, 화면에는 변환된 메시지만 표시합니다.
- `app/posts/new/page.tsx`는 제목 필수/최소 2자, 내용 필수/최소 10자, 제출 중 버튼 비활성화, 입력 아래 에러 메시지 표시 규칙을 적용합니다.

## 9. 참고

이 문서는 현재 구현 방향을 설명하는 초안입니다.
나중에 페이지가 추가되면 페이지 맵과 유저 플로우를 이어서 보강하면 됩니다.

## 10. Ch10 시작 전 확인

- `lib/supabase/client.ts`를 브라우저 Supabase 클라이언트 기준으로 사용합니다.
- `contexts/AuthContext.tsx`의 `AuthProvider`와 `useAuth()`로 현재 로그인 사용자를 확인합니다.
- `posts` 컬럼명은 `id`, `user_id`, `title`, `content`, `created_at` 그대로 유지합니다.
- App Router만 사용하고 `next/router`는 사용하지 않습니다.
- 수정/삭제 UI는 화면 제어용이며, 실제 보안은 Ch11 RLS가 담당합니다.

## Ch12 — 에러 처리와 UX 개선

Ch12에서는 데이터 상태별 화면을 분리해서 사용자에게 멈춘 느낌이 들지 않도록 정리합니다.

- 로딩: 각 라우트의 `loading.tsx`에서 스켈레톤 UI를 보여줍니다.
- 빈 상태: 목록/댓글처럼 데이터가 없는 경우는 안내 카드와 다음 행동 버튼을 제공합니다.
- 오류: `error.tsx`는 세그먼트별, `global-error.tsx`는 앱 전체 fallback으로 사용합니다.
- 404: `not-found.tsx`는 존재하지 않는 페이지나 게시글에 대한 안내 화면입니다.
- 에러 로그: 개발자용 상세 정보는 `console.error()`에 남기고 사용자 화면에는 친절한 메시지만 보여줍니다.
- 공통 메시지 변환: `lib/error-message.ts`가 Supabase/네트워크 예외를 사용자 언어로 변환합니다.
- 폼 검증: `/posts/new`는 제출 전에 제목/내용 길이를 검사하고, 실패는 입력 아래에 표시합니다.

## Supabase / Version Policy (Ch9 기준)

- **교재 기준 패키지 버전**: Next.js `16.2.1`, `@supabase/supabase-js` `2.47.12`, `@supabase/ssr` `0.5.2`.
- **현재 설치(로컬 `package.json`)**: `@supabase/supabase-js` `^2.105.4`, `@supabase/ssr` `^0.10.3`.
- 문서와 예제 코드는 **교재 기준** 버전으로 통일합니다. 로컬 빌드/테스트에서 버전 차이로 문제가 발생하면 `package.json` 기준으로 원인 진단을 수행합니다.
- Supabase 대시보드 메뉴 안내만 2026년 5월 기준 UI를 따릅니다.

- 환경변수(Ch8 유지): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- 인증은 이메일/비밀번호만 사용하며, 로그인은 `signInWithPassword` 사용합니다. 구버전 `auth.signIn()` 호출은 사용하지 않습니다.
- 클라이언트에 `service_role` 키를 두지 않습니다(서버 전용 키는 비공개로 유지).
- 보호 라우트는 App Router 환경에서 `middleware.ts`로 구현합니다.

## Ch10 — 게시글 CRUD 구현 지침

- 목표: Ch8 스키마와 Ch9 인증을 활용해 App Router 환경에서 게시글 CRUD를 완성합니다.
- 사용 모듈/파일:
  - 브라우저 클라이언트: `lib/supabase/client.ts`
  - 서버 클라이언트 / middleware: `lib/supabase/server.ts`, `@supabase/ssr`의 `createServerClient`
  - 인증: `contexts/AuthContext.tsx` (`AuthProvider`, `useAuth()`)
  - Server Actions: `app/posts/actions.ts`에 CRUD 서버 액션 구현
- 데이터 일관성: `posts` 테이블 컬럼은 Ch8 스키마(`id`, `user_id`, `title`, `content`, `created_at`)를 준수합니다.
- UI/보안 분리 원칙: 수정/삭제는 UI(버튼/다이얼로그)로 제공하되, 실제 권한 검증은 Ch11에서 RLS를 통해 DB 레벨에서 강제합니다.
- 테스트/검증:
  - `useAuth()`로 current user id를 얻어 `user_id`를 비교하는 로직을 유닛/통합 테스트로 검증
  - `next/router` 사용 금지 규칙을 코드베이스 전체에서 점검
  - `service_role` 키의 클라이언트 노출이 없는지 확인

참고: 위 교재 기준과 로컬 설치 버전이 다를 수 있으므로, 코드 수정 시에는 두 기준을 함께 표기하거나 빌드 검증을 먼저 진행하세요.

## Ch11 — 보안 아키텍처 (RLS)

Ch11부터는 UI 분기만으로 권한을 제어하지 않고, 데이터베이스 레벨의 RLS를 보안 기준으로 사용합니다.

- 정책 작성 방식:
  - Supabase SQL Editor에서 수동 실행하지 않고, Supabase CLI 마이그레이션 파일로 남깁니다.
  - 정책 변경 이력은 `supabase/migrations/`에 누적합니다.
- 핵심 기준:
  - `posts`는 `user_id`와 `auth.uid()` 일치를 기준으로 작성자 권한을 판단합니다.
  - 보안 계층을 분리합니다: UI 분기(UX)와 RLS(DB 보안).
  - 클라이언트의 수정/삭제 버튼 노출 제어는 UX이며, 보안 통제는 RLS가 담당합니다.
  - `service_role` 키는 클라이언트 코드에서 절대 사용하지 않습니다.

### Ch11 posts 보호 정책 목록 (현재 적용)

- `posts`
  - `posts_select_public_read`: SELECT는 누구나 허용 (`USING (true)`)
  - `posts_insert_authenticated_owner_only`: 로그인 사용자 본인 INSERT만 허용 (`WITH CHECK (auth.uid() = user_id)`)
  - `posts_update_authenticated_owner_only`: 작성자 본인 UPDATE만 허용 (`USING` + `WITH CHECK`)
  - `posts_delete_authenticated_owner_only`: 작성자 본인 DELETE만 허용 (`USING`)

### Ch11 마이그레이션 경로

- `supabase/migrations/20260525100138_add_posts_rls.sql`

### Ch11 RLS 적용 대상(필요 시 추가 검토)

- `profiles` (선택): 본인 프로필 수정 정책(`id = auth.uid()`) 추가 여부 결정

### Ch11 보안 계층 요약

- UI 분기(UX): 작성자에게만 수정/삭제 버튼을 보여주고, 로그인 여부에 따라 접근 경로를 정리합니다.
- RLS(DB 보안): 실제 권한은 `posts.user_id = auth.uid()` 기준의 정책으로 강제합니다.
- 정책은 SQL Editor가 아니라 `supabase/migrations/`에 남깁니다.
- `service_role` 키는 클라이언트에서 사용하지 않습니다.
- 검증 기준은 비로그인 / 사용자 A / 사용자 B 시나리오로 둡니다.
- 사용자 A는 본인 글 수정/삭제가 가능하고, 사용자 B는 타인 글 수정/삭제가 차단되어야 합니다.
