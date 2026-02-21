"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getSocialProof } from "@lib/social-proof-config"

export interface SearchProduct {
  id: string
  handle: string
  title: string
  thumbnail?: string
  description?: string
  price?: string
  originalPrice?: string
  vendor?: string
  discountPercent?: number
}

interface SearchResultCardProps {
  product: SearchProduct
}

export default function SearchResultCard({ product }: SearchResultCardProps) {
  const proof = getSocialProof(product.handle)

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow flex flex-col"
      data-testid="search-result-card"
    >
      <LocalizedClientLink href={`/products/${product.handle}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={
            product.thumbnail ||
            `https://picsum.photos/seed/${product.handle}/400/400`
          }
          alt={product.title}
          className="w-full aspect-square object-cover hover:opacity-90 transition-opacity"
          loading="lazy"
        />
      </LocalizedClientLink>

      <div className="p-3 flex flex-col flex-1">
        <LocalizedClientLink href={`/products/${product.handle}`}>
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 hover:text-orange-600 transition-colors mb-1">
            {product.title}
          </h3>
        </LocalizedClientLink>

        {product.vendor && (
          <p className="text-xs text-blue-600 mb-1">Sold by {product.vendor}</p>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1 mb-1">
          <span className="text-yellow-400 text-xs">{"★".repeat(Math.floor(proof.rating))}</span>
          <span className="text-xs text-gray-500">{proof.rating}</span>
          <span className="text-xs text-gray-400">({proof.reviewCount})</span>
        </div>

        {/* Sold count */}
        <p className="text-xs text-gray-500 mb-2" data-testid="sold-count">
          {proof.soldCount}+ bought in past month
        </p>

        {/* Price row */}
        <div className="mt-auto">
          <div className="flex items-center gap-2 flex-wrap">
            {proof.isBestseller && (
              <span
                className="text-xs bg-orange-500 text-white px-1.5 py-0.5 rounded-full font-semibold"
                data-testid="bestseller-badge"
              >
                Bestseller
              </span>
            )}
            {proof.isNew && (
              <span className="text-xs bg-green-600 text-white px-1.5 py-0.5 rounded-full font-semibold">
                New
              </span>
            )}
          </div>

          {product.price && (
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-base font-bold text-gray-900">{product.price}</span>
              {product.originalPrice && product.originalPrice !== product.price && (
                <span className="text-sm text-gray-400 line-through">{product.originalPrice}</span>
              )}
              {product.discountPercent && product.discountPercent > 0 ? (
                <span className="text-xs text-red-600 font-semibold">-{product.discountPercent}%</span>
              ) : null}
            </div>
          )}

          <p className="text-xs text-green-700 mt-1">Free delivery above 10 KWD</p>
        </div>

        <button
          className="mt-3 w-full bg-[#FF9900] hover:bg-[#e68a00] text-gray-900 font-semibold text-sm py-2 rounded-lg transition-colors"
          data-testid="add-to-cart-button"
          onClick={() => {
            // Navigate to product page for full add-to-cart flow
            window.location.href = `/products/${product.handle}`
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}
