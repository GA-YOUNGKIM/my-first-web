import { test, expect } from '@playwright/test';

test.describe('Auth and CRUD E2E Tests', () => {
  test('행복 경로', async ({ page }) => {
    // 1. /login에서 TEST_EMAIL, TEST_PASSWORD 환경변수로 로그인
    await page.goto('/login');
    
    const email = process.env.TEST_EMAIL;
    const password = process.env.TEST_PASSWORD;

    if (!email || !password) {
      test.skip(true, 'TEST_EMAIL and TEST_PASSWORD environment variables must be set.');
      return;
    }

    await page.getByLabel('이메일').fill(email);
    await page.getByLabel('비밀번호').fill(password);
    await page.getByRole('button', { name: '로그인', exact: true }).click();

    // 로그인이 완료될 때까지 대기 (예: /posts로 이동)
    await page.waitForURL(/.*\/posts.*/);

    // 2. /posts/new에서 제목/내용 입력 후 저장
    await page.goto('/posts/new');
    
    const timestamp = Date.now();
    const testTitle = `Test Post Title ${timestamp}`;
    const testContent = `This is a test post content created at ${new Date(timestamp).toISOString()}`;

    await page.getByLabel('제목').fill(testTitle);
    await page.getByLabel('내용').fill(testContent);
    await page.getByRole('button', { name: '게시글 저장하기' }).click();

    // 저장이 완료되어 상세 페이지 등으로 이동할 때까지 대기
    await page.waitForURL(/.*\/posts\/.+/);

    // 3. /posts 목록에서 새 글 제목 확인
    await page.goto('/posts');
    
    // 새 글 제목이 화면에 보이는지 확인 (링크 역할로 찾기)
    await expect(page.getByRole('link', { name: testTitle })).toBeVisible();
  });

  test('거절 경로', async ({ page }) => {
    // 1. 로그아웃 또는 새 브라우저 컨텍스트
    // Playwright의 각 test 블록은 기본적으로 새롭고 독립된 브라우저 컨텍스트를 사용하므로
    // 별도의 로그아웃 과정 없이 비로그인 상태로 시작됩니다.
    
    // 2. /posts/new 접속
    await page.goto('/posts/new');

    // 3. /login으로 리다이렉트되는지 확인
    await expect(page).toHaveURL(/.*\/login(\?|$)/);
  });
});