# Task ID: 35

**Title:** Build Payment Method Selector

**Status:** pending

**Dependencies:** 32, 33, 34

**Priority:** high

**Description:** Create unified payment method selector with all providers.

**Details:**

Framework Context:
- Use /senior-developer skill with TDD

Implementation Steps (TDD):
1. Write test for method tabs
2. Write test for provider switching
3. Implement PaymentMethodSelector
4. Show appropriate form per selection

Files:
- storefront/components/checkout/PaymentMethodSelector.tsx
- storefront/components/checkout/PaymentMethodSelector.test.tsx

**Test Strategy:**

TDD Test Cases:
- renders all available methods
- switching shows correct form
- remembers selection

Playwright Verification:
- Switch between methods
- Verify forms change

Acceptance:
- [ ] All methods shown
- [ ] Switching works
- [ ] Forms render correctly

Auto-Commit: /auto-commit
