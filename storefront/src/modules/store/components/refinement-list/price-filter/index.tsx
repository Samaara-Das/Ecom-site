"use client"

import FilterRadioGroup from "@modules/common/components/filter-radio-group"

// Each option encodes minPrice and maxPrice as "min:max"
const PRICE_OPTIONS = [
  { value: ":", label: "Any Price" },
  { value: "0:10", label: "Under KWD 10" },
  { value: "10:50", label: "KWD 10 – 50" },
  { value: "50:150", label: "KWD 50 – 150" },
  { value: "150:500", label: "KWD 150 – 500" },
  { value: "500:", label: "Over KWD 500" },
]

type PriceFilterProps = {
  minPrice?: string
  maxPrice?: string
  setMultipleQueryParams: (updates: Record<string, string>) => void
}

const PriceFilter = ({ minPrice, maxPrice, setMultipleQueryParams }: PriceFilterProps) => {
  const currentValue =
    minPrice || maxPrice ? `${minPrice ?? ""}:${maxPrice ?? ""}` : ":"

  const handleChange = (encoded: string) => {
    const [min, max] = encoded.split(":")
    setMultipleQueryParams({
      minPrice: min ?? "",
      maxPrice: max ?? "",
    })
  }

  return (
    <FilterRadioGroup
      title="Price Range (KWD)"
      items={PRICE_OPTIONS}
      value={currentValue}
      handleChange={handleChange}
    />
  )
}

export default PriceFilter
