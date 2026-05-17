<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

-- Agent guidance (Ch9 Supabase) --

Agents working on this repository must follow the rules in `.agent/rules/project.md` (Supabase/Auth, Version Policy, middleware, keys). The file contains explicit checks for `signInWithPassword`, `service_role` exposure, App Router usage, and the 교재 기준 vs 현재 설치 기준 version policy.

- 교재 기준: Next.js 16.2.1, `@supabase/supabase-js` 2.47.12, `@supabase/ssr` 0.5.2.
- 현재 설치 기준은 `package.json`을 확인합니다. 문서와 예제는 교재 기준으로 통일하고, 빌드 오류가 나면 현재 설치 기준으로 원인을 확인합니다.
- Supabase Auth는 이메일/비밀번호만 사용하고, 로그인은 `signInWithPassword`를 사용합니다.
- 보호 라우트는 `middleware.ts`를 사용하고, `next/router`와 `pages` router는 사용하지 않습니다.
- `service_role` 키는 클라이언트에 두지 않습니다.

When creating or modifying auth-related code, prefer the Ch9 교재 기준 and record any differences with the local `package.json` versions in PR descriptions.
