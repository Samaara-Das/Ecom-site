# Task ID: 34

**Title:** Integrate PayPal Payment Provider

**Status:** pending

**Dependencies:** 31

**Priority:** medium

**Description:** Add PayPal as alternative payment option.

**Details:**

Framework Context:
- Use /medusa skill

Implementation Steps:
1. Install @medusajs/payment-paypal
2. Configure PayPal credentials
3. Add PayPal buttons to checkout
4. Handle payment capture

Files:
- backend/medusa-config.ts
- backend/.env (PAYPAL_*)
- storefront/components/checkout/PayPalPayment.tsx

**Test Strategy:**

Test in PayPal sandbox

Acceptance:
- [ ] PayPal button shows
- [ ] Sandbox payment works
- [ ] Order created

Auto-Commit: /auto-commit
