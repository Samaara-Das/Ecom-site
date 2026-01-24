# Medusa Storefront Development

Build custom storefronts using the Medusa JS SDK with any frontend framework.

## Contents

- JS SDK Setup
- Authentication
- Products
- Cart Management
- Checkout Flow
- Customer Account
- Regions

## JS SDK Setup

### Installation

```bash
npm install @medusajs/js-sdk
```

### SDK Configuration

```typescript
// lib/sdk.ts
import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000",
  debug: process.env.NODE_ENV === "development",
})
```

### SDK with Authentication

```typescript
import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: "http://localhost:9000",
  auth: {
    type: "session",
  },
})
```

## Authentication

### Customer Login

```tsx
"use client" // Next.js 13+
import { useState } from "react"
import { sdk } from "@/lib/sdk"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return

    setLoading(true)

    try {
      const token = await sdk.auth.login("customer", "emailpass", {
        email,
        password,
      })

      if (typeof token !== "string") {
        alert("Authentication requires additional steps")
        return
      }

      // Subsequent requests are authenticated
      const { customer } = await sdk.store.customer.retrieve()
      console.log("Logged in:", customer)

    } catch (error) {
      alert(`Login failed: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  )
}
```

### Customer Registration

```tsx
const handleRegister = async () => {
  try {
    // First, register authentication
    const token = await sdk.auth.register("customer", "emailpass", {
      email,
      password,
    })

    // Then create customer profile
    const { customer } = await sdk.store.customer.create({
      email,
      first_name: firstName,
      last_name: lastName,
    })

    console.log("Registered:", customer)
  } catch (error) {
    console.error("Registration failed:", error)
  }
}
```

### Third-Party Authentication (Google)

```tsx
"use client"
import { useEffect, useMemo, useState } from "react"
import { decodeToken } from "react-jwt"
import { sdk } from "@/lib/sdk"
import { HttpTypes } from "@medusajs/types"

export default function GoogleCallback() {
  const [customer, setCustomer] = useState<HttpTypes.StoreCustomer>()

  const queryParams = useMemo(() => {
    const searchParams = new URLSearchParams(window.location.search)
    return Object.fromEntries(searchParams.entries())
  }, [])

  useEffect(() => {
    const validateCallback = async () => {
      // Send callback to Medusa
      const token = await sdk.auth.callback(
        "customer",
        "google",
        queryParams
      )

      // Check if customer needs to be created
      const decoded = decodeToken(token) as { actor_id: string }
      if (decoded.actor_id === "") {
        await sdk.store.customer.create({
          email: "from-google@example.com",
        })
        await sdk.auth.refresh()
      }

      // Retrieve customer
      const { customer } = await sdk.store.customer.retrieve()
      setCustomer(customer)
    }

    validateCallback()
  }, [])

  return customer ? (
    <p>Welcome, {customer.email}</p>
  ) : (
    <p>Loading...</p>
  )
}
```

### Logout

```tsx
const handleLogout = async () => {
  await sdk.auth.logout()
  // Redirect to home or login page
}
```

## Products

### List Products

```tsx
const { products } = await sdk.store.product.list({
  limit: 10,
  offset: 0,
})
```

### List with Filters

```tsx
const { products } = await sdk.store.product.list({
  category_id: ["cat_123"],
  collection_id: ["col_456"],
  q: "shirt", // Search query
})
```

### Retrieve Single Product

```tsx
const { product } = await sdk.store.product.retrieve("prod_123", {
  fields: "+variants.prices",
})
```

### Product with Pricing

```tsx
const { products } = await sdk.store.product.list({
  region_id: "reg_123",
  fields: "+variants.calculated_price",
})

// Access calculated price
products.forEach((product) => {
  product.variants.forEach((variant) => {
    console.log(variant.calculated_price?.calculated_amount)
  })
})
```

### Product Categories

```tsx
const { product_categories } = await sdk.store.productCategory.list({
  include_descendants_tree: true,
})
```

## Cart Management

### Create Cart

```tsx
"use client"
import { useEffect, useState } from "react"
import { sdk } from "@/lib/sdk"
import { HttpTypes } from "@medusajs/types"

export default function CartProvider({ children }) {
  const [cart, setCart] = useState<HttpTypes.StoreCart>()

  useEffect(() => {
    const initCart = async () => {
      const cartId = localStorage.getItem("cart_id")

      if (cartId) {
        // Retrieve existing cart
        const { cart } = await sdk.store.cart.retrieve(cartId)
        setCart(cart)
      } else {
        // Create new cart
        const { cart } = await sdk.store.cart.create({
          region_id: "reg_123",
        })
        localStorage.setItem("cart_id", cart.id)
        setCart(cart)
      }
    }

    initCart()
  }, [])

  return children
}
```

### Add Item to Cart

```tsx
const addToCart = async (variantId: string, quantity: number) => {
  const cartId = localStorage.getItem("cart_id")

  const { cart } = await sdk.store.cart.createLineItem(cartId, {
    variant_id: variantId,
    quantity,
  })

  setCart(cart)
}
```

### Update Line Item

```tsx
const updateQuantity = async (lineItemId: string, quantity: number) => {
  const cartId = localStorage.getItem("cart_id")

  const { cart } = await sdk.store.cart.updateLineItem(
    cartId,
    lineItemId,
    { quantity }
  )

  setCart(cart)
}
```

### Remove Line Item

```tsx
const removeItem = async (lineItemId: string) => {
  const cartId = localStorage.getItem("cart_id")

  const { cart } = await sdk.store.cart.deleteLineItem(cartId, lineItemId)
  setCart(cart)
}
```

### Display Cart Totals

```tsx
"use client"

export default function CartTotals({ cart }) {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: cart?.currency_code || "USD",
    }).format(amount)
  }

  return (
    <ul>
      <li>
        <span>Subtotal</span>
        <span>{formatPrice(cart?.subtotal ?? 0)}</span>
      </li>
      <li>
        <span>Discounts</span>
        <span>{formatPrice(cart?.discount_total ?? 0)}</span>
      </li>
      <li>
        <span>Shipping</span>
        <span>{formatPrice(cart?.shipping_total ?? 0)}</span>
      </li>
      <li>
        <span>Taxes</span>
        <span>{formatPrice(cart?.tax_total ?? 0)}</span>
      </li>
      <li>
        <strong>Total</strong>
        <strong>{formatPrice(cart?.total ?? 0)}</strong>
      </li>
    </ul>
  )
}
```

### Apply Promotion Code

```tsx
const applyPromoCode = async (code: string) => {
  const cartId = localStorage.getItem("cart_id")

  const { cart } = await sdk.store.cart.update(cartId, {
    promo_codes: [code],
  })

  setCart(cart)
}
```

## Checkout Flow

### 1. Set Customer Email

```tsx
await sdk.store.cart.update(cartId, {
  email: "customer@example.com",
})
```

### 2. Set Shipping Address

```tsx
await sdk.store.cart.update(cartId, {
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

### 3. Get Shipping Options

```tsx
const { shipping_options } = await sdk.store.fulfillment.listCartOptions({
  cart_id: cartId,
})

// Display options to customer
shipping_options.forEach((option) => {
  console.log(option.name, option.amount)
})
```

### 4. Calculate Shipping Price

```tsx
const { shipping_option } = await sdk.store.fulfillment.calculate(
  shippingOptionId,
  { cart_id: cartId }
)

console.log("Shipping cost:", shipping_option.calculated_price)
```

### 5. Add Shipping Method

```tsx
await sdk.store.cart.addShippingMethod(cartId, {
  option_id: shippingOptionId,
})
```

### 6. Initialize Payment

```tsx
// Get available payment providers
const cart = await sdk.store.cart.retrieve(cartId)
const paymentProviders = cart.payment_collection?.payment_providers

// Initialize payment session
await sdk.store.payment.initiatePaymentSession(cart, {
  provider_id: "stripe",
})
```

### 7. Complete Cart

```tsx
const { type, cart, order } = await sdk.store.cart.complete(cartId)

if (type === "order") {
  console.log("Order placed:", order.id)
  localStorage.removeItem("cart_id")
  // Redirect to order confirmation
} else {
  console.log("Checkout requires action:", cart)
}
```

## Customer Account

### Get Current Customer

```tsx
const { customer } = await sdk.store.customer.retrieve()
```

### Update Customer

```tsx
const { customer } = await sdk.store.customer.update({
  first_name: "Jane",
  last_name: "Smith",
  phone: "+1234567890",
})
```

### Customer Addresses

```tsx
// List addresses
const { addresses } = await sdk.store.customer.listAddresses()

// Add address
const { address } = await sdk.store.customer.createAddress({
  first_name: "John",
  last_name: "Doe",
  address_1: "123 Main St",
  city: "New York",
  country_code: "us",
  postal_code: "10001",
  is_default_shipping: true,
})

// Update address
await sdk.store.customer.updateAddress(addressId, {
  address_1: "456 Oak Ave",
})

// Delete address
await sdk.store.customer.deleteAddress(addressId)
```

### Order History

```tsx
const { orders } = await sdk.store.order.list({
  limit: 10,
  offset: 0,
})

// Get single order
const { order } = await sdk.store.order.retrieve(orderId)
```

## Regions

### List Regions

```tsx
const { regions } = await sdk.store.region.list()
```

### Retrieve Region

```tsx
const { region } = await sdk.store.region.retrieve("reg_123")

console.log(region.name)
console.log(region.currency_code)
console.log(region.countries)
```

### Update Cart Region

```tsx
// When customer changes region/country
await sdk.store.cart.update(cartId, {
  region_id: "reg_europe",
})
```

## Search

### Product Search

```tsx
const { products } = await sdk.store.product.list({
  q: "blue shirt",
  limit: 20,
})
```

## Collections

### List Collections

```tsx
const { collections } = await sdk.store.collection.list()
```

### Retrieve Collection

```tsx
const { collection } = await sdk.store.collection.retrieve("col_123")
```

### Products in Collection

```tsx
const { products } = await sdk.store.product.list({
  collection_id: ["col_123"],
})
```
