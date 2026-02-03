/**
 * Inventory Seeder Script
 *
 * Seeds inventory levels for existing products in the database.
 * This script creates inventory levels linking inventory items to stock locations,
 * making products purchasable (showing "In Stock" instead of "Out of stock").
 *
 * Run with: npm run seed:inventory
 * Or: npx medusa exec ./src/scripts/seed-inventory.ts
 *
 * This script is idempotent - it will skip items that already have inventory levels
 * at the target stock location.
 */

import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { createInventoryLevelsWorkflow } from "@medusajs/medusa/core-flows"

// Default stock quantity if not specified
const DEFAULT_STOCK_QUANTITY = 75

/**
 * Main seed function exported for Medusa CLI
 */
export default async function seedInventory({ container }: { container: any }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info("=".repeat(50))
  logger.info("Inventory Seeder")
  logger.info("=".repeat(50))

  try {
    // Get stock locations
    const { data: stockLocations } = await query.graph({
      entity: "stock_location",
      fields: ["id", "name"],
    })

    if (!stockLocations || stockLocations.length === 0) {
      logger.error("No stock locations found!")
      logger.error("Please create a stock location in the Medusa Admin panel first:")
      logger.error("  Admin > Settings > Locations > Add Location")
      return { success: false, error: "No stock locations found" }
    }

    const stockLocation = stockLocations[0]
    logger.info(`Using stock location: ${stockLocation.name} (${stockLocation.id})`)

    // Get all inventory items
    const { data: inventoryItems } = await query.graph({
      entity: "inventory_item",
      fields: ["id", "sku", "title"],
    })

    if (!inventoryItems || inventoryItems.length === 0) {
      logger.warn("No inventory items found!")
      logger.warn("This usually means no products have been created with manage_inventory=true")
      return { success: false, error: "No inventory items found" }
    }

    logger.info(`Found ${inventoryItems.length} inventory items`)

    // Get existing inventory levels to avoid duplicates
    const { data: existingLevels } = await query.graph({
      entity: "inventory_level",
      fields: ["id", "inventory_item_id", "location_id", "stocked_quantity"],
    })

    // Create a map of existing inventory_item_id + location_id combinations
    const existingLevelMap = new Map<string, number>()
    for (const level of existingLevels || []) {
      existingLevelMap.set(
        `${level.inventory_item_id}:${level.location_id}`,
        level.stocked_quantity
      )
    }

    logger.info(`Found ${existingLevels?.length || 0} existing inventory levels`)

    // Filter out items that already have levels at this location
    const itemsNeedingLevels = inventoryItems.filter(
      (item) => !existingLevelMap.has(`${item.id}:${stockLocation.id}`)
    )

    if (itemsNeedingLevels.length === 0) {
      logger.info("")
      logger.info("All inventory items already have stock levels at this location.")
      logger.info("No new inventory levels needed.")

      // Show summary of existing levels
      const existingAtLocation = inventoryItems.filter((item) =>
        existingLevelMap.has(`${item.id}:${stockLocation.id}`)
      )
      logger.info("")
      logger.info(`Summary of existing inventory (${existingAtLocation.length} items):`)
      existingAtLocation.slice(0, 5).forEach((item) => {
        const qty = existingLevelMap.get(`${item.id}:${stockLocation.id}`)
        logger.info(`  - ${item.sku || item.title || item.id}: ${qty} units`)
      })
      if (existingAtLocation.length > 5) {
        logger.info(`  ... and ${existingAtLocation.length - 5} more items`)
      }

      return { success: true, created: 0, existing: existingAtLocation.length }
    }

    // Build inventory levels data
    const inventoryLevels = itemsNeedingLevels.map((item) => ({
      inventory_item_id: item.id,
      location_id: stockLocation.id,
      stocked_quantity: DEFAULT_STOCK_QUANTITY,
    }))

    logger.info(`Creating ${inventoryLevels.length} new inventory levels...`)

    // Use the workflow to create inventory levels
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await createInventoryLevelsWorkflow(container).run({
      input: {
        inventory_levels: inventoryLevels,
      },
    } as any)

    logger.info("")
    logger.info(`✓ Successfully created ${inventoryLevels.length} inventory levels`)

    // Log some examples
    logger.info("")
    logger.info("Sample of created inventory levels:")
    inventoryLevels.slice(0, 5).forEach((level) => {
      const item = inventoryItems.find((i) => i.id === level.inventory_item_id)
      logger.info(
        `  - ${item?.sku || item?.title || level.inventory_item_id}: ${level.stocked_quantity} units`
      )
    })
    if (inventoryLevels.length > 5) {
      logger.info(`  ... and ${inventoryLevels.length - 5} more items`)
    }

    logger.info("")
    logger.info("=".repeat(50))
    logger.info("Inventory Seeding Complete!")
    logger.info("=".repeat(50))
    logger.info(`  Stock location: ${stockLocation.name}`)
    logger.info(`  New levels created: ${inventoryLevels.length}`)
    logger.info(`  Previously existing: ${(existingLevels?.length || 0)}`)
    logger.info(`  Default quantity: ${DEFAULT_STOCK_QUANTITY} units per item`)

    return {
      success: true,
      created: inventoryLevels.length,
      existing: existingLevels?.length || 0,
      stockLocation: stockLocation.name,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`Failed to seed inventory: ${errorMessage}`)
    if (error instanceof Error && error.stack) {
      logger.debug(error.stack)
    }
    return { success: false, error: errorMessage }
  }
}
