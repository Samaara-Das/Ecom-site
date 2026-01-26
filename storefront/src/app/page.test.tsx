import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import Home from "./page"
import { CartProvider } from "@/context/CartContext"

// Wrapper component that provides cart context
function TestWrapper({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>
}

describe("Home Page", () => {
  it("renders the marketplace title", () => {
    render(<Home />, { wrapper: TestWrapper })
    const heading = screen.getByRole("heading", { level: 1 })
    expect(heading).toHaveTextContent("Kuwait Marketplace")
  })

  it("renders featured products section", () => {
    render(<Home />, { wrapper: TestWrapper })
    expect(screen.getByText(/featured products/i)).toBeInTheDocument()
  })

  it("has proper layout structure with main element", () => {
    render(<Home />, { wrapper: TestWrapper })
    const main = screen.getByRole("main")
    expect(main).toBeInTheDocument()
  })
})
