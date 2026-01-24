# Task ID: 24

**Title:** Build Product Detail Page - Variant Selector

**Status:** pending

**Dependencies:** 12

**Priority:** high

**Description:** Create variant selection UI for size, color with stock availability.

**Details:**

Framework Context:
- Use /senior-developer skill with TDD

Implementation Steps (TDD):
1. Write test for option buttons render
2. Write test for selection updates
3. Write test for out of stock disable
4. Implement VariantSelector
5. Update price on selection

Files:
- storefront/components/products/VariantSelector.tsx
- storefront/components/products/VariantSelector.test.tsx

**Test Strategy:**

TDD Test Cases:
- renders all options
- clicking selects variant
- out of stock shows disabled
- price updates on selection

Playwright Verification:
- Select variants, verify price change

Acceptance:
- [ ] All variants selectable
- [ ] Stock status shown
- [ ] Price updates

Auto-Commit: /auto-commit
