# Task ID: 46

**Title:** Build Vendor Order List

**Status:** pending

**Dependencies:** 43

**Priority:** high

**Description:** Create vendor's order management interface.

**Details:**

Framework Context:
- Use /senior-developer skill

Implementation Steps:
1. Create app/(vendor)/dashboard/orders/page.tsx
2. Fetch orders for vendor's products
3. Display order table with status
4. Add status filters
5. Add order detail modal

Files:
- storefront/app/(vendor)/dashboard/orders/page.tsx
- storefront/components/vendor/OrdersTable.tsx
- storefront/components/vendor/OrderDetailModal.tsx

**Test Strategy:**

Playwright Verification:
- Navigate to vendor orders
- Verify orders display

Acceptance:
- [ ] Orders list shows
- [ ] Status filters work
- [ ] Details accessible

Auto-Commit: /auto-commit
