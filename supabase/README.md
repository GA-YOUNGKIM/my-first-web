# Supabase Setup Guide

## 1) Supabase 프로젝트 생성 (수동)

1. Supabase Dashboard에서 New project를 생성합니다.
2. Project URL, anon key, service_role key를 확인합니다.
3. SQL Editor에서 `supabase/schema.sql` 전체를 실행합니다.

## 2) Next.js 환경변수 설정

프로젝트 루트에 `.env.local` 파일을 만들고 아래 값을 채웁니다.

```env
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
```

## 3) 권장 패키지 설치

```bash
npm install @supabase/supabase-js @supabase/ssr
```

## 4) 확인 체크리스트

- `profiles`, `posts`, `comments` 테이블이 생성되었는지 확인
- RLS가 enable 상태인지 확인
- 정책(policy)이 테이블별로 생성되었는지 확인

## 참고

- 현재 개발 환경에는 Supabase CLI가 설치되어 있지 않습니다.
- CLI를 사용하려면 별도 설치 후 `supabase login`이 필요합니다.
