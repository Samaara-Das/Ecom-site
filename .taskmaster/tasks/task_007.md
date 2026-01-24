# Task ID: 7

**Title:** Build Customer Auth UI - Login Form

**Status:** pending

**Dependencies:** 5, 6

**Priority:** high

**Description:** Create login form component with email/password fields, validation, error handling using TDD.

**Details:**

Framework Context:
- Use /senior-developer skill with TDD (RED → GREEN → REFACTOR)
- Use React Hook Form + Zod validation
- Use accessible queries for testing

Implementation Steps (TDD):
1. RED: Write test for form rendering with email/password fields
2. GREEN: Create basic form with inputs
3. RED: Write test for validation error on invalid email
4. GREEN: Add Zod validation schema
5. RED: Write test for API error handling
6. GREEN: Add error display
7. RED: Write test for loading state during submission
8. GREEN: Add loading spinner and disabled state
9. REFACTOR: Add Tailwind styling

Code Pattern:
// storefront/components/auth/LoginForm.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from './LoginForm'

const user = userEvent.setup()

describe('LoginForm', () => {
  it('renders email and password fields', () => {
    render(<LoginForm onSubmit={vi.fn()} />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })
})

Files:
- storefront/components/auth/LoginForm.tsx
- storefront/components/auth/LoginForm.test.tsx
- storefront/components/auth/schemas.ts (Zod schemas)
- storefront/app/(auth)/login/page.tsx

**Test Strategy:**

TDD Cycle:
1. npm test -- LoginForm (RED - tests fail)
2. Implement each feature to pass tests (GREEN)
3. Clean up and style (REFACTOR)

Test Commands:
npm test -- LoginForm.test.tsx
npm test -- --coverage LoginForm.test.tsx

Playwright Verification:
- mcp-cli call playwright/browser_navigate '{"url": "http://localhost:3000/login"}'
- mcp-cli call playwright/browser_snapshot '{}'
- Fill form, submit, verify behavior

Acceptance:
- [ ] All 5 TDD tests pass
- [ ] Form has proper labels (accessible)
- [ ] Validation errors show with aria-invalid
- [ ] Loading state prevents double submission

Auto-Commit: /auto-commit
