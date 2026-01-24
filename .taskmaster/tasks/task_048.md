# Task ID: 48

**Title:** Build Vendor Analytics Dashboard

**Status:** pending

**Dependencies:** 43

**Priority:** medium

**Description:** Create vendor analytics with sales metrics and charts.

**Details:**

Framework Context:
- Use /senior-developer skill

Implementation Steps:
1. Create analytics API endpoint
2. Display key metrics cards
3. Add sales chart (recharts)
4. Add top products list
5. Add date range selector

Files:
- storefront/app/(vendor)/dashboard/analytics/page.tsx
- storefront/components/vendor/MetricsCards.tsx
- storefront/components/vendor/SalesChart.tsx
- backend/src/api/store/vendors/[id]/analytics/route.ts

**Test Strategy:**

Playwright Verification:
- Navigate to analytics
- Verify charts render

Acceptance:
- [ ] Metrics display
- [ ] Charts render
- [ ] Date filter works

Auto-Commit: /auto-commit
