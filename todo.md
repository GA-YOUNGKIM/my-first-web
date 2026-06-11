# TODO — my-first-web

## 1단계: 기본 구조 (Ch7~8)

- [x] `ARCHITECTURE.md` 작성 및 보강
- [x] `copilot-instructions.md` 작성 및 보강
- [x] `README.md` 정리
- [x] `docs/wireframes.md` 작성
- [x] `shadcn/ui` 초기화 + 테마 설정
- [x] 헤더/푸터 레이아웃
- [x] 홈 페이지 (스케치 기반 레이아웃 반영)
- [ ] Supabase 프로젝트 생성
- [x] 데이터베이스 스키마 작성

	Ch9 Supabase 체크리스트:

	- [x] Supabase CLI 연결 확인 (`npx supabase --version`, `npx supabase projects list`)
	- [x] Supabase 대시보드에서 Auth(이메일/비밀번호) 설정 확인
	- [x] `.env.local`에 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` 설정
	- [x] 회원가입 구현 (`lib/auth.ts` + `app/signup/page.tsx`)
	- [x] 로그인 구현 (`lib/auth.ts` + `app/login/page.tsx`)
	- [x] 로그아웃 구현 (`lib/auth.ts` + `components/site-header.tsx`)
	- [x] 로그인 구현이 `signInWithPassword`를 사용하는지 검증
	- [x] 코드베이스에 구버전 `auth.signIn()` 호출이 남아있지 않은지 검사 (없음)
	- [x] `service_role` 또는 서버 전용 키가 클라이언트 코드에 노출되지 않았는지 검사 (없음)
	- [x] AuthProvider/useAuth Hook 구현 (`contexts/AuthContext.tsx`)
	- [x] Header 로그인 상태 분기 (`components/site-header.tsx`)
	- [x] `/posts/new` 보호 라우트 구현 (`middleware.ts`)
	- [x] npm run build 검증 (성공)
	- [x] git grep 검증: 구버전 API 없음, 민감한 키 없음
	- [x] Vercel 배포 URL 검증 (배포 이력 17개)

	Version Policy:

	- 교재 기준: Next.js 16.2.1, `@supabase/supabase-js` 2.47.12, `@supabase/ssr` 0.5.2
	- 현재 설치 기준: `package.json`의 `@supabase/supabase-js` ^2.105.4, `@supabase/ssr` ^0.10.3
	- 수업 프롬프트와 설명은 교재 기준으로 통일합니다.
	- 빌드 오류가 버전 차이에서 발생하면 `package.json` 기준으로 원인을 확인합니다.
	- Supabase 대시보드 메뉴 안내는 2026년 5월 기준 UI를 따릅니다.

## 2단계: 핵심 기능 (Ch9~10)

- [x] 포스트 목록 페이지
- [x] 포스트 상세 페이지
- [x] 포스트 작성 (CRUD)
- [x] 포스트 수정
- [x] 포스트 삭제
- [x] 로그인/회원가입
- [x] 빌드/배포 검증

Ch10 완료 메모:

- 게시글 CRUD는 Supabase posts 테이블 기준으로 연결 완료
- 작성자 UI 분기는 `user.id === post.user_id`로만 처리
- 실제 보안은 Ch11 RLS에서 처리 예정
- `next/router` 미사용, `service_role` 클라이언트 노출 없음, `auth.signIn()` 미사용
- 목록/상세/작성/수정 화면에 로딩 또는 빈 상태를 최소 문구로 표시

## Ch10 시작 전 사람 확인 항목

- [ ] 교재 기준과 현재 설치 기준 버전을 함께 확인했는지 점검
- [ ] `lib/supabase/client.ts`와 `contexts/AuthContext.tsx`를 기준 리소스로 사용할지 확인
- [ ] `posts` 컬럼명을 Ch8 스키마(`id`, `user_id`, `title`, `content`, `created_at`) 그대로 유지하는지 확인
- [ ] App Router만 사용하고 `next/router`가 남아 있지 않은지 확인
- [ ] 수정/삭제 UI는 노출 제어만 담당하고 실제 보안은 Ch11 RLS가 맡는지 확인

## 3단계: 고급 기능 (Ch11~12)

- [x] 마이페이지
- [x] 댓글 기능
- [x] Ch11 시작 전 기준 문서 정비 (context/todo/ARCHITECTURE + 에이전트 규칙)
- [x] posts RLS 마이그레이션 생성 (`supabase/migrations/20260520054422_add_posts_rls.sql`)
- [x] posts RLS 마이그레이션 추가 생성 (`supabase/migrations/20260525100138_add_posts_rls.sql`)
- [x] `npx supabase db push` 적용
- [x] 보안 키 노출 grep 점검 (`service_role`, `SUPABASE_SERVICE_ROLE`, `sb_secret_`, `sbp_`)
- [x] 빌드 검증 (`npm run build`)
- [x] 비로그인 우회 테스트 확인 (`/posts/new`, `/posts/:path*/edit` -> `/login`)
- [x] Ch12 로딩/에러 UX 정리 (`app/error.tsx`, `app/global-error.tsx`, `app/not-found.tsx`, `app/posts/error.tsx`, `app/posts/loading.tsx`, `app/posts/[id]/not-found.tsx`, `app/posts/[id]/loading.tsx`, `app/mypage/error.tsx`, `app/mypage/loading.tsx`)
- [x] 공통 에러 메시지 변환 유틸 추가 (`lib/error-message.ts`)
- [x] `/posts/new` 클라이언트 유효성 검증 추가 (제목 2자 이상, 내용 10자 이상, 제출 중 버튼 비활성화)
- [x] 로그인/회원가입 화면에 공통 에러 메시지 변환 적용
- [x] 배포 재검증 (운영 URL의 `/posts`, `/posts/1`, `/posts/new` 흐름 확인 완료)
- [x] 다른 계정 우회 테스트 확인 (사용자 B가 사용자 A 글 수정/삭제 차단)
- [ ] Vercel production URL 수동 검증: 로그인 성공 후 `/posts/new` 작성 흐름 확인 필요
- [ ] 배포 URL 직접 열람 검증 여부 재확인 (현재 Vercel 로그인 화면으로 이동)
- [ ] `mypage/page.tsx` 정규식 `/gs` 플래그로 인한 빌드 에러 해결 (ES2017 target 대응)
- [ ] `posts` 테이블에 `author_email` 컬럼 누락으로 인한 작성자 표시 버그 해결
- [ ] `comments` 및 `likes` 테이블 마이그레이션 파일 추가 및 CLI 반영 검증

## Ch11 RLS 기준 메모

- RLS는 SQL Editor 직접 실행이 아니라 Supabase CLI 마이그레이션으로 기록합니다.
- 보안은 클라이언트 if문이 아니라 RLS 정책으로 강제합니다.
- `posts` 정책 기준은 `posts.user_id = auth.uid()`입니다.
- 클라이언트 UI 분기(수정/삭제 버튼 노출)는 보안이 아니며, 실제 보안은 RLS가 담당합니다.
- `service_role` 키는 클라이언트에서 절대 사용하지 않습니다.
- 중복 생성 방지를 위해 정책 생성 전 `DROP POLICY IF EXISTS`를 사용합니다.
- 테스트 결과는 비로그인 / 사용자 A / 사용자 B 시나리오로 정리합니다.
- 보안 설명은 "클라이언트 분기"보다 "DB RLS"를 우선 표기합니다.

## Ch11 RLS 적용 대상(확정)

- `posts`: SELECT/INSERT/UPDATE/DELETE 정책
	- INSERT/UPDATE/DELETE는 작성자 본인(`user_id = auth.uid()`) 기준
	- SELECT는 공개 조회(`USING (true)`)로 적용
- `profiles`(선택): 본인 프로필 수정(`id = auth.uid()`) 정책 여부 검토

## 진행률: 20/22 (91%)

## Ch12 UX 정리 메모

- 데이터 로딩은 `loading.tsx` 스켈레톤으로 처리합니다.
- 빈 데이터는 빈 화면 대신 안내 카드로 처리합니다.
- 예외는 `error.tsx`/`global-error.tsx`로 분리하고, 사용자 화면에는 친절한 문구만 표시합니다.
- 개발자용 상세 에러는 `console.error()`에 남깁니다.
- 공통 에러 문구 변환은 `lib/error-message.ts`에서 관리합니다.
- `/posts/new`는 제목 2자 이상, 내용 10자 이상, 제출 중 버튼 비활성화를 적용합니다.

## Ch9 완료 요약

✅ 인증 체계 구현 완료
- Supabase Auth 이메일/비밀번호 인증 완료
- AuthProvider/useAuth로 전역 상태 관리
- 새로고침 후 세션 유지 구현
- 보호 라우트 미들웨어 적용
- 환경변수 Vercel 배포 설정
- npm build 및 배포 검증 완료