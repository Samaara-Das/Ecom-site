// @ts-nocheck
/**
 * Seed script: Ensure all product variants have inventory (50 units each)
 * Idempotent — updates existing levels, creates missing ones.
 *
 * Run with: cd backend && npx medusa exec ./src/scripts/seed-all-inventory.ts
 */

import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { createInventoryLevelsWorkflow } from "@medusajs/medusa/core-flows"

export default async function seedAllInventory({
  container,
}: {
  container: any
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const inventoryModule = container.resolve(Modules.INVENTORY)
  const stockLocationModule = container.resolve(Modules.STOCK_LOCATION)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info("=== seed-all-inventory: Starting ===")

  // ── 1. Find the stock location ──────────────────────────────────────────────
  const allLocations = await stockLocationModule.listStockLocations({})
  if (!allLocations.length) {
    logger.error(
      "No stock locations found. Create 'Kuwait Warehouse' in the admin panel first."
    )
    return
  }

  const location =
    allLocations.find(
      (l: any) => l.name === "Kuwait Warehouse" || l.name === "Main Warehouse"
    ) || allLocations[0]

  logger.info(`Using stock location: ${location.name} (${location.id})`)

  // ── 2. Get all inventory items ──────────────────────────────────────────────
  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id", "sku", "title"],
  })

  if (!inventoryItems?.length) {
    logger.warn("No inventory items found. Products may not have been created with inventory items.")
    return
  }

  logger.info(`Found ${inventoryItems.length} inventory items.`)

  // ── 3. Get existing inventory levels ───────────────────────────────────────
  const { data: existingLevels } = await query.graph({
    entity: "inventory_level",
    fields: ["id", "inventory_item_id", "location_id", "stocked_quantity"],
  })

  const existingMap = new Map<string, any>(
    (existingLevels || []).map((l: any) => [
      `${l.inventory_item_id}:${l.location_id}`,
      l,
    ])
  )

  // ── 4. Update existing levels and collect missing ones ──────────────────────
  const newLevels: {
    inventory_item_id: string
    location_id: string
    stocked_quantity: number
  }[] = []

  let updated = 0
  let created = 0
  let alreadyGood = 0

  for (const item of inventoryItems as any[]) {
    const key = `${item.id}:${location.id}`
    const existing = existingMap.get(key)

    if (existing) {
      if (existing.stocked_quantity >= 50) {
        alreadyGood++
        logger.info(`  [SKIP] ${item.sku || item.id}: already has ${existing.stocked_quantity} units`)
      } else {
        await inventoryModule.updateInventoryLevels({
          inventory_item_id: item.id,
          location_id: location.id,
          stocked_quantity: 50,
        })
        updated++
        logger.info(`  [UPDT] ${item.sku || item.id}: updated to 50 units`)
      }
    } else {
      newLevels.push({
        inventory_item_id: item.id,
        location_id: location.id,
        stocked_quantity: 50,
      })
    }
  }

  // ── 5. Bulk-create missing inventory levels ─────────────────────────────────
  if (newLevels.length > 0) {
    logger.info(`Creating ${newLevels.length} new inventory levels...`)
    await createInventoryLevelsWorkflow(container).run({
      input: { inventory_levels: newLevels },
    } as any)
    created = newLevels.length
    logger.info(`  [OK] Created ${created} inventory levels`)
  }

  logger.info(
    `=== seed-all-inventory: Done! ` +
      `${created} created, ${updated} updated, ${alreadyGood} already sufficient ===`
  )
}
