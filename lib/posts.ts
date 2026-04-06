export type Post = {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
};

export const posts: Post[] = [
  {
    id: 1,
    title: "Next.js App Router 시작하기",
    content: "Next.js 16의 App Router는 서버 컴포넌트를 기본으로 사용합니다. 파일 기반 라우팅과 레이아웃 중첩을 통해 효율적인 UI 구성을 지원합니다.",
    author: "김가영",
    date: "2026-04-01",
  },
  {
    id: 2,
    title: "Tailwind CSS 4로 스타일링하기",
    content: "Tailwind CSS 4는 @import 'tailwindcss' 한 줄로 설정이 완료됩니다. 유틸리티 클래스를 활용해 빠르고 일관된 UI를 만들 수 있습니다.",
    author: "김가영",
    date: "2026-04-03",
  },
  {
    id: 3,
    title: "TypeScript로 타입 안전한 코드 작성",
    content: "TypeScript를 사용하면 컴파일 타임에 타입 오류를 잡을 수 있습니다. 인터페이스와 타입 별칭을 잘 활용하면 유지보수성이 크게 향상됩니다.",
    author: "김가영",
    date: "2026-04-05",
  },
];
