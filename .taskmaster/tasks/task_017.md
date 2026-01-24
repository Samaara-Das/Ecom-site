# Task ID: 17

**Title:** Configure Inventory Module

**Status:** pending

**Dependencies:** 12

**Priority:** high

**Description:** Set up inventory tracking with stock levels and reservation system.

**Details:**

Framework Context:
- Use /medusa skill for Inventory module
- Docs: mcp-cli call context7/query-docs '{"libraryId": "/websites/medusajs_learn", "topic": "inventory module"}'

Implementation Steps:
1. Enable Inventory module
2. Create stock location
3. Link inventory to products
4. Set initial stock levels
5. Test reservation on cart add

Files:
- backend/medusa-config.ts
- backend/src/scripts/seed-inventory.ts

**Test Strategy:**

TDD: Write tests for stock check and reservation

Acceptance:
- [ ] Stock levels tracked
- [ ] Reservations work
- [ ] Out of stock handled

Auto-Commit: /auto-commit
