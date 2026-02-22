import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import type { Logger } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { VENDOR_MODULE } from "../../../../../modules/vendor"
import type VendorModuleService from "../../../../../modules/vendor/service"

/**
 * GET /store/vendors/me/products
 * List vendor's products
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

    // Get products linked to this vendor via metadata
    const productService = req.scope.resolve(Modules.PRODUCT)

    // List all products and filter by vendor_id in metadata
    const [products, count] = await productService.listAndCountProducts(
      {},
      {
        relations: ["variants", "variants.prices", "images", "categories"],
        take: limit,
        skip: offset,
        order: { created_at: "DESC" },
      }
    )

    // Filter products that belong to this vendor (via metadata.vendor_id)
    const vendorProducts = products.filter(
      (product: any) => product.metadata?.vendor_id === vendor.id
    )

    return res.json({
      products: vendorProducts.map((product: any) => ({
        id: product.id,
        title: product.title,
        subtitle: product.subtitle,
        description: product.description,
        handle: product.handle,
        status: product.status,
        thumbnail: product.thumbnail,
        images: product.images,
        categories: product.categories,
        variants: product.variants?.map((variant: any) => ({
          id: variant.id,
          title: variant.title,
          sku: variant.sku,
          inventory_quantity: variant.inventory_quantity,
          prices: variant.prices,
        })),
        created_at: product.created_at,
        updated_at: product.updated_at,
      })),
      count: vendorProducts.length,
      offset,
      limit,
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`Failed to list vendor products: ${errorMessage}`)
    return res.status(500).json({
      message: "Failed to retrieve vendor products",
      error: errorMessage,
    })
  }
}

interface CreateProductBody {
  title: string
  subtitle?: string
  description?: string
  handle?: string
  status?: "draft" | "published"
  thumbnail?: string
  images?: { url: string }[]
  categories?: { id: string }[]
  variants?: {
    title: string
    sku?: string
    prices?: { amount: number; currency_code: string }[]
    inventory_quantity?: number
    manage_inventory?: boolean
  }[]
}

/**
 * POST /store/vendors/me/products
 * Create a new product for the vendor
 */
export async function POST(
  req: MedusaRequest<CreateProductBody>,
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

    // Only verified/premium vendors can create products
    if (!["verified", "premium"].includes(vendor.status)) {
      return res.status(403).json({
        message: "Your vendor account must be verified to create products",
      })
    }

    const {
      title,
      subtitle,
      description,
      handle,
      status = "draft",
      thumbnail,
      images,
      categories,
      variants,
    } = req.body

    if (!title) {
      return res.status(400).json({
        message: "Product title is required",
      })
    }

    const productService = req.scope.resolve(Modules.PRODUCT)

    // Create product with vendor_id in metadata
    const [product] = await (productService as any).createProducts([
      {
        title,
        subtitle: subtitle || null,
        description: description || null,
        handle: handle || title.toLowerCase().replace(/\s+/g, "-"),
        status,
        thumbnail: thumbnail || null,
        images: images || [],
        categories: categories || [],
        metadata: {
          vendor_id: vendor.id,
          vendor_name: vendor.name,
        },
        variants: variants?.map((v) => ({
          title: v.title,
          sku: v.sku,
          prices: v.prices || [],
          manage_inventory: v.manage_inventory ?? true,
          options: {},
        })) || [
          {
            title: "Default",
            prices: [],
            manage_inventory: true,
            options: {},
          },
        ],
      },
    ])

    logger.info(`Vendor ${vendor.id} created product: ${product.id}`)

    return res.status(201).json({
      product: {
        id: product.id,
        title: product.title,
        handle: product.handle,
        status: product.status,
        created_at: product.created_at,
      },
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`Failed to create vendor product: ${errorMessage}`)
    return res.status(500).json({
      message: "Failed to create product",
      error: errorMessage,
    })
  }
}
