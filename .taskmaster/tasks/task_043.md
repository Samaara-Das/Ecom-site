# Task ID: 43

**Title:** Build Vendor Dashboard Layout

**Status:** pending

**Dependencies:** 39

**Priority:** high

**Description:** Create vendor dashboard layout with sidebar navigation.

**Details:**

Framework Context:
- Use /senior-developer skill

Implementation Steps:
1. Create app/(vendor)/dashboard/layout.tsx
2. Add sidebar with navigation
3. Add header with vendor info
4. Create dashboard home with stats

Files:
- storefront/app/(vendor)/dashboard/layout.tsx
- storefront/components/vendor/DashboardSidebar.tsx
- storefront/components/vendor/DashboardHeader.tsx
- storefront/app/(vendor)/dashboard/page.tsx

**Test Strategy:**

Playwright Verification:
- mcp-cli call playwright/browser_navigate '{"url": "http://localhost:3000/vendor/dashboard"}'
- mcp-cli call playwright/browser_snapshot '{}'

Acceptance:
- [ ] Layout renders
- [ ] Navigation works
- [ ] Stats display

Auto-Commit: /auto-commit
