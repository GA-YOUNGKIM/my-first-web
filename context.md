# Context — my-first-web 프로젝트 상태

## 현재 상태

- 마지막 작업일: 2026-05-17
- 완료된 작업: 홈/목록/상세/작성/수정 페이지, 마이페이지, 댓글 기능, shadcn/ui 적용, Supabase Auth 이메일/비밀번호 인증 구현, 로그인/회원가입 페이지, AuthProvider/useAuth Hook, Header 로그인 상태 분기, middleware.ts 보호 라우트, npm build 검증, Vercel 배포
- 진행 중: 없음
- 미착수: Supabase 실시간 구독(Realtime), RLS 정책(Row-Level Security)

## Ch9 완료 작업 파일 (인증)

- `lib/auth.ts` (이메일/비밀번호 인증 함수)
- `lib/supabase/client.ts` (브라우저 클라이언트)
- `lib/supabase/server.ts` (서버 클라이언트)
- `contexts/AuthContext.tsx` (AuthProvider + useAuth Hook)
- `app/login/page.tsx` (로그인 화면)
- `app/signup/page.tsx` (회원가입 화면)
- `app/layout.tsx` (AuthProvider 연결)
- `components/site-header.tsx` (로그인 상태 분기 + 로그아웃)
- `middleware.ts` (보호 라우트: /posts/new, /mypage, /mypage/:path*, /posts/:path*/edit)
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

### Supabase / 버전 및 환경변수 (Ch9 기준)

- 교재 기준 패키지: `@supabase/supabase-js` `2.47.12`, `@supabase/ssr` `0.5.2`.
- 현재 설치 기준(`package.json`): `@supabase/supabase-js` `^2.105.4`, `@supabase/ssr` `^0.10.3`.
- 문서와 예제는 교재 기준을 따릅니다. 빌드 오류는 `package.json` 기준으로 원인 확인합니다.
- 환경변수 이름(Ch8 유지): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- 인증은 이메일/비밀번호만 사용하며, 로그인은 `signInWithPassword`를 사용합니다. `service_role` 키는 클라이언트에 두지 않습니다.
- Supabase 대시보드 메뉴 안내는 2026년 5월 기준 UI를 따릅니다.

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

## 남은 작업

- Supabase 프로젝트 생성 및 실제 환경변수 연결