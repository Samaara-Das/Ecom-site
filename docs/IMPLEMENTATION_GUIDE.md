# Kuwait Marketplace Implementation Guide

This guide provides comprehensive instructions for developers working on the Kuwait Marketplace e-commerce platform. It covers project structure, development workflow, code patterns, testing strategies, and troubleshooting.

## Table of Contents

1. [Project Structure](#1-project-structure)
2. [Development Workflow](#2-development-workflow)
3. [Code Patterns & Conventions](#3-code-patterns--conventions)
4. [Testing Strategy](#4-testing-strategy)
5. [Common Tasks](#5-common-tasks)
6. [Troubleshooting](#6-troubleshooting)

---

## 1. Project Structure

### Root Directory Layout

```
kuwait-marketplace/
├── backend/                 # Medusa v2 backend (API + Admin)
├── storefront/              # Next.js 15 storefront
├── docker/                  # Docker configuration files
├── docs/                    # Project documentation
├── scripts/                 # Utility scripts
├── .claude/                 # Claude Code context files
├── .taskmaster/             # Task Master AI configuration
├── docker-compose.yml       # Production Docker config
├── docker-compose.dev.yml   # Development Docker config
├── CLAUDE.md                # AI assistant instructions
└── tasks.yaml               # Post-MVP task definitions
```

### Backend Directory Layout (`backend/`)

```
backend/
├── src/
│   ├── api/                 # API routes (REST endpoints)
│   │   ├── admin/           # Admin-only routes
│   │   │   └── vendors/     # Vendor management endpoints
│   │   ├── store/           # Store/customer-facing routes
│   │   │   ├── auth/        # Authentication (OTP, etc.)
│   │   │   ├── carts/       # Cart operations
│   │   │   ├── customers/   # Customer management
│   │   │   ├── products/    # Product queries
│   │   │   └── vendors/     # Vendor storefront APIs
│   │   ├── health/          # Health check endpoint
│   │   └── middlewares.ts   # Route middleware config
│   │
│   ├── modules/             # Custom Medusa modules
│   │   ├── vendor/          # Multi-vendor marketplace module
│   │   │   ├── models/      # Data models (vendor.ts)
│   │   │   ├── migrations/  # Database migrations
│   │   │   ├── service.ts   # Module service class
│   │   │   └── index.ts     # Module registration
│   │   └── paypal/          # PayPal payment provider
│   │
│   ├── services/            # Shared services
│   │   └── otp.ts           # OTP authentication service
│   │
│   ├── scripts/             # Executable scripts
│   │   ├── seed-products.ts # Product seeding
│   │   ├── seed-inventory.ts# Inventory seeding
│   │   └── seed-shipping-options.ts
│   │
│   ├── admin/               # Admin panel customizations
│   ├── subscribers/         # Event subscribers
│   ├── workflows/           # Medusa workflows
│   ├── links/               # Module link definitions
│   └── e2e/                 # Backend E2E tests
│
├── medusa-config.ts         # Medusa configuration
├── package.json             # Dependencies & scripts
├── vitest.config.ts         # Vitest test configuration
└── tsconfig.json            # TypeScript configuration
```

### Storefront Directory Layout (`storefront/`)

```
storefront/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── [countryCode]/   # Locale-prefixed routes
│   │   │   ├── (main)/      # Main layout group
│   │   │   │   ├── page.tsx           # Homepage
│   │   │   │   ├── store/             # Product listing
│   │   │   │   ├── products/[handle]/ # Product detail
│   │   │   │   ├── cart/              # Shopping cart
│   │   │   │   ├── account/           # Customer account
│   │   │   │   │   ├── @dashboard/    # Authenticated views
│   │   │   │   │   └── @login/        # Login view
│   │   │   │   ├── vendor/            # Vendor portal
│   │   │   │   └── become-a-seller/   # Vendor registration
│   │   │   └── (checkout)/  # Checkout layout group
│   │   │       └── checkout/
│   │   ├── layout.tsx       # Root layout
│   │   └── not-found.tsx    # 404 page
│   │
│   ├── modules/             # Feature modules
│   │   ├── account/         # Account components
│   │   ├── cart/            # Cart components
│   │   ├── checkout/        # Checkout components
│   │   ├── common/          # Shared components
│   │   ├── home/            # Homepage components
│   │   ├── layout/          # Layout components
│   │   ├── products/        # Product components
│   │   └── vendor/          # Vendor portal components
│   │
│   ├── lib/                 # Utilities & data fetching
│   │   ├── data/            # Server-side data functions
│   │   └── util/            # Helper utilities
│   │
│   ├── i18n/                # Internationalization
│   │   ├── en.json          # English translations
│   │   └── ar.json          # Arabic translations
│   │
│   ├── styles/              # Global styles
│   ├── types/               # TypeScript type definitions
│   ├── middleware.ts        # Next.js middleware
│   └── test/                # Test setup files
│
├── e2e/                     # Playwright E2E tests
├── public/                  # Static assets
├── playwright.config.ts     # Playwright configuration
├── vitest.config.ts         # Vitest configuration
└── package.json             # Dependencies & scripts
```

### Key Configuration Files

| File | Purpose |
|------|---------|
| `backend/medusa-config.ts` | Medusa server config (database, CORS, modules) |
| `backend/.env` | Backend environment variables |
| `storefront/.env.local` | Storefront environment variables |
| `docker-compose.yml` | Docker services (PostgreSQL, Redis) |
| `backend/vitest.config.ts` | Backend unit test configuration |
| `storefront/playwright.config.ts` | E2E test configuration |

---

## 2. Development Workflow

### Prerequisites

- **Node.js** >= 20
- **Docker Desktop** (for PostgreSQL and Redis)
- **npm** or **yarn**

### Starting Services

#### 1. Start Docker Services (Database & Cache)

```bash
# From project root
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d db redis

# Verify services are running
docker ps
# Should show: postgres (5432), redis (6379)
```

#### 2. Start Backend (Medusa Server)

```bash
cd backend

# Install dependencies (first time only)
npm install

# Run database migrations (first time or after schema changes)
npm run db:migrate

# Start development server
npm run dev
# Server runs at http://localhost:9000
# Admin panel at http://localhost:9000/app
```

#### 3. Start Storefront (Next.js)

```bash
cd storefront

# Install dependencies (first time only)
npm install

# Start development server with Turbopack
npm run dev
# Storefront runs at http://localhost:8000
```

### Environment Configuration

#### Backend (`backend/.env`)

```bash
# Database
DATABASE_URL=postgres://postgres:postgres@localhost:5432/medusa-marketplace

# Redis (optional for development)
REDIS_URL=redis://localhost:6379

# CORS (important for local development)
STORE_CORS=http://localhost:8000
ADMIN_CORS=http://localhost:9000
AUTH_CORS=http://localhost:8000,http://localhost:9000

# Security (change in production)
JWT_SECRET=your-jwt-secret-here
COOKIE_SECRET=your-cookie-secret-here

# Payment Providers (optional)
STRIPE_API_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
PAYPAL_ENVIRONMENT=sandbox
```

#### Storefront (`storefront/.env.local`)

```bash
# Backend URL
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
MEDUSA_BACKEND_URL=http://localhost:9000

# Publishable API Key (get from admin panel)
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:8000
```

### Hot Reload Configuration

Both backend and storefront support hot reload:

- **Backend**: Changes to `src/` files trigger automatic restart
- **Storefront**: Next.js Turbopack provides instant refresh

To ensure hot reload works:

```bash
# Backend - use the dev script
npm run dev  # NOT npm start

# Storefront - Turbopack is enabled by default
npm run dev
```

---

## 3. Code Patterns & Conventions

### Medusa Module Pattern

Medusa v2 uses a modular architecture. Custom modules follow this pattern:

```
Module Structure:
models/    → Data model definitions
service.ts → Business logic service
index.ts   → Module registration
migrations/→ Database migrations
```

#### Step 1: Define the Model (`models/vendor.ts`)

```typescript
import { model } from "@medusajs/framework/utils"

export const Vendor = model.define("vendor", {
  id: model.id().primaryKey(),
  name: model.text(),
  email: model.text(),
  status: model.enum(["pending", "verified", "suspended"]).default("pending"),
  commission_rate: model.float().default(0.15),
  // Add nullable fields with .nullable()
  description: model.text().nullable(),
}).checks([
  // Optional: Add database constraints
  {
    name: "email_format_check",
    expression: (columns) => `${columns.email} LIKE '%@%'`,
  },
])
```

#### Step 2: Create the Service (`service.ts`)

```typescript
import { MedusaService } from "@medusajs/framework/utils"
import { Vendor } from "./models/vendor"

/**
 * MedusaService auto-generates CRUD methods:
 * - listVendors(filters, config)
 * - listAndCountVendors(filters, config)
 * - retrieveVendor(id, config)
 * - createVendors(data[])
 * - updateVendors(selector, data)
 * - deleteVendors(ids[])
 */
class VendorModuleService extends MedusaService({
  Vendor,
}) {
  // Add custom methods
  async listActiveVendors() {
    return this.listVendors({
      status: ["verified", "premium"],
    })
  }

  async findVendorByEmail(email: string) {
    const vendors = await this.listVendors({ email })
    return vendors[0] || null
  }
}

export default VendorModuleService
```

#### Step 3: Register the Module (`index.ts`)

```typescript
import { Module } from "@medusajs/framework/utils"
import VendorModuleService from "./service"

export const VENDOR_MODULE = "vendor"

export default Module(VENDOR_MODULE, {
  service: VendorModuleService,
})
```

#### Step 4: Add to Medusa Config (`medusa-config.ts`)

```typescript
export default defineConfig({
  modules: [
    {
      resolve: "./src/modules/vendor",
    },
  ],
})
```

#### Step 5: Generate Migration

```bash
npm run db:generate vendor
npm run db:migrate
```

### API Route Structure

API routes follow a file-system based routing pattern:

```
src/api/store/vendors/apply/route.ts → POST /store/vendors/apply
src/api/admin/vendors/[id]/route.ts  → GET/PATCH/DELETE /admin/vendors/:id
```

#### Route Handler Pattern

```typescript
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import type { Logger } from "@medusajs/framework/types"
import { VENDOR_MODULE } from "../../../../modules/vendor"
import type VendorModuleService from "../../../../modules/vendor/service"

// Define request body type for typed requests
interface VendorApplicationBody {
  name: string
  email: string
  phone?: string
}

/**
 * POST /store/vendors/apply
 * Submit a vendor application
 */
export async function POST(
  req: MedusaRequest<VendorApplicationBody>,
  res: MedusaResponse
) {
  const logger = req.scope.resolve<Logger>("logger")

  try {
    // Resolve service from dependency container
    const vendorService = req.scope.resolve<VendorModuleService>(VENDOR_MODULE)

    // Destructure and validate request body
    const { name, email, phone } = req.body

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      })
    }

    // Business logic
    const existingVendor = await vendorService.findVendorByEmail(email)
    if (existingVendor) {
      return res.status(409).json({
        message: "A vendor with this email already exists",
      })
    }

    const [vendor] = await vendorService.createVendors([
      { name, email, phone: phone || null, status: "pending" },
    ])

    logger.info(`New vendor application: ${vendor.id}`)

    return res.status(201).json({
      message: "Application submitted",
      vendor: { id: vendor.id, name: vendor.name, status: vendor.status },
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`Vendor application failed: ${errorMessage}`)
    return res.status(500).json({
      message: "Failed to submit application",
      error: errorMessage,
    })
  }
}
```

### Error Handling Patterns

#### Medusa Logger Pattern

Always use type-safe error logging:

```typescript
// CORRECT: Type-safe error handling
catch (error: unknown) {
  const errorMessage = error instanceof Error ? error.message : String(error)
  logger.error(`Operation failed: ${errorMessage}`)

  // For logging the full error object (development only)
  logger.error("Operation failed", error instanceof Error ? error : undefined)
}

// INCORRECT: Unsafe error access
catch (error) {
  logger.error(`Failed: ${error.message}`)  // TS error - error is unknown
}
```

#### HTTP Error Responses

Use consistent error response format:

```typescript
// Validation errors
return res.status(400).json({
  message: "Validation failed",
  errors: ["Name is required", "Email format invalid"]
})

// Not found
return res.status(404).json({
  message: "Vendor not found"
})

// Conflict (duplicate)
return res.status(409).json({
  message: "A vendor with this email already exists"
})

// Server error
return res.status(500).json({
  message: "An unexpected error occurred",
  error: process.env.NODE_ENV === "development" ? errorMessage : undefined
})
```

### TypeScript Conventions

#### Working with Medusa Types

Some Medusa v2 types are incomplete. Use these workarounds:

```typescript
// When accessing properties not in TypeScript types but available at runtime
const order = await orderService.retrieveOrder(orderId)
const status = (order as any).fulfillment_status  // Cast to any

// When service overloads cause issues
const productService = req.scope.resolve("productService")
const product = await (productService as any).createProducts(productData)

// Handling updateVendors return type (can be array or single object)
const result = await vendorService.updateVendors({ id }, updateData)
const vendor = Array.isArray(result) ? result[0] : result
```

#### Import Order Convention

```typescript
// 1. External dependencies
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import type { Logger } from "@medusajs/framework/types"

// 2. Internal absolute imports (modules, services)
import { VENDOR_MODULE } from "../../../../modules/vendor"
import type VendorModuleService from "../../../../modules/vendor/service"

// 3. Relative imports
import { validateEmail } from "./utils"
```

### Storefront Patterns

#### Custom Input Component

Use the project's custom Input component for forms:

```tsx
// CORRECT: Use custom Input with label prop
import Input from "@modules/common/components/input"

<Input
  label="Email Address"
  name="email"
  type="email"
  required
  autoComplete="email"
/>

// INCORRECT: Don't use @medusajs/ui Input directly for forms
import { Input } from "@medusajs/ui"  // Missing label support
```

#### Data Fetching Pattern

Server components fetch data directly:

```tsx
// app/[countryCode]/(main)/products/[handle]/page.tsx
import { getProductByHandle } from "@lib/data/products"

export default async function ProductPage({
  params,
}: {
  params: { handle: string; countryCode: string }
}) {
  const product = await getProductByHandle(params.handle)

  if (!product) {
    notFound()
  }

  return <ProductTemplate product={product} />
}
```

---

## 4. Testing Strategy

### Backend Unit Tests with Vitest

#### Configuration (`backend/vitest.config.ts`)

```typescript
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: [
      "src/**/*.test.ts",
      "src/**/__tests__/*.test.ts",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
    testTimeout: 30000,
  },
})
```

#### Test File Structure

```typescript
// src/services/__tests__/otp.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { OTPService } from "../otp"

describe("OTPService", () => {
  let service: OTPService
  let mockStore: MockStore

  beforeEach(() => {
    // Setup mocks
    mockStore = {
      set: vi.fn().mockResolvedValue(undefined),
      get: vi.fn().mockResolvedValue(null),
    }
    service = new OTPService({ store: mockStore })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe("generateOTP", () => {
    it("should generate 6-digit OTP", () => {
      const otp = service.generateOTP()
      expect(otp).toMatch(/^\d{6}$/)
    })
  })

  describe("sendOTP", () => {
    it("should store and send OTP successfully", async () => {
      const result = await service.sendOTP("+96512345678")
      expect(result.success).toBe(true)
      expect(mockStore.set).toHaveBeenCalled()
    })

    it("should reject invalid phone numbers", async () => {
      const result = await service.sendOTP("123")
      expect(result.success).toBe(false)
      expect(result.error).toBe("Invalid phone number format")
    })
  })
})
```

#### Running Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run with watch mode
npm run test:watch

# Run specific test file
npx vitest run src/services/__tests__/otp.test.ts

# Run with coverage
npx vitest run --coverage
```

### E2E Tests with Playwright

#### Configuration (`storefront/playwright.config.ts`)

```typescript
import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:8000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  // Auto-start server only in CI
  ...(process.env.CI
    ? {
        webServer: {
          command: "npm run dev",
          url: "http://localhost:8000",
          reuseExistingServer: false,
        },
      }
    : {}),
})
```

#### E2E Test Example

```typescript
// storefront/e2e/homepage.spec.ts
import { test, expect } from "@playwright/test"

test.describe("Homepage", () => {
  test("should load the homepage", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveTitle(/Medusa|Kuwait|Store/i)
  })

  test("should display products on store page", async ({ page }) => {
    await page.goto("/kw/store")

    // Wait for products to load
    const productLinks = page.locator('a[href*="/products/"]')
    const hasProducts = await productLinks.first().isVisible({ timeout: 10000 }).catch(() => false)

    if (!hasProducts) {
      // Verify page loaded by checking for navigation
      const nav = page.locator("nav, header")
      await expect(nav.first()).toBeVisible()
    }
  })

  test("should navigate to product page", async ({ page }) => {
    await page.goto("/kw")

    const productLink = page.locator('a[href*="/products/"]').first()
    if (await productLink.isVisible()) {
      await productLink.click()
      await expect(page).toHaveURL(/\/products\//)
    }
  })
})
```

#### Running E2E Tests

```bash
cd storefront

# Ensure services are running first!
# Backend: http://localhost:9000
# Storefront: http://localhost:8000

# Run all E2E tests
npm run test:e2e

# Run with Playwright UI
npm run test:e2e:ui

# Run specific test file
npx playwright test e2e/homepage.spec.ts

# Run in headed mode (see browser)
npx playwright test --headed
```

### Test Commands Summary

| Command | Location | Description |
|---------|----------|-------------|
| `npm test` | backend/ | Run all Vitest unit tests |
| `npm run test:watch` | backend/ | Run tests in watch mode |
| `npx tsc --noEmit` | backend/ | TypeScript type checking |
| `npm run lint` | backend/ | ESLint code linting |
| `npm run test:e2e` | storefront/ | Run Playwright E2E tests |
| `npm run test:e2e:ui` | storefront/ | Run E2E with Playwright UI |

---

## 5. Common Tasks

### Adding a New API Endpoint

#### Example: Create a wishlist endpoint

**Step 1: Create route file**

```bash
mkdir -p backend/src/api/store/wishlist
touch backend/src/api/store/wishlist/route.ts
```

**Step 2: Implement the handler**

```typescript
// backend/src/api/store/wishlist/route.ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

interface AddToWishlistBody {
  product_id: string
}

export async function POST(
  req: MedusaRequest<AddToWishlistBody>,
  res: MedusaResponse
) {
  try {
    const { product_id } = req.body
    const customer_id = req.auth_context?.actor_id

    if (!customer_id) {
      return res.status(401).json({ message: "Authentication required" })
    }

    if (!product_id) {
      return res.status(400).json({ message: "Product ID required" })
    }

    // Implement wishlist logic here...

    return res.status(201).json({
      message: "Added to wishlist",
      product_id,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return res.status(500).json({ message, error: message })
  }
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const customer_id = req.auth_context?.actor_id

  if (!customer_id) {
    return res.status(401).json({ message: "Authentication required" })
  }

  // Retrieve wishlist...

  return res.json({ wishlist: [] })
}
```

**Step 3: Add authentication middleware (if needed)**

```typescript
// backend/src/api/middlewares.ts
export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/wishlist",
      middlewares: [authenticate("customer", ["bearer", "session"])]
    },
    // ... existing routes
  ]
})
```

**Step 4: Test the endpoint**

```bash
# Test POST
curl -X POST http://localhost:9000/store/wishlist \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"product_id": "prod_123"}'

# Test GET
curl http://localhost:9000/store/wishlist \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Creating a New Medusa Module

#### Example: Reviews module

**Step 1: Create module structure**

```bash
mkdir -p backend/src/modules/reviews/models
touch backend/src/modules/reviews/models/review.ts
touch backend/src/modules/reviews/service.ts
touch backend/src/modules/reviews/index.ts
```

**Step 2: Define the model**

```typescript
// backend/src/modules/reviews/models/review.ts
import { model } from "@medusajs/framework/utils"

export const Review = model.define("review", {
  id: model.id().primaryKey(),
  product_id: model.text(),
  customer_id: model.text(),
  rating: model.number(),  // 1-5
  title: model.text().nullable(),
  content: model.text(),
  is_verified_purchase: model.boolean().default(false),
  created_at: model.dateTime(),
})
```

**Step 3: Create the service**

```typescript
// backend/src/modules/reviews/service.ts
import { MedusaService } from "@medusajs/framework/utils"
import { Review } from "./models/review"

class ReviewModuleService extends MedusaService({
  Review,
}) {
  async getProductReviews(productId: string) {
    return this.listReviews({ product_id: productId })
  }

  async getAverageRating(productId: string): Promise<number> {
    const reviews = await this.getProductReviews(productId)
    if (reviews.length === 0) return 0

    const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
    return sum / reviews.length
  }
}

export default ReviewModuleService
```

**Step 4: Register the module**

```typescript
// backend/src/modules/reviews/index.ts
import { Module } from "@medusajs/framework/utils"
import ReviewModuleService from "./service"

export const REVIEW_MODULE = "review"

export default Module(REVIEW_MODULE, {
  service: ReviewModuleService,
})
```

**Step 5: Add to medusa-config.ts**

```typescript
modules: [
  { resolve: "./src/modules/vendor" },
  { resolve: "./src/modules/reviews" },  // Add new module
]
```

**Step 6: Generate and run migration**

```bash
npm run db:generate reviews
npm run db:migrate
```

### Adding a New Storefront Page

#### Example: Create a FAQ page

**Step 1: Create the page file**

```bash
mkdir -p storefront/src/app/[countryCode]/(main)/faq
touch storefront/src/app/[countryCode]/(main)/faq/page.tsx
```

**Step 2: Implement the page**

```tsx
// storefront/src/app/[countryCode]/(main)/faq/page.tsx
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "FAQ | Kuwait Marketplace",
  description: "Frequently asked questions about Kuwait Marketplace",
}

const faqs = [
  {
    question: "How do I become a vendor?",
    answer: "Visit our 'Become a Seller' page and submit an application.",
  },
  {
    question: "What payment methods are accepted?",
    answer: "We accept credit cards, debit cards, and PayPal.",
  },
]

export default function FAQPage() {
  return (
    <div className="content-container py-12">
      <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>

      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b pb-4">
            <h3 className="text-lg font-medium mb-2">{faq.question}</h3>
            <p className="text-gray-600">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

**Step 3: Add navigation link (optional)**

Update the footer or navigation component to include the FAQ link.

---

## 6. Troubleshooting

### Common Errors and Solutions

#### "Cannot find module '@medusajs/admin-sdk'"

**Cause**: Missing peer dependency for admin panel.

**Solution**:
```bash
cd backend
npm install @medusajs/admin-sdk
```

#### "Publishable API key required"

**Cause**: Storefront trying to access store API without API key.

**Solution**:
1. Log into admin panel (`http://localhost:9000/app`)
2. Go to Settings > Publishable API Keys
3. Create a new key or copy existing
4. Add to `storefront/.env.local`:
   ```
   NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...
   ```
5. Restart storefront

#### TypeScript: "Property does not exist on type 'OrderDTO'"

**Cause**: Medusa v2 types are incomplete for some properties.

**Solution**: Cast to `any` when accessing runtime-available but untyped properties:
```typescript
const status = (order as any).fulfillment_status
```

#### "@typescript-eslint version incompatibility"

**Cause**: TypeScript version not supported by older @typescript-eslint.

**Solution**:
```bash
# Upgrade to v8.x which supports TypeScript 5.x
npm install @typescript-eslint/eslint-plugin@^8.0.0 @typescript-eslint/parser@^8.0.0
```

#### "Port 9000 is already in use"

**Cause**: Another process using the port.

**Solution**:
```bash
# Find the process
netstat -ano | findstr :9000  # Windows
lsof -i :9000                 # macOS/Linux

# Kill the process
taskkill /PID <PID> /F        # Windows
kill -9 <PID>                 # macOS/Linux
```

#### Storefront shows stale data

**Cause**: Next.js caching (`force-cache`).

**Solution**:
```bash
# Clear Next.js cache
cd storefront
rm -rf .next

# Restart dev server
npm run dev
```

### Debug Techniques

#### Backend Logging

```typescript
const logger = req.scope.resolve<Logger>("logger")

// Different log levels
logger.debug("Detailed debugging info")
logger.info("General info message")
logger.warn("Warning message")
logger.error("Error message", error instanceof Error ? error : undefined)
```

#### Checking API Responses

```bash
# Test health endpoint
curl http://localhost:9000/health

# Test with headers
curl -v http://localhost:9000/store/products \
  -H "x-publishable-api-key: pk_..." \
  -H "Content-Type: application/json"
```

#### Database Inspection

```bash
# Connect to PostgreSQL
docker exec -it <postgres_container_id> psql -U postgres -d medusa-marketplace

# Common queries
\dt                          # List tables
SELECT * FROM vendor LIMIT 5;
SELECT * FROM product LIMIT 5;
```

#### Playwright Debugging

```bash
# Run with headed browser
npx playwright test --headed

# Run with debug mode
npx playwright test --debug

# Generate test with codegen
npx playwright codegen http://localhost:8000
```

### Performance Issues

#### Backend Slow Startup

- Ensure Docker services are running before starting backend
- Check database connection with `npm run db:migrate`
- Clear `.medusa` folder: `rm -rf .medusa`

#### Storefront Slow Build

```bash
# Analyze bundle size
npm run analyze

# Clear caches
rm -rf .next node_modules/.cache
```

---

## Quick Reference

### Useful Scripts

```bash
# Backend
npm run dev                    # Start dev server
npm run build                  # Build for production
npm run db:migrate             # Run migrations
npm run seed:products          # Seed product data
npm run seed:inventory         # Seed inventory data
npm test                       # Run unit tests
npm run lint                   # Lint code
npm run typecheck              # TypeScript check

# Storefront
npm run dev                    # Start dev server (port 8000)
npm run build                  # Build for production
npm run test:e2e               # Run E2E tests
npm run test:e2e:ui            # Run E2E with UI
```

### Key URLs (Development)

| Service | URL |
|---------|-----|
| Storefront | http://localhost:8000 |
| Backend API | http://localhost:9000 |
| Admin Panel | http://localhost:9000/app |
| Health Check | http://localhost:9000/health |

### File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| API Routes | `route.ts` | `api/store/vendors/route.ts` |
| Tests | `*.test.ts` | `otp.test.ts` |
| E2E Tests | `*.spec.ts` | `homepage.spec.ts` |
| Models | `lowercase.ts` | `vendor.ts` |
| Services | `service.ts` | `service.ts` |
| Components | `PascalCase.tsx` | `ProductCard.tsx` |

---

## 7. Semantic Search Pattern

Added 2026-02-22.

### Overview

The search system uses a two-pass approach: an exact Medusa `q=` query first, then a client-side synonym-expansion fallback. This ensures fast results for direct matches and good coverage for generic terms ("makeup", "phone").

### Files

| File | Purpose |
|------|---------|
| `storefront/src/lib/search-synonyms.ts` | Synonym map + `expandQuery()` + `scoreMatch()` |
| `storefront/src/app/[countryCode]/(main)/search/page.tsx` | Server component — fetches all products, applies expansion |
| `storefront/src/components/search/SearchAutocomplete.tsx` | Client component — two-pass autocomplete |

### `expandQuery(query: string): string[]`

Tokenizes the query on whitespace, then expands each token via `SEARCH_SYNONYMS`. Returns a deduplicated array of the original query plus all synonym terms.

```typescript
expandQuery("phone case")
// → ["phone case", "phone", "smartphone", "mobile", "iphone", ..., "case"]
```

Key design: multi-word queries now expand via per-token lookup. Only exact single-token keys are in `SEARCH_SYNONYMS`; the caller always receives the original query string as the first element so direct matches still rank highest.

### `scoreMatch(product, terms): number`

Scores a product against expanded terms: +3 title match, +2 category/vendor match, +1 description match. Used in `search/page.tsx` to sort results by relevance.

### Two-Pass Fetch (SearchAutocomplete)

1. Fetch `GET /store/products?q={rawQuery}&limit=8` — fast Medusa title search.
2. If 0 results: fetch `GET /store/products?limit=200`, then filter client-side with `expandQuery(rawQuery)`.

### Extending the Synonym Map

Add entries to `SEARCH_SYNONYMS` in `search-synonyms.ts`. Keys should be common user-facing search terms (typically a single word); values are arrays of related technical or brand terms that appear in product titles, categories, or descriptions.

---

*Last updated: January 2026*
