# Task ID: 54

**Title:** Build Admin Analytics Dashboard

**Status:** pending

**Dependencies:** 51

**Priority:** medium

**Description:** Create marketplace-wide analytics for admins.

**Details:**

Framework Context:
- Use /senior-developer skill

Implementation Steps:
1. Create app/(admin)/analytics/page.tsx
2. Display GMV metrics
3. Add vendor performance table
4. Add order volume charts
5. Add export functionality

Files:
- storefront/app/(admin)/analytics/page.tsx
- storefront/components/admin/GMVMetrics.tsx
- storefront/components/admin/VendorPerformance.tsx

**Test Strategy:**

Playwright Verification:
- Navigate to admin analytics
- Verify metrics display

Acceptance:
- [ ] GMV displays
- [ ] Charts render
- [ ] Export works

Auto-Commit: /auto-commit
