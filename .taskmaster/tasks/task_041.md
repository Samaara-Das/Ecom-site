# Task ID: 41

**Title:** Build Vendor Registration API

**Status:** pending

**Dependencies:** 39

**Priority:** high

**Description:** Create vendor registration and application endpoints.

**Details:**

Framework Context:
- Use /medusa skill for API routes

Implementation Steps:
1. Create POST /store/vendors/apply
2. Create vendor application model
3. Add document upload support
4. Create verification tiers logic
5. Send notification on submission

Files:
- backend/src/api/store/vendors/apply/route.ts
- backend/src/modules/vendor/models/application.ts

**Test Strategy:**

TDD: Write tests for application submission

Acceptance:
- [ ] Application submits
- [ ] Documents upload
- [ ] Status tracking works

Auto-Commit: /auto-commit
