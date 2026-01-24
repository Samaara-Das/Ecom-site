# Task ID: 27

**Title:** Build Cart UI - Cart Drawer

**Status:** pending

**Dependencies:** 26

**Priority:** high

**Description:** Create slide-out cart drawer with items grouped by vendor.

**Details:**

Framework Context:
- Use /senior-developer skill with TDD

Implementation Steps (TDD):
1. Write test for drawer open/close
2. Write test for vendor grouping display
3. Write test for quantity update
4. Write test for remove item
5. Implement CartDrawer component

Files:
- storefront/components/cart/CartDrawer.tsx
- storefront/components/cart/CartDrawer.test.tsx
- storefront/components/cart/CartItem.tsx
- storefront/components/cart/VendorGroup.tsx

**Test Strategy:**

TDD Test Cases:
- opens on cart icon click
- groups items by vendor
- quantity +/- works
- remove item works
- shows subtotals

Playwright Verification:
- Add item to cart
- Open drawer, verify grouping

Acceptance:
- [ ] Drawer slides in
- [ ] Vendor groups shown
- [ ] Quantity controls work

Auto-Commit: /auto-commit
