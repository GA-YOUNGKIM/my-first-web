# Chapter 7. 웹 앱 아키텍처 & AI 디자인 설계 — B회차: 실습

> **미션**: Ch1~6에서 만든 블로그의 **아키텍처 설계서**를 보강한다 — shadcn/ui, 디자인 토큰, DB 스키마 계획

---

---

## 과제 스펙 + 스타터 코드 안내

### 과제 요구사항

Ch1~6에서 만든 블로그에 아키텍처를 보강한다. shadcn/ui 컴포넌트 시스템, 디자인 토큰, DB 스키마 계획을 추가하여 Ch8~12에서 배울 Supabase CRUD, 인증, RLS를 활용할 수 있는 구조로 정비한다.

**제출물**:

① 페이지 맵 보강 (기존 페이지 + 추가 페이지, URL 구조 포함)
② AI 와이어프레임 (Copilot Vision 또는 v0로 생성, 2장 이상)
③ shadcn/ui 테마 (`npx shadcn init` 완료 + 색상 커스터마이징)
④ 데이터 모델 (테이블 2개 이상 + 관계 정의 — Ch8 Supabase 대비)
⑤ copilot-instructions.md (Design Tokens + Component Rules 섹션 포함)
⑥ ARCHITECTURE.md (페이지 맵 + 컴포넌트 계층 + 데이터 모델 통합)
⑦ context.md (프로젝트 현재 상태 기록 — 기술 결정 사항 포함)
⑧ todo.md (전체 작업 체크리스트 — 단계별 구분, 진행률 포함)

### 스타터 코드

`practice/chapter7/starter/` 폴더에 설계서 템플릿 파일들이 준비되어 있다.

```
practice/chapter7/starter/
├── ARCHITECTURE.md        ← 설계서 템플릿 (빈 구조)
├── copilot-instructions.md ← Copilot 지시사항 템플릿
├── context.md             ← 프로젝트 상태 템플릿
├── todo.md                ← 작업 체크리스트 템플릿
└── README.md              ← 프로젝트 설명 템플릿
```

**시작 방법** (PowerShell 기준):
```bash
cd practice/chapter7/starter
# 템플릿 파일을 자신의 프로젝트 폴더로 복사
```
macOS Terminal도 동일하다.

---

## 바이브코딩 가이드

> **Copilot 활용**: 이번 실습에서는 Copilot Chat에 기존 블로그 프로젝트의 구조를 입력하여 설계서 보강안을 생성한다. AI가 만든 설계서를 그대로 쓰지 말고, A회차에서 배운 "AI 슬롭 방지" 기준으로 반드시 검증·수정한다.

**좋은 프롬프트 vs 나쁜 프롬프트**:

❌ 나쁜 프롬프트:
> "블로그 설계서 만들어줘"

문제: 현재 상태, 보강할 부분, 기술 스택이 전혀 명시되지 않아 AI 슬롭이 생성된다.

✅ 좋은 프롬프트:


> [버전 고정] Next.js 14.2.21, React 18.3.1, Tailwind CSS 3.4.17, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2 기준으로 작성해줘.
> [규칙] App Router만 사용하고 next/router, pages router, 구버전 API는 사용하지 마.
> [검증] 불확실하면 현재 프로젝트 package.json 기준으로 버전을 먼저 확인하고 답해줘.
> "내 블로그 프로젝트의 ARCHITECTURE.md를 보강해줘.
> 기술 스택: Next.js 14 App Router + Tailwind CSS + shadcn/ui + Supabase.
> 기존 페이지: 홈(/), 포스트 목록(/posts), 포스트 작성(/posts/new), 포스트 상세(/posts/[id]).
> 추가할 것: shadcn/ui 컴포넌트 계층, 디자인 토큰, DB 스키마(users, posts 테이블 + FK 관계).
> 인증: 이메일/비밀번호 로그인.
> 각 페이지의 주요 컴포넌트와 데이터 흐름을 포함해줘."

<!-- COPILOT_VERIFY: 위 프롬프트를 Copilot Chat에 입력하고 실제 ARCHITECTURE.md 보강안의 품질을 확인해주세요 -->

---

## 개인 실습

### 체크포인트 1: 페이지 맵 + 데이터 모델

**목표**: 블로그의 페이지 구조를 보강하고 데이터베이스 모델을 설계한다.

① 기존 블로그의 페이지 맵을 검토한다
② 페이지 맵을 보강한다 — 기존 + 추가 페이지, App Router URL 구조 포함:

```
/               → 홈 (포스트 목록)
/posts          → 포스트 목록
/posts/new      → 포스트 작성
/posts/[id]     → 포스트 상세
/mypage         → 마이페이지
/login          → 로그인
/signup         → 회원가입
```

③ 데이터 모델을 설계한다 — 테이블 2개 이상, 관계(1:N) 정의:

```
profiles (사용자)
├── id: uuid (PK, auth.users 참조)
├── username: text
├── avatar_url: text
└── created_at: timestamptz

posts (포스트)
├── id: uuid (PK)
├── user_id: uuid (FK → profiles.id)
├── title: text
├── content: text
└── created_at: timestamptz
```

④ Copilot에게 블로그에 맞는 데이터 모델을 요청하고, 결과를 검토한다


### 체크포인트 2: 와이어프레임 + shadcn/ui 테마

**목표**: AI로 와이어프레임을 생성하고, shadcn/ui 테마를 설정한다.

① Copilot Vision 또는 v0(https://v0.dev)에 와이어프레임을 요청한다


> [버전 고정] Next.js 14.2.21, React 18.3.1, Tailwind CSS 3.4.17, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2 기준으로 작성해줘.
> [규칙] App Router만 사용하고 next/router, pages router, 구버전 API는 사용하지 마.
> [검증] 불확실하면 현재 프로젝트 package.json 기준으로 버전을 먼저 확인하고 답해줘.
> "다음 페이지의 와이어프레임을 그려줘:
> 1) 홈 페이지 — 포스트 카드 목록 + 검색바
> 2) 포스트 작성 페이지 — 제목, 내용 입력 폼 + 제출 버튼
> 스타일: 깔끔하고 미니멀, shadcn/ui 컴포넌트 활용"

<!-- COPILOT_VERIFY: Copilot Vision으로 와이어프레임을 생성하고 결과 품질을 확인해주세요 -->

② shadcn/ui를 초기화한다:

```bash
npx shadcn@latest init
```

③ CSS 변수에서 프로젝트 색상을 커스터마이징한다 (`app/globals.css`):

```css
:root {
  --primary: 220 70% 50%;      /* 프로젝트 메인 색상 */
  --primary-foreground: 0 0% 100%;
}
```

④ 필요한 컴포넌트를 추가한다 (예: `npx shadcn@latest add button card input`)

<!-- COPILOT_VERIFY: shadcn/ui 초기화 후 컴포넌트가 프로젝트에 정상 추가되는지 확인해주세요 -->

### 체크포인트 3: 설계 문서 통합 + GitHub push

**목표**: 설계 문서 4종 세트를 완성하고 GitHub에 push한다.

① ARCHITECTURE.md를 보강한다 — 페이지 맵 + 컴포넌트 계층 + 데이터 모델 통합
② copilot-instructions.md를 보강한다 — Design Tokens + Component Rules 섹션 포함
③ context.md를 작성한다 — 현재 상태, 기술 결정 사항 기록
④ todo.md를 작성한다 — 전체 작업 체크리스트 (Ch8~12에서 구현할 항목 포함)
⑤ 아래 검증 체크리스트를 수행한다
⑥ GitHub에 push한다:

```bash
git add .
git commit -m "Ch7: 블로그 아키텍처 설계서 보강"
git push
```

---

## 검증 체크리스트

**표 7.14** 설계서 검증 체크리스트

| 항목 | 확인 내용 | 확인 |
|------|-----------|------|
| 페이지 맵 | 기존 + 추가 페이지, URL 구조가 App Router 규칙에 맞는가? | ☐ |
| 와이어프레임 | AI로 생성한 와이어프레임이 2장 이상인가? | ☐ |
| shadcn/ui | `npx shadcn init` 완료 + 색상 커스터마이징이 되었는가? | ☐ |
| 데이터 모델 | 테이블 2개 이상 + FK 관계가 정의되었는가? (Ch8 대비) | ☐ |
| copilot-instructions.md | Design Tokens + Component Rules 섹션이 있는가? | ☐ |
| ARCHITECTURE.md | 페이지 맵, 컴포넌트, 데이터 모델이 통합되어 있는가? | ☐ |
| context.md | 현재 상태와 기술 결정 사항이 기록되어 있는가? | ☐ |
| todo.md | 단계별 작업 체크리스트가 있는가? | ☐ |

---

## 흔한 AI 실수

**표 7.15** Ch7에서 AI가 자주 틀리는 패턴

| AI 실수 | 올바른 방법 | 발생 원인 |
|---------|------------|----------|
| 페이지 맵에 Pages Router 경로 사용 (`/pages/about`) | App Router 경로 사용 (`/app/about/page.tsx`) | Next.js 버전 혼동 |
| 데이터 모델에 `id: int` 사용 | `id: uuid` 사용 (Supabase auth.users와 호환) | PostgreSQL + Supabase 규칙 미인식 |
| copilot-instructions.md에 구체적 파일 경로 누락 | 프로젝트 구조와 기술 스택을 명시 | 맥락 부족 |
| 와이어프레임에 존재하지 않는 컴포넌트 사용 | shadcn/ui에 실제로 있는 컴포넌트만 사용 | AI 환각 |
| CSS 변수 형식 오류 (`#3b82f6` 대신 HSL 사용) | `--primary: 220 70% 50%` (HSL 공백 구분) | shadcn/ui의 CSS 변수 형식 미인식 |
| ARCHITECTURE.md에 구현 코드 포함 | 설계 수준의 구조만 기술 (코드는 Ch8부터) | 설계와 구현 단계 혼동 |

---

## 제출 안내 (Google Classroom)

Google Classroom의 "Ch7 과제"에 아래 두 항목을 제출한다:

```
① GitHub 저장소 URL
   예: https://github.com/내아이디/my-blog
   (ARCHITECTURE.md, copilot-instructions.md, context.md, todo.md 포함)

② AI가 틀린 부분 1개
   예: "Copilot이 데이터 모델에서 id를 int로 생성했는데,
       Supabase auth.users와 연결하려면 uuid여야 해서 수정했다."
```

---

## C파일 비교 + 코드 수정 가이드

> 제출 마감 후 C파일(모범 설계서)을 확인한다. 자기 블로그 설계서와 비교해 차이점을 찾고 보완한다.

**진행 순서**:

| 시간 | 활동 |
|------|------|
| 3분 | 모범 설계서 핵심 구조 확인 |
| 5분 | 학생이 자기 설계서와 모범 설계서를 비교 — 빠진 부분 찾기 |
| 5분 | 빠진 부분을 자기 설계서에 추가 |
| 2분 | 설계서 핵심 항목 정리 |

**비교 포인트**:
- 페이지 맵: App Router 경로 규칙을 따르는가? 빠진 페이지가 있는가?
- 데이터 모델: 테이블 관계(FK)와 필수 컬럼이 올바른가?
- copilot-instructions.md: 모범 설계서는 어떤 규칙을 포함하고 있는가?

_전체 모범 설계서는 practice/chapter7/complete/ 참고_

---

