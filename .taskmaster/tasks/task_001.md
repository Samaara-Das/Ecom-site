# Task ID: 1

**Title:** Set Up Medusa Starter Template with Medusa Cloud

**Status:** pending

**Dependencies:** None

**Priority:** high

**Description:** Clone and configure Medusa v2 starter template, connect to Medusa Cloud for managed backend services.

**Details:**

Framework Context:
- Use /medusa skill for project structure
- Docs: mcp-cli call context7/query-docs '{"libraryId": "/websites/medusajs_learn", "topic": "medusa cloud quickstart"}'

Implementation Steps:
1. Clone Medusa v2 starter template
2. Sign up/login to Medusa Cloud (cloud.medusa.com)
3. Create new project in Medusa Cloud dashboard
4. Copy cloud credentials to .env (MEDUSA_CLOUD_*)
5. Configure medusa-config.ts for cloud connection
6. Run: npm install && npm run dev
7. Verify connection to Medusa Cloud

Files:
- backend/medusa-config.ts
- backend/tsconfig.json
- backend/.env (MEDUSA_CLOUD_* credentials)

**Test Strategy:**

TDD: Write test expecting GET /health returns 200

Playwright Verification:
- mcp-cli call playwright/browser_navigate '{"url": "http://localhost:9000/health"}'
- mcp-cli call playwright/browser_snapshot '{}'

Acceptance:
- [ ] npm run dev starts without errors
- [ ] Connected to Medusa Cloud
- [ ] Admin dashboard accessible via cloud

Auto-Commit: /auto-commit
