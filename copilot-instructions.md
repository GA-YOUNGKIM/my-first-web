# Copilot Instructions — 블로그 프로젝트 설계 가이드

## 1. 이 블로그의 목표

- **독자 입장**: 글을 쉽게 찾고, 편하게 읽을 수 있는 공간
- **작성자 입장**: 로그인 후 글을 작성하고, 수정하고, 삭제할 수 있는 공간
- **기술 관점**: Next.js App Router 기반으로 확장 가능한 구조 유지

한 마디로: "누구나 쉽게 글을 읽고 관리할 수 있는 개인 블로그"

---

## 2. 주요 사용자

### 독자 (방문자)
- 글 목록을 본다
- 특정 글을 읽는다
- 필요하면 글의 작성 날짜와 제목으로 찾는다

### 작성자 (블로그 운영자)
- 로그인해서 들어온다
- 글을 새로 쓴다
- 이미 쓴 글을 수정한다
- 글을 삭제한다

---

## 3. 꼭 필요한 페이지

| 페이지 | URL | 설명 | 사용자 |
|---|---|---|---|
| **홈** | `/` | 블로그 소개, 진입 지점 | 누구나 |
| **글 목록** | `/posts` | 모든 글 한눈에 보기 | 누구나 |
| **글 상세** | `/posts/[id]` | 한 글을 크게 읽기, 수정/삭제 | 누구나 (수정/삭제는 작성자만) |
| **글 쓰기** | `/posts/new` | 새 글 작성하기 | 로그인한 작성자만 |
| **글 수정** | `/posts/[id]/edit` | 이미 쓴 글 고쳐 쓰기 | 로그인한 작성자만 |
| **로그인** | `/login` | 이메일과 비밀번호로 들어오기 | 작성자만 |
| **회원가입** | `/signup` | 새 계정 만들기 | 누구나 |

---

## 4. 디자인 분위기

### 색상 (현재)
- **배경**: 흰색 계열 (밝고 깨끗함)
- **텍스트**: 어두운 회색 (읽기 편함)
- **강조색**: 파란색 계열 (버튼, 링크 등)
- **구분선**: 연한 회색 (요소 구분)

### 레이아웃
- **모바일 먼저**: 휴대폰에서도 잘 보임
- **심플함**: 불필요한 장식 없음
- **여백**: 글을 읽기 좋게 충분한 공간 확보

### 컴포넌트
- **Button**: 행동을 유도하는 버튼 (저장, 삭제, 이동 등)
- **Card**: 정보를 담는 상자 (글 카드, 설명 박스 등)
- **Input**: 사용자가 입력하는 칸 (글 제목, 비밀번호 등)
- **Dialog**: 중요한 확인 창 (정말 삭제할까요? 등)

---

## 5. Copilot에게 코드를 요청할 때 지켜야 할 기준

### ✅ 꼭 지켜야 할 것 (반드시 확인)

1. **App Router만 사용**
   - `next/router` 금지 ❌
   - `pages/` 폴더 금지 ❌
   - `app/` 폴더 사용 ⭕

2. **현재 버전 명시**
   - Next.js: 16.2.1
   - React: 19.2.4
   - Tailwind CSS: 4.x
   - shadcn/ui: 컴포넌트 import 경로는 `@/components/ui/`

3. **Server Component 기본**
   - `"use client"`는 상호작용이 꼭 필요할 때만 사용
   - 폼 제출, 서버 액션은 `"use server"` 마크로 사용

4. **UI는 shadcn/ui 우선**
   - Button, Card, Input, Dialog 등을 먼저 사용
   - 커스텀 스타일은 필요할 때만

5. **색상은 토큰 기반**
   - 하드코딩 금지: `bg-blue-500` ❌
   - 토큰 사용: `bg-primary`, `text-foreground` ⭕

### 📋 코드 요청 템플릿 (예시)

```
현재 버전: Next.js 16.2.1, React 19.2.4, Tailwind CSS 4

[파일 경로]
app/posts/new/page.tsx

[요청 사항]
글 작성 페이지를 만들어줘.
- 제목 입력칸 (title)
- 내용 입력칸 (content, 여러 줄)
- 저장 버튼 (form action 사용)
- 취소 버튼 (목록으로 돌아가기)
- shadcn/ui의 Card, Input, Button, Textarea 사용
- 색상은 디자인 토큰 (토큰 이름 없으면 `bg-card`, `text-foreground` 등)
```

### 🚫 하면 안 되는 것

| 할 때 | 문제점 |
|---|---|
| `import { useRouter } from 'next/router'` | App Router가 아님 |
| `import Button from './Button'` (직접 import) | `@/components/ui/` 경로 아님 |
| `className="bg-blue-500 text-red-700"` | 토큰 기반 아님 |
| Client Component에서 데이터베이스 직접 접근 | 보안 문제 |
| `<form onSubmit={...}>` | Server Action 미사용 |

---

## 6. 데이터 구조 (간단히)

### 글 (Post)
```
{
  id: 숫자,
  title: "제목",
  content: "내용",
  author: "작성자 이름",
  date: "2026-04-29"
}
```

### 사용자 (User) — 준비 중
```
{
  id: UUID,
  email: "user@example.com",
  password: "해시화됨",
  name: "사용자 이름"
}
```

---

## 7. 파일 구조 (현재)

```
my-first-web/
├── app/
│   ├── layout.tsx         ← 전체 레이아웃 (헤더, 푸터)
│   ├── page.tsx           ← 홈 페이지 (/)
│   ├── globals.css        ← 전역 스타일
│   ├── posts/
│   │   ├── page.tsx       ← 글 목록 (/posts)
│   │   ├── new/
│   │   │   └── page.tsx   ← 글 쓰기 (/posts/new)
│   │   ├── [id]/
│   │   │   ├── page.tsx   ← 글 상세 (/posts/[id])
│   │   │   └── edit/
│   │   │       └── page.tsx ← 글 수정 (/posts/[id]/edit)
│   │   └── actions.ts     ← 서버 액션 (생성, 수정, 삭제)
│   ├── login/
│   │   └── page.tsx       ← 로그인 (/login)
│   ├── signup/
│   │   └── page.tsx       ← 회원가입 (/signup)
│   └── auth/
│       └── actions.ts     ← 인증 서버 액션
├── components/
│   ├── ui/                ← shadcn/ui 컴포넌트
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   └── sketch-home.tsx    ← 홈 페이지 컴포넌트
├── lib/
│   ├── post-repository.ts ← 글 저장소 (데이터 접근)
│   ├── posts.ts           ← 글 기본 데이터
│   ├── supabase/          ← Supabase 클라이언트 (준비 중)
│   │   ├── client.ts
│   │   └── server.ts
│   └── utils.ts
├── public/                ← 이미지, 폰트 등
├── data/
│   └── posts.json         ← 현재 글 저장 (임시)
└── docs/                  ← 학습 자료
```

---

## 8. 개발 패턴 (자주 쓰는 코드 형태)

### 서버 액션 (Server Action)
```typescript
"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createPost(formData: FormData) {
  const title = formData.get("title");
  // ... 처리
  revalidatePath("/posts");  // 캐시 새로고침
  redirect("/posts");         // 리다이렉트
}
```

### 페이지 (Server Component)
```typescript
import { getPostById } from "@/lib/post-repository";
import { Card } from "@/components/ui/card";

export default async function PostPage({ params }) {
  const { id } = await params;
  const post = await getPostById(Number(id));
  
  return (
    <Card>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </Card>
  );
}
```

### UI 폼
```typescript
import { createPostAction } from "@/app/posts/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NewPostPage() {
  return (
    <form action={createPostAction}>
      <Input name="title" placeholder="제목" />
      <textarea name="content" placeholder="내용" />
      <Button type="submit">저장</Button>
    </form>
  );
}
```

---

## 9. 자주 하는 실수와 해결

| 실수 | 원인 | 해결 |
|---|---|---|
| "페이지가 자꾸 깜빡여요" | Client에서 상태 관리 | Server Action 사용 |
| "버튼을 눌러도 반응 없어요" | form 태그 또는 action 빠짐 | `<form action={서버액션}>` 확인 |
| "색상이 이상해요" | 토큰 대신 하드코딩 | `bg-card`, `text-foreground` 등 토큰 사용 |
| "로그인 후 정보가 안 보여요" | 세션 확인 미흡 | Supabase 서버 클라이언트로 세션 확인 |
| "모바일에서 깨져요" | 반응형 클래스 빠짐 | `md:`, `sm:` 등 반응형 프리픽스 추가 |

---

## 10. 다음 단계 (미리 알아두기)

- **Ch8**: Supabase 프로젝트 생성 → 환경변수 설정
- **Ch9~10**: 로그인 후 글 쓰기, 자신의 글만 보이기
- **Ch11~12**: 댓글 기능, 마이페이지 추가

---

이 문서는 초보자도 빠르게 이해할 수 있도록 **의도적으로 단순**하게 작성했습니다.
더 자세한 내용은 `ARCHITECTURE.md`를 참고하세요.
