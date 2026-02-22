/**
 * social-proof-config.ts
 * Maps product handles to social proof data: sold count, rating, bestseller status, new arrival
 * Used by SocialProofBadge component on product cards and listing pages
 */

export interface SocialProofData {
  soldCount: number
  rating: number
  reviewCount: number
  isBestseller: boolean
  isNew: boolean
  isLowStock?: boolean
  discountPercent?: number
}

/**
 * Social proof configuration keyed by product handle.
 * Top 20% by soldCount are marked as bestsellers.
 * Products seeded recently (demo context) are marked as new.
 */
export const SOCIAL_PROOF_CONFIG: Record<string, SocialProofData> = {
  // ─── Electronics (15 products) ───────────────────────────────────────────
  "samsung-galaxy-s25-ultra": {
    soldCount: 847,
    rating: 4.8,
    reviewCount: 312,
    isBestseller: true,
    isNew: false,
    discountPercent: 11,
  },
  "apple-iphone-16-pro-max": {
    soldCount: 1203,
    rating: 4.9,
    reviewCount: 487,
    isBestseller: true,
    isNew: false,
    discountPercent: 0,
  },
  "macbook-pro-14-m4": {
    soldCount: 342,
    rating: 4.9,
    reviewCount: 198,
    isBestseller: true,
    isNew: false,
    discountPercent: 5,
  },
  "sony-wh-1000xm6-headphones": {
    soldCount: 621,
    rating: 4.7,
    reviewCount: 243,
    isBestseller: true,
    isNew: true,
    discountPercent: 0,
  },
  "ipad-air-m2": {
    soldCount: 389,
    rating: 4.8,
    reviewCount: 156,
    isBestseller: false,
    isNew: false,
    discountPercent: 0,
  },
  "playstation-5-slim": {
    soldCount: 512,
    rating: 4.7,
    reviewCount: 289,
    isBestseller: true,
    isNew: false,
    discountPercent: 0,
  },
  "samsung-65-oled-4k-tv": {
    soldCount: 178,
    rating: 4.6,
    reviewCount: 94,
    isBestseller: false,
    isNew: false,
    discountPercent: 8,
  },
  "dji-mini-4-pro-drone": {
    soldCount: 203,
    rating: 4.8,
    reviewCount: 112,
    isBestseller: false,
    isNew: true,
    discountPercent: 0,
  },
  "apple-watch-series-10": {
    soldCount: 445,
    rating: 4.7,
    reviewCount: 201,
    isBestseller: false,
    isNew: true,
    discountPercent: 0,
  },
  "dyson-v15-detect-vacuum": {
    soldCount: 267,
    rating: 4.6,
    reviewCount: 143,
    isBestseller: false,
    isNew: false,
    discountPercent: 0,
  },
  "nespresso-vertuo-next": {
    soldCount: 334,
    rating: 4.5,
    reviewCount: 167,
    isBestseller: false,
    isNew: false,
    discountPercent: 15,
  },
  "logitech-mx-master-3s-mouse": {
    soldCount: 489,
    rating: 4.8,
    reviewCount: 234,
    isBestseller: false,
    isNew: false,
    discountPercent: 0,
  },
  "anker-powerbank-26800mah": {
    soldCount: 712,
    rating: 4.6,
    reviewCount: 356,
    isBestseller: true,
    isNew: false,
    discountPercent: 0,
  },
  "canon-eos-r8-camera": {
    soldCount: 134,
    rating: 4.9,
    reviewCount: 78,
    isBestseller: false,
    isNew: true,
    discountPercent: 0,
  },
  "jbl-flip-6-speaker": {
    soldCount: 567,
    rating: 4.6,
    reviewCount: 287,
    isBestseller: false,
    isNew: false,
    discountPercent: 0,
  },

  // ─── Fashion & Apparel (15 products) ──────────────────────────────────────
  "nike-air-max-270": {
    soldCount: 892,
    rating: 4.7,
    reviewCount: 423,
    isBestseller: true,
    isNew: false,
    discountPercent: 0,
  },
  "adidas-ultraboost-24": {
    soldCount: 678,
    rating: 4.8,
    reviewCount: 312,
    isBestseller: true,
    isNew: false,
    discountPercent: 0,
  },
  "levis-511-slim-jeans": {
    soldCount: 534,
    rating: 4.5,
    reviewCount: 267,
    isBestseller: false,
    isNew: false,
    discountPercent: 20,
  },
  "zara-oversized-linen-shirt": {
    soldCount: 412,
    rating: 4.4,
    reviewCount: 198,
    isBestseller: false,
    isNew: true,
    discountPercent: 0,
  },
  "ray-ban-aviator-classic": {
    soldCount: 389,
    rating: 4.7,
    reviewCount: 189,
    isBestseller: false,
    isNew: false,
    discountPercent: 0,
  },
  "fossil-gen-6-smartwatch": {
    soldCount: 234,
    rating: 4.3,
    reviewCount: 112,
    isBestseller: false,
    isNew: false,
    discountPercent: 10,
  },
  "michael-kors-leather-tote": {
    soldCount: 287,
    rating: 4.6,
    reviewCount: 134,
    isBestseller: false,
    isNew: false,
    discountPercent: 0,
  },
  "pandora-moments-bracelet": {
    soldCount: 456,
    rating: 4.8,
    reviewCount: 223,
    isBestseller: false,
    isNew: false,
    discountPercent: 0,
  },
  "under-armour-project-rock-hoodie": {
    soldCount: 312,
    rating: 4.6,
    reviewCount: 156,
    isBestseller: false,
    isNew: false,
    discountPercent: 0,
  },
  "hm-premium-abaya": {
    soldCount: 623,
    rating: 4.5,
    reviewCount: 298,
    isBestseller: true,
    isNew: false,
    discountPercent: 0,
  },
  "swarovski-crystal-earrings": {
    soldCount: 378,
    rating: 4.7,
    reviewCount: 178,
    isBestseller: false,
    isNew: false,
    discountPercent: 0,
  },
  "tommy-hilfiger-polo-shirt": {
    soldCount: 445,
    rating: 4.5,
    reviewCount: 212,
    isBestseller: false,
    isNew: false,
    discountPercent: 15,
  },
  "birkenstock-arizona-sandals": {
    soldCount: 512,
    rating: 4.6,
    reviewCount: 245,
    isBestseller: false,
    isNew: false,
    discountPercent: 0,
  },
  "longchamp-le-pliage-bag": {
    soldCount: 267,
    rating: 4.7,
    reviewCount: 123,
    isBestseller: false,
    isNew: false,
    discountPercent: 0,
  },
  "cartier-style-love-bracelet": {
    soldCount: 345,
    rating: 4.4,
    reviewCount: 167,
    isBestseller: false,
    isNew: false,
    discountPercent: 0,
  },

  // ─── Health & Beauty (12 products) ────────────────────────────────────────
  "charlotte-tilbury-hollywood-flawless-filter": {
    soldCount: 734,
    rating: 4.8,
    reviewCount: 367,
    isBestseller: true,
    isNew: false,
    discountPercent: 0,
  },
  "la-mer-moisturizing-cream-60ml": {
    soldCount: 312,
    rating: 4.9,
    reviewCount: 156,
    isBestseller: false,
    isNew: false,
    discountPercent: 0,
  },
  "jo-malone-peony-blush-suede": {
    soldCount: 423,
    rating: 4.8,
    reviewCount: 201,
    isBestseller: false,
    isNew: false,
    discountPercent: 0,
  },
  "olaplex-no3-hair-perfector": {
    soldCount: 867,
    rating: 4.7,
    reviewCount: 423,
    isBestseller: true,
    isNew: false,
    discountPercent: 0,
  },
  "fenty-beauty-pro-filtr-foundation": {
    soldCount: 623,
    rating: 4.6,
    reviewCount: 312,
    isBestseller: true,
    isNew: false,
    discountPercent: 0,
  },
  "drunk-elephant-c-firma-serum": {
    soldCount: 389,
    rating: 4.7,
    reviewCount: 189,
    isBestseller: false,
    isNew: false,
    discountPercent: 0,
  },
  "dyson-airwrap-complete-long": {
    soldCount: 534,
    rating: 4.8,
    reviewCount: 267,
    isBestseller: true,
    isNew: false,
    discountPercent: 0,
  },
  "armani-si-passione-edp": {
    soldCount: 445,
    rating: 4.7,
    reviewCount: 212,
    isBestseller: false,
    isNew: false,
    discountPercent: 0,
  },
  "nars-orgasm-blush": {
    soldCount: 567,
    rating: 4.6,
    reviewCount: 278,
    isBestseller: false,
    isNew: false,
    discountPercent: 0,
  },
  "the-ordinary-aha-bha": {
    soldCount: 923,
    rating: 4.5,
    reviewCount: 456,
    isBestseller: true,
    isNew: false,
    discountPercent: 0,
  },
  "foreo-luna-4-face-cleanser": {
    soldCount: 312,
    rating: 4.8,
    reviewCount: 156,
    isBestseller: false,
    isNew: true,
    discountPercent: 0,
  },
  "laneige-lip-sleeping-mask": {
    soldCount: 1045,
    rating: 4.9,
    reviewCount: 512,
    isBestseller: true,
    isNew: false,
    discountPercent: 0,
  },

  // ─── Food & Groceries (10 products) ───────────────────────────────────────
  "premium-ajwa-dates-1kg": {
    soldCount: 1234,
    rating: 4.9,
    reviewCount: 587,
    isBestseller: true,
    isNew: false,
    discountPercent: 0,
  },
  "pure-saffron-threads": {
    soldCount: 445,
    rating: 4.8,
    reviewCount: 223,
    isBestseller: false,
    isNew: false,
    discountPercent: 0,
  },
  "extra-virgin-olive-oil": {
    soldCount: 678,
    rating: 4.6,
    reviewCount: 334,
    isBestseller: false,
    isNew: false,
    discountPercent: 0,
  },
  "organic-manuka-honey-mgo-300": {
    soldCount: 534,
    rating: 4.8,
    reviewCount: 267,
    isBestseller: false,
    isNew: false,
    discountPercent: 0,
  },
  "ghee-butter-organic": {
    soldCount: 389,
    rating: 4.7,
    reviewCount: 189,
    isBestseller: false,
    isNew: false,
    discountPercent: 0,
  },
  "al-qassab-arabic-coffee-blend": {
    soldCount: 712,
    rating: 4.9,
    reviewCount: 345,
    isBestseller: true,
    isNew: false,
    discountPercent: 0,
  },
  "himalayan-pink-salt-grinder": {
    soldCount: 456,
    rating: 4.5,
    reviewCount: 223,
    isBestseller: false,
    isNew: false,
    discountPercent: 0,
  },
  "premium-basmati-rice": {
    soldCount: 891,
    rating: 4.7,
    reviewCount: 434,
    isBestseller: true,
    isNew: false,
    discountPercent: 0,
  },
  "imported-dark-chocolate-set": {
    soldCount: 623,
    rating: 4.8,
    reviewCount: 312,
    isBestseller: false,
    isNew: true,
    discountPercent: 0,
  },
  "garden-of-life-protein-powder": {
    soldCount: 345,
    rating: 4.5,
    reviewCount: 167,
    isBestseller: false,
    isNew: false,
    discountPercent: 0,
  },

  // ─── Home & Kitchen (5 products) ──────────────────────────────────────────
  "kitchenaid-artisan-stand-mixer": {
    soldCount: 289,
    rating: 4.9,
    reviewCount: 145,
    isBestseller: false,
    isNew: false,
    discountPercent: 0,
  },
  "instant-pot-duo-7-in-1": {
    soldCount: 678,
    rating: 4.7,
    reviewCount: 334,
    isBestseller: true,
    isNew: false,
    discountPercent: 10,
  },
  "philips-hue-starter-kit": {
    soldCount: 423,
    rating: 4.6,
    reviewCount: 201,
    isBestseller: false,
    isNew: false,
    discountPercent: 0,
  },
  "smeg-espresso-machine": {
    soldCount: 178,
    rating: 4.8,
    reviewCount: 89,
    isBestseller: false,
    isNew: false,
    discountPercent: 0,
  },
  "roomba-j7-plus-robot-vacuum": {
    soldCount: 234,
    rating: 4.7,
    reviewCount: 112,
    isBestseller: false,
    isNew: true,
    discountPercent: 0,
  },

  // ─── Sports (3 products) ──────────────────────────────────────────────────
  "garmin-fenix-7x-sapphire": {
    soldCount: 312,
    rating: 4.8,
    reviewCount: 156,
    isBestseller: false,
    isNew: false,
    discountPercent: 0,
  },
  "lululemon-align-yoga-pants": {
    soldCount: 867,
    rating: 4.9,
    reviewCount: 423,
    isBestseller: true,
    isNew: false,
    discountPercent: 0,
  },
  "trx-go-suspension-trainer": {
    soldCount: 234,
    rating: 4.6,
    reviewCount: 112,
    isBestseller: false,
    isNew: false,
    discountPercent: 0,
  },
}

/**
 * Get social proof data for a product handle.
 * Falls back to a default with basic data if handle not found.
 */
export function getSocialProof(handle: string): SocialProofData {
  const exact = SOCIAL_PROOF_CONFIG[handle]
  if (exact) return exact

  // Generate deterministic-looking data for unknown handles
  const hash = handle.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return {
    soldCount: 50 + (hash % 300),
    rating: 4.0 + (hash % 10) * 0.1,
    reviewCount: 20 + (hash % 100),
    isBestseller: false,
    isNew: false,
  }
}
