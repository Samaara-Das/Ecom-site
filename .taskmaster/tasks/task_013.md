# Task ID: 13

**Title:** Create Product Seeder Script

**Status:** pending

**Dependencies:** 12

**Priority:** medium

**Description:** Create script to seed sample products, categories, and variants for development.

**Details:**

Framework Context:
- Use /medusa skill for seeding

Implementation Steps:
1. Create seed script in backend/src/scripts/
2. Add 5 categories (Electronics, Fashion, Home, etc.)
3. Add 20 sample products with images
4. Add variants for applicable products
5. Set multi-currency prices

Files:
- backend/src/scripts/seed-products.ts
- backend/package.json (add seed script)

**Test Strategy:**

Run seed script and verify data in admin

Acceptance:
- [ ] Categories created
- [ ] Products with images
- [ ] Variants and prices set

Auto-Commit: /auto-commit
