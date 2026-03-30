# Chapter 4. JavaScript 핵심 — B회차: 실습

> **미션**: 더미 API에서 데이터를 가져와 필터/검색 기능이 있는 블로그를 구현하고 배포한다

---

---

## 과제 스펙 + 스타터 코드 안내

### 과제 요구사항

**더미 API 연동 블로그**를 만든다:

① JSONPlaceholder API(`https://jsonplaceholder.typicode.com/posts`)에서 게시글 가져오기
② 가져온 데이터를 카드 형태로 화면에 표시
③ userId 필터 버튼 — 클릭하면 해당 사용자의 글만 표시
④ 제목 검색 — 키워드 입력 시 제목에 해당 키워드가 포함된 글만 표시
⑤ Vercel 배포

### 스타터 코드

`practice/chapter4/starter/` 폴더에 Ch3 complete 기반 + fetch 스켈레톤이 준비되어 있다.

```
practice/chapter4/starter/
├── app/
│   ├── layout.js       ← 공통 레이아웃 (Tailwind 설정 완료)
│   ├── page.js         ← 메인 페이지 (fetch 뼈대만 있음)
│   └── globals.css     ← Tailwind 기본 import
├── package.json        ← 의존성 (버전 고정)
├── tailwind.config.js
├── postcss.config.js
└── next.config.js
```

**시작 방법** (PowerShell 기준):
```bash
cd practice/chapter4/starter
npm install
npm run dev
```
macOS Terminal도 동일하다.

브라우저에서 http://localhost:3000 을 열어 기본 페이지가 보이는지 확인한다.

---

## 바이브코딩 가이드

> **Copilot 활용**: 이번 실습에서는 Copilot Chat에 프롬프트를 입력하여 API 연동과 인터랙션을 구현한다. 생성된 코드를 그대로 쓰지 말고, A회차에서 배운 기준으로 반드시 검증한다.

### Skills 활용 가이드 (권장)

- `api-safety-check`: `fetch` 호출의 `response.ok`, `try-catch`, 사용자 메시지 누락을 점검한다.
- 사용 시점: 코드 생성 직후 1회, 배포 전 검증 체크리스트 직전 1회.
- 점검 프롬프트 예시: `api-safety-check 기준으로 이 페이지에서 에러 처리 누락 3가지만 찾아줘.`

**좋은 프롬프트 vs 나쁜 프롬프트**:

❌ 나쁜 프롬프트:
> "API에서 데이터 가져와서 보여줘"

문제: 어떤 API인지, 어떤 패턴(async/await vs .then)인지, 에러 처리는 필요한지 불명확. AI가 .then() 체이닝이나 var를 사용할 수 있다.

✅ 좋은 프롬프트:


> [버전 고정] Next.js 14.2.21, React 18.3.1, Tailwind CSS 3.4.17, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2 기준으로 작성해줘.
> [규칙] App Router만 사용하고 next/router, pages router, 구버전 API는 사용하지 마.
> [검증] 불확실하면 현재 프로젝트 package.json 기준으로 버전을 먼저 확인하고 답해줘.
> "app/page.js를 수정해줘.
> JSONPlaceholder API(https://jsonplaceholder.typicode.com/posts)에서
> 게시글을 가져와서 카드 리스트로 보여줘.
> async/await와 fetch를 사용하고, response.ok 체크와 try-catch 에러 처리도 포함해줘.
> Tailwind CSS로 스타일링해줘.
> Next.js 14 App Router, 'use client' 지시어 포함."

<!-- COPILOT_VERIFY: 위 프롬프트를 Copilot Chat에 입력하고 생성 결과를 캡처해주세요 -->

---

## 개인 실습

### 체크포인트 1: API 데이터 가져오기

**목표**: JSONPlaceholder API에서 게시글을 가져와 화면에 표시한다.

① Copilot Chat에 프롬프트를 입력하여 API 연동 코드를 생성한다
② 생성된 코드를 `app/page.js`에 붙여넣는다
③ **async/await 확인**: `.then()` 체이닝이 아닌 async/await를 사용했는지 검사한다
④ **response.ok 확인**: fetch 후 `if (!response.ok)` 체크가 있는지 검사한다
⑤ **try-catch 확인**: 에러 처리가 포함되어 있는지 검사한다


### 체크포인트 2: 필터 + 검색 기능

**목표**: userId 필터와 제목 검색 기능을 추가한다.

① 필터 버튼을 추가한다 — "전체", "User 1", "User 2" 등 버튼 클릭 시 해당 userId의 글만 표시
② 검색 input을 추가한다 — 입력한 키워드가 제목에 포함된 글만 표시
③ `filter` 메서드로 필터링 로직을 구현한다
④ 필터와 검색이 동시에 동작하는지 확인한다

Copilot에게 필터 기능을 요청할 때:


> [버전 고정] Next.js 14.2.21, React 18.3.1, Tailwind CSS 3.4.17, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2 기준으로 작성해줘.
> [규칙] App Router만 사용하고 next/router, pages router, 구버전 API는 사용하지 마.
> [검증] 불확실하면 현재 프로젝트 package.json 기준으로 버전을 먼저 확인하고 답해줘.
> "게시글 목록에 두 가지 필터 기능을 추가해줘.
> 1. userId 필터: 버튼 클릭으로 해당 사용자 글만 표시 (전체/User 1/User 2 등)
> 2. 제목 검색: input에 키워드 입력 시 제목에 포함된 글만 표시.
> filter 메서드 사용. useState로 상태 관리. Tailwind CSS 스타일링."

<!-- COPILOT_VERIFY: 필터+검색 기능 프롬프트를 실행하고, filter 메서드와 useState 사용 여부를 확인해주세요 -->

### 체크포인트 3: 검증 + 배포

**목표**: AI 코드를 검증하고 배포한다.

① 아래 검증 체크리스트를 수행한다
② 문제가 있으면 수정한다
③ git add → git commit → git push 로 배포한다:
```bash
git add .
git commit -m "Ch4: API 연동 + 필터/검색 기능"
git push
```
④ Vercel 대시보드에서 배포 완료를 확인한다
⑤ 배포된 URL을 브라우저에서 열어 동작을 확인한다
⑥ 필터 버튼과 검색이 배포 환경에서도 동작하는지 확인한다

---

## 검증 체크리스트

**표 4.9** AI 코드 검증 체크리스트

| 항목 | 확인 |
|------|------|
| `async/await` 패턴을 사용했는가? (`.then()` 아님) | ☐ |
| `response.ok` 체크가 있는가? | ☐ |
| `await response.json()`으로 JSON 파싱을 했는가? | ☐ |
| `try-catch`로 에러를 처리했는가? | ☐ |
| `var` 대신 `const`/`let`을 사용했는가? | ☐ |
| `===`(엄격 비교)를 사용했는가? (`==` 아님) | ☐ |
| import 경로가 실제 파일과 일치하는가? | ☐ |
| `"use client"` 지시어가 필요한 파일에 있는가? | ☐ |
| 배포 URL에서 정상 동작하는가? | ☐ |

---

## 흔한 AI 실수

**표 4.10** Ch4에서 AI가 자주 틀리는 패턴

| AI 실수 | 올바른 코드 | 발생 원인 |
|---------|-----------|----------|
| `var` 사용 | `const` 또는 `let` | 레거시 학습 데이터 |
| `.then()` 체이닝 | `async/await` | 프로젝트 규칙 미반영 |
| `response.ok` 체크 누락 | `if (!response.ok)` 필수 | HTTP 에러 미처리 |
| `.json()` 누락 | `await response.json()` | fetch 응답 자동 파싱 착각 |
| 존재하지 않는 import 경로 | 실제 파일 경로 확인 | 환각 — 가짜 경로 생성 |
| `==` 비교 연산자 | `===` 사용 (엄격 비교) | 타입 변환 버그 방지 |
| `"use client"` 누락 | useState/이벤트 사용 시 필수 | Server Component 기본 미인지 |

---

## 제출 안내 (Google Classroom)

Google Classroom의 "Ch4 과제"에 아래 두 항목을 제출한다:

```
① 배포 URL
   예: https://내프로젝트.vercel.app

② AI가 틀린 부분 1개
   예: "Copilot이 .then() 체이닝으로 생성했는데,
       async/await로 변환했다."
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
- 비동기 패턴: 모범 구현은 `async/await` + `try-catch`를 어떻게 구조화했는가?
- 필터/검색: `filter`와 `map` 체이닝 순서가 다른가?
- 에러 처리: API 호출 실패 시 사용자에게 어떤 메시지를 보여주는가?

_전체 모범 구현은 practice/chapter4/complete/ 참고_

---

