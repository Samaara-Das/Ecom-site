import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import type { Logger } from "@medusajs/framework/types"
import { VENDOR_MODULE } from "../../../../modules/vendor"

interface VendorApplicationBody {
  name: string
  email: string
  phone?: string
  description?: string
  business_registration?: string
  address_line_1?: string
  city?: string
  postal_code?: string
}

/**
 * POST /store/vendors/apply
 * Submit a vendor application to join the marketplace
 */
export async function POST(
  req: MedusaRequest<VendorApplicationBody>,
  res: MedusaResponse
) {
  const logger = req.scope.resolve<Logger>("logger")

  try {
    const vendorService = req.scope.resolve(VENDOR_MODULE)

    const {
      name,
      email,
      phone,
      description,
      business_registration,
      address_line_1,
      city,
      postal_code,
    } = req.body

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      })
    }

    // Check for existing vendor with same email
    const existingVendor = await vendorService.findVendorByEmail(email)
    if (existingVendor) {
      return res.status(409).json({
        message: "A vendor with this email already exists",
      })
    }

    // Create vendor with pending status
    const [vendor] = await vendorService.createVendors([
      {
        name,
        email,
        phone: phone || null,
        description: description || null,
        business_registration: business_registration || null,
        address_line_1: address_line_1 || null,
        city: city || null,
        postal_code: postal_code || null,
        country_code: "kw",
        status: "pending",
        commission_rate: 0.15, // Default 15% commission
      },
    ])

    logger.info(`New vendor application submitted: ${vendor.id} (${name})`)

    // TODO: Send notification to admin for approval
    // TODO: Send confirmation email to vendor

    return res.status(201).json({
      message: "Vendor application submitted successfully",
      vendor: {
        id: vendor.id,
        name: vendor.name,
        email: vendor.email,
        status: vendor.status,
      },
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`Vendor application failed: ${errorMessage}`)
    return res.status(500).json({
      message: "Failed to submit vendor application",
      error: errorMessage,
    })
  }
}

/**
 * GET /store/vendors/apply
 * Get vendor application status by email
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

    const vendorService = req.scope.resolve(VENDOR_MODULE)
    const vendor = await vendorService.findVendorByEmail(email)

    if (!vendor) {
      return res.status(404).json({
        message: "No vendor application found for this email",
      })
    }

    return res.json({
      vendor: {
        id: vendor.id,
        name: vendor.name,
        email: vendor.email,
        status: vendor.status,
        created_at: vendor.created_at,
      },
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`Failed to get vendor status: ${errorMessage}`)
    return res.status(500).json({
      message: "Failed to retrieve vendor status",
      error: errorMessage,
    })
  }
}
