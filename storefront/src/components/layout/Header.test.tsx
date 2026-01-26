import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, beforeEach, vi } from "vitest"
import { Header } from "./Header"
import { CartProvider, useCart } from "@/context/CartContext"
import React from "react"

// Helper component to manipulate cart for testing
function CartManipulator({
  itemsToAdd = 0,
}: {
  itemsToAdd?: number
}) {
  const { addItem, isOpen } = useCart()
  const [initialized, setInitialized] = React.useState(false)

  React.useEffect(() => {
    if (!initialized && itemsToAdd > 0) {
      for (let i = 0; i < itemsToAdd; i++) {
        addItem({
          id: `test-item-${i}`,
          title: `Test Item ${i}`,
          thumbnail: null,
          price: 1000,
        })
      }
      setInitialized(true)
    }
  }, [initialized, itemsToAdd, addItem])

  return <span data-testid="cart-is-open">{isOpen ? "open" : "closed"}</span>
}

// Helper to render with CartProvider
function renderWithCart(ui: React.ReactElement) {
  return render(<CartProvider>{ui}</CartProvider>)
}

describe("Header", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe("Rendering", () => {
    it("renders the logo/brand name", () => {
      renderWithCart(<Header />)

      expect(screen.getByText("Kuwait Market")).toBeInTheDocument()
    })

    it("renders navigation links", () => {
      renderWithCart(<Header />)

      expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument()
      expect(screen.getByRole("link", { name: /products/i })).toBeInTheDocument()
    })

    it("renders cart button", () => {
      renderWithCart(<Header />)

      expect(screen.getByRole("button", { name: /open cart/i })).toBeInTheDocument()
    })

    it("logo links to home page", () => {
      renderWithCart(<Header />)

      const logo = screen.getByRole("link", { name: /kuwait market/i })
      expect(logo).toHaveAttribute("href", "/")
    })
  })

  describe("Cart Badge", () => {
    it("does not show badge when cart is empty", () => {
      renderWithCart(<Header />)

      // The badge span shouldn't exist when itemCount is 0
      const cartButton = screen.getByRole("button", { name: /open cart/i })
      const badge = cartButton.querySelector("span.absolute")
      expect(badge).toBeNull()
    })

    it("shows badge with count when cart has items", async () => {
      render(
        <CartProvider>
          <Header />
          <CartManipulator itemsToAdd={3} />
        </CartProvider>
      )

      await waitFor(() => {
        const badge = screen.getByText("3")
        expect(badge).toBeInTheDocument()
      })
    })

    it("shows correct count for multiple items", async () => {
      render(
        <CartProvider>
          <Header />
          <CartManipulator itemsToAdd={5} />
        </CartProvider>
      )

      await waitFor(() => {
        const badge = screen.getByText("5")
        expect(badge).toBeInTheDocument()
      })
    })

    it("shows 99+ when count exceeds 99", async () => {
      render(
        <CartProvider>
          <Header />
          <CartManipulator itemsToAdd={100} />
        </CartProvider>
      )

      await waitFor(() => {
        const badge = screen.getByText("99+")
        expect(badge).toBeInTheDocument()
      })
    })

    it("badge has correct styling classes", async () => {
      render(
        <CartProvider>
          <Header />
          <CartManipulator itemsToAdd={5} />
        </CartProvider>
      )

      await waitFor(() => {
        const badge = screen.getByText("5")
        expect(badge).toHaveClass("absolute")
        expect(badge).toHaveClass("rounded-full")
        expect(badge).toHaveClass("bg-primary")
      })
    })
  })

  describe("Cart Toggle", () => {
    it("toggles cart open when clicked", async () => {
      const user = userEvent.setup()
      render(
        <CartProvider>
          <Header />
          <CartManipulator itemsToAdd={0} />
        </CartProvider>
      )

      expect(screen.getByTestId("cart-is-open")).toHaveTextContent("closed")

      await user.click(screen.getByRole("button", { name: /open cart/i }))

      expect(screen.getByTestId("cart-is-open")).toHaveTextContent("open")
    })

    it("toggles cart closed when clicked again", async () => {
      const user = userEvent.setup()
      render(
        <CartProvider>
          <Header />
          <CartManipulator itemsToAdd={0} />
        </CartProvider>
      )

      const cartButton = screen.getByRole("button", { name: /open cart/i })

      await user.click(cartButton)
      expect(screen.getByTestId("cart-is-open")).toHaveTextContent("open")

      await user.click(cartButton)
      expect(screen.getByTestId("cart-is-open")).toHaveTextContent("closed")
    })
  })

  describe("Sticky Header", () => {
    it("has sticky positioning class", () => {
      renderWithCart(<Header />)

      const header = screen.getByRole("banner")
      expect(header).toHaveClass("sticky")
      expect(header).toHaveClass("top-0")
    })

    it("has high z-index for stacking", () => {
      renderWithCart(<Header />)

      const header = screen.getByRole("banner")
      expect(header).toHaveClass("z-50")
    })
  })

  describe("Responsive Design", () => {
    it("navigation is hidden on mobile by default", () => {
      renderWithCart(<Header />)

      const nav = screen.getByRole("navigation")
      expect(nav).toHaveClass("hidden")
      expect(nav).toHaveClass("md:flex")
    })
  })

  describe("Accessibility", () => {
    it("cart button has accessible label", () => {
      renderWithCart(<Header />)

      const cartButton = screen.getByRole("button", { name: /open cart/i })
      expect(cartButton).toHaveAttribute("aria-label", "Open cart")
    })

    it("uses semantic header element", () => {
      renderWithCart(<Header />)

      expect(screen.getByRole("banner")).toBeInTheDocument()
    })

    it("navigation uses nav element", () => {
      renderWithCart(<Header />)

      expect(screen.getByRole("navigation")).toBeInTheDocument()
    })
  })
})
