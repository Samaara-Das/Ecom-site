import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import type { Logger } from "@medusajs/framework/types"
import { VENDOR_MODULE } from "../../../../modules/vendor"
import type VendorModuleService from "../../../../modules/vendor/service"

/**
 * GET /store/vendors/:id
 * Get a single vendor by ID
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const logger = req.scope.resolve<Logger>("logger")
  const vendorId = req.params.id

  try {
    const vendorService = req.scope.resolve<VendorModuleService>(VENDOR_MODULE)

    const vendor = await vendorService.retrieveVendor(vendorId)

    if (!vendor) {
      return res.status(404).json({
        message: "Vendor not found",
      })
    }

    // Only return public vendor info for active vendors
    if (!["verified", "premium"].includes(vendor.status)) {
      return res.status(404).json({
        message: "Vendor not found",
      })
    }

    return res.json({
      vendor: {
        id: vendor.id,
        name: vendor.name,
        description: vendor.description,
        logo_url: vendor.logo_url,
        status: vendor.status,
        city: vendor.city,
        country_code: vendor.country_code,
      },
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`Failed to get vendor: ${errorMessage}`)
    return res.status(500).json({
      message: "Failed to retrieve vendor",
      error: errorMessage,
    })
  }
}
