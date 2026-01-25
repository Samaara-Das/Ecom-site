import Medusa from "@medusajs/js-sdk"

/**
 * Medusa SDK client instance
 *
 * This client is used to interact with the Medusa backend API.
 * It handles authentication, session management, and all store operations.
 */
export const sdk = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000",
  debug: process.env.NODE_ENV === "development",
})

/**
 * Get the Medusa SDK instance
 * Useful for server-side operations where you may need to create
 * a new instance with different configuration
 */
export function getMedusaClient(): typeof sdk {
  return sdk
}

/**
 * Default region ID for the marketplace
 * This can be overridden by user selection or geolocation
 */
export const DEFAULT_REGION_ID = process.env.NEXT_PUBLIC_DEFAULT_REGION_ID || ""

/**
 * Supported currencies in the marketplace
 */
export const SUPPORTED_CURRENCIES = ["KWD", "USD", "EUR", "GBP"] as const
export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number]

/**
 * Default currency code
 */
export const DEFAULT_CURRENCY = "KWD" as SupportedCurrency
