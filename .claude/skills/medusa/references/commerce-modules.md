# Commerce Modules Reference

Core modules for product catalog, shopping cart, orders, pricing, and inventory management.

## Product Module

### Data Model Hierarchy

```
Product
├── ProductVariant (size, color combinations)
│   ├── ProductVariantPrice
│   └── ProductVariantInventory (link)
├── ProductOption (Size, Color)
│   └── ProductOptionValue (S, M, L, Red, Blue)
├── ProductCategory
├── ProductCollection
├── ProductType
└── ProductTag
```

### Creating Products

```typescript
const productService = container.resolve("product")

// Simple product
const product = await productService.createProducts({
  title: "Classic T-Shirt",
  description: "Comfortable cotton t-shirt",
  handle: "classic-tshirt", // URL-friendly slug
  status: "published", // draft, published, rejected
  weight: 200,
  metadata: { brand: "MyBrand" }
})

// With options and variants
const productWithVariants = await productService.createProducts({
  title: "Premium T-Shirt",
  options: [
    { title: "Size", values: ["S", "M", "L", "XL"] },
    { title: "Color", values: ["Black", "White", "Navy"] }
  ],
  variants: [
    {
      title: "Small Black",
      sku: "TSHIRT-S-BLK",
      options: { Size: "S", Color: "Black" },
      manage_inventory: true,
      prices: [
        { amount: 2500, currency_code: "usd" },
        { amount: 2000, currency_code: "eur" }
      ]
    },
    {
      title: "Medium White",
      sku: "TSHIRT-M-WHT",
      options: { Size: "M", Color: "White" },
      prices: [{ amount: 2500, currency_code: "usd" }]
    }
  ]
})
```

### Querying Products

```typescript
const query = container.resolve("query")

// List with filters
const { data: products } = await query.graph({
  entity: "product",
  fields: ["id", "title", "handle", "status", "variants.*"],
  filters: {
    status: "published",
    collection_id: collectionId
  },
  pagination: { skip: 0, take: 20 }
})

// Single product with all relations
const { data: [product] } = await query.graph({
  entity: "product",
  fields: [
    "*",
    "variants.*",
    "variants.prices.*",
    "options.*",
    "options.values.*",
    "categories.*",
    "images.*"
  ],
  filters: { handle: "classic-tshirt" }
})
```

### Product Categories

```typescript
// Create category hierarchy
const parentCategory = await productService.createProductCategories({
  name: "Clothing",
  handle: "clothing",
  is_active: true,
  is_internal: false // visible to storefront
})

const childCategory = await productService.createProductCategories({
  name: "T-Shirts",
  handle: "t-shirts",
  parent_category_id: parentCategory.id,
  is_active: true
})

// Assign products to categories
await productService.updateProducts(productId, {
  category_ids: [childCategory.id]
})
```

### Product Collections

```typescript
// Create collection
const collection = await productService.createProductCollections({
  title: "Summer 2024",
  handle: "summer-2024"
})

// Add products
await productService.updateProducts(productId, {
  collection_id: collection.id
})
```

---

## Cart Module

### Cart Structure

```
Cart
├── LineItem (products in cart)
│   ├── adjustments (discounts)
│   └── tax_lines
├── ShippingMethod
│   ├── adjustments
│   └── tax_lines
├── Address (shipping, billing)
└── PaymentCollection (link)
```

### Cart Operations

```typescript
const cartService = container.resolve("cart")

// Create cart
const cart = await cartService.createCarts({
  region_id: regionId,
  currency_code: "usd",
  customer_id: customerId, // optional
  email: "customer@example.com",
  metadata: { source: "storefront" }
})

// Add line items
await cartService.addLineItems(cart.id, [
  {
    variant_id: variantId,
    quantity: 2,
    metadata: { gift_wrap: true }
  }
])

// Update line item quantity
await cartService.updateLineItems(cart.id, [
  { id: lineItemId, quantity: 3 }
])

// Remove line item
await cartService.deleteLineItems(cart.id, [lineItemId])

// Set addresses
await cartService.updateCarts(cart.id, {
  shipping_address: {
    first_name: "John",
    last_name: "Doe",
    address_1: "123 Main St",
    city: "New York",
    province: "NY",
    postal_code: "10001",
    country_code: "us"
  },
  billing_address: { /* same structure */ }
})

// Add shipping method
await cartService.addShippingMethods(cart.id, [
  { shipping_option_id: shippingOptionId }
])
```

### Cart Promotions

```typescript
// Apply promo code
await cartService.updateCarts(cart.id, {
  promo_codes: ["SUMMER20"]
})

// Cart automatically calculates:
// - item.adjustments (line item discounts)
// - shipping_methods[].adjustments (shipping discounts)
// - subtotal, discount_total, shipping_total, tax_total, total
```

### Retrieve Cart with Totals

```typescript
const { data: [cart] } = await query.graph({
  entity: "cart",
  fields: [
    "*",
    "items.*",
    "items.variant.*",
    "items.variant.product.*",
    "items.adjustments.*",
    "shipping_methods.*",
    "shipping_address.*",
    "payment_collection.*"
  ],
  filters: { id: cartId }
})

// Access calculated totals
console.log({
  subtotal: cart.subtotal,
  discount_total: cart.discount_total,
  shipping_total: cart.shipping_total,
  tax_total: cart.tax_total,
  total: cart.total
})
```

---

## Order Module

### Order Structure

```
Order
├── OrderItem
│   └── OrderItemChange (modifications)
├── ShippingMethod
├── Transaction
├── Fulfillment
├── Return
├── Exchange
└── Claim
```

### Order Lifecycle

```
cart.completed → order.placed → order.fulfillment_created → order.shipped → order.delivered
                     ↓
              order.payment_captured
                     ↓
              (optional) return.requested → return.received → order.refunded
```

### Creating Orders (via Workflow)

```typescript
import { completeCartWorkflow } from "@medusajs/medusa/core-flows"

// Complete checkout - creates order from cart
const { result } = await completeCartWorkflow(container).run({
  input: { id: cartId }
})

const order = result.order
```

### Querying Orders

```typescript
const { data: orders } = await query.graph({
  entity: "order",
  fields: [
    "*",
    "items.*",
    "items.variant.*",
    "items.variant.product.*",
    "shipping_methods.*",
    "fulfillments.*",
    "fulfillments.items.*",
    "transactions.*",
    "shipping_address.*",
    "customer.*"
  ],
  filters: {
    customer_id: customerId,
    status: ["pending", "completed"]
  },
  pagination: { skip: 0, take: 10, order: { created_at: "DESC" } }
})
```

### Order Fulfillment

```typescript
import { createFulfillmentWorkflow } from "@medusajs/medusa/core-flows"

await createFulfillmentWorkflow(container).run({
  input: {
    order_id: orderId,
    items: [
      { id: orderItemId, quantity: 1 }
    ],
    labels: [
      { tracking_number: "1Z999AA10123456784", tracking_url: "https://..." }
    ]
  }
})
```

### Returns

```typescript
import { createReturnWorkflow } from "@medusajs/medusa/core-flows"

// Request return
const { result } = await createReturnWorkflow(container).run({
  input: {
    order_id: orderId,
    items: [
      { id: orderItemId, quantity: 1, reason: "damaged" }
    ],
    return_shipping: {
      option_id: returnShippingOptionId
    }
  }
})

// Process return (when items received)
import { confirmReturnReceiveWorkflow } from "@medusajs/medusa/core-flows"

await confirmReturnReceiveWorkflow(container).run({
  input: {
    return_id: returnId,
    items: [{ id: returnItemId, quantity: 1 }]
  }
})
```

---

## Pricing Module

### Price Structure

```
PriceSet
├── Price
│   ├── currency_code
│   ├── amount (in smallest unit, e.g., cents)
│   └── PriceRule (conditions)
│       ├── region_id
│       ├── customer_group_id
│       └── min_quantity / max_quantity
└── PriceList (sales, VIP pricing)
    └── Price (with rules)
```

### Setting Prices

```typescript
const pricingService = container.resolve("pricing")

// Basic pricing
await productService.updateProductVariants(variantId, {
  prices: [
    { amount: 2500, currency_code: "usd" },
    { amount: 2200, currency_code: "eur" },
    { amount: 2000, currency_code: "gbp" }
  ]
})

// Region-specific pricing
await pricingService.addPrices({
  priceSetId: variant.price_set_id,
  prices: [
    {
      amount: 2000,
      currency_code: "usd",
      rules: { region_id: usRegionId }
    },
    {
      amount: 2500,
      currency_code: "usd",
      rules: { region_id: caRegionId }
    }
  ]
})
```

### Price Lists (Sales)

```typescript
// Create sale price list
const priceList = await pricingService.createPriceLists({
  title: "Summer Sale",
  type: "sale", // sale or override
  status: "active",
  starts_at: new Date("2024-06-01"),
  ends_at: new Date("2024-08-31")
})

// Add sale prices
await pricingService.addPriceListPrices({
  priceListId: priceList.id,
  prices: [
    {
      price_set_id: variant.price_set_id,
      amount: 1999, // sale price
      currency_code: "usd"
    }
  ]
})
```

### Calculating Prices

```typescript
// Get calculated price for context
const prices = await pricingService.calculatePrices({
  id: [variant.price_set_id],
  context: {
    currency_code: "usd",
    region_id: regionId,
    customer_group_id: customerGroupId
  }
})

// Result includes original and calculated amounts
// { calculated_amount, original_amount, currency_code }
```

---

## Inventory Module

### Inventory Structure

```
InventoryItem
├── InventoryLevel (per location)
│   ├── stocked_quantity
│   ├── reserved_quantity
│   └── available_quantity (computed)
└── ReservationItem (held for orders)
```

### Managing Inventory

```typescript
const inventoryService = container.resolve("inventory")

// Create inventory item
const item = await inventoryService.createInventoryItems({
  sku: "TSHIRT-S-BLK",
  requires_shipping: true
})

// Link to variant (via module link)
import { Modules } from "@medusajs/framework/utils"

await remoteLink.create({
  [Modules.PRODUCT]: { variant_id: variantId },
  [Modules.INVENTORY]: { inventory_item_id: item.id }
})

// Set stock levels per location
await inventoryService.createInventoryLevels({
  inventory_item_id: item.id,
  location_id: warehouseId,
  stocked_quantity: 100
})

// Adjust stock
await inventoryService.adjustInventory({
  inventoryItemId: item.id,
  locationId: warehouseId,
  adjustment: -5 // reduce by 5
})
```

### Reservations

```typescript
// Reserve for order
const reservation = await inventoryService.createReservationItems({
  inventory_item_id: itemId,
  location_id: warehouseId,
  quantity: 2,
  line_item_id: orderLineItemId
})

// Check availability
const levels = await inventoryService.listInventoryLevels({
  inventory_item_id: itemId,
  location_id: warehouseId
})

// available = stocked_quantity - reserved_quantity
const available = levels[0].stocked_quantity - levels[0].reserved_quantity
```

---

## Customer Module

### Customer Structure

```
Customer
├── CustomerAddress
├── CustomerGroup
└── (links to Orders, Carts)
```

### Customer Operations

```typescript
const customerService = container.resolve("customer")

// Create customer
const customer = await customerService.createCustomers({
  email: "john@example.com",
  first_name: "John",
  last_name: "Doe",
  phone: "+1234567890",
  metadata: { loyalty_tier: "gold" }
})

// Add address
await customerService.createCustomerAddresses({
  customer_id: customer.id,
  first_name: "John",
  last_name: "Doe",
  address_1: "123 Main St",
  city: "New York",
  province: "NY",
  postal_code: "10001",
  country_code: "us",
  is_default_shipping: true,
  is_default_billing: true
})

// Customer groups
const group = await customerService.createCustomerGroups({
  name: "VIP Customers"
})

await customerService.addCustomerToGroup({
  customer_id: customer.id,
  customer_group_id: group.id
})
```

### Querying Customers

```typescript
const { data: customers } = await query.graph({
  entity: "customer",
  fields: [
    "*",
    "addresses.*",
    "groups.*",
    "orders.*",
    "orders.items.*"
  ],
  filters: {
    email: "john@example.com"
  }
})

// Get customer with order history
const { data: [customer] } = await query.graph({
  entity: "customer",
  fields: ["*", "orders.*"],
  filters: { id: customerId }
})
```
