# Task ID: 36

**Title:** Build Order Confirmation Page

**Status:** pending

**Dependencies:** 32

**Priority:** high

**Description:** Create order confirmation page with order details and next steps.

**Details:**

Framework Context:
- Use /senior-developer skill

Implementation Steps:
1. Create app/(shop)/order/confirmed/[id]/page.tsx
2. Fetch order details
3. Display order summary
4. Show vendor breakdown
5. Add tracking info placeholder

Files:
- storefront/app/(shop)/order/confirmed/[id]/page.tsx
- storefront/components/orders/OrderConfirmation.tsx
- storefront/components/orders/OrderItems.tsx

**Test Strategy:**

Playwright Verification:
- Complete checkout
- Verify confirmation page

Acceptance:
- [ ] Order number displayed
- [ ] Items listed
- [ ] Email confirmation mention

Auto-Commit: /auto-commit
