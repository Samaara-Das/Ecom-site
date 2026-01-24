# Task ID: 65

**Title:** Build Site Header Component

**Status:** pending

**Dependencies:** 5, 27, 61

**Priority:** high

**Description:** Create main site header with logo, search, nav, cart, language.

**Details:**

Framework Context:
- Use /senior-developer skill

Implementation Steps:
1. Create Header component
2. Add logo and navigation
3. Add SearchBar
4. Add cart icon with count
5. Add language/currency selectors
6. Add mobile menu

Files:
- storefront/components/layout/Header.tsx
- storefront/components/layout/MobileMenu.tsx
- storefront/components/layout/Navigation.tsx

**Test Strategy:**

Playwright Verification:
- mcp-cli call playwright/browser_navigate '{"url": "http://localhost:3000"}'
- mcp-cli call playwright/browser_snapshot '{}'

Acceptance:
- [ ] All elements render
- [ ] Mobile menu works
- [ ] Cart updates

Auto-Commit: /auto-commit
