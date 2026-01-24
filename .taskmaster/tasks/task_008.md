# Task ID: 8

**Title:** Build Customer Auth UI - Register Form

**Status:** pending

**Dependencies:** 7

**Priority:** high

**Description:** Create registration form with name, email, password, confirm password, and terms acceptance.

**Details:**

Framework Context:
- Use /senior-developer skill with TDD

Implementation Steps (TDD):
1. Write tests for form fields
2. Write test for password match validation
3. Write test for successful registration
4. Implement RegisterForm component
5. Add password strength indicator

Files:
- storefront/components/auth/RegisterForm.tsx
- storefront/components/auth/RegisterForm.test.tsx
- storefront/app/(auth)/register/page.tsx

**Test Strategy:**

TDD Test Cases:
- renders all required fields
- validates password match
- validates email format
- shows success message on registration

Playwright Verification:
- mcp-cli call playwright/browser_navigate '{"url": "http://localhost:3000/register"}'
- mcp-cli call playwright/browser_snapshot '{}'

Acceptance:
- [ ] All fields validate correctly
- [ ] Registration creates account
- [ ] Auto-login after registration

Auto-Commit: /auto-commit
