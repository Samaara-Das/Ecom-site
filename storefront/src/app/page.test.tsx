import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import Home from "./page"

describe("Home Page", () => {
  it("renders the marketplace title", () => {
    render(<Home />)
    const heading = screen.getByRole("heading", { level: 1 })
    expect(heading).toHaveTextContent("Kuwait Marketplace")
  })

  it("renders the coming soon message", () => {
    render(<Home />)
    expect(screen.getByText(/multi-vendor marketplace coming soon/i)).toBeInTheDocument()
  })

  it("has proper layout structure with main element", () => {
    render(<Home />)
    const main = screen.getByRole("main")
    expect(main).toBeInTheDocument()
    expect(main).toHaveClass("flex", "min-h-screen")
  })
})
