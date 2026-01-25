import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { Label } from "./label"

describe("Label", () => {
  it("renders label with text", () => {
    render(<Label>Email</Label>)
    expect(screen.getByText("Email")).toBeInTheDocument()
  })

  it("renders with htmlFor attribute", () => {
    render(<Label htmlFor="email-input">Email</Label>)
    const label = screen.getByText("Email")
    expect(label).toHaveAttribute("for", "email-input")
  })

  it("applies default styles", () => {
    render(<Label data-testid="label">Label text</Label>)
    const label = screen.getByTestId("label")
    expect(label).toHaveClass("text-sm")
    expect(label).toHaveClass("font-medium")
  })

  it("allows custom className", () => {
    render(<Label className="custom-label">Custom</Label>)
    expect(screen.getByText("Custom")).toHaveClass("custom-label")
  })

  it("associates with input via htmlFor", () => {
    render(
      <div>
        <Label htmlFor="test-input">Test Label</Label>
        <input id="test-input" />
      </div>
    )
    const label = screen.getByText("Test Label")
    const input = screen.getByRole("textbox")
    expect(label).toHaveAttribute("for", "test-input")
    expect(input).toHaveAttribute("id", "test-input")
  })

  it("renders children elements", () => {
    render(
      <Label>
        <span>Required field</span>
        <span>*</span>
      </Label>
    )
    expect(screen.getByText("Required field")).toBeInTheDocument()
    expect(screen.getByText("*")).toBeInTheDocument()
  })
})
