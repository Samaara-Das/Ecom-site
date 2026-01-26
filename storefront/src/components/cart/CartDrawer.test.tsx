import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, beforeEach, vi } from "vitest"
import { CartDrawer } from "./CartDrawer"
import { CartProvider } from "@/context/CartContext"

// Mock Next.js Image component
vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string; fill?: boolean; className?: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}))

// Helper to render with CartProvider
function renderWithCart(ui: React.ReactElement) {
  return render(<CartProvider>{ui}</CartProvider>)
}

// Helper to render CartDrawer with cart open and items
function CartDrawerWithItems({
  items = [],
  openByDefault = true,
}: {
  items?: Array<{
    id: string
    title: string
    thumbnail: string | null
    price: number
    quantity: number
  }>
  openByDefault?: boolean
}) {
  return (
    <CartProvider>
      <CartDrawerTestHelper items={items} openByDefault={openByDefault} />
      <CartDrawer />
    </CartProvider>
  )
}

// Helper component to populate cart
function CartDrawerTestHelper({
  items,
  openByDefault,
}: {
  items: Array<{
    id: string
    title: string
    thumbnail: string | null
    price: number
    quantity: number
  }>
  openByDefault: boolean
}) {
  const { addItem, openCart, updateQuantity } = require("@/context/CartContext").useCart()
  const [initialized, setInitialized] = React.useState(false)

  React.useEffect(() => {
    if (!initialized) {
      items.forEach((item) => {
        for (let i = 0; i < item.quantity; i++) {
          addItem({ id: item.id, title: item.title, thumbnail: item.thumbnail, price: item.price })
        }
      })
      if (openByDefault) {
        openCart()
      }
      setInitialized(true)
    }
  }, [items, openByDefault, addItem, openCart, initialized])

  return null
}

import React from "react"
import { useCart } from "@/context/CartContext"

// Simpler approach - test component that populates cart directly
function TestCartDrawer({
  initialItems = [],
  startOpen = false,
}: {
  initialItems?: Array<{
    id: string
    title: string
    thumbnail: string | null
    price: number
  }>
  startOpen?: boolean
}) {
  const { addItem, openCart, isOpen } = useCart()
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    if (!ready) {
      initialItems.forEach((item) => {
        addItem(item)
      })
      if (startOpen && initialItems.length === 0) {
        openCart()
      }
      setReady(true)
    }
  }, [ready, initialItems, addItem, openCart, startOpen])

  if (!ready) return null

  return <CartDrawer />
}

describe("CartDrawer", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe("Visibility", () => {
    it("does not render when cart is closed", () => {
      renderWithCart(<CartDrawer />)

      expect(screen.queryByText("Shopping Cart")).not.toBeInTheDocument()
    })

    it("renders when cart is open", () => {
      renderWithCart(<TestCartDrawer startOpen />)

      expect(screen.getByText("Shopping Cart")).toBeInTheDocument()
    })
  })

  describe("Empty Cart State", () => {
    it("shows empty cart message when no items", () => {
      renderWithCart(<TestCartDrawer startOpen />)

      expect(screen.getByText("Your cart is empty")).toBeInTheDocument()
    })

    it("does not show checkout button when cart is empty", () => {
      renderWithCart(<TestCartDrawer startOpen />)

      expect(screen.queryByRole("button", { name: /checkout/i })).not.toBeInTheDocument()
    })

    it("does not show subtotal when cart is empty", () => {
      renderWithCart(<TestCartDrawer startOpen />)

      expect(screen.queryByText("Subtotal")).not.toBeInTheDocument()
    })
  })

  describe("Cart with Items", () => {
    const testItem = {
      id: "prod-1",
      title: "Test Product",
      thumbnail: "/test.jpg",
      price: 1000, // 10.00 KWD
    }

    it("displays item title", () => {
      renderWithCart(
        <TestCartDrawer initialItems={[testItem]} />
      )

      expect(screen.getByText("Test Product")).toBeInTheDocument()
    })

    it("displays item price formatted in KWD", () => {
      renderWithCart(
        <TestCartDrawer initialItems={[testItem]} />
      )

      // Check for the formatted price - it appears in both item price and subtotal
      // Using getAllByText since price appears in multiple places
      const priceElements = screen.getAllByText(/KWD 10\.000/)
      expect(priceElements.length).toBeGreaterThan(0)
    })

    it("displays item quantity", () => {
      renderWithCart(
        <TestCartDrawer initialItems={[testItem]} />
      )

      // The quantity "1" should be visible
      const quantityDisplay = screen.getByText("1", { selector: "span.w-8" })
      expect(quantityDisplay).toBeInTheDocument()
    })

    it("displays subtotal", () => {
      renderWithCart(
        <TestCartDrawer initialItems={[testItem]} />
      )

      expect(screen.getByText("Subtotal")).toBeInTheDocument()
    })

    it("displays checkout button when items exist", () => {
      renderWithCart(
        <TestCartDrawer initialItems={[testItem]} />
      )

      expect(screen.getByRole("button", { name: /checkout/i })).toBeInTheDocument()
    })

    it("displays item thumbnail image", () => {
      renderWithCart(
        <TestCartDrawer initialItems={[testItem]} />
      )

      const image = screen.getByAltText("Test Product")
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute("src", "/test.jpg")
    })

    it("handles item without thumbnail", () => {
      renderWithCart(
        <TestCartDrawer initialItems={[{ ...testItem, thumbnail: null }]} />
      )

      // Should not crash and should still show the title
      expect(screen.getByText("Test Product")).toBeInTheDocument()
      // Should not have the image
      expect(screen.queryByAltText("Test Product")).not.toBeInTheDocument()
    })
  })

  describe("Quantity Controls", () => {
    const testItem = {
      id: "prod-1",
      title: "Test Product",
      thumbnail: null,
      price: 1000,
    }

    it("has increment button", () => {
      renderWithCart(
        <TestCartDrawer initialItems={[testItem]} />
      )

      const plusButton = screen.getByRole("button", { name: "+" })
      expect(plusButton).toBeInTheDocument()
    })

    it("has decrement button", () => {
      renderWithCart(
        <TestCartDrawer initialItems={[testItem]} />
      )

      const minusButton = screen.getByRole("button", { name: "-" })
      expect(minusButton).toBeInTheDocument()
    })

    it("increments quantity when plus is clicked", async () => {
      const user = userEvent.setup()
      renderWithCart(
        <TestCartDrawer initialItems={[testItem]} />
      )

      const plusButton = screen.getByRole("button", { name: "+" })
      await user.click(plusButton)

      // Quantity should now be 2
      const quantityDisplay = screen.getByText("2", { selector: "span.w-8" })
      expect(quantityDisplay).toBeInTheDocument()
    })

    it("decrements quantity when minus is clicked", async () => {
      const user = userEvent.setup()
      renderWithCart(
        <TestCartDrawer initialItems={[testItem, testItem]} />
      )

      // Wait for items to be added (quantity will be 2)
      const quantityDisplay = await screen.findByText("2", { selector: "span.w-8" })
      expect(quantityDisplay).toBeInTheDocument()

      const minusButton = screen.getByRole("button", { name: "-" })
      await user.click(minusButton)

      // Quantity should now be 1
      expect(screen.getByText("1", { selector: "span.w-8" })).toBeInTheDocument()
    })

    it("removes item when quantity decremented to 0", async () => {
      const user = userEvent.setup()
      renderWithCart(
        <TestCartDrawer initialItems={[testItem]} />
      )

      const minusButton = screen.getByRole("button", { name: "-" })
      await user.click(minusButton)

      // Item should be removed, showing empty state
      expect(screen.getByText("Your cart is empty")).toBeInTheDocument()
    })

    it("has remove button", () => {
      renderWithCart(
        <TestCartDrawer initialItems={[testItem]} />
      )

      const removeButton = screen.getByRole("button", { name: /remove item/i })
      expect(removeButton).toBeInTheDocument()
    })

    it("removes item when remove button clicked", async () => {
      const user = userEvent.setup()
      renderWithCart(
        <TestCartDrawer initialItems={[testItem]} />
      )

      const removeButton = screen.getByRole("button", { name: /remove item/i })
      await user.click(removeButton)

      expect(screen.getByText("Your cart is empty")).toBeInTheDocument()
    })
  })

  describe("Close Cart", () => {
    it("has close button", () => {
      renderWithCart(<TestCartDrawer startOpen />)

      const closeButton = screen.getByRole("button", { name: /close cart/i })
      expect(closeButton).toBeInTheDocument()
    })

    it("closes cart when close button clicked", async () => {
      const user = userEvent.setup()
      renderWithCart(<TestCartDrawer startOpen />)

      expect(screen.getByText("Shopping Cart")).toBeInTheDocument()

      const closeButton = screen.getByRole("button", { name: /close cart/i })
      await user.click(closeButton)

      expect(screen.queryByText("Shopping Cart")).not.toBeInTheDocument()
    })

    it("closes cart when backdrop clicked", async () => {
      const user = userEvent.setup()
      renderWithCart(<TestCartDrawer startOpen />)

      expect(screen.getByText("Shopping Cart")).toBeInTheDocument()

      // The backdrop is the element with aria-hidden="true" and bg-black/50
      const backdrop = document.querySelector('[aria-hidden="true"]')
      expect(backdrop).toBeInTheDocument()

      await user.click(backdrop!)

      expect(screen.queryByText("Shopping Cart")).not.toBeInTheDocument()
    })
  })

  describe("Multiple Items", () => {
    const item1 = {
      id: "prod-1",
      title: "Product One",
      thumbnail: null,
      price: 1000,
    }

    const item2 = {
      id: "prod-2",
      title: "Product Two",
      thumbnail: null,
      price: 2500,
    }

    it("displays multiple items", () => {
      renderWithCart(
        <TestCartDrawer initialItems={[item1, item2]} />
      )

      expect(screen.getByText("Product One")).toBeInTheDocument()
      expect(screen.getByText("Product Two")).toBeInTheDocument()
    })

    it("calculates correct subtotal for multiple items", () => {
      renderWithCart(
        <TestCartDrawer initialItems={[item1, item2]} />
      )

      // Subtotal should be 1000 + 2500 = 3500 cents = 35.00 KWD
      // Look for "35" in the subtotal area
      expect(screen.getByText(/35/)).toBeInTheDocument()
    })

    it("removes only the clicked item", async () => {
      const user = userEvent.setup()
      renderWithCart(
        <TestCartDrawer initialItems={[item1, item2]} />
      )

      // Get all remove buttons
      const removeButtons = screen.getAllByRole("button", { name: /remove item/i })

      // Click the first remove button (Product One)
      await user.click(removeButtons[0])

      // Product One should be gone, Product Two should remain
      expect(screen.queryByText("Product One")).not.toBeInTheDocument()
      expect(screen.getByText("Product Two")).toBeInTheDocument()
    })
  })

  describe("Price Formatting", () => {
    it("formats prices in KWD currency", () => {
      const expensiveItem = {
        id: "prod-expensive",
        title: "Expensive Product",
        thumbnail: null,
        price: 99900, // 999.00 KWD
      }

      renderWithCart(
        <TestCartDrawer initialItems={[expensiveItem]} />
      )

      // Should show formatted price containing "999" - appears in item price and subtotal
      const priceElements = screen.getAllByText(/KWD 999\.000/)
      expect(priceElements.length).toBeGreaterThan(0)
    })
  })
})
