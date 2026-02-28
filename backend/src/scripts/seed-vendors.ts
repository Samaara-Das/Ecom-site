// @ts-nocheck
import { ExecArgs, Logger } from "@medusajs/framework/types"
import { VENDOR_MODULE } from "../modules/vendor"
import { Modules } from "@medusajs/framework/utils"
import type VendorModuleService from "../modules/vendor/service"

/**
 * Seed script for demo vendors
 * Run with: npx medusa exec ./src/scripts/seed-vendors.ts
 */
export default async function seedVendors({ container }: ExecArgs) {
  const logger = container.resolve<Logger>("logger")
  const vendorService = container.resolve<VendorModuleService>(VENDOR_MODULE)
  const linkService = container.resolve("link")
  const productService = container.resolve(Modules.PRODUCT)

  logger.info("Seeding demo vendors...")

  // Demo vendors for Kuwait Marketplace
  const vendorData: Array<{
    name: string
    email: string
    phone: string
    description: string
    status: "pending" | "verified" | "premium" | "suspended"
    business_registration: string
    city: string
    postal_code: string
    country_code: string
    commission_rate: number
  }> = [
    {
      name: "Ahmed's Electronics",
      email: "ahmed@electronics.kw",
      phone: "+96512345001",
      description: "Premium electronics and smartphones in Kuwait",
      status: "verified",
      business_registration: "CR-KW-001",
      city: "Kuwait City",
      postal_code: "12345",
      country_code: "kw",
      commission_rate: 0.12,
    },
    {
      name: "Sara's Fashion",
      email: "sara@fashion.kw",
      phone: "+96512345002",
      description: "Trendy fashion and accessories for all ages",
      status: "premium",
      business_registration: "CR-KW-002",
      city: "Salmiya",
      postal_code: "22000",
      country_code: "kw",
      commission_rate: 0.10,
    },
    {
      name: "Kuwait Home Goods",
      email: "info@homegoods.kw",
      phone: "+96512345003",
      description: "Quality home appliances and furniture",
      status: "verified",
      business_registration: "CR-KW-003",
      city: "Hawalli",
      postal_code: "32000",
      country_code: "kw",
      commission_rate: 0.15,
    },
    {
      name: "Fresh Market KW",
      email: "orders@freshmarket.kw",
      phone: "+96512345004",
      description: "Fresh groceries and local produce delivery",
      status: "pending",
      business_registration: "CR-KW-004",
      city: "Farwaniya",
      postal_code: "42000",
      country_code: "kw",
      commission_rate: 0.15,
    },
  ]

  const createdVendors = []

  for (const data of vendorData) {
    try {
      // Check if vendor already exists
      const existing = await vendorService.findVendorByEmail(data.email)
      if (existing) {
        logger.info(`Vendor already exists: ${data.name}`)
        createdVendors.push(existing)
        continue
      }

      const [vendor] = await vendorService.createVendors([data])
      logger.info(`Created vendor: ${vendor.name} (${vendor.id})`)
      createdVendors.push(vendor)
    } catch (error) {
      logger.error(`Failed to create vendor ${data.name}: ${error instanceof Error ? error.message : error}`)
    }
  }

  // Link some products to vendors
  try {
    const products = await productService.listProducts({}, { take: 10 })

    if (products.length > 0 && createdVendors.length > 0) {
      logger.info("Linking products to vendors...")

      // Distribute products among verified vendors
      const activeVendors = createdVendors.filter(v =>
        ["verified", "premium"].includes(v.status)
      )

      if (activeVendors.length > 0) {
        for (let i = 0; i < products.length; i++) {
          const product = products[i]
          const vendor = activeVendors[i % activeVendors.length]

          try {
            await linkService.create({
              [Modules.PRODUCT]: {
                product_id: product.id,
              },
              [VENDOR_MODULE]: {
                vendor_id: vendor.id,
              },
            })
            logger.info(`Linked product "${product.title}" to vendor "${vendor.name}"`)
          } catch (linkError) {
            // Link might already exist
            logger.warn(`Could not link product ${product.id}: ${linkError instanceof Error ? linkError.message : linkError}`)
          }
        }
      }
    }
  } catch (error) {
    logger.warn(`Could not link products to vendors: ${error instanceof Error ? error.message : error}`)
  }

  logger.info(`Seeding complete. Created ${createdVendors.length} vendors.`)
}
