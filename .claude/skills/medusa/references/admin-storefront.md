# Admin & Storefront Reference

Extending the admin dashboard and building storefront applications.

## Admin UI Extensions

### Admin Structure

```
src/admin/
├── routes/            # Custom pages
│   └── custom/
│       └── page.tsx   # /app/custom
├── widgets/           # Dashboard widgets
│   └── product-custom-widget.tsx
└── lib/               # Shared utilities
```

### Custom Admin Routes

```tsx
// src/admin/routes/custom/page.tsx
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text } from "@medusajs/ui"

const CustomPage = () => {
  return (
    <Container>
      <Heading level="h1">Custom Page</Heading>
      <Text>Your custom admin content here</Text>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Custom",
  icon: "BuildingStorefront" // Medusa UI icon name
})

export default CustomPage
```

### Admin Route with Data Fetching

```tsx
// src/admin/routes/custom-items/page.tsx
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { useQuery } from "@tanstack/react-query"
import { Container, Heading, Table, Badge } from "@medusajs/ui"
import { sdk } from "../lib/sdk"

const CustomItemsPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["custom-items"],
    queryFn: () => sdk.client.fetch("/admin/custom-items")
  })

  if (isLoading) return <div>Loading...</div>

  return (
    <Container>
      <Heading level="h1">Custom Items</Heading>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data?.items?.map((item) => (
            <Table.Row key={item.id}>
              <Table.Cell>{item.name}</Table.Cell>
              <Table.Cell>
                <Badge color={item.status === "active" ? "green" : "grey"}>
                  {item.status}
                </Badge>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Custom Items"
})

export default CustomItemsPage
```

### Nested Admin Routes

```tsx
// src/admin/routes/custom-items/[id]/page.tsx
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { Container, Heading } from "@medusajs/ui"

const CustomItemDetailPage = () => {
  const { id } = useParams()

  const { data: item } = useQuery({
    queryKey: ["custom-item", id],
    queryFn: () => sdk.client.fetch(`/admin/custom-items/${id}`)
  })

  return (
    <Container>
      <Heading level="h1">{item?.name}</Heading>
      {/* Item details */}
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Item Details"
})

export default CustomItemDetailPage
```

---

## Admin Widgets

### Widget Zones

Widgets inject content into existing admin pages:

```typescript
// Available zones
"product.details.before"
"product.details.after"
"product.details.side.before"
"product.details.side.after"
"order.details.before"
"order.details.after"
"customer.details.before"
"customer.details.after"
// ... and more
```

### Creating Widgets

```tsx
// src/admin/widgets/product-custom-widget.tsx
import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge } from "@medusajs/ui"
import { useQuery } from "@tanstack/react-query"

type ProductWidgetProps = {
  data: { id: string } // Product data from parent
}

const ProductCustomWidget = ({ data }: ProductWidgetProps) => {
  const { data: customData } = useQuery({
    queryKey: ["product-custom", data.id],
    queryFn: () => sdk.client.fetch(`/admin/products/${data.id}/custom-data`)
  })

  return (
    <Container>
      <Heading level="h2">Custom Data</Heading>
      {customData?.items?.map((item) => (
        <div key={item.id}>
          <Text>{item.name}</Text>
          <Badge>{item.status}</Badge>
        </div>
      ))}
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.side.after"
})

export default ProductCustomWidget
```

### Widget with Actions

```tsx
// src/admin/widgets/order-actions-widget.tsx
import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Button, usePrompt } from "@medusajs/ui"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const OrderActionsWidget = ({ data }) => {
  const prompt = usePrompt()
  const queryClient = useQueryClient()

  const { mutate: processOrder, isLoading } = useMutation({
    mutationFn: () => sdk.client.fetch(`/admin/orders/${data.id}/process`, {
      method: "POST"
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(["order", data.id])
    }
  })

  const handleProcess = async () => {
    const confirmed = await prompt({
      title: "Process Order",
      description: "Are you sure you want to process this order?"
    })

    if (confirmed) {
      processOrder()
    }
  }

  return (
    <Container>
      <Button onClick={handleProcess} isLoading={isLoading}>
        Process Order
      </Button>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "order.details.after"
})

export default OrderActionsWidget
```

---

## Medusa JS SDK

### Installation

```bash
npm install @medusajs/js-sdk
```

### SDK Setup

```typescript
// src/lib/medusa.ts
import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000",
  debug: process.env.NODE_ENV === "development"
})
```

### Store Operations

```typescript
// Products
const { products } = await sdk.store.product.list({
  limit: 20,
  offset: 0,
  fields: "+variants.prices"
})

const { product } = await sdk.store.product.retrieve(productId, {
  fields: "+variants,+variants.prices,+images"
})

// Regions
const { regions } = await sdk.store.region.list()

// Collections
const { collections } = await sdk.store.collection.list()

// Categories
const { product_categories } = await sdk.store.category.list({
  include_descendants_tree: true
})
```

### Cart Operations

```typescript
// Create cart
const { cart } = await sdk.store.cart.create({
  region_id: regionId
})

// Add item
const { cart } = await sdk.store.cart.createLineItem(cartId, {
  variant_id: variantId,
  quantity: 1
})

// Update item
const { cart } = await sdk.store.cart.updateLineItem(cartId, lineItemId, {
  quantity: 2
})

// Remove item
const { cart } = await sdk.store.cart.deleteLineItem(cartId, lineItemId)

// Update cart
const { cart } = await sdk.store.cart.update(cartId, {
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

// Add shipping method
const { cart } = await sdk.store.cart.addShippingMethod(cartId, {
  option_id: shippingOptionId
})

// Get shipping options
const { shipping_options } = await sdk.store.fulfillment.listCartOptions({
  cart_id: cartId
})

// Complete checkout
const { order } = await sdk.store.cart.complete(cartId)
```

### Customer Authentication

```typescript
// Register
const { customer } = await sdk.store.customer.create({
  email: "customer@example.com",
  password: "password123",
  first_name: "John",
  last_name: "Doe"
})

// Login
const { customer } = await sdk.auth.login("customer", "emailpass", {
  email: "customer@example.com",
  password: "password123"
})

// Get current customer
const { customer } = await sdk.store.customer.retrieve()

// Update customer
const { customer } = await sdk.store.customer.update({
  first_name: "Jane"
})

// Logout
await sdk.auth.logout()
```

### Customer Orders

```typescript
// List orders
const { orders } = await sdk.store.order.list({
  limit: 10,
  offset: 0
})

// Get order details
const { order } = await sdk.store.order.retrieve(orderId)
```

---

## Storefront Patterns

### React Query Integration

```tsx
// hooks/use-products.ts
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/medusa"

export function useProducts(params?: {
  limit?: number
  offset?: number
  category_id?: string
}) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => sdk.store.product.list({
      limit: params?.limit || 20,
      offset: params?.offset || 0,
      category_id: params?.category_id,
      fields: "+variants.prices"
    })
  })
}

export function useProduct(handle: string) {
  return useQuery({
    queryKey: ["product", handle],
    queryFn: async () => {
      const { products } = await sdk.store.product.list({
        handle,
        fields: "+variants,+variants.prices,+images,+options"
      })
      return products[0]
    },
    enabled: !!handle
  })
}
```

### Cart Context

```tsx
// context/cart-context.tsx
"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { sdk } from "@/lib/medusa"

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initCart = async () => {
      const cartId = localStorage.getItem("cart_id")

      if (cartId) {
        try {
          const { cart } = await sdk.store.cart.retrieve(cartId)
          setCart(cart)
        } catch {
          // Cart expired, create new one
          localStorage.removeItem("cart_id")
        }
      }

      setIsLoading(false)
    }

    initCart()
  }, [])

  const createCart = async (regionId: string) => {
    const { cart } = await sdk.store.cart.create({ region_id: regionId })
    localStorage.setItem("cart_id", cart.id)
    setCart(cart)
    return cart
  }

  const addItem = async (variantId: string, quantity: number) => {
    if (!cart) return

    const { cart: updated } = await sdk.store.cart.createLineItem(cart.id, {
      variant_id: variantId,
      quantity
    })
    setCart(updated)
  }

  const updateItem = async (lineItemId: string, quantity: number) => {
    if (!cart) return

    const { cart: updated } = await sdk.store.cart.updateLineItem(
      cart.id,
      lineItemId,
      { quantity }
    )
    setCart(updated)
  }

  const removeItem = async (lineItemId: string) => {
    if (!cart) return

    const { cart: updated } = await sdk.store.cart.deleteLineItem(
      cart.id,
      lineItemId
    )
    setCart(updated)
  }

  return (
    <CartContext.Provider value={{
      cart,
      isLoading,
      createCart,
      addItem,
      updateItem,
      removeItem
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
```

### Product Page Component

```tsx
// app/products/[handle]/page.tsx
import { sdk } from "@/lib/medusa"
import { ProductDetails } from "@/components/product-details"

export async function generateMetadata({ params }) {
  const { products } = await sdk.store.product.list({
    handle: params.handle
  })
  const product = products[0]

  return {
    title: product?.title,
    description: product?.description
  }
}

export default async function ProductPage({ params }) {
  const { products } = await sdk.store.product.list({
    handle: params.handle,
    fields: "+variants,+variants.prices,+images,+options"
  })

  const product = products[0]

  if (!product) {
    return <div>Product not found</div>
  }

  return <ProductDetails product={product} />
}
```

### Checkout Flow Component

```tsx
// components/checkout-form.tsx
"use client"

import { useState } from "react"
import { useCart } from "@/context/cart-context"
import { sdk } from "@/lib/medusa"

export function CheckoutForm() {
  const { cart } = useCart()
  const [step, setStep] = useState<"info" | "shipping" | "payment">("info")
  const [shippingOptions, setShippingOptions] = useState([])

  const handleInfoSubmit = async (data) => {
    await sdk.store.cart.update(cart.id, {
      email: data.email,
      shipping_address: data.address
    })

    // Fetch shipping options
    const { shipping_options } = await sdk.store.fulfillment.listCartOptions({
      cart_id: cart.id
    })
    setShippingOptions(shipping_options)
    setStep("shipping")
  }

  const handleShippingSelect = async (optionId: string) => {
    await sdk.store.cart.addShippingMethod(cart.id, {
      option_id: optionId
    })
    setStep("payment")
  }

  const handlePaymentComplete = async () => {
    const { order } = await sdk.store.cart.complete(cart.id)
    // Redirect to order confirmation
  }

  return (
    <div>
      {step === "info" && <InfoStep onSubmit={handleInfoSubmit} />}
      {step === "shipping" && (
        <ShippingStep
          options={shippingOptions}
          onSelect={handleShippingSelect}
        />
      )}
      {step === "payment" && (
        <PaymentStep onComplete={handlePaymentComplete} />
      )}
    </div>
  )
}
```

---

## Price Formatting

```typescript
// lib/format-price.ts
export function formatPrice(
  amount: number,
  currencyCode: string,
  locale = "en-US"
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode.toUpperCase()
  }).format(amount / 100) // Medusa stores prices in cents
}

// Usage
formatPrice(2500, "usd") // "$25.00"
formatPrice(2000, "eur", "de-DE") // "20,00 €"
```

### Get Variant Price

```typescript
function getVariantPrice(variant, regionId: string, currencyCode: string) {
  const price = variant.prices?.find(
    (p) => p.currency_code === currencyCode
  )

  if (!price) return null

  return {
    amount: price.calculated_amount || price.amount,
    original: price.original_amount,
    currency: price.currency_code
  }
}
```
