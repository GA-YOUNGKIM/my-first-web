# 부록 A. GitHub 인증 트러블슈팅

> **이 부록을 참고해야 하는 경우**: `git push` 시 인증 오류가 발생하거나, GitHub 로그인이 되지 않을 때

---

## A.1 인증 방식 선택

GitHub 인증 방식은 두 가지이다. 편한 방법을 선택한다.

| 방식 | 난이도 | 권장 상황 |
|------|--------|----------|
| **GitHub CLI** (`gh auth login`) | ★☆☆ 쉬움 | 처음 설정하는 경우 |
| **Personal Access Token (PAT)** | ★★☆ 보통 | CLI 설치가 어려운 경우 |

---

## A.2 방법 1: GitHub CLI로 인증 (권장)

### A.2.1 GitHub CLI 설치

**Windows**:
```bash
winget install GitHub.cli
```

설치 후 터미널을 **새로 열고** 버전을 확인한다:
```bash
gh --version
```

**macOS**:
```bash
brew install gh
```

### A.2.2 로그인

```bash
gh auth login
```

터미널에 다음 질문이 순서대로 나온다:

```text
? What account do you want to log into?  → GitHub.com 선택
? What is your preferred protocol?       → HTTPS 선택
? Authenticate Git with your GitHub credentials? → Y
? How would you like to authenticate?    → Login with a web browser 선택
```

**Login with a web browser**를 선택하면:
1. 8자리 코드가 터미널에 표시된다 (예: `ABCD-1234`)
2. 브라우저가 자동으로 열린다
3. GitHub에서 코드를 입력하고 **Authorize** 클릭
4. 터미널에 `✓ Logged in as [GitHub 아이디]`가 나오면 완료

### A.2.3 인증 확인

```bash
gh auth status
```

`Logged in to github.com as [아이디]`가 표시되면 정상이다.

---

## A.3 방법 2: Personal Access Token(PAT) 생성

### A.3.1 PAT 생성

1. GitHub 접속 → 오른쪽 상단 프로필 사진 클릭 → **Settings**
2. 왼쪽 사이드바 맨 아래 **Developer settings** 클릭
3. **Personal access tokens** → **Tokens (classic)** 클릭
4. **Generate new token** → **Generate new token (classic)** 클릭
5. 설정:
   - **Note**: `웹수업용` (이름은 자유)
   - **Expiration**: `90 days` 선택
   - **Scopes**: `repo` 체크박스에 체크 (전체 repo 권한)
6. 하단 **Generate token** 클릭
7. 생성된 토큰(`ghp_`로 시작하는 문자열)을 **즉시 복사** — 페이지를 벗어나면 다시 볼 수 없다

> **보안 주의**: 토큰을 코드에 직접 붙여넣거나 GitHub에 커밋하면 안 된다. 메모장 등에 임시 저장한다.

### A.3.2 PAT로 git push 인증

`git push` 실행 시 아이디/비밀번호를 묻는 창이 뜨면:
- **Username**: GitHub 아이디
- **Password**: PAT 붙여넣기 (비밀번호가 아님)

### A.3.3 Windows 자격 증명 관리자에 저장 (선택)

매번 입력하지 않으려면:
```bash
git config --global credential.helper manager
```

이후 한 번 PAT로 인증하면 Windows 자격 증명 관리자에 저장되어 자동 로그인된다.

---

## A.4 자주 발생하는 에러

### `remote: Support for password authentication was removed`

비밀번호로 인증을 시도한 경우이다. PAT를 사용해야 한다.

### `fatal: Authentication failed`

- PAT를 복사할 때 앞뒤 공백이 포함됐을 수 있다. 다시 복사한다.
- PAT가 만료됐을 수 있다. A.3.1 과정을 반복하여 새 토큰을 생성한다.

### `error: remote origin already exists`

```bash
git remote set-url origin https://github.com/[아이디]/[저장소명].git
```

### VS Code에서 로그인 창이 반복해서 뜰 때

```bash
git config --global credential.helper manager
gh auth login
```

두 명령어를 순서대로 실행한다.
