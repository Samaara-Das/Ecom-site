# Task ID: 44

**Title:** Build Vendor Product List

**Status:** pending

**Dependencies:** 43, 40

**Priority:** high

**Description:** Create vendor's product management list with CRUD actions.

**Details:**

Framework Context:
- Use /senior-developer skill

Implementation Steps:
1. Create app/(vendor)/dashboard/products/page.tsx
2. Fetch vendor's products
3. Add data table with columns
4. Add search and filters
5. Add bulk actions

Files:
- storefront/app/(vendor)/dashboard/products/page.tsx
- storefront/components/vendor/ProductsTable.tsx

**Test Strategy:**

Playwright Verification:
- Navigate to vendor products
- Verify table renders

Acceptance:
- [ ] Products list shows
- [ ] Search works
- [ ] Actions available

Auto-Commit: /auto-commit
