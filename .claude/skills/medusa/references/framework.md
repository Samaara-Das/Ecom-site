# Medusa Framework Fundamentals

Core architecture concepts for building with Medusa.

## Contents

- Modules
- Services
- Data Models
- Workflows
- API Routes
- Module Linking

## Modules

Self-contained commerce functionality that can be customized or replaced.

### Module Structure

```
src/modules/my-module/
├── index.ts          # Module definition
├── service.ts        # Business logic
├── models/           # Data models
│   └── my-entity.ts
└── migrations/       # Database migrations
```

### Module Definition

```typescript
// src/modules/brand/index.ts
import BrandModuleService from "./service"

export default {
  service: BrandModuleService,
}
```

### Registering a Module

```typescript
// medusa-config.ts
module.exports = {
  modules: [
    {
      resolve: "./src/modules/brand",
    },
  ],
}
```

## Services

Extend `MedusaService` for automatic CRUD operations on data models.

### Basic Service

```typescript
import { MedusaService } from "@medusajs/framework/utils"
import { Brand } from "./models/brand"

class BrandModuleService extends MedusaService({ Brand }) {
  // Custom methods
  async getPopularBrands() {
    return await this.listBrands({
      filters: { is_popular: true },
    })
  }
}

export default BrandModuleService
```

### Service Methods (Auto-generated)

For a model named `Brand`, these methods are automatically available:

- `createBrands(data)` - Create one or more brands
- `retrieveBrand(id)` - Get a single brand by ID
- `listBrands(filters)` - List brands with filters
- `updateBrands(data)` - Update one or more brands
- `deleteBrands(ids)` - Delete brands by ID

### Resolving Services in Workflows

```typescript
import { Modules } from "@medusajs/framework/utils"

const step1 = createStep("step-1", async ({}, { container }) => {
  const productService = container.resolve(Modules.PRODUCT)
  const products = await productService.listProducts()
  return products
})
```

## Data Models

Define entities using Medusa's DML (Data Modeling Language).

### Basic Model

```typescript
// src/modules/brand/models/brand.ts
import { model } from "@medusajs/framework/utils"

const Brand = model.define("brand", {
  id: model.id().primaryKey(),
  name: model.text(),
  description: model.text().nullable(),
  is_active: model.boolean().default(true),
  created_at: model.dateTime(),
})

export default Brand
```

### Model Field Types

| Type | Usage |
|------|-------|
| `model.id()` | Primary key |
| `model.text()` | String field |
| `model.number()` | Numeric field |
| `model.boolean()` | Boolean field |
| `model.dateTime()` | Date/time field |
| `model.json()` | JSON object |
| `model.enum()` | Enumeration |

### Relationships

```typescript
const Brand = model.define("brand", {
  id: model.id().primaryKey(),
  name: model.text(),
  products: model.hasMany(() => Product),
})

const Product = model.define("product", {
  id: model.id().primaryKey(),
  brand: model.belongsTo(() => Brand),
})
```

## Workflows

Orchestrate multi-step business logic with rollback support.

### Basic Workflow

```typescript
import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"

// Define a step
const step1 = createStep(
  "step-1",
  async (input: { name: string }) => {
    return new StepResponse({ message: `Hello ${input.name}` })
  }
)

// Create workflow
const helloWorldWorkflow = createWorkflow(
  "hello-world",
  (input: { name: string }) => {
    const result = step1(input)
    return new WorkflowResponse(result)
  }
)

export default helloWorldWorkflow
```

### Step with Compensation (Rollback)

```typescript
const createOrderStep = createStep(
  "create-order",
  async (input: OrderInput, { container }) => {
    const orderService = container.resolve(Modules.ORDER)
    const order = await orderService.createOrders(input)

    return new StepResponse(order, order.id)
  },
  // Compensation function (runs on rollback)
  async (orderId, { container }) => {
    const orderService = container.resolve(Modules.ORDER)
    await orderService.deleteOrders([orderId])
  }
)
```

### Running a Workflow

```typescript
// In an API route
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { result } = await helloWorldWorkflow(req.scope).run({
    input: { name: req.body.name },
  })

  res.json(result)
}
```

### Using Core Flow Steps

```typescript
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

export const myWorkflow = createWorkflow("my-workflow", () => {
  const { data: products } = useQueryGraphStep({
    entity: "product",
    fields: ["id", "title", "variants.*"],
  })

  return new WorkflowResponse(products)
})
```

## API Routes

Custom endpoints using `MedusaRequest` and `MedusaResponse`.

### Route File Location

Routes are defined by file path:
- `src/api/store/custom/route.ts` → `GET /store/custom`
- `src/api/admin/custom/route.ts` → `GET /admin/custom`
- `src/api/custom/[id]/route.ts` → `GET /custom/:id`

### GET Route

```typescript
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params

  res.json({ id, message: "Success" })
}
```

### POST Route with Validation

```typescript
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"

const schema = z.object({
  name: z.string(),
  email: z.string().email(),
})

export async function POST(
  req: MedusaRequest<z.infer<typeof schema>>,
  res: MedusaResponse
) {
  const validated = schema.parse(req.body)

  res.json({ data: validated })
}
```

### Authenticated Admin Route

```typescript
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  // req.auth contains authenticated user info
  const userId = req.auth?.actor_id

  const userService = container.resolve(Modules.USER)
  const user = await userService.retrieveUser(userId)

  res.json({ user })
}
```

## Module Linking

Connect data across different modules using `defineLink`.

### Defining a Link

```typescript
// src/links/product-brand.ts
import { defineLink } from "@medusajs/framework/utils"
import ProductModule from "@medusajs/medusa/product"
import BrandModule from "../modules/brand"

export default defineLink(ProductModule.linkable.product, BrandModule.linkable.brand)
```

### Creating Links at Runtime

```typescript
import { Modules } from "@medusajs/framework/utils"

// In a service or workflow step
await link.create({
  [Modules.PRODUCT]: {
    product_id: "prod_123",
  },
  ["brand"]: {
    brand_id: "brand_456",
  },
})
```

### Querying Linked Data

```typescript
const { data: products } = await query.graph({
  entity: "product",
  fields: [
    "id",
    "title",
    "brand.*",  // Include linked brand data
  ],
})
```

## Remote Query

Query data across modules with relationships.

### Basic Query

```typescript
const { data: orders } = await query.graph({
  entity: "order",
  fields: [
    "id",
    "total",
    "customer.*",
    "items.*",
    "items.variant.*",
  ],
  filters: {
    created_at: { $gte: "2024-01-01" },
  },
})
```

### Query with Pagination

```typescript
const { data: products, metadata } = await query.graph({
  entity: "product",
  fields: ["id", "title"],
  pagination: {
    skip: 0,
    take: 10,
  },
})
```
