/**
 * Mock data fixtures for the static demo build.
 *
 * Used when NEXT_PUBLIC_USE_MOCK_DATA === "true" so the storefront can render
 * end-to-end (home, store, product page, cart) without a live Medusa backend.
 *
 * Shapes loosely follow @medusajs/types HttpTypes.* — fields the storefront
 * UI actually reads are populated; everything else is a sensible default.
 */

import type { HttpTypes } from "@medusajs/types"

// ─── Region ─────────────────────────────────────────────────────────────────

export const MOCK_REGION: HttpTypes.StoreRegion = {
  id: "reg_kw_demo",
  name: "Kuwait",
  currency_code: "kwd",
  countries: [
    {
      id: "kw",
      iso_2: "kw",
      iso_3: "kwt",
      num_code: "414",
      name: "kuwait",
      display_name: "Kuwait",
      region_id: "reg_kw_demo",
    } as HttpTypes.StoreRegionCountry,
  ],
  automatic_taxes: false,
  metadata: {},
} as unknown as HttpTypes.StoreRegion

export const MOCK_REGIONS: HttpTypes.StoreRegion[] = [MOCK_REGION]

// ─── Helpers ────────────────────────────────────────────────────────────────

const fmtPrice = (kwd: number) => ({
  calculated_amount: kwd,
  original_amount: kwd,
  currency_code: "kwd",
  calculated_price: { price_list_type: null },
  original_price: { price_list_type: null },
  price_list_type: null,
  is_calculated_price_price_list: false,
  is_calculated_price_tax_inclusive: false,
  is_original_price_price_list: false,
  is_original_price_tax_inclusive: false,
})

const makeVariant = (
  productId: string,
  idx: number,
  title: string,
  price: number
): any => ({
  id: `${productId}-var-${idx}`,
  title,
  product_id: productId,
  sku: `${productId.toUpperCase()}-${idx}`,
  inventory_quantity: 50,
  manage_inventory: true,
  allow_backorder: false,
  options: [],
  metadata: {},
  prices: [{ amount: price, currency_code: "kwd" }],
  calculated_price: fmtPrice(price),
  images: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
})

type Seed = {
  id: string
  handle: string
  title: string
  description: string
  thumbnail: string
  price: number
  category: string
  collection?: string
  images?: string[]
}

// ─── Categories ─────────────────────────────────────────────────────────────

export const MOCK_CATEGORIES: HttpTypes.StoreProductCategory[] = [
  {
    id: "cat_electronics",
    name: "Electronics",
    handle: "electronics",
    description: "Phones, laptops, gadgets and more.",
    is_active: true,
    is_internal: false,
    rank: 0,
    parent_category_id: null,
    parent_category: null,
    category_children: [],
    products: [],
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "cat_fashion",
    name: "Fashion",
    handle: "fashion",
    description: "Clothing, shoes, accessories.",
    is_active: true,
    is_internal: false,
    rank: 1,
    parent_category_id: null,
    parent_category: null,
    category_children: [],
    products: [],
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "cat_home",
    name: "Home & Living",
    handle: "home-living",
    description: "Furniture, kitchen, decor.",
    is_active: true,
    is_internal: false,
    rank: 2,
    parent_category_id: null,
    parent_category: null,
    category_children: [],
    products: [],
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "cat_beauty",
    name: "Beauty",
    handle: "beauty",
    description: "Skincare, makeup, fragrances.",
    is_active: true,
    is_internal: false,
    rank: 3,
    parent_category_id: null,
    parent_category: null,
    category_children: [],
    products: [],
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
] as unknown as HttpTypes.StoreProductCategory[]

// ─── Collections ────────────────────────────────────────────────────────────

export const MOCK_COLLECTIONS: HttpTypes.StoreCollection[] = [
  {
    id: "col_featured",
    handle: "featured",
    title: "Featured",
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "col_kuwait_picks",
    handle: "kuwait-picks",
    title: "Kuwait Picks",
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
] as unknown as HttpTypes.StoreCollection[]

// ─── Product seeds ──────────────────────────────────────────────────────────

const SEEDS: Seed[] = [
  {
    id: "prod_galaxy_s25",
    handle: "samsung-galaxy-s25-ultra",
    title: "Samsung Galaxy S25 Ultra",
    description:
      "The flagship Galaxy with a 200MP camera, Snapdragon 8 Gen 4, and 5000mAh battery. Ships from Kuwait City — 2-day delivery.",
    thumbnail:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format",
    price: 285,
    category: "cat_electronics",
    collection: "col_featured",
  },
  {
    id: "prod_iphone_16",
    handle: "apple-iphone-16-pro-max",
    title: "Apple iPhone 16 Pro Max",
    description:
      "Apple's latest pro phone with titanium frame, A18 Pro chip, and the new Camera Control button.",
    thumbnail:
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format",
    price: 320,
    category: "cat_electronics",
    collection: "col_featured",
  },
  {
    id: "prod_macbook_m4",
    handle: "macbook-pro-14-m4",
    title: 'MacBook Pro 14" M4',
    description:
      "Pro performance with the M4 chip, 16GB unified memory, and a Liquid Retina XDR display. Free shipping in Kuwait.",
    thumbnail:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format",
    price: 590,
    category: "cat_electronics",
  },
  {
    id: "prod_sony_wh1000",
    handle: "sony-wh-1000xm6-headphones",
    title: "Sony WH-1000XM6 Headphones",
    description:
      "Industry-leading noise cancelling over-ear headphones with 30-hour battery life.",
    thumbnail:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format",
    price: 110,
    category: "cat_electronics",
  },
  {
    id: "prod_nike_airmax",
    handle: "nike-air-max-270",
    title: "Nike Air Max 270",
    description:
      "Iconic Nike Air cushioning and a breathable mesh upper. Ships in 1-2 days from Hawally.",
    thumbnail:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format",
    price: 48,
    category: "cat_fashion",
    collection: "col_kuwait_picks",
  },
  {
    id: "prod_rayban_aviator",
    handle: "ray-ban-aviator-classic",
    title: "Ray-Ban Aviator Classic",
    description: "Timeless aviators with crystal lenses and a gold-tone metal frame.",
    thumbnail:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format",
    price: 62,
    category: "cat_fashion",
  },
  {
    id: "prod_mk_tote",
    handle: "michael-kors-leather-tote",
    title: "Michael Kors Leather Tote",
    description: "Soft pebbled leather tote with gold-tone hardware and a lined interior.",
    thumbnail:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format",
    price: 145,
    category: "cat_fashion",
  },
  {
    id: "prod_nespresso_vertuo",
    handle: "nespresso-vertuo-next",
    title: "Nespresso Vertuo Next",
    description:
      "One-touch coffee machine with 5 cup sizes. Includes a starter set of capsules.",
    thumbnail:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format",
    price: 75,
    category: "cat_home",
    collection: "col_featured",
  },
  {
    id: "prod_himalayan_salt",
    handle: "himalayan-pink-salt-grinder",
    title: "Himalayan Pink Salt Grinder",
    description: "Adjustable ceramic grinder filled with pink salt from the Himalayas.",
    thumbnail:
      "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=800&auto=format",
    price: 2.5,
    category: "cat_home",
  },
  {
    id: "prod_ordinary_aha",
    handle: "the-ordinary-aha-bha",
    title: "The Ordinary AHA 30% + BHA 2% Peeling Solution",
    description:
      "10-minute exfoliating mask that targets uneven skin texture and dullness.",
    thumbnail:
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format",
    price: 8,
    category: "cat_beauty",
    collection: "col_kuwait_picks",
  },
  {
    id: "prod_laneige_lip",
    handle: "laneige-lip-sleeping-mask",
    title: "Laneige Lip Sleeping Mask",
    description:
      "Overnight lip mask with vitamin C and antioxidants for soft, hydrated lips.",
    thumbnail:
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format",
    price: 12,
    category: "cat_beauty",
  },
  {
    id: "prod_ajwa_dates",
    handle: "premium-ajwa-dates-1kg",
    title: "Premium Ajwa Dates 1kg",
    description: "Hand-picked Ajwa dates from Madinah. Perfect for Ramadan and gifting.",
    thumbnail:
      "https://images.unsplash.com/photo-1609601442485-4522e0b06d7d?w=800&auto=format",
    price: 12,
    category: "cat_home",
    collection: "col_kuwait_picks",
  },
]

// ─── Build StoreProduct list ────────────────────────────────────────────────

export const MOCK_PRODUCTS: HttpTypes.StoreProduct[] = SEEDS.map((s) => {
  const variants = [makeVariant(s.id, 1, "Default", s.price)]
  const images = (s.images && s.images.length ? s.images : [s.thumbnail]).map(
    (url, i) => ({
      id: `${s.id}-img-${i}`,
      url,
      rank: i,
      metadata: {},
    })
  )
  const cat = MOCK_CATEGORIES.find((c) => c.id === s.category)
  const col = s.collection
    ? MOCK_COLLECTIONS.find((c) => c.id === s.collection)
    : undefined

  return {
    id: s.id,
    handle: s.handle,
    title: s.title,
    subtitle: null,
    description: s.description,
    is_giftcard: false,
    discountable: true,
    thumbnail: s.thumbnail,
    images,
    options: [],
    variants,
    tags: [],
    type: null,
    type_id: null,
    collection: col ?? null,
    collection_id: col?.id ?? null,
    categories: cat ? [cat] : [],
    profile_id: null,
    weight: null,
    length: null,
    height: null,
    width: null,
    hs_code: null,
    origin_country: "kw",
    mid_code: null,
    material: null,
    metadata: {
      vendor_name: "Kuwait Marketplace Demo",
      rating: "4.6",
      review_count: "128",
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
  } as unknown as HttpTypes.StoreProduct
})

// Wire products onto categories so /categories/[handle] renders
MOCK_CATEGORIES.forEach((c) => {
  ;(c as any).products = MOCK_PRODUCTS.filter((p) =>
    (p.categories ?? []).some((pc: any) => pc.id === c.id)
  )
})

// ─── Mock cart ──────────────────────────────────────────────────────────────

export function makeEmptyCart(cartId = "cart_demo"): HttpTypes.StoreCart {
  return {
    id: cartId,
    region_id: MOCK_REGION.id,
    region: MOCK_REGION,
    currency_code: "kwd",
    email: null,
    customer_id: null,
    customer: null,
    items: [],
    promotions: [],
    shipping_methods: [],
    payment_collection: null,
    shipping_address: null,
    billing_address: null,
    sales_channel_id: null,
    metadata: {},
    discount_total: 0,
    discount_subtotal: 0,
    discount_tax_total: 0,
    original_item_total: 0,
    original_item_subtotal: 0,
    original_item_tax_total: 0,
    item_total: 0,
    item_subtotal: 0,
    item_tax_total: 0,
    original_total: 0,
    original_subtotal: 0,
    original_tax_total: 0,
    total: 0,
    subtotal: 0,
    tax_total: 0,
    shipping_total: 0,
    shipping_subtotal: 0,
    shipping_tax_total: 0,
    original_shipping_total: 0,
    original_shipping_subtotal: 0,
    original_shipping_tax_total: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as unknown as HttpTypes.StoreCart
}
