# Task ID: 9

**Title:** Implement Social Login - Google OAuth

**Status:** pending

**Dependencies:** 6

**Priority:** medium

**Description:** Add Google OAuth login option using NextAuth.js or Medusa auth provider.

**Details:**

Framework Context:
- Use /medusa skill for OAuth setup

Implementation Steps:
1. Create Google OAuth credentials
2. Configure auth provider in Medusa
3. Add Google login button to UI
4. Handle OAuth callback
5. Link social account to customer

Files:
- backend/src/api/auth/google/route.ts
- storefront/components/auth/SocialLogin.tsx
- backend/.env (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)

**Test Strategy:**

TDD: Write test for OAuth redirect flow

Playwright Verification:
- Verify Google button renders
- Test OAuth flow (manual)

Acceptance:
- [ ] Google button visible
- [ ] OAuth redirect works
- [ ] Account created/linked

Auto-Commit: /auto-commit
