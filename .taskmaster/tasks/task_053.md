# Task ID: 53

**Title:** Build Admin Marketplace Settings

**Status:** pending

**Dependencies:** 51

**Priority:** medium

**Description:** Create admin interface for marketplace configuration.

**Details:**

Framework Context:
- Use /senior-developer skill

Implementation Steps:
1. Create app/(admin)/settings/page.tsx
2. Add commission rate settings
3. Add category management
4. Add shipping zone config
5. Add tax settings

Files:
- storefront/app/(admin)/settings/page.tsx
- storefront/components/admin/CommissionSettings.tsx
- storefront/components/admin/CategoryManager.tsx

**Test Strategy:**

Playwright Verification:
- Navigate to settings
- Update configuration

Acceptance:
- [ ] Settings save
- [ ] Commission updates
- [ ] Categories manageable

Auto-Commit: /auto-commit
