# Workflows & Events Reference

Creating workflows, steps, compensation logic, and event subscribers.

## Workflows Overview

Workflows are multi-step operations with built-in:
- **Rollback/compensation** - Automatic undo on failure
- **Retries** - Configurable retry logic
- **Idempotency** - Safe to retry
- **Async execution** - Background processing

### Workflow Structure

```
Workflow
├── Step 1 (with compensation)
├── Step 2 (with compensation)
├── Step 3 (with compensation)
└── Final output

On failure at Step 3:
  → Run Step 2 compensation
  → Run Step 1 compensation
```

---

## Creating Workflows

### Basic Workflow

```typescript
// src/workflows/create-custom-item.ts
import {
  createWorkflow,
  createStep,
  StepResponse,
  WorkflowResponse
} from "@medusajs/framework/workflows-sdk"

// Define step
const createItemStep = createStep(
  "create-item-step",
  async (input: { name: string; description?: string }, { container }) => {
    const myService = container.resolve("myModule")

    const item = await myService.createMyModels({
      name: input.name,
      description: input.description
    })

    // Return data and compensation input
    return new StepResponse(item, item.id)
  },
  // Compensation function (rollback)
  async (itemId: string, { container }) => {
    const myService = container.resolve("myModule")
    await myService.deleteMyModels([itemId])
  }
)

// Define workflow
export const createCustomItemWorkflow = createWorkflow(
  "create-custom-item",
  (input: { name: string; description?: string }) => {
    const item = createItemStep(input)
    return new WorkflowResponse(item)
  }
)
```

### Running Workflows

```typescript
// In API route or service
const { result } = await createCustomItemWorkflow(container).run({
  input: {
    name: "My Item",
    description: "Item description"
  }
})

console.log(result) // Created item
```

### Multi-Step Workflow

```typescript
import {
  createWorkflow,
  createStep,
  StepResponse,
  WorkflowResponse,
  transform
} from "@medusajs/framework/workflows-sdk"

const validateInputStep = createStep(
  "validate-input",
  async (input: { name: string }) => {
    if (input.name.length < 3) {
      throw new Error("Name must be at least 3 characters")
    }
    return new StepResponse(input)
  }
  // No compensation needed for validation
)

const createItemStep = createStep(
  "create-item",
  async (input: { name: string }, { container }) => {
    const service = container.resolve("myModule")
    const item = await service.createMyModels(input)
    return new StepResponse(item, item.id)
  },
  async (id, { container }) => {
    const service = container.resolve("myModule")
    await service.deleteMyModels([id])
  }
)

const notifyStep = createStep(
  "notify",
  async (input: { itemId: string; itemName: string }, { container }) => {
    const logger = container.resolve("logger")
    logger.info(`Created item: ${input.itemName} (${input.itemId})`)
    return new StepResponse({ notified: true })
  }
)

export const createItemWithNotificationWorkflow = createWorkflow(
  "create-item-with-notification",
  (input: { name: string }) => {
    // Steps execute in sequence
    const validated = validateInputStep(input)
    const item = createItemStep(validated)

    // Transform step output for next step
    const notifyInput = transform({ item }, (data) => ({
      itemId: data.item.id,
      itemName: data.item.name
    }))

    notifyStep(notifyInput)

    return new WorkflowResponse(item)
  }
)
```

---

## Step Patterns

### Step with Async Compensation

```typescript
const chargePaymentStep = createStep(
  "charge-payment",
  async (input: { amount: number; paymentMethodId: string }, { container }) => {
    const paymentService = container.resolve("payment")

    const charge = await paymentService.charge({
      amount: input.amount,
      payment_method_id: input.paymentMethodId
    })

    return new StepResponse(charge, {
      chargeId: charge.id,
      amount: input.amount
    })
  },
  async (compensateInput, { container }) => {
    const paymentService = container.resolve("payment")

    // Refund the charge
    await paymentService.refund({
      charge_id: compensateInput.chargeId,
      amount: compensateInput.amount
    })
  }
)
```

### Step with Container Access

```typescript
const enrichDataStep = createStep(
  "enrich-data",
  async (input: { productId: string }, { container }) => {
    const query = container.resolve("query")
    const logger = container.resolve("logger")

    logger.info(`Enriching product ${input.productId}`)

    const { data: [product] } = await query.graph({
      entity: "product",
      fields: ["*", "variants.*", "categories.*"],
      filters: { id: input.productId }
    })

    return new StepResponse(product)
  }
)
```

### Parallel Steps

```typescript
import { parallelize } from "@medusajs/framework/workflows-sdk"

const [result1, result2] = parallelize(
  step1(input1),
  step2(input2)
)
```

### Conditional Steps

```typescript
import { when } from "@medusajs/framework/workflows-sdk"

const result = when(input, (data) => data.shouldProcess)
  .then(() => processStep(input))
```

---

## Using Query in Workflows

### useQueryGraphStep

```typescript
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

export const getProductDetailsWorkflow = createWorkflow(
  "get-product-details",
  (input: { productId: string }) => {
    const { data } = useQueryGraphStep({
      entity: "product",
      fields: [
        "*",
        "variants.*",
        "variants.prices.*",
        "variants.inventory_items.*", // Linked data
        "categories.*",
        "sales_channels.*"
      ],
      filters: { id: input.productId }
    })

    return new WorkflowResponse(data)
  }
)
```

### Query with Pagination

```typescript
const { data, metadata } = useQueryGraphStep({
  entity: "order",
  fields: ["*", "items.*"],
  filters: {
    customer_id: input.customerId,
    status: ["pending", "completed"]
  },
  pagination: {
    skip: input.offset || 0,
    take: input.limit || 20,
    order: { created_at: "DESC" }
  }
})
```

---

## Built-in Workflows

### Cart & Checkout

```typescript
import {
  addToCartWorkflow,
  updateLineItemInCartWorkflow,
  deleteLineItemsWorkflow,
  completeCartWorkflow
} from "@medusajs/medusa/core-flows"

// Add to cart
await addToCartWorkflow(container).run({
  input: {
    cart_id: cartId,
    items: [{ variant_id: variantId, quantity: 1 }]
  }
})

// Complete checkout
const { result } = await completeCartWorkflow(container).run({
  input: { id: cartId }
})
```

### Order Management

```typescript
import {
  createFulfillmentWorkflow,
  markFulfillmentAsShippedWorkflow,
  capturePaymentWorkflow,
  createReturnWorkflow,
  refundPaymentWorkflow
} from "@medusajs/medusa/core-flows"

// Create fulfillment
await createFulfillmentWorkflow(container).run({
  input: {
    order_id: orderId,
    items: [{ id: itemId, quantity: 1 }]
  }
})

// Capture payment
await capturePaymentWorkflow(container).run({
  input: { payment_id: paymentId }
})
```

### Product Management

```typescript
import {
  createProductsWorkflow,
  updateProductsWorkflow,
  deleteProductsWorkflow
} from "@medusajs/medusa/core-flows"

const { result } = await createProductsWorkflow(container).run({
  input: {
    products: [{
      title: "New Product",
      variants: [{ title: "Default", prices: [{ amount: 1000, currency_code: "usd" }] }]
    }]
  }
})
```

---

## Event Subscribers

### Subscriber Structure

```typescript
// src/subscribers/order-placed.ts
import {
  SubscriberArgs,
  SubscriberConfig
} from "@medusajs/framework"

type OrderPlacedData = {
  id: string
}

export default async function orderPlacedHandler({
  event,
  container
}: SubscriberArgs<OrderPlacedData>) {
  const orderId = event.data.id
  const query = container.resolve("query")
  const logger = container.resolve("logger")

  // Fetch order details
  const { data: [order] } = await query.graph({
    entity: "order",
    fields: ["*", "customer.*", "items.*"],
    filters: { id: orderId }
  })

  logger.info(`Order ${order.display_id} placed by ${order.customer?.email}`)

  // Trigger additional logic
  // - Send confirmation email
  // - Update analytics
  // - Sync with external systems
}

export const config: SubscriberConfig = {
  event: "order.placed"
}
```

### Multiple Events

```typescript
// src/subscribers/inventory-changes.ts
export default async function inventoryHandler({
  event,
  container
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve("logger")
  logger.info(`Inventory event: ${event.name}`, event.data)
}

export const config: SubscriberConfig = {
  event: [
    "inventory-item.created",
    "inventory-item.updated",
    "inventory-level.updated"
  ]
}
```

---

## Common Events

### Order Events

```typescript
"order.placed"              // Order created from cart
"order.updated"             // Order details updated
"order.canceled"            // Order canceled
"order.completed"           // Order fully processed
"order.fulfillment_created" // Fulfillment created
"order.shipment_created"    // Shipment tracking added
"order.return_requested"    // Return initiated
"order.items_returned"      // Items marked as returned
"order.refund_created"      // Refund processed
```

### Customer Events

```typescript
"customer.created"          // New customer registered
"customer.updated"          // Customer profile updated
"customer.password_reset"   // Password reset requested
```

### Product Events

```typescript
"product.created"           // Product created
"product.updated"           // Product updated
"product.deleted"           // Product deleted
"product-variant.created"   // Variant created
"product-variant.updated"   // Variant updated
```

### Cart Events

```typescript
"cart.created"              // Cart initialized
"cart.updated"              // Cart modified
"cart.customer_updated"     // Customer attached to cart
```

### Inventory Events

```typescript
"inventory-item.created"    // Inventory item created
"inventory-level.updated"   // Stock level changed
"reservation-item.created"  // Inventory reserved
```

### Payment Events

```typescript
"payment.captured"          // Payment captured
"payment.refunded"          // Payment refunded
```

---

## Emitting Custom Events

### In Services

```typescript
import { MedusaService } from "@medusajs/framework/utils"

class MyModuleService extends MedusaService({ MyModel }) {
  async activateItem(id: string) {
    const item = await this.updateMyModels(id, { status: "active" })

    // Emit custom event
    await this.eventBusService_.emit("my-item.activated", {
      id: item.id,
      name: item.name
    })

    return item
  }
}
```

### In Workflows

```typescript
import { emitEventStep } from "@medusajs/medusa/core-flows"

export const myWorkflow = createWorkflow("my-workflow", (input) => {
  const item = createItemStep(input)

  emitEventStep({
    eventName: "custom.item.created",
    data: { id: item.id }
  })

  return new WorkflowResponse(item)
})
```

### Subscribe to Custom Events

```typescript
// src/subscribers/custom-item-activated.ts
export default async function itemActivatedHandler({
  event,
  container
}: SubscriberArgs<{ id: string; name: string }>) {
  const logger = container.resolve("logger")
  logger.info(`Item activated: ${event.data.name}`)
}

export const config: SubscriberConfig = {
  event: "my-item.activated"
}
```

---

## Workflow Configuration

### Retry Configuration

```typescript
const riskyStep = createStep(
  {
    name: "risky-step",
    retryConfig: {
      maxRetries: 3,
      retryInterval: 1000, // ms
      retryIntervalMultiplier: 2 // exponential backoff
    }
  },
  async (input, { container }) => {
    // Step logic
  }
)
```

### Async Workflow Execution

```typescript
// Run workflow in background
const { transaction } = await myWorkflow(container).run({
  input: { /* ... */ },
  throwOnError: false // Don't throw, return transaction
})

// Check status later
const status = await myWorkflow(container).getRunningStatus(transaction.id)
```

### Workflow Hooks

```typescript
import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"

export const myWorkflow = createWorkflow(
  {
    name: "my-workflow",
    hooks: ["beforeCreate", "afterCreate"]
  },
  (input) => {
    // Workflow steps
  }
)

// Register hook handlers elsewhere
myWorkflow.hooks.beforeCreate((input) => {
  // Pre-processing
})

myWorkflow.hooks.afterCreate((result) => {
  // Post-processing
})
```
