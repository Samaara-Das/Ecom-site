# Task ID: 51

**Title:** Build Admin Dashboard Layout

**Status:** pending

**Dependencies:** 2

**Priority:** high

**Description:** Create admin dashboard layout with navigation.

**Details:**

Framework Context:
- Use /senior-developer skill

Implementation Steps:
1. Create app/(admin)/layout.tsx
2. Add admin sidebar
3. Add admin header
4. Create dashboard home

Files:
- storefront/app/(admin)/layout.tsx
- storefront/components/admin/AdminSidebar.tsx
- storefront/components/admin/AdminHeader.tsx
- storefront/app/(admin)/page.tsx

**Test Strategy:**

Playwright Verification:
- mcp-cli call playwright/browser_navigate '{"url": "http://localhost:3000/admin"}'
- mcp-cli call playwright/browser_snapshot '{}'

Acceptance:
- [ ] Layout renders
- [ ] Navigation works
- [ ] Requires admin auth

Auto-Commit: /auto-commit
