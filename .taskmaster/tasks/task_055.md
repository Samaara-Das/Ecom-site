# Task ID: 55

**Title:** Implement i18n Setup

**Status:** pending

**Dependencies:** 4

**Priority:** high

**Description:** Set up internationalization with next-intl for English/Arabic.

**Details:**

Framework Context:
- Use /senior-developer skill

Implementation Steps:
1. Install next-intl
2. Configure middleware for locale detection
3. Create messages/en.json and messages/ar.json
4. Set up translation provider
5. Add language switcher

Files:
- storefront/middleware.ts
- storefront/i18n.ts
- storefront/messages/en.json
- storefront/messages/ar.json
- storefront/components/LanguageSwitcher.tsx

**Test Strategy:**

Playwright Verification:
- Switch to Arabic
- Verify text changes

Acceptance:
- [ ] English works
- [ ] Arabic works
- [ ] Switcher persists choice

Auto-Commit: /auto-commit
