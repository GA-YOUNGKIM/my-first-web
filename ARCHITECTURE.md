# Architecture

## 1. 프로젝트 목표

개인 블로그를 Next.js App Router 기반으로 구현한다.

- 방문자는 글을 쉽게 탐색하고 읽을 수 있어야 한다.
- 작성자는 로그인 후 글을 작성하고 관리할 수 있어야 한다.
- 점진적으로 기능을 확장할 수 있는 구조를 유지한다.

## 2. 기술 스택

- 프레임워크: Next.js 16 (App Router only)
- UI: Tailwind CSS 4 + shadcn/ui
- 데이터베이스/인증: Supabase (PostgreSQL + Auth)
- 런타임 패턴: Server Components 기본, 필요한 경우만 Client Component 사용

## 3. 페이지 맵 (URL 구조)

| 페이지 | URL | 설명 | 상태 |
|---|---|---|---|
| 홈 | / | 블로그 소개 및 주요 진입 화면 | 사용 중 |
| 포스트 목록 | /posts | 전체 포스트 목록 조회 | 사용 중 |
| 포스트 작성 | /posts/new | 새 포스트 작성 | 사용 중 |
| 포스트 상세 | /posts/[id] | 개별 포스트 읽기/삭제 | 사용 중 |
| 포스트 수정 | /posts/[id]/edit | 포스트 수정 | 사용 중 |
| 로그인 | /login | 이메일/비밀번호 로그인 | 사용 중 |
| 회원가입 | /signup | 이메일/비밀번호 회원가입 | 사용 중 |
| 마이페이지 | /mypage | 프로필 및 내가 쓴 글 관리 | 예정 |

### 라우팅 메모 (App Router)

- app/page.tsx -> /
- app/posts/page.tsx -> /posts
- app/posts/new/page.tsx -> /posts/new
- app/posts/[id]/page.tsx -> /posts/[id]
- app/posts/[id]/edit/page.tsx -> /posts/[id]/edit
- app/login/page.tsx -> /login
- app/signup/page.tsx -> /signup
- app/mypage/page.tsx -> /mypage

## 4. 유저 플로우 (사용자가 움직이는 경로)

### 4-1. 글 읽기 플로우 (독자)

```
홈 (/) → 글 목록 (/posts) → 글 상세 (/posts/[id])
```

1. 홈에서 "글 목록 보기" 클릭
2. /posts에서 관심 있는 글 찾기
3. 글 카드 클릭으로 /posts/[id]에서 전체 내용 읽기

### 4-2. 글 작성 플로우 (작성자)

```
홈 (/) → 로그인 (/login) → 글 작성 (/posts/new) → 글 상세 (/posts/[id])
```

1. 로그인하지 않았다면 /login에서 로그인
2. 홈 또는 글 목록에서 "새 글 쓰기" 클릭
3. /posts/new에서 제목, 내용 입력
4. 저장 버튼 → 새 글의 /posts/[id]로 자동 이동

### 4-3. 마이페이지 플로우 (작성자)

```
마이페이지 (/mypage) → 내 글 확인 → 글 상세 (/posts/[id]) → 수정/삭제
```

1. 상단 메뉴에서 마이페이지 클릭
2. 프로필 정보 확인
3. 내가 쓴 글 목록 확인
4. 글 클릭 → /posts/[id]에서 수정/삭제 버튼 활성화
5. "수정" 클릭 → /posts/[id]/edit에서 내용 수정
6. 저장 → 글 상세로 돌아옴

---

## 5. 컴포넌트 구조 (shadcn/ui 기준)

### 5-1. 구조 원칙

- 화면은 큰 영역부터 작은 영역 순서로 나눈다.
- 반복되는 UI는 Card로 묶고, 이동 동작은 Button으로 통일한다.
- 텍스트 입력은 Input을 우선 사용하고, 본문처럼 긴 입력만 native textarea로 둔다.
- 삭제처럼 되돌리기 어려운 작업은 Dialog로 한 번 더 확인한다.
- 페이지별 레이아웃은 유지하되, 카드와 버튼의 계층만 통일해서 시각적 일관성을 맞춘다.

### 5-2. 전역 구조

```
app/layout.tsx
└─ Root Layout
   ├─ Header
   │  └─ Button 링크 (로그인, 회원가입, 글쓰기, 마이페이지 이동)
   ├─ Main
   │  └─ 페이지별 콘텐츠
   └─ Footer
```

### 5-3. 페이지별 적용 위치

#### 홈 (/)

- 상단 소개 영역: Card
- 주요 이동 버튼: Button
- 최근 글 카드 목록: Card, CardHeader, CardContent, CardFooter
- 역할: 블로그의 첫 진입점으로서 소개와 글 목록 진입을 함께 제공

#### 포스트 목록 (/posts)

- 글 목록 컨테이너: Card 기반 카드 그리드
- 글 제목과 요약: CardHeader, CardContent
- 글 읽기 이동: Button
- 새 글 쓰기 이동: Button
- 역할: 글을 빠르게 훑어보고 상세 페이지로 이동하는 중심 화면

#### 포스트 작성 / 수정 (/posts/new, /posts/[id]/edit)

- 작성 폼 전체: Card
- 제목 입력: Input
- 본문 입력: native textarea 유지
- 저장/취소 동작: Button
- 역할: 입력 항목을 하나의 카드 안에 모아 집중도를 높임

#### 포스트 상세 (/posts/[id])

- 본문 영역: Card
- 목록/수정 이동: Button
- 삭제 확인: Dialog
- 역할: 읽기 중심 화면이며, 삭제처럼 위험한 행동만 별도 확인

#### 로그인 / 회원가입 (/login, /signup)

- 입력 폼 전체: Card
- 이메일/비밀번호 입력: Input
- 제출 버튼: Button
- 역할: 짧고 명확한 인증 폼으로 유지

#### 마이페이지 (/mypage)

- 프로필 요약: Card
- 내가 쓴 글 목록: Card 기반 리스트
- 글 수정/삭제 이동: Button
- 역할: 개인 정보와 작성 글을 한 화면에서 관리

### 5-4. 컴포넌트 사용 기준

- Button: 페이지 이동, 저장, 취소, 수정, 글 읽기 같은 명확한 행동
- Card: 소개 영역, 글 목록, 글 본문, 인증 폼, 프로필 블록처럼 독립된 덩어리
- Input: 제목, 이메일, 비밀번호 같은 짧은 한 줄 입력
- Dialog: 삭제 확인, 중요 작업 확인처럼 되돌리기 어려운 행위

## 6. 디자인 토큰 (Tailwind + CSS 변수)

토큰은 app/globals.css에 정의된 CSS 변수를 기준으로 사용한다.

### 6-1. 핵심 컬러 토큰

- 배경: bg-background
- 본문 텍스트: text-foreground
- 카드 배경: bg-card
- 보조 배경: bg-muted
- 보조 텍스트: text-muted-foreground
- 주요 액션: bg-primary / text-primary-foreground
- 테두리: border-border
- 입력: border-input
- 포커스 링: ring-ring

### 6-2. 공통 레이아웃 토큰

- 메인 폭: max-w-4xl mx-auto
- 카드 내부 기본 여백: p-6
- 섹션 간 간격: space-y-6
- 반응형 그리드: grid-cols-1 md:grid-cols-2

## 7. 데이터 모델 (Supabase PostgreSQL)

### 7-1. 설계 원칙

- 사용자 정보와 게시글 정보는 분리해서 관리한다.
- 게시글은 반드시 작성자 정보를 참조해야 한다.
- 읽기 화면은 게시글 중심, 관리 화면은 사용자와 게시글 관계 중심으로 본다.
- 확장 가능성을 위해 생성 시각과 수정 시각을 기본으로 둔다.

### 7-2. users 테이블

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | uuid | PRIMARY KEY | 사용자 고유 식별자 |
| email | text | UNIQUE NOT NULL | 로그인 이메일 |
| password_hash | text | NOT NULL | 비밀번호 해시 |
| name | text | NOT NULL | 화면에 표시할 이름 |
| created_at | timestamptz | DEFAULT now() | 생성 시각 |
| updated_at | timestamptz | DEFAULT now() | 수정 시각 |

### 7-3. posts 테이블

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | uuid | PRIMARY KEY | 게시글 고유 식별자 |
| author_id | uuid | NOT NULL, FK -> users.id | 작성자 |
| title | text | NOT NULL | 제목 |
| content | text | NOT NULL | 본문 |
| is_published | boolean | DEFAULT true | 공개 여부 |
| created_at | timestamptz | DEFAULT now() | 생성 시각 |
| updated_at | timestamptz | DEFAULT now() | 수정 시각 |

### 7-4. 관계

```
users (1) ---- (N) posts
posts.author_id -> users.id
```

- 한 명의 사용자는 여러 개의 게시글을 가질 수 있다.
- 각 게시글은 정확히 한 명의 작성자에 속한다.
- 마이페이지는 이 관계를 이용해 "내가 쓴 글" 목록을 표시한다.

### 7-5. 조회 기준

- 홈과 목록 페이지는 `is_published = true`인 게시글을 기본으로 보여준다.
- 상세 페이지와 수정/삭제는 `id`와 `author_id`를 함께 기준으로 검증한다.
- 마이페이지는 현재 로그인한 사용자의 `author_id`와 일치하는 게시글만 다룬다.

### 7-6. 권장 인덱스

- posts(author_id)
- posts(created_at desc)
- posts(is_published)

## 8. 인증 설계 (이메일/비밀번호)

- 인증 제공자: Supabase Auth (Email + Password)
- 로그인 엔드포인트: /login
- 회원가입 엔드포인트: /signup
- 세션 관리: 서버에서 세션 확인 후 보호 라우트 접근 제어
- 작성/수정/삭제 권한: 로그인 사용자만 허용, 작성자 본인만 수정/삭제

인증 흐름:

1. 사용자가 /login에서 email/password 입력
2. Supabase Auth로 signIn 요청
3. 성공 시 세션 생성 후 /posts 또는 /mypage로 이동
4. 서버 액션/라우트 핸들러에서 세션 사용자 ID 검증

## 9. 페이지별 주요 컴포넌트와 데이터 흐름

현재 구현된 페이지를 기준으로 주요 컴포넌트와 데이터 흐름을 정리한다.

### 9-1. 홈 (/)

- 주요 컴포넌트: Button, Card, CardHeader, CardContent
- 데이터 흐름: 정적 UI 중심, 링크 클릭 시 /posts 또는 /posts/new로 이동

### 9-2. 포스트 목록 (/posts)

- 주요 컴포넌트: Button, Card, CardHeader, CardTitle, CardContent, CardFooter
- 데이터 흐름:
  1. Server Component에서 저장소 조회 (현재: lib/post-repository.ts)
  2. 조회 결과를 카드 리스트로 렌더링
  3. 카드 클릭 또는 버튼 클릭으로 /posts/[id] 이동

### 9-3. 포스트 작성 (/posts/new)

- 주요 컴포넌트: Input, textarea, Button
- 데이터 흐름:
  1. 사용자가 title/content 입력
  2. form action(createPostAction) 호출
  3. 서버에서 유효성 검사 후 생성
  4. 목록 재검증(revalidatePath) 후 /posts/[id]로 redirect

### 9-4. 포스트 상세 (/posts/[id])

- 주요 컴포넌트: Button, Card, Dialog
- 데이터 흐름:
  1. 동적 라우트 파라미터(id)로 단건 조회
  2. 조회 성공 시 본문 렌더링
  3. 삭제 시 Dialog 확인 후 deletePostAction 실행
  4. 목록 재검증 후 /posts로 redirect

### 9-5. 로그인/회원가입 (/login, /signup)

- 주요 컴포넌트: Card, Input(email/password), Button
- 데이터 흐름:
  1. 이메일/비밀번호 입력
  2. Server Action에서 Supabase Auth 요청 (signInWithPassword/signUp)
  3. 성공 시 로그인은 /posts로 이동, 회원가입은 /login으로 이동

## 10. 마이그레이션 메모

- 현재 저장소: data/posts.json + lib/post-repository.ts
- 목표 저장소: Supabase PostgreSQL (users/posts)
- 전환 전략:
  1. DB 스키마 적용
  2. 저장소 레이어를 Supabase 쿼리 기반으로 교체
  3. 서버 액션 시그니처는 유지하여 페이지 변경 최소화
