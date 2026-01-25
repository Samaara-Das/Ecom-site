import { describe, it, expect } from "vitest"
import {
  sdk,
  getMedusaClient,
  DEFAULT_CURRENCY,
  SUPPORTED_CURRENCIES,
} from "./medusa"

describe("Medusa SDK Configuration", () => {
  it("exports a Medusa SDK instance", () => {
    expect(sdk).toBeDefined()
    expect(typeof sdk).toBe("object")
  })

  it("getMedusaClient returns the SDK instance", () => {
    const client = getMedusaClient()
    expect(client).toBe(sdk)
  })

  it("SDK has store property for storefront operations", () => {
    expect(sdk.store).toBeDefined()
  })

  it("SDK has auth property for authentication", () => {
    expect(sdk.auth).toBeDefined()
  })

  it("SDK has client property for raw API calls", () => {
    expect(sdk.client).toBeDefined()
  })
})

describe("Currency Configuration", () => {
  it("has KWD as default currency", () => {
    expect(DEFAULT_CURRENCY).toBe("KWD")
  })

  it("supports KWD, USD, EUR, and GBP currencies", () => {
    expect(SUPPORTED_CURRENCIES).toContain("KWD")
    expect(SUPPORTED_CURRENCIES).toContain("USD")
    expect(SUPPORTED_CURRENCIES).toContain("EUR")
    expect(SUPPORTED_CURRENCIES).toContain("GBP")
    expect(SUPPORTED_CURRENCIES).toHaveLength(4)
  })
})
