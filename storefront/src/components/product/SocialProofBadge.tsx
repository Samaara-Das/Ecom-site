"use client"

/**
 * SocialProofBadge — Displays bestseller, new arrival, sold count, and rating badges.
 * Used on product cards in the store listing and homepage carousels.
 * data-testid attributes are required for Playwright verification.
 */

import { getSocialProof } from "@lib/social-proof-config"

interface SocialProofBadgeProps {
  handle: string
  /** Show the overlay badges (Bestseller / New) on top of the card image */
  showOverlayBadges?: boolean
  /** Show the rating and sold-count below the product title */
  showMetrics?: boolean
  className?: string
}

export default function SocialProofBadge({
  handle,
  showOverlayBadges = true,
  showMetrics = true,
  className = "",
}: SocialProofBadgeProps) {
  const proof = getSocialProof(handle)

  return (
    <div className={`social-proof-wrapper ${className}`}>
      {/* ── Overlay badges (position: absolute inside the card) ── */}
      {showOverlayBadges && (
        <div className="flex flex-wrap gap-1 mb-1">
          {proof.isBestseller && (
            <span
              className="inline-flex items-center text-xs font-semibold bg-orange-500 text-white px-2 py-0.5 rounded-full"
              data-testid="bestseller-badge"
            >
              Bestseller
            </span>
          )}
          {proof.isNew && (
            <span
              className="inline-flex items-center text-xs font-semibold bg-green-600 text-white px-2 py-0.5 rounded-full"
              data-testid="new-arrival-badge"
            >
              New
            </span>
          )}
          {proof.discountPercent && proof.discountPercent > 0 ? (
            <span
              className="inline-flex items-center text-xs font-semibold bg-red-600 text-white px-2 py-0.5 rounded-full"
              data-testid="discount-badge"
            >
              -{proof.discountPercent}%
            </span>
          ) : null}
        </div>
      )}

      {/* ── Metrics row ── */}
      {showMetrics && (
        <div className="flex flex-col gap-0.5">
          {/* Star rating */}
          <div className="flex items-center gap-1">
            <span className="text-yellow-400 text-sm" aria-hidden="true">
              {"★".repeat(Math.floor(proof.rating))}
              {proof.rating % 1 >= 0.5 ? "½" : ""}
            </span>
            <span
              className="text-xs text-gray-600"
              data-testid="star-rating"
            >
              {proof.rating.toFixed(1)}
            </span>
            <span className="text-xs text-gray-400">
              ({proof.reviewCount})
            </span>
          </div>

          {/* Sold count */}
          <span
            className="text-xs text-gray-500"
            data-testid="sold-count"
          >
            {proof.soldCount >= 1000
              ? `${(proof.soldCount / 1000).toFixed(1)}k+`
              : `${proof.soldCount}+`}{" "}
            sold this month
          </span>
        </div>
      )}
    </div>
  )
}
