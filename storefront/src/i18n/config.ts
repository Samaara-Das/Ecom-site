/**
 * i18n configuration for the storefront
 * Supports English (default) and Arabic locales
 */

export const locales = ['en', 'ar'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ar: 'العربية',
}

// RTL languages
export const rtlLocales: Locale[] = ['ar']

export function isRtlLocale(locale: Locale): boolean {
  return rtlLocales.includes(locale)
}
