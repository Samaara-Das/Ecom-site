# Task ID: 14

**Title:** Configure AWS S3 for File Storage

**Status:** pending

**Dependencies:** 1

**Priority:** high

**Description:** Set up S3 bucket for product images and digital downloads.

**Details:**

Framework Context:
- Use /medusa skill for file storage

Implementation Steps:
1. Create S3 bucket with proper permissions
2. Configure CORS for bucket
3. Add S3 credentials to .env
4. Configure File module in medusa-config.ts
5. Test file upload via admin

Files:
- backend/.env (AWS_*)
- backend/medusa-config.ts

**Test Strategy:**

TDD: Write test for file upload and retrieval

Acceptance:
- [ ] Files upload to S3
- [ ] URLs accessible
- [ ] Images display correctly

Auto-Commit: /auto-commit
