# Task ID: 2

**Title:** Configure Medusa Cloud Database

**Status:** pending

**Dependencies:** 1

**Priority:** high

**Description:** Configure managed PostgreSQL database via Medusa Cloud, run migrations.

**Details:**

Framework Context:
- Use /medusa skill for database setup
- Medusa Cloud provides managed PostgreSQL

Implementation Steps:
1. Verify Medusa Cloud database provisioned
2. Database URL auto-configured via cloud credentials
3. Run: npx medusa db:migrate (against cloud DB)
4. Verify tables created in cloud dashboard
5. Seed initial data if needed

Files:
- backend/.env (inherited from Medusa Cloud)
- backend/src/migrations/

**Test Strategy:**

TDD: Write test connecting to DB and querying health

Playwright Verification:
- mcp-cli call playwright/browser_navigate '{"url": "http://localhost:9000/admin"}'
- Verify admin loads (DB connected)

Acceptance:
- [ ] Cloud database connected
- [ ] Migrations complete
- [ ] Admin dashboard accessible

Auto-Commit: /auto-commit
