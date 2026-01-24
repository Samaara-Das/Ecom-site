# Task ID: 60

**Title:** Integrate Meilisearch - Backend

**Status:** pending

**Dependencies:** 12

**Priority:** high

**Description:** Set up Meilisearch and index products.

**Details:**

Framework Context:
- Use /medusa skill

Implementation Steps:
1. Install Meilisearch (Docker or cloud)
2. Install medusa-plugin-meilisearch
3. Configure indexing settings
4. Index products with attributes
5. Enable search endpoint

Files:
- backend/medusa-config.ts
- backend/.env (MEILISEARCH_*)
- docker-compose.yml (add meilisearch)

**Test Strategy:**

TDD: Write test for search results

Acceptance:
- [ ] Meilisearch running
- [ ] Products indexed
- [ ] Search returns results

Auto-Commit: /auto-commit
