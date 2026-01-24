# Task ID: 63

**Title:** Configure SendGrid Email Notifications

**Status:** pending

**Dependencies:** 1

**Priority:** high

**Description:** Set up SendGrid for transactional emails.

**Details:**

Framework Context:
- Use /medusa skill

Implementation Steps:
1. Install medusa-plugin-sendgrid
2. Add SendGrid credentials
3. Create email templates
4. Configure notification events
5. Test order confirmation email

Files:
- backend/medusa-config.ts
- backend/.env (SENDGRID_*)
- backend/src/templates/

**Test Strategy:**

Send test emails, verify delivery

Acceptance:
- [ ] Emails send
- [ ] Templates render
- [ ] Order confirmation works

Auto-Commit: /auto-commit
