@AGENTS.md

See `.agent/rules/project.md` for Ch9 Supabase-specific agent rules (version policy, auth API usage, and key handling).

- 교재 기준: Next.js 16.2.1, `@supabase/supabase-js` 2.47.12, `@supabase/ssr` 0.5.2.
- 현재 설치 기준은 `package.json`을 확인합니다. 문서와 예제는 교재 기준으로 통일하고, 빌드 오류가 나면 현재 설치 기준으로 원인을 확인합니다.
- Supabase Auth는 이메일/비밀번호만 사용하고, 로그인은 `signInWithPassword`를 사용합니다.
- 보호 라우트는 `middleware.ts`를 사용하고, `next/router`와 `pages` router는 사용하지 않습니다.
- `service_role` 키는 클라이언트에 두지 않습니다.

추가(Ch10): 게시글 CRUD 구현 시 다음을 준수하세요:

- `lib/supabase/client.ts` 사용(브라우저 클라이언트)
- `AuthProvider`/`useAuth()`로 현재 유저 식별 후 `posts.user_id`와 매칭
- Ch8 컬럼명은 변경하지 않음: `profiles`(`id`, `username`, `avatar_url`, `role`), `posts`(`id`, `user_id`, `title`, `content`, `created_at`)
- 수정/삭제 UI는 UX 차원에서 구현하되, 권한 검증은 Ch11에서 RLS로 처리

추가(Ch11): RLS 적용 시 다음을 준수하세요:

- RLS는 Supabase SQL Editor 직접 실행이 아니라 Supabase CLI 마이그레이션으로 기록
- `posts` 정책은 `posts.user_id`와 `auth.uid()` 기준으로 작성
- 클라이언트 UI 분기는 보안이 아니며 실제 보안은 RLS가 담당
- `service_role` 키는 클라이언트에서 절대 사용 금지
- 적용 대상(아직 SQL 작성 전): `posts`(SELECT/INSERT/UPDATE/DELETE), 필요 시 `profiles`(본인 수정)
