# Chapter 10. Supabase Database CRUD — B회차: 실습

> **미션**: 블로그 CRUD를 완성하고 배포한다 — 목록, 작성, 상세, 수정, 삭제

---

---

## 과제 스펙 + 스타터 코드 안내

### 과제 요구사항

Ch9에서 구현한 인증 기반 위에 블로그 CRUD 기능을 완성한다:

① 게시글 목록 페이지 — 작성자 이름 표시, 최신순 정렬
② 게시글 작성 페이지 — 로그인 사용자만 접근
③ 블로그 글 상세 페이지 — 본인 글에만 수정/삭제 버튼
④ 블로그 글 수정 기능
⑤ 블로그 글 삭제 기능 — 확인 대화상자 포함
⑥ GitHub push + Vercel 배포

### 스타터 코드

`practice/chapter10/starter/` 폴더에 블로그 프론트엔드(인증 포함)가 준비되어 있고, CRUD 함수 부분이 TODO로 비어 있다.

```
practice/chapter10/starter/
├── app/
│   ├── layout.tsx           ← AuthProvider 적용 완료
│   ├── page.tsx             ← 메인 페이지 (게시글 목록 뼈대)
│   └── posts/
│       ├── page.tsx         ← 블로그 글 목록 (TODO: select)
│       ├── new/
│       │   └── page.tsx     ← 블로그 글 작성 (TODO: insert)
│       └── [id]/
│           ├── page.tsx     ← 블로그 글 상세 (TODO: select by id)
│           └── edit/
│               └── page.tsx ← 블로그 글 수정 (TODO: update)
├── lib/
│   ├── supabase/            ← 클라이언트 (완성)
│   ├── auth.ts              ← 인증 함수 (완성)
│   ├── auth-context.tsx     ← AuthContext (완성)
│   └── posts.ts             ← CRUD 함수 (TODO)
├── package.json
└── next.config.ts
```

**시작 방법** (PowerShell 기준):
```bash
cd practice/chapter10/starter
npm install
npm run dev
```
macOS Terminal도 동일하다.

브라우저에서 http://localhost:3000 을 열어 기본 페이지가 보이는지 확인한다.

---

## 바이브코딩 가이드

> **Copilot 활용**: 이번 실습에서는 Copilot Chat에 CRUD 함수와 페이지를 요청한다. A회차에서 배운 SQL ↔ Supabase 클라이언트 대응을 기준으로 생성된 코드를 검증한다.

### 이번 실습에서 활용할 MCP · Skills

| 도구 | 활용 방법 |
|------|----------|
| **Context7** | Supabase JS의 `select`, `insert`, `update`, `delete` 메서드 문법을 최신 문서로 확인한다. |
| **Supabase MCP** | 테이블 스키마 확인, 데이터 조회로 CRUD가 정상 동작하는지 검증한다. |
| **secret-guard** | CRUD 함수에서 `service_role` 키가 클라이언트에 노출되지 않았는지 점검한다. |

- Context7 예시: `use context7. Supabase JS v2에서 관계 데이터를 join해서 조회하는 방법을 알려줘`
- Supabase MCP 예시: `posts 테이블에 저장된 데이터 5개만 보여줘`
- Skills 점검 예시: `secret-guard 기준으로 lib/posts.ts에서 키 노출을 확인해줘`

**좋은 프롬프트 vs 나쁜 프롬프트**:

❌ 나쁜 프롬프트:
> "블로그 CRUD 만들어줘"

문제: 테이블명, 컬럼, 정렬 기준, 관계 데이터 포함 여부가 전혀 명시되지 않았다.

✅ 좋은 프롬프트:


> [버전 고정] Next.js 14.2.21, React 18.3.1, Tailwind CSS 3.4.17, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2 기준으로 작성해줘.
> [규칙] App Router만 사용하고 next/router, pages router, 구버전 API는 사용하지 마.
> [검증] 불확실하면 현재 프로젝트 package.json 기준으로 버전을 먼저 확인하고 답해줘.
> "Supabase에서 블로그 CRUD 함수를 lib/posts.ts에 만들어줘.
> 테이블: posts (id, user_id, title, content, created_at)
> 1) getPosts: 전체 조회, created_at 내림차순, profiles(username) 포함
> 2) getPost(id): 단건 조회, profiles(username) 포함
> 3) createPost(user_id, title, content): 생성
> 4) updatePost(id, title, content): 수정
> 5) deletePost(id): 삭제
> 모든 함수는 { data, error } 반환. @supabase/ssr 사용."

<!-- COPILOT_VERIFY: 위 프롬프트를 Copilot Chat에 입력하고 관계 데이터 조회 문법이 올바른지 확인해주세요 -->

---

## 개인 실습

### 체크포인트 1: 목록 + 작성 페이지

**목표**: 블로그 글 목록 조회와 게시글 작성 기능을 구현한다.

① `lib/posts.ts`에 `getPosts` 함수를 작성한다:

```typescript
// lib/posts.ts — 목록 조회 핵심 구조
export async function getPosts() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("posts")
    .select("*, profiles(username)")
    .order("created_at", { ascending: false })
  return { data, error }
}
```

② `app/posts/page.tsx`에서 `getPosts()`를 호출하여 목록을 표시한다
③ `lib/posts.ts`에 `createPost` 함수를 작성한다:

```typescript
// 작성 핵심 구조
export async function createPost(user_id: string, title: string, content: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("posts")
    .insert({ user_id, title, content })
    .select()
  return { data, error }
}
```

④ `app/posts/new/page.tsx`에 작성 폼을 구현한다 — 로그인 사용자만 접근
⑤ 게시글을 작성하고 목록에 나타나는지 확인한다


### 체크포인트 2: 상세 + 수정 + 삭제

**목표**: 블로그 글 상세 조회, 수정, 삭제 기능을 구현한다.

① `lib/posts.ts`에 `getPost(id)` 함수를 작성한다 — `.eq("id", id).single()` 사용
② `app/posts/[id]/page.tsx`에 상세 페이지를 구현한다
③ 본인 글에만 수정/삭제 버튼을 표시한다 (조건부 렌더링):

```tsx
// 핵심 구조
{user?.id === post.user_id && (
  <div>
    <Link href={`/posts/${post.id}/edit`}>수정</Link>
    <button onClick={handleDelete}>삭제</button>
  </div>
)}
```

④ `updatePost(id, title, content)` 함수와 수정 페이지를 구현한다
⑤ `deletePost(id)` 함수를 구현한다 — 삭제 전 `window.confirm()` 확인
⑥ 수정과 삭제가 정상 동작하는지 테스트한다

<!-- COPILOT_VERIFY: 수정/삭제 조건부 렌더링이 올바르게 구현되는지 확인해주세요 -->

### 체크포인트 3: 검증 + 배포

**목표**: CRUD 코드를 검증하고 배포한다.

① 아래 검증 체크리스트를 수행한다
② 문제가 있으면 수정한다
③ git push로 배포한다:

```bash
git add .
git commit -m "Ch10: 블로그 CRUD 완성"
git push
```

④ Vercel 대시보드에서 배포 완료를 확인한다
⑤ 배포된 URL에서 목록 → 작성 → 상세 → 수정 → 삭제가 동작하는지 확인한다

---

## 검증 체크리스트

**표 10.9** CRUD 구현 검증 체크리스트

| 항목 | 확인 내용 | 확인 |
|------|-----------|------|
| select | 목록 조회에서 작성자 이름이 표시되는가? (profiles join) | ☐ |
| insert | 게시글 작성 후 목록에 나타나는가? | ☐ |
| update | 수정 후 내용이 반영되는가? | ☐ |
| delete | 삭제 후 목록에서 사라지는가? | ☐ |
| WHERE 조건 | update/delete에 `.eq("id", id)`가 있는가? | ☐ |
| 에러 처리 | `{ data, error }` 패턴으로 에러를 확인하는가? | ☐ |
| 권한 UI | 본인 글에만 수정/삭제 버튼이 보이는가? | ☐ |
| 삭제 확인 | 삭제 전 confirm 대화상자가 뜨는가? | ☐ |
| 배포 URL | 배포된 사이트에서 CRUD가 동작하는가? | ☐ |

---

## 흔한 AI 실수

**표 10.10** Ch10에서 AI가 자주 틀리는 패턴

| AI 실수 | 올바른 방법 | 발생 원인 |
|---------|------------|----------|
| `.select("*")` — 관계 데이터 누락 | `.select("*, profiles(username)")` | 외래 키 join 미인식 |
| update/delete에 WHERE 조건 없음 | `.eq("id", id)` 필수 | 모든 행 변경 위험 |
| `.single()` 없이 단건 조회 | `.eq("id", id).single()` | 배열 대신 객체 반환 필요 |
| insert 후 페이지 새로고침 없음 | `router.push("/posts")` 또는 `router.refresh()` | UX 흐름 미고려 |
| 삭제 시 confirm 없음 | `window.confirm("정말 삭제하시겠습니까?")` 추가 | 실수 방지 UX 누락 |
| 서버 컴포넌트에서 `onClick` 사용 | `"use client"` 추가 또는 Client Component 분리 | Server/Client 구분 혼동 |

---

## 제출 안내 (Google Classroom)

Google Classroom의 "Ch10 과제"에 아래 두 항목을 제출한다:

```
① 배포 URL
   예: https://내프로젝트.vercel.app

② AI가 틀린 부분 1개
   예: "Copilot이 .select('*')만 작성해서 작성자 이름이 안 보였다.
       .select('*, profiles(username)')로 수정하니 해결되었다."
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
- CRUD 함수: `select`, `insert`, `update`, `delete` 문법과 에러 처리가 동일한가?
- 관계 데이터: `.select('*, profiles(username)')` 패턴을 사용했는가?
- 권한 분기: `user?.id === post.user_id` 비교가 올바르게 동작하는가?

_전체 모범 구현은 practice/chapter10/complete/ 참고_

---

