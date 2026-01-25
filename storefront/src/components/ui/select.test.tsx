import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "./select"

describe("Select", () => {
  it("renders select trigger", () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    )
    expect(screen.getByRole("combobox")).toBeInTheDocument()
  })

  it("displays placeholder text", () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Choose something" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    )
    expect(screen.getByText("Choose something")).toBeInTheDocument()
  })

  it("opens dropdown when clicked", async () => {
    const user = userEvent.setup()
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    )

    await user.click(screen.getByRole("combobox"))
    await waitFor(() => {
      expect(screen.getByRole("listbox")).toBeInTheDocument()
    })
  })

  it("displays options when opened", async () => {
    const user = userEvent.setup()
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="orange">Orange</SelectItem>
        </SelectContent>
      </Select>
    )

    await user.click(screen.getByRole("combobox"))
    await waitFor(() => {
      expect(screen.getByRole("option", { name: /apple/i })).toBeInTheDocument()
      expect(screen.getByRole("option", { name: /banana/i })).toBeInTheDocument()
      expect(screen.getByRole("option", { name: /orange/i })).toBeInTheDocument()
    })
  })

  it("selects an option when clicked", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <Select onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
        </SelectContent>
      </Select>
    )

    await user.click(screen.getByRole("combobox"))
    await waitFor(() => {
      expect(screen.getByRole("listbox")).toBeInTheDocument()
    })

    await user.click(screen.getByRole("option", { name: /apple/i }))
    expect(onValueChange).toHaveBeenCalledWith("apple")
  })

  it("displays selected value", async () => {
    const user = userEvent.setup()
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="chosen">Chosen Option</SelectItem>
        </SelectContent>
      </Select>
    )

    await user.click(screen.getByRole("combobox"))
    await waitFor(() => {
      expect(screen.getByRole("listbox")).toBeInTheDocument()
    })
    await user.click(screen.getByRole("option", { name: /chosen option/i }))

    await waitFor(() => {
      expect(screen.getByRole("combobox")).toHaveTextContent("Chosen Option")
    })
  })

  it("renders with default value", () => {
    render(
      <Select defaultValue="default">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Default Value</SelectItem>
          <SelectItem value="other">Other Value</SelectItem>
        </SelectContent>
      </Select>
    )
    expect(screen.getByRole("combobox")).toHaveTextContent("Default Value")
  })

  it("renders disabled state", () => {
    render(
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option">Option</SelectItem>
        </SelectContent>
      </Select>
    )
    expect(screen.getByRole("combobox")).toBeDisabled()
  })

  it("renders select group with label", async () => {
    const user = userEvent.setup()
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    )

    await user.click(screen.getByRole("combobox"))
    await waitFor(() => {
      expect(screen.getByText("Fruits")).toBeInTheDocument()
    })
  })

  it("applies custom className to trigger", () => {
    render(
      <Select>
        <SelectTrigger className="custom-trigger">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option">Option</SelectItem>
        </SelectContent>
      </Select>
    )
    expect(screen.getByRole("combobox")).toHaveClass("custom-trigger")
  })

  it("renders disabled option", async () => {
    const user = userEvent.setup()
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="enabled">Enabled</SelectItem>
          <SelectItem value="disabled" disabled>
            Disabled
          </SelectItem>
        </SelectContent>
      </Select>
    )

    await user.click(screen.getByRole("combobox"))
    await waitFor(() => {
      const disabledOption = screen.getByRole("option", { name: /disabled/i })
      expect(disabledOption).toHaveAttribute("data-disabled")
    })
  })
})
