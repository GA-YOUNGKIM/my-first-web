# Chapter 4. JavaScript 핵심 — A회차: 강의

> **미션**: JavaScript로 페이지에 생명을 불어넣는다

---

## 학습목표

1. 변수(let, const)와 자료형을 이해하고 코드를 읽을 수 있다
2. 함수 선언, 화살표 함수를 이해하고 AI 생성 코드에서 구분할 수 있다
3. 배열 메서드(map, filter, find)를 읽고 동작을 설명할 수 있다
4. async/await와 fetch를 이해하고 API 호출 코드를 검증할 수 있다
5. import/export 모듈 시스템을 이해할 수 있다

---

---

## 오늘의 미션 + 빠른 진단

> **오늘의 질문**: "Ch3에서 만든 블로그는 정적이다. 버튼을 눌러도 아무 일도 일어나지 않고, 데이터도 코드에 직접 박혀 있다. JavaScript를 배우면 무엇이 달라지는가?"

**빠른 진단** (1문항):

다음 코드의 실행 결과는?
```javascript
const x = 10;
x = 20;
```
- (A) x는 20이 된다
- (B) 에러가 발생한다
- (C) x는 10 그대로이다

정답: (B) — `const`는 재할당할 수 없다. 값을 바꾸려면 `let`을 사용한다.

---

## 4.1 변수, 자료형, 연산자

JavaScript는 웹 페이지에 **동작**을 부여하는 언어이다. HTML이 뼈대, CSS가 옷이라면 JavaScript는 근육이다. 버튼을 클릭하면 무언가가 일어나고, 서버에서 데이터를 가져와 화면에 보여주는 일을 모두 JavaScript가 담당한다.

### 4.1.1 let, const (var를 쓰지 않는 이유)

JavaScript에서 데이터를 담는 그릇을 **변수**(Variable)라 한다. 변수를 선언하는 키워드는 세 가지이지만, 실전에서는 두 가지만 사용한다:

```javascript
const name = "홍길동";    // 바뀌지 않는 값 → const
let count = 0;            // 바뀌는 값 → let
count = count + 1;        // let은 재할당 가능

// var는 사용하지 않는다
var oldStyle = "레거시";  // ❌ 호이스팅 문제 발생
```

**표 4.2** 변수 선언 키워드

| 키워드 | 재할당 | 스코프 | 사용 여부 |
|--------|:------:|--------|:---------:|
| `const` | 불가 | 블록 | **기본 사용** |
| `let` | 가능 | 블록 | 재할당 필요 시 |
| `var` | 가능 | 함수 | **사용 금지** |

규칙은 간단하다: **기본은 `const`, 값이 바뀌어야 하면 `let`**. AI가 `var`로 코드를 생성하면 `const` 또는 `let`으로 수정한다.

> AI가 `var`를 사용하는 것은 오래된 학습 데이터의 영향이다. 2015년(ES6) 이후 `var`는 레거시 코드에서만 볼 수 있다.

### 4.1.2 문자열, 숫자, 불리언, null, undefined

JavaScript의 기본 **자료형**(Data Type):

**표 4.3** JavaScript 자료형

| 자료형 | 예시 | 설명 |
|--------|------|------|
| 문자열(String) | `"안녕"`, `'hello'` | 텍스트 데이터 |
| 숫자(Number) | `42`, `3.14` | 정수와 소수 모두 Number |
| 불리언(Boolean) | `true`, `false` | 참/거짓 |
| null | `null` | "값이 없음"을 의도적으로 표현 |
| undefined | `undefined` | 값이 할당되지 않은 상태 |
| 객체(Object) | `{ name: "홍길동" }` | 여러 값을 묶은 구조 (4.3절) |
| 배열(Array) | `[1, 2, 3]` | 순서 있는 값의 목록 (4.3절) |

`null`과 `undefined`의 차이:
- `null`: 개발자가 "비어있다"고 명시한 것 (예: 로그아웃 후 `user = null`)
- `undefined`: 아직 값을 넣지 않은 것 (예: `let x;`이면 x는 undefined)

### 4.1.3 템플릿 리터럴

문자열 안에 변수를 넣을 때 **템플릿 리터럴**(Template Literal)을 사용한다. 백틱(`` ` ``)으로 감싸고 `${}` 안에 변수를 넣는다:

```javascript
const name = "홍길동";
const age = 20;

// 템플릿 리터럴 (권장)
const greeting = `안녕하세요, ${name}님! ${age}세이시군요.`;

// 문자열 연결 (비권장 — 읽기 어렵다)
const greeting2 = "안녕하세요, " + name + "님! " + age + "세이시군요.";
```

React(Next.js)에서 JSX 안에 JavaScript 값을 넣을 때도 `{}`를 사용하므로, 이 문법에 익숙해져야 한다.

---

## 4.2 함수

**함수**(Function)는 특정 작업을 수행하는 코드 묶음이다. 한 번 정의하면 이름을 불러 반복 사용할 수 있다.

### 4.2.1 함수 선언과 표현식

```javascript
// 함수 선언 (Function Declaration)
function greet(name) {
  return `안녕하세요, ${name}님!`;
}
```

```javascript
// 함수 표현식 (Function Expression) — 같은 동작을 다른 문법으로 작성
const greetExpression = function(name) {
  return `안녕하세요, ${name}님!`;
};
```

두 방식의 차이는 미묘하지만, AI가 생성하는 코드에서 두 형태 모두 볼 수 있으므로 읽을 수 있어야 한다.

### 4.2.2 화살표 함수

**화살표 함수**(Arrow Function)는 함수를 더 짧게 쓰는 현대적 문법이다. Next.js 코드에서 가장 많이 보게 될 형태이다:

```javascript
// 일반 함수
function add(a, b) {
  return a + b;
}
```

```javascript
// 화살표 함수 (같은 동작)
const addArrow = (a, b) => {
  return a + b;
};

// 한 줄이면 중괄호와 return 생략 가능
const addShort = (a, b) => a + b;

// 매개변수가 하나면 괄호도 생략 가능
const double = n => n * 2;
```

**표 4.4** 함수 형태 비교

| 형태 | 문법 | 주로 쓰이는 곳 |
|------|------|---------------|
| 함수 선언 | `function 이름() {}` | 독립적인 함수 정의 |
| 화살표 함수 | `const 이름 = () => {}` | 콜백, 컴포넌트, 배열 메서드 |

Next.js에서 페이지 컴포넌트를 정의할 때 두 가지 형태를 모두 볼 수 있다:

```jsx
// 함수 선언 방식
export default function Home() {
  return <h1>홈페이지</h1>;
}

// 화살표 함수 방식
const Home = () => {
  return <h1>홈페이지</h1>;
};
export default Home;
```

두 방식 모두 동작은 동일하다. 이 수업에서는 **함수 선언 방식**을 기본으로 사용한다 (Next.js 공식 문서 스타일).

### 4.2.3 매개변수 기본값과 나머지 매개변수

```javascript
// 기본값 (default parameter)
function greet(name = "손님") {
  return `안녕하세요, ${name}님!`;
}
greet();          // "안녕하세요, 손님님!"
greet("홍길동");  // "안녕하세요, 홍길동님!"

// 나머지 매개변수 (rest parameter)
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}
sum(1, 2, 3);     // 6
```

기본값은 API 호출에서 자주 사용한다. 예를 들어 페이지 번호의 기본값을 1로 설정하는 패턴이 흔하다.


---

## 4.3 객체와 배열

### 4.3.1 객체 리터럴과 프로퍼티 접근

**객체**(Object)는 관련된 데이터를 하나로 묶는 구조이다. 게시글을 예로 들면:

```javascript
const post = {
  id: 1,
  title: "첫 번째 게시글",
  content: "안녕하세요!",
  author: "홍길동",
  createdAt: "2026-03-01",
};

// 프로퍼티 접근
post.title;          // "첫 번째 게시글"
post["author"];      // "홍길동"
```

Supabase에서 데이터를 가져오면 이런 객체 형태로 돌아온다. 객체를 읽을 줄 알아야 AI가 생성한 데이터 처리 코드를 검증할 수 있다.

### 4.3.2 배열 메서드: map, filter, find, reduce

**배열**(Array)은 순서 있는 데이터 목록이다. 게시글 목록, 사용자 목록 등이 모두 배열이다:

```javascript
const posts = [
  { id: 1, title: "첫 번째 글", author: "홍길동" },
  { id: 2, title: "두 번째 글", author: "김철수" },
  { id: 3, title: "세 번째 글", author: "홍길동" },
];
```

배열을 다루는 핵심 메서드 4가지:

**`map`** — 배열의 각 요소를 변환하여 새 배열을 만든다:

```javascript
// 게시글 제목만 뽑기
const titles = posts.map(post => post.title);
// ["첫 번째 글", "두 번째 글", "세 번째 글"]
```

> React에서 리스트를 화면에 표시할 때 `map`을 사용한다. Next.js 코드에서 가장 자주 보게 될 메서드이다.

**`filter`** — 조건에 맞는 요소만 골라낸다:

```javascript
// 홍길동의 글만 필터링
const myPosts = posts.filter(post => post.author === "홍길동");
// [{ id: 1, ... }, { id: 3, ... }]
```

**`find`** — 조건에 맞는 첫 번째 요소를 반환한다:

```javascript
// id가 2인 게시글 찾기
const found = posts.find(post => post.id === 2);
// { id: 2, title: "두 번째 글", author: "김철수" }
```

**`reduce`** — 배열을 하나의 값으로 누적한다:

```javascript
const numbers = [10, 20, 30];
const total = numbers.reduce((sum, n) => sum + n, 0);
// 60
```

**표 4.5** 배열 메서드 요약

| 메서드 | 목적 | 반환값 | 블로그 예시 |
|--------|------|--------|-----------|
| `map` | 각 요소 변환 | 새 배열 | 게시글 → 카드 컴포넌트 |
| `filter` | 조건으로 걸러냄 | 새 배열 | 내 글만 보기 |
| `find` | 하나 찾기 | 요소 또는 undefined | id로 글 조회 |
| `reduce` | 누적 계산 | 단일 값 | 댓글 수 합산 |


### 4.3.3 구조 분해 할당과 스프레드 연산자

**구조 분해 할당**(Destructuring)은 객체나 배열에서 값을 꺼내는 간결한 문법이다:

```javascript
// 객체 구조 분해
const post = { id: 1, title: "제목", author: "홍길동" };
const { title, author } = post;
// title === "제목", author === "홍길동"

// 배열 구조 분해
const [first, second] = [10, 20];
// first === 10, second === 20
```

React의 `useState`가 배열 구조 분해를 사용한다:

```jsx
const [count, setCount] = useState(0);
// count: 현재 값, setCount: 값 변경 함수
```

**스프레드 연산자**(Spread Operator)는 `...`으로 배열이나 객체를 펼친다:

```javascript
// 배열 복사 + 추가
const old = [1, 2, 3];
const expanded = [...old, 4, 5]; // [1, 2, 3, 4, 5]

// 객체 복사 + 수정
const post = { id: 1, title: "원본" };
const updated = { ...post, title: "수정됨" };
// { id: 1, title: "수정됨" }
```

React에서 상태를 업데이트할 때 스프레드 연산자를 자주 사용한다. 원본을 직접 수정하지 않고 새 객체를 만드는 **불변성**(Immutability) 패턴이다. 6장에서 다시 다룬다.

---

## 4.4 비동기 프로그래밍

> **라이브 코딩 시연**: 공개 API(JSONPlaceholder)를 호출하여 데이터를 콘솔에 출력하고, 화면에 표시하는 과정을 시연한다. fetch → json 파싱 → map으로 리스트 렌더링 순서로 진행한다.

웹에서 서버에 데이터를 요청하면 응답이 올 때까지 시간이 걸린다. 이 "기다리는 동안 다른 일을 할 수 있는" 방식이 **비동기**(Asynchronous) 프로그래밍이다.

### 4.4.1 동기 vs 비동기의 이해

비유하자면:

- **동기**: 식당에서 음식이 나올 때까지 자리에서 아무것도 하지 않고 기다린다
- **비동기**: 주문을 넣고 진동벨을 받는다. 벨이 울릴 때까지 다른 일을 한다

```javascript
// 동기적 코드 — 위에서 아래로 순서대로 실행
console.log("1번");
console.log("2번");
console.log("3번");
// 출력: 1번, 2번, 3번

// 비동기적 코드 — 서버 요청은 시간이 걸린다
console.log("요청 시작");
// fetch는 서버 응답을 "기다리는" 작업
fetch("https://api.example.com/data");
console.log("요청 끝 (응답은 아직 안 왔을 수 있음)");
```

### 4.4.2 Promise의 개념

**Promise**는 "나중에 결과를 알려줄게"라는 약속 객체이다. 서버에 요청을 보내면 즉시 Promise가 반환되고, 응답이 도착하면 결과가 채워진다.

Promise의 세 가지 상태:
- **대기**(Pending): 아직 결과가 나오지 않은 상태
- **이행**(Fulfilled): 성공적으로 결과를 받은 상태
- **거부**(Rejected): 에러가 발생한 상태

```javascript
// Promise를 직접 만들 일은 거의 없다.
// fetch, Supabase 등이 이미 Promise를 반환한다.
// 우리가 해야 할 일은 Promise의 결과를 "받아서 처리"하는 것이다.
```

### 4.4.3 async/await 패턴

**async/await**는 Promise를 읽기 쉽게 사용하는 문법이다. 이 수업에서 비동기 코드를 작성할 때는 항상 이 방식을 사용한다:

```javascript
// async 함수 안에서 await로 결과를 기다린다
async function getPosts() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  const data = await response.json();
  return data;
}
```

`await`는 "이 줄의 결과가 올 때까지 기다려라"라는 뜻이다. `await`는 반드시 `async` 함수 안에서만 사용할 수 있다.

### 4.4.4 fetch API로 데이터 가져오기

**fetch**는 서버에 HTTP 요청을 보내는 내장 함수이다:

```javascript
async function getPosts() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");

  // fetch는 HTTP 에러(404, 500)에서 예외를 던지지 않는다!
  if (!response.ok) {
    throw new Error(`HTTP 에러: ${response.status}`);
  }

  const posts = await response.json(); // JSON → JavaScript 객체로 변환
  return posts;
}
```

> **중요**: `fetch`는 네트워크 에러(서버 다운 등)에서만 예외를 던진다. 404나 500 같은 HTTP 에러는 정상 응답으로 처리한다. 그래서 `response.ok`를 반드시 확인해야 한다. AI가 이 체크를 빠뜨리는 경우가 많다.

### 4.4.5 에러 처리: try-catch

서버 요청은 항상 실패할 수 있다. 네트워크가 끊기거나, 서버가 다운되거나, URL이 잘못되었을 수 있다. **try-catch**로 에러를 처리한다:

```javascript
async function getPosts() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    if (!response.ok) {
      throw new Error(`HTTP 에러: ${response.status}`);
    }
    const posts = await response.json();
    return posts;
  } catch (error) {
    console.error("데이터를 가져오지 못했습니다:", error.message);
    return []; // 에러 시 빈 배열 반환
  }
}
```

**표 4.6** 비동기 패턴 비교

| 패턴 | 문법 | 가독성 | 사용 여부 |
|------|------|:------:|:---------:|
| 콜백 | `fetch(url, function(res) {...})` | 낮음 | 사용 안 함 |
| Promise.then | `fetch(url).then(res => ...)` | 보통 | 간단한 경우만 |
| async/await | `const res = await fetch(url)` | **높음** | **기본 사용** |

copilot-instructions.md에 `async/await 패턴 (then 체이닝 금지)`를 이미 명시해두었다. AI가 `.then()` 체이닝으로 코드를 생성하면 async/await로 변환을 요청한다.

---

## 4.5 모듈 시스템

프로젝트가 커지면 하나의 파일에 모든 코드를 넣을 수 없다. **모듈**(Module)은 코드를 파일 단위로 분리하고, 필요한 부분만 가져다 쓰는 시스템이다.

### 4.5.1 import/export

```javascript
// lib/utils.js — 내보내기 (export)
export function formatDate(date) {
  return new Date(date).toLocaleDateString("ko-KR");
}

export const APP_NAME = "블로그";
```

```javascript
// app/page.js — 가져오기 (import)
import { formatDate, APP_NAME } from "../lib/utils";

// default export — 파일당 하나
// lib/supabase.js
export default function createClient() { ... }

// 가져올 때 이름을 자유롭게 지정
import supabase from "../lib/supabase";
```

**표 4.7** export 방식 비교

| 방식 | 문법 | 가져올 때 | 파일당 |
|------|------|----------|:------:|
| named export | `export function 이름()` | `import { 이름 } from` | 여러 개 |
| default export | `export default function()` | `import 아무이름 from` | 1개 |

### 4.5.2 모듈 구조 설계

Next.js 프로젝트에서 파일을 분리하는 일반적인 패턴:

```text
app/
  page.js          ← 페이지 (UI)
  layout.js        ← 레이아웃
components/
  PostCard.js      ← 재사용 컴포넌트
lib/
  supabase.js      ← Supabase 클라이언트
  utils.js         ← 유틸리티 함수
```

이 구조는 copilot-instructions.md에 명시해두면, AI가 새 기능을 추가할 때 올바른 위치에 파일을 생성한다.


---

## 핵심 정리 + B회차 과제 스펙

### 이번 시간 핵심 3가지

1. **`const`**(기본)와 **`let`**(변경 필요 시)만 사용한다. `var`는 금지
2. **배열 메서드**: `map`(변환), `filter`(걸러내기), `find`(찾기)가 핵심
3. **비동기**: `async/await` + `fetch`로 서버 데이터를 가져오고, `response.ok`와 `try-catch`로 에러를 처리한다

### B회차 과제 스펙

**더미 API 연동 + 필터/검색 인터랙션 + 배포**:
1. JSONPlaceholder API에서 게시글 목록을 가져온다
2. 가져온 데이터를 카드 형태로 화면에 표시한다
3. 간단한 필터 기능을 추가한다 (예: 특정 userId로 필터링)
4. 검색 기능을 추가한다 (제목 키워드 검색)
5. git push → Vercel 배포

**사용할 API**: `https://jsonplaceholder.typicode.com/posts`

**스타터 코드**: `practice/chapter4/starter/` — Ch3 complete 기반 + fetch 스켈레톤이 준비되어 있다. B회차에서 이 코드를 기반으로 시작한다.

---

## Exit ticket

다음 코드의 실행 결과를 예측하라:

```javascript
const posts = [
  { id: 1, title: "React 기초", author: "김학생" },
  { id: 2, title: "Tailwind 팁", author: "이학생" },
  { id: 3, title: "Next.js 시작", author: "김학생" },
];

const result = posts.filter(post => post.author === "김학생").map(post => post.title);
console.log(result);
```

정답: `["React 기초", "Next.js 시작"]` — `filter`로 "김학생"의 글만 걸러내고, `map`으로 제목만 추출했다.

---

