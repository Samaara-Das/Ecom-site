# Task ID: 10

**Title:** Implement Phone OTP Auth - Backend

**Status:** pending

**Dependencies:** 6

**Priority:** medium

**Description:** Set up SMS OTP verification using Twilio for phone-based authentication.

**Details:**

Framework Context:
- Use /medusa skill for notification setup

Implementation Steps:
1. Configure Twilio credentials in .env
2. Create OTP generation service
3. Create POST /store/auth/otp/send endpoint
4. Create POST /store/auth/otp/verify endpoint
5. Rate limit OTP requests

Files:
- backend/src/services/otp.ts
- backend/src/api/store/auth/otp/route.ts
- backend/.env (TWILIO_*)

**Test Strategy:**

TDD: Write tests for OTP generation, validation, expiry

Acceptance:
- [ ] OTP sent via SMS
- [ ] OTP validates correctly
- [ ] Expired OTP rejected

Auto-Commit: /auto-commit
