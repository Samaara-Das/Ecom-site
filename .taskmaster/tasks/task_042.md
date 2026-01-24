# Task ID: 42

**Title:** Build Vendor Registration Form UI

**Status:** pending

**Dependencies:** 41

**Priority:** high

**Description:** Create vendor registration form with business info and documents.

**Details:**

Framework Context:
- Use /senior-developer skill with TDD

Implementation Steps (TDD):
1. Write test for form fields
2. Write test for document upload
3. Write test for submission
4. Implement VendorRegistrationForm
5. Add multi-step wizard

Files:
- storefront/app/(vendor)/apply/page.tsx
- storefront/components/vendor/RegistrationForm.tsx
- storefront/components/vendor/DocumentUpload.tsx

**Test Strategy:**

TDD Test Cases:
- renders business info fields
- validates required fields
- document upload works
- submission shows confirmation

Playwright Verification:
- mcp-cli call playwright/browser_navigate '{"url": "http://localhost:3000/vendor/apply"}'
- Fill form, verify flow

Acceptance:
- [ ] Form validates
- [ ] Documents upload
- [ ] Confirmation shown

Auto-Commit: /auto-commit
