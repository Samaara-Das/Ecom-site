# Kuwait Marketplace - Technical Specification

**Version**: 1.0
**Date**: 2026-01-30
**Status**: MVP Complete

---

## 1. Architecture Overview

### System Architecture

```
                                    +------------------+
                                    |   CDN / Edge     |
                                    |   (Cloudflare)   |
                                    +--------+---------+
                                             |
                    +------------------------+------------------------+
                    |                                                 |
           +--------v--------+                               +--------v--------+
           |   Storefront    |                               |  Admin Panel    |
           |   Next.js 15    |                               |  Medusa Admin   |
           |   Port 8000     |                               |  Port 9000/app  |
           +--------+--------+                               +--------+--------+
                    |                                                 |
                    +------------------------+------------------------+
                                             |
                                    +--------v--------+
                                    |  Medusa Backend |
                                    |     Port 9000   |
                                    +--------+--------+
                                             |
                    +------------------------+------------------------+
                    |                        |                        |
           +--------v--------+     +--------v--------+     +----------v---------+
           |   PostgreSQL    |     |     Redis       |     | External Services  |
           |   Port 5432     |     |   Port 6379     |     | (Stripe, PayPal,   |
           |   (Primary DB)  |     |   (Cache/Queue) |     |  Twilio)           |
           +-----------------+     +-----------------+     +--------------------+
```

### Technology Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **Backend** | Medusa v2 | 2.0.0 | Headless commerce engine |
| **Frontend** | Next.js | 15.3.9 | React SSR/SSG framework |
| **Database** | PostgreSQL | 14+ | Primary data store |
| **Cache** | Redis | 7+ | Sessions, caching, jobs |
| **Language** | TypeScript | 5.9.3 | Type-safe development |
| **Testing** | Vitest + Playwright | 2.1.9 | Unit and E2E tests |

---

## 2. Backend Architecture

### 2.1 Project Structure

```
backend/
├── medusa-config.ts          # Medusa configuration
├── package.json              # Dependencies
├── src/
│   ├── api/                  # Custom API routes
│   │   ├── admin/            # Admin-only endpoints
│   │   │   └── vendors/      # Vendor management
│   │   ├── store/            # Storefront endpoints
│   │   │   ├── auth/otp/     # OTP authentication
│   │   │   ├── carts/        # Cart extensions
│   │   │   ├── customers/    # Customer routes
│   │   │   └── vendors/      # Vendor portal
│   │   └── middlewares.ts    # Custom middleware
│   ├── modules/              # Custom Medusa modules
│   │   ├── vendor/           # Vendor module
│   │   └── paypal/           # PayPal provider
│   ├── services/             # Business logic
│   │   └── otp/              # OTP service
│   └── scripts/              # CLI scripts
│       ├── seed-products.ts  # Product seeding
│       └── seed-inventory.ts # Inventory seeding
└── .env                      # Environment variables
```

### 2.2 Custom Modules

#### Vendor Module

**Purpose**: Multi-vendor marketplace support

**Model**: `Vendor`
```typescript
{
  id: string (PK)
  name: string
  description: string | null
  email: string (validated)
  phone: string | null
  logo_url: string | null
  status: "pending" | "verified" | "premium" | "suspended"
  commission_rate: number (default: 0.15)
  business_registration: string | null
  bank_account: string | null
  address_line_1: string | null
  address_line_2: string | null
  city: string | null
  postal_code: string | null
  country_code: string (default: "kw")
}
```

**Service Methods**:
- `listVendors(filters, config)` - List with filters
- `retrieveVendor(id, config)` - Get by ID
- `createVendors(data)` - Create vendor
- `updateVendors(selector, data)` - Update vendors
- `deleteVendors(ids)` - Delete vendors
- `listVendorsByStatus(status)` - Filter by status
- `listActiveVendors()` - Verified/premium only
- `updateVendorStatus(id, status)` - Admin workflow
- `findVendorByEmail(email)` - Duplicate check

#### PayPal Module

**Purpose**: PayPal payment provider integration

**Configuration**:
```typescript
{
  client_id: string
  client_secret: string
  environment: "sandbox" | "production"
  autoCapture: boolean
  webhook_id: string
}
```

### 2.3 API Endpoints

#### Store API (Public/Customer)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/store/products` | GET | List products |
| `/store/products/:id` | GET | Product detail |
| `/store/carts` | POST | Create cart |
| `/store/carts/:id` | GET | Get cart |
| `/store/carts/:id/line-items` | POST | Add to cart |
| `/store/carts/:id/grouped` | GET | Cart grouped by vendor |
| `/store/auth/otp/send` | POST | Send OTP |
| `/store/auth/otp/verify` | POST | Verify OTP |
| `/store/customers` | POST | Register customer |
| `/store/customers/me` | GET/POST | Customer profile |
| `/store/vendors` | GET | List active vendors |
| `/store/vendors/:id` | GET | Vendor detail |
| `/store/vendors/apply` | POST | Vendor application |
| `/store/vendors/me` | GET/PUT | Vendor profile |
| `/store/vendors/me/products` | GET/POST | Vendor products |
| `/store/vendors/me/products/:id` | PUT/DELETE | Product management |
| `/store/vendors/me/orders` | GET | Vendor orders |
| `/store/vendors/me/orders/:id` | GET/PUT | Order management |
| `/store/vendors/me/stats` | GET | Vendor statistics |

#### Admin API (Authenticated)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/admin/vendors` | GET | List all vendors |
| `/admin/vendors/:id` | GET/PUT/DELETE | Vendor CRUD |
| `/admin/vendors/:id/approve` | POST | Approve vendor |
| `/admin/vendors/:id/reject` | POST | Reject vendor |

### 2.4 Authentication

**Methods Supported**:
1. Email/Password (Medusa built-in)
2. Phone OTP (Custom implementation)

**OTP Flow**:
```
1. POST /store/auth/otp/send { phone: "+96512345678" }
   -> OTP sent via Twilio

2. POST /store/auth/otp/verify { phone: "+96512345678", otp: "123456" }
   -> JWT token returned
```

**Rate Limiting**:
- OTP send: 3 requests per phone per 5 minutes
- OTP verify: 5 attempts per phone per 5 minutes

### 2.5 Configuration

**Environment Variables**:
```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/kuwait_marketplace

# Redis
REDIS_URL=redis://localhost:6379

# Security
JWT_SECRET=<secure-random-string>
COOKIE_SECRET=<secure-random-string>

# CORS
STORE_CORS=http://localhost:8000
ADMIN_CORS=http://localhost:9000

# Stripe
STRIPE_API_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# PayPal
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
PAYPAL_ENVIRONMENT=sandbox

# Twilio (OTP)
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...
```

---

## 3. Frontend Architecture

### 3.1 Project Structure

```
storefront/
├── next.config.mjs           # Next.js configuration
├── package.json              # Dependencies
├── tailwind.config.js        # Tailwind CSS
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── [countryCode]/    # Locale routing
│   │   │   ├── (main)/       # Main layout
│   │   │   │   ├── account/  # Account pages
│   │   │   │   ├── cart/     # Cart page
│   │   │   │   ├── checkout/ # Checkout flow
│   │   │   │   ├── products/ # Product pages
│   │   │   │   └── store/    # Store listing
│   │   │   └── layout.tsx
│   │   └── layout.tsx
│   ├── lib/
│   │   ├── data/             # Data fetching
│   │   ├── context/          # React context
│   │   └── util/             # Utilities
│   └── modules/              # Feature modules
│       ├── account/          # Account components
│       ├── cart/             # Cart components
│       ├── checkout/         # Checkout components
│       ├── common/           # Shared components
│       ├── layout/           # Layout components
│       └── products/         # Product components
├── e2e/                      # Playwright tests
└── public/                   # Static assets
```

### 3.2 Routing

**URL Structure**:
```
/{countryCode}/{path}

Examples:
- /kw/                    # Kuwait homepage
- /kw/store               # Product listing
- /kw/products/:handle    # Product detail
- /kw/cart                # Shopping cart
- /kw/checkout            # Checkout flow
- /kw/account             # Account dashboard
- /kw/account/orders      # Order history
- /kw/account/profile     # Profile management
```

**Supported Country Codes**:
- `kw` - Kuwait (primary)
- `us` - United States
- `eu` - Europe

### 3.3 State Management

**Cart State**: Server-side with cookie-based cart ID
**User State**: JWT token in httpOnly cookie
**UI State**: React useState/useContext

### 3.4 Internationalization

**Library**: next-intl v4.7

**Languages**:
- English (`en`) - LTR
- Arabic (`ar`) - RTL

**Implementation**:
```typescript
// Locale detection
const locale = headers().get('accept-language')?.includes('ar') ? 'ar' : 'en'

// RTL support
<html dir={locale === 'ar' ? 'rtl' : 'ltr'}>
```

### 3.5 Styling

**Framework**: Tailwind CSS v3
**Component Library**: Medusa UI
**RTL Support**: Tailwind RTL plugin

---

## 4. Database Schema

### 4.1 Core Tables (Medusa)

| Table | Purpose |
|-------|---------|
| `product` | Product catalog |
| `product_variant` | Product variants |
| `cart` | Shopping carts |
| `order` | Completed orders |
| `customer` | Customer accounts |
| `region` | Geographic regions |
| `currency` | Supported currencies |
| `payment` | Payment records |
| `fulfillment` | Shipping records |

### 4.2 Custom Tables

**`vendor`**:
```sql
CREATE TABLE vendor (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT,
    email VARCHAR NOT NULL,
    phone VARCHAR,
    logo_url VARCHAR,
    status VARCHAR DEFAULT 'pending',
    commission_rate DECIMAL DEFAULT 0.15,
    business_registration VARCHAR,
    bank_account VARCHAR,
    address_line_1 VARCHAR,
    address_line_2 VARCHAR,
    city VARCHAR,
    postal_code VARCHAR,
    country_code VARCHAR DEFAULT 'kw',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT email_format_check CHECK (email LIKE '%@%')
);
```

### 4.3 Data Relationships

```
vendor 1--* product (vendor_id)
product 1--* product_variant
cart 1--* line_item
line_item *--1 product_variant
order 1--* line_item
customer 1--* order
region 1--* country
payment_provider *--* region
```

---

## 5. Payment Integration

### 5.1 Stripe

**Status**: Configured (conditional on API key)

**Supported Features**:
- Card payments
- Webhook verification
- Refunds

**Configuration**:
```typescript
{
  resolve: "@medusajs/medusa/payment-stripe",
  id: "stripe",
  options: {
    apiKey: process.env.STRIPE_API_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },
}
```

### 5.2 PayPal

**Status**: Configured (conditional on credentials)

**Supported Features**:
- PayPal checkout
- Auto/manual capture
- Webhook support

**Configuration**:
```typescript
{
  resolve: "./src/modules/paypal",
  id: "paypal",
  options: {
    client_id: process.env.PAYPAL_CLIENT_ID,
    client_secret: process.env.PAYPAL_CLIENT_SECRET,
    environment: process.env.PAYPAL_ENVIRONMENT || "sandbox",
    autoCapture: process.env.PAYPAL_AUTO_CAPTURE === "true",
  },
}
```

### 5.3 Manual Payment

**Status**: Always available (Medusa default)

**Use Case**: Testing, cash on delivery simulation

---

## 6. Testing Strategy

### 6.1 Backend Tests

**Framework**: Vitest
**Coverage Target**: 80%

**Test Types**:
- Unit tests for services
- Integration tests for API routes
- Module tests for custom modules

**Commands**:
```bash
npm run test           # Run all tests
npm run test:watch     # Watch mode
npm run typecheck      # TypeScript check
npm run lint           # ESLint
```

**Results**: 218 tests passing

### 6.2 Frontend Tests

**Unit Tests**: Vitest + Testing Library
**E2E Tests**: Playwright

**Test Files**:
- `e2e/homepage.spec.ts` - Navigation, layout
- `e2e/cart.spec.ts` - Cart functionality
- `e2e/checkout.spec.ts` - Checkout flow
- `e2e/admin-panel.spec.ts` - Admin panel

**Commands**:
```bash
npm run test           # Unit tests
npm run test:e2e       # Playwright tests
npm run test:e2e:ui    # Playwright with UI
```

**Results**: 10/14 E2E tests passing

---

## 7. Deployment

### 7.1 Development Setup

**Prerequisites**:
- Node.js 20+
- PostgreSQL 14+
- Redis 7+
- Docker (optional)

**Quick Start**:
```bash
# Start infrastructure
docker-compose up -d db redis

# Backend
cd backend
npm install
npm run db:migrate
npm run dev

# Storefront (new terminal)
cd storefront
npm install
npm run dev
```

**Ports**:
- Backend: http://localhost:9000
- Admin Panel: http://localhost:9000/app
- Storefront: http://localhost:8000

### 7.2 Production Deployment

**Recommended Infrastructure**:
- Hosting: Railway, Render, or AWS ECS
- Database: Managed PostgreSQL (Supabase, Neon)
- Redis: Managed Redis (Upstash)
- CDN: Cloudflare
- Domain: Custom domain with SSL

**Environment**:
```env
NODE_ENV=production
DATABASE_URL=<managed-postgres-url>
REDIS_URL=<managed-redis-url>
MEDUSA_BACKEND_URL=https://api.yourdomain.com
```

---

## 8. Security Considerations

### 8.1 Authentication

- JWT tokens with secure secrets
- httpOnly cookies for token storage
- CORS configuration per environment
- Rate limiting on auth endpoints

### 8.2 Data Protection

- TLS 1.3 for all connections
- Database connection SSL in production
- Passwords hashed with bcrypt
- Sensitive data encrypted at rest

### 8.3 Input Validation

- Zod schemas for all API inputs
- SQL injection prevention (ORM)
- XSS prevention (React auto-escaping)
- CSRF protection (SameSite cookies)

### 8.4 Compliance

- PCI DSS via payment providers
- GDPR-ready data architecture
- Kuwait data protection compliance

---

## 9. Performance Optimization

### 9.1 Backend

- Database query optimization
- Redis caching for frequent queries
- Connection pooling
- Async operations

### 9.2 Frontend

- Next.js SSR/SSG
- Image optimization
- Code splitting
- Edge caching

### 9.3 Monitoring (Planned)

- APM: Sentry or Datadog
- Logging: Structured JSON logs
- Metrics: Custom dashboards
- Alerting: Error rate, latency

---

## 10. Known Limitations

### Current Issues

| Issue | Status | Workaround |
|-------|--------|------------|
| `/kw/account/profile` 404 | Identified | Use `/kw/account` |
| `/kw/account/addresses` 404 | Identified | Manual address entry |
| Products show out of stock | Caching | Seed inventory |
| Only Manual Payment in UI | Configuration | Add Stripe API key |

### Technical Debt

- OrderDTO type casting for untyped properties
- @typescript-eslint v8 upgrade for TS 5.x
- Test coverage for vendor portal
- E2E tests for admin panel require running backend

---

## 11. Related Documents

- [Product Requirements](./PRD.md)
- [Project Roadmap](./ROADMAP.md)
- [Detailed Kuwait PRD](./PRD-Kuwait-Marketplace.md)
- [Task Context](./.claude/task-context.md)
