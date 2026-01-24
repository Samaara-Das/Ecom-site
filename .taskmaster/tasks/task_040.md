# Task ID: 40

**Title:** Create Vendor-Product Link

**Status:** pending

**Dependencies:** 39, 12

**Priority:** high

**Description:** Link vendors to products using Medusa module links.

**Details:**

Framework Context:
- Use /medusa skill for module links

Implementation Steps:
1. Create src/links/vendor-product.ts
2. Define link between Vendor and Product
3. Run db:sync-links
4. Update product queries to include vendor

Files:
- backend/src/links/vendor-product.ts

**Test Strategy:**

TDD: Write test for linked data retrieval

Acceptance:
- [ ] Link defined
- [ ] Products return vendor info
- [ ] Vendor returns products

Auto-Commit: /auto-commit
