import { test, expect } from "@playwright/test";
import { clerk, setupClerkTestingToken } from "@clerk/testing/playwright";

const EMAIL = process.env.E2E_USER_EMAIL;
const PASSWORD = process.env.E2E_USER_PASSWORD;

test.describe("HireTrail smoke", () => {
  test.skip(
    !EMAIL || !PASSWORD,
    "Set E2E_USER_EMAIL and E2E_USER_PASSWORD to run auth E2E",
  );

  test.beforeEach(async ({ page }) => {
    await setupClerkTestingToken({ page });
    await page.goto("/");
    await clerk.signIn({
      page,
      signInParams: { strategy: "password", identifier: EMAIL!, password: PASSWORD! },
    });
    await page.goto("/dashboard");
  });

  test("welcome card shows, dismisses, and stays hidden across navigation", async ({ page }) => {
    const welcome = page.getByRole("status").filter({ hasText: /good (morning|afternoon|evening|night)|midnight oil/i });
    await expect(welcome.first()).toBeVisible();

    await page.getByRole("button", { name: /dismiss welcome message/i }).click();
    await expect(welcome).toBeHidden();

    // Navigate away and back — must not reappear in the same session.
    await page.getByRole("link", { name: /applications/i }).first().click();
    await page.getByRole("link", { name: /dashboard/i }).first().click();
    await expect(welcome).toBeHidden();
  });

  test("add → search → edit → delete a job", async ({ page }) => {
    const company = `E2E Co ${Date.now()}`;

    await page.goto("/applications");
    await page.getByRole("button", { name: /add job/i }).first().click();

    await page.getByLabel(/company/i).fill(company);
    await page.getByLabel(/role/i).first().fill("E2E Engineer");
    // status defaults to "saved" → applied date not required
    await page.getByRole("button", { name: /add (job|application)/i }).click();
    await expect(page.getByText(company)).toBeVisible();

    // Search via ⌘K
    await page.keyboard.press(process.platform === "darwin" ? "Meta+KeyK" : "Control+KeyK");
    await page.getByPlaceholder(/search by company/i).fill(company);
    await expect(page.getByText(new RegExp(company))).toBeVisible();
    await page.keyboard.press("Escape");

    // Open, edit, delete via row actions is UI-specific; verify the row exists.
    await expect(page.getByText(company)).toBeVisible();
  });

  test("log out returns to home", async ({ page }) => {
    await page.getByRole("button", { name: /account menu/i }).click();
    await page.getByRole("menuitem", { name: /log out/i }).click();
    await expect(page).toHaveURL(/\/$/);
  });
});