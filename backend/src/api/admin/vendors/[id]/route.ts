import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import type { Logger } from "@medusajs/framework/types"
import { VENDOR_MODULE } from "../../../../modules/vendor"

/**
 * GET /admin/vendors/:id
 * Get a single vendor by ID with all details
 */
export async function GET(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const logger = req.scope.resolve<Logger>("logger")
  const vendorId = req.params.id

  try {
    const vendorService = req.scope.resolve(VENDOR_MODULE)

    const vendor = await vendorService.retrieveVendor(vendorId)

    if (!vendor) {
      return res.status(404).json({
        message: "Vendor not found",
      })
    }

    return res.json({ vendor })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`Failed to get vendor ${vendorId}: ${errorMessage}`)
    return res.status(500).json({
      message: "Failed to retrieve vendor",
      error: errorMessage,
    })
  }
}

/**
 * PATCH /admin/vendors/:id
 * Update vendor details (commission_rate, status, etc.)
 */
export async function PATCH(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const logger = req.scope.resolve<Logger>("logger")
  const vendorId = req.params.id

  try {
    const vendorService = req.scope.resolve(VENDOR_MODULE)

    // Verify vendor exists
    const existingVendor = await vendorService.retrieveVendor(vendorId)
    if (!existingVendor) {
      return res.status(404).json({
        message: "Vendor not found",
      })
    }

    const {
      name,
      description,
      phone,
      logo_url,
      status,
      commission_rate,
      business_registration,
      bank_account,
      address_line_1,
      address_line_2,
      city,
      postal_code,
      country_code,
    } = req.body

    // Build update data - only include fields that were provided
    const updateData: Record<string, unknown> = {}
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (phone !== undefined) updateData.phone = phone
    if (logo_url !== undefined) updateData.logo_url = logo_url
    if (status !== undefined) updateData.status = status
    if (commission_rate !== undefined) updateData.commission_rate = commission_rate
    if (business_registration !== undefined) updateData.business_registration = business_registration
    if (bank_account !== undefined) updateData.bank_account = bank_account
    if (address_line_1 !== undefined) updateData.address_line_1 = address_line_1
    if (address_line_2 !== undefined) updateData.address_line_2 = address_line_2
    if (city !== undefined) updateData.city = city
    if (postal_code !== undefined) updateData.postal_code = postal_code
    if (country_code !== undefined) updateData.country_code = country_code

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "No update fields provided",
      })
    }

    // Validate status if provided
    if (status !== undefined) {
      const validStatuses = ["pending", "verified", "premium", "suspended"]
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        })
      }
    }

    // Validate commission_rate if provided
    if (commission_rate !== undefined) {
      const rate = Number(commission_rate)
      if (isNaN(rate) || rate < 0 || rate > 1) {
        return res.status(400).json({
          message: "Commission rate must be a number between 0 and 1",
        })
      }
    }

    const [updatedVendor] = await vendorService.updateVendors(
      { id: vendorId },
      updateData
    )

    logger.info(`Admin updated vendor: ${vendorId}`)

    return res.json({ vendor: updatedVendor })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`Failed to update vendor ${vendorId}: ${errorMessage}`)
    return res.status(500).json({
      message: "Failed to update vendor",
      error: errorMessage,
    })
  }
}

/**
 * DELETE /admin/vendors/:id
 * Delete a vendor
 */
export async function DELETE(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const logger = req.scope.resolve<Logger>("logger")
  const vendorId = req.params.id

  try {
    const vendorService = req.scope.resolve(VENDOR_MODULE)

    // Verify vendor exists
    const existingVendor = await vendorService.retrieveVendor(vendorId)
    if (!existingVendor) {
      return res.status(404).json({
        message: "Vendor not found",
      })
    }

    await vendorService.deleteVendors([vendorId])

    logger.info(`Admin deleted vendor: ${vendorId}`)

    return res.status(200).json({
      id: vendorId,
      deleted: true,
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`Failed to delete vendor ${vendorId}: ${errorMessage}`)
    return res.status(500).json({
      message: "Failed to delete vendor",
      error: errorMessage,
    })
  }
}
