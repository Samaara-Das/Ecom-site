# Task ID: 52

**Title:** Build Admin Vendor Approval

**Status:** pending

**Dependencies:** 51, 41

**Priority:** high

**Description:** Create admin interface for vendor application review.

**Details:**

Framework Context:
- Use /senior-developer skill

Implementation Steps:
1. Create app/(admin)/vendors/page.tsx
2. Display pending applications
3. Add review modal
4. Add approve/reject actions
5. Add tier assignment

Files:
- storefront/app/(admin)/vendors/page.tsx
- storefront/app/(admin)/vendors/[id]/page.tsx
- storefront/components/admin/VendorReviewModal.tsx
- storefront/components/admin/TierSelector.tsx

**Test Strategy:**

Playwright Verification:
- View pending vendors
- Approve/reject application

Acceptance:
- [ ] Applications list
- [ ] Review works
- [ ] Status updates

Auto-Commit: /auto-commit
