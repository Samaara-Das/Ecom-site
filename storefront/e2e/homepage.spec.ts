import { test, expect } from '@playwright/test';

test.describe('Storefront Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');

    // Verify page title
    await expect(page).toHaveTitle('Kuwait Marketplace');
  });

  test('should display marketplace heading', async ({ page }) => {
    await page.goto('/');

    // Verify main heading is present
    const heading = page.getByRole('heading', { level: 1, name: 'Kuwait Marketplace' });
    await expect(heading).toBeVisible();
  });

  test('should display coming soon message', async ({ page }) => {
    await page.goto('/');

    // Verify coming soon paragraph
    const comingSoonText = page.getByText('Multi-vendor marketplace coming soon');
    await expect(comingSoonText).toBeVisible();
  });

  test('should have proper page structure', async ({ page }) => {
    await page.goto('/');

    // Verify main element exists
    const main = page.locator('main');
    await expect(main).toBeVisible();

    // Verify main has flex layout classes
    await expect(main).toHaveClass(/flex/);
    await expect(main).toHaveClass(/min-h-screen/);
  });

  test('should have no critical console errors', async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Ignore favicon errors as they are non-critical
        if (!text.includes('favicon.ico')) {
          consoleErrors.push(text);
        }
      }
    });

    await page.goto('/');

    // Wait for page to stabilize
    await page.waitForLoadState('networkidle');

    // Should have no critical errors (excluding favicon)
    expect(consoleErrors).toHaveLength(0);
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/');

    // Verify content is still visible on mobile
    const heading = page.getByRole('heading', { level: 1, name: 'Kuwait Marketplace' });
    await expect(heading).toBeVisible();
  });
});
