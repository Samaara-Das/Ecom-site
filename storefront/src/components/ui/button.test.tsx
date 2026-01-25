import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { Button } from "./button"

describe("Button", () => {
  it("renders with children text", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument()
  })

  it("handles click events", async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    await user.click(screen.getByRole("button"))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it("renders disabled state", () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole("button")).toBeDisabled()
  })

  it("applies default variant styles", () => {
    render(<Button>Default</Button>)
    const button = screen.getByRole("button")
    expect(button).toHaveClass("bg-primary")
  })

  it("applies destructive variant styles", () => {
    render(<Button variant="destructive">Delete</Button>)
    const button = screen.getByRole("button")
    expect(button).toHaveClass("bg-destructive")
  })

  it("applies outline variant styles", () => {
    render(<Button variant="outline">Outline</Button>)
    const button = screen.getByRole("button")
    expect(button).toHaveClass("border")
    expect(button).toHaveClass("border-input")
  })

  it("applies secondary variant styles", () => {
    render(<Button variant="secondary">Secondary</Button>)
    const button = screen.getByRole("button")
    expect(button).toHaveClass("bg-secondary")
  })

  it("applies ghost variant styles", () => {
    render(<Button variant="ghost">Ghost</Button>)
    const button = screen.getByRole("button")
    expect(button).toHaveClass("hover:bg-accent")
  })

  it("applies link variant styles", () => {
    render(<Button variant="link">Link</Button>)
    const button = screen.getByRole("button")
    expect(button).toHaveClass("text-primary")
    expect(button).toHaveClass("underline-offset-4")
  })

  it("applies small size styles", () => {
    render(<Button size="sm">Small</Button>)
    const button = screen.getByRole("button")
    expect(button).toHaveClass("h-9")
    expect(button).toHaveClass("px-3")
  })

  it("applies large size styles", () => {
    render(<Button size="lg">Large</Button>)
    const button = screen.getByRole("button")
    expect(button).toHaveClass("h-11")
    expect(button).toHaveClass("px-8")
  })

  it("applies icon size styles", () => {
    render(<Button size="icon">Icon</Button>)
    const button = screen.getByRole("button")
    expect(button).toHaveClass("h-10")
    expect(button).toHaveClass("w-10")
  })

  it("allows custom className", () => {
    render(<Button className="custom-class">Custom</Button>)
    expect(screen.getByRole("button")).toHaveClass("custom-class")
  })

  it("renders as child when asChild is true", () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    )
    const link = screen.getByRole("link", { name: /link button/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute("href", "/test")
  })
})
