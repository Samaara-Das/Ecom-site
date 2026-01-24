# Medusa Commerce Modules

Core commerce functionality split into modular, replaceable modules.

## Contents

- Module Overview
- Product Module
- Pricing Module
- Cart Module
- Order Module
- Payment Module
- Fulfillment Module
- Customer Module
- Inventory Module
- Region Module
- Promotion Module
- Module Linking

## Module Overview

| Module | Purpose | Key Entities |
|--------|---------|--------------|
| Product | Products, variants, categories | Product, ProductVariant, ProductCategory |
| Pricing | Price sets, price rules | PriceSet, Price, PriceRule |
| Cart | Shopping cart, line items | Cart, LineItem |
| Order | Orders, fulfillments, returns | Order, OrderItem, Return, Exchange |
| Payment | Payment sessions, captures | PaymentCollection, PaymentSession |
| Fulfillment | Shipping options, providers | FulfillmentSet, ShippingOption |
| Customer | Customer accounts, groups | Customer, CustomerGroup, Address |
| Inventory | Stock levels, reservations | InventoryItem, InventoryLevel |
| Region | Multi-region support | Region, Currency |
| Promotion | Discounts, campaigns | Promotion, Campaign, PromotionRule |
| Sales Channel | Multiple storefronts | SalesChannel |
| Tax | Tax rates, providers | TaxRate, TaxRegion |
| Stock Location | Warehouse management | StockLocation |

## Product Module

### Creating Products

```typescript
import { Modules } from "@medusajs/framework/utils"

const productService = container.resolve(Modules.PRODUCT)

const product = await productService.createProducts({
  title: "Premium T-Shirt",
  description: "High-quality cotton t-shirt",
  status: "published",
  options: [
    { title: "Size", values: ["S", "M", "L", "XL"] },
    { title: "Color", values: ["Black", "White", "Navy"] },
  ],
  variants: [
    {
      title: "Small / Black",
      sku: "TSHIRT-S-BLK",
      options: { Size: "S", Color: "Black" },
    },
  ],
})
```

### Querying Products with Variants

```typescript
const { data: products } = await query.graph({
  entity: "product",
  fields: [
    "id",
    "title",
    "description",
    "status",
    "variants.*",
    "variants.prices.*",
    "categories.*",
    "tags.*",
  ],
  filters: {
    status: "published",
  },
})
```

### Product Categories

```typescript
const category = await productService.createProductCategories({
  name: "Clothing",
  description: "All clothing items",
  is_active: true,
  parent_category_id: null, // Top-level category
})
```

## Pricing Module

### Creating Price Sets

```typescript
import { Modules } from "@medusajs/framework/utils"

const pricingService = container.resolve(Modules.PRICING)

const priceSet = await pricingService.createPriceSets({
  prices: [
    {
      amount: 4000, // $40.00 in cents
      currency_code: "usd",
    },
    {
      amount: 3500, // EUR 35.00
      currency_code: "eur",
    },
  ],
})
```

### Linking Variant to Price Set

```typescript
import { Modules } from "@medusajs/framework/utils"

await link.create({
  [Modules.PRODUCT]: {
    variant_id: "variant_123",
  },
  [Modules.PRICING]: {
    price_set_id: "pset_123",
  },
})
```

### Customer Group Pricing

Set different prices based on customer groups:

```typescript
const priceSet = await pricingService.createPriceSets({
  prices: [
    // Default price
    { amount: 4000, currency_code: "usd" },
    // VIP customer price
    {
      amount: 3000,
      currency_code: "usd",
      rules: { "customer.groups.id": "cusgrp_vip" },
    },
    // Wholesale price
    {
      amount: 2000,
      currency_code: "usd",
      rules: { "customer.groups.id": "cusgrp_wholesale" },
    },
  ],
})
```

### Price Rules

```typescript
// Region-based pricing
{
  amount: 3500,
  currency_code: "eur",
  rules: { region_id: "reg_europe" }
}

// Quantity-based pricing
{
  amount: 3500,
  currency_code: "usd",
  rules: { quantity: { $gte: 10 } }
}
```

## Cart Module

### Creating a Cart

```typescript
import { Modules } from "@medusajs/framework/utils"

const cartService = container.resolve(Modules.CART)

const cart = await cartService.createCarts({
  region_id: "reg_123",
  currency_code: "usd",
  customer_id: "cus_123", // Optional
  email: "customer@example.com",
})
```

### Adding Line Items

```typescript
await cartService.addLineItems(cart.id, [
  {
    variant_id: "variant_123",
    quantity: 2,
  },
])
```

### Updating Line Items

```typescript
await cartService.updateLineItems(cart.id, [
  {
    id: "item_123",
    quantity: 3,
  },
])
```

### Cart Totals

Cart includes calculated totals:

- `subtotal` - Sum of line items before discounts/taxes
- `discount_total` - Total discounts applied
- `shipping_total` - Shipping cost
- `tax_total` - Total taxes
- `total` - Final amount

## Order Module

### Creating an Order

```typescript
import { Modules } from "@medusajs/framework/utils"

const orderService = container.resolve(Modules.ORDER)

const order = await orderService.createOrders({
  region_id: "reg_123",
  currency_code: "usd",
  customer_id: "cus_123",
  email: "customer@example.com",
  items: [
    {
      title: "Premium T-Shirt",
      quantity: 2,
      unit_price: 4000,
      variant_id: "variant_123",
    },
  ],
  shipping_address: {
    first_name: "John",
    last_name: "Doe",
    address_1: "123 Main St",
    city: "New York",
    country_code: "us",
    postal_code: "10001",
  },
})
```

### Order Statuses

| Status | Description |
|--------|-------------|
| `pending` | Order created, not yet processed |
| `completed` | Order fulfilled and completed |
| `canceled` | Order canceled |
| `requires_action` | Needs manual intervention |

### Order Items

```typescript
const { data: orders } = await query.graph({
  entity: "order",
  fields: [
    "id",
    "status",
    "total",
    "items.*",
    "items.variant.*",
    "shipping_address.*",
    "fulfillments.*",
  ],
})
```

## Payment Module

### Creating Payment Collection

```typescript
import { Modules } from "@medusajs/framework/utils"

const paymentService = container.resolve(Modules.PAYMENT)

const paymentCollection = await paymentService.createPaymentCollections({
  region_id: "reg_123",
  currency_code: "usd",
  amount: 5000,
})
```

### Payment Sessions

```typescript
// Initialize payment session
const session = await paymentService.createPaymentSessions(
  paymentCollection.id,
  [{ provider_id: "stripe" }]
)

// Authorize payment
await paymentService.authorizePaymentSession(session.id, {})

// Capture payment
await paymentService.capturePayment({ payment_id: payment.id })
```

### Payment Providers

Configure in `medusa-config.ts`:

```typescript
module.exports = {
  modules: [
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/payment-stripe",
            id: "stripe",
            options: {
              apiKey: process.env.STRIPE_API_KEY,
            },
          },
        ],
      },
    },
  ],
}
```

## Fulfillment Module

### Fulfillment Sets

```typescript
import { Modules } from "@medusajs/framework/utils"

const fulfillmentService = container.resolve(Modules.FULFILLMENT)

const fulfillmentSet = await fulfillmentService.createFulfillmentSets({
  name: "US Warehouse",
  type: "shipping",
})
```

### Shipping Options

```typescript
const shippingOption = await fulfillmentService.createShippingOptions({
  name: "Standard Shipping",
  price_type: "flat",
  service_zone_id: "sz_123",
  shipping_profile_id: "sp_123",
  provider_id: "manual",
  type: {
    code: "standard",
    label: "Standard Shipping",
    description: "5-7 business days",
  },
})
```

### Calculate Shipping Price

```typescript
// In storefront
sdk.store.fulfillment.calculate("so_123", {
  cart_id: "cart_123",
}).then(({ shipping_option }) => {
  console.log(shipping_option.calculated_price)
})
```

## Customer Module

### Creating Customers

```typescript
import { Modules } from "@medusajs/framework/utils"

const customerService = container.resolve(Modules.CUSTOMER)

const customer = await customerService.createCustomers({
  email: "john@example.com",
  first_name: "John",
  last_name: "Doe",
})
```

### Customer Groups

```typescript
// Create group
const group = await customerService.createCustomerGroups({
  name: "VIP Customers",
})

// Add customer to group
await customerService.addCustomerToGroup(customer.id, group.id)
```

### Customer Addresses

```typescript
const address = await customerService.createAddresses({
  customer_id: "cus_123",
  first_name: "John",
  last_name: "Doe",
  address_1: "123 Main St",
  city: "New York",
  country_code: "us",
  postal_code: "10001",
  is_default_shipping: true,
})
```

## Inventory Module

### Inventory Items

```typescript
import { Modules } from "@medusajs/framework/utils"

const inventoryService = container.resolve(Modules.INVENTORY)

const inventoryItem = await inventoryService.createInventoryItems({
  sku: "TSHIRT-S-BLK",
  requires_shipping: true,
})
```

### Inventory Levels

```typescript
await inventoryService.createInventoryLevels({
  inventory_item_id: "iitem_123",
  location_id: "sloc_123",
  stocked_quantity: 100,
})
```

### Reservations

```typescript
await inventoryService.createReservationItems({
  inventory_item_id: "iitem_123",
  location_id: "sloc_123",
  quantity: 5,
  line_item_id: "item_123",
})
```

## Region Module

### Creating Regions

```typescript
import { Modules } from "@medusajs/framework/utils"

const regionService = container.resolve(Modules.REGION)

const region = await regionService.createRegions({
  name: "North America",
  currency_code: "usd",
  countries: ["us", "ca"],
  payment_providers: ["stripe"],
})
```

### Region-Specific Settings

Each region can have:
- Currency code
- Countries included
- Tax settings
- Payment providers
- Fulfillment providers

## Promotion Module

### Creating Promotions

```typescript
import { Modules } from "@medusajs/framework/utils"

const promotionService = container.resolve(Modules.PROMOTION)

const promotion = await promotionService.createPromotions({
  code: "SUMMER20",
  type: "standard",
  application_method: {
    type: "percentage",
    value: 20,
    target_type: "items",
  },
})
```

### Promotion Rules

```typescript
const promotion = await promotionService.createPromotions({
  code: "VIP50",
  type: "standard",
  rules: [
    {
      attribute: "customer.groups.id",
      operator: "in",
      values: ["cusgrp_vip"],
    },
  ],
  application_method: {
    type: "percentage",
    value: 50,
  },
})
```

### Campaigns

```typescript
const campaign = await promotionService.createCampaigns({
  name: "Summer Sale 2024",
  campaign_identifier: "summer-2024",
  starts_at: "2024-06-01",
  ends_at: "2024-08-31",
})
```
