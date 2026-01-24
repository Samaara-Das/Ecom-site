---
name: medusa-development
description: Provides comprehensive knowledge for building with Medusa, the open-source headless ecommerce platform. Covers framework fundamentals (modules, services, workflows, API routes), commerce modules (product, pricing, cart, order, payment, fulfillment, inventory), infrastructure modules (cache, event bus, file, notification, workflow engine), admin dashboard customization (UI routes, widgets, settings pages), storefront development (JS SDK, cart, checkout, authentication), and common recipes (marketplace, subscriptions, B2B, digital products). Use when working on Medusa ecommerce projects, building custom storefronts, extending the admin dashboard, or implementing commerce features.
---

# Medusa Development

Medusa is an open-source, composable ecommerce platform for building custom digital commerce applications including B2B/DTC stores, marketplaces, subscription services, and POS systems.

## Architecture Overview

```
STOREFRONTS (Next.js, React, Mobile - using JS SDK)
                    |
            MEDUSA BACKEND
    ----------------------------------------
    Commerce Modules    |  Infrastructure
    - Product           |  - Cache (Redis)
    - Pricing           |  - Event Bus
    - Cart              |  - File (S3)
    - Order             |  - Notification
    - Payment           |  - Workflow Engine
    - Fulfillment       |
    - Customer          |  Admin Dashboard
    - Inventory         |  (UI Routes, Widgets)
```

## Quick Reference

### Creating a Custom Module Service

```typescript
import { MedusaService } from "@medusajs/framework/utils"
import { Brand } from "./models/brand"

class BrandModuleService extends MedusaService({ Brand }) {}
export default BrandModuleService
```

### Creating an API Route

```typescript
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { result } = await myWorkflow(req.scope).run({ input: { name: "John" } })
  res.send(result)
}
```

### Creating an Admin UI Route

```tsx
import { Container, Heading } from "@medusajs/ui"
import { defineRouteConfig } from "@medusajs/admin-sdk"

const CustomPage = () => (
  <Container className="divide-y p-0">
    <div className="flex items-center justify-between px-6 py-4">
      <Heading level="h2">Custom Page</Heading>
    </div>
  </Container>
)

export const config = defineRouteConfig({ label: "Custom" })
export default CustomPage
```

### Storefront Cart Creation

```jsx
sdk.store.cart.create({ region_id: region.id })
  .then(({ cart }) => localStorage.setItem("cart_id", cart.id))
```

## Detailed References

Select the appropriate reference based on the task:

| Task | Reference |
|------|-----------|
| Core concepts (modules, services, workflows, API routes) | [references/framework.md](references/framework.md) |
| Product, pricing, cart, order, payment, fulfillment | [references/commerce-modules.md](references/commerce-modules.md) |
| Cache, events, files, notifications, workflow engine | [references/infrastructure-modules.md](references/infrastructure-modules.md) |
| UI routes, widgets, settings pages | [references/admin-dashboard.md](references/admin-dashboard.md) |
| JS SDK, cart, checkout, authentication | [references/storefront-development.md](references/storefront-development.md) |
| Marketplace, subscriptions, B2B, digital products | [references/recipes.md](references/recipes.md) |

## Key Imports

```typescript
// Framework utilities
import { Modules } from "@medusajs/framework/utils"
import { MedusaService } from "@medusajs/framework/utils"

// Workflows
import { createStep, createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"

// HTTP types
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// Admin SDK
import { defineRouteConfig } from "@medusajs/admin-sdk"

// UI components
import { Container, Heading, Button, toast } from "@medusajs/ui"
```

## Search Patterns

Find specific topics in reference files:

```bash
# Find module linking examples
grep -i "link.create" references/commerce-modules.md

# Find workflow examples
grep -i "createWorkflow" references/framework.md

# Find storefront SDK methods
grep -i "sdk.store" references/storefront-development.md

# Find admin customization
grep -i "defineRouteConfig" references/admin-dashboard.md
```

## Fetching Latest Documentation

When bundled references may be outdated or when specific up-to-date information is needed, use the **context7 MCP** to query the latest Medusa documentation.

### Context7 MCP Usage

**Step 1: Get tool schema**
```bash
mcp-cli info context7/query-docs
```

**Step 2: Query Medusa documentation**
```bash
mcp-cli call context7/query-docs '{"libraryId": "/medusajs/medusa", "query": "your specific question here"}'
```

### Available Medusa Library IDs

| Library ID | Best For | Benchmark Score |
|------------|----------|-----------------|
| `/llmstxt/medusajs_llms-full_txt` | Comprehensive docs, highest quality | 72.3 |
| `/websites/medusajs_resources` | Resources, recipes, guides | 58 |
| `/medusajs/medusa` | Core framework documentation | 19.7 |

### Example Queries

```bash
# Latest workflow patterns
mcp-cli call context7/query-docs '{"libraryId": "/llmstxt/medusajs_llms-full_txt", "query": "How to create workflows with compensation and rollback in Medusa"}'

# Latest admin customization
mcp-cli call context7/query-docs '{"libraryId": "/websites/medusajs_resources", "query": "Medusa admin dashboard widgets UI routes customization"}'

# Latest storefront SDK methods
mcp-cli call context7/query-docs '{"libraryId": "/llmstxt/medusajs_llms-full_txt", "query": "Medusa JS SDK storefront cart checkout authentication"}'

# Latest module documentation
mcp-cli call context7/query-docs '{"libraryId": "/medusajs/medusa", "query": "Medusa commerce modules payment fulfillment inventory"}'
```

### When to Use Context7

- **API changes**: Verify method signatures and parameters
- **New features**: Check for recently added functionality
- **Breaking changes**: Confirm migration patterns
- **Integration guides**: Get latest third-party integration instructions
- **Version-specific**: Query documentation for specific Medusa versions
