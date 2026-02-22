import { Suspense } from "react"
import SearchFilters from "@/components/search/SearchFilters"
import SearchResultCard, { SearchProduct } from "@/components/search/SearchResultCard"
import SortDropdown from "@/components/search/SortDropdown"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { expandQuery, scoreMatch } from "@lib/search-synonyms"

const MEDUSA_URL = process.env.MEDUSA_BACKEND_URL ?? "http://localhost:9000"
const PUB_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? ""

// Fallback products for when backend is offline
const FALLBACK_PRODUCTS: SearchProduct[] = [
  { id: "1", handle: "samsung-galaxy-s25-ultra", title: "Samsung Galaxy S25 Ultra", thumbnail: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&auto=format", price: "KWD 285.000", vendor: "TechZone Kuwait", discountPercent: 11 },
  { id: "2", handle: "apple-iphone-16-pro-max", title: "Apple iPhone 16 Pro Max", thumbnail: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop&auto=format", price: "KWD 320.000", vendor: "TechZone Kuwait" },
  { id: "3", handle: "macbook-pro-14-m4", title: "MacBook Pro 14\" M4", thumbnail: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&auto=format", price: "KWD 590.000", vendor: "Al-Sayer Electronics" },
  { id: "4", handle: "sony-wh-1000xm6-headphones", title: "Sony WH-1000XM6 Headphones", thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format", price: "KWD 110.000", vendor: "TechZone Kuwait" },
  { id: "5", handle: "nike-air-max-270", title: "Nike Air Max 270", thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&auto=format", price: "KWD 48.000", vendor: "Moda Fashion Kuwait" },
  { id: "6", handle: "adidas-ultraboost-24", title: "Adidas Ultraboost 24", thumbnail: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=400&fit=crop&auto=format", price: "KWD 55.000", vendor: "Moda Fashion Kuwait" },
  { id: "7", handle: "dyson-airwrap-complete-long", title: "Dyson Airwrap Complete Long", thumbnail: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&auto=format", price: "KWD 295.000", vendor: "Glow Beauty Kuwait" },
  { id: "8", handle: "premium-ajwa-dates-1kg", title: "Premium Ajwa Dates 1kg", thumbnail: "https://images.unsplash.com/photo-1609601442485-4522e0b06d7d?w=400&h=400&fit=crop&auto=format", price: "KWD 12.000", vendor: "Tamr Dates & Foods" },
  { id: "9", handle: "playstation-5-slim", title: "PlayStation 5 Slim", thumbnail: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop&auto=format", price: "KWD 160.000", vendor: "TechZone Kuwait" },
  { id: "10", handle: "laneige-lip-sleeping-mask", title: "Laneige Lip Sleeping Mask", thumbnail: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop&auto=format", price: "KWD 12.000", vendor: "Glow Beauty Kuwait" },
  { id: "11", handle: "michael-kors-leather-tote", title: "Michael Kors Leather Tote", thumbnail: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop&auto=format", price: "KWD 145.000", vendor: "Al-Shaya Fashion" },
  { id: "12", handle: "charlotte-tilbury-hollywood-flawless-filter", title: "Charlotte Tilbury Flawless Filter", thumbnail: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&h=400&fit=crop&auto=format", price: "KWD 28.000", vendor: "Glow Beauty Kuwait" },
]

interface MedusaProduct {
  id: string
  handle: string
  title: string
  thumbnail?: string
  description?: string
  metadata?: { category?: string; vendor?: string }
  variants?: Array<{
    prices?: Array<{ amount: number; currency_code: string }>
  }>
}

async function fetchProducts(query: string): Promise<SearchProduct[]> {
  try {
    // Always fetch a broad set; use synonym expansion for client-side relevance
    const url = `${MEDUSA_URL}/store/products?limit=200`

    const res = await fetch(url, {
      headers: { "x-publishable-api-key": PUB_KEY },
      next: { revalidate: 60 },
    })

    if (!res.ok) throw new Error(`API ${res.status}`)

    const data = await res.json()
    const allProducts: MedusaProduct[] = data.products ?? []

    // Apply semantic search with synonym expansion
    let matched = allProducts
    if (query.trim()) {
      const terms = expandQuery(query)
      const scored = allProducts
        .map((p) => ({
          p,
          score: scoreMatch(
            {
              title: p.title,
              description: p.description,
              metadata: p.metadata as Record<string, unknown>,
            },
            terms
          ),
        }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)

      matched = scored.map(({ p }) => p)
    }

    return matched.map((p) => {
      const kwdPrice = p.variants?.[0]?.prices?.find(
        (pr) => pr.currency_code === "kwd"
      )
      return {
        id: p.id,
        handle: p.handle,
        title: p.title,
        thumbnail: p.thumbnail,
        price: kwdPrice ? `KWD ${(kwdPrice.amount / 1000).toFixed(3)}` : undefined,
        vendor: (p.metadata?.vendor as string) ?? undefined,
      }
    })
  } catch {
    return []
  }
}

function applyFilters(
  products: SearchProduct[],
  minPrice: number,
  maxPrice: number,
  sort: string
): SearchProduct[] {
  let filtered = [...products]

  // Price filter
  if (minPrice > 0 || maxPrice < 99999) {
    filtered = filtered.filter((p) => {
      if (!p.price) return true
      const amount = parseFloat(p.price.replace("KWD ", ""))
      return amount >= minPrice && amount <= maxPrice
    })
  }

  // Sort
  if (sort === "price_asc") {
    filtered.sort((a, b) => {
      const aPrice = parseFloat(a.price?.replace("KWD ", "") ?? "0")
      const bPrice = parseFloat(b.price?.replace("KWD ", "") ?? "0")
      return aPrice - bPrice
    })
  } else if (sort === "price_desc") {
    filtered.sort((a, b) => {
      const aPrice = parseFloat(a.price?.replace("KWD ", "") ?? "0")
      const bPrice = parseFloat(b.price?.replace("KWD ", "") ?? "0")
      return bPrice - aPrice
    })
  }

  return filtered
}

interface SearchPageProps {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{
    q?: string
    category?: string
    minPrice?: string
    maxPrice?: string
    rating?: string
    sort?: string
  }>
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const [{ countryCode }, sp] = await Promise.all([params, searchParams])

  const query = sp.q ?? ""
  const minPrice = Number(sp.minPrice ?? 0)
  const maxPrice = Number(sp.maxPrice ?? 99999)
  const rating = Number(sp.rating ?? 0)
  const sort = sp.sort ?? ""

  // Fetch with semantic expansion; fall back to demo products
  let allProducts = await fetchProducts(query)
  const usingFallback = allProducts.length === 0
  if (usingFallback) {
    // Apply synonym filter on fallback products too
    if (query.trim()) {
      const terms = expandQuery(query)
      allProducts = FALLBACK_PRODUCTS.filter((p) =>
        terms.some(
          (t) =>
            p.title.toLowerCase().includes(t) ||
            (p.vendor?.toLowerCase().includes(t) ?? false)
        )
      )
      if (allProducts.length === 0) allProducts = FALLBACK_PRODUCTS
    } else {
      allProducts = FALLBACK_PRODUCTS
    }
  }

  const filteredProducts = applyFilters(allProducts, minPrice, maxPrice, sort)

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <p className="text-gray-600 text-sm">
            <span className="font-semibold text-gray-900">
              {filteredProducts.length} results
            </span>
            {query && (
              <span>
                {" "}
                for{" "}
                <span className="italic">&ldquo;{query}&rdquo;</span>
              </span>
            )}
          </p>
          {usingFallback && (
            <p className="text-xs text-amber-600 mt-0.5">
              Showing demo products — connect backend for live results
            </p>
          )}
        </div>
        <Suspense fallback={<div className="h-8 w-48 bg-gray-100 rounded animate-pulse" />}>
          <SortDropdown />
        </Suspense>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar filters */}
        <Suspense
          fallback={
            <div className="w-56 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          }
        >
          <SearchFilters />
        </Suspense>

        {/* Results grid */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-2xl font-bold text-gray-800 mb-2">
                No results found for &ldquo;{query}&rdquo;
              </p>
              <p className="text-gray-500 mb-6">
                Try different keywords or browse all products.
              </p>
              <LocalizedClientLink
                href="/store"
                className="inline-block bg-orange-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Browse all products
              </LocalizedClientLink>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <SearchResultCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
