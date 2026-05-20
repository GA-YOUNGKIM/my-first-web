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

- Ch10(게시글 CRUD) 지침:
	- 브라우저에서 Supabase 연동은 `lib/supabase/client.ts`를 사용합니다.
	- 인증 상태는 `AuthProvider`/`useAuth()`를 통해 가져와 `posts.user_id`와 비교합니다.
	- Ch8 컬럼명은 변경하지 않습니다. `profiles`(`id`, `username`, `avatar_url`, `role`), `posts`(`id`, `user_id`, `title`, `content`, `created_at`).
	- 수정/삭제 UI는 구현하되, 권한 검증은 Ch11 RLS로 처리함을 문서에 명시합니다.

- Ch11(RLS) 지침:
	- RLS는 Supabase SQL Editor 직접 실행이 아니라 Supabase CLI 마이그레이션으로 기록합니다.
	- 보안은 클라이언트 `if` 분기로 강제하지 않고, RLS 정책으로 DB 레벨에서 강제합니다.
	- `posts` 정책은 `posts.user_id`와 `auth.uid()` 기준으로 작성합니다.
	- 클라이언트 UI 분기는 보안이 아니며, 실제 보안은 RLS가 담당합니다.
	- `service_role` 키는 클라이언트에서 절대 사용하지 않습니다.
	- RLS SQL은 반드시 `supabase/migrations/` 파일로 남겨 추적 가능한 변경 이력을 유지합니다.
	- RLS 적용 대상(아직 SQL 작성 전): `posts`(SELECT/INSERT/UPDATE/DELETE), 필요 시 `profiles`(본인 수정)

When creating or modifying auth-related code, prefer the Ch9 교재 기준 and record any differences with the local `package.json` versions in PR descriptions.
