"use server"

const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"

export interface Vendor {
  id: string
  name: string
  description: string | null
  email: string
  phone: string | null
  logo_url: string | null
  status: "pending" | "verified" | "premium" | "suspended"
  commission_rate: number
  business_registration: string | null
  address_line_1: string | null
  address_line_2: string | null
  city: string | null
  postal_code: string | null
  country_code: string
  created_at: string
  updated_at: string
}

export interface VendorProduct {
  id: string
  title: string
  subtitle: string | null
  description: string | null
  handle: string
  status: "draft" | "published"
  thumbnail: string | null
  images: { url: string }[]
  categories: { id: string; name: string }[]
  variants: {
    id: string
    title: string
    sku: string | null
    inventory_quantity: number
    prices: { amount: number; currency_code: string }[]
  }[]
  created_at: string
  updated_at: string
}

export interface VendorOrder {
  id: string
  display_id: number
  status: string
  fulfillment_status: string
  payment_status: string
  currency_code: string
  total: number
  vendor_total: number
  vendor_items_count: number
  items: {
    id: string
    title: string
    quantity: number
    unit_price: number
    total: number
    thumbnail: string | null
    variant: {
      id: string
      title: string
      sku: string | null
      product: {
        id: string
        title: string
        handle: string
      } | null
    } | null
  }[]
  shipping_address: {
    first_name: string
    last_name: string
    address_1: string
    city: string
    postal_code: string
    country_code: string
    phone: string | null
  } | null
  customer_email: string
  created_at: string
  updated_at: string
}

export interface VendorStats {
  products: {
    total: number
    published: number
    draft: number
  }
  orders: {
    total: number
    pending: number
    completed: number
  }
  revenue: {
    total: number
    commission: number
    commission_rate: number
    net: number
    currency_code: string
  }
  vendor: {
    id: string
    name: string
    status: string
    member_since: string
  }
}

/**
 * Get current vendor profile by email
 */
export async function getVendorByEmail(email: string): Promise<Vendor | null> {
  try {
    const response = await fetch(
      `${MEDUSA_BACKEND_URL}/store/vendors/me?email=${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    )

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error("Failed to fetch vendor")
    }

    const data = await response.json()
    return data.vendor
  } catch (error) {
    console.error("Error fetching vendor:", error)
    return null
  }
}

/**
 * Update vendor profile
 */
export async function updateVendorProfile(
  email: string,
  updates: Partial<Omit<Vendor, "id" | "email" | "status" | "commission_rate" | "created_at" | "updated_at">>
): Promise<{ success: boolean; vendor?: Vendor; error?: string }> {
  try {
    const response = await fetch(
      `${MEDUSA_BACKEND_URL}/store/vendors/me?email=${encodeURIComponent(email)}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return { success: false, error: data.message || "Failed to update profile" }
    }

    return { success: true, vendor: data.vendor }
  } catch (error) {
    return { success: false, error: "Network error" }
  }
}

/**
 * Get vendor dashboard statistics
 */
export async function getVendorStats(email: string): Promise<VendorStats | null> {
  try {
    const response = await fetch(
      `${MEDUSA_BACKEND_URL}/store/vendors/me/stats?email=${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    )

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.stats
  } catch (error) {
    console.error("Error fetching vendor stats:", error)
    return null
  }
}

/**
 * List vendor's products
 */
export async function listVendorProducts(
  email: string,
  options?: { limit?: number; offset?: number }
): Promise<{ products: VendorProduct[]; count: number } | null> {
  try {
    const params = new URLSearchParams()
    params.set("email", email)
    if (options?.limit) params.set("limit", options.limit.toString())
    if (options?.offset) params.set("offset", options.offset.toString())

    const response = await fetch(
      `${MEDUSA_BACKEND_URL}/store/vendors/me/products?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    )

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return { products: data.products, count: data.count }
  } catch (error) {
    console.error("Error fetching vendor products:", error)
    return null
  }
}

/**
 * Get a single vendor product
 */
export async function getVendorProduct(
  email: string,
  productId: string
): Promise<VendorProduct | null> {
  try {
    const response = await fetch(
      `${MEDUSA_BACKEND_URL}/store/vendors/me/products/${productId}?email=${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    )

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.product
  } catch (error) {
    console.error("Error fetching vendor product:", error)
    return null
  }
}

/**
 * Create a new product
 */
export async function createVendorProduct(
  email: string,
  product: {
    title: string
    subtitle?: string
    description?: string
    handle?: string
    status?: "draft" | "published"
    thumbnail?: string
    images?: { url: string }[]
    variants?: {
      title: string
      sku?: string
      prices?: { amount: number; currency_code: string }[]
    }[]
  }
): Promise<{ success: boolean; product?: { id: string }; error?: string }> {
  try {
    const response = await fetch(
      `${MEDUSA_BACKEND_URL}/store/vendors/me/products?email=${encodeURIComponent(email)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return { success: false, error: data.message || "Failed to create product" }
    }

    return { success: true, product: data.product }
  } catch (error) {
    return { success: false, error: "Network error" }
  }
}

/**
 * Update a product
 */
export async function updateVendorProduct(
  email: string,
  productId: string,
  updates: {
    title?: string
    subtitle?: string
    description?: string
    handle?: string
    status?: "draft" | "published"
    thumbnail?: string
    images?: { url: string }[]
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(
      `${MEDUSA_BACKEND_URL}/store/vendors/me/products/${productId}?email=${encodeURIComponent(email)}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return { success: false, error: data.message || "Failed to update product" }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: "Network error" }
  }
}

/**
 * Delete a product
 */
export async function deleteVendorProduct(
  email: string,
  productId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(
      `${MEDUSA_BACKEND_URL}/store/vendors/me/products/${productId}?email=${encodeURIComponent(email)}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    if (!response.ok) {
      const data = await response.json()
      return { success: false, error: data.message || "Failed to delete product" }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: "Network error" }
  }
}

/**
 * List vendor's orders
 */
export async function listVendorOrders(
  email: string,
  options?: { limit?: number; offset?: number }
): Promise<{ orders: VendorOrder[]; count: number } | null> {
  try {
    const params = new URLSearchParams()
    params.set("email", email)
    if (options?.limit) params.set("limit", options.limit.toString())
    if (options?.offset) params.set("offset", options.offset.toString())

    const response = await fetch(
      `${MEDUSA_BACKEND_URL}/store/vendors/me/orders?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    )

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return { orders: data.orders, count: data.count }
  } catch (error) {
    console.error("Error fetching vendor orders:", error)
    return null
  }
}

/**
 * Get a single vendor order
 */
export async function getVendorOrder(
  email: string,
  orderId: string
): Promise<VendorOrder | null> {
  try {
    const response = await fetch(
      `${MEDUSA_BACKEND_URL}/store/vendors/me/orders/${orderId}?email=${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    )

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.order
  } catch (error) {
    console.error("Error fetching vendor order:", error)
    return null
  }
}

/**
 * Update order fulfillment status
 */
export async function updateOrderFulfillment(
  email: string,
  orderId: string,
  updates: {
    fulfillment_status?: string
    tracking_number?: string
    notes?: string
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(
      `${MEDUSA_BACKEND_URL}/store/vendors/me/orders/${orderId}?email=${encodeURIComponent(email)}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return { success: false, error: data.message || "Failed to update fulfillment" }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: "Network error" }
  }
}
