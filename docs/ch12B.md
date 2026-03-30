# Chapter 12. 에러 처리와 UX 완성 — B회차: 실습

> **미션**: 블로그의 에러 처리, 로딩 UI, 폼 유효성, 이미지 최적화를 완성하고 배포한다

---

---

## 과제 스펙 + 스타터 코드 안내

### 과제 요구사항

Ch11까지 완성된 블로그(RLS 적용)에 UX 요소를 추가하여 완성도를 높인다:

① `app/error.tsx` — 에러 처리 페이지 (다시 시도 버튼 포함)
② `app/loading.tsx` — 로딩 스피너 또는 스켈레톤 UI
③ 게시글 작성 폼 유효성 검증 (제목 필수 2~100자, 내용 필수 10자 이상)
④ `next/image` 사용 (프로필 이미지 또는 로고)
⑤ `metadata` 설정 (title, description)
⑥ 에러 메시지가 사용자 친화적인지 확인
⑦ 배포 URL 제출

### 스타터 코드

`practice/chapter12/starter/` 폴더에 Ch11까지 완성된 블로그 앱(RLS 적용)에서 에러/로딩 처리가 빠진 상태이다.

```
practice/chapter12/starter/
├── app/
│   ├── layout.tsx           ← 공통 레이아웃 (metadata TODO)
│   ├── page.tsx             ← 메인 페이지
│   ├── error.tsx            ← 에러 페이지 (TODO)
│   ├── loading.tsx          ← 로딩 UI (TODO)
│   └── posts/
│       ├── page.tsx         ← 블로그 글 목록
│       └── new/
│           └── page.tsx     ← 블로그 글 작성 (유효성 TODO)
├── components/
│   └── post-list-skeleton.tsx ← 스켈레톤 UI (TODO)
├── lib/                     ← Supabase + 인증 + CRUD (완성)
├── public/
│   └── logo.png             ← 로고 이미지 (next/image용)
├── package.json
└── next.config.ts
```

**시작 방법** (PowerShell 기준):
```bash
cd practice/chapter12/starter
npm install
npm run dev
```
macOS Terminal도 동일하다.

브라우저에서 http://localhost:3000 을 열어 기본 페이지가 보이는지 확인한다.

---

## 바이브코딩 가이드

> **Copilot 활용**: 이번 실습에서는 Copilot Chat에 에러 처리와 UX 개선을 요청한다. A회차에서 배운 "에러 메시지 3원칙"(무엇이 + 왜 + 어떻게)으로 AI가 생성한 에러 메시지를 반드시 검증한다.

### 이번 실습에서 활용할 MCP · Skills

| 도구 | 활용 방법 |
|------|----------|
| **Context7** | `error.tsx`, `loading.tsx`, `not-found.tsx` 등 Next.js 특수 파일의 최신 규격을 확인한다. |
| **nextjs-basic-check** | `error.tsx`에 `"use client"` 누락, `loading.tsx` 위치 오류 등 App Router 규칙을 점검한다. |

- Context7 예시: `use context7. Next.js App Router에서 error.tsx의 props 타입과 사용법을 알려줘`
- Skills 점검 예시: `nextjs-basic-check 기준으로 error.tsx, loading.tsx, not-found.tsx의 규칙 위반을 찾아줘`

**좋은 프롬프트 vs 나쁜 프롬프트**:

❌ 나쁜 프롬프트:
> "에러 처리 추가해줘"

문제: 어떤 파일에, 어떤 에러를, 어떻게 표시할지 전혀 명시되지 않았다.

✅ 좋은 프롬프트:


> [버전 고정] Next.js 14.2.21, React 18.3.1, Tailwind CSS 3.4.17, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2 기준으로 작성해줘.
> [규칙] App Router만 사용하고 next/router, pages router, 구버전 API는 사용하지 마.
> [검증] 불확실하면 현재 프로젝트 package.json 기준으로 버전을 먼저 확인하고 답해줘.
> "Next.js 14 App Router에서 에러 처리 페이지를 만들어줘.
> 파일: app/error.tsx (Error Boundary 역할)
> props: error (Error 객체), reset (다시 시도 함수)
> 'use client' 필수.
> 에러 메시지 표시 + '다시 시도' 버튼 + '홈으로 돌아가기' 링크.
> Tailwind CSS로 중앙 정렬, 사용자 친화적 메시지."

<!-- COPILOT_VERIFY: 위 프롬프트를 Copilot Chat에 입력하고 error.tsx의 props가 올바른지 확인해주세요 -->

---

## 개인 실습

### 체크포인트 1: 에러 처리 + 로딩 UI

**목표**: error.tsx와 loading.tsx를 만들어 에러/로딩 상태를 처리한다.

① `app/error.tsx`에 에러 처리 컴포넌트를 만든다:

```tsx
// app/error.tsx — 핵심 구조
"use client"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <h2>문제가 발생했습니다</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>다시 시도</button>
    </div>
  )
}
```

② `app/loading.tsx`에 로딩 UI를 만든다 — 스피너 또는 스켈레톤 중 선택:

```tsx
// app/loading.tsx — 스피너 예시
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  )
}
```

③ (선택) `components/post-list-skeleton.tsx`에 게시글 목록용 스켈레톤을 만든다
④ 의도적으로 에러를 발생시켜(예: 잘못된 테이블명) error.tsx가 동작하는지 확인한다
⑤ 페이지 전환 시 loading.tsx가 표시되는지 확인한다


### 체크포인트 2: 폼 유효성 + 이미지 최적화

**목표**: 게시글 작성 폼에 유효성 검증을 추가하고, next/image로 이미지를 최적화한다.

① 게시글 작성 폼에 유효성 검증을 추가한다:

```tsx
// 핵심 구조
const [errors, setErrors] = useState<{ title?: string; content?: string }>({})

function validate() {
  const newErrors: typeof errors = {}
  if (!title.trim() || title.length < 2) newErrors.title = "제목은 2자 이상 입력해주세요"
  if (title.length > 100) newErrors.title = "제목은 100자 이하로 입력해주세요"
  if (!content.trim() || content.length < 10) newErrors.content = "내용은 10자 이상 입력해주세요"
  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}
```

② 에러 메시지를 입력 필드 아래에 빨간색으로 표시한다 (`text-destructive`)
③ `next/image`로 로고 또는 프로필 이미지를 최적화한다:

```tsx
import Image from "next/image"

<Image
  src="/logo.png"
  alt="로고"
  width={120}
  height={40}
/>
```

④ `app/layout.tsx`에 metadata를 설정한다:

```typescript
export const metadata = {
  title: "내 블로그 - My Blog",
  description: "Next.js + Supabase로 만든 개인 블로그",
}
```

⑤ 유효성 검증이 동작하는지 테스트한다 (빈 제목, 짧은 내용 등)

<!-- COPILOT_VERIFY: Copilot이 생성한 유효성 검증에서 경계값(2자, 100자, 10자)이 올바른지 확인해주세요 -->

### 체크포인트 3: 검증 + 배포

**목표**: UX 개선 사항을 검증하고 배포한다.

① 아래 검증 체크리스트를 수행한다
② 문제가 있으면 수정한다
③ git push로 배포한다:

```bash
git add .
git commit -m "Ch12: 에러 처리 + UX 완성"
git push
```

④ Vercel 대시보드에서 배포 완료를 확인한다
⑤ 배포된 URL에서 에러/로딩/유효성/이미지가 정상 동작하는지 확인한다

---

## 검증 체크리스트

**표 12.10** UX 완성 검증 체크리스트

| 항목 | 확인 내용 | 확인 |
|------|-----------|------|
| error.tsx | `"use client"` + error/reset props가 있는가? | ☐ |
| loading.tsx | 스피너 또는 스켈레톤이 표시되는가? | ☐ |
| 에러 메시지 | "무엇이 + 왜 + 어떻게" 3원칙을 따르는가? | ☐ |
| 폼 유효성 | 제목 2~100자, 내용 10자 이상 검증이 동작하는가? | ☐ |
| 에러 표시 | 유효성 에러가 필드 아래에 빨간색으로 표시되는가? | ☐ |
| next/image | `width`와 `height` 속성이 있는가? | ☐ |
| metadata | 브라우저 탭에 사이트 제목이 표시되는가? | ☐ |
| 배포 URL | 배포된 사이트에서 모든 UX가 동작하는가? | ☐ |

---

## 흔한 AI 실수

**표 12.11** Ch12에서 AI가 자주 틀리는 패턴

| AI 실수 | 올바른 방법 | 발생 원인 |
|---------|------------|----------|
| error.tsx에 `"use client"` 누락 | 파일 최상단에 `"use client"` 필수 | Error Boundary는 Client Component |
| `next/image`에 width/height 누락 | width, height 속성 필수 (레이아웃 시프트 방지) | Next.js Image 규칙 미인식 |
| 에러 메시지가 기술적 ("500 Internal Server Error") | 사용자 친화적 메시지 ("문제가 발생했습니다") | 에러 메시지 3원칙 미적용 |
| 유효성 검증에서 `trim()` 누락 | `title.trim()` — 공백만 입력하는 케이스 방지 | 엣지 케이스 미고려 |
| loading.tsx를 `"use client"`로 설정 | loading.tsx는 Server Component로 동작 | error.tsx와 혼동 |
| metadata를 Client Component에서 export | metadata는 Server Component에서만 export 가능 | Server/Client 구분 미인식 |

---

## 제출 안내 (Google Classroom)

Google Classroom의 "Ch12 과제"에 아래 두 항목을 제출한다:

```
① 배포 URL
   예: https://내프로젝트.vercel.app

② AI가 틀린 부분 1개
   예: "Copilot이 error.tsx에 'use client'를 빼먹어서
       에러 바운더리가 동작하지 않았다. 추가하니 해결되었다."
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
- error.tsx: `"use client"` + `reset` 함수 + 사용자 친화적 메시지가 동일한가?
- loading.tsx: 스켈레톤 UI 구현 방식이 다른가?
- 폼 유효성: 클라이언트 검증 메시지와 표시 방식이 다른가?
- next/image: `width`/`height` 속성과 최적화 설정이 올바른가?

_전체 모범 구현은 practice/chapter12/complete/ 참고_

---

