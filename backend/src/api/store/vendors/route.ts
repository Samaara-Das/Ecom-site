import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import type { Logger } from "@medusajs/framework/types"
import { VENDOR_MODULE } from "../../../modules/vendor"
import type VendorModuleService from "../../../modules/vendor/service"

/**
 * GET /store/vendors
 * List all active (verified/premium) vendors in the marketplace
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const logger = req.scope.resolve<Logger>("logger")

  try {
    const vendorService = req.scope.resolve<VendorModuleService>(VENDOR_MODULE)

    // Get only active vendors (verified or premium status)
    const vendors = await vendorService.listActiveVendors()

    return res.json({
      vendors: vendors.map((vendor: any) => ({
        id: vendor.id,
        name: vendor.name,
        description: vendor.description,
        logo_url: vendor.logo_url,
        status: vendor.status,
      })),
      count: vendors.length,
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`Failed to list vendors: ${errorMessage}`)
    return res.status(500).json({
      message: "Failed to retrieve vendors",
      error: errorMessage,
    })
  }
}
