import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import type { Logger } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { VENDOR_MODULE } from "../../../../../modules/vendor"
import type VendorModuleService from "../../../../../modules/vendor/service"

/**
 * GET /store/vendors/me/orders
 * List orders containing vendor's products
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const logger = req.scope.resolve<Logger>("logger")
  const email = req.query.email as string
  const limit = parseInt(req.query.limit as string) || 20
  const offset = parseInt(req.query.offset as string) || 0

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

    const orderService = req.scope.resolve(Modules.ORDER)

    // Get all orders with items and product info
    const orders = await orderService.listOrders(
      {},
      {
        relations: [
          "items",
          "items.variant",
          "items.variant.product",
          "shipping_address",
          "billing_address",
        ],
        take: 100, // Get more orders to filter
        skip: 0,
        order: { created_at: "DESC" },
      }
    )

    // Filter orders that contain items from this vendor
    const vendorOrders = orders.filter((order: any) => {
      return order.items?.some(
        (item: any) => item.variant?.product?.metadata?.vendor_id === vendor.id
      )
    })

    // Apply pagination after filtering
    const paginatedOrders = vendorOrders.slice(offset, offset + limit)

    // Map orders to include only vendor's items and calculate vendor totals
    const mappedOrders = paginatedOrders.map((order: any) => {
      const vendorItems = order.items?.filter(
        (item: any) => item.variant?.product?.metadata?.vendor_id === vendor.id
      ) || []

      const vendorTotal = vendorItems.reduce(
        (sum: number, item: any) => sum + (item.total || 0),
        0
      )

      return {
        id: order.id,
        display_id: order.display_id,
        status: order.status,
        fulfillment_status: order.fulfillment_status,
        payment_status: order.payment_status,
        currency_code: order.currency_code,
        total: order.total,
        vendor_total: vendorTotal,
        vendor_items_count: vendorItems.length,
        items: vendorItems.map((item: any) => ({
          id: item.id,
          title: item.title,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total: item.total,
          thumbnail: item.thumbnail,
          variant: item.variant ? {
            id: item.variant.id,
            title: item.variant.title,
            sku: item.variant.sku,
            product: item.variant.product ? {
              id: item.variant.product.id,
              title: item.variant.product.title,
              handle: item.variant.product.handle,
            } : null,
          } : null,
        })),
        shipping_address: order.shipping_address ? {
          first_name: order.shipping_address.first_name,
          last_name: order.shipping_address.last_name,
          address_1: order.shipping_address.address_1,
          city: order.shipping_address.city,
          postal_code: order.shipping_address.postal_code,
          country_code: order.shipping_address.country_code,
          phone: order.shipping_address.phone,
        } : null,
        customer_email: order.email,
        created_at: order.created_at,
        updated_at: order.updated_at,
      }
    })

    return res.json({
      orders: mappedOrders,
      count: vendorOrders.length,
      offset,
      limit,
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`Failed to list vendor orders: ${errorMessage}`)
    return res.status(500).json({
      message: "Failed to retrieve vendor orders",
      error: errorMessage,
    })
  }
}
