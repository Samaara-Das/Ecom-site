"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"

interface Suggestion {
  handle: string
  title: string
  category: string
  price: string
}

// Fallback suggestions when backend is offline
const FALLBACK_SUGGESTIONS: Suggestion[] = [
  { handle: "samsung-galaxy-s25-ultra", title: "Samsung Galaxy S25 Ultra", category: "Electronics", price: "KWD 285.000" },
  { handle: "apple-iphone-16-pro-max", title: "Apple iPhone 16 Pro Max", category: "Electronics", price: "KWD 320.000" },
  { handle: "macbook-pro-14-m4", title: "MacBook Pro 14\" M4", category: "Electronics", price: "KWD 590.000" },
  { handle: "sony-wh-1000xm6-headphones", title: "Sony WH-1000XM6 Headphones", category: "Electronics", price: "KWD 110.000" },
  { handle: "nike-air-max-270", title: "Nike Air Max 270", category: "Fashion", price: "KWD 48.000" },
  { handle: "adidas-ultraboost-24", title: "Adidas Ultraboost 24", category: "Fashion", price: "KWD 55.000" },
  { handle: "charlotte-tilbury-hollywood-flawless-filter", title: "Charlotte Tilbury Flawless Filter", category: "Beauty", price: "KWD 28.000" },
  { handle: "premium-ajwa-dates-1kg", title: "Premium Ajwa Dates 1kg", category: "Food", price: "KWD 12.000" },
  { handle: "dyson-airwrap-complete-long", title: "Dyson Airwrap Complete Long", category: "Beauty", price: "KWD 295.000" },
  { handle: "laneige-lip-sleeping-mask", title: "Laneige Lip Sleeping Mask", category: "Beauty", price: "KWD 12.000" },
  { handle: "playstation-5-slim", title: "PlayStation 5 Slim", category: "Electronics", price: "KWD 160.000" },
  { handle: "michael-kors-leather-tote", title: "Michael Kors Leather Tote", category: "Fashion", price: "KWD 145.000" },
]

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
const PUB_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? ""

interface SearchAutocompleteProps {
  category: string
}

export default function SearchAutocomplete({ category }: SearchAutocompleteProps) {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const params = useParams()
  const countryCode = (params?.countryCode as string) ?? "kw"

  const fetchSuggestions = useCallback(async (q: string) => {
    if (!q.trim() || q.length < 2) {
      setSuggestions([])
      setOpen(false)
      return
    }

    setLoading(true)

    try {
      const url = `${MEDUSA_URL}/store/products?q=${encodeURIComponent(q)}&limit=8`
      const res = await fetch(url, {
        headers: { "x-publishable-api-key": PUB_KEY },
        signal: AbortSignal.timeout(2000),
      })

      if (res.ok) {
        const data = await res.json()
        const items: Suggestion[] = (data.products ?? []).map(
          (p: { handle: string; title: string; metadata?: { category?: string }; variants?: Array<{ prices?: Array<{ amount: number; currency_code: string }> }> }) => ({
            handle: p.handle,
            title: p.title,
            category: (p.metadata?.category as string) ?? "Product",
            price: formatPrice(p.variants?.[0]?.prices),
          })
        )
        setSuggestions(items.slice(0, 8))
      } else {
        throw new Error("API unavailable")
      }
    } catch {
      // Fallback to local suggestions
      const lower = q.toLowerCase()
      const filtered = FALLBACK_SUGGESTIONS.filter(
        (s) =>
          s.title.toLowerCase().includes(lower) ||
          s.category.toLowerCase().includes(lower)
      ).slice(0, 8)
      setSuggestions(filtered)
    } finally {
      setLoading(false)
      setOpen(true)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchSuggestions(query), 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, fetchSuggestions])

  function formatPrice(
    prices?: Array<{ amount: number; currency_code: string }>
  ): string {
    if (!prices || prices.length === 0) return ""
    const kwd = prices.find((p) => p.currency_code === "kwd")
    if (kwd) {
      return `KWD ${(kwd.amount / 1000).toFixed(3)}`
    }
    return ""
  }

  function navigate(handle: string) {
    setOpen(false)
    setQuery("")
    router.push(`/${countryCode}/products/${handle}`)
  }

  function submitSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setOpen(false)
    const params = new URLSearchParams({ q: query })
    if (category && category !== "All") params.set("category", category)
    router.push(`/${countryCode}/search?${params.toString()}`)
  }

  return (
    <div className="relative flex-1 min-w-0">
      <form onSubmit={submitSearch} className="flex w-full">
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
          placeholder="Search Kuwait Marketplace..."
          className="flex-1 px-4 py-2.5 text-gray-900 bg-white text-sm outline-none placeholder:text-gray-400 min-w-0"
          data-testid="search-input"
          autoComplete="off"
        />
        <button
          type="submit"
          className="bg-[#FF9900] hover:bg-[#e68a00] text-gray-900 font-bold px-4 py-2.5 flex items-center justify-center transition-colors"
          aria-label="Search"
          data-testid="search-button"
        >
          🔍
        </button>
      </form>

      {/* Autocomplete dropdown */}
      {open && suggestions.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-b-lg shadow-xl overflow-hidden"
          data-testid="autocomplete-dropdown"
        >
          {loading && (
            <div className="px-4 py-2 text-xs text-gray-400">Searching…</div>
          )}
          {suggestions.map((s) => (
            <button
              key={s.handle}
              onMouseDown={() => navigate(s.handle)}
              className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
              data-testid="autocomplete-item"
            >
              <div>
                <span className="text-sm text-gray-800 font-medium">{s.title}</span>
                <span className="ml-2 text-xs bg-gray-100 text-gray-500 rounded px-1.5 py-0.5">
                  {s.category}
                </span>
              </div>
              {s.price && (
                <span className="text-sm text-orange-600 font-semibold ml-2 flex-shrink-0">
                  {s.price}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
