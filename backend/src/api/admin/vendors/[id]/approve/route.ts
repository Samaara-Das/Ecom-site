import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import type { Logger } from "@medusajs/framework/types"
import { VENDOR_MODULE } from "../../../../../modules/vendor"
import type VendorModuleService from "../../../../../modules/vendor/service"

interface ApproveVendorBody {
  commission_rate?: number
}

/**
 * POST /admin/vendors/:id/approve
 * Approve a vendor application (set status to "verified")
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

    // Check if vendor is already approved
    if (existingVendor.status === "verified" || existingVendor.status === "premium") {
      return res.status(400).json({
        message: "Vendor is already approved",
        current_status: existingVendor.status,
      })
    }

    // Optional: set a custom commission rate during approval
    const { commission_rate } = (req.body || {}) as ApproveVendorBody
    const updateData: Record<string, unknown> = { status: "verified" }

    if (commission_rate !== undefined) {
      const rate = Number(commission_rate)
      if (isNaN(rate) || rate < 0 || rate > 1) {
        return res.status(400).json({
          message: "Commission rate must be a number between 0 and 1",
        })
      }
      updateData.commission_rate = rate
    }

    const vendor = await vendorService.updateVendors(
      { id: vendorId },
      updateData
    )

    logger.info(`Admin approved vendor: ${vendorId}`)

    // TODO: Send approval notification email to vendor

    return res.json({
      message: "Vendor approved successfully",
      vendor,
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`Failed to approve vendor ${vendorId}: ${errorMessage}`)
    return res.status(500).json({
      message: "Failed to approve vendor",
      error: errorMessage,
    })
  }
}
