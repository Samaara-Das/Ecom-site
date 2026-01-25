import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { Input } from "./input"

describe("Input", () => {
  it("renders an input element", () => {
    render(<Input />)
    expect(screen.getByRole("textbox")).toBeInTheDocument()
  })

  it("handles text input", async () => {
    const user = userEvent.setup()
    render(<Input />)
    const input = screen.getByRole("textbox")

    await user.type(input, "Hello World")
    expect(input).toHaveValue("Hello World")
  })

  it("renders with placeholder", () => {
    render(<Input placeholder="Enter text..." />)
    expect(screen.getByPlaceholderText("Enter text...")).toBeInTheDocument()
  })

  it("handles onChange events", async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} />)

    await user.type(screen.getByRole("textbox"), "a")
    expect(handleChange).toHaveBeenCalled()
  })

  it("renders disabled state", () => {
    render(<Input disabled />)
    expect(screen.getByRole("textbox")).toBeDisabled()
  })

  it("renders with type password", () => {
    render(<Input type="password" data-testid="password-input" />)
    const input = screen.getByTestId("password-input")
    expect(input).toHaveAttribute("type", "password")
  })

  it("renders with type email", () => {
    render(<Input type="email" data-testid="email-input" />)
    const input = screen.getByTestId("email-input")
    expect(input).toHaveAttribute("type", "email")
  })

  it("renders with type number", () => {
    render(<Input type="number" data-testid="number-input" />)
    const input = screen.getByTestId("number-input")
    expect(input).toHaveAttribute("type", "number")
  })

  it("allows custom className", () => {
    render(<Input className="custom-class" />)
    expect(screen.getByRole("textbox")).toHaveClass("custom-class")
  })

  it("applies default styles", () => {
    render(<Input />)
    const input = screen.getByRole("textbox")
    expect(input).toHaveClass("flex")
    expect(input).toHaveClass("h-10")
    expect(input).toHaveClass("w-full")
    expect(input).toHaveClass("rounded-md")
  })

  it("renders with value", () => {
    render(<Input defaultValue="Initial value" />)
    expect(screen.getByRole("textbox")).toHaveValue("Initial value")
  })

  it("renders required attribute", () => {
    render(<Input required />)
    expect(screen.getByRole("textbox")).toBeRequired()
  })

  it("renders with aria-label for accessibility", () => {
    render(<Input aria-label="Email address" />)
    expect(screen.getByRole("textbox")).toHaveAttribute(
      "aria-label",
      "Email address"
    )
  })
})
