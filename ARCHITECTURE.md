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
| 로그인 | /login | 이메일/비밀번호 로그인 | 예정 |

### 라우팅 메모 (App Router)

- app/page.tsx -> /
- app/posts/page.tsx -> /posts
- app/posts/new/page.tsx -> /posts/new
- app/posts/[id]/page.tsx -> /posts/[id]
- app/login/page.tsx -> /login (예정)

## 4. shadcn/ui 컴포넌트 계층

### 4-1. 전역 계층

```
app/layout.tsx
└─ Root Layout
    └─ Page Container
        ├─ Header 영역 (Button 링크)
        ├─ Main 영역 (페이지별 콘텐츠)
        └─ Footer 영역
```

### 4-2. 페이지별 계층

#### 홈 (/)

```
HomePage
└─ Section
    ├─ Hero
    │  ├─ Button (포스트 목록 이동)
    │  └─ Button (포스트 작성 이동)
    └─ Feature Grid
        ├─ Card
        │  ├─ CardHeader
        │  └─ CardContent
        └─ Card
            ├─ CardHeader
            └─ CardContent
```

#### 포스트 목록 (/posts)

```
PostsPage
└─ Section
    ├─ Header Row
    │  └─ Button (새 글 쓰기)
    └─ Post Grid
        └─ Post Card (N)
            ├─ CardHeader
            │  └─ CardTitle (포스트 링크)
            ├─ CardContent (요약)
            └─ CardFooter
                └─ Button (글 읽기)
```

#### 포스트 작성 (/posts/new)

```
NewPostPage
└─ Form
    ├─ Input (title)
    ├─ textarea (content)
    └─ Action Row
        ├─ Button (저장)
        └─ Button (취소)
```

#### 포스트 상세 (/posts/[id])

```
PostDetailPage
└─ Wrapper
    ├─ Button (목록으로)
    ├─ Card (본문)
    │  ├─ CardHeader
    │  └─ CardContent
    └─ Action Row
        ├─ Button (수정)
        └─ Dialog
            ├─ DialogTrigger (삭제 버튼)
            └─ DialogContent (삭제 확인)
```

#### 로그인 (/login, 예정)

```
LoginPage
└─ Card
    ├─ CardHeader
    ├─ CardContent
    │  ├─ Input (email)
    │  └─ Input (password)
    └─ CardFooter
        └─ Button (로그인)
```

## 5. 디자인 토큰 (Tailwind + CSS 변수)

토큰은 app/globals.css에 정의된 CSS 변수를 기준으로 사용한다.

### 5-1. 핵심 컬러 토큰

- 배경: bg-background
- 본문 텍스트: text-foreground
- 카드 배경: bg-card
- 보조 배경: bg-muted
- 보조 텍스트: text-muted-foreground
- 주요 액션: bg-primary / text-primary-foreground
- 테두리: border-border
- 입력: border-input
- 포커스 링: ring-ring

### 5-2. 공통 레이아웃 토큰

- 메인 폭: max-w-4xl mx-auto
- 카드 내부 기본 여백: p-6
- 섹션 간 간격: space-y-6
- 반응형 그리드: grid-cols-1 md:grid-cols-2

## 6. 데이터베이스 스키마 (Supabase PostgreSQL)

요구 스키마: users, posts 테이블 + FK 관계.

### 6-1. users

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | uuid | PRIMARY KEY | 사용자 고유 ID |
| email | text | UNIQUE NOT NULL | 로그인 이메일 |
| password_hash | text | NOT NULL | 비밀번호 해시 |
| name | text | NOT NULL | 표시 이름 |
| created_at | timestamptz | DEFAULT now() | 생성 시각 |
| updated_at | timestamptz | DEFAULT now() | 수정 시각 |

### 6-2. posts

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | uuid | PRIMARY KEY | 포스트 고유 ID |
| author_id | uuid | NOT NULL, FK -> users.id | 작성자 |
| title | text | NOT NULL | 제목 |
| content | text | NOT NULL | 본문 |
| is_published | boolean | DEFAULT true | 공개 여부 |
| created_at | timestamptz | DEFAULT now() | 작성 시각 |
| updated_at | timestamptz | DEFAULT now() | 수정 시각 |

### 6-3. FK 관계

```
users (1) ---- (N) posts
posts.author_id -> users.id
```

### 6-4. 권장 인덱스

- posts(author_id)
- posts(created_at desc)
- posts(is_published)

## 7. 인증 설계 (이메일/비밀번호)

- 인증 제공자: Supabase Auth (Email + Password)
- 로그인 엔드포인트: /login (예정)
- 세션 관리: 서버에서 세션 확인 후 보호 라우트 접근 제어
- 작성/수정/삭제 권한: 로그인 사용자만 허용, 작성자 본인만 수정/삭제

인증 흐름:

1. 사용자가 /login에서 email/password 입력
2. Supabase Auth로 signIn 요청
3. 성공 시 세션 생성 후 /posts 또는 /mypage로 이동
4. 서버 액션/라우트 핸들러에서 세션 사용자 ID 검증

## 8. 페이지별 주요 컴포넌트와 데이터 흐름

### 8-1. 홈 (/)

- 주요 컴포넌트: Button, Card, CardHeader, CardContent
- 데이터 흐름: 정적 UI 중심, 링크 클릭 시 /posts 또는 /posts/new로 이동

### 8-2. 포스트 목록 (/posts)

- 주요 컴포넌트: Button, Card, CardHeader, CardTitle, CardContent, CardFooter
- 데이터 흐름:
  1. Server Component에서 저장소 조회 (현재: lib/post-repository.ts)
  2. 조회 결과를 카드 리스트로 렌더링
  3. 카드 클릭 또는 버튼 클릭으로 /posts/[id] 이동

### 8-3. 포스트 작성 (/posts/new)

- 주요 컴포넌트: Input, textarea, Button
- 데이터 흐름:
  1. 사용자가 title/content 입력
  2. form action(createPostAction) 호출
  3. 서버에서 유효성 검사 후 생성
  4. 목록 재검증(revalidatePath) 후 /posts/[id]로 redirect

### 8-4. 포스트 상세 (/posts/[id])

- 주요 컴포넌트: Button, Card, Dialog
- 데이터 흐름:
  1. 동적 라우트 파라미터(id)로 단건 조회
  2. 조회 성공 시 본문 렌더링
  3. 삭제 시 Dialog 확인 후 deletePostAction 실행
  4. 목록 재검증 후 /posts로 redirect

### 8-5. 로그인 (/login, 예정)

- 주요 컴포넌트: Card, Input(email/password), Button
- 데이터 흐름:
  1. 이메일/비밀번호 입력
  2. Supabase Auth 로그인 요청
  3. 성공 시 세션 저장 및 보호 페이지 이동

## 9. 마이그레이션 메모

- 현재 저장소: data/posts.json + lib/post-repository.ts
- 목표 저장소: Supabase PostgreSQL (users/posts)
- 전환 전략:
  1. DB 스키마 적용
  2. 저장소 레이어를 Supabase 쿼리 기반으로 교체
  3. 서버 액션 시그니처는 유지하여 페이지 변경 최소화
