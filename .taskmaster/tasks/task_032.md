# Task ID: 32

**Title:** Build Checkout - Payment Step with Stripe

**Status:** pending

**Dependencies:** 30, 31

**Priority:** high

**Description:** Create payment step with Stripe Elements for card input.

**Details:**

Framework Context:
- Use /senior-developer skill

Implementation Steps:
1. Install @stripe/stripe-js and @stripe/react-stripe-js
2. Create PaymentStep component
3. Integrate Stripe Elements (CardElement)
4. Handle payment confirmation
5. Show payment errors

Files:
- storefront/components/checkout/PaymentStep.tsx
- storefront/components/checkout/StripePayment.tsx
- storefront/lib/stripe.ts

**Test Strategy:**

Playwright Verification:
- Navigate to payment step
- Verify Stripe Elements load
- Use test card: 4242 4242 4242 4242

Acceptance:
- [ ] Stripe Elements render
- [ ] Test payment succeeds
- [ ] Errors display clearly

Auto-Commit: /auto-commit
