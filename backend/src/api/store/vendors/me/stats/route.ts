import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import type { Logger } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { VENDOR_MODULE } from "../../../../../modules/vendor"
import type VendorModuleService from "../../../../../modules/vendor/service"

/**
 * GET /store/vendors/me/stats
 * Get vendor dashboard statistics
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const logger = req.scope.resolve<Logger>("logger")
  const email = req.query.email as string

  try {
    if (!email) {
      return res.status(400).json({
        message: "Email query parameter is required",
      })
    }

    const vendorService = req.scope.resolve<VendorModuleService>(VENDOR_MODULE)
    const vendor = await vendorService.findVendorByEmail(email)

    if (!vendor) {
      return res.status(404).json({
        message: "Vendor not found for this email",
      })
    }

    const productService = req.scope.resolve(Modules.PRODUCT)
    const orderService = req.scope.resolve(Modules.ORDER)

    // Get vendor's products count
    const products = await productService.listProducts({}, {
      select: ["id", "status"],
    })
    const vendorProducts = products.filter(
      (p: any) => p.metadata?.vendor_id === vendor.id
    )

    const totalProducts = vendorProducts.length
    const publishedProducts = vendorProducts.filter(
      (p: any) => p.status === "published"
    ).length
    const draftProducts = vendorProducts.filter(
      (p: any) => p.status === "draft"
    ).length

    // Get orders containing vendor's products
    let totalOrders = 0
    let totalRevenue = 0
    let pendingOrders = 0
    let completedOrders = 0

    try {
      const orders = await orderService.listOrders(
        {},
        {
          relations: ["items", "items.variant", "items.variant.product"],
          take: 1000,
        }
      )

      // Filter and calculate stats for vendor's orders
      for (const order of orders) {
        const vendorItems = order.items?.filter(
          (item: any) => item.variant?.product?.metadata?.vendor_id === vendor.id
        ) || []

        if (vendorItems.length > 0) {
          totalOrders++

          // Calculate vendor's portion of revenue
          const orderVendorRevenue = vendorItems.reduce(
            (sum: number, item: any) => sum + (item.total || 0),
            0
          )
          totalRevenue += orderVendorRevenue

          // Track order status
          if (order.fulfillment_status === "fulfilled" || order.status === "completed") {
            completedOrders++
          } else if (order.status === "pending" || order.fulfillment_status === "not_fulfilled") {
            pendingOrders++
          }
        }
      }
    } catch (orderError) {
      logger.warn(`Could not fetch order stats: ${orderError}`)
    }

    // Calculate commission
    const commissionAmount = totalRevenue * vendor.commission_rate
    const netRevenue = totalRevenue - commissionAmount

    return res.json({
      stats: {
        products: {
          total: totalProducts,
          published: publishedProducts,
          draft: draftProducts,
        },
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          completed: completedOrders,
        },
        revenue: {
          total: totalRevenue,
          commission: commissionAmount,
          commission_rate: vendor.commission_rate,
          net: netRevenue,
          currency_code: "kwd", // Kuwait Dinar
        },
        vendor: {
          id: vendor.id,
          name: vendor.name,
          status: vendor.status,
          member_since: vendor.created_at,
        },
      },
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`Failed to get vendor stats: ${errorMessage}`)
    return res.status(500).json({
      message: "Failed to retrieve vendor statistics",
      error: errorMessage,
    })
  }
}
