#!/usr/bin/env npx ts-node
// @ts-nocheck
/**
 * Cart API Verification Script (V-10)
 *
 * This script verifies that the Medusa cart API is functioning correctly.
 * Run this script when the Medusa backend is running.
 *
 * Usage:
 *   npx ts-node src/scripts/verify-cart-api.ts
 *   # or
 *   npm run verify:cart
 *
 * Prerequisites:
 *   - Medusa backend running on http://localhost:9000
 *   - At least one region configured in the database
 *
 * Verification Steps:
 *   1. POST /store/carts - Create a new cart
 *   2. GET /store/carts/:id - Retrieve the created cart
 *   3. Verify cart structure and fields
 */

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"

interface CartResponse {
  cart: {
    id: string
    region_id?: string
    currency_code: string
    customer_id?: string
    email?: string
    items: Array<{
      id: string
      variant_id: string
      quantity: number
      unit_price: number
      subtotal: number
      total: number
    }>
    shipping_methods: unknown[]
    shipping_address?: unknown
    billing_address?: unknown
    subtotal: number
    discount_total: number
    shipping_total: number
    tax_total: number
    total: number
    metadata?: Record<string, unknown>
    created_at: string
    updated_at: string
  }
}

interface VerificationResult {
  step: string
  passed: boolean
  message: string
  data?: unknown
}

const results: VerificationResult[] = []

function log(step: string, passed: boolean, message: string, data?: unknown) {
  const icon = passed ? "✓" : "✗"
  console.log(`  ${icon} ${step}: ${message}`)
  results.push({ step, passed, message, data })
}

async function createCart(): Promise<CartResponse | null> {
  console.log("\n1. POST /store/carts - Creating new cart...")

  try {
    const response = await fetch(`${BACKEND_URL}/store/carts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })

    const statusOk = response.status === 200 || response.status === 201
    log(
      "HTTP Status",
      statusOk,
      `Expected 200/201, got ${response.status}`
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.log(`    Error: ${errorText}`)
      return null
    }

    const data = (await response.json()) as CartResponse
    log("Response Structure", !!data.cart, data.cart ? "Cart object received" : "Missing cart object")

    return data
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    log("Request Failed", false, errorMessage)
    return null
  }
}

async function verifyCartCreation(cart: CartResponse["cart"]): Promise<boolean> {
  console.log("\n2. Verifying cart creation response...")

  // Check cart ID
  const hasValidId = Boolean(cart.id && cart.id.startsWith("cart_"))
  log("Cart ID", hasValidId, hasValidId ? `Valid ID: ${cart.id}` : "Missing or invalid cart ID")

  // Check required fields
  const hasItems = Array.isArray(cart.items)
  log("Items Array", hasItems, hasItems ? `Items count: ${cart.items.length}` : "Missing items array")

  // Check totals are numbers
  const hasSubtotal = typeof cart.subtotal === "number"
  log("Subtotal", hasSubtotal, hasSubtotal ? `Subtotal: ${cart.subtotal}` : "Missing subtotal")

  const hasTotal = typeof cart.total === "number"
  log("Total", hasTotal, hasTotal ? `Total: ${cart.total}` : "Missing total")

  // Check timestamps
  const hasCreatedAt = !!cart.created_at
  log("Created At", hasCreatedAt, hasCreatedAt ? `Created: ${cart.created_at}` : "Missing created_at")

  const hasUpdatedAt = !!cart.updated_at
  log("Updated At", hasUpdatedAt, hasUpdatedAt ? `Updated: ${cart.updated_at}` : "Missing updated_at")

  // Check currency
  const hasCurrency = !!cart.currency_code
  log("Currency Code", hasCurrency, hasCurrency ? `Currency: ${cart.currency_code}` : "Missing currency_code")

  return hasValidId && hasItems && hasSubtotal && hasTotal && hasCreatedAt && hasUpdatedAt
}

async function retrieveCart(cartId: string): Promise<CartResponse | null> {
  console.log(`\n3. GET /store/carts/${cartId} - Retrieving cart...`)

  try {
    const response = await fetch(`${BACKEND_URL}/store/carts/${cartId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    log("HTTP Status", response.status === 200, `Expected 200, got ${response.status}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.log(`    Error: ${errorText}`)
      return null
    }

    const data = (await response.json()) as CartResponse
    log("Response Structure", !!data.cart, data.cart ? "Cart object received" : "Missing cart object")

    return data
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    log("Request Failed", false, errorMessage)
    return null
  }
}

async function verifyCartPersistence(
  createdCart: CartResponse["cart"],
  retrievedCart: CartResponse["cart"]
): Promise<boolean> {
  console.log("\n4. Verifying cart persistence...")

  const idMatch = createdCart.id === retrievedCart.id
  log("Cart ID Match", idMatch, idMatch ? "IDs match" : `ID mismatch: ${createdCart.id} vs ${retrievedCart.id}`)

  const currencyMatch = createdCart.currency_code === retrievedCart.currency_code
  log(
    "Currency Match",
    currencyMatch,
    currencyMatch ? "Currencies match" : `Currency mismatch: ${createdCart.currency_code} vs ${retrievedCart.currency_code}`
  )

  const itemsMatch = createdCart.items.length === retrievedCart.items.length
  log(
    "Items Count Match",
    itemsMatch,
    itemsMatch ? "Item counts match" : `Item count mismatch: ${createdCart.items.length} vs ${retrievedCart.items.length}`
  )

  return idMatch && currencyMatch && itemsMatch
}

function printCartStructure(cart: CartResponse["cart"]) {
  console.log("\n5. Cart Structure:")
  console.log("─".repeat(50))
  console.log(JSON.stringify(cart, null, 2))
  console.log("─".repeat(50))
}

function printSummary() {
  console.log("\n" + "═".repeat(50))
  console.log("CART API VERIFICATION SUMMARY (V-10)")
  console.log("═".repeat(50))

  const passed = results.filter((r) => r.passed).length
  const failed = results.filter((r) => !r.passed).length
  const total = results.length

  console.log(`\nTotal checks: ${total}`)
  console.log(`Passed: ${passed}`)
  console.log(`Failed: ${failed}`)

  if (failed === 0) {
    console.log("\n✓ SUCCESS: All cart API verification checks passed!")
    console.log("\nThe cart API is functioning correctly:")
    console.log("  - Cart creation works (POST /store/carts)")
    console.log("  - Cart retrieval works (GET /store/carts/:id)")
    console.log("  - Cart persists correctly in the database")
  } else {
    console.log("\n✗ FAILURE: Some verification checks failed")
    console.log("\nFailed checks:")
    results
      .filter((r) => !r.passed)
      .forEach((r) => {
        console.log(`  - ${r.step}: ${r.message}`)
      })
  }

  console.log("\n" + "═".repeat(50))

  return failed === 0
}

async function main() {
  console.log("═".repeat(50))
  console.log("CART API VERIFICATION (V-10)")
  console.log("═".repeat(50))
  console.log(`\nBackend URL: ${BACKEND_URL}`)
  console.log("Starting verification...\n")

  // Step 1: Create cart
  const createResponse = await createCart()
  if (!createResponse) {
    console.log("\n✗ FATAL: Failed to create cart. Is the backend running?")
    console.log(`  Check if ${BACKEND_URL}/health is accessible.`)
    process.exit(1)
  }

  // Step 2: Verify creation response
  const creationValid = await verifyCartCreation(createResponse.cart)
  if (!creationValid) {
    console.log("\n✗ WARNING: Cart creation response has issues")
  }

  // Save cart_id from response
  const cartId = createResponse.cart.id
  console.log(`\n   Cart ID saved: ${cartId}`)

  // Step 3: Retrieve cart
  const retrieveResponse = await retrieveCart(cartId)
  if (!retrieveResponse) {
    console.log("\n✗ FATAL: Failed to retrieve cart")
    process.exit(1)
  }

  // Step 4: Verify persistence
  await verifyCartPersistence(createResponse.cart, retrieveResponse.cart)

  // Step 5: Print cart structure
  printCartStructure(retrieveResponse.cart)

  // Print summary
  const success = printSummary()
  process.exit(success ? 0 : 1)
}

// Run the verification
main().catch((error) => {
  console.error("Verification failed with error:", error)
  process.exit(1)
})
