import { test, expect } from '@playwright/test';

test.describe('Auth and Post CRUD', () => {
  test('Happy Path: 로그인, 새 글 작성 후 목록에서 확인', async ({ page }) => {
    const email = process.env.TEST_EMAIL;
    const password = process.env.TEST_PASSWORD;

    if (!email || !password) {
      test.skip(true, 'TEST_EMAIL or TEST_PASSWORD environment variables are not set');
      return;
    }

    // 1. /login에서 TEST_EMAIL, TEST_PASSWORD 환경변수로 로그인
    await page.goto('/login');
    
    await page.getByLabel('이메일').fill(email);
    await page.getByLabel('비밀번호').fill(password);
    await page.getByRole('button', { name: '로그인' }).click();

    // 로그인 완료 후 /posts 로 리다이렉트 되는 것을 기다림 (안정성 확보)
    await expect(page).toHaveURL(/.*\/posts/);

    // 2. /posts/new에서 제목/내용 입력 후 저장
    await page.goto('/posts/new');

    const testTitle = `테스트 제목 ${Date.now()}`;
    const testContent = `이것은 Playwright E2E 테스트를 통해 작성된 내용입니다.\n테스트 시간: ${new Date().toISOString()}`;

    await page.getByLabel('제목').fill(testTitle);
    await page.getByLabel('내용').fill(testContent);
    await page.getByRole('button', { name: '게시글 저장하기' }).click();

    // 글 저장 후 상세 페이지(/posts/[id])로 리다이렉트 됨
    await expect(page).toHaveURL(/.*\/posts\/.+/);

    // 3. /posts 목록에서 새 글 제목 확인
    await page.goto('/posts');
    await expect(page.getByText(testTitle)).toBeVisible();
  });

  test('Rejection Path: 비로그인 상태에서 /posts/new 접근 시 리다이렉트', async ({ page }) => {
    // 1. 로그아웃 또는 새 브라우저 컨텍스트
    // Playwright의 test는 기본적으로 각 테스트마다 격리된 브라우저 컨텍스트를 제공하므로
    // 별도의 로그아웃 과정 없이 비로그인 상태로 시작합니다.
    
    // 2. /posts/new 접속
    await page.goto('/posts/new');

    // 3. /login으로 리다이렉트되는지 확인
    await expect(page).toHaveURL(/.*\/login/);
  });
});