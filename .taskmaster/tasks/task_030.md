# Task ID: 30

**Title:** Build Checkout - Shipping Step

**Status:** pending

**Dependencies:** 29

**Priority:** high

**Description:** Create shipping options selection with per-vendor options.

**Details:**

Framework Context:
- Use /senior-developer skill

Implementation Steps:
1. Fetch shipping options from Medusa
2. Display options per vendor
3. Calculate total shipping
4. Store selection in cart

Files:
- storefront/components/checkout/ShippingStep.tsx
- storefront/components/checkout/ShippingOption.tsx

**Test Strategy:**

Playwright Verification:
- Select shipping options
- Verify totals update

Acceptance:
- [ ] Options load per vendor
- [ ] Selection updates total
- [ ] Can proceed to payment

Auto-Commit: /auto-commit
