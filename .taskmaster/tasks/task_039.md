# Task ID: 39

**Title:** Create Vendor Module - Backend

**Status:** pending

**Dependencies:** 2

**Priority:** high

**Description:** Create custom Medusa module for vendor management with data model, service, and API routes.

**Details:**

Framework Context:
- Use /medusa skill for custom modules
- Docs: mcp-cli call context7/query-docs '{"libraryId": "/websites/medusajs_learn", "topic": "custom modules"}'

Implementation Steps:
1. Create src/modules/vendor/ directory structure
2. Define Vendor data model with fields: id, name, email, status, tier, metadata
3. Create VendorModuleService extending MedusaService
4. Register module in medusa-config.ts
5. Run migrations: npx medusa db:generate vendor && npx medusa db:migrate

Code Pattern:
// src/modules/vendor/models/vendor.ts
import { model } from "@medusajs/framework/utils"

const Vendor = model.define("vendor", {
  id: model.id().primaryKey(),
  name: model.text(),
  email: model.text().unique(),
  status: model.enum(["pending", "approved", "rejected", "suspended"]).default("pending"),
  tier: model.enum(["basic", "verified", "premium"]).default("basic"),
  business_name: model.text().nullable(),
  metadata: model.json().nullable(),
  created_at: model.dateTime(),
  updated_at: model.dateTime(),
})

// src/modules/vendor/service.ts
import { MedusaService } from "@medusajs/framework/utils"
import Vendor from "./models/vendor"

class VendorModuleService extends MedusaService({ Vendor }) {
  async getApprovedVendors() {
    return await this.listVendors({ status: "approved" })
  }
}

Files:
- backend/src/modules/vendor/index.ts
- backend/src/modules/vendor/service.ts
- backend/src/modules/vendor/models/vendor.ts

**Test Strategy:**

TDD: Write tests for vendor CRUD operations
- Test vendor creation with required fields
- Test vendor retrieval by ID
- Test vendor status update (approve/reject)
- Test listing vendors by status

Test File: backend/src/modules/vendor/__tests__/service.test.ts

Acceptance:
- [ ] Vendor model created in database
- [ ] createVendors(), retrieveVendor(), updateVendors() work
- [ ] Module registered in medusa-config.ts
- [ ] npx medusa db:migrate runs without errors

Auto-Commit: /auto-commit
