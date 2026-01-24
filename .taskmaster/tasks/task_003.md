# Task ID: 3

**Title:** Configure Medusa Cloud Redis

**Status:** pending

**Dependencies:** 1

**Priority:** high

**Description:** Configure managed Redis via Medusa Cloud for sessions, caching, and queues.

**Details:**

Framework Context:
- Use /medusa skill for Redis configuration
- Medusa Cloud provides managed Redis

Implementation Steps:
1. Verify Medusa Cloud Redis provisioned
2. Redis URL auto-configured via cloud credentials
3. Configure medusa-config.ts to use cloud Redis
4. Test session persistence
5. Verify cache operations

Files:
- backend/.env (inherited from Medusa Cloud)
- backend/medusa-config.ts

**Test Strategy:**

TDD: Write test verifying Redis connection and session storage

Acceptance:
- [ ] Cloud Redis connected
- [ ] Sessions persist
- [ ] Cache operations work

Auto-Commit: /auto-commit
