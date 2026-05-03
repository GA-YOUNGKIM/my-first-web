# ARCHITECTURE — my-first-web

이 문서는 개인 블로그 프로젝트의 설계 방향을 초보자도 이해하기 쉽게 정리한 문서입니다.
현재는 프로젝트 목표, App Router 기준 페이지 맵, 주요 유저 플로우를 담고 있습니다.
컴포넌트 구조와 데이터 모델도 아래에 함께 정리했습니다.

## 1. 프로젝트 목표

- 목적: 누구나 글을 쉽게 읽고, 작성자는 로그인 후 글을 안전하게 작성하고 관리할 수 있는 개인 블로그를 만드는 것.
- 핵심 원칙:
  - 읽기 편해야 한다.
  - 글 작성 흐름은 단순해야 한다.
  - 나중에 댓글, 검색, 카테고리 같은 기능을 쉽게 더할 수 있어야 한다.

## 2. 기술 스택

 - 프레임워크: Next.js 16 (App Router only)
 - UI: Tailwind CSS 4 + shadcn/ui
 - 인증 및 데이터베이스: Supabase (Auth + PostgreSQL)
 - 렌더링 기준: Server Component 기본, 상호작용이 필요할 때만 Client Component 사용

  ## 3. 페이지 맵 (App Router URL 기준)

| 페이지 | URL | 파일 경로(예시) | 설명 | 접근 권한 |
|---|---|---|---|---|
| 홈 | `/` | `app/page.tsx` | 블로그 소개와 최신 글 진입점 | 누구나 |
| 글 목록 | `/posts` | `app/posts/page.tsx` | 전체 포스트를 한눈에 보는 페이지 | 누구나 |
| 글 상세 | `/posts/[id]` | `app/posts/[id]/page.tsx` | 한 글의 본문을 읽는 페이지 | 누구나 |
| 글 작성 | `/posts/new` | `app/posts/new/page.tsx` | 새 글을 작성하는 페이지 | 로그인한 사용자 |
| 글 수정 | `/posts/[id]/edit` | `app/posts/[id]/edit/page.tsx` | 이미 쓴 글을 고치는 페이지 | 작성자 전용 |
| 로그인 | `/login` | `app/login/page.tsx` | 이메일과 비밀번호로 로그인 | 비로그인 사용자 |
| 회원가입 | `/signup` | `app/signup/page.tsx` | 새 계정을 만드는 페이지 | 누구나 |
| 마이페이지 | `/mypage` | `app/mypage/page.tsx` | 내 프로필과 내가 쓴 글을 보는 페이지 | 로그인한 사용자 |

### 라우팅 메모

- `app/page.tsx` → `/`
- `app/posts/page.tsx` → `/posts`
- `app/posts/new/page.tsx` → `/posts/new`
- `app/posts/[id]/page.tsx` → `/posts/[id]`
- `app/posts/[id]/edit/page.tsx` → `/posts/[id]/edit`
- `app/login/page.tsx` → `/login`
- `app/signup/page.tsx` → `/signup`
- `app/mypage/page.tsx` → `/mypage`

## 4. 유저 플로우

아래 흐름은 사용자가 실제로 어떻게 이동하는지 보여줍니다.

### 4-1. 글 읽기 플로우

1. 사용자가 `/`(홈)에 들어옵니다.
2. `글 목록`을 눌러 `/posts`로 이동합니다.
3. 관심 있는 글 카드를 눌러 `/posts/[id]`로 들어갑니다.
4. 본문을 읽고 목록이나 다른 글로 이동합니다.

### 4-2. 글 작성 플로우

1. 로그인이 되어 있지 않으면 `새 글 쓰기`를 눌렀을 때 `/login`으로 이동합니다.
2. 로그인한 사용자는 `/posts/new`에서 글을 작성합니다.
3. 제목과 본문을 입력하고 저장합니다.
4. 저장 후 `/posts/[새글ID]`로 이동해 결과를 확인합니다.

### 4-3. 마이페이지 확인 플로우

1. 로그인한 사용자가 `/mypage`로 이동합니다.
2. 프로필 정보와 내가 쓴 글 목록을 확인합니다.
3. 글을 선택해 `/posts/[id]`로 이동합니다.
4. 필요하면 `/posts/[id]/edit`에서 글을 수정합니다.

## 5. 컴포넌트 구조 (shadcn/ui 기준)

이 프로젝트는 shadcn/ui의 기본 컴포넌트를 중심으로 화면을 구성합니다.
화면을 작게 쪼개기보다, 읽기 쉬운 큰 덩어리로 나누고 필요한 곳에만 인터랙션 컴포넌트를 사용합니다.

### 5-1. Button

- 페이지 이동: 홈, 글 목록, 글 상세, 로그인, 회원가입, 마이페이지 이동
- 주요 행동: 글 작성, 저장, 수정, 삭제, 목록으로 돌아가기
- 사용 위치 예시:
  - 홈 상단의 `글 목록 보기`, `새 글 쓰기`
  - 글 목록의 `글 읽기`
  - 글 상세의 `수정`, `삭제`
  - 로그인/회원가입 폼의 제출 버튼

### 5-2. Card

- 독립된 정보 블록을 보여줄 때 사용합니다.
- 사용 위치 예시:
  - 홈의 소개 영역과 최근 글 카드
  - 글 목록의 각 포스트 카드
  - 글 상세의 본문 영역
  - 로그인/회원가입 폼 전체
  - 마이페이지의 프로필 요약과 글 목록

### 5-3. Input

- 한 줄 입력에 사용합니다.
- 사용 위치 예시:
  - 검색창
  - 글 작성/수정 페이지의 제목 입력
  - 로그인/회원가입 페이지의 이메일, 비밀번호 입력

### 5-4. Dialog

- 삭제처럼 되돌리기 어려운 행동을 한 번 더 확인할 때 사용합니다.
- 사용 위치 예시:
  - 글 상세 페이지의 삭제 확인
  - 앞으로 마이페이지나 설정 화면에서 중요한 변경을 확인할 때

## 6. 디자인 토큰

이 프로젝트는 `app/globals.css`에 정의된 색상 토큰을 기준으로 화면을 구성합니다.

- 배경: `bg-background`
- 본문 텍스트: `text-foreground`
- 카드 배경: `bg-card`
- 보조 배경: `bg-muted`
- 보조 텍스트: `text-muted-foreground`
- 주요 버튼: `bg-primary`, `text-primary-foreground`
- 테두리: `border-border`
- 입력 테두리: `border-input`
- 포커스 링: `ring-ring`

## 7. 데이터 모델 (Supabase PostgreSQL)

이 프로젝트는 사용자 정보와 게시글 정보를 분리해서 관리합니다.
한 명의 사용자가 여러 개의 글을 작성할 수 있으므로, `profiles` 와 `posts` 는 1:N 관계입니다.

### 7-1. profiles 테이블

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | uuid | PRIMARY KEY, auth.users 참조 | 사용자 고유 식별자 |
| username | text | NOT NULL | 화면에 표시할 이름 |
| avatar_url | text | NULL | 프로필 이미지 주소 |
| created_at | timestamptz | DEFAULT now() | 생성 시각 |

### 7-2. posts 테이블

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | uuid | PRIMARY KEY | 게시글 고유 식별자 |
| user_id | uuid | NOT NULL, FK → profiles.id | 작성자 |
| title | text | NOT NULL | 제목 |
| content | text | NOT NULL | 본문 |
| created_at | timestamptz | DEFAULT now() | 생성 시각 |

### 7-3. 관계

```
profiles (1) ---- (N) posts
posts.user_id -> profiles.id
```

- 한 명의 사용자는 여러 개의 게시글을 가질 수 있습니다.
- 각 게시글은 정확히 한 명의 작성자에 속합니다.
- 마이페이지는 이 관계를 이용해 현재 로그인한 사용자의 글만 보여줍니다.

### 7-4. Copilot 검토 메모

- Copilot에게 요청한 결과도 `profiles` + `posts` 1:N 구조가 블로그에 가장 자연스럽다는 방향으로 정리되었습니다.
- `profiles`는 Supabase `auth.users`를 참조하고, `posts.user_id`가 작성자를 연결하는 방식이 핵심입니다.

## 8. 페이지별 주요 컴포넌트와 데이터 흐름

### 8-1. 홈 (/)

- 주요 컴포넌트: `Button`, `Card`, `CardHeader`, `CardContent`, `CardTitle`, `Input`
- 데이터 흐름: 정적 소개 영역을 보여주고, 검색창과 버튼 클릭으로 `/posts` 또는 `/posts/new`로 이동한다.

### 8-2. 포스트 목록 (/posts)

- 주요 컴포넌트: `Button`, `Card`, `CardHeader`, `CardContent`, `CardFooter`, `CardTitle`
- 데이터 흐름: 서버에서 글 목록을 가져와 카드 목록으로 보여주고, 각 카드 클릭 시 `/posts/[id]`로 이동한다.

### 8-3. 포스트 작성 (/posts/new)

- 주요 컴포넌트: `Button`, `Card`, `CardContent`, `CardHeader`, `CardTitle`, `Input`, `Textarea`
- 데이터 흐름: 제목과 본문을 입력한 뒤 서버 액션으로 저장하고, 저장 후 새 글 상세 페이지로 이동한다.

### 8-4. 포스트 상세 (/posts/[id])

- 주요 컴포넌트: `Button`, `Card`, `CardContent`, `Dialog`
- 데이터 흐름: 동적 라우트의 `id`로 글을 조회해 본문을 보여주고, 수정/삭제는 작성자 기준으로 처리한다. 삭제는 Dialog로 한 번 더 확인한다.

## 9. 참고

이 문서는 현재 구현 방향을 설명하는 초안입니다.
나중에 페이지가 추가되면 페이지 맵과 유저 플로우를 이어서 보강하면 됩니다.
