"use server"

import { cookies } from "next/headers"
import { locales, type Locale } from "./config"

const LOCALE_COOKIE_NAME = "NEXT_LOCALE"
const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

/**
 * Server action to change the current locale
 * Sets a cookie that persists the user's language preference
 */
export async function setLocale(locale: Locale): Promise<void> {
  if (!locales.includes(locale)) {
    throw new Error(`Invalid locale: ${locale}`)
  }

  const cookieStore = await cookies()
  cookieStore.set(LOCALE_COOKIE_NAME, locale, {
    maxAge: LOCALE_COOKIE_MAX_AGE,
    path: "/",
    sameSite: "lax",
  })
}

/**
 * Get the current locale from cookies
 */
export async function getLocaleFromCookie(): Promise<Locale> {
  const cookieStore = await cookies()
  const locale = cookieStore.get(LOCALE_COOKIE_NAME)?.value

  if (locale && locales.includes(locale as Locale)) {
    return locale as Locale
  }

  return "en"
}
