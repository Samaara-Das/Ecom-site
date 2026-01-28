import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'
import { defaultLocale, locales, type Locale } from './config'

/**
 * Request-scoped configuration for next-intl
 * Provides locale and messages to Server Components
 */
export default getRequestConfig(async () => {
  // Get locale from cookie, default to 'en'
  const cookieStore = await cookies()
  const localeCookie = cookieStore.get('NEXT_LOCALE')?.value

  // Validate locale
  const locale: Locale = locales.includes(localeCookie as Locale)
    ? (localeCookie as Locale)
    : defaultLocale

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
