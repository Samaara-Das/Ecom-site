# Medusa Commerce Recipes

Common commerce patterns and use cases built with Medusa.

## Contents

- Marketplace
- Subscriptions
- B2B Commerce
- Digital Products
- Multi-Region Store
- Bundled Products
- POS (Point of Sale)
- Commerce Automation

## Marketplace

Build a multi-vendor marketplace with vendors managing their own products.

### Vendor Module

```typescript
// src/modules/vendor/models/vendor.ts
import { model } from "@medusajs/framework/utils"

const Vendor = model.define("vendor", {
  id: model.id().primaryKey(),
  name: model.text(),
  email: model.text(),
  commission_rate: model.number().default(10),
  is_active: model.boolean().default(true),
})

export default Vendor
```

### Link Vendor to Products

```typescript
// src/links/product-vendor.ts
import { defineLink } from "@medusajs/framework/utils"
import ProductModule from "@medusajs/medusa/product"
import VendorModule from "../modules/vendor"

export default defineLink(
  ProductModule.linkable.product,
  VendorModule.linkable.vendor
)
```

### Vendor Dashboard Widget

```tsx
// src/admin/widgets/vendor-products.tsx
import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Table } from "@medusajs/ui"

const VendorProductsWidget = ({ data }) => {
  return (
    <Container>
      <Heading level="h2">Vendor Information</Heading>
      <Table>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Vendor</Table.Cell>
            <Table.Cell>{data.vendor?.name || "N/A"}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Commission</Table.Cell>
            <Table.Cell>{data.vendor?.commission_rate}%</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default VendorProductsWidget
```

### Order Commission Calculation

```typescript
// src/subscribers/order-placed.ts
import type { SubscriberConfig, SubscriberArgs } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function calculateCommission({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const orderService = container.resolve(Modules.ORDER)
  const order = await orderService.retrieveOrder(event.data.id, {
    relations: ["items.variant.product.vendor"],
  })

  // Calculate commission per vendor
  const vendorCommissions = {}
  for (const item of order.items) {
    const vendor = item.variant?.product?.vendor
    if (vendor) {
      const commission = item.total * (vendor.commission_rate / 100)
      vendorCommissions[vendor.id] = (vendorCommissions[vendor.id] || 0) + commission
    }
  }

  // Store commissions...
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
```

## Subscriptions

Implement recurring billing for subscription products.

### Subscription Module

```typescript
// src/modules/subscription/models/subscription.ts
import { model } from "@medusajs/framework/utils"

const Subscription = model.define("subscription", {
  id: model.id().primaryKey(),
  customer_id: model.text(),
  product_id: model.text(),
  status: model.enum(["active", "paused", "canceled"]).default("active"),
  interval: model.enum(["monthly", "yearly"]),
  next_billing_date: model.dateTime(),
  created_at: model.dateTime(),
})

export default Subscription
```

### Subscription Workflow

```typescript
// src/workflows/process-subscription.ts
import { createStep, createWorkflow, StepResponse, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

const createSubscriptionOrderStep = createStep(
  "create-subscription-order",
  async ({ subscriptionId }, { container }) => {
    const subscriptionService = container.resolve("subscription")
    const subscription = await subscriptionService.retrieve(subscriptionId)

    const orderService = container.resolve(Modules.ORDER)
    const order = await orderService.createOrders({
      customer_id: subscription.customer_id,
      // ... order details
    })

    return new StepResponse(order, order.id)
  },
  async (orderId, { container }) => {
    const orderService = container.resolve(Modules.ORDER)
    await orderService.deleteOrders([orderId])
  }
)

const updateNextBillingStep = createStep(
  "update-next-billing",
  async ({ subscriptionId }, { container }) => {
    const subscriptionService = container.resolve("subscription")
    const subscription = await subscriptionService.retrieve(subscriptionId)

    const nextDate = new Date(subscription.next_billing_date)
    if (subscription.interval === "monthly") {
      nextDate.setMonth(nextDate.getMonth() + 1)
    } else {
      nextDate.setFullYear(nextDate.getFullYear() + 1)
    }

    await subscriptionService.update(subscriptionId, {
      next_billing_date: nextDate,
    })

    return new StepResponse({ nextDate })
  }
)

export const processSubscriptionWorkflow = createWorkflow(
  "process-subscription",
  (input: { subscriptionId: string }) => {
    const order = createSubscriptionOrderStep(input)
    updateNextBillingStep(input)
    return new WorkflowResponse(order)
  }
)
```

### Subscription Admin Page

```tsx
// src/admin/routes/subscriptions/page.tsx
import { Container, Heading, Table, Badge } from "@medusajs/ui"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "../../../lib/sdk"

const SubscriptionsPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: () => sdk.client.fetch("/admin/subscriptions"),
  })

  return (
    <Container>
      <Heading level="h1">Subscriptions</Heading>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Customer</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Next Billing</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data?.subscriptions?.map((sub) => (
            <Table.Row key={sub.id}>
              <Table.Cell>{sub.customer_id}</Table.Cell>
              <Table.Cell>
                <Badge color={sub.status === "active" ? "green" : "grey"}>
                  {sub.status}
                </Badge>
              </Table.Cell>
              <Table.Cell>{sub.next_billing_date}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Subscriptions",
})

export default SubscriptionsPage
```

## B2B Commerce

Business-to-business commerce with company accounts and tiered pricing.

### Company Module

```typescript
// src/modules/company/models/company.ts
import { model } from "@medusajs/framework/utils"

const Company = model.define("company", {
  id: model.id().primaryKey(),
  name: model.text(),
  tax_id: model.text().nullable(),
  credit_limit: model.number().default(0),
  payment_terms: model.number().default(30), // Days
})

export default Company
```

### Link Company to Customer

```typescript
// src/links/customer-company.ts
import { defineLink } from "@medusajs/framework/utils"
import CustomerModule from "@medusajs/medusa/customer"
import CompanyModule from "../modules/company"

export default defineLink(
  CustomerModule.linkable.customer,
  CompanyModule.linkable.company
)
```

### B2B Pricing Rules

```typescript
// Set up company-specific pricing
const priceSet = await pricingService.createPriceSets({
  prices: [
    // Retail price
    { amount: 10000, currency_code: "usd" },
    // Wholesale price for Company A
    {
      amount: 7500,
      currency_code: "usd",
      rules: { "company.id": "company_a" },
    },
    // Wholesale price for Company B (larger discount)
    {
      amount: 6000,
      currency_code: "usd",
      rules: { "company.id": "company_b" },
    },
  ],
})
```

### Quote Request Workflow

```typescript
// src/workflows/create-quote.ts
import { createWorkflow, createStep, StepResponse, WorkflowResponse } from "@medusajs/framework/workflows-sdk"

const createQuoteStep = createStep(
  "create-quote",
  async ({ companyId, items, notes }, { container }) => {
    const quoteService = container.resolve("quote")

    const quote = await quoteService.create({
      company_id: companyId,
      items,
      notes,
      status: "pending",
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    })

    return new StepResponse(quote)
  }
)

export const createQuoteWorkflow = createWorkflow(
  "create-quote",
  (input) => {
    const quote = createQuoteStep(input)
    return new WorkflowResponse(quote)
  }
)
```

## Digital Products

Sell downloadable products with custom fulfillment.

### Digital Product Module

```typescript
// src/modules/digital-product/models/digital-product.ts
import { model } from "@medusajs/framework/utils"

const DigitalProduct = model.define("digital_product", {
  id: model.id().primaryKey(),
  product_id: model.text(),
  file_url: model.text(),
  download_limit: model.number().nullable(),
  expiry_days: model.number().nullable(),
})

export default DigitalProduct
```

### Download Link Generation

```typescript
// src/api/store/downloads/[id]/route.ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import crypto from "crypto"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const customerId = req.auth?.actor_id

  const digitalProductService = req.scope.resolve("digitalProduct")
  const downloadService = req.scope.resolve("download")

  // Verify purchase
  const purchase = await downloadService.verifyPurchase(id, customerId)
  if (!purchase) {
    return res.status(403).json({ message: "Not authorized" })
  }

  // Check download limits
  const downloads = await downloadService.getDownloadCount(id, customerId)
  if (purchase.download_limit && downloads >= purchase.download_limit) {
    return res.status(403).json({ message: "Download limit reached" })
  }

  // Generate signed URL
  const token = crypto.randomBytes(32).toString("hex")
  const signedUrl = await digitalProductService.generateSignedUrl(id, token)

  // Record download
  await downloadService.recordDownload(id, customerId)

  res.json({ download_url: signedUrl })
}
```

### Digital Fulfillment Provider

```typescript
// src/modules/digital-fulfillment/service.ts
import { AbstractFulfillmentProviderService } from "@medusajs/framework/utils"

class DigitalFulfillmentService extends AbstractFulfillmentProviderService {
  async createFulfillment(data, items, order, fulfillment) {
    // Send download links to customer
    const downloads = []
    for (const item of items) {
      const digitalProduct = await this.getDigitalProduct(item.variant_id)
      if (digitalProduct) {
        downloads.push({
          item_id: item.id,
          download_url: await this.generateDownloadLink(digitalProduct),
        })
      }
    }

    return { downloads }
  }

  async cancelFulfillment(data) {
    // Revoke download access
  }
}

export default DigitalFulfillmentService
```

## Multi-Region Store

Support multiple countries with region-specific settings.

### Region Configuration

```typescript
// Create regions
const usRegion = await regionService.createRegions({
  name: "United States",
  currency_code: "usd",
  countries: ["us"],
  tax_rate: 0,
  payment_providers: ["stripe"],
})

const euRegion = await regionService.createRegions({
  name: "Europe",
  currency_code: "eur",
  countries: ["de", "fr", "it", "es", "nl"],
  tax_rate: 20,
  payment_providers: ["stripe"],
})
```

### Region-Based Pricing

```typescript
const priceSet = await pricingService.createPriceSets({
  prices: [
    { amount: 5000, currency_code: "usd", rules: { region_id: usRegion.id } },
    { amount: 4500, currency_code: "eur", rules: { region_id: euRegion.id } },
  ],
})
```

### Storefront Region Selector

```tsx
"use client"
import { useState, useEffect } from "react"
import { sdk } from "@/lib/sdk"

export default function RegionSelector() {
  const [regions, setRegions] = useState([])
  const [selectedRegion, setSelectedRegion] = useState(null)

  useEffect(() => {
    sdk.store.region.list().then(({ regions }) => {
      setRegions(regions)
      // Auto-select based on browser locale or stored preference
      const stored = localStorage.getItem("region_id")
      setSelectedRegion(stored || regions[0]?.id)
    })
  }, [])

  const handleRegionChange = async (regionId) => {
    setSelectedRegion(regionId)
    localStorage.setItem("region_id", regionId)

    // Update cart region if exists
    const cartId = localStorage.getItem("cart_id")
    if (cartId) {
      await sdk.store.cart.update(cartId, { region_id: regionId })
    }
  }

  return (
    <select
      value={selectedRegion || ""}
      onChange={(e) => handleRegionChange(e.target.value)}
    >
      {regions.map((region) => (
        <option key={region.id} value={region.id}>
          {region.name} ({region.currency_code.toUpperCase()})
        </option>
      ))}
    </select>
  )
}
```

## Bundled Products

Create product bundles and kits.

### Bundle Module

```typescript
// src/modules/bundle/models/bundle.ts
import { model } from "@medusajs/framework/utils"

const Bundle = model.define("bundle", {
  id: model.id().primaryKey(),
  title: model.text(),
  description: model.text().nullable(),
  discount_percentage: model.number().default(0),
})

const BundleItem = model.define("bundle_item", {
  id: model.id().primaryKey(),
  bundle_id: model.text(),
  product_id: model.text(),
  quantity: model.number().default(1),
})
```

### Add Bundle to Cart Workflow

```typescript
// src/workflows/add-bundle-to-cart.ts
import { createWorkflow, createStep, StepResponse, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

const addBundleItemsStep = createStep(
  "add-bundle-items",
  async ({ cartId, bundleId }, { container }) => {
    const bundleService = container.resolve("bundle")
    const cartService = container.resolve(Modules.CART)

    const bundle = await bundleService.retrieve(bundleId, {
      relations: ["items"],
    })

    const lineItems = []
    for (const item of bundle.items) {
      const { cart } = await cartService.addLineItems(cartId, [{
        variant_id: item.product_id,
        quantity: item.quantity,
        metadata: { bundle_id: bundleId },
      }])
      lineItems.push(cart.items[cart.items.length - 1])
    }

    return new StepResponse({ lineItems, bundle })
  }
)

export const addBundleToCartWorkflow = createWorkflow(
  "add-bundle-to-cart",
  (input: { cartId: string; bundleId: string }) => {
    const result = addBundleItemsStep(input)
    return new WorkflowResponse(result)
  }
)
```

## POS (Point of Sale)

Integrate in-store sales using Draft Orders.

### Create Draft Order for POS

```typescript
// src/api/admin/pos/orders/route.ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { items, customer_email, payment_method } = req.body

  const orderService = req.scope.resolve(Modules.ORDER)

  // Create order directly (no cart needed for POS)
  const order = await orderService.createOrders({
    region_id: req.body.region_id,
    currency_code: "usd",
    email: customer_email,
    items: items.map((item) => ({
      variant_id: item.variant_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
    })),
    metadata: {
      pos_terminal: req.body.terminal_id,
      sales_associate: req.auth?.actor_id,
    },
  })

  // Process payment immediately
  // ... payment processing logic

  res.json({ order })
}
```

## Commerce Automation

Automate workflows like ERP sync and inventory updates.

### Inventory Sync Subscriber

```typescript
// src/subscribers/sync-inventory.ts
import type { SubscriberConfig, SubscriberArgs } from "@medusajs/framework"

export default async function syncInventoryToERP({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const inventoryService = container.resolve("inventory")
  const erpService = container.resolve("erp") // Custom ERP integration

  const inventoryItem = await inventoryService.retrieve(event.data.id)

  // Sync to external ERP system
  await erpService.updateInventory({
    sku: inventoryItem.sku,
    quantity: inventoryItem.stocked_quantity,
  })
}

export const config: SubscriberConfig = {
  event: "inventory.updated",
}
```

### Scheduled Workflow (Price Updates)

```typescript
// src/jobs/update-prices.ts
import type { ScheduledJobConfig, ScheduledJobArgs } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function updatePricesJob({ container }: ScheduledJobArgs) {
  const pricingService = container.resolve(Modules.PRICING)
  const erpService = container.resolve("erp")

  // Fetch latest prices from ERP
  const erpPrices = await erpService.getPrices()

  // Update Medusa prices
  for (const price of erpPrices) {
    await pricingService.updatePrices({
      id: price.price_id,
      amount: price.amount,
    })
  }
}

export const config: ScheduledJobConfig = {
  name: "update-prices-from-erp",
  schedule: "0 */6 * * *", // Every 6 hours
}
```
