import { getLocaleHeader } from "@lib/util/get-locale-header"
import Medusa, { FetchArgs, FetchInput } from "@medusajs/js-sdk"
import {
  MOCK_CATEGORIES,
  MOCK_COLLECTIONS,
  MOCK_PRODUCTS,
  MOCK_REGIONS,
  MOCK_REGION,
  makeEmptyCart,
} from "./mock-data"

// Defaults to standard port for Medusa server
let MEDUSA_BACKEND_URL = "http://localhost:9000"

if (process.env.MEDUSA_BACKEND_URL) {
  MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL
}

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true"

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey:
    process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "pk_demo_mock",
})

const originalFetch = sdk.client.fetch.bind(sdk.client)

// ─── Mock router ────────────────────────────────────────────────────────────
// Intercepts every sdk.client.fetch call when NEXT_PUBLIC_USE_MOCK_DATA=true
// and returns local fixtures instead of HTTP-calling Medusa. The Medusa SDK's
// higher-level helpers (sdk.store.cart.*, sdk.store.product.*, etc.) all
// funnel through this same client.fetch, so this single interception covers
// the entire data layer for the demo build.

// In-memory cart store keyed by id (resets on each server cold-start, fine
// for a demo).
const mockCarts = new Map<string, ReturnType<typeof makeEmptyCart>>()

function pathOf(input: FetchInput): string {
  if (typeof input === "string") return input.split("?")[0] ?? input
  if (input instanceof URL) return input.pathname
  // Request
  try {
    return new URL((input as Request).url).pathname
  } catch {
    return String(input).split("?")[0] ?? String(input)
  }
}

function methodOf(init?: FetchArgs): string {
  return (init?.method ?? "GET").toUpperCase()
}

function ok<T>(value: T): T {
  return value
}

async function mockFetch<T>(
  input: FetchInput,
  init?: FetchArgs
): Promise<T> {
  const path = pathOf(input)
  const method = methodOf(init)

  // Regions
  if (path === "/store/regions") {
    return ok({ regions: MOCK_REGIONS, count: MOCK_REGIONS.length }) as T
  }
  if (path.match(/^\/store\/regions\/([^/]+)$/)) {
    return ok({ region: MOCK_REGION }) as T
  }

  // Collections
  if (path === "/store/collections") {
    return ok({
      collections: MOCK_COLLECTIONS,
      count: MOCK_COLLECTIONS.length,
    }) as T
  }
  const collectionMatch = path.match(/^\/store\/collections\/([^/]+)$/)
  if (collectionMatch) {
    const idOrHandle = collectionMatch[1]
    const col =
      MOCK_COLLECTIONS.find((c) => c.id === idOrHandle) ||
      MOCK_COLLECTIONS.find((c) => c.handle === idOrHandle) ||
      MOCK_COLLECTIONS[0]
    return ok({ collection: col }) as T
  }

  // Categories
  if (path === "/store/product-categories") {
    const handle = (init as any)?.query?.handle as string | undefined
    let cats = MOCK_CATEGORIES
    if (handle) cats = cats.filter((c) => c.handle === handle)
    return ok({
      product_categories: cats,
      count: cats.length,
    }) as T
  }
  const catMatch = path.match(/^\/store\/product-categories\/([^/]+)$/)
  if (catMatch) {
    const idOrHandle = catMatch[1]
    const cat =
      MOCK_CATEGORIES.find((c) => c.id === idOrHandle) ||
      MOCK_CATEGORIES.find((c) => c.handle === idOrHandle) ||
      MOCK_CATEGORIES[0]
    return ok({ product_category: cat }) as T
  }

  // Products
  if (path === "/store/products") {
    const q = (init as any)?.query ?? {}
    const handle = q.handle as string | undefined
    const id = q.id as string | string[] | undefined
    const categoryId = q.category_id as string | string[] | undefined
    const collectionId = q.collection_id as string | string[] | undefined
    const limit = Number(q.limit ?? 12)
    const offset = Number(q.offset ?? 0)

    let products = MOCK_PRODUCTS.slice()
    if (handle) products = products.filter((p) => p.handle === handle)
    if (id) {
      const ids = Array.isArray(id) ? id : [id]
      products = products.filter((p) => ids.includes(p.id))
    }
    if (categoryId) {
      const cats = Array.isArray(categoryId) ? categoryId : [categoryId]
      products = products.filter((p) =>
        (p.categories ?? []).some((c: any) => cats.includes(c.id))
      )
    }
    if (collectionId) {
      const cols = Array.isArray(collectionId) ? collectionId : [collectionId]
      products = products.filter((p) =>
        p.collection_id ? cols.includes(p.collection_id) : false
      )
    }
    const count = products.length
    const paged = products.slice(offset, offset + limit)
    return ok({ products: paged, count }) as T
  }
  const productMatch = path.match(/^\/store\/products\/([^/]+)$/)
  if (productMatch) {
    const idOrHandle = productMatch[1]
    const product =
      MOCK_PRODUCTS.find((p) => p.id === idOrHandle) ||
      MOCK_PRODUCTS.find((p) => p.handle === idOrHandle) ||
      MOCK_PRODUCTS[0]
    return ok({ product }) as T
  }

  // Carts
  if (path === "/store/carts" && method === "POST") {
    const id = `cart_demo_${Date.now()}`
    const cart = makeEmptyCart(id)
    mockCarts.set(id, cart)
    return ok({ cart }) as T
  }
  const cartIdMatch = path.match(/^\/store\/carts\/([^/]+)$/)
  if (cartIdMatch) {
    const id = cartIdMatch[1]
    const cart = mockCarts.get(id) || makeEmptyCart(id)
    mockCarts.set(id, cart)
    return ok({ cart }) as T
  }
  if (path.match(/^\/store\/carts\/[^/]+\/line-items/)) {
    const id = path.split("/")[3]
    const cart = mockCarts.get(id) || makeEmptyCart(id)
    return ok({ cart }) as T
  }
  if (
    path.match(
      /^\/store\/carts\/[^/]+\/(complete|customer|shipping-methods|promotions|payment-sessions)/
    )
  ) {
    const id = path.split("/")[3]
    const cart = mockCarts.get(id) || makeEmptyCart(id)
    return ok({ cart, type: "cart" }) as T
  }

  // Customer (no auth in demo)
  if (path === "/store/customers/me" || path.startsWith("/store/customers/me")) {
    return ok({ customer: null }) as T
  }
  if (path.startsWith("/auth/")) {
    return ok({ token: "demo_token" }) as T
  }

  // Orders
  if (path.startsWith("/store/orders")) {
    return ok({ orders: [], order: null, count: 0 }) as T
  }

  // Payment / shipping providers — return empty
  if (path === "/store/payment-providers") {
    return ok({ payment_providers: [], count: 0 }) as T
  }
  if (path.startsWith("/store/shipping-options")) {
    return ok({ shipping_options: [], count: 0 }) as T
  }

  // Default: empty object so .then() destructuring doesn't crash.
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.warn(`[mock-data] Unhandled path: ${method} ${path}`)
  }
  return ok({}) as T
}

sdk.client.fetch = async <T>(
  input: FetchInput,
  init?: FetchArgs
): Promise<T> => {
  if (USE_MOCK_DATA) {
    return mockFetch<T>(input, init)
  }

  const headers = init?.headers ?? {}
  let localeHeader: Record<string, string | null> | undefined
  try {
    localeHeader = await getLocaleHeader()
    headers["x-medusa-locale"] ??= localeHeader["x-medusa-locale"]
  } catch {}

  const newHeaders = {
    ...localeHeader,
    ...headers,
  }
  init = {
    ...init,
    headers: newHeaders,
  }
  return originalFetch(input, init)
}
