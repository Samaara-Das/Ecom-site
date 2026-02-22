# Kuwait Marketplace - Database Schema Documentation

**Version**: 1.0
**Date**: 2026-01-30
**Database**: PostgreSQL 14+
**ORM**: Medusa v2 Data Layer (MikroORM)

---

## 1. Overview

The Kuwait Marketplace uses PostgreSQL as its primary database, managed through Medusa v2's data layer built on MikroORM. The schema consists of:

- **Medusa Core Models**: Standard e-commerce entities (products, carts, orders, customers)
- **Custom Models**: Marketplace-specific entities (vendors)
- **Link Tables**: Virtual relationships connecting modules

### Key Characteristics

| Aspect | Description |
|--------|-------------|
| **Primary Keys** | Text-based UUIDs (prefixed identifiers) |
| **Soft Deletes** | `deleted_at` timestamp on all entities |
| **Timestamps** | `created_at` and `updated_at` on all entities |
| **Validation** | SQL CHECK constraints for data integrity |
| **Indexing** | Partial indexes on `deleted_at IS NULL` |

---

## 2. Entity Relationship Diagram

```
+------------------+       +-------------------+       +------------------+
|     VENDOR       |       |  VENDOR_PRODUCT   |       |     PRODUCT      |
+------------------+       |     (Link Table)  |       +------------------+
| id (PK)          |<------| vendor_id (FK)    |       | id (PK)          |
| name             |       | product_id (FK)   |------>| title            |
| description      |       +-------------------+       | description      |
| email            |                                   | handle           |
| phone            |                                   | status           |
| logo_url         |                                   | thumbnail        |
| status           |                                   | metadata         |
| commission_rate  |                                   | deleted_at       |
| business_reg     |                                   +--------+---------+
| bank_account     |                                            |
| address_*        |                                            | 1:N
| country_code     |                                   +--------v---------+
| created_at       |                                   | PRODUCT_VARIANT  |
| updated_at       |                                   +------------------+
| deleted_at       |                                   | id (PK)          |
+------------------+                                   | product_id (FK)  |
                                                       | title            |
                                                       | sku              |
+------------------+       +-------------------+       | inventory_qty    |
|    CUSTOMER      |       |   CUSTOMER_ADDR   |       | manage_inventory |
+------------------+       +-------------------+       +--------+---------+
| id (PK)          |<------| customer_id (FK)  |                |
| email            |       | first_name        |                | 1:N
| first_name       |       | last_name         |       +--------v---------+
| last_name        |       | address_1         |       |  VARIANT_PRICE   |
| phone            |       | address_2         |       +------------------+
| has_account      |       | city              |       | id (PK)          |
| metadata         |       | postal_code       |       | variant_id (FK)  |
| created_at       |       | country_code      |       | currency_code    |
| updated_at       |       | is_default        |       | amount           |
| deleted_at       |       +-------------------+       +------------------+
+--------+---------+
         |
         | 1:N
+--------v---------+       +-------------------+       +------------------+
|      ORDER       |       |    LINE_ITEM      |       |       CART       |
+------------------+       +-------------------+       +------------------+
| id (PK)          |<------| order_id (FK)     |       | id (PK)          |
| customer_id (FK) |       | cart_id (FK)      |------>| customer_id (FK) |
| email            |       | variant_id (FK)   |       | region_id (FK)   |
| currency_code    |       | title             |       | email            |
| region_id (FK)   |       | quantity          |       | currency_code    |
| payment_status   |       | unit_price        |       | metadata         |
| fulfillment_stat |       | thumbnail         |       +------------------+
| total            |       | metadata          |
| subtotal         |       +-------------------+
| created_at       |
| metadata         |       +-------------------+
+------------------+       |      REGION       |
                           +-------------------+
                           | id (PK)           |
                           | name              |
                           | currency_code     |
                           | tax_rate          |
                           | countries[]       |
                           +-------------------+
```

---

## 3. Custom Models

### 3.1 Vendor Model

The Vendor model represents sellers/merchants in the multi-vendor marketplace.

**Table Name**: `vendor`
**Module**: `vendor` (custom Medusa module)
**Location**: `backend/src/modules/vendor/models/vendor.ts`

#### Schema Definition

```typescript
export const Vendor = model.define("vendor", {
  id: model.id().primaryKey(),
  name: model.text(),
  description: model.text().nullable(),
  email: model.text(),
  phone: model.text().nullable(),
  logo_url: model.text().nullable(),
  status: model.enum(["pending", "verified", "premium", "suspended"]).default("pending"),
  commission_rate: model.float().default(0.15),
  business_registration: model.text().nullable(),
  bank_account: model.text().nullable(),
  address_line_1: model.text().nullable(),
  address_line_2: model.text().nullable(),
  city: model.text().nullable(),
  postal_code: model.text().nullable(),
  country_code: model.text().default("kw"),
}).checks([
  {
    name: "email_format_check",
    expression: (columns) => `${columns.email} LIKE '%@%'`,
  },
])
```

#### Field Reference

| Field | Type | Nullable | Default | Description |
|-------|------|----------|---------|-------------|
| `id` | TEXT | NO | Auto-generated | Primary key (UUID format) |
| `name` | TEXT | NO | - | Vendor business name |
| `description` | TEXT | YES | NULL | Business description |
| `email` | TEXT | NO | - | Contact email (must contain @) |
| `phone` | TEXT | YES | NULL | Contact phone number |
| `logo_url` | TEXT | YES | NULL | URL to vendor logo image |
| `status` | ENUM | NO | 'pending' | Account status (see below) |
| `commission_rate` | REAL | NO | 0.15 | Platform commission (0.15 = 15%) |
| `business_registration` | TEXT | YES | NULL | Kuwait Commercial Registration |
| `bank_account` | TEXT | YES | NULL | Bank account for payouts |
| `address_line_1` | TEXT | YES | NULL | Street address line 1 |
| `address_line_2` | TEXT | YES | NULL | Street address line 2 |
| `city` | TEXT | YES | NULL | City name |
| `postal_code` | TEXT | YES | NULL | Postal/ZIP code |
| `country_code` | TEXT | NO | 'kw' | ISO country code |
| `created_at` | TIMESTAMPTZ | NO | NOW() | Record creation time |
| `updated_at` | TIMESTAMPTZ | NO | NOW() | Last update time |
| `deleted_at` | TIMESTAMPTZ | YES | NULL | Soft delete timestamp |

#### Status Values

| Status | Description | Permissions |
|--------|-------------|-------------|
| `pending` | Awaiting admin approval | Cannot create products |
| `verified` | Approved by admin | Full marketplace access |
| `premium` | Premium vendor tier | Full access + priority |
| `suspended` | Temporarily disabled | No marketplace access |

#### Constraints

```sql
-- Primary key constraint
CONSTRAINT vendor_pkey PRIMARY KEY (id)

-- Email format validation
CONSTRAINT email_format_check CHECK (email LIKE '%@%')
```

#### Indexes

```sql
-- Partial index for active records (soft delete support)
CREATE INDEX IF NOT EXISTS "IDX_vendor_deleted_at"
ON "vendor" ("deleted_at")
WHERE deleted_at IS NULL;
```

#### SQL Migration

```sql
CREATE TABLE IF NOT EXISTS "vendor" (
    "id" text not null,
    "name" text not null,
    "description" text null,
    "email" text not null,
    "phone" text null,
    "logo_url" text null,
    "status" text check ("status" in ('pending', 'verified', 'premium', 'suspended'))
             not null default 'pending',
    "commission_rate" real not null default 0.15,
    "business_registration" text null,
    "bank_account" text null,
    "address_line_1" text null,
    "address_line_2" text null,
    "city" text null,
    "postal_code" text null,
    "country_code" text not null default 'kw',
    "created_at" timestamptz not null default now(),
    "updated_at" timestamptz not null default now(),
    "deleted_at" timestamptz null,
    CONSTRAINT "vendor_pkey" PRIMARY KEY ("id"),
    CONSTRAINT email_format_check CHECK (email LIKE '%@%')
);

CREATE INDEX IF NOT EXISTS "IDX_vendor_deleted_at"
ON "vendor" ("deleted_at")
WHERE deleted_at IS NULL;
```

---

### 3.2 Vendor-Product Link Table

Links vendors to products in a one-to-many relationship.

**Location**: `backend/src/links/vendor-product.ts`

#### Link Definition

```typescript
import { defineLink } from "@medusajs/framework/utils"
import ProductModule from "@medusajs/medusa/product"
import VendorModule from "../modules/vendor"

export default defineLink(
  {
    linkable: ProductModule.linkable.product,
    isList: true,  // A vendor can have multiple products
  },
  VendorModule.linkable.vendor
)
```

#### Relationship Semantics

| Aspect | Description |
|--------|-------------|
| **Direction** | Product -> Vendor (many-to-one) |
| **Cascade** | Products can exist without vendors |
| **Virtual** | No physical FK in product table |
| **Query** | Join via Medusa Link module |

#### Alternative: Metadata-based Linking

Products can also store vendor reference in metadata:

```typescript
// Product metadata structure
{
  metadata: {
    vendor_id: "vendor_abc123",
    vendor_name: "Store Name"
  }
}
```

This approach is used in the vendor products API for simpler queries.

---

## 4. Extended Medusa Models

### 4.1 Customer

Medusa's customer model is used with custom API routes.

#### Standard Fields (Medusa Core)

| Field | Type | Description |
|-------|------|-------------|
| `id` | TEXT | Primary key |
| `email` | TEXT | Customer email |
| `first_name` | TEXT | First name |
| `last_name` | TEXT | Last name |
| `phone` | TEXT | Phone number (extended) |
| `has_account` | BOOLEAN | Registered account flag |
| `metadata` | JSONB | Custom data storage |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Update timestamp |
| `deleted_at` | TIMESTAMPTZ | Soft delete timestamp |

#### Custom Extensions

The Kuwait Marketplace extends customers with:

```typescript
// Registration schema (validated via Zod)
{
  email: z.string().email(),
  first_name: z.string().min(1).max(255),
  last_name: z.string().min(1).max(255),
  phone: z.string().optional(),        // Kuwait phone support
  metadata: z.record(z.unknown()).optional()
}

// Update schema
{
  first_name: z.string().min(1).max(255).optional(),
  last_name: z.string().min(1).max(255).optional(),
  phone: z.string().optional().nullable(),
  metadata: z.record(z.unknown()).optional()
}
```

#### Customer Address

| Field | Type | Description |
|-------|------|-------------|
| `id` | TEXT | Primary key |
| `customer_id` | TEXT | Foreign key to customer |
| `first_name` | TEXT | Recipient first name |
| `last_name` | TEXT | Recipient last name |
| `address_1` | TEXT | Street address line 1 |
| `address_2` | TEXT | Street address line 2 |
| `city` | TEXT | City name |
| `postal_code` | TEXT | Postal code |
| `country_code` | TEXT | ISO country code |
| `phone` | TEXT | Contact phone |
| `is_default_shipping` | BOOLEAN | Default shipping address |
| `is_default_billing` | BOOLEAN | Default billing address |

---

### 4.2 Product

Products are linked to vendors via metadata or the Link module.

#### Standard Fields (Medusa Core)

| Field | Type | Description |
|-------|------|-------------|
| `id` | TEXT | Primary key |
| `title` | TEXT | Product name |
| `subtitle` | TEXT | Short description |
| `description` | TEXT | Full description |
| `handle` | TEXT | URL-friendly slug |
| `status` | ENUM | draft, published, etc. |
| `thumbnail` | TEXT | Thumbnail image URL |
| `metadata` | JSONB | Vendor linkage, custom data |

#### Vendor-Related Metadata

```json
{
  "vendor_id": "vendor_abc123def",
  "vendor_name": "Kuwait Electronics Store"
}
```

#### Product Variant

| Field | Type | Description |
|-------|------|-------------|
| `id` | TEXT | Primary key |
| `product_id` | TEXT | Parent product |
| `title` | TEXT | Variant name |
| `sku` | TEXT | Stock keeping unit |
| `inventory_quantity` | INTEGER | Available stock |
| `manage_inventory` | BOOLEAN | Track inventory flag |

#### Variant Pricing

| Field | Type | Description |
|-------|------|-------------|
| `id` | TEXT | Primary key |
| `variant_id` | TEXT | Parent variant |
| `currency_code` | TEXT | ISO currency code |
| `amount` | INTEGER | Price in minor units |

---

### 4.3 Order

Orders may contain items from multiple vendors.

#### Standard Fields (Medusa Core)

| Field | Type | Description |
|-------|------|-------------|
| `id` | TEXT | Primary key |
| `display_id` | INTEGER | Human-readable order number |
| `customer_id` | TEXT | Customer reference |
| `email` | TEXT | Order email |
| `currency_code` | TEXT | Order currency |
| `region_id` | TEXT | Geographic region |
| `payment_status` | ENUM | awaiting, captured, etc. |
| `fulfillment_status` | ENUM | not_fulfilled, fulfilled, etc. |
| `total` | INTEGER | Order total (minor units) |
| `subtotal` | INTEGER | Subtotal before tax/shipping |
| `tax_total` | INTEGER | Tax amount |
| `shipping_total` | INTEGER | Shipping cost |
| `metadata` | JSONB | Custom data |

#### Vendor Grouping

Cart items are grouped by vendor for display:

```typescript
interface VendorGroup {
  vendor_id: string | null
  vendor_name: string
  vendor_logo?: string | null
  items: VendorGroupItem[]
  subtotal: number
  item_count: number
}
```

The `/store/carts/:id/grouped` endpoint returns this structure.

---

### 4.4 Cart

Shopping carts with multi-vendor support.

#### Line Item Extensions

| Field | Type | Description |
|-------|------|-------------|
| `id` | TEXT | Primary key |
| `cart_id` | TEXT | Parent cart |
| `variant_id` | TEXT | Product variant |
| `title` | TEXT | Item title |
| `quantity` | INTEGER | Item quantity |
| `unit_price` | BIGINT | Price per unit |
| `thumbnail` | TEXT | Item thumbnail |
| `metadata` | JSONB | Vendor info |

Line item metadata for vendor tracking:

```json
{
  "vendor_id": "vendor_abc123",
  "vendor_name": "Electronics Store"
}
```

---

## 5. Key Indexes and Constraints

### 5.1 Primary Keys

All tables use text-based UUID primary keys:

```sql
-- Vendor
CONSTRAINT vendor_pkey PRIMARY KEY (id)

-- Products, Orders, Customers use Medusa defaults
```

### 5.2 Unique Constraints

| Table | Constraint | Fields |
|-------|------------|--------|
| `customer` | Unique email | `email` |
| `product` | Unique handle | `handle` |
| `product_variant` | Unique SKU | `sku` |
| `vendor` | Email format | `email LIKE '%@%'` |

### 5.3 Foreign Keys

Medusa v2 uses virtual links instead of physical FKs for module separation:

```typescript
// Link queries via RemoteLink module
const links = await linkService.list({
  [Modules.PRODUCT]: {
    product_id: productId,
  },
})
```

### 5.4 Indexes

| Table | Index | Columns | Condition |
|-------|-------|---------|-----------|
| `vendor` | IDX_vendor_deleted_at | deleted_at | WHERE deleted_at IS NULL |
| `product` | IDX_product_handle | handle | - |
| `customer` | IDX_customer_email | email | - |
| `order` | IDX_order_customer | customer_id | - |

### 5.5 Check Constraints

```sql
-- Vendor email validation
CONSTRAINT email_format_check CHECK (email LIKE '%@%')

-- Vendor status enum
CHECK (status IN ('pending', 'verified', 'premium', 'suspended'))
```

---

## 6. Migration Strategy

### 6.1 Migration Files

Location: `backend/src/modules/vendor/migrations/`

Example migration:

```typescript
// Migration20260127163713.ts
import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260127163713 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`CREATE TABLE IF NOT EXISTS "vendor" ...`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_vendor_deleted_at" ...`);
  }

  override async down(): Promise<void> {
    this.addSql(`DROP TABLE IF EXISTS "vendor" CASCADE;`);
  }
}
```

### 6.2 Running Migrations

```bash
# Generate new migration after model changes
npx medusa db:migrate

# Run pending migrations
npx medusa db:migrate

# Rollback last migration
npx medusa db:rollback
```

### 6.3 Seeding Data

```bash
# Seed product catalog
npx medusa exec ./src/scripts/seed-products.ts

# Seed inventory levels
npx medusa exec ./src/scripts/seed-inventory.ts
```

### 6.4 Migration Best Practices

1. **Idempotent**: Use `IF NOT EXISTS` for tables/indexes
2. **Reversible**: Always implement `down()` method
3. **Atomic**: Each migration = single logical change
4. **Documented**: Add comments for complex changes

---

## 7. Data Relationships Summary

### 7.1 One-to-Many Relationships

| Parent | Child | Relationship |
|--------|-------|--------------|
| Vendor | Product | Via link table or metadata |
| Customer | Order | customer_id FK |
| Customer | Address | customer_id FK |
| Product | Variant | product_id FK |
| Variant | Price | variant_id FK |
| Cart | LineItem | cart_id FK |
| Order | LineItem | order_id FK |
| Region | Country | region_id FK |

### 7.2 Many-to-Many Relationships

| Table A | Table B | Link Method |
|---------|---------|-------------|
| Product | Category | Junction table |
| Region | PaymentProvider | Junction table |
| Region | ShippingOption | Junction table |

### 7.3 Virtual Links (Medusa Modules)

| Source Module | Target Module | Link Type |
|---------------|---------------|-----------|
| Product | Vendor | defineLink (custom) |
| Cart | Customer | Medusa core |
| Order | Payment | Medusa core |

---

## 8. Query Patterns

### 8.1 Vendor Queries

```typescript
// List vendors by status
const vendors = await vendorService.listVendors({
  status: ["verified", "premium"]
})

// Find vendor by email
const vendor = await vendorService.findVendorByEmail("store@example.com")

// Get vendor with pagination
const [vendors, count] = await vendorService.listAndCountVendors(
  { status: "verified" },
  { skip: 0, take: 20, order: { created_at: "DESC" } }
)
```

### 8.2 Product-Vendor Queries

```typescript
// Get products by vendor (via metadata)
const products = await productService.listProducts({})
const vendorProducts = products.filter(
  p => p.metadata?.vendor_id === vendorId
)

// Get vendor for product (via link)
const links = await linkService.list({
  [Modules.PRODUCT]: { product_id: productId }
})
const vendorId = links[0]?.[VENDOR_MODULE]?.vendor_id
```

### 8.3 Customer Queries

```typescript
// Get customer with addresses
const { data: customers } = await query.graph({
  entity: "customer",
  fields: [
    "id", "email", "first_name", "last_name",
    "phone", "has_account", "metadata",
    "addresses.*"
  ],
  filters: { id: customerId }
})
```

---

## 9. Related Documentation

- [Technical Specification](./TECHNICAL_SPEC.md)
- [API Reference](./API_REFERENCE.md)
- [Product Requirements](./PRD.md)
- [Medusa v2 Documentation](https://docs.medusajs.com)

---

## Appendix A: Full Vendor Table DDL

```sql
CREATE TABLE IF NOT EXISTS "vendor" (
    "id" text not null,
    "name" text not null,
    "description" text null,
    "email" text not null,
    "phone" text null,
    "logo_url" text null,
    "status" text check ("status" in ('pending', 'verified', 'premium', 'suspended'))
             not null default 'pending',
    "commission_rate" real not null default 0.15,
    "business_registration" text null,
    "bank_account" text null,
    "address_line_1" text null,
    "address_line_2" text null,
    "city" text null,
    "postal_code" text null,
    "country_code" text not null default 'kw',
    "created_at" timestamptz not null default now(),
    "updated_at" timestamptz not null default now(),
    "deleted_at" timestamptz null,
    CONSTRAINT "vendor_pkey" PRIMARY KEY ("id"),
    CONSTRAINT email_format_check CHECK (email LIKE '%@%')
);

CREATE INDEX IF NOT EXISTS "IDX_vendor_deleted_at"
ON "vendor" ("deleted_at")
WHERE deleted_at IS NULL;
```

---

## Appendix B: TypeScript Type Definitions

```typescript
// Vendor types
type VendorStatus = "pending" | "verified" | "premium" | "suspended"

interface Vendor {
  id: string
  name: string
  description: string | null
  email: string
  phone: string | null
  logo_url: string | null
  status: VendorStatus
  commission_rate: number
  business_registration: string | null
  bank_account: string | null
  address_line_1: string | null
  address_line_2: string | null
  city: string | null
  postal_code: string | null
  country_code: string
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}

// Customer types
interface Customer {
  id: string
  email: string
  first_name: string
  last_name: string
  phone: string | null
  has_account: boolean
  metadata: Record<string, unknown>
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
  addresses?: CustomerAddress[]
}

interface CustomerAddress {
  id: string
  customer_id: string
  first_name: string
  last_name: string
  address_1: string
  address_2: string | null
  city: string
  postal_code: string
  country_code: string
  phone: string | null
  is_default_shipping: boolean
  is_default_billing: boolean
}

// Cart vendor grouping types
interface VendorGroupItem {
  id: string
  title: string
  variant_title?: string
  quantity: number
  unit_price: number
  total: number
  thumbnail?: string | null
  product_id?: string
}

interface VendorGroup {
  vendor_id: string | null
  vendor_name: string
  vendor_logo?: string | null
  items: VendorGroupItem[]
  subtotal: number
  item_count: number
}
```
