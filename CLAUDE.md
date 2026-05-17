@AGENTS.md

See `.agent/rules/project.md` for Ch9 Supabase-specific agent rules (version policy, auth API usage, and key handling).

- 교재 기준: Next.js 16.2.1, `@supabase/supabase-js` 2.47.12, `@supabase/ssr` 0.5.2.
- 현재 설치 기준은 `package.json`을 확인합니다. 문서와 예제는 교재 기준으로 통일하고, 빌드 오류가 나면 현재 설치 기준으로 원인을 확인합니다.
- Supabase Auth는 이메일/비밀번호만 사용하고, 로그인은 `signInWithPassword`를 사용합니다.
- 보호 라우트는 `middleware.ts`를 사용하고, `next/router`와 `pages` router는 사용하지 않습니다.
- `service_role` 키는 클라이언트에 두지 않습니다.
