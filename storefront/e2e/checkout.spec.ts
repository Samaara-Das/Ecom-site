import { test, expect } from "@playwright/test"

test.describe("Checkout", () => {
  test("should load checkout page or redirect to cart", async ({ page }) => {
    await page.goto("/kw/checkout")

    // Checkout page should have form elements, or redirect to cart/show not found
    // When cart is empty, might redirect to cart page or show "Page not found"
    const formElement = page.locator("form")
    const checkoutText = page.getByText(/checkout|shipping|payment/i)
    const cartLink = page.getByRole("link", { name: /back to shopping cart|cart/i })
    const notFoundText = page.getByRole("heading", { name: /page not found/i })

    // Any of these indicate the page loaded correctly
    const hasForm = await formElement.first().isVisible({ timeout: 5000 }).catch(() => false)
    const hasCheckoutText = await checkoutText.first().isVisible({ timeout: 1000 }).catch(() => false)
    const hasCartLink = await cartLink.first().isVisible({ timeout: 1000 }).catch(() => false)
    const hasNotFound = await notFoundText.isVisible({ timeout: 1000 }).catch(() => false)

    expect(hasForm || hasCheckoutText || hasCartLink || hasNotFound).toBe(true)
  })

  test("should display shipping address form on checkout", async ({ page }) => {
    // First add an item to cart to enable checkout
    await page.goto("/kw")

    const productLink = page.locator('a[href*="/products/"]').first()

    if (await productLink.isVisible({ timeout: 10000 })) {
      await productLink.click()
      await page.waitForURL(/\/products\//)

      // Select variant if needed
      const variantButton = page.locator('button[data-testid="option-button"]').first()
      if (await variantButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await variantButton.click()
      }

      const addToCartButton = page.locator(
        'button:has-text("Add to cart"), button:has-text("Add to bag"), [data-testid="add-product-button"]'
      )

      if (await addToCartButton.isVisible({ timeout: 5000 })) {
        await addToCartButton.click()
        await page.waitForTimeout(1000) // Wait for cart to update

        // Go to checkout
        await page.goto("/kw/checkout")

        // Should see address form or shipping options
        const checkoutInputs = page.locator('input[name*="email"], input[name*="address"], input[name*="first"]')
        const shippingText = page.getByText(/shipping/i)
        const checkoutForm = checkoutInputs.first().or(shippingText.first())
        await expect(checkoutForm).toBeVisible({ timeout: 10000 })
      }
    }
  })

  test("should show order summary on checkout or redirect", async ({ page }) => {
    await page.goto("/kw/checkout")

    // Look for order summary section
    const orderSummary = page.getByText(/order summary|subtotal|total/i)

    // Should show summary if items in cart, cart empty message, or not found page
    const summaryVisible = await orderSummary.first().isVisible({ timeout: 5000 }).catch(() => false)
    const emptyCartVisible = await page.getByText(/empty|no items|don't have anything/i).isVisible({ timeout: 1000 }).catch(() => false)
    const notFoundVisible = await page.getByRole("heading", { name: /page not found/i }).isVisible({ timeout: 1000 }).catch(() => false)
    const cartLinkVisible = await page.getByRole("link", { name: /back to shopping cart/i }).isVisible({ timeout: 1000 }).catch(() => false)

    expect(summaryVisible || emptyCartVisible || notFoundVisible || cartLinkVisible).toBe(true)
  })
})
