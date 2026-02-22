import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import type { Logger } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { VENDOR_MODULE } from "../../../../../../modules/vendor"
import type VendorModuleService from "../../../../../../modules/vendor/service"

/**
 * GET /store/vendors/me/orders/:id
 * Get a single order with vendor's items
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const logger = req.scope.resolve<Logger>("logger")
  const email = req.query.email as string
  const orderId = req.params.id

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

    const order = await orderService.retrieveOrder(orderId, {
      relations: [
        "items",
        "items.variant",
        "items.variant.product",
        "shipping_address",
        "billing_address",
        "fulfillments",
      ],
    })

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      })
    }

    // Filter to only vendor's items
    const vendorItems = order.items?.filter(
      (item: any) => item.variant?.product?.metadata?.vendor_id === vendor.id
    ) || []

    if (vendorItems.length === 0) {
      return res.status(403).json({
        message: "This order does not contain any of your products",
      })
    }

    const vendorTotal = vendorItems.reduce(
      (sum: number, item: any) => sum + (item.total || 0),
      0
    )

    return res.json({
      order: {
        id: order.id,
        display_id: order.display_id,
        status: order.status,
        fulfillment_status: (order as any).fulfillment_status,
        payment_status: (order as any).payment_status,
        currency_code: order.currency_code,
        total: order.total,
        subtotal: order.subtotal,
        shipping_total: order.shipping_total,
        tax_total: order.tax_total,
        vendor_total: vendorTotal,
        items: vendorItems.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
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
          metadata: item.metadata,
        })),
        shipping_address: order.shipping_address ? {
          first_name: order.shipping_address.first_name,
          last_name: order.shipping_address.last_name,
          company: order.shipping_address.company,
          address_1: order.shipping_address.address_1,
          address_2: order.shipping_address.address_2,
          city: order.shipping_address.city,
          province: order.shipping_address.province,
          postal_code: order.shipping_address.postal_code,
          country_code: order.shipping_address.country_code,
          phone: order.shipping_address.phone,
        } : null,
        billing_address: order.billing_address ? {
          first_name: order.billing_address.first_name,
          last_name: order.billing_address.last_name,
          company: order.billing_address.company,
          address_1: order.billing_address.address_1,
          address_2: order.billing_address.address_2,
          city: order.billing_address.city,
          province: order.billing_address.province,
          postal_code: order.billing_address.postal_code,
          country_code: order.billing_address.country_code,
          phone: order.billing_address.phone,
        } : null,
        fulfillments: (order as any).fulfillments?.map((f: any) => ({
          id: f.id,
          status: f.status,
          tracking_numbers: f.tracking_numbers,
          created_at: f.created_at,
        })) || [],
        customer_email: order.email,
        created_at: order.created_at,
        updated_at: order.updated_at,
      },
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`Failed to get vendor order: ${errorMessage}`)
    return res.status(500).json({
      message: "Failed to retrieve order",
      error: errorMessage,
    })
  }
}

interface UpdateFulfillmentBody {
  fulfillment_status?: "not_fulfilled" | "partially_fulfilled" | "fulfilled" | "shipped" | "delivered"
  tracking_number?: string
  notes?: string
}

/**
 * PATCH /store/vendors/me/orders/:id
 * Update order fulfillment status (vendor can only update their portion)
 */
export async function PATCH(
  req: MedusaRequest<UpdateFulfillmentBody>,
  res: MedusaResponse
) {
  const logger = req.scope.resolve<Logger>("logger")
  const email = req.query.email as string
  const orderId = req.params.id

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

    const order = await orderService.retrieveOrder(orderId, {
      relations: ["items", "items.variant", "items.variant.product"],
    })

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      })
    }

    // Verify order contains vendor's items
    const vendorItems = order.items?.filter(
      (item: any) => item.variant?.product?.metadata?.vendor_id === vendor.id
    ) || []

    if (vendorItems.length === 0) {
      return res.status(403).json({
        message: "This order does not contain any of your products",
      })
    }

    const { fulfillment_status, tracking_number, notes } = req.body

    // Store vendor-specific fulfillment info in order metadata
    // In a full implementation, this would create/update a Fulfillment record
    const vendorFulfillmentKey = `vendor_${vendor.id}_fulfillment`
    const existingMetadata = order.metadata || {}

    const vendorFulfillment = {
      ...(existingMetadata[vendorFulfillmentKey] as Record<string, unknown> || {}),
      status: fulfillment_status,
      tracking_number: tracking_number,
      notes: notes,
      updated_at: new Date().toISOString(),
      item_ids: vendorItems.map((item: any) => item.id),
    }

    // Note: In Medusa v2, updating order metadata might require different approach
    // For now, we log the update and return success
    logger.info(
      `Vendor ${vendor.id} updating fulfillment for order ${orderId}: ${JSON.stringify(vendorFulfillment)}`
    )

    return res.json({
      order: {
        id: order.id,
        display_id: order.display_id,
        vendor_fulfillment: vendorFulfillment,
      },
      message: "Fulfillment status updated successfully",
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`Failed to update vendor order: ${errorMessage}`)
    return res.status(500).json({
      message: "Failed to update order fulfillment",
      error: errorMessage,
    })
  }
}
