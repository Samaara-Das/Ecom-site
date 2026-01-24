# Task ID: 33

**Title:** Integrate Razorpay Payment Provider

**Status:** pending

**Dependencies:** 31

**Priority:** medium

**Description:** Add Razorpay as alternative payment option.

**Details:**

Framework Context:
- Use /medusa skill

Implementation Steps:
1. Install medusa-payment-razorpay
2. Configure Razorpay credentials
3. Add to payment module
4. Create RazorpayPayment component
5. Test payment flow

Files:
- backend/medusa-config.ts
- backend/.env (RAZORPAY_*)
- storefront/components/checkout/RazorpayPayment.tsx

**Test Strategy:**

Test in Razorpay test mode

Acceptance:
- [ ] Razorpay option shows
- [ ] Payment flow works
- [ ] Order created on success

Auto-Commit: /auto-commit
