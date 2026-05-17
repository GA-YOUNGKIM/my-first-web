# Project agent rules — Ch9 Supabase 기준

이 파일은 에이전트가 이 저장소에서 자동으로 작업할 때 따라야 할 핵심 규칙을 요약합니다. Ch9(Supabase Auth) 기준을 우선으로 합니다.

- 프레임워크: Next.js App Router 사용.
  - `app/` 디렉토리만 사용하고 `pages/` 또는 `next/router`를 사용하지 않습니다.
- Next.js 버전(교재 기준): `16.2.1`.

- Supabase 관련 (Ch9 교재 기준):
  - `@supabase/supabase-js`: `2.47.12` (교재 기준)
  - `@supabase/ssr`: `0.5.2` (교재 기준)
  - 현재 저장소 `package.json`: `@supabase/supabase-js` `^2.105.4`, `@supabase/ssr` `^0.10.3`
  - 문서·예제는 교재 기준을 따르되, 빌드 오류가 발생하면 `package.json`을 우선으로 원인을 확인하세요.

- Version Policy:
  - 교재 기준: Next.js `16.2.1`, `@supabase/supabase-js` `2.47.12`, `@supabase/ssr` `0.5.2`
  - 현재 설치 기준: `package.json`의 `@supabase/supabase-js` `^2.105.4`, `@supabase/ssr` `^0.10.3`
  - 수업 프롬프트와 설명은 교재 기준으로 통일합니다.
  - 빌드 오류가 버전 차이에서 발생하면 `package.json` 기준으로 원인을 확인합니다.
  - Supabase 대시보드 메뉴 안내는 2026년 5월 기준 UI를 따릅니다.

- 환경변수(Ch8 유지):
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

- 인증/보안 규칙:
  - 이메일/비밀번호 인증만 사용합니다. 소셜 로그인을 추가하지 않습니다.
  - 로그인은 `supabase.auth.signInWithPassword({ email, password })` 형태를 사용합니다. 구버전 `auth.signIn()` 호출은 허용하지 않습니다.
  - 회원가입은 `signUp`, 로그아웃은 `signOut`을 사용합니다.
  - 클라이언트에 `service_role` 키를 절대 두지 마십시오.
  - 보호 라우트는 App Router 환경에서 `middleware.ts`로 구현합니다.

- 실행/디버깅 가이드:
  - 문서와 예제 코드는 교재 기준 버전을 따릅니다. 로컬에서 실행/빌드 중 버전 충돌로 문제가 발생하면 `package.json`에 명시된 버전을 먼저 확인하세요.
  - Supabase 대시보드 안내는 2026-05 기준 UI 경로를 참고합니다.

- 체크포인트(에이전트가 자동 수정 시):
  1. 코드에서 `supabase.auth.signIn(` 또는 `auth.signIn(` 호출이 있으면 `signInWithPassword`로 교체 권고 및 PR 주석 추가.
  2. `service_role`가 코드에 하드코딩되어 있으면 즉시 경고(삭제 금지, 키는 비공개로 유지)와 함께 리포트.
  3. `next/router` 또는 `pages/` 폴더 생성이 감지되면 경고 및 수정 제안.

- 문서화: 이 파일은 에이전트와 사람이 보는 규칙의 기준점입니다. 변경 시 변경 이유를 커밋 메시지에 명시하세요.
