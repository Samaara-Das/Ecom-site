"use client"

import { useRef, useCallback } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getSocialProof } from "@lib/social-proof-config"

// ─── Fallback product data (used when backend is unavailable) ────────────────

interface FallbackProduct {
  id: string
  handle: string
  title: string
  thumbnail: string
  price: string
}

const FALLBACK_ELECTRONICS: FallbackProduct[] = [
  { id: "1", handle: "samsung-galaxy-s25-ultra", title: "Samsung Galaxy S25 Ultra", thumbnail: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop&auto=format", price: "KWD 285.000" },
  { id: "2", handle: "apple-iphone-16-pro-max", title: "Apple iPhone 16 Pro Max", thumbnail: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop&auto=format", price: "KWD 320.000" },
  { id: "3", handle: "macbook-pro-14-m4", title: "MacBook Pro 14\" M4", thumbnail: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop&auto=format", price: "KWD 590.000" },
  { id: "4", handle: "sony-wh-1000xm6-headphones", title: "Sony WH-1000XM6 Headphones", thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop&auto=format", price: "KWD 110.000" },
  { id: "5", handle: "apple-watch-series-10", title: "Apple Watch Series 10", thumbnail: "https://images.unsplash.com/photo-1524592094714-0f0654e359b1?w=300&h=300&fit=crop&auto=format", price: "KWD 145.000" },
  { id: "6", handle: "playstation-5-slim", title: "PlayStation 5 Slim", thumbnail: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=300&h=300&fit=crop&auto=format", price: "KWD 160.000" },
  { id: "7", handle: "dji-mini-4-pro-drone", title: "DJI Mini 4 Pro Drone", thumbnail: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=300&h=300&fit=crop&auto=format", price: "KWD 290.000" },
  { id: "8", handle: "anker-powerbank-26800mah", title: "Anker PowerBank 26800mAh", thumbnail: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=300&h=300&fit=crop&auto=format", price: "KWD 22.000" },
]

const FALLBACK_FASHION: FallbackProduct[] = [
  { id: "9", handle: "nike-air-max-270", title: "Nike Air Max 270", thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop&auto=format", price: "KWD 48.000" },
  { id: "10", handle: "adidas-ultraboost-24", title: "Adidas Ultraboost 24", thumbnail: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=300&h=300&fit=crop&auto=format", price: "KWD 55.000" },
  { id: "11", handle: "ray-ban-aviator-classic", title: "Ray-Ban Aviator Classic", thumbnail: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop&auto=format", price: "KWD 62.000" },
  { id: "12", handle: "michael-kors-leather-tote", title: "Michael Kors Leather Tote", thumbnail: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&h=300&fit=crop&auto=format", price: "KWD 145.000" },
  { id: "13", handle: "pandora-moments-bracelet", title: "Pandora Moments Bracelet", thumbnail: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=300&h=300&fit=crop&auto=format", price: "KWD 55.000" },
  { id: "14", handle: "hm-premium-abaya", title: "H&M Premium Abaya", thumbnail: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=300&h=300&fit=crop&auto=format", price: "KWD 22.000" },
  { id: "15", handle: "levi-511-slim-jeans", title: "Levi's 511 Slim Jeans", thumbnail: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=300&h=300&fit=crop&auto=format", price: "KWD 28.000" },
  { id: "16", handle: "longchamp-le-pliage-bag", title: "Longchamp Le Pliage Bag", thumbnail: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=300&h=300&fit=crop&auto=format", price: "KWD 88.000" },
]

const FALLBACK_DEALS: FallbackProduct[] = [
  { id: "17", handle: "the-ordinary-aha-bha", title: "The Ordinary AHA 30%+BHA 2%", thumbnail: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300&h=300&fit=crop&auto=format", price: "KWD 8.000" },
  { id: "18", handle: "laneige-lip-sleeping-mask", title: "Laneige Lip Sleeping Mask", thumbnail: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300&h=300&fit=crop&auto=format", price: "KWD 12.000" },
  { id: "19", handle: "al-qassab-arabic-coffee-blend", title: "Al-Qassab Arabic Coffee", thumbnail: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=300&h=300&fit=crop&auto=format", price: "KWD 3.800" },
  { id: "20", handle: "premium-ajwa-dates-1kg", title: "Premium Ajwa Dates 1kg", thumbnail: "https://images.unsplash.com/photo-1609601442485-4522e0b06d7d?w=300&h=300&fit=crop&auto=format", price: "KWD 12.000" },
  { id: "21", handle: "anker-powerbank-26800mah", title: "Anker PowerBank 26800mAh", thumbnail: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=300&h=300&fit=crop&auto=format", price: "KWD 22.000" },
  { id: "22", handle: "himalayan-pink-salt-grinder", title: "Himalayan Pink Salt Grinder", thumbnail: "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=300&h=300&fit=crop&auto=format", price: "KWD 2.500" },
  { id: "23", handle: "nespresso-vertuo-next", title: "Nespresso Vertuo Next", thumbnail: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=300&fit=crop&auto=format", price: "KWD 75.000" },
  { id: "24", handle: "olaplex-no3-hair-perfector", title: "Olaplex No.3 Hair Perfector", thumbnail: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop&auto=format", price: "KWD 22.000" },
]

const CAROUSEL_MAP: Record<string, FallbackProduct[]> = {
  electronics: FALLBACK_ELECTRONICS,
  fashion: FALLBACK_FASHION,
  deals: FALLBACK_DEALS,
}

// ─── Product card ──────────────────────────────────────────────────────────

function ProductCard({ product }: { product: FallbackProduct }) {
  const proof = getSocialProof(product.handle)

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="flex-shrink-0 w-40 sm:w-48 bg-[#1F2937] rounded-lg overflow-hidden hover:ring-1 hover:ring-orange-400 transition-all group"
      data-testid="carousel-product-card"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={product.thumbnail}
        alt={product.title}
        className="w-full aspect-square object-cover group-hover:opacity-90 transition-opacity"
        loading="lazy"
      />
      <div className="p-2">
        <p className="text-white text-xs font-medium leading-tight line-clamp-2 mb-1">
          {product.title}
        </p>
        <div className="flex items-center gap-1 mb-1">
          <span className="text-yellow-400 text-xs">{"★".repeat(Math.floor(proof.rating))}</span>
          <span className="text-gray-400 text-xs">{proof.rating}</span>
        </div>
        <p className="text-orange-400 text-xs font-bold">{product.price}</p>
        {proof.isBestseller && (
          <span
            className="inline-block text-xs bg-orange-500 text-white px-1.5 py-0.5 rounded-full mt-1"
            data-testid="bestseller-badge"
          >
            Bestseller
          </span>
        )}
        <p className="text-gray-500 text-xs mt-0.5" data-testid="sold-count">
          {proof.soldCount}+ sold
        </p>
      </div>
    </LocalizedClientLink>
  )
}

// ─── Main carousel ─────────────────────────────────────────────────────────

interface ProductCarouselProps {
  title: string
  category: "electronics" | "fashion" | "deals"
  seeAllHref?: string
}

export default function ProductCarousel({
  title,
  category,
  seeAllHref = "/store",
}: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const products = CAROUSEL_MAP[category] ?? FALLBACK_ELECTRONICS

  const scrollLeft = useCallback(() => {
    scrollRef.current?.scrollBy({ left: -320, behavior: "smooth" })
  }, [])

  const scrollRight = useCallback(() => {
    scrollRef.current?.scrollBy({ left: 320, behavior: "smooth" })
  }, [])

  return (
    <section
      className="py-4 px-4"
      data-testid="product-carousel"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-bold text-lg">{title}</h2>
          <LocalizedClientLink
            href={seeAllHref}
            className="text-blue-400 text-sm hover:text-blue-300 transition-colors"
          >
            See all →
          </LocalizedClientLink>
        </div>

        {/* Scrollable row + arrows */}
        <div className="relative">
          {/* Left arrow */}
          <button
            onClick={scrollLeft}
            aria-label="Scroll left"
            className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 bg-[#131921]/80 hover:bg-[#1F2937] text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition-colors"
          >
            ‹
          </button>

          {/* Product row */}
          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto scroll-smooth pb-2 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Right arrow */}
          <button
            onClick={scrollRight}
            aria-label="Scroll right"
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-[#131921]/80 hover:bg-[#1F2937] text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition-colors"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  )
}
