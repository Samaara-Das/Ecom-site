// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from "vitest"

// Mock Medusa modules before importing the seed script
vi.mock("@medusajs/framework/utils", () => ({
  ContainerRegistrationKeys: {
    LOGGER: "logger",
    QUERY: "query",
  },
  Modules: {
    FULFILLMENT: "fulfillmentModuleService",
  },
}))

vi.mock("@medusajs/medusa/core-flows", () => ({
  createProductsWorkflow: vi.fn(),
}))

// Import after mocking
import seedProducts from "../seed-products"
import { createProductsWorkflow } from "@medusajs/medusa/core-flows"

describe("seed-products", () => {
  // Create mock container with logger, query, and other services
  const mockLogger = {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  }

  const mockQuery = {
    graph: vi.fn(),
  }

  const mockFulfillmentModule = {
    listShippingProfiles: vi.fn(),
  }

  const mockContainer = {
    resolve: vi.fn((key: string) => {
      switch (key) {
        case "logger":
          return mockLogger
        case "query":
          return mockQuery
        case "fulfillmentModuleService":
          return mockFulfillmentModule
        default:
          return undefined
      }
    }),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("product data validation", () => {
    it("should have the correct number of sample products (10-15)", async () => {
      // Setup mocks
      mockQuery.graph.mockResolvedValue({ data: [] })
      mockFulfillmentModule.listShippingProfiles.mockResolvedValue([])

      const mockWorkflowRun = vi.fn().mockResolvedValue({
        result: [{ id: "prod_123", title: "Test", handle: "test" }],
      })
      ;(createProductsWorkflow as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        run: mockWorkflowRun,
      })

      const result = await seedProducts({ container: mockContainer as any })

      // Should have between 10 and 15 products
      expect(result.total).toBeGreaterThanOrEqual(10)
      expect(result.total).toBeLessThanOrEqual(15)
    })

    it("should create products across 3 categories", async () => {
      mockQuery.graph.mockResolvedValue({ data: [] })
      mockFulfillmentModule.listShippingProfiles.mockResolvedValue([])

      const createdProducts: Array<{ metadata: { category: string } }> = []
      const mockWorkflowRun = vi.fn().mockImplementation(async (args) => {
        const product = args.input.products[0]
        createdProducts.push(product)
        return {
          result: [{ id: `prod_${createdProducts.length}`, title: product.title, handle: product.handle }],
        }
      })
      ;(createProductsWorkflow as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        run: mockWorkflowRun,
      })

      await seedProducts({ container: mockContainer as any })

      // Collect unique categories
      const categories = new Set(createdProducts.map((p) => p.metadata.category))

      // Should have exactly 3 categories: Electronics, Fashion, Home & Kitchen
      expect(categories.size).toBe(3)
      expect(categories.has("Electronics")).toBe(true)
      expect(categories.has("Fashion")).toBe(true)
      expect(categories.has("Home & Kitchen")).toBe(true)
    })

    it("should create products with at least 2 variants each", async () => {
      mockQuery.graph.mockResolvedValue({ data: [] })
      mockFulfillmentModule.listShippingProfiles.mockResolvedValue([])

      const createdProducts: Array<{ title: string; variants: unknown[] }> = []
      const mockWorkflowRun = vi.fn().mockImplementation(async (args) => {
        const product = args.input.products[0]
        createdProducts.push(product)
        return {
          result: [{ id: `prod_${createdProducts.length}`, title: product.title, handle: product.handle }],
        }
      })
      ;(createProductsWorkflow as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        run: mockWorkflowRun,
      })

      await seedProducts({ container: mockContainer as any })

      // Every product should have at least 2 variants
      for (const product of createdProducts) {
        expect(product.variants.length).toBeGreaterThanOrEqual(2)
      }
    })

    it("should create products with valid handles (URL-friendly)", async () => {
      mockQuery.graph.mockResolvedValue({ data: [] })
      mockFulfillmentModule.listShippingProfiles.mockResolvedValue([])

      const createdProducts: Array<{ handle: string }> = []
      const mockWorkflowRun = vi.fn().mockImplementation(async (args) => {
        const product = args.input.products[0]
        createdProducts.push(product)
        return {
          result: [{ id: `prod_${createdProducts.length}`, title: product.title, handle: product.handle }],
        }
      })
      ;(createProductsWorkflow as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        run: mockWorkflowRun,
      })

      await seedProducts({ container: mockContainer as any })

      // All handles should be URL-friendly (lowercase, hyphenated)
      const handleRegex = /^[a-z0-9-]+$/
      for (const product of createdProducts) {
        expect(product.handle).toMatch(handleRegex)
      }
    })

    it("should create products with placeholder image URLs", async () => {
      mockQuery.graph.mockResolvedValue({ data: [] })
      mockFulfillmentModule.listShippingProfiles.mockResolvedValue([])

      const createdProducts: Array<{ thumbnail: string; images: Array<{ url: string }> }> = []
      const mockWorkflowRun = vi.fn().mockImplementation(async (args) => {
        const product = args.input.products[0]
        createdProducts.push(product)
        return {
          result: [{ id: `prod_${createdProducts.length}`, title: product.title, handle: product.handle }],
        }
      })
      ;(createProductsWorkflow as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        run: mockWorkflowRun,
      })

      await seedProducts({ container: mockContainer as any })

      // All products should have valid placeholder images
      for (const product of createdProducts) {
        expect(product.thumbnail).toContain("picsum.photos")
        expect(product.images.length).toBeGreaterThan(0)
        for (const image of product.images) {
          expect(image.url).toContain("picsum.photos")
        }
      }
    })

    it("should create variants with valid prices in USD and KWD", async () => {
      mockQuery.graph.mockResolvedValue({ data: [] })
      mockFulfillmentModule.listShippingProfiles.mockResolvedValue([])

      const createdProducts: Array<{
        variants: Array<{ prices: Array<{ amount: number; currency_code: string }> }>
      }> = []
      const mockWorkflowRun = vi.fn().mockImplementation(async (args) => {
        const product = args.input.products[0]
        createdProducts.push(product)
        return {
          result: [{ id: `prod_${createdProducts.length}`, title: product.title, handle: product.handle }],
        }
      })
      ;(createProductsWorkflow as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        run: mockWorkflowRun,
      })

      await seedProducts({ container: mockContainer as any })

      // All variants should have prices in both USD and KWD
      for (const product of createdProducts) {
        for (const variant of product.variants) {
          expect(variant.prices.length).toBe(2)

          const currencies = variant.prices.map((p) => p.currency_code)
          expect(currencies).toContain("usd")
          expect(currencies).toContain("kwd")

          for (const price of variant.prices) {
            expect(price.amount).toBeGreaterThan(0)
            expect(typeof price.amount).toBe("number")
          }
        }
      }
    })

    it("should create variants with unique SKUs", async () => {
      mockQuery.graph.mockResolvedValue({ data: [] })
      mockFulfillmentModule.listShippingProfiles.mockResolvedValue([])

      const allSkus: string[] = []
      const mockWorkflowRun = vi.fn().mockImplementation(async (args) => {
        const product = args.input.products[0]
        for (const variant of product.variants as Array<{ sku: string }>) {
          allSkus.push(variant.sku)
        }
        return {
          result: [{ id: `prod_${allSkus.length}`, title: product.title, handle: product.handle }],
        }
      })
      ;(createProductsWorkflow as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        run: mockWorkflowRun,
      })

      await seedProducts({ container: mockContainer as any })

      // All SKUs should be unique
      const uniqueSkus = new Set(allSkus)
      expect(uniqueSkus.size).toBe(allSkus.length)
    })
  })

  describe("seeder execution", () => {
    it("should fetch sales channels on startup", async () => {
      mockQuery.graph.mockResolvedValue({
        data: [{ id: "sc_123", name: "Default Sales Channel" }],
      })
      mockFulfillmentModule.listShippingProfiles.mockResolvedValue([])

      const mockWorkflowRun = vi.fn().mockResolvedValue({
        result: [{ id: "prod_123", title: "Test", handle: "test" }],
      })
      ;(createProductsWorkflow as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        run: mockWorkflowRun,
      })

      await seedProducts({ container: mockContainer as any })

      expect(mockQuery.graph).toHaveBeenCalledWith(
        expect.objectContaining({
          entity: "sales_channel",
          fields: ["id", "name"],
        })
      )
    })

    it("should associate products with sales channel when available", async () => {
      mockQuery.graph.mockResolvedValue({
        data: [{ id: "sc_123", name: "Default Sales Channel" }],
      })
      mockFulfillmentModule.listShippingProfiles.mockResolvedValue([
        { id: "sp_default" },
      ])

      const capturedInputs: any[] = []
      const mockWorkflowRun = vi.fn().mockImplementation(async (args) => {
        capturedInputs.push(args.input)
        return {
          result: [{ id: "prod_123", title: "Test", handle: "test" }],
        }
      })
      ;(createProductsWorkflow as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        run: mockWorkflowRun,
      })

      await seedProducts({ container: mockContainer as any })

      // All products should have sales_channels set
      for (const input of capturedInputs) {
        expect(input.products[0].sales_channels).toEqual([{ id: "sc_123" }])
      }
    })

    it("should handle errors gracefully and continue processing", async () => {
      mockQuery.graph.mockResolvedValue({ data: [] })
      mockFulfillmentModule.listShippingProfiles.mockResolvedValue([])

      let callCount = 0
      const mockWorkflowRun = vi.fn().mockImplementation(async () => {
        callCount++
        // Fail on first product, succeed on others
        if (callCount === 1) {
          throw new Error("Simulated error")
        }
        return {
          result: [{ id: `prod_${callCount}`, title: "Test", handle: "test" }],
        }
      })
      ;(createProductsWorkflow as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        run: mockWorkflowRun,
      })

      const result = await seedProducts({ container: mockContainer as any })

      // Should have exactly 1 failure
      expect(result.failed).toBe(1)
      // Should have processed all products (success + failed = total)
      expect(result.success + result.failed).toBe(result.total)
      // Should have logged the error
      expect(mockLogger.error).toHaveBeenCalled()
    })

    it("should log progress for each product", async () => {
      mockQuery.graph.mockResolvedValue({ data: [] })
      mockFulfillmentModule.listShippingProfiles.mockResolvedValue([])

      const mockWorkflowRun = vi.fn().mockResolvedValue({
        result: [{ id: "prod_123", title: "Test Product", handle: "test-product" }],
      })
      ;(createProductsWorkflow as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        run: mockWorkflowRun,
      })

      await seedProducts({ container: mockContainer as any })

      // Should log for each product creation
      expect(mockLogger.info).toHaveBeenCalledWith(expect.stringContaining("Creating product:"))
      expect(mockLogger.info).toHaveBeenCalledWith(expect.stringContaining("Created:"))
    })

    it("should return a summary with correct counts", async () => {
      mockQuery.graph.mockResolvedValue({ data: [] })
      mockFulfillmentModule.listShippingProfiles.mockResolvedValue([])

      const mockWorkflowRun = vi.fn().mockResolvedValue({
        result: [{ id: "prod_123", title: "Test", handle: "test" }],
      })
      ;(createProductsWorkflow as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        run: mockWorkflowRun,
      })

      const result = await seedProducts({ container: mockContainer as any })

      expect(result).toHaveProperty("total")
      expect(result).toHaveProperty("success")
      expect(result).toHaveProperty("failed")
      expect(result.success).toBe(result.total)
      expect(result.failed).toBe(0)
    })

    it("should handle missing sales channel gracefully", async () => {
      mockQuery.graph.mockResolvedValue({ data: [] })
      mockFulfillmentModule.listShippingProfiles.mockResolvedValue([])

      const mockWorkflowRun = vi.fn().mockResolvedValue({
        result: [{ id: "prod_123", title: "Test", handle: "test" }],
      })
      ;(createProductsWorkflow as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        run: mockWorkflowRun,
      })

      await seedProducts({ container: mockContainer as any })

      // Should warn about missing sales channel
      expect(mockLogger.warn).toHaveBeenCalledWith(
        expect.stringContaining("No sales channels found")
      )
    })

    it("should handle query errors gracefully", async () => {
      mockQuery.graph.mockRejectedValue(new Error("Database error"))
      mockFulfillmentModule.listShippingProfiles.mockRejectedValue(
        new Error("Database error")
      )

      const mockWorkflowRun = vi.fn().mockResolvedValue({
        result: [{ id: "prod_123", title: "Test", handle: "test" }],
      })
      ;(createProductsWorkflow as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        run: mockWorkflowRun,
      })

      // Should not throw
      const result = await seedProducts({ container: mockContainer as any })

      expect(result.total).toBeGreaterThan(0)
    })
  })

  describe("product content", () => {
    it("should have Electronics category products", async () => {
      mockQuery.graph.mockResolvedValue({ data: [] })
      mockFulfillmentModule.listShippingProfiles.mockResolvedValue([])

      const createdProducts: Array<{ title: string; metadata: { category: string } }> = []
      const mockWorkflowRun = vi.fn().mockImplementation(async (args) => {
        const product = args.input.products[0]
        createdProducts.push(product)
        return {
          result: [{ id: `prod_${createdProducts.length}`, title: product.title, handle: product.handle }],
        }
      })
      ;(createProductsWorkflow as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        run: mockWorkflowRun,
      })

      await seedProducts({ container: mockContainer as any })

      const electronicsProducts = createdProducts.filter(
        (p) => p.metadata.category === "Electronics"
      )

      expect(electronicsProducts.length).toBeGreaterThan(0)
    })

    it("should have Fashion category products", async () => {
      mockQuery.graph.mockResolvedValue({ data: [] })
      mockFulfillmentModule.listShippingProfiles.mockResolvedValue([])

      const createdProducts: Array<{ title: string; metadata: { category: string } }> = []
      const mockWorkflowRun = vi.fn().mockImplementation(async (args) => {
        const product = args.input.products[0]
        createdProducts.push(product)
        return {
          result: [{ id: `prod_${createdProducts.length}`, title: product.title, handle: product.handle }],
        }
      })
      ;(createProductsWorkflow as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        run: mockWorkflowRun,
      })

      await seedProducts({ container: mockContainer as any })

      const fashionProducts = createdProducts.filter(
        (p) => p.metadata.category === "Fashion"
      )

      expect(fashionProducts.length).toBeGreaterThan(0)
    })

    it("should have Home & Kitchen category products", async () => {
      mockQuery.graph.mockResolvedValue({ data: [] })
      mockFulfillmentModule.listShippingProfiles.mockResolvedValue([])

      const createdProducts: Array<{ title: string; metadata: { category: string } }> = []
      const mockWorkflowRun = vi.fn().mockImplementation(async (args) => {
        const product = args.input.products[0]
        createdProducts.push(product)
        return {
          result: [{ id: `prod_${createdProducts.length}`, title: product.title, handle: product.handle }],
        }
      })
      ;(createProductsWorkflow as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        run: mockWorkflowRun,
      })

      await seedProducts({ container: mockContainer as any })

      const homeKitchenProducts = createdProducts.filter(
        (p) => p.metadata.category === "Home & Kitchen"
      )

      expect(homeKitchenProducts.length).toBeGreaterThan(0)
    })

    it("should have products with descriptions", async () => {
      mockQuery.graph.mockResolvedValue({ data: [] })
      mockFulfillmentModule.listShippingProfiles.mockResolvedValue([])

      const createdProducts: Array<{ title: string; description: string }> = []
      const mockWorkflowRun = vi.fn().mockImplementation(async (args) => {
        const product = args.input.products[0]
        createdProducts.push(product)
        return {
          result: [{ id: `prod_${createdProducts.length}`, title: product.title, handle: product.handle }],
        }
      })
      ;(createProductsWorkflow as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        run: mockWorkflowRun,
      })

      await seedProducts({ container: mockContainer as any })

      for (const product of createdProducts) {
        expect(product.description).toBeDefined()
        expect(product.description.length).toBeGreaterThan(20)
      }
    })

    it("should set products as published", async () => {
      mockQuery.graph.mockResolvedValue({ data: [] })
      mockFulfillmentModule.listShippingProfiles.mockResolvedValue([])

      const createdProducts: Array<{ status: string }> = []
      const mockWorkflowRun = vi.fn().mockImplementation(async (args) => {
        const product = args.input.products[0]
        createdProducts.push(product)
        return {
          result: [{ id: `prod_${createdProducts.length}`, title: product.title, handle: product.handle }],
        }
      })
      ;(createProductsWorkflow as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        run: mockWorkflowRun,
      })

      await seedProducts({ container: mockContainer as any })

      for (const product of createdProducts) {
        expect(product.status).toBe("published")
      }
    })
  })
})
