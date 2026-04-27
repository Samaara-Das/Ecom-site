// @ts-nocheck
/**
 * Seed script: 60 Kuwait Marketplace products (v2)
 * Idempotent — checks by handle before creating.
 * Prices in fils (KWD): 1 KWD = 1000 fils, so 285 KWD = 285000
 *
 * Run with: npx medusa exec ./src/scripts/seed-products-v2.ts
 */

import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import {
  createProductsWorkflow,
  createInventoryLevelsWorkflow,
} from "@medusajs/medusa/core-flows"

// Image URL helper — specific Unsplash photo IDs known to show the correct subject
const uns = (id: string) =>
  `https://images.unsplash.com/${id}?w=600&h=600&fit=crop&auto=format`
const pcs = (slug: string) => `https://picsum.photos/seed/${slug}/600/600`

// Known photo IDs by category
const IMG = {
  phone: [
    "photo-1511707171634-5f897ff02aa9",
    "photo-1592750475338-74b7b21085ab",
  ],
  laptop: [
    "photo-1496181133206-80ce9b88a853",
    "photo-1517336714731-489689fd1ca8",
  ],
  headphones: [
    "photo-1505740420928-5e560c06d30e",
    "photo-1546435770-a3e426bf472b",
  ],
  gaming: [
    "photo-1606144042614-b2417e99c4e3",
    "photo-1593305841991-05c297ba4575",
  ],
  tablet: [
    "photo-1544244015-0df4b3ffc6b0",
    "photo-1561154464-82e9adf32764",
  ],
  drone: [
    "photo-1473968512647-3e447244af8f",
    "photo-1527977966376-1c8408f9f108",
  ],
  watches: [
    "photo-1524592094714-0f0654e359b1",
    "photo-1508057198894-247b23fe5ade",
  ],
  shoes: [
    "photo-1542291026-7eec264c27ff",
    "photo-1491553895911-0055eca6402d",
  ],
  bags: [
    "photo-1548036328-c9fa89d128fa",
    "photo-1590874103328-eac38a683ce7",
  ],
  sunglasses: [
    "photo-1572635196237-14b3f281503f",
    "photo-1577803645773-f96470509666",
  ],
  fashion: [
    "photo-1489987707025-afc232f7ea0f",
    "photo-1556821840-3a63f15732ce",
  ],
  perfume: [
    "photo-1588405748880-12d1d2a59f75",
    "photo-1541643600914-78b084683702",
  ],
  skincare: [
    "photo-1596462502278-27bfdc403348",
    "photo-1571781926291-c477ebfd024b",
  ],
  makeup: [
    "photo-1512496015851-a90fb38ba796",
    "photo-1522338242992-e1a54906a8da",
  ],
  food: [
    "photo-1609601442485-4522e0b06d7d",
    "photo-1558618666-fcd25c85cd64",
  ],
  honey: [
    "photo-1587049352846-4a222e784d38",
    "photo-1558642891-54be180ea339",
  ],
  coffee: [
    "photo-1447933601403-0c6688de566e",
    "photo-1495474472287-4d71bcdd2085",
  ],
  rice: [
    "photo-1516684732162-798a0062be99",
    "photo-1586201375761-83865001e31c",
  ],
  fitness: [
    "photo-1571019613454-1cb2f99b2d8b",
    "photo-1534438327276-14e5300c3a48",
  ],
  yoga: [
    "photo-1544367567-0f2fcb009e0b",
    "photo-1506126613408-eca07ce68773",
  ],
  kitchen: [
    "photo-1556909114-f6e7ad7d3136",
    "photo-1565538810643-b5bdb6cc3f34",
  ],
  tv: [
    "photo-1593359677879-a4bb92f4834c",
    "photo-1593642632559-0c6d3fc62b89",
  ],
}

interface Variant {
  title: string
  sku: string
  options: Record<string, string>
  prices: { amount: number; currency_code: string }[]
  inventory_quantity: number
}

interface Product {
  title: string
  handle: string
  description: string
  thumbnail: string
  images: string[]
  options: { title: string; values: string[] }[]
  variants: Variant[]
  category: string
}

const kwd = (n: number) => ({ amount: Math.round(n * 1000), currency_code: "kwd" })

const PRODUCTS: Product[] = [
  // ===================== ELECTRONICS (15) =====================
  {
    title: "Samsung Galaxy S25 Ultra",
    handle: "samsung-galaxy-s25-ultra",
    description:
      "The Samsung Galaxy S25 Ultra features a 6.9-inch Dynamic AMOLED 2X display with 2600 nits peak brightness and 120Hz adaptive refresh. Powered by the Snapdragon 8 Elite processor with 12GB RAM, it includes an integrated S Pen stylus and a 200MP quad-camera system. The 5000mAh battery with 45W fast charging keeps you powered through the day.",
    thumbnail: uns(IMG.phone[0]),
    images: [uns(IMG.phone[0]), uns(IMG.phone[1])],
    options: [{ title: "Color", values: ["Titanium Black", "Titanium Grey", "Titanium Violet", "Titanium Yellow", "Titanium Blue"] }],
    variants: [
      { title: "Titanium Black", sku: "SGS25U-BLK", options: { Color: "Titanium Black" }, prices: [kwd(285)], inventory_quantity: 45 },
      { title: "Titanium Grey", sku: "SGS25U-GRY", options: { Color: "Titanium Grey" }, prices: [kwd(285)], inventory_quantity: 30 },
      { title: "Titanium Violet", sku: "SGS25U-VIO", options: { Color: "Titanium Violet" }, prices: [kwd(290)], inventory_quantity: 20 },
      { title: "Titanium Yellow", sku: "SGS25U-YLW", options: { Color: "Titanium Yellow" }, prices: [kwd(290)], inventory_quantity: 15 },
      { title: "Titanium Blue", sku: "SGS25U-BLU", options: { Color: "Titanium Blue" }, prices: [kwd(295)], inventory_quantity: 10 },
    ],
    category: "Electronics",
  },
  {
    title: "Apple iPhone 16 Pro Max",
    handle: "apple-iphone-16-pro-max",
    description:
      "Apple iPhone 16 Pro Max sports a 6.9-inch Super Retina XDR ProMotion display with always-on technology. The A18 Pro chip with 16-core Neural Engine delivers industry-leading performance for photography, gaming, and AI tasks. Features a 48MP main camera with 5x optical zoom and a 4422mAh battery supporting MagSafe wireless charging.",
    thumbnail: uns(IMG.phone[1]),
    images: [uns(IMG.phone[1]), uns(IMG.phone[0])],
    options: [{ title: "Storage", values: ["256GB", "512GB", "1TB"] }],
    variants: [
      { title: "256GB", sku: "IP16PM-256", options: { Storage: "256GB" }, prices: [kwd(320)], inventory_quantity: 40 },
      { title: "512GB", sku: "IP16PM-512", options: { Storage: "512GB" }, prices: [kwd(350)], inventory_quantity: 25 },
      { title: "1TB", sku: "IP16PM-1TB", options: { Storage: "1TB" }, prices: [kwd(380)], inventory_quantity: 15 },
    ],
    category: "Electronics",
  },
  {
    title: "MacBook Pro 14-inch M4",
    handle: "macbook-pro-14-m4",
    description:
      "MacBook Pro 14-inch with M4 chip delivers up to 22 hours of battery life with a Liquid Retina XDR display at 1000 nits sustained brightness. The M4 chip's 10-core CPU and 10-core GPU handle video editing and 3D rendering with ease. Includes MagSafe 3 charging, Thunderbolt 4 ports, and an HDMI port.",
    thumbnail: uns(IMG.laptop[0]),
    images: [uns(IMG.laptop[0]), uns(IMG.laptop[1])],
    options: [{ title: "Configuration", values: ["16GB RAM / 512GB", "24GB RAM / 1TB"] }],
    variants: [
      { title: "16GB RAM / 512GB", sku: "MBP14M4-16-512", options: { Configuration: "16GB RAM / 512GB" }, prices: [kwd(590)], inventory_quantity: 20 },
      { title: "24GB RAM / 1TB", sku: "MBP14M4-24-1T", options: { Configuration: "24GB RAM / 1TB" }, prices: [kwd(790)], inventory_quantity: 12 },
    ],
    category: "Electronics",
  },
  {
    title: "Sony WH-1000XM6 Headphones",
    handle: "sony-wh-1000xm6",
    description:
      "Sony WH-1000XM6 offers industry-leading noise cancellation with Auto NC Optimizer and Precise Voice Pickup Technology for clear calls. The 30-hour battery life with Quick Charge (3 minutes = 3 hours) and multipoint Bluetooth connection support up to two devices simultaneously. Fold-flat design fits neatly in the carrying case.",
    thumbnail: uns(IMG.headphones[0]),
    images: [uns(IMG.headphones[0]), uns(IMG.headphones[1])],
    options: [{ title: "Color", values: ["Midnight Black", "Platinum Silver"] }],
    variants: [
      { title: "Midnight Black", sku: "SONYWH6-BLK", options: { Color: "Midnight Black" }, prices: [kwd(110)], inventory_quantity: 60 },
      { title: "Platinum Silver", sku: "SONYWH6-SLV", options: { Color: "Platinum Silver" }, prices: [kwd(110)], inventory_quantity: 40 },
    ],
    category: "Electronics",
  },
  {
    title: "iPad Air M2",
    handle: "ipad-air-m2",
    description:
      "iPad Air with M2 chip comes in an ultra-thin 6.1mm design with a 11-inch Liquid Retina display. The M2 chip is 50% faster than M1 with 8-core CPU and 9-core GPU supporting ProRes video playback. Compatible with Apple Pencil Pro and the redesigned Magic Keyboard with trackpad for a full laptop-like experience.",
    thumbnail: uns(IMG.tablet[0]),
    images: [uns(IMG.tablet[0]), uns(IMG.tablet[1])],
    options: [{ title: "Storage", values: ["128GB", "256GB", "512GB"] }],
    variants: [
      { title: "128GB", sku: "IPADAIRM2-128", options: { Storage: "128GB" }, prices: [kwd(195)], inventory_quantity: 30 },
      { title: "256GB", sku: "IPADAIRM2-256", options: { Storage: "256GB" }, prices: [kwd(235)], inventory_quantity: 20 },
      { title: "512GB", sku: "IPADAIRM2-512", options: { Storage: "512GB" }, prices: [kwd(280)], inventory_quantity: 10 },
    ],
    category: "Electronics",
  },
  {
    title: "PlayStation 5 Slim",
    handle: "playstation-5-slim",
    description:
      "PlayStation 5 Slim is 30% smaller than the original PS5 while retaining the same ultra-high-speed SSD (825GB), ray tracing, and 120fps gaming capability. The DualSense controller with haptic feedback and adaptive triggers delivers an immersive gaming experience. Now includes detachable disc drive option.",
    thumbnail: uns(IMG.gaming[0]),
    images: [uns(IMG.gaming[0]), uns(IMG.gaming[1])],
    options: [{ title: "Edition", values: ["Disc Edition", "Digital Edition"] }],
    variants: [
      { title: "Disc Edition", sku: "PS5SLIM-DISC", options: { Edition: "Disc Edition" }, prices: [kwd(180)], inventory_quantity: 25 },
      { title: "Digital Edition", sku: "PS5SLIM-DIG", options: { Edition: "Digital Edition" }, prices: [kwd(160)], inventory_quantity: 30 },
    ],
    category: "Electronics",
  },
  {
    title: "Samsung 65-inch OLED 4K TV",
    handle: "samsung-65-oled-4k-tv",
    description:
      "Samsung S95D 65-inch QD-OLED 4K TV delivers perfect blacks and infinite contrast powered by the Neural Quantum Processor 4K with AI upscaling. Glare-free matte display technology ensures comfortable viewing in bright rooms. Features 4 HDMI 2.1 ports, Wi-Fi 6E, and Dolby Atmos support for a complete home cinema experience.",
    thumbnail: uns(IMG.tv[0]),
    images: [uns(IMG.tv[0]), uns(IMG.tv[1])],
    options: [{ title: "Size", values: ["65-inch"] }],
    variants: [
      { title: "65-inch", sku: "SAMS65OLED-65", options: { Size: "65-inch" }, prices: [kwd(650)], inventory_quantity: 12 },
    ],
    category: "Electronics",
  },
  {
    title: "DJI Mini 4 Pro Drone",
    handle: "dji-mini-4-pro",
    description:
      "DJI Mini 4 Pro is a sub-249g drone featuring omnidirectional obstacle sensing, 4K/60fps HDR video, and a 1/1.3-inch CMOS sensor. ActiveTrack 360 keeps subjects perfectly framed during complex manoeuvres. Up to 34 minutes flight time and 20km video transmission range make it perfect for professional content creation.",
    thumbnail: uns(IMG.drone[0]),
    images: [uns(IMG.drone[0]), uns(IMG.drone[1])],
    options: [{ title: "Kit", values: ["Standard", "Fly More Combo"] }],
    variants: [
      { title: "Standard", sku: "DJIMINI4-STD", options: { Kit: "Standard" }, prices: [kwd(290)], inventory_quantity: 18 },
      { title: "Fly More Combo", sku: "DJIMINI4-FMC", options: { Kit: "Fly More Combo" }, prices: [kwd(360)], inventory_quantity: 10 },
    ],
    category: "Electronics",
  },
  {
    title: "Apple Watch Series 10",
    handle: "apple-watch-series-10",
    description:
      "Apple Watch Series 10 is the thinnest Apple Watch ever at 9.7mm with a 30% larger display than Series 4. New sleep apnea detection, water depth sensor, and water temperature sensor make it the most health-focused Apple Watch yet. The wide-angle OLED display with 2000 nits peak brightness is readable even in direct sunlight.",
    thumbnail: uns(IMG.watches[0]),
    images: [uns(IMG.watches[0]), uns(IMG.watches[1])],
    options: [{ title: "Band", values: ["Sport Band", "Milanese Loop"] }],
    variants: [
      { title: "Sport Band", sku: "AW10-SPORT", options: { Band: "Sport Band" }, prices: [kwd(145)], inventory_quantity: 35 },
      { title: "Milanese Loop", sku: "AW10-MILAN", options: { Band: "Milanese Loop" }, prices: [kwd(165)], inventory_quantity: 20 },
    ],
    category: "Electronics",
  },
  {
    title: "Dyson V15 Detect Vacuum",
    handle: "dyson-v15-detect",
    description:
      "Dyson V15 Detect uses a laser to reveal microscopic dust invisible to the naked eye, then auto-adjusts suction power accordingly. The HEPA filtration captures 99.97% of particles as small as 0.3 microns. Up to 60 minutes run time on a single charge, with a piezo sensor that counts and sizes every particle for real-time cleaning reports.",
    thumbnail: pcs("dyson-v15-detect"),
    images: [pcs("dyson-v15-detect"), pcs("dyson-v15-detect-2")],
    options: [{ title: "Color", values: ["Nickel/Yellow"] }],
    variants: [
      { title: "Nickel/Yellow", sku: "DYSONV15-NY", options: { Color: "Nickel/Yellow" }, prices: [kwd(210)], inventory_quantity: 22 },
    ],
    category: "Electronics",
  },
  {
    title: "Nespresso Vertuo Next",
    handle: "nespresso-vertuo-next",
    description:
      "Nespresso Vertuo Next uses Centrifusion technology — spinning pods up to 7000 rpm — to brew the perfect espresso, double espresso, gran lungo, mug, or alto with one touch. Bluetooth and Wi-Fi connectivity enable Smart capsule recognition for automatic machine parameter settings. Compact design fits on any countertop.",
    thumbnail: uns(IMG.coffee[0]),
    images: [uns(IMG.coffee[0]), uns(IMG.coffee[1])],
    options: [{ title: "Color", values: ["Matte Black", "White"] }],
    variants: [
      { title: "Matte Black", sku: "NESVERTUO-BLK", options: { Color: "Matte Black" }, prices: [kwd(75)], inventory_quantity: 40 },
      { title: "White", sku: "NESVERTUO-WHT", options: { Color: "White" }, prices: [kwd(75)], inventory_quantity: 30 },
    ],
    category: "Electronics",
  },
  {
    title: "Logitech MX Master 3S Mouse",
    handle: "logitech-mx-master-3s",
    description:
      "Logitech MX Master 3S features a quiet click mechanism that reduces click sound by 90% while delivering precise 8000 DPI tracking on any surface including glass. The electromagnetic MagSpeed scroll wheel can scroll 1000 lines per second. Connect to up to 3 computers and switch with a button click via Logi Bolt or Bluetooth.",
    thumbnail: pcs("logitech-mx-master-3s"),
    images: [pcs("logitech-mx-master-3s"), pcs("logitech-mx-master-3s-2")],
    options: [{ title: "Color", values: ["Graphite", "Pale Grey", "Space Grey"] }],
    variants: [
      { title: "Graphite", sku: "LMXM3S-GRH", options: { Color: "Graphite" }, prices: [kwd(45)], inventory_quantity: 60 },
      { title: "Pale Grey", sku: "LMXM3S-PGR", options: { Color: "Pale Grey" }, prices: [kwd(45)], inventory_quantity: 40 },
      { title: "Space Grey", sku: "LMXM3S-SGR", options: { Color: "Space Grey" }, prices: [kwd(45)], inventory_quantity: 30 },
    ],
    category: "Electronics",
  },
  {
    title: "Anker PowerBank 26800mAh",
    handle: "anker-powerbank-26800",
    description:
      "Anker's 26800mAh PowerCore Elite provides enough charge for an iPhone 16 over 6 times or a Galaxy S25 over 5 times. Three USB-A ports and one USB-C port enable simultaneous charging of up to 4 devices at 30W total output. PowerIQ 3.0 detects and delivers each device's optimal charging speed automatically.",
    thumbnail: pcs("anker-powerbank-26800"),
    images: [pcs("anker-powerbank-26800"), pcs("anker-powerbank-26800-2")],
    options: [{ title: "Color", values: ["Black", "White"] }],
    variants: [
      { title: "Black", sku: "ANKPB26800-BLK", options: { Color: "Black" }, prices: [kwd(22)], inventory_quantity: 80 },
      { title: "White", sku: "ANKPB26800-WHT", options: { Color: "White" }, prices: [kwd(22)], inventory_quantity: 50 },
    ],
    category: "Electronics",
  },
  {
    title: "Canon EOS R8 Camera",
    handle: "canon-eos-r8",
    description:
      "Canon EOS R8 is a full-frame mirrorless camera with a 24.2MP CMOS sensor and Dual Pixel CMOS AF II covering 100% of the frame with 6053 focus points. Records 4K/60p oversampled video with Cinema EOS colour science and dual IS mode. Compact body at just 461g makes it the lightest full-frame EOS R series camera.",
    thumbnail: pcs("canon-eos-r8"),
    images: [pcs("canon-eos-r8"), pcs("canon-eos-r8-2")],
    options: [{ title: "Kit", values: ["Body Only", "RF 24-50mm Kit"] }],
    variants: [
      { title: "Body Only", sku: "CANEOSР8-BODY", options: { Kit: "Body Only" }, prices: [kwd(520)], inventory_quantity: 10 },
      { title: "RF 24-50mm Kit", sku: "CANEOSR8-KIT", options: { Kit: "RF 24-50mm Kit" }, prices: [kwd(650)], inventory_quantity: 8 },
    ],
    category: "Electronics",
  },
  {
    title: "JBL Flip 6 Speaker",
    handle: "jbl-flip-6",
    description:
      "JBL Flip 6 is an IP67 waterproof and dustproof portable Bluetooth speaker with 12 hours of playtime and JBL Signature Sound. A separate tweeter and two JBL bass radiators work together to produce crisp highs and surprisingly powerful lows. PartyBoost connects multiple JBL speakers for stereo or party mode.",
    thumbnail: pcs("jbl-flip-6"),
    images: [pcs("jbl-flip-6"), pcs("jbl-flip-6-2")],
    options: [{ title: "Color", values: ["Black", "Red", "Blue", "Squad"] }],
    variants: [
      { title: "Black", sku: "JBLFLIP6-BLK", options: { Color: "Black" }, prices: [kwd(38)], inventory_quantity: 70 },
      { title: "Red", sku: "JBLFLIP6-RED", options: { Color: "Red" }, prices: [kwd(38)], inventory_quantity: 50 },
      { title: "Blue", sku: "JBLFLIP6-BLU", options: { Color: "Blue" }, prices: [kwd(38)], inventory_quantity: 40 },
      { title: "Squad", sku: "JBLFLIP6-SQD", options: { Color: "Squad" }, prices: [kwd(38)], inventory_quantity: 30 },
    ],
    category: "Electronics",
  },

  // ===================== FASHION (15) =====================
  {
    title: "Nike Air Max 270",
    handle: "nike-air-max-270",
    description:
      "Nike Air Max 270 features the largest heel Air unit yet for all-day comfort and a bold lifestyle statement. The mesh upper keeps feet cool while the foam midsole provides lightweight cushioning. Available in EU sizes 40–46 in three colourways engineered specifically for the Gulf climate and active lifestyle.",
    thumbnail: uns(IMG.shoes[0]),
    images: [uns(IMG.shoes[0]), uns(IMG.shoes[1])],
    options: [
      { title: "Size (EU)", values: ["40", "41", "42", "43", "44", "45", "46"] },
      { title: "Color", values: ["Black/White", "White/Blue", "Triple Black"] },
    ],
    variants: [
      { title: "42 / Black/White", sku: "NAM270-42-BW", options: { "Size (EU)": "42", Color: "Black/White" }, prices: [kwd(48)], inventory_quantity: 25 },
      { title: "43 / Black/White", sku: "NAM270-43-BW", options: { "Size (EU)": "43", Color: "Black/White" }, prices: [kwd(48)], inventory_quantity: 30 },
      { title: "44 / White/Blue", sku: "NAM270-44-WB", options: { "Size (EU)": "44", Color: "White/Blue" }, prices: [kwd(48)], inventory_quantity: 20 },
      { title: "42 / Triple Black", sku: "NAM270-42-TB", options: { "Size (EU)": "42", Color: "Triple Black" }, prices: [kwd(48)], inventory_quantity: 15 },
    ],
    category: "Fashion",
  },
  {
    title: "Adidas Ultraboost 24",
    handle: "adidas-ultraboost-24",
    description:
      "Adidas Ultraboost 24 features the next evolution of BOOST midsole technology with a Linear Energy Push system that returns more energy per stride. The Primeknit+ upper adapts to the natural movement of your foot for a second-skin fit. Designed for long-distance running and all-day wear with exceptional responsiveness.",
    thumbnail: uns(IMG.shoes[1]),
    images: [uns(IMG.shoes[1]), uns(IMG.shoes[0])],
    options: [
      { title: "Size (EU)", values: ["39", "40", "41", "42", "43", "44", "45"] },
      { title: "Color", values: ["Core Black", "Cloud White"] },
    ],
    variants: [
      { title: "42 / Core Black", sku: "ADUB24-42-BLK", options: { "Size (EU)": "42", Color: "Core Black" }, prices: [kwd(55)], inventory_quantity: 25 },
      { title: "43 / Core Black", sku: "ADUB24-43-BLK", options: { "Size (EU)": "43", Color: "Core Black" }, prices: [kwd(55)], inventory_quantity: 20 },
      { title: "42 / Cloud White", sku: "ADUB24-42-WHT", options: { "Size (EU)": "42", Color: "Cloud White" }, prices: [kwd(55)], inventory_quantity: 18 },
      { title: "43 / Cloud White", sku: "ADUB24-43-WHT", options: { "Size (EU)": "43", Color: "Cloud White" }, prices: [kwd(55)], inventory_quantity: 15 },
    ],
    category: "Fashion",
  },
  {
    title: "Levi's 511 Slim Jeans",
    handle: "levis-511-slim-jeans",
    description:
      "Levi's 511 Slim Jeans are engineered with Flex technology for unrestricted movement throughout your day. Sits below the waist with a slim fit through the thigh and leg opening. Made from 98% cotton and 2% elastane for long-lasting comfort. Available in classic indigo rinse and stone wash finishes.",
    thumbnail: uns(IMG.fashion[0]),
    images: [uns(IMG.fashion[0]), uns(IMG.fashion[1])],
    options: [
      { title: "Waist", values: ["30", "32", "34", "36"] },
      { title: "Wash", values: ["Indigo Rinse", "Stone Wash"] },
    ],
    variants: [
      { title: "32W / Indigo Rinse", sku: "LV511-32-IND", options: { Waist: "32", Wash: "Indigo Rinse" }, prices: [kwd(28)], inventory_quantity: 40 },
      { title: "34W / Indigo Rinse", sku: "LV511-34-IND", options: { Waist: "34", Wash: "Indigo Rinse" }, prices: [kwd(28)], inventory_quantity: 35 },
      { title: "32W / Stone Wash", sku: "LV511-32-STN", options: { Waist: "32", Wash: "Stone Wash" }, prices: [kwd(28)], inventory_quantity: 30 },
      { title: "34W / Stone Wash", sku: "LV511-34-STN", options: { Waist: "34", Wash: "Stone Wash" }, prices: [kwd(28)], inventory_quantity: 25 },
    ],
    category: "Fashion",
  },
  {
    title: "Zara Oversized Linen Shirt",
    handle: "zara-oversized-linen-shirt",
    description:
      "Effortlessly elegant oversized linen shirt crafted from 100% premium European linen for breathability in Kuwait's warm climate. Features a relaxed fit, dropped shoulders, and classic collar. Four colour options make it versatile for casual and smart-casual occasions. Machine washable and wrinkle-resistant after first wash.",
    thumbnail: uns(IMG.fashion[1]),
    images: [uns(IMG.fashion[1]), uns(IMG.fashion[0])],
    options: [
      { title: "Size", values: ["S", "M", "L", "XL"] },
      { title: "Color", values: ["Off White", "Sage Green", "Ecru", "Navy Blue"] },
    ],
    variants: [
      { title: "M / Off White", sku: "ZLINSH-M-OW", options: { Size: "M", Color: "Off White" }, prices: [kwd(18)], inventory_quantity: 50 },
      { title: "L / Off White", sku: "ZLINSH-L-OW", options: { Size: "L", Color: "Off White" }, prices: [kwd(18)], inventory_quantity: 40 },
      { title: "M / Sage Green", sku: "ZLINSH-M-SG", options: { Size: "M", Color: "Sage Green" }, prices: [kwd(18)], inventory_quantity: 30 },
      { title: "L / Navy Blue", sku: "ZLINSH-L-NB", options: { Size: "L", Color: "Navy Blue" }, prices: [kwd(18)], inventory_quantity: 25 },
    ],
    category: "Fashion",
  },
  {
    title: "Ray-Ban Aviator Classic",
    handle: "ray-ban-aviator-classic",
    description:
      "The original Ray-Ban Aviator with gold metal frame and G-15 lenses that filter out exactly the right amount of light. Crafted in Italy with UV400 protection and scratch-resistant lenses. The timeless teardrop shape suits all face shapes and remains one of the world's best-selling sunglasses.",
    thumbnail: uns(IMG.sunglasses[0]),
    images: [uns(IMG.sunglasses[0]), uns(IMG.sunglasses[1])],
    options: [{ title: "Lens", values: ["Classic Green", "Blue Gradient", "Polarised Brown"] }],
    variants: [
      { title: "Classic Green", sku: "RBAVGR-CLG", options: { Lens: "Classic Green" }, prices: [kwd(62)], inventory_quantity: 40 },
      { title: "Blue Gradient", sku: "RBAVGR-BLG", options: { Lens: "Blue Gradient" }, prices: [kwd(62)], inventory_quantity: 30 },
      { title: "Polarised Brown", sku: "RBAVGR-POB", options: { Lens: "Polarised Brown" }, prices: [kwd(68)], inventory_quantity: 25 },
    ],
    category: "Fashion",
  },
  {
    title: "Fossil Gen 6 Smartwatch",
    handle: "fossil-gen-6-smartwatch",
    description:
      "Fossil Gen 6 runs Wear OS 3.0 with 8GB storage and 1GB RAM for smooth app performance. The 1.28-inch AMOLED display with Corning Gorilla Glass 3 is visible in direct sunlight. Tracks heart rate, SpO2, sleep, and 24 workout modes. Charges to 80% in just 30 minutes via rapid charging technology.",
    thumbnail: uns(IMG.watches[1]),
    images: [uns(IMG.watches[1]), uns(IMG.watches[0])],
    options: [{ title: "Strap", values: ["Brown Leather", "Silver Stainless"] }],
    variants: [
      { title: "Brown Leather", sku: "FOSGN6-BRL", options: { Strap: "Brown Leather" }, prices: [kwd(95)], inventory_quantity: 30 },
      { title: "Silver Stainless", sku: "FOSGN6-SLS", options: { Strap: "Silver Stainless" }, prices: [kwd(95)], inventory_quantity: 25 },
    ],
    category: "Fashion",
  },
  {
    title: "Michael Kors Leather Tote",
    handle: "michael-kors-leather-tote",
    description:
      "Michael Kors Jet Set Large Leather Tote crafted from Saffiano leather with a structured silhouette and dual top handles. Interior features a zip compartment and four open slip pockets with logo lining. Signature MK gold-tone hardware and feet protect the base. Fits a 13-inch laptop for work and weekend versatility.",
    thumbnail: uns(IMG.bags[0]),
    images: [uns(IMG.bags[0]), uns(IMG.bags[1])],
    options: [{ title: "Color", values: ["Black", "Luggage Brown", "Navy"] }],
    variants: [
      { title: "Black", sku: "MKTOTE-BLK", options: { Color: "Black" }, prices: [kwd(145)], inventory_quantity: 20 },
      { title: "Luggage Brown", sku: "MKTOTE-LUG", options: { Color: "Luggage Brown" }, prices: [kwd(145)], inventory_quantity: 15 },
      { title: "Navy", sku: "MKTOTE-NVY", options: { Color: "Navy" }, prices: [kwd(145)], inventory_quantity: 12 },
    ],
    category: "Fashion",
  },
  {
    title: "Pandora Moments Bracelet",
    handle: "pandora-moments-bracelet",
    description:
      "Pandora Moments Sterling Silver Snake Chain bracelet is compatible with the full Pandora charm range. The lobster clasp ensures secure wear while allowing easy addition and removal of charms. Available in three sizes to fit wrists 16cm, 18cm, and 20cm. Includes a Pandora gift bag and certificate of authenticity.",
    thumbnail: pcs("pandora-moments-bracelet"),
    images: [pcs("pandora-moments-bracelet"), pcs("pandora-moments-bracelet-2")],
    options: [{ title: "Size", values: ["16cm", "18cm", "20cm"] }],
    variants: [
      { title: "16cm", sku: "PANDMOM-16", options: { Size: "16cm" }, prices: [kwd(55)], inventory_quantity: 35 },
      { title: "18cm", sku: "PANDMOM-18", options: { Size: "18cm" }, prices: [kwd(55)], inventory_quantity: 50 },
      { title: "20cm", sku: "PANDMOM-20", options: { Size: "20cm" }, prices: [kwd(55)], inventory_quantity: 25 },
    ],
    category: "Fashion",
  },
  {
    title: "Under Armour Project Rock Hoodie",
    handle: "under-armour-project-rock-hoodie",
    description:
      "Designed in collaboration with Dwayne 'The Rock' Johnson, this UA Rival Fleece hoodie uses UA Rival Fleece that starts softer and gets softer over time. The interior has a brushed finish for extra warmth and the cotton-blend fabric regulates temperature during intense workouts. Features Project Rock logo embroidery.",
    thumbnail: uns(IMG.fashion[0]),
    images: [uns(IMG.fashion[0]), uns(IMG.fashion[1])],
    options: [
      { title: "Size", values: ["S", "M", "L", "XL"] },
      { title: "Color", values: ["Black", "Grey"] },
    ],
    variants: [
      { title: "M / Black", sku: "UAPRH-M-BLK", options: { Size: "M", Color: "Black" }, prices: [kwd(38)], inventory_quantity: 35 },
      { title: "L / Black", sku: "UAPRH-L-BLK", options: { Size: "L", Color: "Black" }, prices: [kwd(38)], inventory_quantity: 30 },
      { title: "M / Grey", sku: "UAPRH-M-GRY", options: { Size: "M", Color: "Grey" }, prices: [kwd(38)], inventory_quantity: 25 },
      { title: "L / Grey", sku: "UAPRH-L-GRY", options: { Size: "L", Color: "Grey" }, prices: [kwd(38)], inventory_quantity: 20 },
    ],
    category: "Fashion",
  },
  {
    title: "H&M Premium Abaya",
    handle: "hm-premium-abaya",
    description:
      "H&M Premium Collection Abaya crafted from flowing crêpe fabric with a subtle lustre and excellent drape. Features a modest A-line silhouette with long sleeves, covered buttons, and an elegant embroidered hem. Designed for the contemporary Kuwaiti woman who values both modesty and style. Machine washable.",
    thumbnail: uns(IMG.fashion[1]),
    images: [uns(IMG.fashion[1]), uns(IMG.fashion[0])],
    options: [{ title: "Size", values: ["S", "M", "L", "XL"] }],
    variants: [
      { title: "S", sku: "HMABAYA-S", options: { Size: "S" }, prices: [kwd(22)], inventory_quantity: 40 },
      { title: "M", sku: "HMABAYA-M", options: { Size: "M" }, prices: [kwd(22)], inventory_quantity: 55 },
      { title: "L", sku: "HMABAYA-L", options: { Size: "L" }, prices: [kwd(22)], inventory_quantity: 45 },
      { title: "XL", sku: "HMABAYA-XL", options: { Size: "XL" }, prices: [kwd(22)], inventory_quantity: 30 },
    ],
    category: "Fashion",
  },
  {
    title: "Swarovski Crystal Earrings",
    handle: "swarovski-crystal-earrings",
    description:
      "Swarovski Crystal stud earrings set in rhodium-plated metal with precision-cut crystals that catch light beautifully at any angle. Each crystal is hand-faceted and polished to produce maximum brilliance and sparkle. Comes in a Swarovski gift box. Safe for sensitive ears with nickel-free posts.",
    thumbnail: pcs("swarovski-crystal-earrings"),
    images: [pcs("swarovski-crystal-earrings"), pcs("swarovski-crystal-earrings-2")],
    options: [{ title: "Style", values: ["Round Solitaire", "Heart Shape", "Square Cut", "Oval Brilliant"] }],
    variants: [
      { title: "Round Solitaire", sku: "SWCREAR-RND", options: { Style: "Round Solitaire" }, prices: [kwd(35)], inventory_quantity: 60 },
      { title: "Heart Shape", sku: "SWCREAR-HRT", options: { Style: "Heart Shape" }, prices: [kwd(35)], inventory_quantity: 45 },
      { title: "Square Cut", sku: "SWCREAR-SQR", options: { Style: "Square Cut" }, prices: [kwd(35)], inventory_quantity: 35 },
      { title: "Oval Brilliant", sku: "SWCREAR-OVL", options: { Style: "Oval Brilliant" }, prices: [kwd(35)], inventory_quantity: 30 },
    ],
    category: "Fashion",
  },
  {
    title: "Tommy Hilfiger Polo Shirt",
    handle: "tommy-hilfiger-polo",
    description:
      "Tommy Hilfiger Heritage Polo crafted from premium 100% pima cotton for a soft hand feel and excellent durability. The classic three-button placket and ribbed collar maintain their shape after repeated washing. Signature embroidered flag logo on the left chest. Available in three classic colourways for year-round versatility.",
    thumbnail: uns(IMG.fashion[0]),
    images: [uns(IMG.fashion[0]), uns(IMG.fashion[1])],
    options: [
      { title: "Size", values: ["S", "M", "L", "XL"] },
      { title: "Color", values: ["White", "Navy", "Red"] },
    ],
    variants: [
      { title: "M / White", sku: "THPOLO-M-WHT", options: { Size: "M", Color: "White" }, prices: [kwd(32)], inventory_quantity: 45 },
      { title: "L / White", sku: "THPOLO-L-WHT", options: { Size: "L", Color: "White" }, prices: [kwd(32)], inventory_quantity: 40 },
      { title: "M / Navy", sku: "THPOLO-M-NVY", options: { Size: "M", Color: "Navy" }, prices: [kwd(32)], inventory_quantity: 35 },
      { title: "L / Red", sku: "THPOLO-L-RED", options: { Size: "L", Color: "Red" }, prices: [kwd(32)], inventory_quantity: 25 },
    ],
    category: "Fashion",
  },
  {
    title: "Birkenstock Arizona Sandals",
    handle: "birkenstock-arizona-sandals",
    description:
      "Birkenstock Arizona features the original contoured cork-latex footbed that conforms to the shape of your foot for personalised support. The anatomically shaped footbed includes a deep heel cup, pronounced arch support, and toe bar. Available in soft leather and regular Birko-Flor for vegan-friendly comfort.",
    thumbnail: uns(IMG.shoes[0]),
    images: [uns(IMG.shoes[0]), uns(IMG.shoes[1])],
    options: [
      { title: "Size (EU)", values: ["36", "37", "38", "39", "40", "41", "42", "43", "44"] },
      { title: "Material", values: ["Leather", "Birko-Flor"] },
    ],
    variants: [
      { title: "40 / Leather", sku: "BIRKAZ-40-LTH", options: { "Size (EU)": "40", Material: "Leather" }, prices: [kwd(45)], inventory_quantity: 30 },
      { title: "41 / Leather", sku: "BIRKAZ-41-LTH", options: { "Size (EU)": "41", Material: "Leather" }, prices: [kwd(45)], inventory_quantity: 25 },
      { title: "40 / Birko-Flor", sku: "BIRKAZ-40-BF", options: { "Size (EU)": "40", Material: "Birko-Flor" }, prices: [kwd(38)], inventory_quantity: 35 },
      { title: "42 / Birko-Flor", sku: "BIRKAZ-42-BF", options: { "Size (EU)": "42", Material: "Birko-Flor" }, prices: [kwd(38)], inventory_quantity: 20 },
    ],
    category: "Fashion",
  },
  {
    title: "Longchamp Le Pliage Bag",
    handle: "longchamp-le-pliage",
    description:
      "Longchamp Le Pliage is the iconic foldable tote crafted from recycled nylon canvas with supple leather trim. Folds flat for travel and opens to a spacious interior with a zip closure and snap button. The laminated canvas is water-resistant, easy to wipe clean, and durable enough for daily commuter use.",
    thumbnail: uns(IMG.bags[1]),
    images: [uns(IMG.bags[1]), uns(IMG.bags[0])],
    options: [{ title: "Color", values: ["Ecru", "Black", "Navy"] }],
    variants: [
      { title: "Ecru", sku: "LCPLIAGE-ECR", options: { Color: "Ecru" }, prices: [kwd(88)], inventory_quantity: 20 },
      { title: "Black", sku: "LCPLIAGE-BLK", options: { Color: "Black" }, prices: [kwd(88)], inventory_quantity: 25 },
      { title: "Navy", sku: "LCPLIAGE-NVY", options: { Color: "Navy" }, prices: [kwd(88)], inventory_quantity: 15 },
    ],
    category: "Fashion",
  },
  {
    title: "Cartier-Style Love Bracelet",
    handle: "cartier-style-love-bracelet",
    description:
      "Inspired by the iconic Cartier Love design, this bracelet is crafted from 18K gold-plated 316L surgical stainless steel for lasting brilliance and hypoallergenic wear. The signature screw motif is engraved on the outer surface with a smooth interior. Comes with a screwdriver pendant for authenticity.",
    thumbnail: pcs("love-bracelet"),
    images: [pcs("love-bracelet"), pcs("love-bracelet-2")],
    options: [{ title: "Metal", values: ["Gold", "Silver", "Rose Gold"] }],
    variants: [
      { title: "Gold", sku: "LOVEBRC-GLD", options: { Metal: "Gold" }, prices: [kwd(25)], inventory_quantity: 50 },
      { title: "Silver", sku: "LOVEBRC-SLV", options: { Metal: "Silver" }, prices: [kwd(25)], inventory_quantity: 45 },
      { title: "Rose Gold", sku: "LOVEBRC-RSG", options: { Metal: "Rose Gold" }, prices: [kwd(25)], inventory_quantity: 40 },
    ],
    category: "Fashion",
  },

  // ===================== HEALTH & BEAUTY (12) =====================
  {
    title: "Charlotte Tilbury Hollywood Flawless Filter",
    handle: "charlotte-tilbury-flawless-filter",
    description:
      "Charlotte Tilbury's Hollywood Flawless Filter is a complexion booster that can be worn alone or mixed with foundation for a lit-from-within glow. The micro-fine light-reflecting pigments create a soft focus finish that blurs pores and evens skin tone. Available in 6 shades from fair porcelain to deep ebony.",
    thumbnail: uns(IMG.makeup[0]),
    images: [uns(IMG.makeup[0]), uns(IMG.makeup[1])],
    options: [{ title: "Shade", values: ["1 Fair", "2 Light", "3 Medium", "4 Medium/Deep", "5 Deep", "6 Ebony"] }],
    variants: [
      { title: "1 Fair", sku: "CTFF-S1", options: { Shade: "1 Fair" }, prices: [kwd(28)], inventory_quantity: 30 },
      { title: "2 Light", sku: "CTFF-S2", options: { Shade: "2 Light" }, prices: [kwd(28)], inventory_quantity: 35 },
      { title: "3 Medium", sku: "CTFF-S3", options: { Shade: "3 Medium" }, prices: [kwd(28)], inventory_quantity: 40 },
      { title: "4 Medium/Deep", sku: "CTFF-S4", options: { Shade: "4 Medium/Deep" }, prices: [kwd(28)], inventory_quantity: 30 },
      { title: "5 Deep", sku: "CTFF-S5", options: { Shade: "5 Deep" }, prices: [kwd(28)], inventory_quantity: 25 },
      { title: "6 Ebony", sku: "CTFF-S6", options: { Shade: "6 Ebony" }, prices: [kwd(28)], inventory_quantity: 20 },
    ],
    category: "Health & Beauty",
  },
  {
    title: "La Mer Moisturizing Cream 60ml",
    handle: "la-mer-moisturizing-cream-60ml",
    description:
      "La Mer's legendary Crème de la Mer harnesses the transformative power of Miracle Broth — a ferment of sea kelp, vitamins, minerals, and other nutrients. This rich moisturiser visibly reduces fine lines and wrinkles while deeply hydrating and restoring the skin's barrier. Dermatologist tested and suitable for all skin types.",
    thumbnail: uns(IMG.skincare[0]),
    images: [uns(IMG.skincare[0]), uns(IMG.skincare[1])],
    options: [{ title: "Size", values: ["60ml"] }],
    variants: [
      { title: "60ml", sku: "LAMERCREAM-60", options: { Size: "60ml" }, prices: [kwd(95)], inventory_quantity: 20 },
    ],
    category: "Health & Beauty",
  },
  {
    title: "Jo Malone London Peony & Blush Suede",
    handle: "jo-malone-peony-blush-suede",
    description:
      "Jo Malone London Peony & Blush Suede Cologne captures the fragrance of peonies in full bloom — a bouquet of peonies, red apples, and gillyflower, sueded with the warmth of raspberries and a base of suede. Light and layerable in Jo Malone London's signature style. Compliments of the season.",
    thumbnail: uns(IMG.perfume[0]),
    images: [uns(IMG.perfume[0]), uns(IMG.perfume[1])],
    options: [{ title: "Size", values: ["30ml", "100ml"] }],
    variants: [
      { title: "30ml", sku: "JMPEONY-30", options: { Size: "30ml" }, prices: [kwd(55)], inventory_quantity: 30 },
      { title: "100ml", sku: "JMPEONY-100", options: { Size: "100ml" }, prices: [kwd(130)], inventory_quantity: 20 },
    ],
    category: "Health & Beauty",
  },
  {
    title: "Olaplex No.3 Hair Perfector",
    handle: "olaplex-no3-hair-perfector",
    description:
      "Olaplex No.3 Hair Perfector is a weekly at-home treatment that repairs and strengthens hair by repairing broken disulfide bonds. A 10-minute treatment visibly reduces damage, breakage, and frizz for stronger, shinier, healthier-looking hair. Suitable for all hair types including colour-treated, bleached, and chemically processed hair.",
    thumbnail: uns(IMG.skincare[1]),
    images: [uns(IMG.skincare[1]), uns(IMG.skincare[0])],
    options: [{ title: "Size", values: ["100ml"] }],
    variants: [
      { title: "100ml", sku: "OLAPNO3-100", options: { Size: "100ml" }, prices: [kwd(22)], inventory_quantity: 60 },
    ],
    category: "Health & Beauty",
  },
  {
    title: "Fenty Beauty Pro Filt'r Foundation",
    handle: "fenty-beauty-pro-filtr-foundation",
    description:
      "Fenty Beauty Pro Filt'r Soft Matte Longwear Foundation offers 24-hour wear with a transfer-proof formula that never settles into pores. Available in 40 inclusive shades across six undertones to match every skin tone. Lightweight formula builds from medium to full coverage for a seamless, natural finish.",
    thumbnail: uns(IMG.makeup[1]),
    images: [uns(IMG.makeup[1]), uns(IMG.makeup[0])],
    options: [{ title: "Shade", values: ["100W", "130N", "180W", "230N", "290W", "310W", "370N", "440W", "490N", "500N"] }],
    variants: [
      { title: "100W", sku: "FBPFF-100W", options: { Shade: "100W" }, prices: [kwd(18)], inventory_quantity: 25 },
      { title: "130N", sku: "FBPFF-130N", options: { Shade: "130N" }, prices: [kwd(18)], inventory_quantity: 30 },
      { title: "180W", sku: "FBPFF-180W", options: { Shade: "180W" }, prices: [kwd(18)], inventory_quantity: 35 },
      { title: "230N", sku: "FBPFF-230N", options: { Shade: "230N" }, prices: [kwd(18)], inventory_quantity: 30 },
      { title: "290W", sku: "FBPFF-290W", options: { Shade: "290W" }, prices: [kwd(18)], inventory_quantity: 25 },
    ],
    category: "Health & Beauty",
  },
  {
    title: "Drunk Elephant C-Firma Vitamin C Serum",
    handle: "drunk-elephant-c-firma-serum",
    description:
      "Drunk Elephant C-Firma Day Serum contains a potent 15% L-ascorbic acid blend with ferulic acid and vitamin E to neutralise free radical damage and visibly brighten skin tone. The firming serum strengthens the skin's barrier and promotes collagen synthesis for firmer, more even-toned complexion over time.",
    thumbnail: uns(IMG.skincare[0]),
    images: [uns(IMG.skincare[0]), uns(IMG.skincare[1])],
    options: [{ title: "Size", values: ["30ml"] }],
    variants: [
      { title: "30ml", sku: "DECFIRMA-30", options: { Size: "30ml" }, prices: [kwd(68)], inventory_quantity: 25 },
    ],
    category: "Health & Beauty",
  },
  {
    title: "Dyson Airwrap Complete Long",
    handle: "dyson-airwrap-complete-long",
    description:
      "Dyson Airwrap Complete Long uses air instead of extreme heat to style hair — preserving shine and preventing frizz. The Coanda effect attracts and wraps hair around the barrel without a clamp. Includes six attachments: curl barrels (1.2-inch and 1.6-inch), round volumising brush, paddle brush, and wave barrels.",
    thumbnail: pcs("dyson-airwrap-complete"),
    images: [pcs("dyson-airwrap-complete"), pcs("dyson-airwrap-complete-2")],
    options: [{ title: "Color", values: ["Prussian Blue/Rich Copper", "Nickel/Copper"] }],
    variants: [
      { title: "Prussian Blue/Rich Copper", sku: "DYAIRWRAP-PBRC", options: { Color: "Prussian Blue/Rich Copper" }, prices: [kwd(295)], inventory_quantity: 12 },
      { title: "Nickel/Copper", sku: "DYAIRWRAP-NC", options: { Color: "Nickel/Copper" }, prices: [kwd(295)], inventory_quantity: 10 },
    ],
    category: "Health & Beauty",
  },
  {
    title: "Armani Si Passione EDP",
    handle: "armani-si-passione-edp",
    description:
      "Giorgio Armani Si Passione Intense opens with a vibrant top note of blackcurrant and mandarin, giving way to a floral heart of rose and peony. The warm base of vanilla, musk, and oakmoss creates a sensual, long-lasting sillage. Inspired by the modern, passionate woman who embraces life with open arms.",
    thumbnail: uns(IMG.perfume[1]),
    images: [uns(IMG.perfume[1]), uns(IMG.perfume[0])],
    options: [{ title: "Size", values: ["30ml", "50ml", "100ml"] }],
    variants: [
      { title: "30ml", sku: "GASIPAS-30", options: { Size: "30ml" }, prices: [kwd(38)], inventory_quantity: 35 },
      { title: "50ml", sku: "GASIPAS-50", options: { Size: "50ml" }, prices: [kwd(62)], inventory_quantity: 25 },
      { title: "100ml", sku: "GASIPAS-100", options: { Size: "100ml" }, prices: [kwd(95)], inventory_quantity: 18 },
    ],
    category: "Health & Beauty",
  },
  {
    title: "NARS Orgasm Blush",
    handle: "nars-orgasm-blush",
    description:
      "NARS Orgasm Blush is the brand's bestselling product worldwide — a soft peachy pink with a gold shimmer that universally flatters all skin tones. Finely milled formula blends seamlessly for a natural-looking flush. The sheer buildable coverage allows for a subtle daytime glow or a more intense evening look.",
    thumbnail: uns(IMG.makeup[0]),
    images: [uns(IMG.makeup[0]), uns(IMG.makeup[1])],
    options: [{ title: "Size", values: ["4.8g"] }],
    variants: [
      { title: "4.8g", sku: "NARSORG-48", options: { Size: "4.8g" }, prices: [kwd(22)], inventory_quantity: 55 },
    ],
    category: "Health & Beauty",
  },
  {
    title: "The Ordinary AHA 30% + BHA 2% Peeling Solution",
    handle: "the-ordinary-aha-bha-peeling",
    description:
      "The Ordinary AHA 30% + BHA 2% Peeling Solution is an exfoliating facial mask that combines alpha hydroxy acids (glycolic, lactic, tartaric, citric) with salicylic acid for comprehensive surface and pore exfoliation. A 10-minute once-weekly treatment visibly improves skin texture, tone, and clarity. Tasmanian pepperberry reduces irritation.",
    thumbnail: uns(IMG.skincare[1]),
    images: [uns(IMG.skincare[1]), uns(IMG.skincare[0])],
    options: [{ title: "Size", values: ["30ml"] }],
    variants: [
      { title: "30ml", sku: "TOAHAPEEL-30", options: { Size: "30ml" }, prices: [kwd(8)], inventory_quantity: 80 },
    ],
    category: "Health & Beauty",
  },
  {
    title: "Foreo LUNA 4 Face Cleanser",
    handle: "foreo-luna-4-face-cleanser",
    description:
      "Foreo LUNA 4 is a smart facial cleansing device with T-Sonic pulsations that cleanse 35x better than manual cleansing. The ultra-hygienic silicone bristles are nonporous and bacteria-resistant. A single 1-minute charge provides 650 uses. Connects to the Foreo app for personalised skincare routines and progress tracking.",
    thumbnail: pcs("foreo-luna-4"),
    images: [pcs("foreo-luna-4"), pcs("foreo-luna-4-2")],
    options: [{ title: "Skin Type", values: ["Normal/Combination", "Dry/Sensitive", "Oily"] }],
    variants: [
      { title: "Normal/Combination", sku: "FORELU4-NC", options: { "Skin Type": "Normal/Combination" }, prices: [kwd(125)], inventory_quantity: 18 },
      { title: "Dry/Sensitive", sku: "FORELU4-DS", options: { "Skin Type": "Dry/Sensitive" }, prices: [kwd(125)], inventory_quantity: 15 },
      { title: "Oily", sku: "FORELU4-OL", options: { "Skin Type": "Oily" }, prices: [kwd(125)], inventory_quantity: 12 },
    ],
    category: "Health & Beauty",
  },
  {
    title: "Laneige Lip Sleeping Mask",
    handle: "laneige-lip-sleeping-mask",
    description:
      "Laneige Lip Sleeping Mask is an overnight treatment that intensely moisturises chapped and dry lips while you sleep. The Berry Mix Complex containing vitamin C-rich fruit extracts brightens lip colour overnight. The balmy texture forms a barrier that locks in moisture for up to 8 hours. Wake up with plump, soft, kissable lips.",
    thumbnail: uns(IMG.makeup[1]),
    images: [uns(IMG.makeup[1]), uns(IMG.makeup[0])],
    options: [{ title: "Flavour", values: ["Berry", "Vanilla", "Apple Lime", "Gummy Bear"] }],
    variants: [
      { title: "Berry", sku: "LANELSM-BRY", options: { Flavour: "Berry" }, prices: [kwd(12)], inventory_quantity: 70 },
      { title: "Vanilla", sku: "LANELSM-VNL", options: { Flavour: "Vanilla" }, prices: [kwd(12)], inventory_quantity: 60 },
      { title: "Apple Lime", sku: "LANELSM-APL", options: { Flavour: "Apple Lime" }, prices: [kwd(12)], inventory_quantity: 50 },
      { title: "Gummy Bear", sku: "LANELSM-GUM", options: { Flavour: "Gummy Bear" }, prices: [kwd(12)], inventory_quantity: 45 },
    ],
    category: "Health & Beauty",
  },

  // ===================== FOOD & GROCERY (10) =====================
  {
    title: "Premium Ajwa Dates",
    handle: "premium-ajwa-dates-1kg",
    description:
      "Premium Ajwa dates from Al-Madinah Al-Munawwarah — the finest grade available, hand-selected for uniform size, texture, and sweetness. Known as the 'queen of dates', Ajwa offers a rich caramel flavour with soft texture and numerous reported health benefits. Available in resealable food-grade pouches.",
    thumbnail: uns(IMG.food[0]),
    images: [uns(IMG.food[0]), uns(IMG.food[1])],
    options: [{ title: "Weight", values: ["250g", "500g", "1kg"] }],
    variants: [
      { title: "250g", sku: "AJWADT-250", options: { Weight: "250g" }, prices: [kwd(3.5)], inventory_quantity: 100 },
      { title: "500g", sku: "AJWADT-500", options: { Weight: "500g" }, prices: [kwd(6.5)], inventory_quantity: 80 },
      { title: "1kg", sku: "AJWADT-1K", options: { Weight: "1kg" }, prices: [kwd(12)], inventory_quantity: 60 },
    ],
    category: "Food & Grocery",
  },
  {
    title: "Pure Saffron Threads",
    handle: "pure-saffron-threads",
    description:
      "Grade A1 Persian Saffron threads sourced directly from Mashhad, Iran — the world's finest saffron-growing region. Certified by ISO 3632 Category 1 with a crocin content above 200. Each batch is third-party tested for authenticity and purity. Store in a cool, dark place to preserve potency for up to 4 years.",
    thumbnail: pcs("saffron-threads"),
    images: [pcs("saffron-threads"), pcs("saffron-threads-2")],
    options: [{ title: "Weight", values: ["1g", "5g", "10g"] }],
    variants: [
      { title: "1g", sku: "SAFFRON-1G", options: { Weight: "1g" }, prices: [kwd(4.5)], inventory_quantity: 120 },
      { title: "5g", sku: "SAFFRON-5G", options: { Weight: "5g" }, prices: [kwd(20)], inventory_quantity: 80 },
      { title: "10g", sku: "SAFFRON-10G", options: { Weight: "10g" }, prices: [kwd(38)], inventory_quantity: 40 },
    ],
    category: "Food & Grocery",
  },
  {
    title: "Extra Virgin Olive Oil",
    handle: "extra-virgin-olive-oil",
    description:
      "Cold-pressed extra virgin olive oil from first-harvest Koroneiki olives in Crete, Greece. Acidity below 0.2% and a polyphenol content above 300mg/kg places this in the premium health grade. Rich golden-green colour with aromas of fresh-cut grass, artichoke, and a peppery finish. Ideal for salads, dipping, and finishing dishes.",
    thumbnail: pcs("olive-oil"),
    images: [pcs("olive-oil"), pcs("olive-oil-2")],
    options: [{ title: "Size", values: ["500ml", "1L"] }],
    variants: [
      { title: "500ml", sku: "EVOO-500", options: { Size: "500ml" }, prices: [kwd(5.5)], inventory_quantity: 80 },
      { title: "1L", sku: "EVOO-1L", options: { Size: "1L" }, prices: [kwd(9)], inventory_quantity: 60 },
    ],
    category: "Food & Grocery",
  },
  {
    title: "Organic Manuka Honey MGO 300+",
    handle: "organic-manuka-honey-mgo300",
    description:
      "Certified UMF 12+ New Zealand Manuka Honey with a guaranteed MGO 300+ methylglyoxal content, independently verified by Analytica Laboratories. Non-GMO, antibiotic-free, and harvested from mono-floral Leptospermum scoparium. Packed in glass jars to preserve bioactivity and shipped in temperature-controlled packaging.",
    thumbnail: uns(IMG.honey[0]),
    images: [uns(IMG.honey[0]), uns(IMG.honey[1])],
    options: [{ title: "Weight", values: ["250g", "500g"] }],
    variants: [
      { title: "250g", sku: "MANUKA300-250", options: { Weight: "250g" }, prices: [kwd(12)], inventory_quantity: 50 },
      { title: "500g", sku: "MANUKA300-500", options: { Weight: "500g" }, prices: [kwd(22)], inventory_quantity: 35 },
    ],
    category: "Food & Grocery",
  },
  {
    title: "Organic Ghee Butter",
    handle: "organic-ghee-butter",
    description:
      "Traditional Indian-style ghee clarified from grass-fed A2 cow milk using the ancient bilona churning method for superior flavour and nutrition. High smoke point of 250°C makes it ideal for sautéing, frying, and deep-frying. Rich in butyrate and fat-soluble vitamins A, D, E, and K2. Lactose-free and casein-free.",
    thumbnail: pcs("ghee-butter"),
    images: [pcs("ghee-butter"), pcs("ghee-butter-2")],
    options: [{ title: "Weight", values: ["300g", "1kg"] }],
    variants: [
      { title: "300g", sku: "GHEE-300", options: { Weight: "300g" }, prices: [kwd(4.8)], inventory_quantity: 70 },
      { title: "1kg", sku: "GHEE-1K", options: { Weight: "1kg" }, prices: [kwd(14)], inventory_quantity: 40 },
    ],
    category: "Food & Grocery",
  },
  {
    title: "Al-Qassab Arabic Coffee Blend",
    handle: "al-qassab-arabic-coffee",
    description:
      "Al-Qassab's signature Arabic coffee blend combines light-roasted Arabica beans from Yemen with cardamom, cloves, and saffron for the authentic Gulf coffee experience. Finely ground to a consistency perfect for Dallah pot brewing. Each batch is roasted to order in Kuwait City and packaged in nitrogen-flushed pouches for freshness.",
    thumbnail: uns(IMG.coffee[0]),
    images: [uns(IMG.coffee[0]), uns(IMG.coffee[1])],
    options: [{ title: "Weight", values: ["250g", "500g"] }],
    variants: [
      { title: "250g", sku: "AQCOFFEE-250", options: { Weight: "250g" }, prices: [kwd(3.8)], inventory_quantity: 80 },
      { title: "500g", sku: "AQCOFFEE-500", options: { Weight: "500g" }, prices: [kwd(7)], inventory_quantity: 60 },
    ],
    category: "Food & Grocery",
  },
  {
    title: "Himalayan Pink Salt Grinder",
    handle: "himalayan-pink-salt-grinder",
    description:
      "Coarse Himalayan pink salt crystals mined from the Khewra Salt Mine in Pakistan — one of the purest salt sources on Earth, free from microplastics. Hand-selected large crystals sized 2–5mm for optimal grinding. The glass grinder with ceramic grinding mechanism preserves mineral content and provides even particle size.",
    thumbnail: pcs("himalayan-salt-grinder"),
    images: [pcs("himalayan-salt-grinder"), pcs("himalayan-salt-grinder-2")],
    options: [{ title: "Weight", values: ["250g", "500g", "1kg"] }],
    variants: [
      { title: "250g", sku: "HIMSALT-250", options: { Weight: "250g" }, prices: [kwd(2.5)], inventory_quantity: 100 },
      { title: "500g", sku: "HIMSALT-500", options: { Weight: "500g" }, prices: [kwd(4.5)], inventory_quantity: 80 },
      { title: "1kg", sku: "HIMSALT-1K", options: { Weight: "1kg" }, prices: [kwd(7)], inventory_quantity: 60 },
    ],
    category: "Food & Grocery",
  },
  {
    title: "Premium Basmati Rice",
    handle: "premium-basmati-rice",
    description:
      "Extra-long grain aged Basmati rice from the foothills of the Himalayan mountains — matured for a minimum of 24 months for maximum elongation and non-sticky cooking. Cooks perfectly fluffy every time with a natural nutty aroma from aging. Washed and packaged without additives. The preferred rice of Kuwaiti households for Machboos.",
    thumbnail: uns(IMG.rice[0]),
    images: [uns(IMG.rice[0]), uns(IMG.rice[1])],
    options: [{ title: "Weight", values: ["2kg", "5kg", "10kg"] }],
    variants: [
      { title: "2kg", sku: "BASRICE-2K", options: { Weight: "2kg" }, prices: [kwd(3)], inventory_quantity: 100 },
      { title: "5kg", sku: "BASRICE-5K", options: { Weight: "5kg" }, prices: [kwd(6.5)], inventory_quantity: 75 },
      { title: "10kg", sku: "BASRICE-10K", options: { Weight: "10kg" }, prices: [kwd(12)], inventory_quantity: 50 },
    ],
    category: "Food & Grocery",
  },
  {
    title: "Imported Dark Chocolate Set",
    handle: "imported-dark-chocolate-set",
    description:
      "Artisan dark chocolate selection featuring single-origin bars from Ecuador (70%), Peru (72%), Madagascar (75%), and Venezuela (85%). Each bar is made with minimal ingredients — cacao, cane sugar, and cocoa butter — for a pure flavour expression. Beautifully presented in a gift box suitable for corporate or personal gifting.",
    thumbnail: pcs("dark-chocolate-set"),
    images: [pcs("dark-chocolate-set"), pcs("dark-chocolate-set-2")],
    options: [{ title: "Box Size", values: ["Box of 24", "Box of 48"] }],
    variants: [
      { title: "Box of 24", sku: "DKCHOC-24", options: { "Box Size": "Box of 24" }, prices: [kwd(15)], inventory_quantity: 40 },
      { title: "Box of 48", sku: "DKCHOC-48", options: { "Box Size": "Box of 48" }, prices: [kwd(28)], inventory_quantity: 30 },
    ],
    category: "Food & Grocery",
  },
  {
    title: "Garden of Life Protein Powder",
    handle: "garden-of-life-protein-powder",
    description:
      "Garden of Life Sport Organic Protein is USDA Certified Organic and NSF Certified for Sport — verified free of banned substances for athletic use. 30g of organic pea protein, sprouted navy bean, lentil, and cranberry protein per serving supports muscle growth and recovery. No artificial sweeteners, colours, or flavours.",
    thumbnail: uns(IMG.fitness[0]),
    images: [uns(IMG.fitness[0]), uns(IMG.fitness[1])],
    options: [
      { title: "Flavour", values: ["Vanilla", "Chocolate"] },
      { title: "Size", values: ["500g", "1kg"] },
    ],
    variants: [
      { title: "Vanilla / 500g", sku: "GOLPROT-VNL-500", options: { Flavour: "Vanilla", Size: "500g" }, prices: [kwd(18)], inventory_quantity: 50 },
      { title: "Vanilla / 1kg", sku: "GOLPROT-VNL-1K", options: { Flavour: "Vanilla", Size: "1kg" }, prices: [kwd(32)], inventory_quantity: 35 },
      { title: "Chocolate / 500g", sku: "GOLPROT-CHO-500", options: { Flavour: "Chocolate", Size: "500g" }, prices: [kwd(18)], inventory_quantity: 45 },
      { title: "Chocolate / 1kg", sku: "GOLPROT-CHO-1K", options: { Flavour: "Chocolate", Size: "1kg" }, prices: [kwd(32)], inventory_quantity: 30 },
    ],
    category: "Food & Grocery",
  },

  // ===================== HOME & KITCHEN (5) =====================
  {
    title: "KitchenAid Artisan Stand Mixer",
    handle: "kitchenaid-artisan-stand-mixer",
    description:
      "KitchenAid Artisan 5-quart tilt-head stand mixer with 325-watt motor handles everything from light whipping to heavy bread doughs. The 10-speed slide control ranges from a slow stir to a fast whip. Includes flat beater, dough hook, and wire whip. The all-metal construction is built to last a lifetime in Kuwait's demanding kitchen environments.",
    thumbnail: uns(IMG.kitchen[0]),
    images: [uns(IMG.kitchen[0]), uns(IMG.kitchen[1])],
    options: [{ title: "Color", values: ["Empire Red", "Ice Blue", "Onyx Black"] }],
    variants: [
      { title: "Empire Red", sku: "KAARTMIX-RED", options: { Color: "Empire Red" }, prices: [kwd(185)], inventory_quantity: 15 },
      { title: "Ice Blue", sku: "KAARTMIX-BLU", options: { Color: "Ice Blue" }, prices: [kwd(185)], inventory_quantity: 12 },
      { title: "Onyx Black", sku: "KAARTMIX-BLK", options: { Color: "Onyx Black" }, prices: [kwd(185)], inventory_quantity: 10 },
    ],
    category: "Home & Kitchen",
  },
  {
    title: "Instant Pot Duo 7-in-1 (6L)",
    handle: "instant-pot-duo-7in1-6l",
    description:
      "Instant Pot Duo 7-in-1 replaces seven kitchen appliances: pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker, and warmer. The 6-litre capacity feeds up to 8 people. Over 1000 approved recipes in the Instant Pot app. Features 14 smart programs and auto keep-warm for flexible meal preparation.",
    thumbnail: uns(IMG.kitchen[1]),
    images: [uns(IMG.kitchen[1]), uns(IMG.kitchen[0])],
    options: [{ title: "Size", values: ["6L"] }],
    variants: [
      { title: "6L", sku: "IPDUO7-6L", options: { Size: "6L" }, prices: [kwd(68)], inventory_quantity: 25 },
    ],
    category: "Home & Kitchen",
  },
  {
    title: "Philips Hue Starter Kit",
    handle: "philips-hue-starter-kit",
    description:
      "Philips Hue White and Colour Ambiance Starter Kit includes E27 bulbs and a Hue Bridge for control from anywhere via the Philips Hue app, Amazon Alexa, Google Home, and Apple HomeKit. 16 million colours and 50,000 shades of white light create any mood from cool energising daylight to warm candlelight.",
    thumbnail: pcs("philips-hue-starter"),
    images: [pcs("philips-hue-starter"), pcs("philips-hue-starter-2")],
    options: [{ title: "Pack", values: ["2-Pack Starter", "4-Pack Starter"] }],
    variants: [
      { title: "2-Pack Starter", sku: "PHHUEST-2", options: { Pack: "2-Pack Starter" }, prices: [kwd(42)], inventory_quantity: 30 },
      { title: "4-Pack Starter", sku: "PHHUEST-4", options: { Pack: "4-Pack Starter" }, prices: [kwd(78)], inventory_quantity: 20 },
    ],
    category: "Home & Kitchen",
  },
  {
    title: "SMEG Espresso Machine",
    handle: "smeg-espresso-machine",
    description:
      "SMEG ECF01 Espresso Machine combines 1950s retro aesthetics with modern espresso technology including a 15-bar pump, 1-litre removable water tank, and separate steam wand for milk frothing. The unique thermoblock heating system reaches temperature in just 40 seconds. Available in three signature SMEG colours.",
    thumbnail: uns(IMG.coffee[1]),
    images: [uns(IMG.coffee[1]), uns(IMG.coffee[0])],
    options: [{ title: "Color", values: ["Cream", "Red", "Black"] }],
    variants: [
      { title: "Cream", sku: "SMEGESP-CRM", options: { Color: "Cream" }, prices: [kwd(145)], inventory_quantity: 15 },
      { title: "Red", sku: "SMEGESP-RED", options: { Color: "Red" }, prices: [kwd(145)], inventory_quantity: 12 },
      { title: "Black", sku: "SMEGESP-BLK", options: { Color: "Black" }, prices: [kwd(145)], inventory_quantity: 10 },
    ],
    category: "Home & Kitchen",
  },
  {
    title: "Roomba j7+ Robot Vacuum",
    handle: "roomba-j7-plus-robot-vacuum",
    description:
      "iRobot Roomba j7+ features PrecisionVision Navigation to avoid obstacles like cables, shoes, and pet waste. The self-emptying Clean Base Automatic Dirt Disposal holds up to 60 days of dirt. Smart Mapping creates personalised maps of your home for targeted room-by-room cleaning. Compatible with Alexa and Google Assistant.",
    thumbnail: pcs("roomba-j7-plus"),
    images: [pcs("roomba-j7-plus"), pcs("roomba-j7-plus-2")],
    options: [{ title: "Model", values: ["Roomba j7+"] }],
    variants: [
      { title: "Roomba j7+", sku: "ROOMBAJ7P-STD", options: { Model: "Roomba j7+" }, prices: [kwd(320)], inventory_quantity: 10 },
    ],
    category: "Home & Kitchen",
  },

  // ===================== SPORTS (3) =====================
  {
    title: "Garmin Fenix 7X Sapphire Solar",
    handle: "garmin-fenix-7x-sapphire",
    description:
      "Garmin Fenix 7X Sapphire Solar is a multi-sport GPS smartwatch with solar charging that extends battery life to 28 days in smartwatch mode. The 51mm sapphire crystal lens is virtually scratch-proof. Features Pulse Ox, respiration tracking, HRV status, and advanced running dynamics. Preloaded with topographic maps for 163 countries.",
    thumbnail: uns(IMG.watches[0]),
    images: [uns(IMG.watches[0]), uns(IMG.watches[1])],
    options: [{ title: "Strap", values: ["Black Silicone", "Titanium DLC"] }],
    variants: [
      { title: "Black Silicone", sku: "GARFNX7X-BSL", options: { Strap: "Black Silicone" }, prices: [kwd(410)], inventory_quantity: 10 },
      { title: "Titanium DLC", sku: "GARFNX7X-TDL", options: { Strap: "Titanium DLC" }, prices: [kwd(480)], inventory_quantity: 6 },
    ],
    category: "Sports & Outdoors",
  },
  {
    title: "Lululemon Align Yoga Pants",
    handle: "lululemon-align-yoga-pants",
    description:
      "Lululemon Align High-Rise Pants feature Nulu fabric — Lululemon's softest, most sweat-wicking fabric that feels like a second skin. The 4-way stretch with minimal seams eliminates distractions during practice. A naked feel waistband sits flat against the body with no rolling or slipping. Buttery-soft and pill-resistant.",
    thumbnail: uns(IMG.yoga[0]),
    images: [uns(IMG.yoga[0]), uns(IMG.yoga[1])],
    options: [
      { title: "Size", values: ["XS", "S", "M", "L"] },
      { title: "Color", values: ["Black", "Bone", "Dark Olive", "Grape"] },
    ],
    variants: [
      { title: "S / Black", sku: "LLALIGN-S-BLK", options: { Size: "S", Color: "Black" }, prices: [kwd(68)], inventory_quantity: 30 },
      { title: "M / Black", sku: "LLALIGN-M-BLK", options: { Size: "M", Color: "Black" }, prices: [kwd(68)], inventory_quantity: 25 },
      { title: "S / Bone", sku: "LLALIGN-S-BON", options: { Size: "S", Color: "Bone" }, prices: [kwd(68)], inventory_quantity: 20 },
      { title: "M / Dark Olive", sku: "LLALIGN-M-DO", options: { Size: "M", Color: "Dark Olive" }, prices: [kwd(68)], inventory_quantity: 18 },
    ],
    category: "Sports & Outdoors",
  },
  {
    title: "TRX GO Suspension Trainer",
    handle: "trx-go-suspension-trainer",
    description:
      "TRX GO Suspension Trainer is a lightweight, compact bodyweight training system that anchors to any door, tree, or beam. Over 200 exercises can be performed targeting every muscle group — from beginner to elite athlete. Includes a door anchor, mesh carry bag, and access to the TRX Training Club app with 1000+ workouts.",
    thumbnail: uns(IMG.fitness[1]),
    images: [uns(IMG.fitness[1]), uns(IMG.fitness[0])],
    options: [{ title: "Kit", values: ["TRX GO"] }],
    variants: [
      { title: "TRX GO", sku: "TRXGO-STD", options: { Kit: "TRX GO" }, prices: [kwd(88)], inventory_quantity: 20 },
    ],
    category: "Sports & Outdoors",
  },
]

/**
 * Main seed function
 */
export default async function seedProductsV2({
  container,
}: {
  container: any
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info("=== seed-products-v2: Starting ===")
  logger.info(`Total products to seed: ${PRODUCTS.length}`)

  // Get sales channel
  let salesChannelId: string | undefined
  try {
    const { data: channels } = await query.graph({
      entity: "sales_channel",
      fields: ["id", "name"],
    })
    if (channels?.length > 0) {
      salesChannelId = channels[0].id
      logger.info(`Using sales channel: ${channels[0].name} (${salesChannelId})`)
    }
  } catch (e) {
    logger.warn(`Could not fetch sales channels: ${e}`)
  }

  // Get shipping profile
  let shippingProfileId: string | undefined
  try {
    const fulfillmentModule = container.resolve(Modules.FULFILLMENT)
    const profiles = await fulfillmentModule.listShippingProfiles({})
    if (profiles?.length > 0) {
      shippingProfileId = profiles[0].id
      logger.info(`Using shipping profile: ${shippingProfileId}`)
    }
  } catch (e) {
    logger.warn(`Could not fetch shipping profiles: ${e}`)
  }

  let created = 0
  let skipped = 0
  const createdProductIds: string[] = []

  for (const p of PRODUCTS) {
    try {
      // Idempotency check — skip if handle already exists
      const { data: existing } = await query.graph({
        entity: "product",
        fields: ["id", "handle"],
        filters: { handle: p.handle },
      })

      if (existing?.length > 0) {
        logger.info(`  [SKIP] ${p.title} (${p.handle})`)
        createdProductIds.push(existing[0].id)
        skipped++
        continue
      }

      const productInput: Record<string, unknown> = {
        title: p.title,
        description: p.description,
        handle: p.handle,
        thumbnail: p.thumbnail,
        images: p.images.map((url) => ({ url })),
        options: p.options,
        variants: p.variants.map((v) => ({
          title: v.title,
          sku: v.sku,
          options: v.options,
          prices: v.prices,
          manage_inventory: true,
        })),
        status: "published",
        metadata: {
          category: p.category,
          seeded_at: new Date().toISOString(),
        },
      }

      if (salesChannelId) productInput.sales_channels = [{ id: salesChannelId }]
      if (shippingProfileId) productInput.shipping_profile_id = shippingProfileId

      const { result } = await createProductsWorkflow(container).run({
        input: { products: [productInput] },
      } as any)

      if (result?.length > 0) {
        logger.info(`  [OK]   ${result[0].title} (${result[0].id}) — ${p.variants.length} variants`)
        createdProductIds.push(result[0].id)
        created++
      }
    } catch (err) {
      logger.error(
        `  [ERR]  ${p.title}: ${err instanceof Error ? err.message : err}`
      )
    }
  }

  logger.info(`\n=== Products: created ${created}, skipped ${skipped} ===`)

  // ─── Seed Inventory Levels ───────────────────────────────────────────────
  logger.info("=== seed-products-v2: Seeding inventory ===")

  try {
    const { data: stockLocations } = await query.graph({
      entity: "stock_location",
      fields: ["id", "name"],
    })

    if (!stockLocations?.length) {
      logger.warn("No stock locations found — skipping inventory. Create one in the admin panel.")
    } else {
      const loc = stockLocations[0]
      logger.info(`Using stock location: ${loc.name} (${loc.id})`)

      // Build SKU → quantity map
      const skuQtyMap = new Map<string, number>()
      for (const p of PRODUCTS) {
        for (const v of p.variants) {
          skuQtyMap.set(v.sku, v.inventory_quantity)
        }
      }

      const { data: inventoryItems } = await query.graph({
        entity: "inventory_item",
        fields: ["id", "sku"],
      })

      const { data: existingLevels } = await query.graph({
        entity: "inventory_level",
        fields: ["id", "inventory_item_id", "location_id"],
      })

      const existingKeys = new Set(
        (existingLevels || []).map(
          (l: { inventory_item_id: string; location_id: string }) =>
            `${l.inventory_item_id}:${l.location_id}`
        )
      )

      const newLevels = (inventoryItems || [])
        .filter(
          (item: { id: string; sku: string }) =>
            !existingKeys.has(`${item.id}:${loc.id}`)
        )
        .map((item: { id: string; sku: string }) => ({
          inventory_item_id: item.id,
          location_id: loc.id,
          stocked_quantity: skuQtyMap.get(item.sku) ?? 50,
        }))

      if (newLevels.length === 0) {
        logger.info("All inventory items already have stock levels — skipping")
      } else {
        logger.info(`Creating ${newLevels.length} inventory levels...`)
        await createInventoryLevelsWorkflow(container).run({
          input: { inventory_levels: newLevels },
        } as any)
        logger.info(`✓ Created ${newLevels.length} inventory levels`)
      }
    }
  } catch (err) {
    logger.error(`Failed to seed inventory: ${err instanceof Error ? err.message : err}`)
  }

  logger.info("=== seed-products-v2: Done ===")
  return { created, skipped }
}
