export const SEARCH_SYNONYMS: Record<string, string[]> = {
  makeup: ["beauty", "cosmetics", "foundation", "blush", "lipstick", "eyeshadow", "mascara", "concealer", "palette"],
  phone: ["smartphone", "mobile", "iphone", "samsung", "galaxy", "android", "huawei"],
  laptop: ["macbook", "notebook", "computer", "pc", "surface", "chromebook"],
  shoes: ["sneakers", "footwear", "boots", "nike", "adidas", "trainers", "heels", "sandals"],
  watch: ["smartwatch", "timepiece", "garmin", "apple watch", "wearable", "wrist"],
  perfume: ["fragrance", "oud", "cologne", "scent", "attar", "eau de"],
  food: ["dates", "grocery", "organic", "honey", "coffee", "rice", "snack", "tamr", "ajwa"],
  bag: ["handbag", "tote", "purse", "backpack", "luggage", "michael kors"],
  camera: ["photography", "lens", "dslr", "mirrorless", "drone", "canon", "nikon", "sony"],
  gaming: ["playstation", "xbox", "nintendo", "console", "ps5", "gamepad"],
  headphones: ["earphones", "earbuds", "airpods", "sony", "bose", "audio", "wireless"],
  tv: ["television", "oled", "qled", "samsung tv", "lg tv", "smart tv", "4k"],
  tablet: ["ipad", "android tablet", "surface pro", "galaxy tab"],
  skincare: ["moisturizer", "serum", "sunscreen", "face wash", "toner", "beauty", "cream"],
  hair: ["hairdryer", "dyson", "straightener", "shampoo", "conditioner", "haircare"],
  sport: ["fitness", "gym", "running", "workout", "exercise", "yoga", "sports"],
  kids: ["toys", "children", "baby", "toddler", "educational", "lego"],
  home: ["kitchen", "furniture", "decor", "appliance", "cookware", "bedding"],
}

export function expandQuery(query: string): string[] {
  const q = query.toLowerCase().trim()
  const synonyms = SEARCH_SYNONYMS[q] ?? []
  return [q, ...synonyms]
}

/**
 * Score a product match against expanded query terms.
 * Returns 0 if no match, positive number (higher = better) if match found.
 */
export function scoreMatch(
  product: { title: string; description?: string; metadata?: Record<string, unknown> },
  terms: string[]
): number {
  const title = product.title.toLowerCase()
  const desc = (product.description ?? "").toLowerCase()
  const cat = ((product.metadata?.category as string) ?? "").toLowerCase()
  const vendor = ((product.metadata?.vendor as string) ?? "").toLowerCase()

  let score = 0
  for (const term of terms) {
    if (title.includes(term)) score += 3
    if (cat.includes(term)) score += 2
    if (vendor.includes(term)) score += 2
    if (desc.includes(term)) score += 1
  }
  return score
}
