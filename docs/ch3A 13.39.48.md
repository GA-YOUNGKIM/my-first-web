# Chapter 3. HTML 시맨틱과 Tailwind CSS — A회차: 강의

> **미션**: Copilot과 함께 블로그 레이아웃을 마크업하고 스타일링한다

---

## 학습목표

1. HTML5 시맨틱 태그의 의미를 이해하고 올바르게 사용할 수 있다
2. Tailwind CSS의 유틸리티 클래스를 읽고 해석할 수 있다
3. Flexbox와 Grid로 레이아웃을 구성할 수 있다
4. 반응형 디자인의 원리를 이해하고 브레이크포인트를 활용할 수 있다
5. AI가 생성한 HTML/CSS 코드에서 흔한 실수를 발견할 수 있다

---

---

## 오늘의 미션 + 빠른 진단

> **오늘의 질문**: "AI가 만든 웹페이지에서 `<div>`만 잔뜩 쓰인 코드와 `<header>`, `<nav>`, `<main>`을 쓴 코드, 무엇이 다른가?"

**빠른 진단** (1문항):

다음 중 올바른 HTML heading 계층은?
- (A) `<h1>` → `<h3>` → `<h2>`
- (B) `<h1>` → `<h2>` → `<h3>`
- (C) `<h2>` → `<h1>` → `<h3>`

정답: (B) — heading은 반드시 순서대로 내려가야 한다.

---

## 3.1 HTML5 문서 구조

### 3.1.1 DOCTYPE, html, head, body

모든 HTML 문서는 다음 기본 구조를 따른다.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>블로그</title>
</head>
<body>
  <!-- 페이지 내용 -->
</body>
</html>
```

**표 3.2** HTML5 기본 태그

| 태그 | 역할 |
|------|------|
| `<!DOCTYPE html>` | "이 문서는 HTML5이다"라고 브라우저에 선언 |
| `<html lang="ko">` | 문서의 언어를 지정 (검색 엔진, 스크린 리더가 활용) |
| `<head>` | 메타 정보 (브라우저에 보이지 않는 설정) |
| `<body>` | 실제 화면에 보이는 내용 |

Next.js에서는 이 구조를 직접 작성하지 않는다. `app/layout.js`가 `<html>`과 `<body>`를 자동으로 감싸준다. 그러나 HTML의 기본 구조를 아는 것은 AI 출력을 검증할 때 필수이다.

### 3.1.2 메타 태그와 SEO 기초

`<head>` 안에 들어가는 메타 태그는 브라우저와 검색 엔진에 정보를 전달한다.

**표 3.3** 주요 메타 태그

| 메타 태그 | 역할 | 예시 |
|----------|------|------|
| `charset` | 문자 인코딩 | `<meta charset="UTF-8">` |
| `viewport` | 모바일 화면 최적화 | `<meta name="viewport" content="width=device-width, initial-scale=1.0">` |
| `description` | 검색 결과 미리보기 | `<meta name="description" content="블로그 서비스">` |

`viewport` 메타 태그가 없으면 모바일에서 데스크톱 화면이 축소되어 보인다. Next.js는 이를 자동 처리하지만, AI가 순수 HTML을 생성할 때 누락하는 경우가 있으므로 확인이 필요하다.

---

## 3.2 시맨틱 태그의 의미와 활용

### 3.2.1 div vs 시맨틱 태그

`<div>`는 "아무 의미 없는 상자"이다. 반면 **시맨틱 태그**(Semantic Tag)는 "이 영역이 무엇인지" 알려주는 이름표가 붙은 상자이다.

시맨틱 태그를 써야 하는 3가지 이유:
1. **검색 엔진**이 페이지 구조를 이해한다 (SEO 향상)
2. **스크린 리더**가 시각 장애 사용자에게 구조를 안내한다 (접근성)
3. **AI(Copilot)**가 코드를 수정할 때 영역의 목적을 파악한다


### 3.2.2 주요 시맨틱 태그 — 블로그 구조로 설명

**표 3.4** 시맨틱 태그와 용도

| 태그 | 역할 | 블로그 예시 |
|------|------|-----------|
| `<header>` | 머리말 영역 | 사이트 제목, 로고 |
| `<nav>` | 내비게이션 | 메뉴 링크 |
| `<main>` | 핵심 콘텐츠 (1페이지 1개) | 게시글 목록 |
| `<section>` | 주제별 그룹 | 최신글, 인기글 |
| `<article>` | 독립적 콘텐츠 | 게시글 1개 |
| `<aside>` | 보조 정보 | 사이드바, 카테고리 |
| `<footer>` | 바닥글 영역 | 저작권, 연락처 |

블로그을 시맨틱 태그로 구성하면 다음과 같다:

```
┌─────────────────────────────┐
│         <header>            │
│  사이트 제목 + <nav> 메뉴    │
├─────────────────────────────┤
│ <main>          │ <aside>   │
│  <article>      │ 인기글    │
│  <article>      │ 카테고리  │
│  <article>      │           │
├─────────────────────────────┤
│         <footer>            │
└─────────────────────────────┘
```

### 3.2.3 올바른 heading 계층 구조

heading 태그(`<h1>`~`<h6>`)는 반드시 순서대로 사용한다. 한 페이지에 `<h1>`은 1개만 쓴다.

```html
<!-- ✅ 올바른 구조 -->
<h1>블로그</h1>
  <h2>최신 게시글</h2>
    <h3>React 18 새 기능</h3>
    <h3>Tailwind CSS 4 변경점</h3>

<!-- ❌ 잘못된 구조 — h1 다음에 h3가 바로 온다 -->
<h1>블로그</h1>
  <h3>최신 게시글</h3>
```

> **⚠️ AI 주의사항**: Copilot은 heading 계층을 무시하고 시각적 크기만 맞추려는 경향이 있다. `<h1>` 다음에 `<h3>`가 오면 반드시 수정한다.

---

## 3.3 폼 요소와 접근성

### 3.3.1 input, select, textarea

블로그에서 폼은 "글 작성", "로그인", "검색" 등에 사용된다.

**표 3.5** 주요 폼 요소

| 요소 | 용도 | 예시 |
|------|------|------|
| `<input type="text">` | 한 줄 텍스트 | 제목 입력 |
| `<input type="email">` | 이메일 (자동 검증) | 로그인 |
| `<input type="password">` | 비밀번호 (마스킹) | 로그인 |
| `<textarea>` | 여러 줄 텍스트 | 게시글 본문 |
| `<select>` | 드롭다운 선택 | 카테고리 선택 |
| `<button>` | 제출/클릭 | 등록 버튼 |

### 3.3.2 label과 접근성

모든 `<input>`에는 반드시 `<label>`을 연결해야 한다. label을 클릭하면 해당 input에 포커스가 이동하여 사용자 경험이 향상된다.

```jsx
{/* ✅ 올바른 연결 — JSX에서는 htmlFor 사용 */}
<label htmlFor="title">제목</label>
<input id="title" type="text" />

{/* ✅ label로 input을 감싸는 방식도 가능 */}
<label>
  제목
  <input type="text" />
</label>
```

### 3.3.3 AI가 자주 틀리는 HTML 패턴

**표 3.6** AI가 자주 틀리는 HTML 패턴

| AI 실수 | 올바른 코드 | 원인 |
|---------|-----------|------|
| `<h1>` → `<h3>` (h2 건너뜀) | `<h1>` → `<h2>` → `<h3>` | 시각적 크기만 맞추려 함 |
| `<input>` 에 label 없음 | `<label htmlFor="x">` + `<input id="x">` | 접근성 미고려 |
| `<label for="x">` | `<label htmlFor="x">` | JSX에서는 `htmlFor` 사용 |
| `<div class="...">` | `<div className="...">` | JSX에서는 `className` 사용 |
| `<img src="..." >` | `<img src="..." />` | JSX에서 셀프 클로징 필수 |


---

## 3.4 CSS의 변화와 Tailwind CSS

### 3.4.1 CSS는 어떻게 발전해왔는가

**표 3.7** CSS 발전 흐름

| 시대 | 방식 | 특징 |
|------|------|------|
| 초기 | 인라인 style, 별도 .css | 단순하지만 유지보수 어려움 |
| 2010년대 초 | Sass, Less (전처리기) | 변수, 중첩 등 프로그래밍 기능 추가 |
| 2010년대 중 | CSS Modules, styled-components | 컴포넌트별 스타일 격리 |
| **2020년대** | **Tailwind CSS (유틸리티 퍼스트)** | HTML에 직접 스타일, AI와 궁합 최고 |

Tailwind는 AI와 궁합이 좋다. 별도 CSS 파일 없이 HTML 안에서 스타일이 완결되므로, Copilot이 한 파일만 보고도 전체 디자인을 파악할 수 있다.


### 3.4.2 유틸리티 퍼스트 CSS란

전통 CSS는 "클래스 이름을 정하고, CSS 파일에서 스타일을 정의"하는 방식이다. Tailwind는 반대로 "이미 정의된 유틸리티 클래스를 HTML에 직접 붙이는" 방식이다.

```html
<!-- 전통 CSS: 클래스 이름을 만들고 별도 파일에서 정의 -->
<div class="card">제목</div>
<!-- card { padding: 16px; background: white; border-radius: 8px; } -->

<!-- Tailwind: 유틸리티 클래스를 직접 사용 -->
<div class="p-4 bg-white rounded-lg">제목</div>
```

Tailwind를 쓰는 이유:
1. CSS 파일을 왔다 갔다 하지 않아도 된다
2. 클래스 이름을 고민할 필요가 없다
3. AI가 한 파일에서 구조와 스타일을 동시에 생성한다
4. 다른 사람의 코드를 읽을 때 별도 CSS를 찾지 않아도 된다

### 3.4.3 Tailwind 클래스 읽는 법

Tailwind 클래스는 `속성-값` 패턴을 따른다. 처음에는 암호처럼 보이지만, 규칙을 알면 즉시 읽을 수 있다.

**표 3.8** Tailwind 클래스 읽는 법

| 클래스 | 읽는 법 | CSS 변환 |
|--------|--------|---------|
| `p-4` | padding 4단위 | `padding: 16px` |
| `px-6` | padding 좌우 6단위 | `padding-left: 24px; padding-right: 24px` |
| `mt-2` | margin 위 2단위 | `margin-top: 8px` |
| `text-lg` | 텍스트 크게 | `font-size: 18px` |
| `font-bold` | 글씨 굵게 | `font-weight: 700` |
| `bg-blue-500` | 배경 파란색 500단계 | `background: #3b82f6` |
| `text-white` | 글씨 흰색 | `color: white` |
| `rounded-lg` | 둥근 모서리 크게 | `border-radius: 8px` |
| `w-full` | 가로 100% | `width: 100%` |
| `hidden` | 숨기기 | `display: none` |

**간격 숫자 체계**: 1단위 = 4px

**표 3.9** 간격 시스템

| 클래스 | 크기 |
|--------|------|
| `p-1` | 4px |
| `p-2` | 8px |
| `p-4` | 16px |
| `p-6` | 24px |
| `p-8` | 32px |

**색상 체계**: `{색상}-{단계}` (50이 가장 밝고 900이 가장 어둡다)
- `bg-blue-100` → 아주 연한 파란색
- `bg-blue-500` → 중간 파란색
- `bg-blue-900` → 아주 진한 파란색

### 3.4.4 Tailwind CSS IntelliSense 확장

VS Code에서 **Tailwind CSS IntelliSense** 확장을 설치하면 클래스명 자동완성과 미리보기가 지원된다.


<!-- COPILOT_VERIFY: Tailwind CSS IntelliSense 확장 설치 후 자동완성 화면을 캡처해주세요 -->

---

## 3.5 레이아웃과 반응형

> **라이브 코딩 시연**: 블로그 레이아웃을 Tailwind CSS로 처음부터 구현한다. 내비게이션 바 → 카드 리스트 → 반응형 적용 순서로 진행한다.

### 3.5.1 Flexbox: flex, justify, items, gap

Flexbox는 **한 줄로 요소를 배치**할 때 사용한다. 내비게이션 바가 대표적이다.

**표 3.10** Flexbox 주요 클래스

| 클래스 | 역할 |
|--------|------|
| `flex` | Flexbox 활성화 |
| `flex-col` | 세로 방향 배치 |
| `justify-between` | 양 끝 정렬 (사이 균등) |
| `justify-center` | 가운데 정렬 |
| `items-center` | 세로축 가운데 정렬 |
| `gap-4` | 요소 사이 간격 16px |

내비게이션 바 예시:

```jsx
<nav className="flex justify-between items-center p-4 bg-white shadow">
  <h1 className="text-xl font-bold">블로그</h1>
  <div className="flex gap-4">
    <a href="/" className="hover:text-blue-500">홈</a>
    <a href="/login" className="hover:text-blue-500">로그인</a>
  </div>
</nav>
```


### 3.5.2 Grid: grid, grid-cols, col-span

Grid는 **격자 형태로 요소를 배치**할 때 사용한다. 게시글 카드 목록이 대표적이다.

**표 3.11** Grid 주요 클래스

| 클래스 | 역할 |
|--------|------|
| `grid` | Grid 활성화 |
| `grid-cols-2` | 2열 격자 |
| `grid-cols-3` | 3열 격자 |
| `col-span-2` | 2칸 차지 |
| `gap-4` | 격자 사이 간격 16px |

### 3.5.3 반응형 디자인: sm, md, lg 브레이크포인트

Tailwind는 **모바일 우선**(Mobile First) 원칙을 따른다. 기본 스타일이 모바일이고, 화면이 커질수록 스타일을 추가한다.

**표 3.12** 브레이크포인트

| 접두어 | 최소 너비 | 대상 기기 |
|--------|----------|----------|
| (없음) | 0px | 모바일 (기본) |
| `sm:` | 640px | 큰 모바일 |
| `md:` | 768px | 태블릿 |
| `lg:` | 1024px | 데스크톱 |
| `xl:` | 1280px | 큰 데스크톱 |

> **라이브 코딩 시연**: 브라우저 DevTools에서 디바이스 모드(Ctrl+Shift+M, macOS: Cmd+Shift+M)를 켜고 화면 크기를 조절하며 반응형 변화를 보여준다.

반응형 예시 — 모바일 1열, 태블릿 2열, 데스크톱 3열:

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 카드들 */}
</div>
```

### 3.5.4 실전 패턴: 내비게이션 바, 카드 리스트

**게시글 카드 컴포넌트**:

```jsx
<article className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
  <h3 className="text-lg font-bold mb-2">게시글 제목</h3>
  <p className="text-gray-600 mb-4">게시글 내용 미리보기...</p>
  <div className="flex justify-between text-sm text-gray-400">
    <span>작성자</span>
    <span>2026.02.25</span>
  </div>
</article>
```

**반응형 카드 리스트**:

```jsx
<main className="max-w-4xl mx-auto p-4">
  <h2 className="text-2xl font-bold mb-6">최신 게시글</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* 카드 반복 */}
  </div>
</main>
```

_전체 프로젝트는 practice/chapter3/ 참고_

<!-- COPILOT_VERIFY: 위 카드 리스트 코드를 Copilot에 입력하고, 반응형이 올바르게 동작하는지 DevTools에서 확인해주세요 -->

---

## 핵심 정리 + B회차 과제 스펙

### 이번 시간 핵심 3가지

1. **시맨틱 태그**로 페이지 구조를 명확히 한다 (header, nav, main, article, footer)
2. **Tailwind 클래스**는 `속성-값` 패턴으로 읽는다 (p-4 = padding 16px)
3. **반응형**은 모바일 우선 — `md:`, `lg:` 접두어로 큰 화면 스타일을 추가한다

### B회차 과제 스펙

**블로그 메인 페이지 만들기**:
1. 내비게이션 바: 사이트 제목 + 메뉴 링크
2. 게시글 목록: 카드 형태, 최소 3개의 더미 게시글
3. 반응형: 모바일 1열, 데스크톱 2열 이상
4. 시맨틱 태그: header, nav, main, article, footer 사용
5. Tailwind CSS로 스타일링

**스타터 코드**: `practice/chapter3/starter/` — A회차 시연 결과물이 준비되어 있다. B회차에서 이 코드를 기반으로 시작한다.

---

## Exit ticket

다음 코드에서 잘못된 부분을 찾아라:

```jsx
<div>
  <h1>블로그</h1>
  <div>
    <h3>최신 게시글</h3>
    <div class="p-4">
      <label for="search">검색</label>
      <input id="search" type="text" />
    </div>
  </div>
</div>
```

정답: (1) `<div>` 대신 시맨틱 태그(`<header>`, `<main>`) 사용 필요, (2) h1→h3 계층 오류 (h2가 빠짐), (3) JSX에서 `class` → `className`, (4) JSX에서 `for` → `htmlFor`

---

