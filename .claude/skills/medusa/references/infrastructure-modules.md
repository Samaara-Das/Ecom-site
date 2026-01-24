# Medusa Infrastructure Modules

Backend infrastructure services that power Medusa applications.

## Contents

- Module Overview
- Cache Module
- Event Bus Module
- File Module
- Notification Module
- Workflow Engine Module
- Locking Module

## Module Overview

| Module | Purpose | Dev Provider | Prod Provider |
|--------|---------|--------------|---------------|
| Cache | Data caching for performance | In-Memory | Redis |
| Event Bus | Pub/sub event system | Local | Redis |
| File | File storage/uploads | Local | S3 |
| Notification | Send notifications | - | SendGrid, custom |
| Workflow Engine | Track workflow execution | In-Memory | Redis |
| Locking | Distributed locks | In-Memory | Redis |

## Cache Module

Store and retrieve cached data for improved performance.

### Resolving Cache Service

```typescript
import { Modules } from "@medusajs/framework/utils"
import { createStep, createWorkflow } from "@medusajs/framework/workflows-sdk"

const step1 = createStep("step-1", async ({}, { container }) => {
  const cacheService = container.resolve(Modules.CACHE)

  // Set cache value
  await cacheService.set("key", "value")

  // Set with TTL (in seconds)
  await cacheService.set("temp-key", "value", 3600)

  // Get cached value
  const value = await cacheService.get("key")

  // Delete cached value
  await cacheService.delete("key")
})
```

### Cache in Query Graph

```typescript
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

const { data: products } = useQueryGraphStep({
  entity: "product",
  fields: ["id", "title"],
  options: {
    cache: {
      enable: true,
      providers: ["caching-redis"],
    },
  },
})
```

### Redis Cache Configuration

```typescript
// medusa-config.ts
module.exports = {
  modules: [
    {
      resolve: "@medusajs/medusa/cache-redis",
      options: {
        redisUrl: process.env.REDIS_URL,
      },
    },
  ],
}
```

## Event Bus Module

Publish and subscribe to events across the application.

### Emitting Events

```typescript
import { Modules } from "@medusajs/framework/utils"

const eventBusService = container.resolve(Modules.EVENT_BUS)

await eventBusService.emit({
  name: "order.placed",
  data: {
    id: "order_123",
    customer_id: "cus_123",
  },
})
```

### Emitting Multiple Events

```typescript
await eventBusService.emit([
  {
    name: "order.placed",
    data: { id: "order_123" },
  },
  {
    name: "notification.send",
    data: { type: "order_confirmation" },
  },
])
```

### Creating Subscribers

```typescript
// src/subscribers/order-placed.ts
import type { SubscriberConfig, SubscriberArgs } from "@medusajs/framework"

export default async function orderPlacedHandler({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const orderId = event.data.id

  console.log(`Order placed: ${orderId}`)

  // Trigger notification, update analytics, etc.
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
```

### Built-in Events

| Event | Trigger |
|-------|---------|
| `order.placed` | New order created |
| `order.updated` | Order modified |
| `order.canceled` | Order canceled |
| `customer.created` | New customer registered |
| `product.created` | Product added |
| `product.updated` | Product modified |
| `inventory.updated` | Stock level changed |

### Redis Event Bus Configuration

```typescript
// medusa-config.ts
module.exports = {
  modules: [
    {
      resolve: "@medusajs/medusa/event-bus-redis",
      options: {
        redisUrl: process.env.REDIS_URL,
      },
    },
  ],
}
```

## File Module

Handle file uploads and storage.

### Uploading Files

```typescript
import { Modules } from "@medusajs/framework/utils"

const fileService = container.resolve(Modules.FILE)

const files = await fileService.uploadFiles([
  {
    filename: "product-image.jpg",
    mimeType: "image/jpeg",
    content: fileBuffer,
  },
])

// Returns array with file URLs
console.log(files[0].url)
```

### Retrieving Files

```typescript
const file = await fileService.retrieveFile(fileId)
console.log(file.url)
```

### Deleting Files

```typescript
await fileService.deleteFiles([fileId])
```

### S3 File Configuration

```typescript
// medusa-config.ts
module.exports = {
  modules: [
    {
      resolve: "@medusajs/medusa/file-s3",
      options: {
        file_url: process.env.S3_FILE_URL,
        access_key_id: process.env.S3_ACCESS_KEY_ID,
        secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
        region: process.env.S3_REGION,
        bucket: process.env.S3_BUCKET,
      },
    },
  ],
}
```

## Notification Module

Send notifications through various channels.

### Sending Notifications

```typescript
import { Modules } from "@medusajs/framework/utils"

const notificationService = container.resolve(Modules.NOTIFICATION)

await notificationService.createNotifications({
  to: "customer@example.com",
  channel: "email",
  template: "order-confirmation",
  data: {
    order_id: "order_123",
    customer_name: "John Doe",
  },
})
```

### Notification Providers

```typescript
// medusa-config.ts
module.exports = {
  modules: [
    {
      resolve: "@medusajs/medusa/notification",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/notification-sendgrid",
            id: "sendgrid",
            options: {
              apiKey: process.env.SENDGRID_API_KEY,
              from: process.env.SENDGRID_FROM,
            },
          },
        ],
      },
    },
  ],
}
```

### Creating Custom Notification Provider

```typescript
// src/modules/notification-custom/service.ts
import { AbstractNotificationProviderService } from "@medusajs/framework/utils"

class CustomNotificationService extends AbstractNotificationProviderService {
  async send(notification) {
    // Implement custom sending logic
    console.log(`Sending to ${notification.to}`)

    return {
      id: notification.id,
    }
  }
}

export default CustomNotificationService
```

## Workflow Engine Module

Track and manage workflow executions.

### Running Workflows

```typescript
import { Modules } from "@medusajs/framework/utils"

const workflowEngine = container.resolve(Modules.WORKFLOW_ENGINE)

const { result, transaction } = await workflowEngine.run("my-workflow", {
  input: { orderId: "order_123" },
})
```

### Subscribing to Workflow Events

```typescript
await workflowEngine.subscribe({
  workflowId: "hello-world",
  transactionId: "tx_123",
  subscriberId: "my-subscriber",
  subscriber: async (data) => {
    if (data.eventType === "onFinish") {
      console.log("Workflow finished:", data.result)
    } else if (data.eventType === "onStepFailure") {
      console.log("Step failed:", data.step)
    }
  },
})
```

### Unsubscribing

```typescript
await workflowEngine.unsubscribe({
  workflowId: "hello-world",
  transactionId: "tx_123",
  subscriberOrId: "my-subscriber",
})
```

### Workflow Execution Status

```typescript
const execution = await workflowEngine.retrieveExecution(transactionId)

console.log(execution.state)  // "invoking", "done", "failed"
console.log(execution.steps)  // Step details
```

### Redis Workflow Engine Configuration

```typescript
// medusa-config.ts
module.exports = {
  modules: [
    {
      resolve: "@medusajs/medusa/workflow-engine-redis",
      options: {
        redisUrl: process.env.REDIS_URL,
      },
    },
  ],
}
```

## Locking Module

Manage distributed locks for concurrent operations.

### Acquiring Locks

```typescript
import { Modules } from "@medusajs/framework/utils"

const lockingService = container.resolve(Modules.LOCKING)

// Acquire lock
const lock = await lockingService.acquire("inventory-update-123")

try {
  // Perform exclusive operation
  await updateInventory()
} finally {
  // Release lock
  await lockingService.release("inventory-update-123")
}
```

### Lock with Timeout

```typescript
// Lock expires after 30 seconds
const lock = await lockingService.acquire("my-lock", {
  timeout: 30000,
})
```

### Check Lock Status

```typescript
const isLocked = await lockingService.isLocked("inventory-update-123")
```

### Redis Locking Configuration

```typescript
// medusa-config.ts
module.exports = {
  modules: [
    {
      resolve: "@medusajs/medusa/locking-redis",
      options: {
        redisUrl: process.env.REDIS_URL,
      },
    },
  ],
}
```

## Production Configuration

Recommended configuration for production:

```typescript
// medusa-config.ts
module.exports = {
  projectConfig: {
    redisUrl: process.env.REDIS_URL,
    databaseUrl: process.env.DATABASE_URL,
  },
  modules: [
    // Cache
    {
      resolve: "@medusajs/medusa/cache-redis",
      options: { redisUrl: process.env.REDIS_URL },
    },
    // Event Bus
    {
      resolve: "@medusajs/medusa/event-bus-redis",
      options: { redisUrl: process.env.REDIS_URL },
    },
    // Workflow Engine
    {
      resolve: "@medusajs/medusa/workflow-engine-redis",
      options: { redisUrl: process.env.REDIS_URL },
    },
    // Locking
    {
      resolve: "@medusajs/medusa/locking-redis",
      options: { redisUrl: process.env.REDIS_URL },
    },
    // File Storage
    {
      resolve: "@medusajs/medusa/file-s3",
      options: {
        file_url: process.env.S3_FILE_URL,
        access_key_id: process.env.S3_ACCESS_KEY_ID,
        secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
        region: process.env.S3_REGION,
        bucket: process.env.S3_BUCKET,
      },
    },
  ],
}
```
