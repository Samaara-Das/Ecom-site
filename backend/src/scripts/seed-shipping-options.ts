/**
 * Shipping Options Seeder Script
 *
 * Creates shipping options for the Kuwait Warehouse service zone.
 * This script addresses the admin UI bug where shipping option type field is disabled.
 *
 * Run with: npx medusa exec ./src/scripts/seed-shipping-options.ts
 */

import {
  Modules,
  ShippingOptionPriceType,
} from "@medusajs/framework/utils"
import type { MedusaContainer } from "@medusajs/framework/types"

export default async function seedShippingOptions({ container }: { container: MedusaContainer }) {
  console.log("=== Starting shipping options seed ===")

  const fulfillmentModule = container.resolve(Modules.FULFILLMENT)

  try {
    // Use hardcoded service zone ID from admin panel
    // This was discovered from: /app/settings/locations/sloc_01KFZS8B7T9RK62TBTZCWSPZ6B/fulfillment-set/fuset_01KFZSAPE05D3FHD1AYYZBTHMF/service-zone/serzo_01KFZSE4N7ZG3H194SVYV4M8WZ
    const SERVICE_ZONE_ID = "serzo_01KFZSE4N7ZG3H194SVYV4M8WZ"

    console.log(`Using service zone: ${SERVICE_ZONE_ID}`)

    // Get shipping profiles
    const shippingProfiles = await fulfillmentModule.listShippingProfiles({})
    console.log(`Found ${shippingProfiles.length} shipping profiles`)

    if (shippingProfiles.length === 0) {
      console.error("No shipping profiles found!")
      return
    }

    const defaultProfile = shippingProfiles[0]
    console.log(`Using shipping profile: ${defaultProfile.name} (${defaultProfile.id})`)

    // Get fulfillment providers
    const fulfillmentProviders = await fulfillmentModule.listFulfillmentProviders({})
    console.log(`Found ${fulfillmentProviders.length} fulfillment providers:`)
    fulfillmentProviders.forEach(p => console.log(`  - ${p.id}`))

    const manualProvider = fulfillmentProviders.find(p => p.id.includes("manual"))
    if (!manualProvider) {
      console.error("Manual fulfillment provider not found!")
      return
    }
    console.log(`Using provider: ${manualProvider.id}`)

    // Check existing shipping options
    const existingOptions = await fulfillmentModule.listShippingOptions({})
    console.log(`Found ${existingOptions.length} existing shipping options`)

    if (existingOptions.length > 0) {
      console.log("Existing shipping options:")
      existingOptions.forEach(opt => console.log(`  - ${opt.name} (${opt.id})`))
      console.log("Skipping creation - options already exist.")
      return
    }

    // Create Standard Shipping
    console.log("Creating Standard Shipping...")
    try {
      // Note: createShippingOptions expects data without prices - prices are set separately
      // Using type assertion to work around Medusa v2 type definition issues
      const standard = await (fulfillmentModule as any).createShippingOptions({
        name: "Standard Shipping",
        price_type: ShippingOptionPriceType.FLAT,
        service_zone_id: SERVICE_ZONE_ID,
        shipping_profile_id: defaultProfile.id,
        provider_id: manualProvider.id,
        type: {
          label: "Standard",
          description: "Standard delivery within 3-5 business days",
          code: "standard",
        },
      })
      console.log(`  ✓ Created Standard Shipping: ${standard.id}`)
    } catch (err: any) {
      console.error(`  ✗ Failed: ${err.message}`)
    }

    // Create Express Shipping
    console.log("Creating Express Shipping...")
    try {
      // Note: createShippingOptions expects data without prices - prices are set separately
      // Using type assertion to work around Medusa v2 type definition issues
      const express = await (fulfillmentModule as any).createShippingOptions({
        name: "Express Shipping",
        price_type: ShippingOptionPriceType.FLAT,
        service_zone_id: SERVICE_ZONE_ID,
        shipping_profile_id: defaultProfile.id,
        provider_id: manualProvider.id,
        type: {
          label: "Express",
          description: "Express delivery within 1-2 business days",
          code: "express",
        },
      })
      console.log(`  ✓ Created Express Shipping: ${express.id}`)
    } catch (err: any) {
      console.error(`  ✗ Failed: ${err.message}`)
    }

    console.log("=== Shipping options seed completed ===")

  } catch (error: any) {
    console.error(`Seed failed: ${error.message}`)
    console.error(error.stack)
    throw error
  }
}
