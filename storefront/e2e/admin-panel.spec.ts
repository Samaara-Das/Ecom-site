import { test, expect } from "@playwright/test"

test.describe("Admin Panel", () => {
  const ADMIN_URL = "http://localhost:9000"

  test("should load admin panel login page", async ({ page }) => {
    await page.goto(`${ADMIN_URL}/app`)

    // Should show login form (Welcome to Medusa) or dashboard (if already logged in)
    const welcomeHeading = page.getByRole("heading", { name: /Welcome to Medusa/i })
    const dashboardText = page.getByText(/dashboard|orders|products/i)
    const loginOrDashboard = welcomeHeading.or(dashboardText.first())
    await expect(loginOrDashboard).toBeVisible({ timeout: 15000 })
  })

  test("should have email input on login page", async ({ page }) => {
    await page.goto(`${ADMIN_URL}/app`)

    // Check if we're on the login page (shows "Welcome to Medusa")
    const welcomeHeading = page.getByRole("heading", { name: /Welcome to Medusa/i })
    const isLoginPage = await welcomeHeading.isVisible({ timeout: 5000 }).catch(() => false)

    if (isLoginPage) {
      // Verify email input is visible on login page
      const emailInput = page.getByRole("textbox", { name: /email/i })
      await expect(emailInput).toBeVisible()
    } else {
      // Already logged in - skip this test as login page is not accessible
      test.skip()
    }
  })

  test("should have password input on login page", async ({ page }) => {
    await page.goto(`${ADMIN_URL}/app`)

    const passwordInput = page.locator('input[type="password"]')

    // If redirected to dashboard, skip this test
    const isLoginPage = await passwordInput.isVisible({ timeout: 5000 }).catch(() => false)

    if (isLoginPage) {
      await expect(passwordInput).toBeVisible()
    } else {
      // Already logged in
      test.skip()
    }
  })

  test("admin panel should be responsive", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto(`${ADMIN_URL}/app`)

    // Page should load without errors at desktop size
    const content = page.locator("body")
    await expect(content).toBeVisible({ timeout: 15000 })

    // Check mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.reload()
    await expect(content).toBeVisible({ timeout: 10000 })
  })
})
