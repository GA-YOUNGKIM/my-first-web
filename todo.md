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

	- [ ] Supabase CLI 연결 확인 (`npx supabase --version`, `npx supabase projects list`)
	- [ ] Supabase 대시보드에서 Auth(이메일/비밀번호) 설정 확인
	- [ ] `.env.local`에 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` 설정
	- [ ] 로그인 구현이 `signInWithPassword`를 사용하는지 검증 (`supabase.auth.signInWithPassword`)
	- [ ] 코드베이스에 구버전 `auth.signIn()` 호출이 남아있지 않은지 검사
	- [ ] `service_role` 또는 서버 전용 키가 클라이언트 코드에 노출되지 않았는지 검사
	- [ ] 미들웨어 보호 라우트(`middleware.ts`) 구현 여부 확인

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
- [x] 로그인/회원가입

## 3단계: 고급 기능 (Ch11~12)

- [x] 마이페이지
- [x] 댓글 기능

## 진행률: 14/15 (93%)