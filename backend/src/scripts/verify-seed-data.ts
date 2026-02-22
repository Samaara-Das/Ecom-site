/**
 * Verify all seeded data counts.
 * Run with: npx medusa exec ./src/scripts/verify-seed-data.ts
 */

import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { VENDOR_MODULE } from "../modules/vendor"

export default async function verifySeedData({ container }: { container: any }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const customerModule = container.resolve(Modules.CUSTOMER)
  const orderModule = container.resolve(Modules.ORDER)
  const vendorService = container.resolve(VENDOR_MODULE)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info("=== verify-seed-data: Starting ===")

  // VERIFY-001: Vendors
  const vendors = await vendorService.listVendors()
  logger.info(`VERIFY-001 VENDORS: ${vendors.length} total`)
  const byStatus: Record<string, number> = {}
  for (const v of vendors) {
    byStatus[(v as any).status] = (byStatus[(v as any).status] ?? 0) + 1
  }
  logger.info(`  Status breakdown: ${JSON.stringify(byStatus)}`)

  // VERIFY-002: Products
  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title", "status"],
    pagination: { take: 200, skip: 0 },
  })
  logger.info(`VERIFY-002 PRODUCTS: ${products.length} total`)

  // VERIFY-003: Customers
  const customers = await customerModule.listCustomers({}, { take: 200 })
  logger.info(`VERIFY-003 CUSTOMERS: ${customers.length} total`)

  // VERIFY-005: Orders
  const orders = await orderModule.listOrders({}, { take: 200 })
  logger.info(`VERIFY-005 ORDERS: ${orders.length} total`)
  const orderByStatus: Record<string, number> = {}
  for (const o of orders) {
    orderByStatus[(o as any).status] = (orderByStatus[(o as any).status] ?? 0) + 1
  }
  logger.info(`  Order status breakdown: ${JSON.stringify(orderByStatus)}`)

  // Summary
  const pass = vendors.length >= 12 && products.length >= 60 && customers.length >= 25 && orders.length >= 25
  logger.info(`\n=== SUMMARY ===`)
  logger.info(`  Vendors:   ${vendors.length >= 12 ? "✓" : "✗"} ${vendors.length}/12`)
  logger.info(`  Products:  ${products.length >= 60 ? "✓" : "✗"} ${products.length}/60`)
  logger.info(`  Customers: ${customers.length >= 25 ? "✓" : "✗"} ${customers.length}/25`)
  logger.info(`  Orders:    ${orders.length >= 25 ? "✓" : "✗"} ${orders.length}/25`)
  logger.info(`  Overall:   ${pass ? "ALL PASS" : "SOME FAIL"}`)
  logger.info("=== verify-seed-data: Done ===")
}
