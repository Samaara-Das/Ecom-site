import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, beforeEach, vi } from "vitest"
import { ProductCard } from "./ProductCard"
import { CartProvider, useCart } from "@/context/CartContext"
import React from "react"

// Mock Next.js Image component
vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string; fill?: boolean; className?: string; sizes?: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}))

// Helper component to display cart state
function CartStateDisplay() {
  const { items, itemCount, total, isOpen } = useCart()
  return (
    <div data-testid="cart-state">
      <span data-testid="cart-item-count">{itemCount}</span>
      <span data-testid="cart-total">{total}</span>
      <span data-testid="cart-is-open">{isOpen ? "open" : "closed"}</span>
      <span data-testid="cart-items">{JSON.stringify(items)}</span>
    </div>
  )
}

// Helper to render with CartProvider
function renderWithCart(ui: React.ReactElement) {
  return render(
    <CartProvider>
      {ui}
      <CartStateDisplay />
    </CartProvider>
  )
}

describe("ProductCard", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  const defaultProps = {
    id: "prod-123",
    title: "Test Product",
    thumbnail: "/test-image.jpg",
    price: 1500, // 15.00 KWD in cents
  }

  describe("Rendering", () => {
    it("renders product title", () => {
      renderWithCart(<ProductCard {...defaultProps} />)

      expect(screen.getByText("Test Product")).toBeInTheDocument()
    })

    it("renders product price in KWD", () => {
      renderWithCart(<ProductCard {...defaultProps} />)

      // Price should be formatted (15.00 KWD or similar)
      expect(screen.getByText(/15/)).toBeInTheDocument()
    })

    it("renders product image when thumbnail provided", () => {
      renderWithCart(<ProductCard {...defaultProps} />)

      const image = screen.getByAltText("Test Product")
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute("src", "/test-image.jpg")
    })

    it("renders placeholder when no thumbnail", () => {
      renderWithCart(<ProductCard {...defaultProps} thumbnail={null} />)

      // Should not have an image with alt text
      expect(screen.queryByAltText("Test Product")).not.toBeInTheDocument()
    })

    it("renders Add to Cart button", () => {
      renderWithCart(<ProductCard {...defaultProps} />)

      expect(screen.getByRole("button", { name: /add to cart/i })).toBeInTheDocument()
    })
  })

  describe("Add to Cart Functionality", () => {
    it("adds item to cart when button clicked", async () => {
      const user = userEvent.setup()
      renderWithCart(<ProductCard {...defaultProps} />)

      expect(screen.getByTestId("cart-item-count")).toHaveTextContent("0")

      await user.click(screen.getByRole("button", { name: /add to cart/i }))

      expect(screen.getByTestId("cart-item-count")).toHaveTextContent("1")
    })

    it("opens cart drawer when item added", async () => {
      const user = userEvent.setup()
      renderWithCart(<ProductCard {...defaultProps} />)

      expect(screen.getByTestId("cart-is-open")).toHaveTextContent("closed")

      await user.click(screen.getByRole("button", { name: /add to cart/i }))

      expect(screen.getByTestId("cart-is-open")).toHaveTextContent("open")
    })

    it("adds correct item data to cart", async () => {
      const user = userEvent.setup()
      renderWithCart(<ProductCard {...defaultProps} />)

      await user.click(screen.getByRole("button", { name: /add to cart/i }))

      const items = JSON.parse(screen.getByTestId("cart-items").textContent || "[]")
      expect(items).toHaveLength(1)
      expect(items[0]).toMatchObject({
        id: "prod-123",
        title: "Test Product",
        thumbnail: "/test-image.jpg",
        price: 1500,
        quantity: 1,
      })
    })

    it("increments quantity when same product added twice", async () => {
      const user = userEvent.setup()
      renderWithCart(<ProductCard {...defaultProps} />)

      await user.click(screen.getByRole("button", { name: /add to cart/i }))
      await user.click(screen.getByRole("button", { name: /add to cart/i }))

      expect(screen.getByTestId("cart-item-count")).toHaveTextContent("2")

      const items = JSON.parse(screen.getByTestId("cart-items").textContent || "[]")
      expect(items).toHaveLength(1)
      expect(items[0].quantity).toBe(2)
    })

    it("updates cart total when item added", async () => {
      const user = userEvent.setup()
      renderWithCart(<ProductCard {...defaultProps} />)

      expect(screen.getByTestId("cart-total")).toHaveTextContent("0")

      await user.click(screen.getByRole("button", { name: /add to cart/i }))

      expect(screen.getByTestId("cart-total")).toHaveTextContent("1500")
    })
  })

  describe("Price Formatting", () => {
    it("formats price with default KWD currency", () => {
      renderWithCart(<ProductCard {...defaultProps} />)

      // Should contain the price value
      const priceText = screen.getByText(/15/)
      expect(priceText).toBeInTheDocument()
    })

    it("formats price with custom currency code", () => {
      renderWithCart(<ProductCard {...defaultProps} currencyCode="USD" />)

      // Should contain the price value formatted as USD
      const priceText = screen.getByText(/15/)
      expect(priceText).toBeInTheDocument()
    })

    it("handles zero price", () => {
      renderWithCart(<ProductCard {...defaultProps} price={0} />)

      // Check for the price display element specifically by looking for KWD 0.000
      const priceElement = screen.getByText(/KWD 0\.000/)
      expect(priceElement).toBeInTheDocument()
    })

    it("handles large prices", () => {
      renderWithCart(<ProductCard {...defaultProps} price={99999900} />)

      // 999999.00 should be visible
      expect(screen.getByText(/999/)).toBeInTheDocument()
    })
  })

  describe("Multiple Products", () => {
    it("adds different products as separate items", async () => {
      const user = userEvent.setup()
      render(
        <CartProvider>
          <ProductCard id="prod-1" title="Product One" thumbnail={null} price={1000} />
          <ProductCard id="prod-2" title="Product Two" thumbnail={null} price={2000} />
          <CartStateDisplay />
        </CartProvider>
      )

      const addButtons = screen.getAllByRole("button", { name: /add to cart/i })

      await user.click(addButtons[0]) // Add Product One
      await user.click(addButtons[1]) // Add Product Two

      expect(screen.getByTestId("cart-item-count")).toHaveTextContent("2")

      const items = JSON.parse(screen.getByTestId("cart-items").textContent || "[]")
      expect(items).toHaveLength(2)
      expect(items[0].id).toBe("prod-1")
      expect(items[1].id).toBe("prod-2")
    })

    it("calculates correct total for multiple products", async () => {
      const user = userEvent.setup()
      render(
        <CartProvider>
          <ProductCard id="prod-1" title="Product One" thumbnail={null} price={1000} />
          <ProductCard id="prod-2" title="Product Two" thumbnail={null} price={2000} />
          <CartStateDisplay />
        </CartProvider>
      )

      const addButtons = screen.getAllByRole("button", { name: /add to cart/i })

      await user.click(addButtons[0]) // Add Product One (1000)
      await user.click(addButtons[0]) // Add Product One again (1000)
      await user.click(addButtons[1]) // Add Product Two (2000)

      // Total should be 1000 + 1000 + 2000 = 4000
      expect(screen.getByTestId("cart-total")).toHaveTextContent("4000")
    })
  })

  describe("Accessibility", () => {
    it("has accessible button", () => {
      renderWithCart(<ProductCard {...defaultProps} />)

      const button = screen.getByRole("button", { name: /add to cart/i })
      expect(button).toBeEnabled()
    })

    it("product title uses heading element", () => {
      renderWithCart(<ProductCard {...defaultProps} />)

      const heading = screen.getByRole("heading", { name: "Test Product" })
      expect(heading).toBeInTheDocument()
    })

    it("image has alt text", () => {
      renderWithCart(<ProductCard {...defaultProps} />)

      const image = screen.getByAltText("Test Product")
      expect(image).toBeInTheDocument()
    })
  })
})
