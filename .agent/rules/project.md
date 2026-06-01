# Project agent rules — Ch10 CRUD 기준

이 파일은 에이전트가 이 저장소에서 자동으로 작업할 때 따라야 할 핵심 규칙입니다. 문서와 예제는 교재 기준으로 적고, 실제 실행과 오류 확인은 현재 설치 기준으로 검증합니다.

## 기본 원칙

- App Router만 사용합니다. `app/` 디렉토리만 두고 `pages/` 또는 `next/router`는 사용하지 않습니다.
- 서버 컴포넌트를 기본으로 두고, 상호작용이 필요한 경우에만 Client Component를 사용합니다.
- `service_role` 키는 클라이언트에 두지 않습니다.

## 버전 정책

- 교재 기준
  - Next.js: 16.2.1
  - `@supabase/supabase-js`: 2.47.12
  - `@supabase/ssr`: 0.5.2
- 현재 설치 기준 (`package.json`)
  - Next.js: 16.2.1
  - `@supabase/supabase-js`: ^2.105.4
  - `@supabase/ssr`: ^0.10.3
- 버전 차이로 빌드 오류가 나면 `package.json`을 기준으로 원인을 확인합니다.
- Supabase 대시보드 메뉴 안내는 2026년 5월 기준 UI를 따릅니다.

## 인증 및 환경변수

- 환경변수는 Ch8 이름을 유지합니다.
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- 이메일/비밀번호 인증만 사용합니다. 소셜 로그인은 추가하지 않습니다.
- 로그인은 `signInWithPassword({ email, password })`를 사용합니다.
- 회원가입은 `signUp`, 로그아웃은 `signOut`을 사용합니다.
- 보호 라우트는 `middleware.ts`로 구현합니다.

## Ch10 CRUD 기준

- 브라우저 Supabase 클라이언트는 `lib/supabase/client.ts`를 사용합니다.
- 인증 상태는 `contexts/AuthContext.tsx`의 `AuthProvider`와 `useAuth()`로 읽습니다.
- `posts` 컬럼명은 Ch8 스키마 그대로 유지합니다: `id`, `user_id`, `title`, `content`, `created_at`.
- `profiles` 컬럼명도 유지합니다: `id`, `username`, `avatar_url`, `role`.
- 작성, 수정, 삭제는 Server Action 패턴을 우선 사용합니다.
- 수정/삭제 UI는 UX 제어이며, 실제 권한 검증은 Ch11 RLS가 담당합니다.

## Ch11 RLS 기준

- RLS 정책은 Supabase SQL Editor에서 직접 실행하지 않고, Supabase CLI 마이그레이션으로 기록합니다.
- `posts` 정책은 `posts.user_id = auth.uid()` 기준으로 작성합니다.
- 적용 대상은 `posts`의 SELECT/INSERT/UPDATE/DELETE입니다.
- 필요하면 `profiles`의 본인 수정 정책을 추가합니다.

## 체크포인트

1. 코드에서 `supabase.auth.signIn(` 또는 `auth.signIn(` 호출이 보이면 `signInWithPassword`로 교체를 권고합니다.
2. `next/router` 또는 `pages/` 폴더가 보이면 App Router 기준으로 수정 제안을 합니다.
3. `service_role` 또는 서버 전용 키가 코드에 있으면 클라이언트 노출 여부를 즉시 점검합니다.
