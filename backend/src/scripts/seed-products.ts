/**
 * Product Seeder Script
 *
 * Seeds the database with sample products for demo purposes.
 * Creates 10-15 products across 3-4 categories:
 * - Electronics (phones, laptops, accessories)
 * - Fashion (clothing, shoes)
 * - Home & Kitchen (appliances, decor)
 *
 * Run with: npm run seed:products
 * Or: npx medusa exec ./src/scripts/seed-products.ts
 */

import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { createProductsWorkflow } from "@medusajs/medusa/core-flows"

// Types for our product data structure
interface ProductVariantData {
  title: string
  sku: string
  options: Record<string, string>
  prices: Array<{ amount: number; currency_code: string }>
  manage_inventory: boolean
  inventory_quantity?: number
}

interface ProductData {
  title: string
  description: string
  handle: string
  category: string
  thumbnail: string
  images: string[]
  options: Array<{ title: string; values: string[] }>
  variants: ProductVariantData[]
}

// Helper to generate placeholder image URLs
const getPlaceholderImage = (seed: number, size = 400): string => {
  return `https://picsum.photos/seed/${seed}/${size}/${size}`
}

// Sample product data organized by category
const sampleProducts: ProductData[] = [
  // === ELECTRONICS ===
  {
    title: "Pro Smartphone X1",
    description:
      "Latest flagship smartphone with advanced camera system, powerful processor, and all-day battery life. Features a stunning AMOLED display and 5G connectivity.",
    handle: "pro-smartphone-x1",
    category: "Electronics",
    thumbnail: getPlaceholderImage(101),
    images: [getPlaceholderImage(101), getPlaceholderImage(102)],
    options: [{ title: "Storage", values: ["128GB", "256GB", "512GB"] }],
    variants: [
      {
        title: "128GB",
        sku: "PHONE-X1-128",
        options: { Storage: "128GB" },
        prices: [
          { amount: 79900, currency_code: "usd" },
          { amount: 245000, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 50,
      },
      {
        title: "256GB",
        sku: "PHONE-X1-256",
        options: { Storage: "256GB" },
        prices: [
          { amount: 89900, currency_code: "usd" },
          { amount: 275000, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 35,
      },
      {
        title: "512GB",
        sku: "PHONE-X1-512",
        options: { Storage: "512GB" },
        prices: [
          { amount: 109900, currency_code: "usd" },
          { amount: 335000, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 20,
      },
    ],
  },
  {
    title: "UltraBook Pro 15",
    description:
      "Powerful laptop for professionals and creators. Features high-resolution display, dedicated graphics, and premium build quality.",
    handle: "ultrabook-pro-15",
    category: "Electronics",
    thumbnail: getPlaceholderImage(103),
    images: [getPlaceholderImage(103), getPlaceholderImage(104)],
    options: [{ title: "Configuration", values: ["i5/8GB", "i7/16GB"] }],
    variants: [
      {
        title: "i5/8GB RAM",
        sku: "LAPTOP-UB15-I5",
        options: { Configuration: "i5/8GB" },
        prices: [
          { amount: 129900, currency_code: "usd" },
          { amount: 399000, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 25,
      },
      {
        title: "i7/16GB RAM",
        sku: "LAPTOP-UB15-I7",
        options: { Configuration: "i7/16GB" },
        prices: [
          { amount: 179900, currency_code: "usd" },
          { amount: 549000, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 15,
      },
    ],
  },
  {
    title: "Wireless Earbuds Pro",
    description:
      "Premium true wireless earbuds with active noise cancellation, spatial audio, and up to 30 hours of battery life with the charging case.",
    handle: "wireless-earbuds-pro",
    category: "Electronics",
    thumbnail: getPlaceholderImage(105),
    images: [getPlaceholderImage(105), getPlaceholderImage(106)],
    options: [{ title: "Color", values: ["Black", "White"] }],
    variants: [
      {
        title: "Black",
        sku: "EARBUDS-PRO-BLK",
        options: { Color: "Black" },
        prices: [
          { amount: 24900, currency_code: "usd" },
          { amount: 76000, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 100,
      },
      {
        title: "White",
        sku: "EARBUDS-PRO-WHT",
        options: { Color: "White" },
        prices: [
          { amount: 24900, currency_code: "usd" },
          { amount: 76000, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 80,
      },
    ],
  },
  {
    title: "Smart Watch Series 5",
    description:
      "Advanced smartwatch with health monitoring, fitness tracking, GPS, and seamless smartphone integration. Water-resistant design.",
    handle: "smart-watch-series-5",
    category: "Electronics",
    thumbnail: getPlaceholderImage(107),
    images: [getPlaceholderImage(107), getPlaceholderImage(108)],
    options: [{ title: "Band", values: ["Sport", "Leather"] }],
    variants: [
      {
        title: "Sport Band",
        sku: "WATCH-S5-SPORT",
        options: { Band: "Sport" },
        prices: [
          { amount: 39900, currency_code: "usd" },
          { amount: 122000, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 60,
      },
      {
        title: "Leather Band",
        sku: "WATCH-S5-LEATHER",
        options: { Band: "Leather" },
        prices: [
          { amount: 44900, currency_code: "usd" },
          { amount: 137000, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 40,
      },
    ],
  },

  // === FASHION ===
  {
    title: "Classic Cotton T-Shirt",
    description:
      "Premium quality cotton t-shirt with a comfortable fit. Perfect for everyday wear with breathable fabric and durable construction.",
    handle: "classic-cotton-tshirt",
    category: "Fashion",
    thumbnail: getPlaceholderImage(201),
    images: [getPlaceholderImage(201), getPlaceholderImage(202)],
    options: [
      { title: "Size", values: ["S", "M", "L", "XL"] },
      { title: "Color", values: ["White", "Black", "Navy"] },
    ],
    variants: [
      {
        title: "Small / White",
        sku: "TSHIRT-S-WHT",
        options: { Size: "S", Color: "White" },
        prices: [
          { amount: 2499, currency_code: "usd" },
          { amount: 7500, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 100,
      },
      {
        title: "Medium / White",
        sku: "TSHIRT-M-WHT",
        options: { Size: "M", Color: "White" },
        prices: [
          { amount: 2499, currency_code: "usd" },
          { amount: 7500, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 150,
      },
      {
        title: "Large / Black",
        sku: "TSHIRT-L-BLK",
        options: { Size: "L", Color: "Black" },
        prices: [
          { amount: 2499, currency_code: "usd" },
          { amount: 7500, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 120,
      },
      {
        title: "XL / Navy",
        sku: "TSHIRT-XL-NVY",
        options: { Size: "XL", Color: "Navy" },
        prices: [
          { amount: 2499, currency_code: "usd" },
          { amount: 7500, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 80,
      },
    ],
  },
  {
    title: "Slim Fit Jeans",
    description:
      "Modern slim fit jeans with stretch comfort. Made from premium denim with classic 5-pocket styling and versatile appeal.",
    handle: "slim-fit-jeans",
    category: "Fashion",
    thumbnail: getPlaceholderImage(203),
    images: [getPlaceholderImage(203), getPlaceholderImage(204)],
    options: [{ title: "Size", values: ["30", "32", "34", "36"] }],
    variants: [
      {
        title: "Size 30",
        sku: "JEANS-SLIM-30",
        options: { Size: "30" },
        prices: [
          { amount: 6999, currency_code: "usd" },
          { amount: 21500, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 40,
      },
      {
        title: "Size 32",
        sku: "JEANS-SLIM-32",
        options: { Size: "32" },
        prices: [
          { amount: 6999, currency_code: "usd" },
          { amount: 21500, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 60,
      },
      {
        title: "Size 34",
        sku: "JEANS-SLIM-34",
        options: { Size: "34" },
        prices: [
          { amount: 6999, currency_code: "usd" },
          { amount: 21500, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 50,
      },
      {
        title: "Size 36",
        sku: "JEANS-SLIM-36",
        options: { Size: "36" },
        prices: [
          { amount: 6999, currency_code: "usd" },
          { amount: 21500, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 35,
      },
    ],
  },
  {
    title: "Running Sneakers Air",
    description:
      "Lightweight running sneakers with responsive cushioning and breathable mesh upper. Designed for comfort during workouts and daily wear.",
    handle: "running-sneakers-air",
    category: "Fashion",
    thumbnail: getPlaceholderImage(205),
    images: [getPlaceholderImage(205), getPlaceholderImage(206)],
    options: [{ title: "Size", values: ["8", "9", "10", "11"] }],
    variants: [
      {
        title: "Size 8",
        sku: "SNKR-AIR-8",
        options: { Size: "8" },
        prices: [
          { amount: 12900, currency_code: "usd" },
          { amount: 39500, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 25,
      },
      {
        title: "Size 9",
        sku: "SNKR-AIR-9",
        options: { Size: "9" },
        prices: [
          { amount: 12900, currency_code: "usd" },
          { amount: 39500, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 30,
      },
      {
        title: "Size 10",
        sku: "SNKR-AIR-10",
        options: { Size: "10" },
        prices: [
          { amount: 12900, currency_code: "usd" },
          { amount: 39500, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 35,
      },
      {
        title: "Size 11",
        sku: "SNKR-AIR-11",
        options: { Size: "11" },
        prices: [
          { amount: 12900, currency_code: "usd" },
          { amount: 39500, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 20,
      },
    ],
  },
  {
    title: "Leather Crossbody Bag",
    description:
      "Elegant leather crossbody bag with adjustable strap. Features multiple compartments and premium hardware for a sophisticated look.",
    handle: "leather-crossbody-bag",
    category: "Fashion",
    thumbnail: getPlaceholderImage(207),
    images: [getPlaceholderImage(207), getPlaceholderImage(208)],
    options: [{ title: "Color", values: ["Brown", "Black"] }],
    variants: [
      {
        title: "Brown",
        sku: "BAG-CROSS-BRN",
        options: { Color: "Brown" },
        prices: [
          { amount: 8900, currency_code: "usd" },
          { amount: 27200, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 30,
      },
      {
        title: "Black",
        sku: "BAG-CROSS-BLK",
        options: { Color: "Black" },
        prices: [
          { amount: 8900, currency_code: "usd" },
          { amount: 27200, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 35,
      },
    ],
  },

  // === HOME & KITCHEN ===
  {
    title: "Smart Air Purifier",
    description:
      "Advanced HEPA air purifier with smart controls and real-time air quality monitoring. Covers up to 500 sq ft with whisper-quiet operation.",
    handle: "smart-air-purifier",
    category: "Home & Kitchen",
    thumbnail: getPlaceholderImage(301),
    images: [getPlaceholderImage(301), getPlaceholderImage(302)],
    options: [{ title: "Size", values: ["Standard", "Large"] }],
    variants: [
      {
        title: "Standard",
        sku: "AIRPUR-STD",
        options: { Size: "Standard" },
        prices: [
          { amount: 19900, currency_code: "usd" },
          { amount: 60900, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 40,
      },
      {
        title: "Large",
        sku: "AIRPUR-LRG",
        options: { Size: "Large" },
        prices: [
          { amount: 29900, currency_code: "usd" },
          { amount: 91500, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 25,
      },
    ],
  },
  {
    title: "Premium Blender Pro",
    description:
      "High-powered blender with variable speed control and preset programs. Perfect for smoothies, soups, and food processing with durable stainless steel blades.",
    handle: "premium-blender-pro",
    category: "Home & Kitchen",
    thumbnail: getPlaceholderImage(303),
    images: [getPlaceholderImage(303), getPlaceholderImage(304)],
    options: [{ title: "Color", values: ["Silver", "Black"] }],
    variants: [
      {
        title: "Silver",
        sku: "BLENDER-PRO-SLV",
        options: { Color: "Silver" },
        prices: [
          { amount: 14900, currency_code: "usd" },
          { amount: 45600, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 45,
      },
      {
        title: "Black",
        sku: "BLENDER-PRO-BLK",
        options: { Color: "Black" },
        prices: [
          { amount: 14900, currency_code: "usd" },
          { amount: 45600, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 50,
      },
    ],
  },
  {
    title: "Ceramic Cookware Set",
    description:
      "Non-stick ceramic cookware set including pots, pans, and lids. Eco-friendly coating, oven-safe, and dishwasher compatible for easy cleaning.",
    handle: "ceramic-cookware-set",
    category: "Home & Kitchen",
    thumbnail: getPlaceholderImage(305),
    images: [getPlaceholderImage(305), getPlaceholderImage(306)],
    options: [{ title: "Set", values: ["5-Piece", "10-Piece"] }],
    variants: [
      {
        title: "5-Piece Set",
        sku: "COOKWARE-CER-5",
        options: { Set: "5-Piece" },
        prices: [
          { amount: 9900, currency_code: "usd" },
          { amount: 30300, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 30,
      },
      {
        title: "10-Piece Set",
        sku: "COOKWARE-CER-10",
        options: { Set: "10-Piece" },
        prices: [
          { amount: 16900, currency_code: "usd" },
          { amount: 51700, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 20,
      },
    ],
  },
  {
    title: "Decorative Table Lamp",
    description:
      "Modern decorative table lamp with adjustable brightness. Features elegant design with linen shade and brass base, perfect for living rooms or bedrooms.",
    handle: "decorative-table-lamp",
    category: "Home & Kitchen",
    thumbnail: getPlaceholderImage(307),
    images: [getPlaceholderImage(307), getPlaceholderImage(308)],
    options: [{ title: "Style", values: ["Brass", "Matte Black"] }],
    variants: [
      {
        title: "Brass",
        sku: "LAMP-TBL-BRASS",
        options: { Style: "Brass" },
        prices: [
          { amount: 7900, currency_code: "usd" },
          { amount: 24200, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 35,
      },
      {
        title: "Matte Black",
        sku: "LAMP-TBL-MBLK",
        options: { Style: "Matte Black" },
        prices: [
          { amount: 7900, currency_code: "usd" },
          { amount: 24200, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 40,
      },
    ],
  },
  {
    title: "Cozy Throw Blanket",
    description:
      "Soft and cozy throw blanket made from premium microfiber. Perfect for lounging on the couch or adding warmth to your bedroom decor.",
    handle: "cozy-throw-blanket",
    category: "Home & Kitchen",
    thumbnail: getPlaceholderImage(309),
    images: [getPlaceholderImage(309), getPlaceholderImage(310)],
    options: [{ title: "Color", values: ["Gray", "Beige", "Navy"] }],
    variants: [
      {
        title: "Gray",
        sku: "BLANKET-THROW-GRY",
        options: { Color: "Gray" },
        prices: [
          { amount: 4900, currency_code: "usd" },
          { amount: 15000, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 60,
      },
      {
        title: "Beige",
        sku: "BLANKET-THROW-BEI",
        options: { Color: "Beige" },
        prices: [
          { amount: 4900, currency_code: "usd" },
          { amount: 15000, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 55,
      },
      {
        title: "Navy",
        sku: "BLANKET-THROW-NVY",
        options: { Color: "Navy" },
        prices: [
          { amount: 4900, currency_code: "usd" },
          { amount: 15000, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 50,
      },
    ],
  },
]

/**
 * Main seed function exported for Medusa CLI
 */
export default async function seedProducts({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info("Starting product seeder...")
  logger.info(`Preparing to seed ${sampleProducts.length} products`)

  // Get the default sales channel
  let salesChannelId: string | undefined

  try {
    const { data: salesChannels } = await query.graph({
      entity: "sales_channel",
      fields: ["id", "name"],
      filters: {},
    })

    if (salesChannels && salesChannels.length > 0) {
      salesChannelId = salesChannels[0].id
      logger.info(`Using sales channel: ${salesChannels[0].name} (${salesChannelId})`)
    } else {
      logger.warn("No sales channels found - products will be created without sales channel association")
    }
  } catch (error) {
    logger.warn(`Could not fetch sales channels: ${error}`)
  }

  // Get the default shipping profile
  let shippingProfileId: string | undefined

  try {
    const shippingProfileModule = container.resolve(Modules.FULFILLMENT)
    const shippingProfiles = await shippingProfileModule.listShippingProfiles({})

    if (shippingProfiles && shippingProfiles.length > 0) {
      shippingProfileId = shippingProfiles[0].id
      logger.info(`Using shipping profile: ${shippingProfileId}`)
    }
  } catch (error) {
    logger.warn(`Could not fetch shipping profiles: ${error}`)
  }

  let successCount = 0
  let failCount = 0

  // Process products one at a time to handle errors gracefully
  for (const productData of sampleProducts) {
    try {
      logger.info(`Creating product: ${productData.title}`)

      // Build product input for the workflow
      const productInput: Record<string, unknown> = {
        title: productData.title,
        description: productData.description,
        handle: productData.handle,
        thumbnail: productData.thumbnail,
        images: productData.images.map((url) => ({ url })),
        options: productData.options,
        variants: productData.variants.map((variant) => ({
          title: variant.title,
          sku: variant.sku,
          options: variant.options,
          prices: variant.prices,
          manage_inventory: variant.manage_inventory,
        })),
        status: "published",
        metadata: {
          category: productData.category,
          seeded_at: new Date().toISOString(),
        },
      }

      // Add sales channel if available
      if (salesChannelId) {
        productInput.sales_channels = [{ id: salesChannelId }]
      }

      // Add shipping profile if available
      if (shippingProfileId) {
        productInput.shipping_profile_id = shippingProfileId
      }

      // Run the create products workflow
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { result } = await createProductsWorkflow(container).run({
        input: {
          products: [productInput],
        },
      } as any)

      if (result && result.length > 0) {
        const createdProduct = result[0]
        logger.info(`  ✓ Created: ${createdProduct.title} (ID: ${createdProduct.id})`)
        logger.info(`    - Handle: ${createdProduct.handle}`)
        logger.info(`    - Variants: ${productData.variants.length}`)
        successCount++
      }
    } catch (error) {
      failCount++
      const errorMessage = error instanceof Error ? error.message : String(error)
      logger.error(`  ✗ Failed to create "${productData.title}": ${errorMessage}`)

      // Log additional details for debugging
      if (error instanceof Error && error.stack) {
        logger.debug(error.stack)
      }
    }
  }

  // Summary
  logger.info("")
  logger.info("=".repeat(50))
  logger.info("Product Seeding Complete")
  logger.info("=".repeat(50))
  logger.info(`Total products: ${sampleProducts.length}`)
  logger.info(`Successfully created: ${successCount}`)
  logger.info(`Failed: ${failCount}`)

  if (failCount > 0) {
    logger.warn("Some products failed to seed. Check the logs above for details.")
  } else {
    logger.info("All products seeded successfully!")
  }

  // Return summary for potential programmatic use
  return {
    total: sampleProducts.length,
    success: successCount,
    failed: failCount,
  }
}
