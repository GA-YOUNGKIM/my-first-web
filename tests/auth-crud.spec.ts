import { test, expect, chromium } from '@playwright/test';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';

test.describe('인증 및 게시글 CRUD', () => {
  test('성공 경로: 로그인 → 새 글 작성 → 목록에서 확인', async ({ page }) => {
    const email = process.env.TEST_EMAIL;
    const password = process.env.TEST_PASSWORD;

    if (!email || !password) {
      test.skip(true, 'TEST_EMAIL 또는 TEST_PASSWORD 환경변수가 설정되지 않았습니다.');
      return;
    }

    // 1. /login 이동 후 로그인
    await page.goto(`${BASE_URL}/login`);
    await expect(page).toHaveURL(/\/login/);

    await page.getByLabel('이메일').fill(email);
    await page.getByLabel('비밀번호').fill(password);
    await page.getByRole('button', { name: '로그인' }).click();

    // 로그인 성공 → /posts 리다이렉트 대기
    await page.waitForURL(/\/posts$/, { timeout: 10_000 });
    await expect(page).toHaveURL(/\/posts$/);

    // 2. /posts/new 이동 → 제목/내용 입력 후 저장
    await page.goto(`${BASE_URL}/posts/new`);
    await expect(page).toHaveURL(/\/posts\/new/);

    const uniqueTitle = `E2E 테스트 글 ${Date.now()}`;
    const testContent = 'Playwright E2E 테스트로 작성된 내용입니다. 자동화 검증 중입니다.';

    await page.getByLabel('제목').fill(uniqueTitle);
    await page.getByLabel('내용').fill(testContent);

    await page.getByRole('button', { name: '게시글 저장하기' }).click();

    // 저장 후 상세 페이지로 이동 대기
    await page.waitForURL(/\/posts\/.+/, { timeout: 10_000 });
    await expect(page).toHaveURL(/\/posts\/.+/);

    // 3. /posts 목록에서 새 글 제목 확인
    await page.goto(`${BASE_URL}/posts`);
    await expect(page.getByText(uniqueTitle)).toBeVisible({ timeout: 10_000 });
  });

  test('실패/제한 경로: 비로그인 상태에서 /posts/new 접근 시 /login 리다이렉트', async () => {
    // 격리된 새 브라우저 컨텍스트 사용 (쿠키/세션 없음)
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      await page.goto(`${BASE_URL}/posts/new`);

      // 미들웨어가 /login으로 리다이렉트하는지 URL 검증
      await page.waitForURL(/\/login/, { timeout: 10_000 });
      await expect(page).toHaveURL(/\/login/);
    } finally {
      await context.close();
      await browser.close();
    }
  });
});