# Task ID: 50

**Title:** Build Vendor Payout UI

**Status:** pending

**Dependencies:** 49

**Priority:** high

**Description:** Create vendor payout management interface.

**Details:**

Framework Context:
- Use /senior-developer skill

Implementation Steps:
1. Create app/(vendor)/dashboard/payouts/page.tsx
2. Display earnings balance
3. Add payout request button
4. Show payout history
5. Add bank details form

Files:
- storefront/app/(vendor)/dashboard/payouts/page.tsx
- storefront/components/vendor/PayoutBalance.tsx
- storefront/components/vendor/PayoutHistory.tsx
- storefront/components/vendor/BankDetailsForm.tsx

**Test Strategy:**

Playwright Verification:
- Navigate to payouts
- Verify balance displays

Acceptance:
- [ ] Balance shows
- [ ] Request works
- [ ] History displays

Auto-Commit: /auto-commit
