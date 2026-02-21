"use client"

import { useRouter, useSearchParams, useParams } from "next/navigation"
import { useCallback } from "react"

const CATEGORIES = [
  { label: "All", value: "" },
  { label: "Electronics", value: "electronics" },
  { label: "Fashion", value: "fashion" },
  { label: "Health & Beauty", value: "beauty" },
  { label: "Food & Grocery", value: "food" },
  { label: "Home & Kitchen", value: "home" },
  { label: "Sports", value: "sports" },
  { label: "Kids & Toys", value: "kids" },
]

const PRICE_BUCKETS = [
  { label: "Under 10 KWD", min: 0, max: 10 },
  { label: "10 – 50 KWD", min: 10, max: 50 },
  { label: "50 – 150 KWD", min: 50, max: 150 },
  { label: "150 – 500 KWD", min: 150, max: 500 },
  { label: "500+ KWD", min: 500, max: 99999 },
]

const RATINGS = [
  { label: "4★ & up", value: "4" },
  { label: "3★ & up", value: "3" },
  { label: "2★ & up", value: "2" },
]

const VENDORS = [
  "TechZone Kuwait",
  "Al-Sayer Electronics",
  "Moda Fashion Kuwait",
  "Al-Shaya Fashion",
  "Glow Beauty Kuwait",
  "Oud & Rose Perfumery",
  "Tamr Dates & Foods",
  "Kuwait Organic Market",
]

export default function SearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = useParams()
  const countryCode = (params?.countryCode as string) ?? "kw"

  const updateParam = useCallback(
    (key: string, value: string) => {
      const sp = new URLSearchParams(searchParams.toString())
      if (value) {
        sp.set(key, value)
      } else {
        sp.delete(key)
      }
      router.push(`/${countryCode}/search?${sp.toString()}`)
    },
    [router, searchParams, countryCode]
  )

  const currentCategory = searchParams.get("category") ?? ""
  const currentRating = searchParams.get("rating") ?? ""
  const currentMin = Number(searchParams.get("minPrice") ?? 0)
  const currentMax = Number(searchParams.get("maxPrice") ?? 99999)

  return (
    <aside
      className="w-full lg:w-56 flex-shrink-0 space-y-6"
      data-testid="filter-sidebar"
    >
      {/* Category */}
      <div>
        <h3 className="font-semibold text-sm text-gray-900 mb-2">Category</h3>
        <ul className="space-y-1">
          {CATEGORIES.map((cat) => (
            <li key={cat.value}>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="category"
                  value={cat.value}
                  checked={currentCategory === cat.value}
                  onChange={() => updateParam("category", cat.value)}
                  className="accent-orange-500"
                  data-testid={`filter-category-${cat.value || "all"}`}
                />
                <span className="text-sm text-gray-700 group-hover:text-orange-600 transition-colors">
                  {cat.label}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Price range */}
      <div>
        <h3 className="font-semibold text-sm text-gray-900 mb-2">Price</h3>
        <ul className="space-y-1">
          {PRICE_BUCKETS.map((bucket) => {
            const active = currentMin === bucket.min && currentMax === bucket.max
            return (
              <li key={bucket.label}>
                <button
                  onClick={() => {
                    const sp = new URLSearchParams(searchParams.toString())
                    if (active) {
                      sp.delete("minPrice")
                      sp.delete("maxPrice")
                    } else {
                      sp.set("minPrice", String(bucket.min))
                      sp.set("maxPrice", String(bucket.max))
                    }
                    router.push(`/${countryCode}/search?${sp.toString()}`)
                  }}
                  className={`text-sm w-full text-left px-1 py-0.5 rounded transition-colors ${
                    active
                      ? "text-orange-600 font-semibold"
                      : "text-gray-700 hover:text-orange-600"
                  }`}
                  data-testid={`filter-price-${bucket.min}`}
                >
                  {bucket.label}
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-semibold text-sm text-gray-900 mb-2">Customer Rating</h3>
        <ul className="space-y-1">
          {RATINGS.map((r) => (
            <li key={r.value}>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="rating"
                  value={r.value}
                  checked={currentRating === r.value}
                  onChange={() => updateParam("rating", r.value)}
                  className="accent-orange-500"
                  data-testid={`filter-rating-${r.value}plus`}
                />
                <span className="text-sm text-gray-700 group-hover:text-orange-600 transition-colors flex items-center gap-1">
                  <span className="text-yellow-400">{r.label.replace(" & up", "")}</span>
                  <span className="text-gray-500 text-xs">& up</span>
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Vendor */}
      <div>
        <h3 className="font-semibold text-sm text-gray-900 mb-2">Vendor</h3>
        <ul className="space-y-1">
          {VENDORS.map((v) => (
            <li key={v}>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="accent-orange-500"
                  data-testid={`filter-vendor-${v.toLowerCase().replace(/\s/g, "-")}`}
                />
                <span className="text-xs text-gray-700 group-hover:text-orange-600 transition-colors">
                  {v}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
