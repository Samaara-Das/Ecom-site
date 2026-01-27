import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import type { Logger } from "@medusajs/framework/types"
import { VENDOR_MODULE } from "../../../modules/vendor"
import type VendorModuleService from "../../../modules/vendor/service"

interface VendorFilters {
  status?: string | string[]
  limit?: number
  offset?: number
}

type VendorStatus = "pending" | "verified" | "premium" | "suspended"

interface CreateVendorBody {
  name: string
  email: string
  phone?: string
  description?: string
  business_registration?: string
  commission_rate?: number
  status?: VendorStatus
  address_line_1?: string
  address_line_2?: string
  city?: string
  postal_code?: string
  country_code?: string
}

/**
 * GET /admin/vendors
 * List all vendors with optional filtering by status
 */
export async function GET(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const logger = req.scope.resolve<Logger>("logger")

  try {
    const vendorService = req.scope.resolve<VendorModuleService>(VENDOR_MODULE)

    const { status, limit = 50, offset = 0 } = req.query as VendorFilters

    // Build filters
    const filters: Record<string, unknown> = {}
    if (status) {
      filters.status = status
    }

    const [vendors, count] = await vendorService.listAndCountVendors(filters, {
      skip: Number(offset),
      take: Number(limit),
      order: { created_at: "DESC" },
    })

    return res.json({
      vendors,
      count,
      offset: Number(offset),
      limit: Number(limit),
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

/**
 * POST /admin/vendors
 * Create a new vendor (admin can create directly)
 */
export async function POST(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const logger = req.scope.resolve<Logger>("logger")

  try {
    const vendorService = req.scope.resolve<VendorModuleService>(VENDOR_MODULE)

    const {
      name,
      email,
      phone,
      description,
      business_registration,
      commission_rate,
      status,
      address_line_1,
      address_line_2,
      city,
      postal_code,
      country_code,
    } = req.body as CreateVendorBody

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

    const [vendor] = await vendorService.createVendors([
      {
        name,
        email,
        phone: phone || null,
        description: description || null,
        business_registration: business_registration || null,
        commission_rate: commission_rate ?? 0.15,
        status: status || "pending",
        address_line_1: address_line_1 || null,
        address_line_2: address_line_2 || null,
        city: city || null,
        postal_code: postal_code || null,
        country_code: country_code || "kw",
      },
    ])

    logger.info(`Admin created vendor: ${vendor.id} (${name})`)

    return res.status(201).json({ vendor })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`Failed to create vendor: ${errorMessage}`)
    return res.status(500).json({
      message: "Failed to create vendor",
      error: errorMessage,
    })
  }
}
