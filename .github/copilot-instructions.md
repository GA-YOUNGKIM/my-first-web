# Copilot Instructions — my-first-web

이 문서는 Copilot(또는 다른 AI)이 이 프로젝트에서 코드를 생성할 때 따라야 할 규칙입니다.

---

## 1. 기술 스택 (꼭 확인하세요)

```
Next.js: 16.2.1 (App Router만 사용)
React: 19.2.4
TypeScript: 5.x
Tailwind CSS: 4.x
shadcn/ui: 최신 버전
```

**중요**: 이 버전들은 고정입니다. 다른 버전으로 코드를 생성하면 안 됩니다.

---

## 2. Next.js App Router 사용 규칙

### ✅ 반드시 해야 할 것

#### (1) `app/` 디렉토리만 사용
- 라우트는 `app/` 폴더에만 만듭니다.
- 파일 이름이 URL이 됩니다.

**올바른 예:**
```
app/page.tsx              → /
app/posts/page.tsx        → /posts
app/posts/new/page.tsx    → /posts/new
app/posts/[id]/page.tsx   → /posts/:id
```

#### (2) `next/navigation` 사용
링크 이동이나 리다이렉트할 때는 `next/navigation`을 사용합니다.

```typescript
// ✅ 올바름
import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";

// ❌ 틀림
import { useRouter } from "next/router";  // pages router 용!
```

#### (3) Server Component가 기본
코드를 쓸 때는 기본적으로 Server Component입니다. 
상호작용(클릭, 입력 등)이 필요할 때만 `"use client"`를 추가합니다.

```typescript
// ✅ Server Component (기본)
export default async function PostPage({ params }) {
  const posts = await getPostsFromDatabase();
  return <div>{posts.map(...)}</div>;
}

// ❌ 불필요하게 Client Component 선언
"use client";
export default function PostPage() { ... }
```

#### (4) 동적 라우트는 `params` 사용
`[id]` 같은 동적 라우트는 `params`로 값을 받습니다.

```typescript
// ✅ 올바름
export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <div>Post ID: {id}</div>;
}

// ❌ 틀림 (useRouter로 받으려고 함)
"use client";
export default function PostDetailPage() {
  const router = useRouter();  // 이건 pages router 방식
  const { id } = router.query; // 작동 안 함
}
```

---

## 3. TypeScript 사용 규칙

### ✅ 타입 선언 필수

모든 함수, 컴포넌트, 변수에 타입을 붙여야 합니다.

```typescript
// ✅ 올바름
interface Post {
  id: number;
  title: string;
  content: string;
}

async function getPost(id: number): Promise<Post> {
  // ...
}

// ❌ 틀림 (타입 없음)
async function getPost(id) {
  // ...
}
```

### ✅ 함수 반환 타입 명시

```typescript
// ✅ 올바름
function handleClick(): void {
  console.log("clicked");
}

async function fetchData(): Promise<Post[]> {
  // ...
}

// ❌ 틀림 (암시적)
function handleClick() { ... }
```

### ✅ Props 타입 정의

```typescript
// ✅ 올바름
interface CardProps {
  title: string;
  description: string;
  onClick?: () => void;
}

export function MyCard({ title, description, onClick }: CardProps) {
  return <div>...</div>;
}

// ❌ 틀림 (타입 없음)
export function MyCard({ title, description, onClick }) {
  return <div>...</div>;
}
```

---

## 4. Tailwind CSS 사용 규칙

### ✅ 디자인 토큰 먼저 사용

색상, 여백, 폰트 크기 등은 **미리 정의된 토큰**을 사용합니다.
직접 색상 코드를 쓰면 안 됩니다.

```typescript
// ✅ 올바름 (토큰 기반)
<div className="bg-background text-foreground border-border">
  <button className="bg-primary text-primary-foreground hover:opacity-90">
    저장
  </button>
</div>

// ❌ 틀림 (하드코딩)
<div className="bg-white text-black border-gray-300">
  <button className="bg-blue-500 text-white hover:bg-blue-600">
    저장
  </button>
</div>
```

### ✅ 자주 쓰는 디자인 토큰

| 용도 | 토큰 |
|---|---|
| 배경 | `bg-background`, `bg-card`, `bg-muted` |
| 텍스트 | `text-foreground`, `text-muted-foreground` |
| 테두리 | `border-border`, `border-input` |
| 버튼 | `bg-primary`, `text-primary-foreground` |
| 포커스 | `ring-ring`, `focus:ring-2` |

### ✅ 반응형 클래스

모바일 먼저 생각하고, 큰 화면에서 어떻게 보일지 정합니다.

```typescript
// ✅ 올바름 (모바일 먼저)
<div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
  <button className="w-full sm:w-auto">버튼 1</button>
  <button className="w-full sm:w-auto">버튼 2</button>
</div>

// ❌ 틀림 (큰 화면만 고려)
<div className="flex gap-4">
  <button className="w-1/2">버튼 1</button>
  <button className="w-1/2">버튼 2</button>
</div>
```

---

## 5. shadcn/ui 컴포넌트 사용 규칙

### ✅ 올바른 import

반드시 `@/components/ui/` 경로를 사용합니다.

```typescript
// ✅ 올바름
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// ❌ 틀림
import { Button } from "shadcn/button";         // 경로 틀림
import { Button } from "./components/button";    // 경로 틀림
```

### ✅ 자주 쓰는 shadcn/ui 컴포넌트

#### Button (버튼)
```typescript
import { Button } from "@/components/ui/button";

// 기본 버튼
<Button>저장</Button>

// 변형
<Button variant="outline">취소</Button>
<Button variant="destructive">삭제</Button>
<Button disabled>비활성</Button>

// 크기
<Button size="sm">작은 버튼</Button>
<Button size="lg">큰 버튼</Button>
```

#### Card (카드)
```typescript
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>제목</CardTitle>
  </CardHeader>
  <CardContent>
    내용이 여기 들어갑니다.
  </CardContent>
</Card>
```

#### Input (입력칸)
```typescript
import { Input } from "@/components/ui/input";

<Input 
  type="text" 
  placeholder="이름을 입력하세요" 
  name="username"
/>

<Input 
  type="email" 
  placeholder="이메일" 
  name="email"
/>
```

#### Dialog (확인창)
```typescript
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger asChild>
    <Button>삭제</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>정말 삭제할까요?</DialogTitle>
      <DialogDescription>
        이 작업은 되돌릴 수 없습니다.
      </DialogDescription>
    </DialogHeader>
    <Button onClick={handleDelete}>삭제하기</Button>
  </DialogContent>
</Dialog>
```

---

## 6. AI가 자주 틀릴 수 있는 주의사항

### ❌ 실수 1: `next/router` 사용

**문제:**
```typescript
// ❌ 틀림
import { useRouter } from "next/router";
const router = useRouter();
router.push("/posts");
```

**해결:**
```typescript
// ✅ 올바름
import { useRouter } from "next/navigation";
const router = useRouter();
router.push("/posts");

// 또는 Server Action에서
import { redirect } from "next/navigation";
redirect("/posts");
```

---

### ❌ 실수 2: `pages/` 폴더에 파일 만들기

**문제:**
```
pages/post.tsx          ← 이거 만들면 안 됨!
pages/posts/[id].tsx    ← 이것도 안 됨!
```

**해결:**
```
app/posts/page.tsx      ← 이렇게 해야 함
app/posts/[id]/page.tsx ← 동적 라우트도 이렇게
```

---

### ❌ 실수 3: 하드코딩 색상 사용

**문제:**
```typescript
// ❌ 틀림
<button className="bg-blue-500 text-white hover:bg-blue-600">
  저장
</button>
```

**해결:**
```typescript
// ✅ 올바름
<button className="bg-primary text-primary-foreground hover:opacity-90">
  저장
</button>
```

---

### ❌ 실수 4: 불필요하게 Client Component 사용

**문제:**
```typescript
// ❌ 틀림 (상호작용이 없는데 "use client" 붙임)
"use client";
export default async function PostPage({ params }) {
  const post = await getPost(params.id);
  return <div>{post.title}</div>;  // 그냥 보기만 함
}
```

**해결:**
```typescript
// ✅ 올바름 (Server Component)
export default async function PostPage({ params }) {
  const { id } = await params;
  const post = await getPost(Number(id));
  return <div>{post.title}</div>;
}

// ❌ 클릭하거나 입력받을 때만 "use client" 추가
"use client";
export default function CommentForm() {
  const [text, setText] = useState("");  // 상태 관리 필요
  return <textarea value={text} onChange={(e) => setText(e.target.value)} />;
}
```

---

### ❌ 실수 5: import 경로 잘못됨

**문제:**
```typescript
// ❌ 틀림
import Button from "@/components/button";
import { Card } from "./components/card";
import Input from "shadcn/input";
```

**해결:**
```typescript
// ✅ 올바름
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
```

---

### ❌ 실수 6: Server Action 없이 폼 제출

**문제:**
```typescript
// ❌ 틀림 (Client 상태만 관리)
"use client";
export default function PostForm() {
  const [title, setTitle] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    // 데이터를 API로? 상태로?
  };
  return <form onSubmit={handleSubmit}>...</form>;
}
```

**해결:**
```typescript
// ✅ 올바름 (Server Action 사용)
import { createPost } from "@/app/posts/actions";

export default function PostForm() {
  return (
    <form action={createPost}>
      <input name="title" placeholder="제목" />
      <textarea name="content" placeholder="내용" />
      <button type="submit">저장</button>
    </form>
  );
}
```

---

### ❌ 실수 7: TypeScript 타입 생략

**문제:**
```typescript
// ❌ 틀림
function formatDate(date) {
  return date.toLocaleDateString();
}

export default function Component(props) {
  return <div>{props.title}</div>;
}
```

**해결:**
```typescript
// ✅ 올바름
function formatDate(date: Date): string {
  return date.toLocaleDateString();
}

interface ComponentProps {
  title: string;
}

export default function Component({ title }: ComponentProps) {
  return <div>{title}</div>;
}
```

---

## 7. 코드 요청할 때 팁

Copilot에게 코드를 요청할 때 이렇게 하면 더 정확한 코드를 받을 수 있습니다:

### ✅ 좋은 요청

```
파일: app/posts/new/page.tsx

요청:
- 글 작성 폼 페이지 만들어줘
- 제목 input, 내용 textarea 사용
- shadcn/ui의 Button, Input 컴포넌트 사용
- 서버 액션 (createPostAction)으로 제출
- Tailwind 토큰으로 스타일 (bg-background, text-foreground 등)
- 모바일 반응형 추가
```

### ❌ 안 좋은 요청

```
폼 만들어줘
```

---

## 8. 참고 자료

- [ARCHITECTURE.md](../ARCHITECTURE.md) — 전체 구조 설명
- [copilot-instructions.md](../copilot-instructions.md) — 프로젝트 설계 가이드
- [Next.js 공식 문서](https://nextjs.org/docs)
- [Tailwind CSS 공식 문서](https://tailwindcss.com/docs)
- [shadcn/ui 공식 문서](https://ui.shadcn.com)

---

이 문서가 헷갈리면 언제든 물어봐도 됩니다! 🙂