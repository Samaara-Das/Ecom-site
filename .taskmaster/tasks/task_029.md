# Task ID: 29

**Title:** Build Checkout - Address Step

**Status:** pending

**Dependencies:** 28

**Priority:** high

**Description:** Create checkout address form with saved addresses for logged-in users.

**Details:**

Framework Context:
- Use /senior-developer skill with TDD

Implementation Steps (TDD):
1. Write test for address form fields
2. Write test for saved address selection
3. Write test for new address save
4. Implement AddressStep component
5. Add address validation

Files:
- storefront/components/checkout/AddressStep.tsx
- storefront/components/checkout/AddressStep.test.tsx
- storefront/components/checkout/AddressForm.tsx
- storefront/components/checkout/SavedAddresses.tsx

**Test Strategy:**

TDD Test Cases:
- renders all address fields
- validates required fields
- shows saved addresses for logged user
- saves new address option

Playwright Verification:
- Navigate to checkout
- Fill address form

Acceptance:
- [ ] Form validates
- [ ] Saved addresses work
- [ ] Guest checkout works

Auto-Commit: /auto-commit
