import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function addTestInventory({ container }: { container: any }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const inventoryModule = container.resolve(Modules.INVENTORY)
  const productModule = container.resolve(Modules.PRODUCT)
  const stockLocationModule = container.resolve(Modules.STOCK_LOCATION)

  logger.info("Adding test inventory...")

  // Get the Pro Smartphone X1 variant
  const [variant] = await productModule.listProductVariants({
    sku: "PHONE-X1-128"
  })

  if (!variant) {
    logger.error("Variant PHONE-X1-128 not found")
    return
  }

  logger.info(`Found variant: ${variant.id} (${variant.title})`)

  // Get stock locations
  const stockLocations = await stockLocationModule.listStockLocations({})
  logger.info(`Stock locations: ${JSON.stringify(stockLocations.map((l: any) => l.id + ' ' + l.name))}`)

  if (!stockLocations.length) {
    logger.warn("No stock locations found - creating one")
    const loc = await stockLocationModule.createStockLocations({ name: "Main Warehouse" })
    stockLocations.push(loc)
  }

  const locationId = stockLocations[0].id
  logger.info(`Using location: ${locationId}`)

  // Check if inventory item exists for this variant
  const inventoryItems = await inventoryModule.listInventoryItems({
    sku: "PHONE-X1-128"
  })
  
  logger.info(`Inventory items: ${JSON.stringify(inventoryItems.map((i: any) => i.id))}`)

  let inventoryItemId: string
  if (inventoryItems.length) {
    inventoryItemId = inventoryItems[0].id
  } else {
    const item = await inventoryModule.createInventoryItems({
      sku: "PHONE-X1-128",
      title: "Pro Smartphone X1 128GB"
    })
    inventoryItemId = (item as any).id
    logger.info(`Created inventory item: ${inventoryItemId}`)
  }

  // Check if level exists
  const levels = await inventoryModule.listInventoryLevels({
    inventory_item_id: inventoryItemId,
    location_id: locationId
  })

  if (levels.length) {
    // Update existing level
    await inventoryModule.updateInventoryLevels({
      inventory_item_id: inventoryItemId,
      location_id: locationId,
      stocked_quantity: 100
    })
    logger.info(`Updated inventory level to 100`)
  } else {
    // Create new level
    await inventoryModule.createInventoryLevels({
      inventory_item_id: inventoryItemId,
      location_id: locationId,
      stocked_quantity: 100
    })
    logger.info(`Created inventory level with 100 units`)
  }

  logger.info("Done! Pro Smartphone X1 128GB now has 100 units in stock")
}
