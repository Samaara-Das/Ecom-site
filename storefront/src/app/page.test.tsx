import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import Home from "./page"
import { CartProvider } from "@/context/CartContext"

// Mock Next.js Image component
vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string; fill?: boolean; className?: string; sizes?: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}))

// Mock ProductGrid to avoid fetch calls
vi.mock("@/components/product/ProductGrid", () => ({
  ProductGrid: () => <div data-testid="product-grid">Product Grid</div>,
}))

// Helper to render with CartProvider
function renderWithCart(ui: React.ReactElement) {
  return render(<CartProvider>{ui}</CartProvider>)
}

describe("Home Page", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("renders the marketplace title", () => {
    renderWithCart(<Home />)
    const heading = screen.getByRole("heading", { level: 1 })
    expect(heading).toHaveTextContent("Welcome to Kuwait Marketplace")
  })

  it("renders the product description", () => {
    renderWithCart(<Home />)
    expect(screen.getByText(/discover quality products/i)).toBeInTheDocument()
  })

  it("has proper layout structure with main element", () => {
    renderWithCart(<Home />)
    const main = screen.getByRole("main")
    expect(main).toBeInTheDocument()
  })

  it("renders the featured products section", () => {
    renderWithCart(<Home />)
    expect(screen.getByText("Featured Products")).toBeInTheDocument()
  })

  it("renders the product grid", () => {
    renderWithCart(<Home />)
    expect(screen.getByTestId("product-grid")).toBeInTheDocument()
  })
})
