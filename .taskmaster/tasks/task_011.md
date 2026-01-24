# Task ID: 11

**Title:** Implement Phone OTP Auth - Frontend UI

**Status:** pending

**Dependencies:** 10

**Priority:** medium

**Description:** Create phone input and OTP verification UI with countdown timer.

**Details:**

Framework Context:
- Use /senior-developer skill with TDD

Implementation Steps (TDD):
1. Write test for phone input
2. Write test for OTP input (6 digits)
3. Write test for countdown timer
4. Implement PhoneLogin component
5. Implement OTPInput component

Files:
- storefront/components/auth/PhoneLogin.tsx
- storefront/components/auth/OTPInput.tsx
- storefront/components/auth/PhoneLogin.test.tsx

**Test Strategy:**

TDD Test Cases:
- validates phone number format
- shows OTP input after sending
- countdown timer works
- resend button enabled after timeout

Playwright Verification:
- Navigate to phone login
- Verify UI flow

Acceptance:
- [ ] Phone validation works
- [ ] OTP input accepts 6 digits
- [ ] Timer counts down

Auto-Commit: /auto-commit
