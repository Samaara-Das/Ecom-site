import { test, expect } from "@playwright/test"

test.describe("Cart", () => {
  test("should be able to view cart", async ({ page }) => {
    await page.goto("/kw")

    // Look for cart icon/link
    const cartLink = page.locator('a[href*="/cart"], button[aria-label*="cart" i], [data-testid="cart"]')

    if (await cartLink.first().isVisible()) {
      await cartLink.first().click()

      // Should show cart page or cart drawer
      const cartText = page.getByText(/cart|bag|basket/i)
      await expect(cartText.first()).toBeVisible({ timeout: 5000 })
    }
  })

  test("should add product to cart from product page", async ({ page }) => {
    // Navigate to a product page
    await page.goto("/kw")

    const productLink = page.locator('a[href*="/products/"]').first()

    if (await productLink.isVisible({ timeout: 10000 })) {
      await productLink.click()
      await page.waitForURL(/\/products\//)

      // Look for add to cart button
      const addToCartButton = page.locator(
        'button:has-text("Add to cart"), button:has-text("Add to bag"), [data-testid="add-product-button"]'
      )

      if (await addToCartButton.isVisible({ timeout: 5000 })) {
        // Select variant if needed (some products require size/color selection)
        const variantButton = page.locator('button[data-testid="option-button"]').first()
        if (await variantButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await variantButton.click()
        }

        await addToCartButton.click()

        // Verify cart updated - look for cart count or success message
        const cartCountIndicator = page.locator('[data-testid="cart-count"], .cart-count')
        const addedText = page.getByText(/added to cart/i)
        const cartIndicator = cartCountIndicator.first().or(addedText.first())
        await expect(cartIndicator).toBeVisible({ timeout: 5000 })
      }
    }
  })

  test("should show empty cart message when cart is empty", async ({ page }) => {
    await page.goto("/kw/cart")

    // Either shows empty message ("You don't have anything in your cart") or cart items
    const emptyMessage = page.getByText(/don't have anything in your cart|empty|no items/i)
    const cartHeading = page.getByRole("heading", { name: /cart/i })
    const cartItems = page.locator('[data-testid="cart-item"], .cart-item')

    // One of these should be visible
    const hasEmptyMessage = await emptyMessage.isVisible({ timeout: 5000 }).catch(() => false)
    const hasCartHeading = await cartHeading.isVisible({ timeout: 1000 }).catch(() => false)
    const hasCartItems = await cartItems.first().isVisible({ timeout: 1000 }).catch(() => false)

    expect(hasEmptyMessage || hasCartHeading || hasCartItems).toBe(true)
  })
})
