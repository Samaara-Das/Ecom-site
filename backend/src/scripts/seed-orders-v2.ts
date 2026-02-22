/**
 * Seed script: 25 Kuwait Marketplace orders (v2)
 * Idempotent — skips if 25+ orders already exist from seeded customers.
 * Distribution: 12 completed, 10 pending, 3 canceled
 *
 * Run with: npx medusa exec ./src/scripts/seed-orders-v2.ts
 */

import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

// Kuwaiti area names for shipping addresses
const KW_AREAS = [
  { city: "Kuwait City", postal_code: "13001" },
  { city: "Salmiya", postal_code: "22001" },
  { city: "Hawalli", postal_code: "32001" },
  { city: "Farwaniya", postal_code: "42001" },
  { city: "Mishref", postal_code: "52001" },
  { city: "Rumaithiya", postal_code: "45001" },
  { city: "Sabah Al-Salem", postal_code: "63001" },
  { city: "Fahaheel", postal_code: "71001" },
  { city: "Salwa", postal_code: "64001" },
]

const KW_STREETS = [
  "Block 5, Street 12, Villa 47",
  "Block 3, Street 7, Villa 22",
  "Block 8, Street 14, House 61",
  "Block 11, Street 3, Villa 9",
  "Block 6, Street 18, House 33",
  "Block 4, Street 9, Villa 15",
  "Block 7, Street 5, House 88",
  "Block 2, Street 6, Apartment 401",
  "Block 9, Street 1, Apartment 204",
]

// 25 orders: 12 completed, 10 pending, 3 canceled
const ORDER_STATUSES = [
  ...Array(12).fill("completed"),
  ...Array(10).fill("pending"),
  ...Array(3).fill("canceled"),
]

export default async function seedOrdersV2({
  container,
}: {
  container: any
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const orderModule = container.resolve(Modules.ORDER)
  const customerModule = container.resolve(Modules.CUSTOMER)

  logger.info("=== seed-orders-v2: Starting ===")

  // Idempotency: check if orders already exist
  const existingOrders = await orderModule.listOrders({})
  if (existingOrders?.length >= 25) {
    logger.info(`  [SKIP] ${existingOrders.length} orders already exist — skipping`)
    return { created: 0, skipped: existingOrders.length }
  }

  // ── Fetch reference data ────────────────────────────────────────────────────

  // Region (Kuwait, kwd)
  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["id", "name", "currency_code"],
  })
  const region = regions.find((r: any) => r.currency_code === "kwd") || regions[0]
  if (!region) throw new Error("No Kuwait region found — run seed-products first")
  logger.info(`  Using region: ${region.name} (${region.id})`)

  // Customers (our seeded 25 — skip the test account)
  const allCustomers = await customerModule.listCustomers({}, { take: 100 })
  const customers = allCustomers.filter((c: any) => c.email !== "test@example.com")
  if (customers.length < 10) throw new Error("Not enough customers — run seed-customers-v2 first")
  logger.info(`  Found ${customers.length} customers`)

  // Product variants with prices
  const { data: variants } = await query.graph({
    entity: "product_variant",
    fields: ["id", "title", "sku", "product.title", "prices.*"],
    pagination: { take: 200 },
  })
  const availableVariants = variants.filter((v: any) => v.prices?.length > 0)
  if (availableVariants.length < 10) throw new Error("Not enough variants — run seed-products-v2 first")
  logger.info(`  Found ${availableVariants.length} variants with prices`)

  // Shipping option
  const { data: shippingOptions } = await query.graph({
    entity: "shipping_option",
    fields: ["id", "name"],
  })
  const shippingOption = shippingOptions[0]
  logger.info(`  Using shipping: ${shippingOption?.name} (${shippingOption?.id})`)

  // ── Helper to pick random items ─────────────────────────────────────────────
  const pick = (arr: any[], i: number): any => arr[i % arr.length]
  const rand = (min: number, max: number, seed: number) =>
    min + ((seed * 2654435761) % (max - min + 1))

  // ── Create orders ───────────────────────────────────────────────────────────
  let created = 0

  for (let i = 0; i < 25; i++) {
    const customer = pick(customers, i * 3 + 7)
    const status = ORDER_STATUSES[i]
    const area = pick(KW_AREAS, i)
    const street = pick(KW_STREETS, i)

    // Pick 1-3 items per order
    const itemCount = rand(1, 3, i + 1)
    const orderVariants: any[] = []
    for (let j = 0; j < itemCount; j++) {
      orderVariants.push(pick(availableVariants, i * 5 + j * 13))
    }

    // Build line items
    const items = orderVariants.map((v) => {
      const kwdPrice = v.prices?.find((p: any) => p.currency_code === "kwd")
      const unitPrice = kwdPrice?.amount ?? 20000
      return {
        title: v.product?.title ?? v.title,
        subtitle: v.title,
        quantity: 1,
        unit_price: unitPrice,
        variant_id: v.id,
      }
    })

    const subtotal = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)
    const shippingAmount = 2000 // 2 KWD flat shipping
    const total = subtotal + shippingAmount

    const shippingAddress = {
      first_name: customer.first_name,
      last_name: customer.last_name,
      address_1: street,
      city: area.city,
      country_code: "kw",
      postal_code: area.postal_code,
      phone: customer.phone ?? "+96550000000",
    }

    try {
      await orderModule.createOrders({
        region_id: region.id,
        currency_code: "kwd",
        customer_id: customer.id,
        email: customer.email,
        status,
        items,
        shipping_address: shippingAddress,
        billing_address: shippingAddress,
        shipping_methods: shippingOption
          ? [
              {
                name: shippingOption.name,
                amount: shippingAmount,
                shipping_option_id: shippingOption.id,
              },
            ]
          : [],
        metadata: {
          seeded: true,
          seed_version: "v2",
        },
      })

      logger.info(
        `  [OK]   Order ${i + 1}/25 — ${customer.email} — ${status} — ${items.length} item(s) — ${total / 1000} KWD`
      )
      created++
    } catch (err) {
      logger.error(
        `  [ERR]  Order ${i + 1}/25 for ${customer.email}: ${err instanceof Error ? err.message : err}`
      )
    }
  }

  logger.info(`=== seed-orders-v2: Done — created ${created} orders ===`)
  return { created }
}
