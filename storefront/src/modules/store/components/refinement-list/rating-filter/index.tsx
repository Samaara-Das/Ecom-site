"use client"

import FilterRadioGroup from "@modules/common/components/filter-radio-group"

const RATING_OPTIONS = [
  { value: "", label: "Any Rating" },
  { value: "4", label: "4★ & Up" },
  { value: "3", label: "3★ & Up" },
]

type RatingFilterProps = {
  value: string
  setQueryParams: (name: string, value: string) => void
}

const RatingFilter = ({ value, setQueryParams }: RatingFilterProps) => {
  return (
    <FilterRadioGroup
      title="Rating"
      items={RATING_OPTIONS}
      value={value}
      handleChange={(v: string) => setQueryParams("rating", v)}
    />
  )
}

export default RatingFilter
