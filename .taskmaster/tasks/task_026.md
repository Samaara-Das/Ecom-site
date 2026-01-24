# Task ID: 26

**Title:** Implement Multi-Vendor Cart - Backend

**Status:** pending

**Dependencies:** 12, 17

**Priority:** high

**Description:** Configure Medusa cart with vendor grouping for line items.

**Details:**

Framework Context:
- Use /medusa skill
- Docs: mcp-cli call context7/query-docs '{"libraryId": "/websites/medusajs_learn", "topic": "cart module"}'

Implementation Steps:
1. Create custom cart service extending Medusa
2. Add vendor_id to line items metadata
3. Create endpoint to get cart grouped by vendor
4. Handle multi-vendor shipping calculation

Files:
- backend/src/services/marketplace-cart.ts
- backend/src/api/store/cart/grouped/route.ts

**Test Strategy:**

TDD: Write tests for vendor grouping logic

Acceptance:
- [ ] Line items track vendor
- [ ] Grouped response works
- [ ] Subtotals per vendor

Auto-Commit: /auto-commit
