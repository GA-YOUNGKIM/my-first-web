# Context — my-first-web 프로젝트 상태

## 현재 상태

- 마지막 작업일: 2026-05-03
- 완료된 작업: 홈/목록/상세/작성/수정 페이지 정리, 마이페이지, 댓글 기능, shadcn/ui 컴포넌트 적용, `ARCHITECTURE.md`/`copilot-instructions.md`/`README.md` 보강, `docs/wireframes.md` 작성, `app/globals.css` 테마 조정
- 진행 중: Supabase 프로젝트 생성 및 환경변수 연결
- 미착수: 외부 Supabase 프로젝트 생성

## 오늘 변경 파일

- `ARCHITECTURE.md`
- `.github/copilot-instructions.md`
- `README.md`
- `app/globals.css`
- `app/posts/page.tsx`
- `app/posts/[id]/page.tsx`
- `app/posts/[id]/actions.ts`
- `app/posts/[id]/edit/page.tsx`
- `app/posts/new/page.tsx`
- `components/sketch-home.tsx`
- `components/comment-section.tsx`
- `components/ui/textarea.tsx`
- `app/mypage/page.tsx`
- `lib/comments.ts`
- `docs/wireframes.md`

## 기술 결정 사항

- 라우팅: Next.js App Router only (pages router, `next/router` 미사용)
- UI: shadcn/ui(`Button`, `Card`, `Input`, `Dialog`, `Textarea`) 우선 사용
- 디자인: Tailwind 토큰(`bg-background`, `text-foreground`, `bg-card`, `bg-primary`) 기준 사용
- 데이터 흐름: Server Action + `revalidatePath` + `redirect` 패턴 사용
- 저장소: 현재는 `data/posts.json` 기반, 이후 Supabase(PostgreSQL)로 마이그레이션
- 인증 방향: Supabase Auth (이메일/비밀번호)
- Supabase 서버 클라이언트: `@supabase/ssr` + 비동기 `cookies()` 패턴 사용

## 해결된 이슈

- 기존 하드코딩 스타일과 shadcn/ui 스타일 혼재 문제 해결: 주요 페이지를 Card/Button/Input/Dialog 중심으로 통일
- 모바일 레이아웃 겹침/정렬 문제 해결: `flex-col sm:flex-row`, 반응형 padding/spacing으로 정리
- 글 작성 페이지의 클라이언트 임시 상태 로직 제거: Server Action 기반 실제 CRUD 흐름으로 전환
- 삭제 확인 UX 보강: 상세 페이지 삭제 동작에 Dialog 확인 단계 적용
- 디자인 토큰 보정: `:root`의 `--primary`, `--primary-foreground` 값을 요청값으로 반영
- 로그인/회원가입 페이지 추가: Server Action으로 Supabase Auth `signInWithPassword`/`signUp` 연동
- 홈 UI 재구성: 소개 + 검색 + 최근 글 카드 구조로 정리
- 마이페이지 추가: 작성자 프로필과 내가 쓴 글 목록을 보여주는 개인 관리 화면 구성
- 댓글 기능 추가: 게시글 상세에 댓글 작성/조회/삭제 흐름 연결

## 알게 된 점

- Tailwind CSS 4 + shadcn 구성에서 색상은 토큰(`text-foreground`, `bg-card`, `border-border`) 기준으로 맞출 때 유지보수가 쉬움
- App Router 환경에서는 폼 처리에 Server Action(`"use server"`)을 쓰면 Client 상태 코드 없이도 CRUD 구현 가능
- `get_errors`의 `@theme`, `@apply` 경고는 Tailwind 전용 문법을 일반 CSS 검사기가 인식하지 못해 나타날 수 있음
- 문서(`ARCHITECTURE.md`)와 실제 코드(컴포넌트/데이터 흐름)를 함께 갱신해야 다음 작업(인증/DB 마이그레이션)이 빨라짐
- Next.js 16에서는 `cookies()`가 비동기 API이므로 Supabase 서버 클라이언트 초기화 시 `await cookies()`가 필요함
- 스케치 형태의 화면 재현은 고정 크기 블록(배너/카드)과 반응형 그리드 조합으로 먼저 구조를 맞춘 뒤, 색/이미지는 추후 단계적으로 치환하는 방식이 안정적임

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