# my-first-web

Ch1~6에서 만든 개인 블로그 프로젝트입니다.  
독자는 글을 읽고, 작성자는 로그인 후 글을 작성하고 관리할 수 있도록 만드는 것을 목표로 합니다.

## 프로젝트 목표

- 방문자는 글을 쉽게 찾고 편하게 읽는다.
- 작성자는 로그인 후 글을 작성, 수정, 삭제할 수 있다.
- 나중에 댓글, 검색, 마이페이지 같은 기능을 자연스럽게 추가할 수 있다.

## 주요 페이지

- `/` - 홈
- `/posts` - 글 목록
- `/posts/[id]` - 글 상세
- `/posts/new` - 글 작성
- `/posts/[id]/edit` - 글 수정
- `/login` - 로그인
- `/signup` - 회원가입
- `/mypage` - 마이페이지

## 문서

- [ARCHITECTURE.md](ARCHITECTURE.md) - 프로젝트 설계 방향
- [PAGE_MAP.md](PAGE_MAP.md) - 페이지 맵과 유저 플로우
- [SUPABASE_SETUP.md](SUPABASE_SETUP.md) - Supabase 연결 및 환경변수 설정
- [copilot-instructions.md](.github/copilot-instructions.md) - Copilot 작성 규칙

## 기술 스택

- Next.js 16.2.1 (App Router only)
- React 19.2.4
- TypeScript 5.x
- Tailwind CSS 4.x
- shadcn/ui

## 실행

개발 서버 실행:

```bash
npm run dev
```

브라우저에서 다음 주소를 엽니다.

```text
http://localhost:3000
```
