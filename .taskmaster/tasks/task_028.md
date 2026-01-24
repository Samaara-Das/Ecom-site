# Task ID: 28

**Title:** Build Cart Page

**Status:** pending

**Dependencies:** 27

**Priority:** high

**Description:** Create full cart page with detailed view, vendor groups, and checkout button.

**Details:**

Framework Context:
- Use /senior-developer skill

Implementation Steps:
1. Create app/(shop)/cart/page.tsx
2. Display full cart with vendor groups
3. Add order summary sidebar
4. Add promo code input
5. Add Proceed to Checkout button

Files:
- storefront/app/(shop)/cart/page.tsx
- storefront/components/cart/OrderSummary.tsx
- storefront/components/cart/PromoCodeInput.tsx

**Test Strategy:**

Playwright Verification:
- mcp-cli call playwright/browser_navigate '{"url": "http://localhost:3000/cart"}'
- mcp-cli call playwright/browser_snapshot '{}'

Acceptance:
- [ ] Full cart displays
- [ ] Summary calculates correctly
- [ ] Checkout button works

Auto-Commit: /auto-commit
