"use client"

import { useLocale } from "next-intl"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { locales, localeNames, type Locale } from "@/i18n/config"
import { setLocale } from "@/i18n/actions"

export default function LocaleSwitcher() {
  const locale = useLocale() as Locale
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleChange = (newLocale: Locale) => {
    startTransition(async () => {
      await setLocale(newLocale)
      router.refresh()
    })
  }

  return (
    <div className="flex items-center gap-2">
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => handleChange(loc)}
          disabled={isPending || loc === locale}
          className={`px-2 py-1 text-sm rounded transition-colors ${
            loc === locale
              ? "bg-gray-200 text-gray-900 font-medium"
              : "text-gray-600 hover:bg-gray-100"
          } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {localeNames[loc]}
        </button>
      ))}
    </div>
  )
}
