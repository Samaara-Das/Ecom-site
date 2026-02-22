/**
 * Seed script: 12 Kuwait Marketplace vendors (v2)
 * Idempotent — checks by email before creating.
 *
 * Run with: npx medusa exec ./src/scripts/seed-vendors-v2.ts
 */

import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { VENDOR_MODULE } from "../modules/vendor"
import type VendorModuleService from "../modules/vendor/service"

const VENDORS = [
  {
    name: "TechZone Kuwait",
    email: "info@techzone.kw",
    phone: "+96550001001",
    description:
      "Kuwait's premier consumer electronics destination, stocking the latest smartphones, laptops, and smart home devices. Serving Kuwait City shoppers since 2015 with warranty-backed products.",
    status: "premium" as const,
    business_registration: "CR-KW-201",
    city: "Kuwait City",
    postal_code: "13000",
    country_code: "kw",
    commission_rate: 0.10,
  },
  {
    name: "Al-Sayer Electronics",
    email: "sales@alsayer-electronics.kw",
    phone: "+96550001002",
    description:
      "Established electronics retailer in Salmiya offering competitive prices on branded TVs, audio equipment, and accessories. Authorised dealer for Samsung and Sony products.",
    status: "verified" as const,
    business_registration: "CR-KW-202",
    city: "Salmiya",
    postal_code: "22000",
    country_code: "kw",
    commission_rate: 0.12,
  },
  {
    name: "Moda Fashion Kuwait",
    email: "hello@moda-fashion.kw",
    phone: "+96550001003",
    description:
      "Premium fashion boutique in Hawalli specialising in contemporary women's and men's apparel. Curated collections from European and global designer labels delivered across Kuwait.",
    status: "premium" as const,
    business_registration: "CR-KW-203",
    city: "Hawalli",
    postal_code: "32000",
    country_code: "kw",
    commission_rate: 0.08,
  },
  {
    name: "Al-Shaya Fashion",
    email: "orders@alshaya-fashion.kw",
    phone: "+96550001004",
    description:
      "Multi-brand fashion retailer located at The Avenues carrying international brands including H&M, Zara, and Tommy Hilfiger. Fast delivery within Kuwait with easy returns.",
    status: "verified" as const,
    business_registration: "CR-KW-204",
    city: "The Avenues",
    postal_code: "32010",
    country_code: "kw",
    commission_rate: 0.09,
  },
  {
    name: "Glow Beauty Kuwait",
    email: "contact@glowbeauty.kw",
    phone: "+96550001005",
    description:
      "Salmiya-based beauty and skincare specialist carrying Charlotte Tilbury, La Mer, Fenty Beauty, and more. Expert beauty consultants available for personalised skincare advice.",
    status: "verified" as const,
    business_registration: "CR-KW-205",
    city: "Salmiya",
    postal_code: "22010",
    country_code: "kw",
    commission_rate: 0.14,
  },
  {
    name: "Oud & Rose Perfumery",
    email: "fragrance@oudandrose.kw",
    phone: "+96550001006",
    description:
      "Kuwait City's finest perfumery offering authentic Arabian oud blends alongside international luxury fragrances from Jo Malone, Armani, and Chanel. Custom blending available.",
    status: "verified" as const,
    business_registration: "CR-KW-206",
    city: "Kuwait City",
    postal_code: "13010",
    country_code: "kw",
    commission_rate: 0.12,
  },
  {
    name: "Tamr Dates & Specialty Foods",
    email: "info@tamrdates.kw",
    phone: "+96550001007",
    description:
      "Farwaniya-based gourmet food supplier specialising in premium Ajwa dates, Gulf spices, saffron, and specialty ingredients. Sourced directly from farms across the Arabian Gulf.",
    status: "verified" as const,
    business_registration: "CR-KW-207",
    city: "Farwaniya",
    postal_code: "42000",
    country_code: "kw",
    commission_rate: 0.15,
  },
  {
    name: "Kuwait Organic Market",
    email: "hello@kuwaitorganic.kw",
    phone: "+96550001008",
    description:
      "Mishref's leading organic grocery store offering certified organic produce, superfoods, and health supplements. Committed to sustainable sourcing and plastic-free packaging.",
    status: "verified" as const,
    business_registration: "CR-KW-208",
    city: "Mishref",
    postal_code: "52000",
    country_code: "kw",
    commission_rate: 0.15,
  },
  {
    name: "Hessa Home Goods",
    email: "sales@hessahome.kw",
    phone: "+96550001009",
    description:
      "Rumaithiya home goods store offering premium kitchen appliances, cookware, and home décor. Specialising in SMEG, KitchenAid, and Philips Hue smart home products.",
    status: "pending" as const,
    business_registration: "CR-KW-209",
    city: "Rumaithiya",
    postal_code: "45000",
    country_code: "kw",
    commission_rate: 0.16,
  },
  {
    name: "FitLife Kuwait",
    email: "training@fitlifekw.kw",
    phone: "+96550001010",
    description:
      "Sabah Al-Salem's premier sports and fitness equipment retailer carrying Garmin, Lululemon, and TRX training gear. Professional fitness consultants on hand to help choose the right equipment.",
    status: "verified" as const,
    business_registration: "CR-KW-210",
    city: "Sabah Al-Salem",
    postal_code: "63000",
    country_code: "kw",
    commission_rate: 0.13,
  },
  {
    name: "Little Stars Kids",
    email: "support@littlestars.kw",
    phone: "+96550001011",
    description:
      "Salwa children's store offering educational toys, LEGO sets, baby clothing, and nursery furniture. All products are safety-certified and age-appropriate for Kuwait's youngest shoppers.",
    status: "pending" as const,
    business_registration: "CR-KW-211",
    city: "Salwa",
    postal_code: "64000",
    country_code: "kw",
    commission_rate: 0.18,
  },
  {
    name: "AutoParts Gulf",
    email: "parts@autopartsgulf.kw",
    phone: "+96550001012",
    description:
      "Fahaheel-based automotive parts and accessories supplier serving Kuwait's car enthusiasts. Stocks OEM and aftermarket parts for Japanese, European, and American vehicles.",
    status: "suspended" as const,
    business_registration: "CR-KW-212",
    city: "Fahaheel",
    postal_code: "71000",
    country_code: "kw",
    commission_rate: 0.18,
  },
]

export default async function seedVendorsV2({
  container,
}: {
  container: any
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const vendorService = container.resolve(VENDOR_MODULE) as VendorModuleService

  logger.info("=== seed-vendors-v2: Starting ===")

  let created = 0
  let skipped = 0
  const vendorIds: string[] = []

  for (const data of VENDORS) {
    try {
      const existing = await vendorService.findVendorByEmail(data.email)

      if (existing) {
        logger.info(`  [SKIP] ${data.name} — already exists (${existing.id})`)
        vendorIds.push(existing.id)
        skipped++
        continue
      }

      const [vendor] = await vendorService.createVendors([data])
      logger.info(
        `  [OK]   ${vendor.name} (${vendor.id}) — ${data.status}, commission ${data.commission_rate * 100}%`
      )
      vendorIds.push(vendor.id)
      created++
    } catch (err) {
      logger.error(
        `  [ERR]  Failed to create ${data.name}: ${err instanceof Error ? err.message : err}`
      )
    }
  }

  logger.info(`=== seed-vendors-v2: Done — created ${created}, skipped ${skipped} ===`)
  return { created, skipped, vendorIds }
}
