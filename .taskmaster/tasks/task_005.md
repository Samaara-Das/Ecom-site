# Task ID: 5

**Title:** Set Up Base UI Component Library

**Status:** pending

**Dependencies:** 4

**Priority:** high

**Description:** Install and configure shadcn/ui components: Button, Input, Card, Dialog, Form, Select, Toast.

**Details:**

Framework Context:
- Use /senior-developer skill for component setup

Implementation Steps:
1. npx shadcn-ui@latest add button input card dialog form select toast
2. Create components/ui/ structure
3. Configure theme colors for marketplace brand
4. Set up dark mode support (optional)
5. Create Storybook for component docs

Files:
- storefront/components/ui/*.tsx
- storefront/lib/utils.ts
- storefront/.storybook/ (if using)

**Test Strategy:**

TDD: Write tests for each UI component rendering

Playwright Verification:
- Navigate to Storybook or test page
- Verify components render correctly

Acceptance:
- [ ] All shadcn components installed
- [ ] Theme colors configured
- [ ] Components render without errors

Auto-Commit: /auto-commit
