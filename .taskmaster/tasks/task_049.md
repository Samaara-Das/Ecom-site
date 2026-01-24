# Task ID: 49

**Title:** Build Vendor Payout System - Backend

**Status:** pending

**Dependencies:** 39

**Priority:** high

**Description:** Create payout tracking and request system for vendors.

**Details:**

Framework Context:
- Use /medusa skill

Implementation Steps:
1. Create Payout model in vendor module
2. Calculate vendor earnings from orders
3. Track commission deductions
4. Create payout request endpoint
5. Track payout status

Files:
- backend/src/modules/vendor/models/payout.ts
- backend/src/api/store/vendors/[id]/payouts/route.ts
- backend/src/services/payout-calculator.ts

**Test Strategy:**

TDD: Write tests for payout calculation

Acceptance:
- [ ] Earnings tracked
- [ ] Commission calculated
- [ ] Payout requests work

Auto-Commit: /auto-commit
