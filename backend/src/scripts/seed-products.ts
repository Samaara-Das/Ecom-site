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

// Helper to generate category-specific placeholder images from Unsplash
const getUnsplashImage = (category: string, index: number, size = 400): string => {
  const categoryKeywords: Record<string, string> = {
    electronics: "technology,gadget",
    phone: "smartphone,mobile",
    laptop: "laptop,computer",
    earbuds: "headphones,earbuds",
    watch: "smartwatch,watch",
    tablet: "tablet,ipad",
    camera: "camera,photography",
    fashion: "fashion,clothing",
    shoes: "sneakers,shoes",
    bag: "handbag,bag",
    jewelry: "jewelry,accessories",
    dress: "dress,fashion",
    home: "interior,home",
    kitchen: "kitchen,cookware",
    furniture: "furniture,home",
    decor: "decor,interior",
    beauty: "skincare,cosmetics",
    wellness: "wellness,health",
    perfume: "perfume,fragrance",
    sports: "fitness,sports",
    yoga: "yoga,fitness",
    outdoor: "outdoor,camping",
  }
  const keyword = categoryKeywords[category] || "product"
  return `https://source.unsplash.com/${size}x${size}/?${keyword}&sig=${index}`
}

// Fallback to picsum for variety
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

  // === MORE ELECTRONICS ===
  {
    title: "iPad Pro 12.9 inch",
    description:
      "Powerful tablet with M2 chip, Liquid Retina XDR display, and all-day battery. Perfect for creative professionals and productivity on the go.",
    handle: "ipad-pro-12-9",
    category: "Electronics",
    thumbnail: getUnsplashImage("tablet", 1),
    images: [getUnsplashImage("tablet", 1), getUnsplashImage("tablet", 2)],
    options: [{ title: "Storage", values: ["256GB", "512GB", "1TB"] }],
    variants: [
      {
        title: "256GB",
        sku: "IPAD-PRO-256",
        options: { Storage: "256GB" },
        prices: [
          { amount: 109900, currency_code: "usd" },
          { amount: 336000, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 30,
      },
      {
        title: "512GB",
        sku: "IPAD-PRO-512",
        options: { Storage: "512GB" },
        prices: [
          { amount: 129900, currency_code: "usd" },
          { amount: 397000, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 25,
      },
      {
        title: "1TB",
        sku: "IPAD-PRO-1TB",
        options: { Storage: "1TB" },
        prices: [
          { amount: 169900, currency_code: "usd" },
          { amount: 519000, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 15,
      },
    ],
  },
  {
    title: "Professional DSLR Camera",
    description:
      "Full-frame DSLR camera with 45MP sensor, 4K video recording, and advanced autofocus system. Includes kit lens and camera bag.",
    handle: "professional-dslr-camera",
    category: "Electronics",
    thumbnail: getUnsplashImage("camera", 1),
    images: [getUnsplashImage("camera", 1), getUnsplashImage("camera", 2)],
    options: [{ title: "Kit", values: ["Body Only", "With Lens"] }],
    variants: [
      {
        title: "Body Only",
        sku: "DSLR-PRO-BODY",
        options: { Kit: "Body Only" },
        prices: [
          { amount: 249900, currency_code: "usd" },
          { amount: 764000, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 10,
      },
      {
        title: "With 24-70mm Lens",
        sku: "DSLR-PRO-KIT",
        options: { Kit: "With Lens" },
        prices: [
          { amount: 349900, currency_code: "usd" },
          { amount: 1069000, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 8,
      },
    ],
  },
  {
    title: "Gaming Headset RGB",
    description:
      "Premium gaming headset with 7.1 surround sound, noise-cancelling microphone, and customizable RGB lighting. Compatible with PC, PS5, and Xbox.",
    handle: "gaming-headset-rgb",
    category: "Electronics",
    thumbnail: getUnsplashImage("earbuds", 3),
    images: [getUnsplashImage("earbuds", 3), getUnsplashImage("earbuds", 4)],
    options: [{ title: "Color", values: ["Black", "White"] }],
    variants: [
      {
        title: "Black",
        sku: "HEADSET-GAME-BLK",
        options: { Color: "Black" },
        prices: [
          { amount: 14900, currency_code: "usd" },
          { amount: 45500, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 75,
      },
      {
        title: "White",
        sku: "HEADSET-GAME-WHT",
        options: { Color: "White" },
        prices: [
          { amount: 14900, currency_code: "usd" },
          { amount: 45500, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 60,
      },
    ],
  },
  {
    title: "Portable Bluetooth Speaker",
    description:
      "Waterproof portable speaker with 360° sound, 20-hour battery life, and built-in microphone for calls. Perfect for outdoor adventures.",
    handle: "portable-bluetooth-speaker",
    category: "Electronics",
    thumbnail: getUnsplashImage("electronics", 5),
    images: [getUnsplashImage("electronics", 5), getUnsplashImage("electronics", 6)],
    options: [{ title: "Color", values: ["Blue", "Red", "Black"] }],
    variants: [
      {
        title: "Blue",
        sku: "SPEAKER-BT-BLU",
        options: { Color: "Blue" },
        prices: [
          { amount: 7900, currency_code: "usd" },
          { amount: 24100, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 90,
      },
      {
        title: "Red",
        sku: "SPEAKER-BT-RED",
        options: { Color: "Red" },
        prices: [
          { amount: 7900, currency_code: "usd" },
          { amount: 24100, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 70,
      },
      {
        title: "Black",
        sku: "SPEAKER-BT-BLK",
        options: { Color: "Black" },
        prices: [
          { amount: 7900, currency_code: "usd" },
          { amount: 24100, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 100,
      },
    ],
  },
  {
    title: "4K Webcam Pro",
    description:
      "Ultra HD webcam with auto-focus, built-in ring light, and noise-cancelling dual microphones. Perfect for video calls and streaming.",
    handle: "4k-webcam-pro",
    category: "Electronics",
    thumbnail: getUnsplashImage("camera", 3),
    images: [getUnsplashImage("camera", 3), getUnsplashImage("camera", 4)],
    options: [{ title: "Resolution", values: ["1080p", "4K"] }],
    variants: [
      {
        title: "1080p",
        sku: "WEBCAM-1080",
        options: { Resolution: "1080p" },
        prices: [
          { amount: 6900, currency_code: "usd" },
          { amount: 21100, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 80,
      },
      {
        title: "4K Ultra HD",
        sku: "WEBCAM-4K",
        options: { Resolution: "4K" },
        prices: [
          { amount: 12900, currency_code: "usd" },
          { amount: 39400, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 45,
      },
    ],
  },

  // === MORE FASHION ===
  {
    title: "Elegant Evening Dress",
    description:
      "Stunning evening dress with flowing silhouette and delicate embroidery. Perfect for special occasions and formal events.",
    handle: "elegant-evening-dress",
    category: "Fashion",
    thumbnail: getUnsplashImage("dress", 1),
    images: [getUnsplashImage("dress", 1), getUnsplashImage("dress", 2)],
    options: [
      { title: "Size", values: ["S", "M", "L"] },
      { title: "Color", values: ["Black", "Navy", "Burgundy"] },
    ],
    variants: [
      {
        title: "Small / Black",
        sku: "DRESS-EVE-S-BLK",
        options: { Size: "S", Color: "Black" },
        prices: [
          { amount: 18900, currency_code: "usd" },
          { amount: 57800, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 20,
      },
      {
        title: "Medium / Navy",
        sku: "DRESS-EVE-M-NVY",
        options: { Size: "M", Color: "Navy" },
        prices: [
          { amount: 18900, currency_code: "usd" },
          { amount: 57800, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 25,
      },
      {
        title: "Large / Burgundy",
        sku: "DRESS-EVE-L-BUR",
        options: { Size: "L", Color: "Burgundy" },
        prices: [
          { amount: 18900, currency_code: "usd" },
          { amount: 57800, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 15,
      },
    ],
  },
  {
    title: "Designer Sunglasses",
    description:
      "Premium polarized sunglasses with UV400 protection and titanium frame. Includes designer case and cleaning cloth.",
    handle: "designer-sunglasses",
    category: "Fashion",
    thumbnail: getUnsplashImage("fashion", 3),
    images: [getUnsplashImage("fashion", 3), getUnsplashImage("fashion", 4)],
    options: [{ title: "Style", values: ["Aviator", "Wayfarer", "Round"] }],
    variants: [
      {
        title: "Aviator",
        sku: "SUNGLASS-AVIATOR",
        options: { Style: "Aviator" },
        prices: [
          { amount: 15900, currency_code: "usd" },
          { amount: 48600, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 40,
      },
      {
        title: "Wayfarer",
        sku: "SUNGLASS-WAYFARER",
        options: { Style: "Wayfarer" },
        prices: [
          { amount: 15900, currency_code: "usd" },
          { amount: 48600, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 45,
      },
      {
        title: "Round",
        sku: "SUNGLASS-ROUND",
        options: { Style: "Round" },
        prices: [
          { amount: 15900, currency_code: "usd" },
          { amount: 48600, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 35,
      },
    ],
  },
  {
    title: "Luxury Wristwatch",
    description:
      "Classic automatic wristwatch with sapphire crystal, leather strap, and water resistance up to 100m. Swiss movement precision.",
    handle: "luxury-wristwatch",
    category: "Fashion",
    thumbnail: getUnsplashImage("watch", 1),
    images: [getUnsplashImage("watch", 1), getUnsplashImage("watch", 2)],
    options: [{ title: "Color", values: ["Silver/Black", "Gold/Brown", "Rose Gold/Cream"] }],
    variants: [
      {
        title: "Silver with Black Dial",
        sku: "WATCH-LUX-SLV",
        options: { Color: "Silver/Black" },
        prices: [
          { amount: 49900, currency_code: "usd" },
          { amount: 152500, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 12,
      },
      {
        title: "Gold with Brown Strap",
        sku: "WATCH-LUX-GLD",
        options: { Color: "Gold/Brown" },
        prices: [
          { amount: 54900, currency_code: "usd" },
          { amount: 167800, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 10,
      },
      {
        title: "Rose Gold with Cream Dial",
        sku: "WATCH-LUX-RSG",
        options: { Color: "Rose Gold/Cream" },
        prices: [
          { amount: 54900, currency_code: "usd" },
          { amount: 167800, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 8,
      },
    ],
  },
  {
    title: "Premium Wool Coat",
    description:
      "Elegant wool-blend coat with satin lining and classic double-breasted design. Perfect for cooler weather and formal occasions.",
    handle: "premium-wool-coat",
    category: "Fashion",
    thumbnail: getUnsplashImage("fashion", 5),
    images: [getUnsplashImage("fashion", 5), getUnsplashImage("fashion", 6)],
    options: [
      { title: "Size", values: ["S", "M", "L", "XL"] },
    ],
    variants: [
      {
        title: "Small",
        sku: "COAT-WOOL-S",
        options: { Size: "S" },
        prices: [
          { amount: 29900, currency_code: "usd" },
          { amount: 91400, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 18,
      },
      {
        title: "Medium",
        sku: "COAT-WOOL-M",
        options: { Size: "M" },
        prices: [
          { amount: 29900, currency_code: "usd" },
          { amount: 91400, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 25,
      },
      {
        title: "Large",
        sku: "COAT-WOOL-L",
        options: { Size: "L" },
        prices: [
          { amount: 29900, currency_code: "usd" },
          { amount: 91400, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 20,
      },
      {
        title: "Extra Large",
        sku: "COAT-WOOL-XL",
        options: { Size: "XL" },
        prices: [
          { amount: 29900, currency_code: "usd" },
          { amount: 91400, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 15,
      },
    ],
  },
  {
    title: "Gold Chain Necklace",
    description:
      "18K gold-plated chain necklace with adjustable length. Hypoallergenic and tarnish-resistant for everyday elegance.",
    handle: "gold-chain-necklace",
    category: "Fashion",
    thumbnail: getUnsplashImage("jewelry", 1),
    images: [getUnsplashImage("jewelry", 1), getUnsplashImage("jewelry", 2)],
    options: [{ title: "Length", values: ["16 inch", "18 inch", "20 inch"] }],
    variants: [
      {
        title: "16 inch",
        sku: "NECKLACE-GOLD-16",
        options: { Length: "16 inch" },
        prices: [
          { amount: 7900, currency_code: "usd" },
          { amount: 24100, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 50,
      },
      {
        title: "18 inch",
        sku: "NECKLACE-GOLD-18",
        options: { Length: "18 inch" },
        prices: [
          { amount: 8900, currency_code: "usd" },
          { amount: 27200, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 60,
      },
      {
        title: "20 inch",
        sku: "NECKLACE-GOLD-20",
        options: { Length: "20 inch" },
        prices: [
          { amount: 9900, currency_code: "usd" },
          { amount: 30200, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 40,
      },
    ],
  },

  // === HEALTH & BEAUTY (New Category) ===
  {
    title: "Luxury Skincare Set",
    description:
      "Complete skincare routine with cleanser, toner, serum, and moisturizer. Made with natural ingredients for radiant, healthy skin.",
    handle: "luxury-skincare-set",
    category: "Health & Beauty",
    thumbnail: getUnsplashImage("beauty", 1),
    images: [getUnsplashImage("beauty", 1), getUnsplashImage("beauty", 2)],
    options: [{ title: "Skin Type", values: ["Normal/Combination", "Dry", "Oily"] }],
    variants: [
      {
        title: "Normal/Combination Skin",
        sku: "SKINCARE-SET-NORM",
        options: { "Skin Type": "Normal/Combination" },
        prices: [
          { amount: 12900, currency_code: "usd" },
          { amount: 39400, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 45,
      },
      {
        title: "Dry Skin Formula",
        sku: "SKINCARE-SET-DRY",
        options: { "Skin Type": "Dry" },
        prices: [
          { amount: 12900, currency_code: "usd" },
          { amount: 39400, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 40,
      },
      {
        title: "Oily Skin Formula",
        sku: "SKINCARE-SET-OILY",
        options: { "Skin Type": "Oily" },
        prices: [
          { amount: 12900, currency_code: "usd" },
          { amount: 39400, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 35,
      },
    ],
  },
  {
    title: "Designer Perfume Collection",
    description:
      "Exquisite eau de parfum with notes of jasmine, sandalwood, and vanilla. Long-lasting fragrance in an elegant glass bottle.",
    handle: "designer-perfume-collection",
    category: "Health & Beauty",
    thumbnail: getUnsplashImage("perfume", 1),
    images: [getUnsplashImage("perfume", 1), getUnsplashImage("perfume", 2)],
    options: [{ title: "Size", values: ["30ml", "50ml", "100ml"] }],
    variants: [
      {
        title: "30ml Travel Size",
        sku: "PERFUME-DES-30",
        options: { Size: "30ml" },
        prices: [
          { amount: 6900, currency_code: "usd" },
          { amount: 21100, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 70,
      },
      {
        title: "50ml Standard",
        sku: "PERFUME-DES-50",
        options: { Size: "50ml" },
        prices: [
          { amount: 9900, currency_code: "usd" },
          { amount: 30200, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 55,
      },
      {
        title: "100ml Full Size",
        sku: "PERFUME-DES-100",
        options: { Size: "100ml" },
        prices: [
          { amount: 14900, currency_code: "usd" },
          { amount: 45500, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 40,
      },
    ],
  },
  {
    title: "Professional Hair Dryer",
    description:
      "Ionic technology hair dryer with multiple heat settings and concentrator attachments. Lightweight design for salon-quality results.",
    handle: "professional-hair-dryer",
    category: "Health & Beauty",
    thumbnail: getUnsplashImage("beauty", 3),
    images: [getUnsplashImage("beauty", 3), getUnsplashImage("beauty", 4)],
    options: [{ title: "Color", values: ["Rose Gold", "Matte Black", "White"] }],
    variants: [
      {
        title: "Rose Gold",
        sku: "HAIRDRYER-RSG",
        options: { Color: "Rose Gold" },
        prices: [
          { amount: 8900, currency_code: "usd" },
          { amount: 27200, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 40,
      },
      {
        title: "Matte Black",
        sku: "HAIRDRYER-BLK",
        options: { Color: "Matte Black" },
        prices: [
          { amount: 8900, currency_code: "usd" },
          { amount: 27200, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 50,
      },
      {
        title: "White",
        sku: "HAIRDRYER-WHT",
        options: { Color: "White" },
        prices: [
          { amount: 8900, currency_code: "usd" },
          { amount: 27200, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 35,
      },
    ],
  },
  {
    title: "Organic Essential Oils Set",
    description:
      "Collection of 6 pure essential oils: lavender, peppermint, eucalyptus, tea tree, lemon, and orange. Perfect for aromatherapy and wellness.",
    handle: "organic-essential-oils-set",
    category: "Health & Beauty",
    thumbnail: getUnsplashImage("wellness", 1),
    images: [getUnsplashImage("wellness", 1), getUnsplashImage("wellness", 2)],
    options: [{ title: "Set", values: ["Starter Set (6)", "Premium Set (12)"] }],
    variants: [
      {
        title: "Starter Set - 6 Oils",
        sku: "OILS-ESSENTIAL-6",
        options: { Set: "Starter Set (6)" },
        prices: [
          { amount: 3900, currency_code: "usd" },
          { amount: 11900, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 80,
      },
      {
        title: "Premium Set - 12 Oils",
        sku: "OILS-ESSENTIAL-12",
        options: { Set: "Premium Set (12)" },
        prices: [
          { amount: 6900, currency_code: "usd" },
          { amount: 21100, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 50,
      },
    ],
  },
  {
    title: "Electric Toothbrush Pro",
    description:
      "Sonic electric toothbrush with 5 cleaning modes, smart timer, and pressure sensor. Includes 3 brush heads and travel case.",
    handle: "electric-toothbrush-pro",
    category: "Health & Beauty",
    thumbnail: getUnsplashImage("beauty", 5),
    images: [getUnsplashImage("beauty", 5), getUnsplashImage("beauty", 6)],
    options: [{ title: "Color", values: ["White", "Black", "Pink"] }],
    variants: [
      {
        title: "White",
        sku: "TOOTHBRUSH-E-WHT",
        options: { Color: "White" },
        prices: [
          { amount: 7900, currency_code: "usd" },
          { amount: 24100, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 65,
      },
      {
        title: "Black",
        sku: "TOOTHBRUSH-E-BLK",
        options: { Color: "Black" },
        prices: [
          { amount: 7900, currency_code: "usd" },
          { amount: 24100, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 55,
      },
      {
        title: "Pink",
        sku: "TOOTHBRUSH-E-PNK",
        options: { Color: "Pink" },
        prices: [
          { amount: 7900, currency_code: "usd" },
          { amount: 24100, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 45,
      },
    ],
  },

  // === SPORTS & OUTDOORS (New Category) ===
  {
    title: "Premium Yoga Mat",
    description:
      "Extra thick non-slip yoga mat with alignment lines. Eco-friendly TPE material, includes carrying strap. Perfect for yoga and pilates.",
    handle: "premium-yoga-mat",
    category: "Sports & Outdoors",
    thumbnail: getUnsplashImage("yoga", 1),
    images: [getUnsplashImage("yoga", 1), getUnsplashImage("yoga", 2)],
    options: [{ title: "Color", values: ["Purple", "Blue", "Green", "Black"] }],
    variants: [
      {
        title: "Purple",
        sku: "YOGA-MAT-PUR",
        options: { Color: "Purple" },
        prices: [
          { amount: 4900, currency_code: "usd" },
          { amount: 14900, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 60,
      },
      {
        title: "Blue",
        sku: "YOGA-MAT-BLU",
        options: { Color: "Blue" },
        prices: [
          { amount: 4900, currency_code: "usd" },
          { amount: 14900, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 55,
      },
      {
        title: "Green",
        sku: "YOGA-MAT-GRN",
        options: { Color: "Green" },
        prices: [
          { amount: 4900, currency_code: "usd" },
          { amount: 14900, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 50,
      },
      {
        title: "Black",
        sku: "YOGA-MAT-BLK",
        options: { Color: "Black" },
        prices: [
          { amount: 4900, currency_code: "usd" },
          { amount: 14900, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 70,
      },
    ],
  },
  {
    title: "Fitness Tracker Band",
    description:
      "Advanced fitness tracker with heart rate monitor, sleep tracking, and 7-day battery life. Water-resistant with smartphone notifications.",
    handle: "fitness-tracker-band",
    category: "Sports & Outdoors",
    thumbnail: getUnsplashImage("sports", 1),
    images: [getUnsplashImage("sports", 1), getUnsplashImage("sports", 2)],
    options: [{ title: "Color", values: ["Black", "Navy", "Coral"] }],
    variants: [
      {
        title: "Black",
        sku: "FITNESS-TRACK-BLK",
        options: { Color: "Black" },
        prices: [
          { amount: 6900, currency_code: "usd" },
          { amount: 21100, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 80,
      },
      {
        title: "Navy",
        sku: "FITNESS-TRACK-NVY",
        options: { Color: "Navy" },
        prices: [
          { amount: 6900, currency_code: "usd" },
          { amount: 21100, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 65,
      },
      {
        title: "Coral",
        sku: "FITNESS-TRACK-COR",
        options: { Color: "Coral" },
        prices: [
          { amount: 6900, currency_code: "usd" },
          { amount: 21100, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 50,
      },
    ],
  },
  {
    title: "Adjustable Dumbbell Set",
    description:
      "Space-saving adjustable dumbbells from 5-52.5 lbs per hand. Quick-change mechanism for seamless weight transitions during workouts.",
    handle: "adjustable-dumbbell-set",
    category: "Sports & Outdoors",
    thumbnail: getUnsplashImage("sports", 3),
    images: [getUnsplashImage("sports", 3), getUnsplashImage("sports", 4)],
    options: [{ title: "Set", values: ["Single", "Pair"] }],
    variants: [
      {
        title: "Single Dumbbell",
        sku: "DUMBBELL-ADJ-1",
        options: { Set: "Single" },
        prices: [
          { amount: 29900, currency_code: "usd" },
          { amount: 91400, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 25,
      },
      {
        title: "Pair of Dumbbells",
        sku: "DUMBBELL-ADJ-2",
        options: { Set: "Pair" },
        prices: [
          { amount: 54900, currency_code: "usd" },
          { amount: 167800, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 15,
      },
    ],
  },
  {
    title: "Camping Tent 4-Person",
    description:
      "Spacious waterproof tent with easy setup, mesh windows, and rainfly. Includes carrying bag and stakes. Perfect for family camping trips.",
    handle: "camping-tent-4-person",
    category: "Sports & Outdoors",
    thumbnail: getUnsplashImage("outdoor", 1),
    images: [getUnsplashImage("outdoor", 1), getUnsplashImage("outdoor", 2)],
    options: [{ title: "Size", values: ["2-Person", "4-Person", "6-Person"] }],
    variants: [
      {
        title: "2-Person",
        sku: "TENT-CAMP-2P",
        options: { Size: "2-Person" },
        prices: [
          { amount: 8900, currency_code: "usd" },
          { amount: 27200, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 30,
      },
      {
        title: "4-Person",
        sku: "TENT-CAMP-4P",
        options: { Size: "4-Person" },
        prices: [
          { amount: 14900, currency_code: "usd" },
          { amount: 45500, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 25,
      },
      {
        title: "6-Person",
        sku: "TENT-CAMP-6P",
        options: { Size: "6-Person" },
        prices: [
          { amount: 19900, currency_code: "usd" },
          { amount: 60800, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 15,
      },
    ],
  },
  {
    title: "Insulated Water Bottle",
    description:
      "Double-wall vacuum insulated stainless steel bottle. Keeps drinks cold 24 hours or hot 12 hours. BPA-free with leak-proof lid.",
    handle: "insulated-water-bottle",
    category: "Sports & Outdoors",
    thumbnail: getUnsplashImage("sports", 5),
    images: [getUnsplashImage("sports", 5), getUnsplashImage("sports", 6)],
    options: [
      { title: "Size", values: ["500ml", "750ml", "1L"] },
      { title: "Color", values: ["Silver", "Black", "Blue"] },
    ],
    variants: [
      {
        title: "500ml / Silver",
        sku: "BOTTLE-INS-500-SLV",
        options: { Size: "500ml", Color: "Silver" },
        prices: [
          { amount: 2900, currency_code: "usd" },
          { amount: 8800, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 100,
      },
      {
        title: "750ml / Black",
        sku: "BOTTLE-INS-750-BLK",
        options: { Size: "750ml", Color: "Black" },
        prices: [
          { amount: 3400, currency_code: "usd" },
          { amount: 10400, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 90,
      },
      {
        title: "1L / Blue",
        sku: "BOTTLE-INS-1L-BLU",
        options: { Size: "1L", Color: "Blue" },
        prices: [
          { amount: 3900, currency_code: "usd" },
          { amount: 11900, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 80,
      },
    ],
  },
  {
    title: "Resistance Bands Set",
    description:
      "Complete resistance bands set with 5 different resistance levels, handles, door anchor, and ankle straps. Includes workout guide.",
    handle: "resistance-bands-set",
    category: "Sports & Outdoors",
    thumbnail: getUnsplashImage("sports", 7),
    images: [getUnsplashImage("sports", 7), getUnsplashImage("sports", 8)],
    options: [{ title: "Set", values: ["Basic (3 Bands)", "Complete (5 Bands)"] }],
    variants: [
      {
        title: "Basic Set - 3 Bands",
        sku: "BANDS-RES-3",
        options: { Set: "Basic (3 Bands)" },
        prices: [
          { amount: 1900, currency_code: "usd" },
          { amount: 5800, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 100,
      },
      {
        title: "Complete Set - 5 Bands",
        sku: "BANDS-RES-5",
        options: { Set: "Complete (5 Bands)" },
        prices: [
          { amount: 2900, currency_code: "usd" },
          { amount: 8800, currency_code: "kwd" },
        ],
        manage_inventory: true,
        inventory_quantity: 80,
      },
    ],
  },
]

/**
 * Main seed function exported for Medusa CLI
 */
export default async function seedProducts({ container }: { container: any }) {
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
