# Task ID: 56

**Title:** Implement RTL Layout Support

**Status:** pending

**Dependencies:** 55

**Priority:** high

**Description:** Add right-to-left CSS support for Arabic language.

**Details:**

Framework Context:
- Use /senior-developer skill

Implementation Steps:
1. Configure Tailwind RTL plugin
2. Add dir="rtl" to html when Arabic
3. Update layout components for RTL
4. Fix RTL-specific issues
5. Test all pages in RTL

Files:
- storefront/tailwind.config.ts
- storefront/app/layout.tsx
- storefront/styles/rtl.css

**Test Strategy:**

Playwright Verification:
- Switch to Arabic
- mcp-cli call playwright/browser_take_screenshot '{"type": "png", "filename": "rtl-layout.png"}'

Acceptance:
- [ ] RTL layout correct
- [ ] No visual bugs
- [ ] Mirrors properly

Auto-Commit: /auto-commit
