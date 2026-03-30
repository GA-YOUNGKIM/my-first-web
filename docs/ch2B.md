# Chapter 2. Copilot 세팅과 바이브코딩 — B회차: 실습

> **미션**: Copilot으로 블로그 소개 페이지를 만들고 배포한다

---

---

## 과제 스펙 + 스타터 코드 안내

### 과제 요구사항

**Copilot 설정 + 블로그 소개 페이지**를 만든다:

① GitHub Copilot / Copilot Chat 확장 설치 완료
② `.github/copilot-instructions.md` 파일 작성 완료
③ Copilot Chat을 사용하여 블로그 소개 페이지 생성 (이름, 학교, 전공, 취미 등)
④ AI 코드 검증 체크리스트 수행
⑤ git push → Vercel 배포 + AI 사용 로그 작성

### 스타터 코드

`practice/chapter2/starter/` 폴더에 Ch1 결과물 + copilot-instructions.md 템플릿이 준비되어 있다.

```
practice/chapter2/starter/
├── .github/
│   └── copilot-instructions.md  ← 템플릿 (TODO 항목 채워넣기)
├── app/
│   ├── layout.js       ← 공통 레이아웃 (Tailwind 설정 완료)
│   ├── page.js         ← 메인 페이지 (Ch1 블로그 첫 페이지 뼈대)
│   └── globals.css     ← Tailwind 기본 import
├── package.json        ← 의존성 (버전 고정)
├── tailwind.config.js
├── postcss.config.js
└── next.config.js
```

**시작 방법** (PowerShell 기준):
```bash
cd practice/chapter2/starter
npm install
npm run dev
```
macOS Terminal도 동일하다.

브라우저에서 http://localhost:3000 을 열어 기본 페이지가 보이는지 확인한다.


---

## 바이브코딩 가이드

> **Copilot 활용**: 이번 실습에서는 Copilot Chat에 프롬프트를 입력하여 블로그 소개 페이지를 생성한다. 생성된 코드를 그대로 쓰지 말고, A회차에서 배운 검증 체크리스트로 반드시 확인한다.

### MCP · Skills 초기 설정

이번 실습에서 MCP와 Skills를 처음 설정한다. 이후 모든 챕터에서 활용하므로 반드시 완료한다.

**① MCP 설치** — Copilot Agent 모드에서 아래 프롬프트를 입력한다:

> **Copilot 프롬프트**
> "이 프로젝트에 .vscode/mcp.json 파일을 생성하고, context7 MCP 서버를 설정해줘.
> command는 npx, args는 ["-y", "@upstash/context7-mcp@latest"]로 설정해줘."

<!-- COPILOT_VERIFY: 위 프롬프트로 .vscode/mcp.json이 정상 생성되는지 확인해주세요 -->

설치 후 테스트: `use context7. Next.js App Router에서 page.tsx의 역할을 설명해줘`

> Supabase MCP는 Ch8에서 Supabase 프로젝트를 생성한 후 설정한다.

**② Skills 생성** — Copilot Agent 모드에서 아래 프롬프트를 입력한다:

> **Copilot 프롬프트**
> "이 프로젝트 루트에 아래 2개 Skill을 생성해줘.
> 1) .github/skills/nextjs-basic-check/SKILL.md — App Router(app/) 구조, Server/Client 컴포넌트 구분, next/navigation 사용 규칙
> 2) .github/skills/secret-guard/SKILL.md — API 키 하드코딩 금지, .env.local 사용 강제, NEXT_PUBLIC_ 접두사에 민감한 키 금지
> 각 SKILL.md는 한국어 지침 4~6줄로 작성해줘."

<!-- COPILOT_VERIFY: 위 프롬프트로 .github/skills/ 아래 두 Skill 파일이 정상 생성되는지 확인해주세요 -->

**좋은 프롬프트 vs 나쁜 프롬프트**:

❌ 나쁜 프롬프트:
> "블로그 소개 페이지 만들어줘"

문제: 기술 스택, 파일 위치, 디자인 요구사항이 전혀 없다.

✅ 좋은 프롬프트:


> [버전 고정] Next.js 14.2.21, React 18.3.1, Tailwind CSS 3.4.17, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2 기준으로 작성해줘.
> [규칙] App Router만 사용하고 next/router, pages router, 구버전 API는 사용하지 마.
> [검증] 불확실하면 현재 프로젝트 package.json 기준으로 버전을 먼저 확인하고 답해줘.
> "Next.js App Router의 app/page.js에 블로그 소개 페이지를 만들어줘.
> Tailwind CSS를 사용하고, 배경은 밝은 회색(bg-gray-50).
> 중앙에 흰색 카드(bg-white, rounded-lg, shadow) 배치.
> 카드 안에 이름, 학교, 전공, 취미를 표시해줘.
> 이름은 text-3xl font-bold, 나머지는 text-gray-600."

<!-- COPILOT_VERIFY: 위 프롬프트를 Copilot Chat에 입력하고 생성 결과를 캡처해주세요 -->

---

## 개인 실습

### 체크포인트 1: Copilot 확인 + copilot-instructions.md 완성

**목표**: Copilot이 정상 동작하고, copilot-instructions.md를 완성한다.

① VS Code에서 Copilot 아이콘이 보이는지 확인한다 (오른쪽 하단)
② Copilot Chat 패널을 열고 "Hello"라고 입력하여 응답이 오는지 확인한다
③ `.github/copilot-instructions.md` 파일을 열고 TODO 항목을 채운다
④ Tech Stack, Coding Conventions, Known AI Mistakes 섹션을 완성한다
⑤ 파일을 저장한다


### 체크포인트 2: 블로그 소개 페이지 생성 + 검증

**목표**: Copilot으로 블로그 소개 페이지를 만들고 검증한다.

① Copilot Chat에 프롬프트를 입력하여 블로그 소개 코드를 생성한다
② 생성된 코드를 `app/page.js`에 붙여넣는다
③ **검증 체크리스트 수행**:
   - import 경로가 올바른가?
   - Tailwind 클래스가 올바른가? (className으로 되어 있는가?)
   - "use client"가 불필요하게 들어있지 않은가?
   - 환경변수가 하드코딩되어 있지 않은가?
④ 본인 정보로 내용을 수정한다
⑤ 추가 프롬프트로 기능을 추가해도 좋다 (사진, 링크 등)


> [버전 고정] Next.js 14.2.21, React 18.3.1, Tailwind CSS 3.4.17, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2 기준으로 작성해줘.
> [규칙] App Router만 사용하고 next/router, pages router, 구버전 API는 사용하지 마.
> [검증] 불확실하면 현재 프로젝트 package.json 기준으로 버전을 먼저 확인하고 답해줘.
> "이 블로그 소개 페이지에 GitHub 링크와 이메일 링크를 추가해줘. 아이콘 대신 텍스트 링크로 하고, hover:text-blue-500 효과를 넣어줘."


### 체크포인트 3: AI 사용 로그 + 배포

**목표**: AI 사용 로그를 작성하고 배포한다.

① AI 사용 로그를 작성한다:
```text
[프롬프트] (어떤 프롬프트를 사용했는가)
[AI 실수]  (AI가 틀린 부분이 있었는가)
[분류]     (버전 불일치 / 컨텍스트 소실 / 환각 / 없음)
[해결]     (어떻게 수정했는가)
[조치]     (copilot-instructions.md에 추가한 내용)
```
② git add → git commit → git push로 배포한다:
```bash
git add .
git commit -m "Ch2: 블로그 소개 페이지 + copilot-instructions.md"
git push
```
③ Vercel 대시보드에서 배포 완료를 확인한다
④ 배포된 URL을 브라우저에서 열어 동작을 확인한다

---

## 검증 체크리스트

**표 2.14** AI 코드 검증 체크리스트

| 항목 | 확인 |
|------|------|
| Copilot/Copilot Chat 확장이 설치되었는가? | ☐ |
| `.github/copilot-instructions.md`가 작성되었는가? | ☐ |
| import 경로가 올바른가? | ☐ |
| `className`을 사용했는가? (`class` 아님) | ☐ |
| 불필요한 `"use client"`가 없는가? | ☐ |
| 환경변수가 하드코딩되어 있지 않은가? | ☐ |
| 배포 URL에서 정상 동작하는가? | ☐ |

---

## 흔한 AI 실수

**표 2.15** Ch2에서 AI가 자주 틀리는 패턴

| AI 실수 | 올바른 코드 | 발생 원인 |
|---------|-----------|----------|
| `import { useRouter } from 'next/router'` | `from 'next/navigation'` | Pages Router 문법 (구 버전) |
| 불필요한 `"use client"` 추가 | Server Component로 충분한 경우 제거 | 클라이언트 컴포넌트 남용 |
| `class="..."` | `className="..."` | 순수 HTML 학습 데이터의 영향 |
| 존재하지 않는 패키지 추천 | npmjs.com에서 검증 후 설치 | 환각 |
| CSS Modules import | Tailwind 유틸리티 클래스 사용 | 프로젝트 컨텍스트 미인식 |
| `getServerSideProps` 사용 | App Router 서버 컴포넌트 | Pages Router 문법 (구 버전) |

---

## 제출 안내 (Google Classroom)

Google Classroom의 "Ch2 과제"에 아래 항목을 제출한다:

```
① 배포 URL
   예: https://내프로젝트.vercel.app

② AI가 틀린 부분 1개
   예: "Copilot이 'use client'를 불필요하게 추가했는데,
       이 페이지는 서버 컴포넌트로 충분하므로 제거했다."
```

> AI가 틀린 부분이 딱히 없었다면, "Copilot이 생성한 코드에서 확인한 점"을 기술한다. 예: "className이 올바르게 사용되었고, import 경로도 맞았다."

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
- copilot-instructions.md: 모범 구현의 지시사항과 내가 작성한 것의 차이는?
- 프롬프트 전략: 같은 기능을 모범 구현은 어떤 프롬프트로 만들었는가?
- AI 사용 로그: 모범 구현의 검증 과정과 내 검증 과정을 비교

_전체 모범 구현은 practice/chapter2/complete/ 참고_

---

