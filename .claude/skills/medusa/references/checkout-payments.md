# Checkout & Payments Reference

Modules for payment processing, fulfillment, tax calculation, regions, and sales channels.

## Payment Module

### Payment Flow

```
Cart → PaymentCollection → PaymentSession → Payment → Capture/Refund
           ↓
    (select provider)
           ↓
    (authorize payment)
           ↓
    (complete checkout)
```

### Payment Collection

```typescript
const paymentService = container.resolve("payment")

// Create payment collection for cart
const paymentCollection = await paymentService.createPaymentCollections({
  cart_id: cartId,
  amount: cart.total,
  currency_code: cart.currency_code,
  region_id: cart.region_id
})

// List available payment providers
const providers = await paymentService.listPaymentProviders({
  region_id: cart.region_id,
  is_enabled: true
})
```

### Payment Sessions

```typescript
// Initialize payment session with provider
const session = await paymentService.createPaymentSession(
  paymentCollection.id,
  {
    provider_id: "stripe", // pp_stripe_stripe
    data: {
      // Provider-specific data
    }
  }
)

// Update session (e.g., with payment method)
await paymentService.updatePaymentSession({
  id: session.id,
  data: {
    payment_method_id: "pm_xxx"
  }
})

// Authorize payment
await paymentService.authorizePaymentSession(session.id, {})
```

### Payment Capture & Refund

```typescript
// Capture authorized payment (usually after fulfillment)
import { capturePaymentWorkflow } from "@medusajs/medusa/core-flows"

await capturePaymentWorkflow(container).run({
  input: {
    payment_id: paymentId,
    amount: captureAmount // optional, defaults to full amount
  }
})

// Refund payment
import { refundPaymentWorkflow } from "@medusajs/medusa/core-flows"

await refundPaymentWorkflow(container).run({
  input: {
    payment_id: paymentId,
    amount: refundAmount
  }
})
```

### Payment Provider Implementation

```typescript
// src/modules/my-payment/service.ts
import { AbstractPaymentProvider } from "@medusajs/framework/utils"

class MyPaymentProvider extends AbstractPaymentProvider {
  static identifier = "my-payment"

  async initiatePayment(context) {
    // Create payment with external provider
    return { data: { external_id: "xxx" } }
  }

  async authorizePayment(paymentSessionData) {
    // Authorize the payment
    return { status: "authorized", data: paymentSessionData }
  }

  async capturePayment(paymentData) {
    // Capture the payment
    return { data: paymentData }
  }

  async refundPayment(paymentData, refundAmount) {
    // Process refund
    return { data: paymentData }
  }

  async cancelPayment(paymentData) {
    // Cancel/void payment
    return { data: paymentData }
  }

  async getPaymentStatus(paymentData) {
    return { status: "authorized" } // pending, authorized, captured, canceled
  }
}

export default MyPaymentProvider
```

---

## Fulfillment Module

### Fulfillment Structure

```
FulfillmentProvider
├── ShippingOption
│   ├── ShippingOptionRule
│   └── ShippingOptionType
└── FulfillmentSet
    └── ServiceZone
        └── GeoZone (countries/regions)
```

### Shipping Options

```typescript
const fulfillmentService = container.resolve("fulfillment")

// Create fulfillment set
const fulfillmentSet = await fulfillmentService.createFulfillmentSets({
  name: "Standard Shipping",
  type: "shipping"
})

// Create service zone
const serviceZone = await fulfillmentService.createServiceZones({
  name: "US Zone",
  fulfillment_set_id: fulfillmentSet.id,
  geo_zones: [
    { type: "country", country_code: "us" },
    { type: "country", country_code: "ca" }
  ]
})

// Create shipping option
const shippingOption = await fulfillmentService.createShippingOptions({
  name: "Standard Shipping",
  service_zone_id: serviceZone.id,
  provider_id: "manual", // or your fulfillment provider
  price_type: "flat", // flat or calculated
  type: {
    label: "Standard",
    description: "5-7 business days",
    code: "standard"
  },
  data: {},
  rules: [
    {
      attribute: "total",
      operator: "gte",
      value: 5000 // Free shipping over $50
    }
  ]
})

// Set shipping option price
await pricingService.createPriceSets({
  prices: [{ amount: 599, currency_code: "usd" }]
})
// Link to shipping option
```

### Fulfillment Providers

```typescript
// src/modules/my-fulfillment/service.ts
import { AbstractFulfillmentProviderService } from "@medusajs/framework/utils"

class MyFulfillmentProvider extends AbstractFulfillmentProviderService {
  static identifier = "my-fulfillment"

  async getFulfillmentOptions() {
    return [
      { id: "standard", name: "Standard Shipping" },
      { id: "express", name: "Express Shipping" }
    ]
  }

  async validateOption(data) {
    return true
  }

  async calculatePrice(optionData, data, cart) {
    // Calculate shipping cost
    return { calculated_amount: 599 }
  }

  async createFulfillment(data, items, order, fulfillment) {
    // Create fulfillment with carrier
    return { data: { tracking_number: "xxx" } }
  }

  async cancelFulfillment(fulfillment) {
    // Cancel with carrier
    return {}
  }
}

export default MyFulfillmentProvider
```

### Creating Fulfillments

```typescript
import { createFulfillmentWorkflow } from "@medusajs/medusa/core-flows"

// Create fulfillment for order
await createFulfillmentWorkflow(container).run({
  input: {
    order_id: orderId,
    location_id: warehouseId,
    items: [
      { id: orderItemId, quantity: 1 }
    ],
    labels: [
      {
        tracking_number: "1Z999AA10123456784",
        tracking_url: "https://tracking.example.com/1Z999AA10123456784",
        label_url: "https://labels.example.com/label.pdf"
      }
    ],
    metadata: { carrier: "ups" }
  }
})

// Mark as shipped
import { markFulfillmentAsShippedWorkflow } from "@medusajs/medusa/core-flows"

await markFulfillmentAsShippedWorkflow(container).run({
  input: { id: fulfillmentId }
})

// Mark as delivered
import { markFulfillmentAsDeliveredWorkflow } from "@medusajs/medusa/core-flows"

await markFulfillmentAsDeliveredWorkflow(container).run({
  input: { id: fulfillmentId }
})
```

---

## Tax Module

### Tax Structure

```
TaxRegion
├── TaxRate (default rate)
└── TaxRateRule (product/product type overrides)

TaxProvider (calculation strategy)
```

### Tax Configuration

```typescript
const taxService = container.resolve("tax")

// Create tax region
const taxRegion = await taxService.createTaxRegions({
  country_code: "us",
  province_code: "CA", // optional, for state-level
  default_tax_rate: {
    rate: 7.25,
    code: "CA_SALES_TAX",
    name: "California Sales Tax"
  }
})

// Add tax rate overrides
await taxService.createTaxRates({
  tax_region_id: taxRegion.id,
  rate: 0,
  code: "EXEMPT",
  name: "Tax Exempt",
  rules: [
    { reference: "product_type", reference_id: foodProductTypeId }
  ]
})
```

### Tax Providers

```typescript
// src/modules/my-tax/service.ts
import { AbstractTaxProvider } from "@medusajs/framework/utils"

class MyTaxProvider extends AbstractTaxProvider {
  static identifier = "my-tax"

  async getTaxLines(items, calculationContext) {
    // Calculate taxes (e.g., via TaxJar, Avalara)
    return items.map(item => ({
      line_item_id: item.id,
      rate: 8.25,
      code: "SALES_TAX",
      name: "Sales Tax"
    }))
  }
}

export default MyTaxProvider
```

---

## Region Module

### Region Structure

```
Region
├── currency_code
├── countries[]
├── payment_providers[]
├── fulfillment_providers[]
└── tax_region (link)
```

### Creating Regions

```typescript
const regionService = container.resolve("region")

// Create region
const region = await regionService.createRegions({
  name: "North America",
  currency_code: "usd",
  countries: ["us", "ca"],
  payment_providers: ["stripe"],
  automatic_taxes: true,
  metadata: {}
})

// Create European region
const euRegion = await regionService.createRegions({
  name: "Europe",
  currency_code: "eur",
  countries: ["de", "fr", "it", "es", "nl"],
  payment_providers: ["stripe", "paypal"],
  automatic_taxes: true
})
```

### Region-Based Operations

```typescript
// Get region by country
const { data: [region] } = await query.graph({
  entity: "region",
  fields: ["*", "countries.*", "payment_providers.*"],
  filters: {
    countries: { country_code: "us" }
  }
})

// Create cart for region
const cart = await cartService.createCarts({
  region_id: region.id,
  currency_code: region.currency_code
})

// Get shipping options for region
const { data: shippingOptions } = await query.graph({
  entity: "shipping_option",
  fields: ["*", "prices.*"],
  filters: {
    service_zone: {
      geo_zones: {
        country_code: region.countries[0].country_code
      }
    }
  }
})
```

---

## Sales Channel Module

### Sales Channel Concept

Sales channels scope products and orders to different storefronts:
- Main website
- Mobile app
- Marketplace
- B2B portal

### Creating Sales Channels

```typescript
const salesChannelService = container.resolve("sales_channel")

// Create sales channel
const webChannel = await salesChannelService.createSalesChannels({
  name: "Web Store",
  description: "Main website storefront",
  is_disabled: false
})

const mobileChannel = await salesChannelService.createSalesChannels({
  name: "Mobile App",
  description: "iOS and Android apps"
})

// Associate products with channel
await salesChannelService.addProductsToSalesChannels({
  sales_channel_id: webChannel.id,
  product_ids: [product1Id, product2Id]
})
```

### Scoping Queries

```typescript
// Get products for specific channel
const { data: products } = await query.graph({
  entity: "product",
  fields: ["*", "variants.*"],
  filters: {
    sales_channels: {
      id: webChannelId
    },
    status: "published"
  }
})

// Create cart with sales channel
const cart = await cartService.createCarts({
  region_id: regionId,
  sales_channel_id: webChannelId
})
```

---

## Complete Checkout Flow

```typescript
// 1. Create cart
const cart = await cartService.createCarts({
  region_id: regionId,
  sales_channel_id: salesChannelId,
  currency_code: "usd"
})

// 2. Add items
await cartService.addLineItems(cart.id, [
  { variant_id: variantId, quantity: 2 }
])

// 3. Set customer info
await cartService.updateCarts(cart.id, {
  email: "customer@example.com",
  shipping_address: {
    first_name: "John",
    last_name: "Doe",
    address_1: "123 Main St",
    city: "New York",
    province: "NY",
    postal_code: "10001",
    country_code: "us"
  }
})

// 4. Get shipping options
const shippingOptions = await fulfillmentService.listShippingOptionsForContext({
  cart_id: cart.id,
  is_return: false
})

// 5. Add shipping method
await cartService.addShippingMethods(cart.id, [
  { shipping_option_id: shippingOptions[0].id }
])

// 6. Create payment collection
const paymentCollection = await paymentService.createPaymentCollections({
  cart_id: cart.id,
  amount: cart.total,
  currency_code: cart.currency_code
})

// 7. Initialize payment session
await paymentService.createPaymentSession(paymentCollection.id, {
  provider_id: "stripe"
})

// 8. Authorize payment (client-side typically)
await paymentService.authorizePaymentSession(sessionId, {
  // Provider-specific authorization data
})

// 9. Complete checkout
import { completeCartWorkflow } from "@medusajs/medusa/core-flows"

const { result } = await completeCartWorkflow(container).run({
  input: { id: cart.id }
})

const order = result.order
```
