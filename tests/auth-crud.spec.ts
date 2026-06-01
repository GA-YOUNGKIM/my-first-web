import { test, expect, type Page } from "@playwright/test";

const TEST_EMAIL = process.env.TEST_EMAIL;
const TEST_PASSWORD = process.env.TEST_PASSWORD;
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? process.env.BASE_URL ?? "http://127.0.0.1:3000";

function appUrl(path: string): string {
  return new URL(path, BASE_URL).toString();
}

async function login(page: Page): Promise<void> {
  if (!TEST_EMAIL || !TEST_PASSWORD) {
    throw new Error("TEST_EMAIL and TEST_PASSWORD must be set.");
  }

  await page.goto(appUrl("/login"));
  await page.getByLabel("이메일").fill(TEST_EMAIL);
  await page.getByLabel("비밀번호").fill(TEST_PASSWORD);
  await page.getByRole("button", { name: "로그인" }).click();

  await expect(page).toHaveURL(/\/posts\/?$/);
}

test.describe("auth crud e2e", () => {
  test.skip(!TEST_EMAIL || !TEST_PASSWORD, "Set TEST_EMAIL and TEST_PASSWORD to run auth E2E tests.");

  test("행복 경로", async ({ page }, testInfo) => {
    const uniqueTitle = `E2E 게시글 ${testInfo.project.name} ${Date.now()}`;
    const uniqueContent = `${uniqueTitle} 내용을 확인하기 위한 E2E 테스트 본문입니다.`;

    await login(page);

    await page.goto(appUrl("/posts/new"));
    await expect(page).toHaveURL(/\/posts\/new$/);

    await page.getByLabel("제목").fill(uniqueTitle);
    await page.getByLabel("내용").fill(uniqueContent);
    await page.getByRole("button", { name: "게시글 저장하기" }).click();

    await expect(page).toHaveURL(/\/posts\/[^/]+$/);

    await page.goto(appUrl("/posts"));
    await expect(page.getByRole("link", { name: uniqueTitle })).toBeVisible();
  });

  test("거절 경로", async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      await page.goto(appUrl("/posts/new"));

      await expect(page).toHaveURL(/\/login(\?|$)/);
      await expect(page.getByRole("heading", { name: "로그인" })).toBeVisible();
    } finally {
      await context.close();
    }
  });
});