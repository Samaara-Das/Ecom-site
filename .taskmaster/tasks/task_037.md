# Task ID: 37

**Title:** Build Complete Checkout Flow

**Status:** pending

**Dependencies:** 29, 30, 35, 36

**Priority:** high

**Description:** Assemble full checkout with steps, progress indicator, and state management.

**Details:**

Framework Context:
- Use /senior-developer skill

Implementation Steps:
1. Create app/(shop)/checkout/page.tsx
2. Add step progress indicator
3. Manage checkout state
4. Handle step navigation
5. Complete order workflow

Files:
- storefront/app/(shop)/checkout/page.tsx
- storefront/components/checkout/CheckoutProgress.tsx
- storefront/hooks/useCheckout.ts

**Test Strategy:**

Playwright Verification:
- mcp-cli call playwright/browser_navigate '{"url": "http://localhost:3000/checkout"}'
- Complete full flow
- mcp-cli call playwright/browser_take_screenshot '{"type": "png", "filename": "checkout-complete.png"}'

Acceptance:
- [ ] Full flow works
- [ ] Steps navigate correctly
- [ ] Order creates successfully

Auto-Commit: /auto-commit
