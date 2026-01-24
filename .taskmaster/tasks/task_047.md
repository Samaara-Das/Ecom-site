# Task ID: 47

**Title:** Build Vendor Order Processing

**Status:** pending

**Dependencies:** 46

**Priority:** high

**Description:** Enable vendors to update order status and add tracking.

**Details:**

Framework Context:
- Use /senior-developer skill

Implementation Steps:
1. Add status update buttons
2. Create tracking number input
3. Send customer notification on update
4. Update fulfillment in Medusa

Files:
- storefront/components/vendor/OrderActions.tsx
- storefront/components/vendor/TrackingInput.tsx

**Test Strategy:**

Playwright Verification:
- Update order status
- Add tracking number
- Verify updates

Acceptance:
- [ ] Status updates work
- [ ] Tracking saves
- [ ] Notifications sent

Auto-Commit: /auto-commit
