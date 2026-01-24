# Task ID: 45

**Title:** Build Vendor Product Form

**Status:** pending

**Dependencies:** 44

**Priority:** high

**Description:** Create product creation/edit form for vendors.

**Details:**

Framework Context:
- Use /senior-developer skill with TDD

Implementation Steps (TDD):
1. Write test for form fields
2. Write test for image upload
3. Write test for variant creation
4. Implement ProductForm
5. Add category selector

Files:
- storefront/app/(vendor)/dashboard/products/new/page.tsx
- storefront/app/(vendor)/dashboard/products/[id]/edit/page.tsx
- storefront/components/vendor/ProductForm.tsx
- storefront/components/vendor/VariantsEditor.tsx

**Test Strategy:**

TDD Test Cases:
- renders all product fields
- image upload works
- variants can be added
- saves to backend

Playwright Verification:
- Create new product
- Verify appears in list

Acceptance:
- [ ] Form creates product
- [ ] Images upload
- [ ] Variants work

Auto-Commit: /auto-commit
