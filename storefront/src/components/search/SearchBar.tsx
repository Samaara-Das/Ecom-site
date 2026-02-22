"use client"

import { useState } from "react"
import SearchAutocomplete from "./SearchAutocomplete"

const CATEGORIES = [
  "All",
  "Electronics",
  "Fashion",
  "Health & Beauty",
  "Food & Grocery",
  "Home & Kitchen",
  "Sports",
  "Kids & Toys",
]

export default function SearchBar() {
  const [category, setCategory] = useState("All")
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    // overflow-visible is intentional: allows the autocomplete dropdown to escape the nav bar
    <div className="relative flex w-full max-w-2xl rounded-md border border-gray-300 focus-within:border-orange-400 transition-colors">
      {/* Category dropdown */}
      <div className="relative flex-shrink-0">
        <button
          onClick={() => setDropdownOpen((v) => !v)}
          onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
          className="h-full px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium flex items-center gap-1 border-r border-gray-300 whitespace-nowrap transition-colors rounded-l-md"
          data-testid="category-dropdown"
          aria-expanded={dropdownOpen}
          aria-haspopup="listbox"
        >
          {category.length > 10 ? category.slice(0, 10) + "…" : category}
          <span className="text-xs">▾</span>
        </button>

        {dropdownOpen && (
          <div
            className="absolute top-full left-0 z-[100] bg-white border border-gray-200 rounded-b shadow-lg min-w-[160px]"
            role="listbox"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onMouseDown={() => {
                  setCategory(cat)
                  setDropdownOpen(false)
                }}
                className={`w-full text-left px-3 py-2 text-xs hover:bg-orange-50 transition-colors ${
                  cat === category ? "bg-orange-50 text-orange-600 font-semibold" : "text-gray-700"
                }`}
                role="option"
                aria-selected={cat === category}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search input + autocomplete */}
      <SearchAutocomplete category={category} />
    </div>
  )
}
