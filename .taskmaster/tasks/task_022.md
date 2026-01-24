# Task ID: 22

**Title:** Build Category Page

**Status:** pending

**Dependencies:** 20, 21

**Priority:** high

**Description:** Create category page with grid, filters, sorting, and breadcrumbs.

**Details:**

Framework Context:
- Use /senior-developer skill

Implementation Steps:
1. Create app/(shop)/category/[handle]/page.tsx
2. Fetch products by category from Medusa
3. Add FiltersSidebar
4. Add sort dropdown
5. Add breadcrumb navigation

Files:
- storefront/app/(shop)/category/[handle]/page.tsx
- storefront/components/navigation/Breadcrumbs.tsx

**Test Strategy:**

Playwright Verification:
- mcp-cli call playwright/browser_navigate '{"url": "http://localhost:3000/category/electronics"}'
- mcp-cli call playwright/browser_snapshot '{}'

Acceptance:
- [ ] Products load for category
- [ ] Filters work
- [ ] Sort works
- [ ] Breadcrumbs correct

Auto-Commit: /auto-commit
