import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import type { Logger } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { VENDOR_MODULE } from "../../../../../../modules/vendor"

/**
 * GET /store/vendors/me/products/:id
 * Get a single vendor product by ID
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const logger = req.scope.resolve<Logger>("logger")
  const email = req.query.email as string
  const productId = req.params.id

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
        message: "Vendor not found for this email",
      })
    }

    const productService = req.scope.resolve(Modules.PRODUCT)
    const product = await productService.retrieveProduct(productId, {
      relations: ["variants", "variants.prices", "images", "categories"],
    })

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      })
    }

    // Verify product belongs to this vendor
    if (product.metadata?.vendor_id !== vendor.id) {
      return res.status(403).json({
        message: "You do not have permission to view this product",
      })
    }

    return res.json({
      product: {
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
        metadata: product.metadata,
        created_at: product.created_at,
        updated_at: product.updated_at,
      },
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`Failed to get vendor product: ${errorMessage}`)
    return res.status(500).json({
      message: "Failed to retrieve product",
      error: errorMessage,
    })
  }
}

interface UpdateProductBody {
  title?: string
  subtitle?: string
  description?: string
  handle?: string
  status?: "draft" | "published"
  thumbnail?: string
  images?: { url: string }[]
  categories?: { id: string }[]
}

/**
 * PATCH /store/vendors/me/products/:id
 * Update a vendor product
 */
export async function PATCH(
  req: MedusaRequest<UpdateProductBody>,
  res: MedusaResponse
) {
  const logger = req.scope.resolve<Logger>("logger")
  const email = req.query.email as string
  const productId = req.params.id

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
        message: "Vendor not found for this email",
      })
    }

    const productService = req.scope.resolve(Modules.PRODUCT)
    const existingProduct = await productService.retrieveProduct(productId)

    if (!existingProduct) {
      return res.status(404).json({
        message: "Product not found",
      })
    }

    // Verify product belongs to this vendor
    if (existingProduct.metadata?.vendor_id !== vendor.id) {
      return res.status(403).json({
        message: "You do not have permission to update this product",
      })
    }

    const {
      title,
      subtitle,
      description,
      handle,
      status,
      thumbnail,
      images,
      categories,
    } = req.body

    const updateData: Record<string, unknown> = {}
    if (title !== undefined) updateData.title = title
    if (subtitle !== undefined) updateData.subtitle = subtitle
    if (description !== undefined) updateData.description = description
    if (handle !== undefined) updateData.handle = handle
    if (status !== undefined) updateData.status = status
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail
    if (images !== undefined) updateData.images = images
    if (categories !== undefined) updateData.categories = categories

    const [updatedProduct] = await productService.updateProducts([
      {
        id: productId,
        ...updateData,
      },
    ])

    logger.info(`Vendor ${vendor.id} updated product: ${productId}`)

    return res.json({
      product: {
        id: updatedProduct.id,
        title: updatedProduct.title,
        handle: updatedProduct.handle,
        status: updatedProduct.status,
        updated_at: updatedProduct.updated_at,
      },
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`Failed to update vendor product: ${errorMessage}`)
    return res.status(500).json({
      message: "Failed to update product",
      error: errorMessage,
    })
  }
}

/**
 * DELETE /store/vendors/me/products/:id
 * Delete a vendor product
 */
export async function DELETE(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const logger = req.scope.resolve<Logger>("logger")
  const email = req.query.email as string
  const productId = req.params.id

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
        message: "Vendor not found for this email",
      })
    }

    const productService = req.scope.resolve(Modules.PRODUCT)
    const existingProduct = await productService.retrieveProduct(productId)

    if (!existingProduct) {
      return res.status(404).json({
        message: "Product not found",
      })
    }

    // Verify product belongs to this vendor
    if (existingProduct.metadata?.vendor_id !== vendor.id) {
      return res.status(403).json({
        message: "You do not have permission to delete this product",
      })
    }

    await productService.deleteProducts([productId])

    logger.info(`Vendor ${vendor.id} deleted product: ${productId}`)

    return res.status(200).json({
      id: productId,
      deleted: true,
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`Failed to delete vendor product: ${errorMessage}`)
    return res.status(500).json({
      message: "Failed to delete product",
      error: errorMessage,
    })
  }
}
