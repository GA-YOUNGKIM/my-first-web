# 부록 C. Context7 MCP 초기 설정

> **목적**: Copilot Agent 모드에서 Context7 MCP를 사용해 최신 공식 문서를 실시간으로 참조한다.  
> **소요 시간**: 약 10분 (최초 1회만 설정)

---

## C.1 Context7 MCP란

**Context7 MCP**는 AI가 공식 문서를 실시간으로 검색하게 해주는 도구이다.

기본 상태의 Copilot은 학습 시점까지의 데이터만 알고 있다. Context7 MCP를 연결하면 Copilot이 Next.js, Supabase, Tailwind CSS 등의 **현재 공식 문서**를 직접 조회한 뒤 코드를 작성한다.

**표 C.1** Context7 MCP 유무 비교

| 항목 | MCP 없을 때 | MCP 있을 때 |
|------|------------|------------|
| 참조 문서 | 학습 시점 데이터 (과거) | 현재 공식 문서 (실시간) |
| 버전 불일치 | 자주 발생 | 크게 감소 |
| 프롬프트 방식 | 버전 명시 필요 | `use context7` 한 마디로 해결 |

---

## C.2 사전 준비

- Node.js가 설치되어 있어야 한다 (Ch1에서 설치 완료)
- VS Code가 열려 있어야 한다

확인:
```bash
node --version
```
`v20` 이상이면 정상이다.

---

## C.3 VS Code에 Context7 MCP 등록

### C.3.1 명령 팔레트에서 등록

1. `Ctrl+Shift+P` (macOS: `Cmd+Shift+P`) 를 눌러 명령 팔레트 열기
2. `MCP: Add Server` 입력 후 Enter
3. 목록에서 **context7** 검색 → 선택

목록에 없으면 C.3.2 방법으로 직접 등록한다.

### C.3.2 설정 파일로 직접 등록

프로젝트 루트에 `.vscode/mcp.json` 파일을 생성한다:

```bash
mkdir .vscode
```

`.vscode/mcp.json` 내용:

```json
{
  "servers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

> **참고**: `mcp.json`은 `.gitignore`에 추가하지 않아도 된다. 토큰 등 민감 정보가 없기 때문이다.

### C.3.3 등록 확인

VS Code를 재시작한 뒤:
1. Copilot Chat 패널을 열고 **Agent 모드** 선택
2. 채팅 입력창 옆 **도구(Tools) 아이콘** 클릭
3. `context7` 항목이 목록에 표시되면 성공

---

## C.4 사용 방법

### C.4.1 기본 사용

Agent 모드 프롬프트 끝에 `use context7`을 붙인다:

```text
Next.js App Router에서 동적 라우트 params를 처리하는 방법을 알려줘. use context7
```

```text
Supabase로 실시간 구독(realtime subscription)을 구현해줘. use context7
```

Copilot이 공식 문서를 조회한 뒤 **현재 버전 기준의 정확한 코드**를 생성한다.

### C.4.2 라이브러리 지정

여러 라이브러리가 관련될 때는 어느 문서를 참조할지 명시한다:

```text
Next.js 15 + Supabase SSR 연동 코드를 작성해줘.
Next.js와 @supabase/ssr 공식 문서를 참조해줘. use context7
```

### C.4.3 버전 문제 검증

AI가 생성한 코드가 의심스러울 때:

```text
방금 제안한 코드가 현재 Next.js 최신 버전 기준으로 맞는지
공식 문서에서 확인해줘. use context7
```

---

## C.5 Quota 관리

> **학생 Pro 계정**: 월 300회 premium request 제한

Context7 MCP 도구 호출은 premium request를 소모한다. 효율적으로 사용한다:

**권장 사용 패턴**:
- 처음 접하는 API나 새 라이브러리 → `use context7` 붙이기
- 이미 잘 아는 기능, 단순한 질문 → `use context7` 생략

**잔여 quota 확인**:
- GitHub 프로필 → Settings → Billing & plans → Copilot 사용량 확인

---

## C.6 트러블슈팅

### MCP 서버가 시작되지 않을 때

```bash
npx -y @upstash/context7-mcp@latest
```

터미널에서 직접 실행해보고 에러 메시지를 확인한다. `npx` 실행 권한 문제라면:

```bash
npm install -g @upstash/context7-mcp
```

전역 설치 후 `.vscode/mcp.json`의 `command`를 `"node"`, `args`를 `["node_modules/.bin/context7-mcp"]`로 변경한다.

### `context7` 도구가 목록에 안 보일 때

1. VS Code 완전 종료 후 재시작
2. `.vscode/mcp.json` 파일이 프로젝트 **루트**에 있는지 확인 (하위 폴더 아님)
3. JSON 문법 오류 확인 — 중괄호, 따옴표가 올바른지 점검

### `use context7` 후 문서를 찾지 못할 때

라이브러리 이름을 좀 더 구체적으로 명시한다:

```text
# 이것보다
supabase 사용법 알려줘. use context7

# 이것이 더 잘 됨
@supabase/ssr 0.5.x의 createServerClient 사용법 알려줘. use context7
```
