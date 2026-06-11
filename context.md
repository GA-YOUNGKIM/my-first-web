# Context — my-first-web 프로젝트 상태

## 현재 상태

- 마지막 작업일: 2026-06-01
- 완료된 작업: 홈/목록/상세/작성/수정 페이지, 마이페이지, 댓글 기능, shadcn/ui 적용, Supabase Auth 이메일/비밀번호 인증 구현, 로그인/회원가입 페이지, AuthProvider/useAuth Hook, Header 로그인 상태 분기, middleware.ts 보호 라우트, 게시글 CRUD(Supabase), 로딩/에러/빈 상태 UX, npm build 검증, Vercel 배포
- 진행 중: 없음
- 미착수: Supabase 실시간 구독(Realtime)
- Ch11 RLS 적용 대상: `posts`(필수), `profiles`(필요 시)
- Ch12 UX 정리: 공통 에러 메시지 변환 유틸과 화면별 로딩/에러 경계 적용 완료

## 최종 검증 보고서

- 테스트 환경(local): Playwright 12개 중 9개 통과, 3개 스킵 (성공 경로는 환경변수 누락으로 스킵)
- 테스트 환경(Vercel): 확인 필요 (빌드 에러 및 접속 제한)
- Playwright 테스트 결과: 비로그인 보호 라우트 리다이렉트는 성공적으로 검증되었으나, 로그인 후 CRUD 성공 경로는 스킵됨
- 배포 URL 수동 검증 결과: Vercel Protection 및 로그인 화면 접속 문제로 미완료 (확인 필요)
- 아직 확인 필요한 항목:
  - `mypage/page.tsx`의 정규식 `/gs` 플래그 사용으로 인한 TypeScript 빌드 실패 해결 및 빌드 재검증
  - `posts` 테이블에 `author_email` 컬럼 누락으로 인한 작성자 표시 버그 해결
  - `comments` 및 `likes` 테이블 마이그레이션 파일 작성 및 DB 반영 검증
  - Vercel 배포 본문 직접 열람 검증 및 로그인 후 동작 흐름 수동 검증

## Ch9~Ch10 완료 작업 파일

- `lib/auth.ts` (이메일/비밀번호 인증 함수)
- `lib/supabase/client.ts` (브라우저 클라이언트)
- `lib/supabase/server.ts` (서버 클라이언트)
- `contexts/AuthContext.tsx` (AuthProvider + useAuth Hook)
- `app/login/page.tsx` (로그인 화면)
- `app/signup/page.tsx` (회원가입 화면)
- `app/layout.tsx` (AuthProvider 연결)
- `components/site-header.tsx` (로그인 상태 분기 + 로그아웃)
- `middleware.ts` (보호 라우트: /posts/new, /mypage, /mypage/:path*, /posts/:path*/edit)
- `app/posts/page.tsx` (게시글 목록: Supabase select, created_at 내림차순)
- `app/posts/[id]/page.tsx` (게시글 상세: Supabase select, 작성자 UI 분기)
- `app/posts/new/page.tsx` (게시글 작성: Supabase insert)
- `app/posts/[id]/edit/page.tsx` (게시글 수정: Supabase select + update)
- `app/posts/actions.ts` (게시글 insert/update/delete 서버 액션)
- `components/post-detail-actions.tsx` (상세 화면 수정/삭제 UI 분기와 delete)
- `components/post-edit-form.tsx` (수정 폼 UI와 update)
- `app/error.tsx` (루트 에러 경계)
- `app/global-error.tsx` (전역 에러 경계)
- `app/not-found.tsx` (전역 404)
- `app/posts/error.tsx` (게시글 목록 에러 경계)
- `app/posts/[id]/not-found.tsx` (게시글 상세 404)
- `app/posts/loading.tsx` (목록 로딩)
- `app/posts/[id]/loading.tsx` (상세 로딩)
- `app/mypage/error.tsx` (마이페이지 에러 경계)
- `app/mypage/loading.tsx` (마이페이지 로딩)
- `lib/error-message.ts` (Supabase/네트워크 에러 메시지 변환)
- `package.json` (Supabase 패키지 버전 확인)
- `.env.local` (Supabase 환경변수)

## 기술 결정 사항

- 라우팅: Next.js App Router only (pages router, `next/router` 미사용)
- UI: shadcn/ui(`Button`, `Card`, `Input`, `Dialog`, `Textarea`) 우선 사용
- 디자인: Tailwind 토큰(`bg-background`, `text-foreground`, `bg-card`, `bg-primary`) 기준 사용
- 데이터 흐름: Server Action + `revalidatePath` + `redirect` 패턴 사용
- 저장소: 현재는 `data/posts.json` 기반, 이후 Supabase(PostgreSQL)로 마이그레이션
- 인증: Supabase Auth (이메일/비밀번호만 사용, 소셜 로그인 미지원)
- 로그인 API: `signInWithPassword(email, password)` 사용
- 회원가입 API: `signUp(email, password, options: { data: { name } })`
- 로그아웃 API: `signOut()` 사용
- 글로벌 상태: `AuthProvider` + `useAuth()` Hook으로 전역 로그인 상태 관리
- 세션 유지: `onAuthStateChange()` 구독으로 새로고침 후에도 로그인 상태 유지
- 보호 라우트: `middleware.ts`에서 비로그인 사용자를 `/login`으로 리다이렉트
- Supabase 클라이언트: `@supabase/ssr`의 `createBrowserClient` (클라이언트), `createServerClient` (미들웨어)
- CRUD 쿼리 패턴: 목록/상세는 `select`, 작성은 `insert`, 수정은 `update`, 삭제는 `delete`를 사용
- 작성자 UI 분기: `user.id === post.user_id`일 때만 수정/삭제 UI를 노출
- 실제 보안은 Ch11 RLS에서 처리하며, 현재 UI 분기는 화면 제어만 담당
- 화면 상태 원칙: 로딩은 `loading.tsx`, 예외는 `error.tsx`/`global-error.tsx`, 없는 글이나 경로는 `not-found.tsx`로 분리한다
- 빈 상태 원칙: 데이터가 없을 때는 빈 화면 대신 안내 카드와 다음 행동 버튼을 보여준다
- 공통 에러 메시지 변환: `lib/error-message.ts`가 `42501`/`row-level security`, `Failed to fetch`, `not found` 계열을 사용자 문구로 매핑한다
- `/posts/new` 검증 규칙: 제목은 필수·최소 2자, 내용은 필수·최소 10자, 제출 중 버튼 비활성화, 필드 아래 에러 메시지 표시
- `/login` / `/signup` 에러 규칙: Supabase 원문은 `console.error()`로만 남기고 화면에는 변환된 메시지만 표시한다

### Supabase / 버전 및 환경변수 (Ch9 기준)

- 교재 기준 패키지: `@supabase/supabase-js` `2.47.12`, `@supabase/ssr` `0.5.2`.
- 현재 설치 기준(`package.json`): `@supabase/supabase-js` `^2.105.4`, `@supabase/ssr` `^0.10.3`.
- 문서와 예제는 교재 기준을 따릅니다. 빌드 오류는 `package.json` 기준으로 원인 확인합니다.
- 환경변수 이름(Ch8 유지): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- 인증은 이메일/비밀번호만 사용하며, 로그인은 `signInWithPassword`를 사용합니다. `service_role` 키는 클라이언트에 두지 않습니다.
- Supabase 대시보드 메뉴 안내는 2026년 5월 기준 UI를 따릅니다.

### 버전 기준 (교재 기준 vs 현재 설치 기준)

- 교재 기준:
	- Next.js `16.2.1`
	- React `19.2.4`
	- TypeScript `5.x`
	- Tailwind CSS `4.x`
	- shadcn/ui 최신
	- `@supabase/supabase-js` `2.47.12`
	- `@supabase/ssr` `0.5.2`
- 현재 설치 기준(`package.json`):
	- Next.js `16.2.1`
	- React `19.2.4`
	- TypeScript `^5`
	- Tailwind CSS `^4`
	- shadcn `^4.6.0`
	- `@supabase/supabase-js` `^2.105.4`
	- `@supabase/ssr` `^0.10.3`

## Ch11 RLS 적용 상태

- `posts` 테이블 RLS 활성화 완료
- RLS 정책은 SQL Editor 직접 실행이 아니라 Supabase CLI 마이그레이션으로 관리
- 클라이언트 UI 분기(수정/삭제 버튼 노출)는 UX 제어이며, 실제 보안은 RLS가 담당
- `service_role` 키는 클라이언트에서 사용하지 않음

### 적용 정책

- SELECT: 누구나 읽기 가능 (`USING (true)`)
- INSERT: 로그인 사용자 본인만 작성 가능 (`WITH CHECK (auth.uid() = user_id)`)
- UPDATE: 작성자만 수정 가능 (`USING (auth.uid() = user_id)` + `WITH CHECK (auth.uid() = user_id)`)
- DELETE: 작성자만 삭제 가능 (`USING (auth.uid() = user_id)`)

### 마이그레이션 파일 경로

- `supabase/migrations/20260525100138_add_posts_rls.sql`

### 테스트 결과 (Ch11 posts RLS 시나리오)

- 비로그인 시나리오:
	- 조회(SELECT): 허용
	- 작성(INSERT): 차단
- 사용자 A 시나리오:
	- 본인 글 작성/수정/삭제: 허용
- 사용자 B 시나리오:
	- 사용자 A 글 수정/삭제: 차단

- 브라우저 검증 기준은 비로그인 / 사용자 A / 사용자 B 3가지 시나리오로 정리합니다.
- 사용자 A는 본인 글에서 수정/삭제가 가능해야 하고, 사용자 B는 사용자 A 글에서 수정/삭제가 막혀야 합니다.

보충 메모:

- 비로그인 작성 차단은 `/posts/new`와 `/posts/:path*/edit` 리다이렉트로도 확인했습니다.
- 브라우저에서 사용자 A/B 계정의 최종 우회 검증은 Supabase 가입/로그인 레이트 리밋 때문에 제한될 수 있습니다.

참고: 위 시나리오는 현재 적용된 정책 정의와 `db push` 적용 상태 기준입니다.

## Ch9 해결된 이슈

- Supabase Auth 이메일/비밀번호 인증 구현: `signInWithPassword`, `signUp`, `signOut` API만 사용
- 글로벌 로그인 상태 관리: `AuthProvider` + `useAuth()` Hook으로 전체 앱에 상태 전파
- 새로고침 후 로그인 유지: `getUser()` + `onAuthStateChange()` 구독으로 세션 복원
- Header 로그인 상태 분기: 비로그인(로그인/회원가입), 로그인(글쓰기/로그아웃) UI 분기
- 보호 라우트 구현: `middleware.ts`에서 `/posts/new`, `/mypage` 등 로그인 필수 경로 보호
- 환경변수 관리: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` Vercel 배포 환경 설정
- 구버전 API 제거: `auth.signIn()` 사용하지 않음, `signInWithPassword` 사용
- 민감한 키 보호: `service_role` 키는 클라이언트에 노출하지 않음
- 빌드 검증: `npm run build` 성공, 타입스크립트 컴파일 완료
- Vercel 배포: 17개 배포 이력 확인, Production 환경 정상 작동

## 알게 된 점

- Tailwind CSS 4 + shadcn 구성에서 색상은 토큰(`text-foreground`, `bg-card`, `border-border`) 기준으로 맞출 때 유지보수가 쉬움
- App Router 환경에서는 폼 처리에 Server Action(`"use server"`)을 쓰면 Client 상태 코드 없이도 CRUD 구현 가능
- `get_errors`의 `@theme`, `@apply` 경고는 Tailwind 전용 문법을 일반 CSS 검사기가 인식하지 못해 나타날 수 있음
- 문서(`ARCHITECTURE.md`)와 실제 코드(컴포넌트/데이터 흐름)를 함께 갱신해야 다음 작업(인증/DB 마이그레이션)이 빨라짐
- Next.js 16에서는 `cookies()`가 비동기 API이므로 Supabase 서버 클라이언트 초기화 시 `await cookies()`가 필요함
- 스케치 형태의 화면 재현은 고정 크기 블록(배너/카드)과 반응형 그리드 조합으로 먼저 구조를 맞춘 뒤, 색/이미지는 추후 단계적으로 치환하는 방식이 안정적임
- 파일 기반 상태에서 먼저 흐름을 검증하고, 이후 Supabase로 옮길 때는 저장소 레이어만 교체하는 방식이 가장 안전함
- 댓글은 별도 데이터 파일과 상세 페이지 섹션을 묶어두면 검증이 빠르다

## 검증 결과

- 7.8.3 AI 생성 디자인 검증: 통과
	- 카드, 버튼, 입력창, 본문 계층이 명확함
	- 홈과 작성 페이지 모두 읽기 중심 구조를 유지함
	- 토큰 기반 색상과 여백이 전체적으로 일관됨
	- 모바일/좁은 폭에서도 주요 액션이 세로로 정리되어 겹침이 크지 않음
- 7.8.4 스크린샷 기반 검증: 통과
	- 홈 페이지와 `/posts/new` 페이지를 브라우저에서 확인함
	- 홈은 히어로, 검색, CTA, 최근 글 카드 구조가 와이어프레임과 맞음
	- 작성 페이지는 제목/내용 입력과 저장 버튼 배치가 의도대로 노출됨

- 최종 검증 요약
	- 로컬 Playwright: 통과
	- Vercel 배포 URL 수동 확인: 공개 경로 확인 완료, 로그인 후 작성 흐름은 확인 필요

## 남은 작업

- Supabase 프로젝트 생성 및 실제 환경변수 연결

## Ch10 게시글 CRUD 준비 체크리스트

- 목표: Ch8 스키마와 Ch9 인증을 바탕으로 게시글 CRUD를 App Router 환경에서 구현합니다.
- 확인 기준: 교재 기준과 현재 설치 기준을 함께 적고, 구현과 검증은 현재 설치 기준으로 확인합니다.
- 사용 리소스:
	- 브라우저 Supabase 클라이언트: `lib/supabase/client.ts`
	- 서버 Supabase 클라이언트: `lib/supabase/server.ts` 또는 `@supabase/ssr`의 `createServerClient`
	- 인증 상태: `contexts/AuthContext.tsx` (`AuthProvider`, `useAuth()`)
- 데이터 모델(Ch8 스키마): `posts`(`id`, `user_id`, `title`, `content`, `created_at`), `profiles`(`id`, `username`, `avatar_url`, `role`)
- 구현 항목:
	- 서버 액션 기반 `createPost`(작성), `updatePost`(수정), `deletePost`(삭제) 구현 완료 (`app/posts/actions.ts` 활용)
	- 페이지: `/posts`(목록), `/posts/[id]`(상세), `/posts/new`(작성), `/posts/[id]/edit`(수정) 구현 완료
	- UI: 작성/수정 폼은 클라이언트 컴포넌트로 연결하고, 입력 컴포넌트는 shadcn/ui 사용
	- 권한: UI 레벨에서 작성자만 수정/삭제 버튼 노출. 실제 권한 검증은 Ch11 RLS에서 처리
	- 마이페이지에서 현재 사용자의 글 목록 노출 (user_id 기준 필터)
- 검증 포인트:
	- `lib/supabase/client.ts`가 프로젝트에서 사용되는지 확인
	- `useAuth()`로 현재 유저 ID를 안전하게 받아오는지 확인
	- `posts` 컬럼명이 Ch8 스키마와 일치하는지 확인
	- `profiles` 컬럼명이 Ch8 스키마와 일치하는지 확인 (`id`, `username`, `avatar_url`, `role`)
	- `next/router`가 사용되지 않았는지 점검
	- `service_role` 키가 클라이언트 코드에 노출되어 있지 않은지 점검
	- 수정/삭제 UI는 UX 제어만 담당하고, 실제 보안은 Ch11 RLS가 담당하는지 확인