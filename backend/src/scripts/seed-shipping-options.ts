/**
 * Shipping Options Seeder Script
 *
 * Creates shipping options for the Kuwait Warehouse service zone.
 * This script addresses the admin UI bug where shipping option type field is disabled.
 *
 * Run with: npx medusa exec ./src/scripts/seed-shipping-options.ts
 */

import {
  ContainerRegistrationKeys,
  Modules,
  FulfillmentEvents,
} from "@medusajs/framework/utils"
import type { MedusaContainer } from "@medusajs/framework/types"
import type { Logger } from "@medusajs/framework/types"

export default async function seedShippingOptions(container: MedusaContainer) {
  const logger = container.resolve<Logger>(ContainerRegistrationKeys.LOGGER)
  const fulfillmentModule = container.resolve(Modules.FULFILLMENT)
  const stockLocationModule = container.resolve(Modules.STOCK_LOCATION)
  const regionModule = container.resolve(Modules.REGION)

  logger.info("Starting shipping options seed...")

  try {
    // 1. Find the Kuwait Warehouse stock location
    const stockLocations = await stockLocationModule.listStockLocations({
      name: "Kuwait Warehouse",
    })

    if (stockLocations.length === 0) {
      logger.error("Kuwait Warehouse stock location not found. Please create it first via admin panel.")
      return
    }

    const stockLocation = stockLocations[0]
    logger.info(`Found stock location: ${stockLocation.name} (${stockLocation.id})`)

    // 2. Find the fulfillment set for this location
    const fulfillmentSets = await fulfillmentModule.listFulfillmentSets({
      location_id: stockLocation.id,
      type: "shipping",
    })

    if (fulfillmentSets.length === 0) {
      logger.error("No fulfillment set found for shipping. Please enable shipping in admin panel first.")
      return
    }

    const fulfillmentSet = fulfillmentSets[0]
    logger.info(`Found fulfillment set: ${fulfillmentSet.id}`)

    // 3. Find the Kuwait Shipping Zone service zone
    const serviceZones = await fulfillmentModule.listServiceZones({
      fulfillment_set_id: fulfillmentSet.id,
    })

    if (serviceZones.length === 0) {
      logger.error("No service zone found. Please create one in admin panel first.")
      return
    }

    const serviceZone = serviceZones[0]
    logger.info(`Found service zone: ${serviceZone.name} (${serviceZone.id})`)

    // 4. Get shipping profiles
    const shippingProfiles = await fulfillmentModule.listShippingProfiles({})

    if (shippingProfiles.length === 0) {
      logger.error("No shipping profiles found.")
      return
    }

    const defaultProfile = shippingProfiles.find(p => p.name === "Default Shipping Profile") || shippingProfiles[0]
    logger.info(`Using shipping profile: ${defaultProfile.name} (${defaultProfile.id})`)

    // 5. Get the Manual fulfillment provider
    const fulfillmentProviders = await fulfillmentModule.listFulfillmentProviders({})
    const manualProvider = fulfillmentProviders.find(p => p.id.includes("manual"))

    if (!manualProvider) {
      logger.error("Manual fulfillment provider not found.")
      return
    }

    logger.info(`Using fulfillment provider: ${manualProvider.id}`)

    // 6. Check if shipping options already exist
    const existingOptions = await fulfillmentModule.listShippingOptions({
      service_zone_id: serviceZone.id,
    })

    if (existingOptions.length > 0) {
      logger.info(`Shipping options already exist (${existingOptions.length} found). Skipping creation.`)
      existingOptions.forEach(opt => {
        logger.info(`  - ${opt.name} (${opt.id})`)
      })
      return
    }

    // 7. Get the Kuwait region for pricing
    const regions = await regionModule.listRegions({
      name: "Kuwait",
    })

    const kuwaitRegion = regions.length > 0 ? regions[0] : null
    logger.info(kuwaitRegion ? `Found Kuwait region: ${kuwaitRegion.id}` : "Kuwait region not found, will use default pricing")

    // 8. Create shipping options
    const shippingOptionsData = [
      {
        name: "Standard Shipping",
        price_type: "flat",
        service_zone_id: serviceZone.id,
        shipping_profile_id: defaultProfile.id,
        provider_id: manualProvider.id,
        type: {
          label: "Standard",
          description: "Standard delivery within 3-5 business days",
          code: "standard",
        },
        data: {
          id: "manual-fulfillment",
        },
        rules: [],
        prices: [
          {
            amount: 500, // 5.00 KWD in minor units (fils)
            currency_code: "kwd",
          },
          {
            amount: 1500, // $15.00 USD
            currency_code: "usd",
          },
        ],
      },
      {
        name: "Express Shipping",
        price_type: "flat",
        service_zone_id: serviceZone.id,
        shipping_profile_id: defaultProfile.id,
        provider_id: manualProvider.id,
        type: {
          label: "Express",
          description: "Express delivery within 1-2 business days",
          code: "express",
        },
        data: {
          id: "manual-fulfillment",
        },
        rules: [],
        prices: [
          {
            amount: 1500, // 15.00 KWD
            currency_code: "kwd",
          },
          {
            amount: 3500, // $35.00 USD
            currency_code: "usd",
          },
        ],
      },
      {
        name: "Free Shipping (Orders over 50 KWD)",
        price_type: "flat",
        service_zone_id: serviceZone.id,
        shipping_profile_id: defaultProfile.id,
        provider_id: manualProvider.id,
        type: {
          label: "Free",
          description: "Free shipping for orders over 50 KWD",
          code: "free",
        },
        data: {
          id: "manual-fulfillment",
        },
        rules: [
          {
            attribute: "item_total",
            operator: "gte",
            value: "15000", // 50 KWD = 15000 fils (minimum for free shipping)
          },
        ],
        prices: [
          {
            amount: 0,
            currency_code: "kwd",
          },
          {
            amount: 0,
            currency_code: "usd",
          },
        ],
      },
    ]

    logger.info("Creating shipping options...")

    for (const optionData of shippingOptionsData) {
      try {
        const shippingOption = await fulfillmentModule.createShippingOptions(optionData)
        logger.info(`  ✓ Created: ${optionData.name} (${shippingOption.id})`)
      } catch (error) {
        logger.error(`  ✗ Failed to create ${optionData.name}: ${error instanceof Error ? error.message : error}`)
      }
    }

    logger.info("Shipping options seed completed!")

  } catch (error) {
    logger.error(`Seed failed: ${error instanceof Error ? error.message : error}`)
    throw error
  }
}
