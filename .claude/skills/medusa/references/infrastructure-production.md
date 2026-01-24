# Infrastructure & Production Reference

Configuration, Redis modules, file storage, notifications, and deployment.

## medusa-config.ts

### Basic Configuration

```typescript
// medusa-config.ts
import { defineConfig, loadEnv } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

export default defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    databaseLogging: false,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS || "http://localhost:8000",
      adminCors: process.env.ADMIN_CORS || "http://localhost:9000",
      authCors: process.env.AUTH_CORS || "http://localhost:8000,http://localhost:9000",
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret"
    }
  },
  admin: {
    backendUrl: process.env.MEDUSA_BACKEND_URL || "http://localhost:9000",
    disable: process.env.DISABLE_ADMIN === "true"
  },
  modules: [
    // Module configurations
  ]
})
```

### Full Production Configuration

```typescript
// medusa-config.ts
import { defineConfig, loadEnv, Modules } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

export default defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    databaseLogging: false,
    databaseDriverOptions: {
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
    },
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS,
      adminCors: process.env.ADMIN_CORS,
      authCors: process.env.AUTH_CORS,
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET
    },
    workerMode: process.env.WORKER_MODE as "shared" | "worker" | "server"
  },
  admin: {
    backendUrl: process.env.MEDUSA_BACKEND_URL,
    disable: process.env.DISABLE_ADMIN === "true"
  },
  modules: [
    // Redis modules for production
    {
      resolve: "@medusajs/medusa/cache-redis",
      options: {
        redisUrl: process.env.REDIS_URL
      }
    },
    {
      resolve: "@medusajs/medusa/event-bus-redis",
      options: {
        redisUrl: process.env.REDIS_URL
      }
    },
    {
      resolve: "@medusajs/medusa/workflow-engine-redis",
      options: {
        redis: {
          url: process.env.REDIS_URL
        }
      }
    },
    {
      resolve: "@medusajs/medusa/locking-redis",
      options: {
        redisUrl: process.env.REDIS_URL
      }
    },
    // File storage
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/file-s3",
            id: "s3",
            options: {
              file_url: process.env.S3_FILE_URL,
              access_key_id: process.env.S3_ACCESS_KEY_ID,
              secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
              region: process.env.S3_REGION,
              bucket: process.env.S3_BUCKET,
              prefix: process.env.S3_PREFIX
            }
          }
        ]
      }
    },
    // Notifications
    {
      resolve: "@medusajs/medusa/notification",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/notification-sendgrid",
            id: "sendgrid",
            options: {
              channels: ["email"],
              api_key: process.env.SENDGRID_API_KEY,
              from: process.env.SENDGRID_FROM
            }
          }
        ]
      }
    },
    // Payment providers
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/payment-stripe",
            id: "stripe",
            options: {
              apiKey: process.env.STRIPE_API_KEY,
              webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
            }
          }
        ]
      }
    },
    // Custom modules
    {
      resolve: "./src/modules/my-module"
    }
  ]
})
```

---

## Redis Modules

### Cache Module (Redis)

```typescript
// Caching for query results and computed data
{
  resolve: "@medusajs/medusa/cache-redis",
  options: {
    redisUrl: process.env.REDIS_URL,
    ttl: 30 // Default TTL in seconds
  }
}
```

**Usage:**
```typescript
const cacheService = container.resolve("cache")

// Set cache
await cacheService.set("my-key", { data: "value" }, 60) // 60 seconds TTL

// Get cache
const cached = await cacheService.get("my-key")

// Invalidate
await cacheService.invalidate("my-key")
```

### Event Bus (Redis)

```typescript
// Distributed event handling
{
  resolve: "@medusajs/medusa/event-bus-redis",
  options: {
    redisUrl: process.env.REDIS_URL
  }
}
```

**Features:**
- Events distributed across workers
- Reliable message delivery
- Automatic retries

### Workflow Engine (Redis)

```typescript
// Distributed workflow execution
{
  resolve: "@medusajs/medusa/workflow-engine-redis",
  options: {
    redis: {
      url: process.env.REDIS_URL
    }
  }
}
```

**Features:**
- Workflow state persistence
- Distributed step execution
- Async workflow support

### Locking Module (Redis)

```typescript
// Distributed locks for concurrency control
{
  resolve: "@medusajs/medusa/locking-redis",
  options: {
    redisUrl: process.env.REDIS_URL
  }
}
```

**Usage:**
```typescript
const lockingService = container.resolve("locking")

// Acquire lock
const lock = await lockingService.acquire("my-resource", {
  timeout: 5000 // Wait up to 5 seconds
})

try {
  // Critical section
} finally {
  await lockingService.release("my-resource")
}
```

---

## File Module

### S3 Provider

```typescript
{
  resolve: "@medusajs/medusa/file",
  options: {
    providers: [
      {
        resolve: "@medusajs/medusa/file-s3",
        id: "s3",
        options: {
          file_url: process.env.S3_FILE_URL,
          access_key_id: process.env.S3_ACCESS_KEY_ID,
          secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
          region: process.env.S3_REGION,
          bucket: process.env.S3_BUCKET,
          prefix: "uploads" // Optional prefix for files
        }
      }
    ]
  }
}
```

### Local File Provider (Development)

```typescript
{
  resolve: "@medusajs/medusa/file",
  options: {
    providers: [
      {
        resolve: "@medusajs/medusa/file-local",
        id: "local",
        options: {
          upload_dir: "uploads",
          backend_url: "http://localhost:9000"
        }
      }
    ]
  }
}
```

### File Upload Usage

```typescript
const fileService = container.resolve(Modules.FILE)

// Upload file
const { files } = await fileService.createFiles([
  {
    filename: "product-image.jpg",
    mimeType: "image/jpeg",
    content: fileBuffer, // Buffer or stream
    access: "public"
  }
])

// Get file URL
const fileUrl = files[0].url

// Delete file
await fileService.deleteFiles([files[0].id])
```

---

## Notification Module

### SendGrid Provider

```typescript
{
  resolve: "@medusajs/medusa/notification",
  options: {
    providers: [
      {
        resolve: "@medusajs/medusa/notification-sendgrid",
        id: "sendgrid",
        options: {
          channels: ["email"],
          api_key: process.env.SENDGRID_API_KEY,
          from: process.env.SENDGRID_FROM
        }
      }
    ]
  }
}
```

### Sending Notifications

```typescript
const notificationService = container.resolve(Modules.NOTIFICATION)

// Send email
await notificationService.createNotifications({
  to: "customer@example.com",
  channel: "email",
  template: "order-confirmation",
  data: {
    order_id: order.id,
    order_number: order.display_id,
    items: order.items
  }
})
```

### Notification Templates

```typescript
// Create notification template
await notificationService.createNotificationTemplates({
  id: "order-confirmation",
  channel: "email",
  template: {
    subject: "Order Confirmation #{{order_number}}",
    html: "<h1>Thank you for your order!</h1><p>Order #{{order_number}}</p>",
    text: "Thank you for your order! Order #{{order_number}}"
  }
})
```

### Custom Notification Provider

```typescript
// src/modules/my-notification/service.ts
import { AbstractNotificationProviderService } from "@medusajs/framework/utils"

class MyNotificationProvider extends AbstractNotificationProviderService {
  static identifier = "my-notification"

  async send(notification) {
    const { to, channel, template, data } = notification

    // Send via your service (Twilio, Mailgun, etc.)
    await myEmailService.send({
      to,
      subject: this.renderTemplate(template.subject, data),
      body: this.renderTemplate(template.html, data)
    })

    return { id: "external-id" }
  }
}

export default MyNotificationProvider
```

---

## Worker Mode

### Configuration

```typescript
// medusa-config.ts
export default defineConfig({
  projectConfig: {
    // "shared" - Both server and worker in same process (development)
    // "server" - API server only
    // "worker" - Background worker only
    workerMode: process.env.WORKER_MODE as "shared" | "worker" | "server"
  }
})
```

### Production Deployment

```bash
# API Server
WORKER_MODE=server node .medusa/server/index.js

# Background Worker
WORKER_MODE=worker node .medusa/server/index.js
```

---

## Environment Variables

### Required Variables

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/medusa

# Security (generate strong secrets!)
JWT_SECRET=your-jwt-secret-min-32-chars
COOKIE_SECRET=your-cookie-secret-min-32-chars

# CORS (comma-separated for multiple origins)
STORE_CORS=https://storefront.example.com
ADMIN_CORS=https://admin.example.com
AUTH_CORS=https://storefront.example.com,https://admin.example.com

# Redis (production)
REDIS_URL=redis://user:pass@host:6379
```

### Optional Variables

```bash
# Admin
MEDUSA_BACKEND_URL=https://api.example.com
DISABLE_ADMIN=false

# S3
S3_FILE_URL=https://bucket.s3.region.amazonaws.com
S3_ACCESS_KEY_ID=your-access-key
S3_SECRET_ACCESS_KEY=your-secret-key
S3_REGION=us-east-1
S3_BUCKET=your-bucket
S3_PREFIX=uploads

# SendGrid
SENDGRID_API_KEY=SG.xxx
SENDGRID_FROM=noreply@example.com

# Stripe
STRIPE_API_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Worker
WORKER_MODE=shared
```

---

## Production Checklist

### Security

- [ ] Generate strong JWT_SECRET (32+ characters)
- [ ] Generate strong COOKIE_SECRET (32+ characters)
- [ ] Configure CORS for your domains only
- [ ] Enable SSL/TLS on database connection
- [ ] Use environment variables for all secrets
- [ ] Set up Stripe webhook signature verification

### Performance

- [ ] Configure Redis for cache, events, workflows, locking
- [ ] Enable database connection pooling
- [ ] Set up CDN for static assets
- [ ] Configure S3 for file storage
- [ ] Separate server and worker processes

### Reliability

- [ ] Set up database backups
- [ ] Configure Redis persistence
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Configure logging aggregation
- [ ] Set up health checks

### Deployment

```bash
# Build
npx medusa build

# Run migrations
npx medusa db:migrate

# Start production server
NODE_ENV=production WORKER_MODE=server node .medusa/server/index.js

# Start worker (separate process)
NODE_ENV=production WORKER_MODE=worker node .medusa/server/index.js
```

---

## Docker Setup

### Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npx medusa build

EXPOSE 9000

CMD ["node", ".medusa/server/index.js"]
```

### Docker Compose

```yaml
version: "3.8"

services:
  medusa:
    build: .
    ports:
      - "9000:9000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/medusa
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
      - COOKIE_SECRET=${COOKIE_SECRET}
      - WORKER_MODE=shared
    depends_on:
      - db
      - redis

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=medusa
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

---

## Health Checks

### API Health Endpoint

```typescript
// src/api/health/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve("query")

  try {
    // Check database connection
    await query.graph({ entity: "region", fields: ["id"], pagination: { take: 1 } })

    res.json({
      status: "healthy",
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      error: error.message
    })
  }
}
```

### Kubernetes Probes

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 9000
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /health
    port: 9000
  initialDelaySeconds: 5
  periodSeconds: 5
```
