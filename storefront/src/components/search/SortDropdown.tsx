"use client"

import { useRouter, useSearchParams, useParams } from "next/navigation"

const SORT_OPTIONS = [
  { label: "Featured", value: "" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Avg. Customer Review", value: "rating_desc" },
  { label: "Newest Arrivals", value: "created_at_desc" },
]

export default function SortDropdown() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = useParams()
  const countryCode = (params?.countryCode as string) ?? "kw"
  const currentSort = searchParams.get("sort") ?? ""

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const sp = new URLSearchParams(searchParams.toString())
    if (e.target.value) {
      sp.set("sort", e.target.value)
    } else {
      sp.delete("sort")
    }
    router.push(`/${countryCode}/search?${sp.toString()}`)
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-select" className="text-sm text-gray-600 whitespace-nowrap">
        Sort:
      </label>
      <select
        id="sort-select"
        value={currentSort}
        onChange={handleChange}
        className="text-sm border border-gray-300 rounded px-2 py-1.5 bg-white focus:outline-none focus:border-orange-400 cursor-pointer"
        data-testid="sort-dropdown"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
