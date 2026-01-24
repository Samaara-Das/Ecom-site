# Task ID: 21

**Title:** Build Product Filters Sidebar

**Status:** pending

**Dependencies:** 20

**Priority:** high

**Description:** Create filters for category, price range, vendor, availability.

**Details:**

Framework Context:
- Use /senior-developer skill with TDD

Implementation Steps (TDD):
1. Write test for category filter
2. Write test for price range slider
3. Write test for vendor checkboxes
4. Write test for URL sync
5. Implement FiltersSidebar
6. Add mobile drawer

Files:
- storefront/components/products/FiltersSidebar.tsx
- storefront/components/products/FiltersSidebar.test.tsx
- storefront/components/products/PriceRangeSlider.tsx

**Test Strategy:**

TDD Test Cases:
- category filter updates URL
- price range filters products
- multiple vendors selectable
- clear all resets filters

Playwright Verification:
- Apply filters, verify URL changes
- Verify products filtered

Acceptance:
- [ ] Filters update URL params
- [ ] Products filter correctly
- [ ] Mobile drawer works

Auto-Commit: /auto-commit
