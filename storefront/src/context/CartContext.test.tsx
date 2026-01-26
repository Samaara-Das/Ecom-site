import { render, screen, act, renderHook, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, beforeEach, vi } from "vitest"
import { CartProvider, useCart, CartItem } from "./CartContext"

// Helper component to test cart operations
function CartTestComponent() {
  const {
    items,
    itemCount,
    total,
    isOpen,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    toggleCart
  } = useCart()

  const testItem: Omit<CartItem, "quantity"> = {
    id: "test-product-1",
    title: "Test Product",
    thumbnail: "/test-image.jpg",
    price: 1000, // 10.00 KWD in cents
  }

  const testItem2: Omit<CartItem, "quantity"> = {
    id: "test-product-2",
    title: "Another Product",
    thumbnail: null,
    price: 2500, // 25.00 KWD in cents
  }

  return (
    <div>
      <div data-testid="item-count">{itemCount}</div>
      <div data-testid="total">{total}</div>
      <div data-testid="is-open">{isOpen ? "open" : "closed"}</div>
      <div data-testid="items">{JSON.stringify(items)}</div>
      <button onClick={() => addItem(testItem)}>Add Item 1</button>
      <button onClick={() => addItem(testItem2)}>Add Item 2</button>
      <button onClick={() => removeItem("test-product-1")}>Remove Item 1</button>
      <button onClick={() => updateQuantity("test-product-1", 5)}>Set Qty to 5</button>
      <button onClick={() => updateQuantity("test-product-1", 0)}>Set Qty to 0</button>
      <button onClick={() => updateQuantity("test-product-1", -1)}>Set Negative Qty</button>
      <button onClick={clearCart}>Clear Cart</button>
      <button onClick={openCart}>Open Cart</button>
      <button onClick={closeCart}>Close Cart</button>
      <button onClick={toggleCart}>Toggle Cart</button>
    </div>
  )
}

// Wrapper for renderHook
function wrapper({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>
}

describe("CartContext", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  describe("useCart hook", () => {
    it("throws error when used outside CartProvider", () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

      expect(() => {
        renderHook(() => useCart())
      }).toThrow("useCart must be used within a CartProvider")

      consoleSpy.mockRestore()
    })

    it("provides initial state", () => {
      const { result } = renderHook(() => useCart(), { wrapper })

      expect(result.current.items).toEqual([])
      expect(result.current.itemCount).toBe(0)
      expect(result.current.total).toBe(0)
      expect(result.current.isOpen).toBe(false)
    })
  })

  describe("Add to Cart", () => {
    it("adds an item to the cart", async () => {
      const user = userEvent.setup()
      render(
        <CartProvider>
          <CartTestComponent />
        </CartProvider>
      )

      expect(screen.getByTestId("item-count")).toHaveTextContent("0")

      await user.click(screen.getByText("Add Item 1"))

      expect(screen.getByTestId("item-count")).toHaveTextContent("1")
    })

    it("increments quantity when adding same item twice", async () => {
      const user = userEvent.setup()
      render(
        <CartProvider>
          <CartTestComponent />
        </CartProvider>
      )

      await user.click(screen.getByText("Add Item 1"))
      await user.click(screen.getByText("Add Item 1"))

      expect(screen.getByTestId("item-count")).toHaveTextContent("2")

      // Check that there's only one item entry (with quantity 2)
      const items = JSON.parse(screen.getByTestId("items").textContent || "[]")
      expect(items).toHaveLength(1)
      expect(items[0].quantity).toBe(2)
    })

    it("adds different items separately", async () => {
      const user = userEvent.setup()
      render(
        <CartProvider>
          <CartTestComponent />
        </CartProvider>
      )

      await user.click(screen.getByText("Add Item 1"))
      await user.click(screen.getByText("Add Item 2"))

      expect(screen.getByTestId("item-count")).toHaveTextContent("2")

      const items = JSON.parse(screen.getByTestId("items").textContent || "[]")
      expect(items).toHaveLength(2)
    })

    it("opens cart drawer when item is added", async () => {
      const user = userEvent.setup()
      render(
        <CartProvider>
          <CartTestComponent />
        </CartProvider>
      )

      expect(screen.getByTestId("is-open")).toHaveTextContent("closed")

      await user.click(screen.getByText("Add Item 1"))

      expect(screen.getByTestId("is-open")).toHaveTextContent("open")
    })

    it("calculates total correctly", async () => {
      const user = userEvent.setup()
      render(
        <CartProvider>
          <CartTestComponent />
        </CartProvider>
      )

      await user.click(screen.getByText("Add Item 1")) // 1000 cents
      expect(screen.getByTestId("total")).toHaveTextContent("1000")

      await user.click(screen.getByText("Add Item 1")) // 2000 cents
      expect(screen.getByTestId("total")).toHaveTextContent("2000")

      await user.click(screen.getByText("Add Item 2")) // 2000 + 2500 = 4500 cents
      expect(screen.getByTestId("total")).toHaveTextContent("4500")
    })
  })

  describe("Remove from Cart", () => {
    it("removes an item from the cart", async () => {
      const user = userEvent.setup()
      render(
        <CartProvider>
          <CartTestComponent />
        </CartProvider>
      )

      await user.click(screen.getByText("Add Item 1"))
      expect(screen.getByTestId("item-count")).toHaveTextContent("1")

      await user.click(screen.getByText("Remove Item 1"))
      expect(screen.getByTestId("item-count")).toHaveTextContent("0")
    })

    it("removes correct item when multiple items exist", async () => {
      const user = userEvent.setup()
      render(
        <CartProvider>
          <CartTestComponent />
        </CartProvider>
      )

      await user.click(screen.getByText("Add Item 1"))
      await user.click(screen.getByText("Add Item 2"))
      expect(screen.getByTestId("item-count")).toHaveTextContent("2")

      await user.click(screen.getByText("Remove Item 1"))

      const items = JSON.parse(screen.getByTestId("items").textContent || "[]")
      expect(items).toHaveLength(1)
      expect(items[0].id).toBe("test-product-2")
    })
  })

  describe("Update Quantity", () => {
    it("updates item quantity", async () => {
      const user = userEvent.setup()
      render(
        <CartProvider>
          <CartTestComponent />
        </CartProvider>
      )

      await user.click(screen.getByText("Add Item 1"))
      await user.click(screen.getByText("Set Qty to 5"))

      expect(screen.getByTestId("item-count")).toHaveTextContent("5")
      expect(screen.getByTestId("total")).toHaveTextContent("5000") // 5 * 1000 cents
    })

    it("removes item when quantity set to 0", async () => {
      const user = userEvent.setup()
      render(
        <CartProvider>
          <CartTestComponent />
        </CartProvider>
      )

      await user.click(screen.getByText("Add Item 1"))
      await user.click(screen.getByText("Set Qty to 0"))

      expect(screen.getByTestId("item-count")).toHaveTextContent("0")
      const items = JSON.parse(screen.getByTestId("items").textContent || "[]")
      expect(items).toHaveLength(0)
    })

    it("removes item when quantity set to negative", async () => {
      const user = userEvent.setup()
      render(
        <CartProvider>
          <CartTestComponent />
        </CartProvider>
      )

      await user.click(screen.getByText("Add Item 1"))
      await user.click(screen.getByText("Set Negative Qty"))

      expect(screen.getByTestId("item-count")).toHaveTextContent("0")
    })
  })

  describe("Clear Cart", () => {
    it("clears all items from cart", async () => {
      const user = userEvent.setup()
      render(
        <CartProvider>
          <CartTestComponent />
        </CartProvider>
      )

      await user.click(screen.getByText("Add Item 1"))
      await user.click(screen.getByText("Add Item 2"))
      expect(screen.getByTestId("item-count")).toHaveTextContent("2")

      await user.click(screen.getByText("Clear Cart"))

      expect(screen.getByTestId("item-count")).toHaveTextContent("0")
      expect(screen.getByTestId("total")).toHaveTextContent("0")
      const items = JSON.parse(screen.getByTestId("items").textContent || "[]")
      expect(items).toHaveLength(0)
    })
  })

  describe("Cart Drawer State", () => {
    it("opens cart drawer", async () => {
      const user = userEvent.setup()
      render(
        <CartProvider>
          <CartTestComponent />
        </CartProvider>
      )

      expect(screen.getByTestId("is-open")).toHaveTextContent("closed")

      await user.click(screen.getByText("Open Cart"))

      expect(screen.getByTestId("is-open")).toHaveTextContent("open")
    })

    it("closes cart drawer", async () => {
      const user = userEvent.setup()
      render(
        <CartProvider>
          <CartTestComponent />
        </CartProvider>
      )

      await user.click(screen.getByText("Open Cart"))
      expect(screen.getByTestId("is-open")).toHaveTextContent("open")

      await user.click(screen.getByText("Close Cart"))

      expect(screen.getByTestId("is-open")).toHaveTextContent("closed")
    })

    it("toggles cart drawer", async () => {
      const user = userEvent.setup()
      render(
        <CartProvider>
          <CartTestComponent />
        </CartProvider>
      )

      expect(screen.getByTestId("is-open")).toHaveTextContent("closed")

      await user.click(screen.getByText("Toggle Cart"))
      expect(screen.getByTestId("is-open")).toHaveTextContent("open")

      await user.click(screen.getByText("Toggle Cart"))
      expect(screen.getByTestId("is-open")).toHaveTextContent("closed")
    })
  })

  describe("localStorage Persistence", () => {
    it("saves cart to localStorage when items change", async () => {
      const user = userEvent.setup()
      render(
        <CartProvider>
          <CartTestComponent />
        </CartProvider>
      )

      await user.click(screen.getByText("Add Item 1"))

      // Wait for localStorage to be updated (after hydration)
      await waitFor(() => {
        const stored = localStorage.getItem("kuwait-marketplace-cart")
        expect(stored).not.toBeNull()
        const parsed = JSON.parse(stored!)
        expect(parsed).toHaveLength(1)
        expect(parsed[0].id).toBe("test-product-1")
      })
    })

    it("loads cart from localStorage on mount", async () => {
      // Pre-populate localStorage
      const preloadedCart = [
        { id: "pre-loaded", title: "Pre-loaded Item", thumbnail: null, price: 500, quantity: 3 }
      ]
      localStorage.setItem("kuwait-marketplace-cart", JSON.stringify(preloadedCart))

      render(
        <CartProvider>
          <CartTestComponent />
        </CartProvider>
      )

      // Wait for hydration
      await waitFor(() => {
        expect(screen.getByTestId("item-count")).toHaveTextContent("3")
      })
    })

    it("handles invalid localStorage data gracefully", async () => {
      // Set invalid JSON
      localStorage.setItem("kuwait-marketplace-cart", "invalid-json")

      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

      render(
        <CartProvider>
          <CartTestComponent />
        </CartProvider>
      )

      // Should start with empty cart despite invalid data
      await waitFor(() => {
        expect(screen.getByTestId("item-count")).toHaveTextContent("0")
      })

      consoleSpy.mockRestore()
    })

    it("clears localStorage when cart is cleared", async () => {
      const user = userEvent.setup()
      render(
        <CartProvider>
          <CartTestComponent />
        </CartProvider>
      )

      await user.click(screen.getByText("Add Item 1"))

      await waitFor(() => {
        const stored = localStorage.getItem("kuwait-marketplace-cart")
        expect(JSON.parse(stored!)).toHaveLength(1)
      })

      await user.click(screen.getByText("Clear Cart"))

      await waitFor(() => {
        const stored = localStorage.getItem("kuwait-marketplace-cart")
        expect(JSON.parse(stored!)).toHaveLength(0)
      })
    })
  })

  describe("Item Count Calculation", () => {
    it("calculates item count as sum of quantities", async () => {
      const user = userEvent.setup()
      render(
        <CartProvider>
          <CartTestComponent />
        </CartProvider>
      )

      // Add item 1 three times (quantity 3)
      await user.click(screen.getByText("Add Item 1"))
      await user.click(screen.getByText("Add Item 1"))
      await user.click(screen.getByText("Add Item 1"))

      // Add item 2 twice (quantity 2)
      await user.click(screen.getByText("Add Item 2"))
      await user.click(screen.getByText("Add Item 2"))

      // Total items: 3 + 2 = 5
      expect(screen.getByTestId("item-count")).toHaveTextContent("5")
    })
  })

  describe("Total Price Calculation", () => {
    it("calculates total correctly with multiple quantities", async () => {
      const user = userEvent.setup()
      render(
        <CartProvider>
          <CartTestComponent />
        </CartProvider>
      )

      // Add item 1 twice (1000 * 2 = 2000)
      await user.click(screen.getByText("Add Item 1"))
      await user.click(screen.getByText("Add Item 1"))

      // Add item 2 once (2500 * 1 = 2500)
      await user.click(screen.getByText("Add Item 2"))

      // Total: 2000 + 2500 = 4500 cents
      expect(screen.getByTestId("total")).toHaveTextContent("4500")
    })
  })
})
