# Chapter 8. Supabase 시작하기 — B회차: 실습

> **미션**: Supabase 프로젝트를 생성하고, Next.js와 연결하여 데이터 읽기 페이지를 배포한다

---

---

## 과제 스펙 + 스타터 코드 안내

### 과제 요구사항

Supabase를 Next.js 프로젝트에 연동하고, 데이터를 읽어 화면에 표시한 뒤 배포한다:

① Supabase 프로젝트 생성 + API 키 확인
② `.env.local` 환경 변수 설정
③ `lib/supabase/client.ts` + `lib/supabase/server.ts` 클라이언트 초기화
④ SQL Editor에서 `profiles` + `posts` 테이블 생성
⑤ 연결 테스트 성공 확인
⑥ Vercel 환경 변수 등록 + 배포

### 스타터 코드

`practice/chapter8/starter/` 폴더에 Supabase 패키지가 설치된 Next.js 프로젝트와 비어 있는 `lib/supabase/` 폴더가 준비되어 있다.

```
practice/chapter8/starter/
├── app/
│   ├── layout.tsx         ← 공통 레이아웃
│   ├── page.tsx           ← 메인 페이지 (데이터 표시 뼈대)
│   └── globals.css        ← Tailwind 기본 import
├── lib/
│   └── supabase/
│       ├── client.ts      ← 브라우저 클라이언트 (TODO)
│       └── server.ts      ← 서버 클라이언트 (TODO)
├── .env.local.example     ← 환경 변수 템플릿
├── package.json           ← @supabase/supabase-js, @supabase/ssr 포함
├── tailwind.config.ts
└── next.config.ts
```

**시작 방법** (PowerShell 기준):
```bash
cd practice/chapter8/starter
npm install
npm run dev
```
macOS Terminal도 동일하다.

브라우저에서 http://localhost:3000 을 열어 기본 페이지가 보이는지 확인한다.

---

## 바이브코딩 가이드

> **Copilot 활용**: 이번 실습에서는 Copilot Chat에 Supabase 연동 코드를 요청한다. 환경 변수와 클라이언트 설정은 A회차에서 배운 패턴과 정확히 일치하는지 반드시 검증한다.

### 이번 실습에서 활용할 MCP · Skills

이번 챕터부터 **Supabase MCP**를 처음 사용한다. Ch2에서 설치한 Context7과 함께 활용한다.

**Supabase MCP 설치** — Copilot Agent 모드에서 아래 프롬프트를 입력한다:

> **Copilot 프롬프트**
> ".vscode/mcp.json에 supabase MCP 서버를 추가해줘.
> command는 npx, args는 ["-y", "supabase-mcp-server@latest", "--read-only"].
> env에 SUPABASE_URL과 SUPABASE_SERVICE_ROLE_KEY를 ${input:...} 방식으로 설정해줘."

<!-- COPILOT_VERIFY: 위 프롬프트로 Supabase MCP가 mcp.json에 추가되고 정상 동작하는지 확인해주세요 -->

| 도구 | 활용 방법 |
|------|----------|
| **Context7** | `@supabase/ssr` 최신 API로 클라이언트를 설정한다. `use context7`을 붙인다. |
| **Supabase MCP** | 테이블 목록 조회, 스키마 확인을 Copilot 안에서 직접 수행한다. |
| **secret-guard** | `lib/supabase/client.ts`, `lib/supabase/server.ts` 작성 직후, 키 노출과 `.env.local` 사용을 점검한다. |

- Context7 예시: `use context7. @supabase/ssr에서 createBrowserClient와 createServerClient 사용법을 알려줘`
- Supabase MCP 예시: `Supabase 프로젝트의 테이블 목록을 보여줘`
- Skills 점검 예시: `secret-guard 기준으로 Supabase 키 노출이나 .env.local 미사용을 찾아줘`

**좋은 프롬프트 vs 나쁜 프롬프트**:

❌ 나쁜 프롬프트:
> "Supabase 연결해줘"

문제: 어떤 패키지를 사용하는지, 브라우저/서버 클라이언트 구분, 환경 변수명이 전혀 명시되지 않았다.

✅ 좋은 프롬프트:


> [버전 고정] Next.js 14.2.21, React 18.3.1, Tailwind CSS 3.4.17, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2 기준으로 작성해줘.
> [규칙] App Router만 사용하고 next/router, pages router, 구버전 API는 사용하지 마.
> [검증] 불확실하면 현재 프로젝트 package.json 기준으로 버전을 먼저 확인하고 답해줘.
> "Next.js 14 App Router 프로젝트에서 Supabase 클라이언트를 설정해줘.
> 패키지: @supabase/supabase-js + @supabase/ssr
> 파일 구조: lib/supabase/client.ts (브라우저용), lib/supabase/server.ts (서버용)
> 환경 변수: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY (.env.local)
> 서버 클라이언트는 cookies()를 사용하는 createServerClient 패턴."

<!-- COPILOT_VERIFY: 위 프롬프트를 Copilot Chat에 입력하고 @supabase/ssr 최신 API를 사용하는지 확인해주세요 -->

---

## 개인 실습

### 체크포인트 1: Supabase 프로젝트 생성 + 환경 변수

**목표**: Supabase 프로젝트를 생성하고 API 키를 `.env.local`에 설정한다.

① https://supabase.com 에서 새 프로젝트를 생성한다
② 프로젝트 이름, 데이터베이스 비밀번호, 리전(Northeast Asia — ap-northeast-1 권장)을 설정한다
③ Settings → API에서 `Project URL`과 `anon public` 키를 복사한다
④ `.env.local.example`을 `.env.local`로 복사하고 값을 채운다:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

⑤ `.gitignore`에 `.env.local`이 포함되어 있는지 확인한다


### 체크포인트 2: 클라이언트 초기화 + SQL 테이블 생성

**목표**: 브라우저/서버 클라이언트를 초기화하고, 데이터베이스 테이블을 생성한다.

① `lib/supabase/client.ts`에 브라우저 클라이언트를 작성한다

```typescript
// lib/supabase/client.ts — 핵심 구조
import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

② `lib/supabase/server.ts`에 서버 클라이언트를 작성한다 (cookies 사용)
③ Supabase 대시보드 → SQL Editor에서 테이블을 생성한다:

```sql
-- profiles 테이블
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- posts 테이블
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

④ 테이블이 생성되었는지 Table Editor에서 확인한다
⑤ posts 테이블에 테스트 데이터 1~2개를 수동으로 추가한다

<!-- COPILOT_VERIFY: Copilot이 생성한 서버 클라이언트 코드가 @supabase/ssr의 최신 createServerClient API를 사용하는지 확인해주세요 -->

### 체크포인트 3: 연결 테스트 + Vercel 배포

**목표**: 데이터가 화면에 표시되는지 확인하고 배포한다.

① 메인 페이지에서 Supabase 데이터를 조회하는 코드를 작성한다:

```typescript
// app/page.tsx — 핵심 구조
import { createClient } from "@/lib/supabase/server"

export default async function Home() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
  // posts를 화면에 표시
}
```

② `npm run dev`로 로컬에서 데이터가 표시되는지 확인한다
③ Vercel 대시보드 → Settings → Environment Variables에 환경 변수를 등록한다
④ git push로 배포한다:

```bash
git add .
git commit -m "Ch8: Supabase 연동 + 데이터 읽기"
git push
```

⑤ 배포된 URL에서 데이터가 정상 표시되는지 확인한다

---

## 검증 체크리스트

**표 8.12** Supabase 연동 검증 체크리스트

| 항목 | 확인 내용 | 확인 |
|------|-----------|------|
| 환경 변수 | `.env.local`에 `NEXT_PUBLIC_` 접두사가 붙어 있는가? | ☐ |
| 브라우저 클라이언트 | `@supabase/ssr`의 `createBrowserClient`를 사용하는가? | ☐ |
| 서버 클라이언트 | `@supabase/ssr`의 `createServerClient`를 사용하는가? | ☐ |
| API 키 | `anon` 키를 사용하는가? (`service_role` 키가 아닌가?) | ☐ |
| SQL 테이블 | `profiles`와 `posts` 테이블이 생성되었는가? | ☐ |
| FK 관계 | `posts.user_id`가 `profiles.id`를 참조하는가? | ☐ |
| 로컬 테스트 | 브라우저에서 데이터가 표시되는가? | ☐ |
| Vercel 환경 변수 | Vercel 대시보드에 환경 변수가 등록되었는가? | ☐ |
| 배포 URL | 배포된 사이트에서 데이터가 표시되는가? | ☐ |

---

## 흔한 AI 실수

**표 8.13** Ch8에서 AI가 자주 틀리는 패턴

| AI 실수 | 올바른 방법 | 발생 원인 |
|---------|------------|----------|
| `@supabase/supabase-js`에서 직접 `createClient` import | `@supabase/ssr`의 `createBrowserClient`/`createServerClient` 사용 | 구버전 패턴 학습 |
| `NEXT_PUBLIC_` 접두사 누락 | 브라우저에서 사용하는 변수에 반드시 `NEXT_PUBLIC_` 추가 | Next.js 환경 변수 규칙 미인식 |
| `.env` 파일 사용 | `.env.local` 파일 사용 (Next.js 규칙) | 환경 변수 파일 혼동 |
| `service_role` 키를 브라우저에서 사용 | 브라우저에는 `anon` 키만 사용 | 보안 규칙 미인식 |
| `users` 테이블 직접 생성 | `profiles` 테이블 생성 + `auth.users` 참조 | Supabase 인증 구조 미인식 |
| `id`를 `INT` 또는 `SERIAL`로 생성 | `UUID` 사용 (auth.users 호환) | PostgreSQL 타입 혼동 |

---

## 제출 안내 (Google Classroom)

Google Classroom의 "Ch8 과제"에 아래 두 항목을 제출한다:

```
① 배포 URL
   예: https://내프로젝트.vercel.app

② AI가 틀린 부분 1개
   예: "Copilot이 @supabase/supabase-js에서 createClient를 import했는데,
       @supabase/ssr의 createBrowserClient로 수정했다."
```

---

## C파일 비교 + 코드 수정 가이드

> 제출 마감 후 C파일(모범 구현)을 확인한다. 자기 코드와 비교해 차이점을 찾고 수정한다.

**진행 순서**:

| 시간 | 활동 |
|------|------|
| 3분 | C파일 핵심 구조 확인 |
| 5분 | 학생이 자기 코드와 C파일을 비교 — 다른 부분 3개 이상 찾기 |
| 5분 | 다른 부분 중 1개를 선택하여 자기 코드 수정 |
| 2분 | 핵심 차이점 1~2개 정리 |

**비교 포인트**:
- 클라이언트 분리: `lib/supabase/client.ts`(브라우저)와 `server.ts`(서버)가 올바르게 분리되었는가?
- 환경 변수: `.env.local`에 저장했는가? `service_role` 키가 브라우저 코드에 없는가?
- 테이블 구조: SQL 스키마가 모범 구현과 동일한가? FK, 타입이 다른 부분은?

_전체 모범 구현은 practice/chapter8/complete/ 참고_

---

