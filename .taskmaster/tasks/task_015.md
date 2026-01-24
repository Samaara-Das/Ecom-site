# Task ID: 15

**Title:** Configure Region and Currency Settings

**Status:** pending

**Dependencies:** 2

**Priority:** high

**Description:** Set up Kuwait region with KWD as primary currency, add USD/EUR/GBP support.

**Details:**

Framework Context:
- Use /medusa skill for Region module
- Docs: mcp-cli call context7/query-docs '{"libraryId": "/websites/medusajs_learn", "topic": "regions currencies"}'

Implementation Steps:
1. Create Kuwait region via admin
2. Set KWD as default currency
3. Add USD, EUR, GBP currencies
4. Configure exchange rates
5. Set tax rate (5% VAT)

Files:
- backend/src/scripts/seed-regions.ts

**Test Strategy:**

Verify prices display in all currencies

Acceptance:
- [ ] Kuwait region created
- [ ] 4 currencies configured
- [ ] Tax rate applied

Auto-Commit: /auto-commit
