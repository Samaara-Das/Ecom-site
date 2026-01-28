import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import type { Logger } from "@medusajs/framework/types"
import { VENDOR_MODULE } from "../../../../modules/vendor"
import type VendorModuleService from "../../../../modules/vendor/service"

/**
 * GET /store/vendors/me
 * Get current vendor profile by email (passed in query or header)
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

    return res.json({
      vendor: {
        id: vendor.id,
        name: vendor.name,
        description: vendor.description,
        email: vendor.email,
        phone: vendor.phone,
        logo_url: vendor.logo_url,
        status: vendor.status,
        commission_rate: vendor.commission_rate,
        business_registration: vendor.business_registration,
        address_line_1: vendor.address_line_1,
        address_line_2: vendor.address_line_2,
        city: vendor.city,
        postal_code: vendor.postal_code,
        country_code: vendor.country_code,
        created_at: vendor.created_at,
        updated_at: vendor.updated_at,
      },
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`Failed to get vendor profile: ${errorMessage}`)
    return res.status(500).json({
      message: "Failed to retrieve vendor profile",
      error: errorMessage,
    })
  }
}

interface VendorUpdateBody {
  name?: string
  description?: string
  phone?: string
  logo_url?: string
  address_line_1?: string
  address_line_2?: string
  city?: string
  postal_code?: string
}

/**
 * PATCH /store/vendors/me
 * Update current vendor profile
 */
export async function PATCH(
  req: MedusaRequest<VendorUpdateBody>,
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

    const {
      name,
      description,
      phone,
      logo_url,
      address_line_1,
      address_line_2,
      city,
      postal_code,
    } = req.body

    const updateData: Record<string, unknown> = {}
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (phone !== undefined) updateData.phone = phone
    if (logo_url !== undefined) updateData.logo_url = logo_url
    if (address_line_1 !== undefined) updateData.address_line_1 = address_line_1
    if (address_line_2 !== undefined) updateData.address_line_2 = address_line_2
    if (city !== undefined) updateData.city = city
    if (postal_code !== undefined) updateData.postal_code = postal_code

    const [updatedVendor] = await vendorService.updateVendors(
      { id: vendor.id },
      updateData
    )

    logger.info(`Vendor profile updated: ${vendor.id}`)

    return res.json({
      vendor: {
        id: updatedVendor.id,
        name: updatedVendor.name,
        description: updatedVendor.description,
        email: updatedVendor.email,
        phone: updatedVendor.phone,
        logo_url: updatedVendor.logo_url,
        status: updatedVendor.status,
        commission_rate: updatedVendor.commission_rate,
        address_line_1: updatedVendor.address_line_1,
        address_line_2: updatedVendor.address_line_2,
        city: updatedVendor.city,
        postal_code: updatedVendor.postal_code,
        country_code: updatedVendor.country_code,
      },
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`Failed to update vendor profile: ${errorMessage}`)
    return res.status(500).json({
      message: "Failed to update vendor profile",
      error: errorMessage,
    })
  }
}
