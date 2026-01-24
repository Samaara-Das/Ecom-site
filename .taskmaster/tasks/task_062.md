# Task ID: 62

**Title:** Build Search Results Page

**Status:** pending

**Dependencies:** 61

**Priority:** high

**Description:** Create search results page with faceted filtering.

**Details:**

Framework Context:
- Use /senior-developer skill

Implementation Steps:
1. Create app/(shop)/search/page.tsx
2. Fetch search results from Meilisearch
3. Display with ProductGrid
4. Add faceted filters
5. Add sort options

Files:
- storefront/app/(shop)/search/page.tsx
- storefront/components/search/FacetedFilters.tsx

**Test Strategy:**

Playwright Verification:
- mcp-cli call playwright/browser_navigate '{"url": "http://localhost:3000/search?q=shirt"}'
- mcp-cli call playwright/browser_snapshot '{}'

Acceptance:
- [ ] Results display
- [ ] Filters work
- [ ] Arabic search works

Auto-Commit: /auto-commit
