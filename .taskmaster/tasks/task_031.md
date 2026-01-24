# Task ID: 31

**Title:** Integrate Stripe Payment Provider - Backend

**Status:** pending

**Dependencies:** 15

**Priority:** high

**Description:** Configure Stripe payment provider in Medusa backend.

**Details:**

Framework Context:
- Use /medusa skill
- Docs: mcp-cli call context7/query-docs '{"libraryId": "/websites/medusajs_learn", "topic": "stripe payment"}'

Implementation Steps:
1. Install @medusajs/payment-stripe
2. Add Stripe credentials to .env
3. Configure payment module in medusa-config.ts
4. Enable Stripe for Kuwait region
5. Test payment session creation

Files:
- backend/medusa-config.ts
- backend/.env (STRIPE_API_KEY)

**Test Strategy:**

TDD: Write test for payment session creation

Acceptance:
- [ ] Stripe provider configured
- [ ] Payment sessions create
- [ ] Test mode working

Auto-Commit: /auto-commit
