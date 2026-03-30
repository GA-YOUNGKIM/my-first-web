# Chapter 5. Next.js 기초 — A회차: 강의

> **미션**: 여러 페이지를 가진 블로그를 만든다

---

## 학습목표

1. React의 컴포넌트, JSX, Props 개념을 이해하고 AI 생성 코드에서 식별할 수 있다
2. Next.js App Router의 파일 기반 라우팅 구조를 설명할 수 있다
3. 동적 라우트를 구현하여 게시글 상세 페이지를 만들 수 있다
4. Link 컴포넌트와 useRouter로 페이지 간 내비게이션을 구현할 수 있다
5. Copilot에게 페이지 구현을 지시하고 생성된 코드를 검증할 수 있다

---

---

## 오늘의 미션 + 빠른 진단

> **오늘의 질문**: "Ch4에서 API 데이터를 가져와 카드로 표시했다. 하지만 모든 것이 하나의 페이지에 있었다. 카드를 클릭하면 상세 내용을 보여주려면 어떻게 해야 하는가?"

**빠른 진단** (1문항):

다음 코드에서 잘못된 부분은?
```jsx
export default function Home() {
  return (
    <h1>안녕</h1>
    <p>반갑습니다</p>
  );
}
```
- (A) export default가 필요 없다
- (B) JSX에서 여러 요소를 반환하려면 하나의 부모로 감싸야 한다
- (C) function 대신 화살표 함수를 써야 한다

정답: (B) — JSX는 하나의 부모 요소로 감싸야 한다. `<div>`나 `<>`(Fragment)로 감싼다.

---

## 5.1 React의 핵심 개념

Ch1에서 `create-next-app`으로 만든 프로젝트는 **React**(리액트) 위에서 동작한다. Next.js는 React를 기반으로 라우팅, 서버 렌더링, 배포를 추가한 **프레임워크**(Framework)이다. React를 이해해야 Next.js 코드를 읽을 수 있다.

### 5.1.1 선언적 UI와 컴포넌트

React는 Facebook(현 Meta)이 만든 **UI 라이브러리**이다. 핵심 아이디어는 두 가지이다.

첫째, **선언적 UI**(Declarative UI): "어떻게 그리는가"가 아니라 "무엇을 그리는가"를 기술한다.

```javascript
// 명령적 (Vanilla JavaScript) — Ch4에서 배운 방식
const h1 = document.createElement("h1");
h1.textContent = "안녕하세요";
document.body.appendChild(h1);

// 선언적 (React) — "h1에 안녕하세요를 보여줘"
function Greeting() {
  return <h1>안녕하세요</h1>;
}
```

Ch4에서 DOM을 직접 조작한 방식은 **명령적**(Imperative)이다. 단계를 일일이 지시한다. React의 선언적 방식은 **결과만 기술**하면 React가 DOM을 알아서 업데이트한다.

둘째, **컴포넌트**(Component): UI를 재사용 가능한 **함수 단위**로 분리한다. 레고 블록처럼 조립하여 화면을 구성한다.

```jsx
// 하나의 컴포넌트 = 하나의 함수
function PostCard() {
  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-bold">게시글 제목</h2>
      <p className="text-gray-600">게시글 내용...</p>
    </div>
  );
}
```


### 5.1.2 JSX 문법: 표현식, 조건부 렌더링, 리스트

**JSX**(JavaScript XML)는 JavaScript 안에서 HTML과 유사한 문법을 쓸 수 있게 하는 확장 문법이다. AI가 생성하는 React 코드를 읽을 때 가장 먼저 마주치는 것이 JSX이다.

**표 5.2** JSX 핵심 규칙

| 규칙 | HTML | JSX |
|------|------|-----|
| class 속성 | `class="btn"` | `className="btn"` |
| 스타일 | `style="color: red"` | `style={{ color: "red" }}` |
| 닫는 태그 | `<br>`, `<img>` | `<br />`, `<img />` |
| 이벤트 | `onclick="fn()"` | `onClick={fn}` |
| 최상위 요소 | 제한 없음 | **하나의 부모**로 감싸야 함 |

JSX 안에서 JavaScript 표현식은 **중괄호 `{}`**로 감싼다:

```jsx
function PostCard({ title, date }) {
  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="text-sm text-gray-500">{date}</p>
    </div>
  );
}
```

**조건부 렌더링** — 조건에 따라 다른 UI를 보여준다:

```jsx
function LoginButton({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? (
        <button className="px-4 py-2 bg-red-500 text-white rounded">로그아웃</button>
      ) : (
        <button className="px-4 py-2 bg-blue-500 text-white rounded">로그인</button>
      )}
    </div>
  );
}
```

**리스트 렌더링** — Ch4에서 배운 `map()`이 여기서 활약한다:

```jsx
function PostList({ posts }) {
  return (
    <ul className="space-y-2">
      {posts.map((post) => (
        <li key={post.id} className="p-3 border rounded">
          {post.title}
        </li>
      ))}
    </ul>
  );
}
```

리스트를 렌더링할 때 각 항목에 **`key`** 속성이 필수이다. React가 어떤 항목이 변경/추가/삭제되었는지 추적하는 데 사용한다. `key`가 없으면 콘솔에 경고가 나온다. 데이터의 고유한 `id`를 사용한다.

### 5.1.3 Props: 컴포넌트 간 데이터 전달

**Props**(Properties)는 부모 컴포넌트가 자식 컴포넌트에게 전달하는 데이터이다. 함수의 매개변수와 같다.

```jsx
// 부모가 title과 content를 전달
<PostCard title="첫 번째 글" content="안녕하세요" />

// 자식이 props로 받음 (구조 분해 할당)
function PostCard({ title, content }) {
  return (
    <div className="p-4 border rounded-lg">
      <h2 className="font-bold">{title}</h2>
      <p>{content}</p>
    </div>
  );
}
```

Props는 **읽기 전용**이다. 자식 컴포넌트가 props를 직접 수정할 수 없다. 데이터를 변경하려면 Ch6에서 배우는 **상태**(State)를 사용한다.


> [버전 고정] Next.js 14.2.21, React 18.3.1, Tailwind CSS 3.4.17, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2 기준으로 작성해줘.
> [규칙] App Router만 사용하고 next/router, pages router, 구버전 API는 사용하지 마.
> [검증] 불확실하면 현재 프로젝트 package.json 기준으로 버전을 먼저 확인하고 답해줘.
> "PostCard 컴포넌트를 만들어줘. title(문자열), content(문자열), date(문자열), author(문자열)를 props로 받고, Tailwind CSS로 카드 형태로 스타일링해줘. Next.js App Router 프로젝트."

<!-- COPILOT_VERIFY: 위 프롬프트로 Copilot이 생성하는 PostCard 컴포넌트의 props 처리 방식을 캡처해주세요 -->

**코드 읽기 포인트** — AI가 생성한 컴포넌트에서 확인할 것:
- `function 이름({ props })` 형태인가? (화살표 함수 `const 이름 = ({ props }) =>` 도 동일)
- props에 **구조 분해 할당**을 사용하는가?
- JSX에서 `{변수명}`으로 데이터를 표시하는가?
- `className`을 사용하는가? (`class`가 아닌지 확인)

---

## 5.2 Next.js App Router 구조

React만으로는 여러 페이지를 만들기 어렵다. **Next.js**가 파일 시스템 기반 **라우팅**(Routing)을 제공한다. 폴더를 만들면 URL이 된다.

### 5.2.1 app 디렉토리와 파일 기반 라우팅

Ch1에서 만든 프로젝트의 `app/` 폴더가 Next.js의 **App Router**이다. 이 폴더 안에 파일을 만들면 자동으로 URL이 생성된다.

**표 5.3** 파일 경로 → URL 매핑

| 파일 경로 | URL |
|-----------|-----|
| `app/page.js` | `/` |
| `app/about/page.js` | `/about` |
| `app/posts/page.js` | `/posts` |
| `app/posts/new/page.js` | `/posts/new` |
| `app/posts/[id]/page.js` | `/posts/1`, `/posts/2`, ... |

규칙은 단순하다:

1. `app/` 안에 **폴더**를 만든다 = URL 경로가 생긴다
2. 그 폴더 안에 **`page.js`**를 만든다 = 해당 경로의 페이지가 된다
3. `page.js`가 없는 폴더는 URL을 생성하지 않는다

> **라이브 코딩 시연**: 프로젝트에 `app/about/page.js`를 만들고 브라우저에서 `/about`에 접속하는 과정을 보여준다. "폴더를 만들면 페이지가 된다"를 직접 확인시킨다.

### 5.2.2 page.js — 페이지 정의

`page.js`는 해당 URL에서 보여줄 내용을 정의하는 파일이다. React 컴포넌트를 **`export default`**로 내보내면 된다:

```jsx
// app/posts/page.js — /posts URL의 페이지
export default function PostsPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">블로그</h1>
      <p>블로그 글 목록이 여기에 표시됩니다.</p>
    </div>
  );
}
```

> **실습 안내**: `app/posts/page.js`를 만들고 브라우저에서 `/posts` 접속 결과를 확인한다.

**코드 읽기 포인트**:
- `export default function` — 페이지 컴포넌트는 반드시 **default export**
- 함수 이름은 관례적으로 `[경로명]Page` (예: PostsPage, AboutPage)
- 하나의 `page.js`에 하나의 default export 컴포넌트

### 5.2.3 layout.js — 공통 레이아웃

`layout.js`는 여러 페이지에 **공통으로 적용되는 구조**(내비게이션 바, 푸터 등)를 정의한다. `app/layout.js`는 모든 페이지에 적용되는 **루트 레이아웃**(Root Layout)이다:

```jsx
// app/layout.js — 모든 페이지에 적용
export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <nav className="bg-gray-800 text-white p-4">
          <span className="font-bold">내 블로그</span>
        </nav>
        <main className="max-w-4xl mx-auto p-6">
          {children}
        </main>
        <footer className="text-center text-gray-500 py-4">
          &copy; 2026
        </footer>
      </body>
    </html>
  );
}
```

`{children}`은 각 페이지의 내용이 들어가는 자리이다. 레이아웃이 "틀"이고, 페이지가 "내용"이다.

### 5.2.4 loading.js, error.js — 특수 파일

**표 5.4** Next.js 특수 파일 요약

| 파일 | 역할 | 적용 범위 |
|------|------|-----------|
| `page.js` | 해당 URL의 페이지 내용 | 해당 경로만 |
| `layout.js` | 공통 구조 (네비, 푸터) | 해당 경로 + 하위 모든 경로 |
| `loading.js` | 로딩 중 표시할 UI | 해당 경로 |
| `error.js` | 에러 발생 시 표시할 UI | 해당 경로 |
| `not-found.js` | 404 페이지 | 해당 경로 |

### 5.2.4 loading.js — 로딩 UI


`loading.js`를 만들면 해당 경로의 페이지가 로딩 중일 때 자동으로 표시된다:

```jsx
// app/posts/loading.js
export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
    </div>
  );
}
```

`error.js`는 해당 경로에서 에러가 발생했을 때 보여줄 UI를 정의한다:

```jsx
// app/posts/error.js
"use client"; // error.js는 반드시 Client Component

export default function Error({ error, reset }) {
  return (
    <div className="text-center py-10">
      <h2 className="text-xl font-bold text-red-600">문제가 발생했습니다</h2>
      <p className="text-gray-600 mt-2">잠시 후 다시 시도해주세요</p>
      <button
        onClick={() => reset()}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        다시 시도
      </button>
    </div>
  );
}
```

`"use client"` 지시어는 이 컴포넌트가 **클라이언트 컴포넌트**(Client Component)임을 표시한다. Next.js App Router에서 컴포넌트는 기본적으로 **서버 컴포넌트**(Server Component)이다. `onClick` 같은 이벤트 처리가 필요하면 `"use client"`를 파일 맨 위에 추가한다. 이 개념은 Ch6에서 자세히 배운다. 지금은 "error.js에는 항상 `"use client"`를 붙인다"고 기억하면 된다.


> [버전 고정] Next.js 14.2.21, React 18.3.1, Tailwind CSS 3.4.17, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2 기준으로 작성해줘.
> [규칙] App Router만 사용하고 next/router, pages router, 구버전 API는 사용하지 마.
> [검증] 불확실하면 현재 프로젝트 package.json 기준으로 버전을 먼저 확인하고 답해줘.
> "app/layout.js를 수정해줘. 상단에 내비게이션 바(홈, 블로그 링크 포함), 하단에 푸터를 추가하고, 본문은 max-w-4xl mx-auto로 중앙 정렬해줘. Next.js 14 App Router, Tailwind CSS 사용."

<!-- COPILOT_VERIFY: 위 프롬프트로 생성된 layout.js에서 Link import 경로와 html/body 구조가 올바른지 확인해주세요 -->

---

## 5.3 동적 라우트

> **라이브 코딩 시연**: 게시글 목록/상세 페이지를 App Router로 구현하는 과정을 시연한다. 더미 데이터 배열 → 목록 페이지 → [id] 동적 라우트 → Link 내비게이션 순서로 진행한다.

블로그에서 각 게시글은 고유한 URL을 가진다: `/posts/1`, `/posts/2`, `/posts/3`... 매번 `app/posts/1/page.js`, `app/posts/2/page.js`를 만들 수는 없다. **동적 라우트**(Dynamic Route)가 이 문제를 해결한다.

### 5.3.1 [id] 폴더와 params

폴더 이름을 **대괄호**로 감싸면 동적 라우트가 된다:

```text
app/
└── posts/
    ├── page.js          → /posts (목록)
    ├── new/
    │   └── page.js      → /posts/new (작성)
    └── [id]/
        └── page.js      → /posts/1, /posts/2, ... (상세)
```

`[id]`는 URL의 일부를 **변수**로 받겠다는 의미이다. `/posts/42`에 접속하면 `id`의 값이 `"42"`가 된다.

### 5.3.2 동적 페이지 구현

동적 라우트 페이지에서 URL 파라미터를 읽는 방법:

```jsx
// app/posts/[id]/page.js
export default function PostDetailPage({ params }) {
  const { id } = params; // Next.js 14(App Router) 기준

  // 지금은 더미 데이터 사용 (Ch8에서 Supabase 연결 예정)
  const post = {
    id: id,
    title: `게시글 ${id}번`,
    content: "이것은 게시글 내용입니다.",
    author: "홍길동",
    date: "2026-02-20",
  };

  return (
    <article className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <div className="flex gap-2 text-sm text-gray-500 mt-2">
        <span>{post.author}</span>
        <span>·</span>
        <span>{post.date}</span>
      </div>
      <div className="mt-6 leading-relaxed">{post.content}</div>
    </article>
  );
}
```

> ⚠️ **이 교재 고정 버전(Next.js 14.2.21) 주의사항**: `params`는 객체로 전달된다. AI가 버전을 혼동해 `await params` 패턴을 제안하면 현재 실습 기준과 맞지 않으므로 `const { id } = params`로 맞춘다.

**코드 읽기 포인트**:
- `const { id } = params` — Ch4에서 배운 구조 분해 할당으로 id 추출
- 현재 더미 데이터 객체 → Ch8에서 Supabase `select()`로 교체 예정

**좋은 프롬프트 vs 나쁜 프롬프트**:

> **나쁜 프롬프트**
> "게시글 상세 페이지 만들어줘"


> [버전 고정] Next.js 14.2.21, React 18.3.1, Tailwind CSS 3.4.17, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2 기준으로 작성해줘.
> [규칙] App Router만 사용하고 next/router, pages router, 구버전 API는 사용하지 마.
> [검증] 불확실하면 현재 프로젝트 package.json 기준으로 버전을 먼저 확인하고 답해줘.
> "app/posts/[id]/page.js를 만들어줘. Next.js 14 App Router 사용. params에서 id를 추출해줘. 더미 게시글 데이터(id, title, content, author, date)를 표시하고 Tailwind CSS로 기사 스타일 레이아웃 적용."

나쁜 프롬프트는 어떤 폴더에 만들지, 어떤 버전의 Next.js인지, 어떤 데이터를 표시하는지 명시하지 않는다. AI는 Pages Router(구 방식)로 만들거나, params를 await하지 않을 수 있다. **copilot-instructions.md에 설치된 Next.js 버전과 App Router를 명시**해 두면 이 문제가 크게 줄어든다.

<!-- COPILOT_VERIFY: Copilot이 교재 고정 버전(Next.js 14.2.21)에 맞게 params를 객체로 처리하는지 확인해주세요 -->

---

## 5.4 내비게이션

여러 페이지를 만들었으니 페이지 사이를 이동하는 방법이 필요하다.

### 5.4.1 Link 컴포넌트

Next.js의 **`Link`** 컴포넌트는 페이지 전환을 **빠르게** 처리한다. HTML의 `<a>` 태그와 비슷하지만, 페이지 전체를 다시 로드하지 않고 필요한 부분만 업데이트한다:

```jsx
import Link from "next/link";

function PostItem({ id, title, date }) {
  return (
    <Link
      href={`/posts/${id}`}
      className="block p-4 border rounded-lg hover:bg-gray-50"
    >
      <h2 className="font-bold">{title}</h2>
      <p className="text-sm text-gray-500">{date}</p>
    </Link>
  );
}
```

AI가 `<a href="...">` 로 생성하면 **페이지 전체가 새로고침**된다. Next.js에서 앱 내부 이동에 `<a>` 태그를 직접 사용하는 것은 대표적인 AI 실수이다.

**표 5.5** Link vs a 태그

| 항목 | `<Link href="...">` | `<a href="...">` |
|------|---------------------|-------------------|
| 페이지 전환 | 클라이언트 사이드 (빠름) | 전체 새로고침 (느림) |
| 레이아웃 유지 | 유지됨 | 다시 렌더링 |
| import 필요 | `import Link from "next/link"` | 불필요 |
| 용도 | 앱 내부 페이지 이동 | 외부 URL 이동 |

### 5.4.2 useRouter와 프로그래매틱 이동

버튼 클릭이나 폼 제출 후 **코드로 페이지를 이동**해야 할 때는 **`useRouter`**를 사용한다:

```jsx
"use client"; // useRouter는 Client Component에서만 사용

import { useRouter } from "next/navigation";

function CreatePostButton() {
  const router = useRouter();

  function handleClick() {
    router.push("/posts/new"); // 게시글 작성 페이지로 이동
  }

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      새 글 작성
    </button>
  );
}
```

> **AI 주의사항**: `useRouter`는 **`next/navigation`**에서 가져온다. AI가 `next/router`에서 가져오면 에러가 난다. 이것은 Next.js가 Pages Router(구버전)에서 App Router(현재)로 바뀌면서 생긴 **버전 불일치** 문제이다. copilot-instructions.md에 "App Router 사용, next/router 금지"를 명시하자.

**표 5.6** Link vs useRouter 사용 시점

| 상황 | 사용할 것 | 이유 |
|------|-----------|------|
| 텍스트/카드 클릭으로 이동 | `<Link>` | SEO 친화적, 간결함 |
| 버튼 클릭 후 이동 | `useRouter` | 이동 전 로직 실행 가능 |
| 폼 제출 후 이동 | `useRouter` | 데이터 저장 후 이동 |
| 조건부 이동 (로그인 확인 등) | `useRouter` | 조건 판단 후 이동 |

### 5.4.3 활성 링크 스타일링

현재 페이지에 해당하는 내비게이션 링크를 강조하려면 **`usePathname`**을 사용한다:

```jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function NavLink({ href, children }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded ${
        isActive
          ? "bg-blue-500 text-white"
          : "text-gray-300 hover:bg-gray-700"
      }`}
    >
      {children}
    </Link>
  );
}
```

`usePathname`도 `next/navigation`에서 가져온다. `useRouter`, `usePathname` 모두 `"use client"` 파일에서만 사용할 수 있다.

> **실습 안내**: `app/layout.js`의 내비게이션 바에 NavLink 컴포넌트를 적용하고, 페이지 이동 시 활성 링크 변화를 확인한다. NavLink는 `components/NavLink.js`로 분리한다.

---

## 핵심 정리 + B회차 과제 스펙

### 이번 시간 핵심 3가지

1. **React 컴포넌트**는 UI를 함수로 분리한 것이다. Props로 데이터를 전달하고, JSX로 화면을 기술한다
2. **App Router**는 폴더 구조가 곧 URL 구조이다. `[id]`로 동적 라우트를 만든다
3. **내비게이션**은 Link(선언적)와 useRouter(프로그래매틱)를 사용한다. 반드시 `next/navigation`에서 import한다

### B회차 과제 스펙

**블로그 글 목록/상세/작성 페이지 구현 + 배포**:
1. 목록 페이지 (`/posts`) — 더미 데이터 블로그 글 카드 리스트, 클릭 시 상세로 이동
2. 상세 페이지 (`/posts/[id]`) — 해당 블로그 글 내용, 목록으로 돌아가기 링크
3. 작성 페이지 (`/posts/new`) — 제목/내용 입력 폼 (저장 기능은 Ch8에서)
4. 공통 레이아웃 — 내비게이션 바에 홈/블로그/새글 링크
5. git push → Vercel 배포

### Skills 활용 가이드 (B회차 적용)

- `nextjs-basic-check`: `app/` 경로 구조, 동적 라우트(`[id]`), `next/navigation` 사용 여부를 점검한다.
- 권장 타이밍: 3개 페이지 구현 완료 후, 제출 전 최종 점검.

**스타터 코드**: `practice/chapter5/starter/` — 기본 App Router 구조 + 더미 데이터 배열 + 목록 페이지 뼈대가 준비되어 있다. B회차에서 이 코드를 기반으로 시작한다.

---

## Exit ticket

다음 코드에서 잘못된 부분을 모두 찾아라:

```jsx
import { useRouter } from "next/router";

export default function PostDetail({ params }) {
  const { id } = params;

  return (
    <div>
      <h1>게시글 {id}</h1>
      <a href="/posts">목록으로</a>
    </div>
  );
}
```

정답: (1) `next/router` → `next/navigation`, (2) `params`는 Promise이므로 `await` 필요 + 함수에 `async` 추가, (3) `<a href="/posts">` → `<Link href="/posts">` (내부 이동)

---

