# Chapter 6. Next.js 상태 관리와 데이터 페칭 — B회차: 실습

> **미션**: 블로그 프론트엔드를 완성하고 배포한다 — 검색, 폼, 삭제, 데이터 페칭

---

---

## 과제 스펙 + 스타터 코드 안내

### 과제 요구사항

Ch5에서 만든 블로그에 **인터랙션**을 추가하여 프론트엔드를 완성한다:

① 게시글 검색 — SearchBar를 Client Component로 분리, useState + filter로 제목 검색
② 게시글 작성 폼 — 제어 컴포넌트 패턴, 빈 제목 입력 시 경고
③ 게시글 삭제 — confirm 후 filter로 제거 (불변성 유지)
④ 데이터 페칭 — JSONPlaceholder API에서 게시글 가져오기 (서버 또는 클라이언트)
⑤ Server/Client 분리 — 인터랙션이 필요한 부분만 "use client"

### 스타터 코드

`practice/chapter6/starter/` 폴더에 Ch5 완성 코드 기반 + 상태 관리 뼈대가 준비되어 있다.

```
practice/chapter6/starter/
├── app/
│   ├── layout.js        ← 공통 레이아웃
│   ├── page.js          ← 메인 페이지 (게시글 목록 + 검색 뼈대)
│   ├── globals.css      ← Tailwind 기본 import
│   └── posts/
│       ├── [id]/
│       │   └── page.js  ← 게시글 상세 (더미)
│       └── new/
│           └── page.js  ← 게시글 작성 폼 (빈 상태)
├── components/
│   └── SearchBar.js     ← 검색바 뼈대 ("use client" + useState 빈 구조)
├── lib/
│   └── posts.js         ← 더미 데이터
├── package.json
├── tailwind.config.js
└── next.config.js
```

**시작 방법** (PowerShell 기준):
```bash
cd practice/chapter6/starter
npm install
npm run dev
```
macOS Terminal도 동일하다.

브라우저에서 http://localhost:3000 을 열어 기본 페이지가 보이는지 확인한다.

---

## 바이브코딩 가이드

> **Copilot 활용**: 이번 실습에서는 Copilot Chat에 프롬프트를 입력하여 상태 관리와 이벤트 처리를 구현한다. 생성된 코드를 그대로 쓰지 말고, A회차에서 배운 기준으로 반드시 검증한다.

### 이번 실습에서 활용할 MCP · Skills

| 도구 | 활용 방법 |
|------|----------|
| **Context7** | useState, useEffect 등 React Hook의 최신 사용법을 확인한다. `use context7`을 붙인다. |
| **nextjs-basic-check** | Server Component와 Client Component를 올바르게 분리했는지 점검한다. |

- Context7 프롬프트 예시: `use context7. Next.js App Router에서 Server Component와 Client Component를 어떻게 구분하는지 알려줘`
- Skills 점검 프롬프트 예시: `nextjs-basic-check 기준으로 "use client" 누락이나 Server/Client 구분 오류를 찾아줘`

**좋은 프롬프트 vs 나쁜 프롬프트**:

❌ 나쁜 프롬프트:
> "블로그에 검색 기능 추가해줘"

문제: Server/Client 구분, 상태 관리 방식, 컴포넌트 분리 전략이 전혀 명시되지 않았다.

✅ 좋은 프롬프트:


> [버전 고정] Next.js 14.2.21, React 18.3.1, Tailwind CSS 3.4.17, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2 기준으로 작성해줘.
> [규칙] App Router만 사용하고 next/router, pages router, 구버전 API는 사용하지 마.
> [검증] 불확실하면 현재 프로젝트 package.json 기준으로 버전을 먼저 확인하고 답해줘.
> "블로그 목록 페이지에 검색 기능을 추가해줘.
> SearchBar는 'use client' Client Component로 분리 (components/SearchBar.js).
> useState로 검색어를 관리하고, posts 배열을 filter로 제목 검색.
> 검색 결과가 없으면 '검색 결과가 없습니다' 표시.
> Next.js 14, Tailwind CSS, App Router 사용."

<!-- COPILOT_VERIFY: 위 프롬프트를 Copilot Chat에 입력하고 Server/Client 분리가 올바른지 확인해주세요 -->

---

## 개인 실습

### 체크포인트 1: 검색 기능

**목표**: SearchBar Client Component를 완성하여 게시글 제목 검색 기능을 구현한다.

① `components/SearchBar.js`에서 useState로 검색어 상태를 관리한다
② onChange 이벤트로 검색어를 실시간 업데이트한다
③ 부모 컴포넌트에서 검색어에 따라 게시글을 filter한다
④ 검색 결과가 0건이면 "검색 결과가 없습니다" 메시지를 표시한다
⑤ `"use client"`가 SearchBar에만 있는지 확인한다 (메인 페이지에는 없어야 함)


### 체크포인트 2: 게시글 작성 + 삭제 기능

**목표**: 게시글 작성 폼과 삭제 기능을 구현한다.

① `app/posts/new/page.js`에 제어 컴포넌트 패턴을 적용한다 (value + onChange)
② 제목이 비어있으면 경고 메시지를 표시한다 (form.title.trim() 검증)
③ 게시글 목록에 삭제 버튼을 추가한다
④ 삭제 시 `window.confirm()`으로 확인을 받는다
⑤ `posts.filter()`로 해당 게시글을 제거한다 (push/splice 사용 금지)

Copilot에게 삭제 기능을 요청할 때:


> [버전 고정] Next.js 14.2.21, React 18.3.1, Tailwind CSS 3.4.17, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2 기준으로 작성해줘.
> [규칙] App Router만 사용하고 next/router, pages router, 구버전 API는 사용하지 마.
> [검증] 불확실하면 현재 프로젝트 package.json 기준으로 버전을 먼저 확인하고 답해줘.
> "게시글 카드에 삭제 버튼을 추가해줘.
> 클릭하면 window.confirm으로 확인 후 posts state에서 filter로 제거.
> 불변성 유지 — push/splice 사용 금지, setPosts(posts.filter()) 패턴."

### 체크포인트 3: 검증 + 배포

**목표**: AI 코드를 검증하고 배포한다.

① 아래 검증 체크리스트를 수행한다
② 문제가 있으면 수정한다
③ git add -> git commit -> git push 로 배포한다:
```bash
git add .
git commit -m "Ch6: 블로그 프론트엔드 완성 (검색, 폼, 삭제)"
git push
```
④ Vercel 대시보드에서 배포 완료를 확인한다
⑤ 배포된 URL을 브라우저에서 열어 동작을 확인한다
⑥ 검색, 작성, 삭제가 모두 동작하는지 확인한다

---

## 검증 체크리스트

**표 6.7** AI 생성 코드 검증 체크리스트

| 항목 | 확인 내용 | 확인 |
|------|-----------|------|
| "use client" 위치 | useState/useEffect 사용 파일에만 있는가? (전체 페이지에 넣지 않았는가?) | ☐ |
| useState import | `import { useState } from "react"` 인가? | ☐ |
| useEffect 의존성 | 의존성 배열이 올바른가? (빠진 변수, 불필요한 변수) | ☐ |
| 불변성 유지 | push/splice 대신 스프레드/filter/map 사용하는가? | ☐ |
| 이벤트 핸들러 | `onClick={handleClick}` 형태인가? (`onClick={handleClick()}` 아님) | ☐ |
| Server/Client 분리 | 인터랙션 없는 부분은 Server Component인가? | ☐ |
| fetch 에러 처리 | try-catch 또는 .catch()가 있는가? | ☐ |
| 배포 URL 동작 | 검색, 작성, 삭제가 모두 동작하는가? | ☐ |

---

## 흔한 AI 실수

**표 6.8** Ch6에서 AI가 자주 틀리는 패턴

| AI 실수 | 올바른 방법 | 발생 원인 |
|---------|------------|----------|
| 전체 페이지에 `"use client"` | 인터랙션 부분만 Client Component 분리 | Server/Client 구분 미인식 |
| `posts.push(newPost)` (직접 수정) | `setPosts([...posts, newPost])` | 불변성 원칙 미적용 |
| `useEffect` 의존성 배열 누락 | 사용하는 변수를 배열에 포함 | React 규칙 미준수 |
| `onClick={handleClick()}` (즉시 실행) | `onClick={handleClick}` (참조 전달) | 함수 호출과 참조 혼동 |
| Server Component에서 useState 사용 | `"use client"` 추가 필요 | 컴포넌트 유형 혼동 |
| fetch 에러 처리 없음 | try-catch 또는 .catch() 추가 | 에러 시나리오 무시 |
| useEffect 클린업 빠뜨림 | return () => cleanup() 추가 | 메모리 누수 가능 |

---

## 제출 안내 (Google Classroom)

Google Classroom의 "Ch6 과제"에 아래 두 항목을 제출한다:

```
① 배포 URL
   예: https://내프로젝트.vercel.app

② AI가 틀린 부분 1개
   예: "Copilot이 전체 page.js에 'use client'를 넣었는데,
       SearchBar만 Client Component로 분리했다."
```

---

## C파일 비교 + 코드 수정 가이드

> 제출 마감 후 C파일(모범 구현)을 확인한다. 자기 코드와 비교해 차이점을 찾고 수정한다.

**진행 순서**:

| 시간 | 활동 |
|------|------|
| 3분 | C파일 핵심 구조 확인 |
| 7분 | 학생이 자기 코드와 C파일을 비교 — 다른 부분 3개 이상 찾기 |
| 7분 | 다른 부분 중 1개를 선택하여 자기 코드 수정 |
| 3분 | 핵심 차이점 1~2개 정리 |

**비교 포인트**:
- Server/Client 분리: 모범 구현은 `"use client"`를 어떤 컴포넌트에만 사용했는가?
- 상태 관리: `useState` + 불변성 패턴(스프레드/filter)이 동일한가?
- 데이터 흐름: 서버에서 fetch vs 클라이언트에서 useEffect, 모범 구현은 어떤 방식인가?

_전체 모범 구현은 practice/chapter6/complete/ 참고_

---

