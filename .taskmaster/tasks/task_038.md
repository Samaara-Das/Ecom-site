# Task ID: 38

**Title:** Build Customer Order History

**Status:** pending

**Dependencies:** 36

**Priority:** medium

**Description:** Create customer account order history page.

**Details:**

Framework Context:
- Use /senior-developer skill

Implementation Steps:
1. Create app/(account)/orders/page.tsx
2. Fetch customer orders
3. Display order list with status
4. Add order detail view
5. Add tracking links

Files:
- storefront/app/(account)/orders/page.tsx
- storefront/app/(account)/orders/[id]/page.tsx
- storefront/components/orders/OrderList.tsx
- storefront/components/orders/OrderStatus.tsx

**Test Strategy:**

Playwright Verification:
- Login, navigate to orders
- Verify order history displays

Acceptance:
- [ ] Orders list shows
- [ ] Status indicators work
- [ ] Detail page accessible

Auto-Commit: /auto-commit
