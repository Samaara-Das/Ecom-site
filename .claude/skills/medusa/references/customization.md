# Customization Reference

Creating custom modules, services, data models, links, and API routes.

## Custom Modules

### Module Structure

```
src/modules/my-module/
├── index.ts           # Module definition
├── service.ts         # Business logic
├── models/
│   └── my-model.ts    # Data models
├── migrations/        # Database migrations (auto-generated)
└── loaders/           # Optional: initialization logic
```

### Module Definition

```typescript
// src/modules/my-module/index.ts
import { Module } from "@medusajs/framework/utils"
import MyModuleService from "./service"

export const MY_MODULE = "myModule"

export default Module(MY_MODULE, {
  service: MyModuleService
})
```

### Registering Modules

```typescript
// medusa-config.ts
import { defineConfig } from "@medusajs/framework/utils"

export default defineConfig({
  modules: [
    {
      resolve: "./src/modules/my-module",
      options: {
        // Module-specific options
      }
    }
  ]
})
```

---

## Data Models

### Model Definition

```typescript
// src/modules/my-module/models/my-model.ts
import { model } from "@medusajs/framework/utils"

const MyModel = model.define("my_model", {
  id: model.id().primaryKey(),
  name: model.text(),
  description: model.text().nullable(),
  status: model.enum(["draft", "active", "archived"]).default("draft"),
  priority: model.number().default(0),
  is_featured: model.boolean().default(false),
  metadata: model.json().nullable(),
  external_id: model.text().unique().nullable(),
  created_at: model.dateTime(),
  updated_at: model.dateTime(),
})

export default MyModel
```

### Field Types

```typescript
import { model } from "@medusajs/framework/utils"

const ExampleModel = model.define("example", {
  // Primary key
  id: model.id().primaryKey(),

  // Text fields
  name: model.text(),
  slug: model.text().unique(),
  description: model.text().nullable(),

  // Numbers
  quantity: model.number(),
  price: model.bigNumber(), // For currency (avoids float issues)

  // Boolean
  is_active: model.boolean().default(true),

  // Enum
  status: model.enum(["pending", "active", "completed"]),

  // JSON
  settings: model.json().nullable(),

  // Dates
  published_at: model.dateTime().nullable(),

  // Auto timestamps
  created_at: model.dateTime(),
  updated_at: model.dateTime(),
})
```

### Model Relations

```typescript
// One-to-Many
const Author = model.define("author", {
  id: model.id().primaryKey(),
  name: model.text(),
  books: model.hasMany(() => Book), // Author has many Books
})

const Book = model.define("book", {
  id: model.id().primaryKey(),
  title: model.text(),
  author: model.belongsTo(() => Author, { mappedBy: "books" }),
})

// Many-to-Many
const Product = model.define("product", {
  id: model.id().primaryKey(),
  title: model.text(),
  tags: model.manyToMany(() => Tag, {
    mappedBy: "products",
    pivotTable: "product_tags"
  }),
})

const Tag = model.define("tag", {
  id: model.id().primaryKey(),
  name: model.text(),
  products: model.manyToMany(() => Product, { mappedBy: "tags" }),
})
```

### Generating Migrations

```bash
# Generate migration from model changes
npx medusa db:generate myModule

# Run migrations
npx medusa db:migrate
```

---

## Services

### Service Definition

```typescript
// src/modules/my-module/service.ts
import { MedusaService } from "@medusajs/framework/utils"
import MyModel from "./models/my-model"

class MyModuleService extends MedusaService({
  MyModel,
}) {
  // Inherited methods:
  // - createMyModels(data)
  // - retrieveMyModel(id, config?)
  // - listMyModels(filters?, config?)
  // - updateMyModels(id, data)
  // - deleteMyModels(ids)

  // Custom methods
  async getActiveItems() {
    return await this.listMyModels({
      status: "active"
    })
  }

  async activateItem(id: string) {
    return await this.updateMyModels(id, {
      status: "active"
    })
  }

  async customOperation(data: CustomInput) {
    // Access internal repository
    const items = await this.listMyModels({
      is_featured: true
    }, {
      select: ["id", "name"],
      order: { priority: "DESC" },
      take: 10
    })

    return items
  }
}

export default MyModuleService
```

### Service with Dependencies

```typescript
// src/modules/my-module/service.ts
import { MedusaService } from "@medusajs/framework/utils"
import { Logger } from "@medusajs/framework/types"
import MyModel from "./models/my-model"

type InjectedDependencies = {
  logger: Logger
  // Other injected services
}

class MyModuleService extends MedusaService({
  MyModel,
}) {
  protected logger_: Logger

  constructor({ logger }: InjectedDependencies) {
    super(...arguments)
    this.logger_ = logger
  }

  async performAction(id: string) {
    this.logger_.info(`Performing action on ${id}`)
    // ...
  }
}

export default MyModuleService
```

### Extending Core Services

```typescript
// src/modules/custom-product/service.ts
import { Modules } from "@medusajs/framework/utils"
import ProductModuleService from "@medusajs/medusa/product"

class CustomProductService extends ProductModuleService {
  async createProducts(data) {
    // Add custom logic before
    const modified = {
      ...data,
      metadata: { ...data.metadata, custom_field: "value" }
    }

    const result = await super.createProducts(modified)

    // Add custom logic after

    return result
  }
}

export default CustomProductService

// medusa-config.ts
export default defineConfig({
  modules: [
    {
      resolve: "@medusajs/medusa/product",
      options: {
        // Replace with custom implementation
        service: "./src/modules/custom-product/service"
      }
    }
  ]
})
```

---

## Module Links

### Creating Links

```typescript
// src/links/product-custom.ts
import { defineLink } from "@medusajs/framework/utils"
import ProductModule from "@medusajs/medusa/product"
import MyModule from "../modules/my-module"

export default defineLink(
  ProductModule.linkable.product,
  MyModule.linkable.myModel
)
```

### Link with Custom Fields

```typescript
// src/links/order-custom.ts
import { defineLink } from "@medusajs/framework/utils"
import OrderModule from "@medusajs/medusa/order"
import MyModule from "../modules/my-module"

export default defineLink(
  OrderModule.linkable.order,
  MyModule.linkable.myModel,
  {
    database: {
      table: "order_my_model_link",
      extraColumns: {
        priority: {
          type: "integer",
          defaultValue: 0
        },
        notes: {
          type: "text",
          nullable: true
        }
      }
    }
  }
)
```

### Creating Link Records

```typescript
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)

// Create link
await remoteLink.create({
  [Modules.PRODUCT]: { product_id: productId },
  [MY_MODULE]: { my_model_id: myModelId }
})

// Create link with extra columns
await remoteLink.create({
  [Modules.ORDER]: { order_id: orderId },
  [MY_MODULE]: { my_model_id: myModelId },
  data: {
    priority: 1,
    notes: "Important order"
  }
})

// Delete link
await remoteLink.dismiss({
  [Modules.PRODUCT]: { product_id: productId },
  [MY_MODULE]: { my_model_id: myModelId }
})
```

### Querying Linked Data

```typescript
const query = container.resolve("query")

// Query with linked data
const { data: products } = await query.graph({
  entity: "product",
  fields: [
    "*",
    "my_model.*" // Access linked data
  ],
  filters: { id: productId }
})

const myModel = products[0].my_model
```

### Sync Links to Database

```bash
# After adding/modifying links
npx medusa db:sync-links
```

---

## API Routes

### Route Structure

```
src/api/
├── store/             # Public storefront routes
│   └── custom/
│       └── route.ts   # /store/custom
├── admin/             # Protected admin routes
│   └── custom/
│       ├── route.ts   # /admin/custom
│       └── [id]/
│           └── route.ts  # /admin/custom/:id
└── middlewares.ts     # Global middleware
```

### Basic Routes

```typescript
// src/api/store/custom/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve("query")

  const { data } = await query.graph({
    entity: "product",
    fields: ["id", "title"],
    pagination: {
      skip: parseInt(req.query.offset as string) || 0,
      take: parseInt(req.query.limit as string) || 20
    }
  })

  res.json({ products: data })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { name, description } = req.body

  const myService = req.scope.resolve("myModule")
  const result = await myService.createMyModels({
    name,
    description
  })

  res.status(201).json({ data: result })
}
```

### Route Parameters

```typescript
// src/api/admin/custom/[id]/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params

  const myService = req.scope.resolve("myModule")
  const item = await myService.retrieveMyModel(id)

  res.json({ data: item })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params
  const updates = req.body

  const myService = req.scope.resolve("myModule")
  const item = await myService.updateMyModels(id, updates)

  res.json({ data: item })
}

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params

  const myService = req.scope.resolve("myModule")
  await myService.deleteMyModels([id])

  res.status(200).json({ success: true })
}
```

### Request Validation

```typescript
// src/api/store/custom/validators.ts
import { z } from "zod"

export const CreateItemSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  priority: z.number().int().min(0).max(100).optional()
})

export type CreateItemInput = z.infer<typeof CreateItemSchema>
```

```typescript
// src/api/store/custom/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { CreateItemSchema, CreateItemInput } from "./validators"

export const POST = async (
  req: MedusaRequest<CreateItemInput>,
  res: MedusaResponse
) => {
  const validated = CreateItemSchema.parse(req.body)

  const myService = req.scope.resolve("myModule")
  const result = await myService.createMyModels(validated)

  res.status(201).json({ data: result })
}
```

### Middleware

```typescript
// src/api/middlewares.ts
import { defineMiddlewares } from "@medusajs/framework"
import { authenticate } from "@medusajs/medusa"

export default defineMiddlewares({
  routes: [
    // Protect custom admin routes
    {
      matcher: "/admin/custom/*",
      middlewares: [authenticate("user", ["session", "bearer"])]
    },
    // Protect custom store routes requiring customer auth
    {
      matcher: "/store/account/*",
      middlewares: [authenticate("customer", ["session", "bearer"])]
    },
    // Custom middleware
    {
      matcher: "/store/custom/*",
      middlewares: [
        (req, res, next) => {
          // Custom logic
          req.customData = { timestamp: Date.now() }
          next()
        }
      ]
    }
  ]
})
```

### CORS Configuration

```typescript
// src/api/middlewares.ts
import { defineMiddlewares } from "@medusajs/framework"
import cors from "cors"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/*",
      middlewares: [
        cors({
          origin: ["http://localhost:3000", "https://mystore.com"],
          credentials: true
        })
      ]
    }
  ]
})
```

---

## Loaders

### Custom Loaders

```typescript
// src/modules/my-module/loaders/seed.ts
import { LoaderOptions } from "@medusajs/framework/types"

export default async function seedLoader({ container }: LoaderOptions) {
  const myService = container.resolve("myModule")
  const logger = container.resolve("logger")

  // Check if data exists
  const existing = await myService.listMyModels({}, { take: 1 })

  if (existing.length === 0) {
    logger.info("Seeding my module data...")

    await myService.createMyModels([
      { name: "Default Item 1" },
      { name: "Default Item 2" }
    ])
  }
}
```

### Register Loader

```typescript
// src/modules/my-module/index.ts
import { Module } from "@medusajs/framework/utils"
import MyModuleService from "./service"
import seedLoader from "./loaders/seed"

export default Module("myModule", {
  service: MyModuleService,
  loaders: [seedLoader]
})
```

---

## Error Handling

### Custom Errors

```typescript
import { MedusaError } from "@medusajs/framework/utils"

// In service
async activateItem(id: string) {
  const item = await this.retrieveMyModel(id)

  if (!item) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Item with id ${id} not found`
    )
  }

  if (item.status === "archived") {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Cannot activate archived items"
    )
  }

  return await this.updateMyModels(id, { status: "active" })
}
```

### Error Types

```typescript
MedusaError.Types.NOT_FOUND        // 404
MedusaError.Types.INVALID_DATA     // 400
MedusaError.Types.UNAUTHORIZED     // 401
MedusaError.Types.FORBIDDEN        // 403
MedusaError.Types.CONFLICT         // 409
MedusaError.Types.UNEXPECTED_STATE // 500
```
