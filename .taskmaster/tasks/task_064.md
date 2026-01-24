# Task ID: 64

**Title:** Configure Twilio SMS Notifications

**Status:** pending

**Dependencies:** 1

**Priority:** medium

**Description:** Set up Twilio for SMS order notifications.

**Details:**

Framework Context:
- Use /medusa skill

Implementation Steps:
1. Install twilio package
2. Create SMS notification service
3. Add order placed subscriber
4. Add shipping update subscriber
5. Configure message templates

Files:
- backend/src/services/sms-notification.ts
- backend/src/subscribers/order-sms.ts
- backend/.env (TWILIO_*)

**Test Strategy:**

Test SMS delivery in sandbox

Acceptance:
- [ ] SMS sends
- [ ] Templates work
- [ ] Order notifications work

Auto-Commit: /auto-commit
