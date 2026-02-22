"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

import SortProducts, { SortOptions } from "./sort-products"
import CategoryFilter from "./category-filter"
import PriceFilter from "./price-filter"
import RatingFilter from "./rating-filter"

type RefinementListProps = {
  sortBy: SortOptions
  category?: string
  minPrice?: string
  maxPrice?: string
  rating?: string
  search?: boolean
  "data-testid"?: string
}

const RefinementList = ({
  sortBy,
  category,
  minPrice,
  maxPrice,
  rating,
  "data-testid": dataTestId,
}: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }
      return params.toString()
    },
    [searchParams]
  )

  const setQueryParams = (name: string, value: string) => {
    const query = createQueryString(name, value)
    router.push(`${pathname}${query ? `?${query}` : ""}`)
  }

  const setMultipleQueryParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams)
    for (const [name, value] of Object.entries(updates)) {
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }
    }
    const query = params.toString()
    router.push(`${pathname}${query ? `?${query}` : ""}`)
  }

  const hasActiveFilters = !!(category || minPrice || maxPrice || rating)

  const clearAll = () => {
    const params = new URLSearchParams(searchParams)
    params.delete("category")
    params.delete("minPrice")
    params.delete("maxPrice")
    params.delete("rating")
    router.push(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`)
  }

  return (
    <div className="flex small:flex-col gap-12 py-4 mb-8 small:px-0 pl-6 small:min-w-[250px] small:ml-[1.675rem]">
      {hasActiveFilters && (
        <div>
          <button
            onClick={clearAll}
            className="text-xs text-blue-500 hover:underline"
            data-testid="clear-all-filters"
          >
            ✕ Clear all filters
          </button>
        </div>
      )}
      <SortProducts
        sortBy={sortBy}
        setQueryParams={setQueryParams}
        data-testid={dataTestId}
      />
      <CategoryFilter
        value={category ?? ""}
        setQueryParams={setQueryParams}
      />
      <PriceFilter
        minPrice={minPrice}
        maxPrice={maxPrice}
        setMultipleQueryParams={setMultipleQueryParams}
      />
      <RatingFilter
        value={rating ?? ""}
        setQueryParams={setQueryParams}
      />
    </div>
  )
}

export default RefinementList
