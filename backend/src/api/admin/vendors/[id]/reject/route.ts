import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import type { Logger } from "@medusajs/framework/types"
import { VENDOR_MODULE } from "../../../../../modules/vendor"
import type VendorModuleService from "../../../../../modules/vendor/service"

interface RejectVendorBody {
  reason?: string
}

/**
 * POST /admin/vendors/:id/reject
 * Reject a vendor application (set status to "suspended")
 */
export async function POST(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const logger = req.scope.resolve<Logger>("logger")
  const vendorId = req.params.id

  try {
    const vendorService = req.scope.resolve<VendorModuleService>(VENDOR_MODULE)

    // Verify vendor exists
    const existingVendor = await vendorService.retrieveVendor(vendorId)
    if (!existingVendor) {
      return res.status(404).json({
        message: "Vendor not found",
      })
    }

    // Check if vendor is already rejected/suspended
    if (existingVendor.status === "suspended") {
      return res.status(400).json({
        message: "Vendor is already suspended",
        current_status: existingVendor.status,
      })
    }

    // Optional: record rejection reason
    const { reason } = (req.body || {}) as RejectVendorBody

    const [vendor] = await vendorService.updateVendors(
      { id: vendorId },
      { status: "suspended" }
    )

    logger.info(`Admin rejected vendor: ${vendorId} (${vendor.name})${reason ? ` - Reason: ${reason}` : ""}`)

    // TODO: Send rejection notification email to vendor with reason

    return res.json({
      message: "Vendor rejected successfully",
      vendor,
      reason: reason || null,
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`Failed to reject vendor ${vendorId}: ${errorMessage}`)
    return res.status(500).json({
      message: "Failed to reject vendor",
      error: errorMessage,
    })
  }
}
