import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import type { Logger } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { VENDOR_MODULE } from "../../../../../modules/vendor"

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

interface GroupedCartResponse {
  cart_id: string
  vendor_groups: VendorGroup[]
  total_items: number
  subtotal: number
}

// Helper to convert BigNumberValue to number
function toNumber(value: unknown): number {
  if (typeof value === "number") return value
  if (typeof value === "string") return parseFloat(value) || 0
  if (value && typeof value === "object" && "value" in value) {
    return toNumber((value as { value: unknown }).value)
  }
  return 0
}

/**
 * GET /store/carts/:id/grouped
 * Returns cart items grouped by vendor for multi-vendor display
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const logger = req.scope.resolve<Logger>("logger")
  const cartId = req.params.id

  try {
    // Get cart service
    const cartService = req.scope.resolve(Modules.CART)
    let linkService: any = null

    try {
      linkService = req.scope.resolve("link")
    } catch {
      // Link service not available
    }

    // Retrieve cart with items
    const cart = await cartService.retrieveCart(cartId, {
      relations: ["items"],
    })

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      })
    }

    // Get vendor module service
    let vendorService: any = null
    try {
      vendorService = req.scope.resolve(VENDOR_MODULE)
    } catch {
      // Vendor module not available, group all under "Marketplace"
      logger.warn("Vendor module not available, using default grouping")
    }

    // Group items by vendor
    const vendorGroups: Map<string, VendorGroup> = new Map()
    const defaultVendorId = "marketplace"

    for (const item of cart.items || []) {
      let vendorId = defaultVendorId
      let vendorName = "Kuwait Marketplace"
      let vendorLogo: string | null = null

      // Get product_id from item (Medusa v2 cart items have product_id directly)
      const productId = (item as any).product_id

      // Try to get vendor from product link
      if (productId && linkService && vendorService) {
        try {
          // Query link to find vendor for this product
          const links = await linkService.list({
            [Modules.PRODUCT]: {
              product_id: productId,
            },
          })

          // Check if we got vendor link data
          const linkData = links?.[0]
          if (linkData) {
            const vendorLink = (linkData as any)?.[VENDOR_MODULE]
            if (vendorLink?.vendor_id) {
              const vendor = await vendorService.retrieveVendor(vendorLink.vendor_id)
              if (vendor) {
                vendorId = vendor.id
                vendorName = vendor.name
                vendorLogo = vendor.logo_url
              }
            }
          }
        } catch {
          // Link not found, use default vendor
        }
      }

      // Also check item metadata for vendor_id (set during add to cart)
      const itemMetadata = (item as any).metadata
      if (itemMetadata?.vendor_id) {
        vendorId = itemMetadata.vendor_id as string
        if (vendorService) {
          try {
            const vendor = await vendorService.retrieveVendor(vendorId)
            if (vendor) {
              vendorName = vendor.name
              vendorLogo = vendor.logo_url
            }
          } catch {
            // Vendor not found
          }
        }
      }

      // Get or create vendor group
      if (!vendorGroups.has(vendorId)) {
        vendorGroups.set(vendorId, {
          vendor_id: vendorId === defaultVendorId ? null : vendorId,
          vendor_name: vendorName,
          vendor_logo: vendorLogo,
          items: [],
          subtotal: 0,
          item_count: 0,
        })
      }

      const group = vendorGroups.get(vendorId)!

      // Convert BigNumberValue to numbers
      const unitPrice = toNumber(item.unit_price)
      const quantity = toNumber(item.quantity)
      const itemTotal = unitPrice * quantity

      const groupItem: VendorGroupItem = {
        id: item.id,
        title: item.title || "Unknown Item",
        variant_title: (item as any).variant_title,
        quantity: quantity,
        unit_price: unitPrice,
        total: itemTotal,
        thumbnail: item.thumbnail,
        product_id: productId,
      }

      group.items.push(groupItem)
      group.subtotal += itemTotal
      group.item_count += quantity
    }

    // Calculate totals
    let totalSubtotal = 0
    let totalItems = 0
    const groups = Array.from(vendorGroups.values())

    for (const group of groups) {
      totalSubtotal += group.subtotal
      totalItems += group.item_count
    }

    const response: GroupedCartResponse = {
      cart_id: cartId,
      vendor_groups: groups,
      total_items: totalItems,
      subtotal: totalSubtotal,
    }

    return res.json(response)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`Failed to get grouped cart: ${errorMessage}`)
    return res.status(500).json({
      message: "Failed to retrieve grouped cart",
      error: errorMessage,
    })
  }
}
