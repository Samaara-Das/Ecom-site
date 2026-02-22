"use client"

import FilterRadioGroup from "@modules/common/components/filter-radio-group"

const CATEGORY_OPTIONS = [
  { value: "", label: "All Categories" },
  { value: "electronics", label: "Electronics" },
  { value: "fashion", label: "Fashion" },
  { value: "health & beauty", label: "Health & Beauty" },
  { value: "food & grocery", label: "Food & Grocery" },
  { value: "home & kitchen", label: "Home & Kitchen" },
  { value: "sports", label: "Sports" },
  { value: "kids & toys", label: "Kids & Toys" },
]

type CategoryFilterProps = {
  value: string
  setQueryParams: (name: string, value: string) => void
}

const CategoryFilter = ({ value, setQueryParams }: CategoryFilterProps) => {
  return (
    <FilterRadioGroup
      title="Category"
      items={CATEGORY_OPTIONS}
      value={value}
      handleChange={(v: string) => setQueryParams("category", v)}
    />
  )
}

export default CategoryFilter
