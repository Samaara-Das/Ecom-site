# Task ID: 6

**Title:** Implement Customer Email/Password Auth - Backend

**Status:** pending

**Dependencies:** 2

**Priority:** high

**Description:** Configure Medusa customer authentication with email/password, JWT tokens, and session management.

**Details:**

Framework Context:
- Use /medusa skill for auth configuration
- Docs: mcp-cli call context7/query-docs '{"libraryId": "/websites/medusajs_learn", "topic": "customer authentication"}'

Implementation Steps:
1. Verify Customer module enabled in medusa-config.ts
2. Configure JWT secret in .env
3. Test POST /store/customers endpoint
4. Test POST /store/auth endpoint
5. Verify token validation

Files:
- backend/medusa-config.ts
- backend/.env (JWT_SECRET)

**Test Strategy:**

TDD: Write tests for register, login, logout flows

Acceptance:
- [ ] Customer registration works
- [ ] Login returns valid JWT
- [ ] Protected routes require auth

Auto-Commit: /auto-commit
