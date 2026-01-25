import { render, screen, waitFor, act } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import {
  Toast,
  ToastProvider,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastViewport,
  ToastAction,
} from "./toast"
import { Toaster } from "./toaster"
import { useToast, toast } from "@/hooks/use-toast"

function ToastWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      {children}
      <ToastViewport />
    </ToastProvider>
  )
}

describe("Toast Components", () => {
  it("renders toast with title", () => {
    render(
      <ToastWrapper>
        <Toast open>
          <ToastTitle>Toast Title</ToastTitle>
        </Toast>
      </ToastWrapper>
    )
    expect(screen.getByText("Toast Title")).toBeInTheDocument()
  })

  it("renders toast with description", () => {
    render(
      <ToastWrapper>
        <Toast open>
          <ToastDescription>Toast description text</ToastDescription>
        </Toast>
      </ToastWrapper>
    )
    expect(screen.getByText("Toast description text")).toBeInTheDocument()
  })

  it("renders toast with title and description", () => {
    render(
      <ToastWrapper>
        <Toast open>
          <ToastTitle>Notification</ToastTitle>
          <ToastDescription>Something happened</ToastDescription>
        </Toast>
      </ToastWrapper>
    )
    expect(screen.getByText("Notification")).toBeInTheDocument()
    expect(screen.getByText("Something happened")).toBeInTheDocument()
  })

  it("renders close button", () => {
    render(
      <ToastWrapper>
        <Toast open>
          <ToastTitle>Toast</ToastTitle>
          <ToastClose />
        </Toast>
      </ToastWrapper>
    )
    expect(screen.getByRole("button")).toBeInTheDocument()
  })

  it("renders toast action", () => {
    render(
      <ToastWrapper>
        <Toast open>
          <ToastTitle>Action Toast</ToastTitle>
          <ToastAction altText="Undo action">Undo</ToastAction>
        </Toast>
      </ToastWrapper>
    )
    expect(screen.getByRole("button", { name: /undo/i })).toBeInTheDocument()
  })

  it("applies default variant styles", () => {
    render(
      <ToastWrapper>
        <Toast open data-testid="toast">
          <ToastTitle>Default</ToastTitle>
        </Toast>
      </ToastWrapper>
    )
    const toast = screen.getByTestId("toast")
    expect(toast).toHaveClass("border")
    expect(toast).toHaveClass("bg-background")
  })

  it("applies destructive variant styles", () => {
    render(
      <ToastWrapper>
        <Toast open variant="destructive" data-testid="toast">
          <ToastTitle>Error</ToastTitle>
        </Toast>
      </ToastWrapper>
    )
    const toast = screen.getByTestId("toast")
    expect(toast).toHaveClass("destructive")
    expect(toast).toHaveClass("border-destructive")
  })

  it("handles action click", async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(
      <ToastWrapper>
        <Toast open>
          <ToastTitle>Toast</ToastTitle>
          <ToastAction altText="Click action" onClick={handleClick}>
            Click Me
          </ToastAction>
        </Toast>
      </ToastWrapper>
    )

    await user.click(screen.getByRole("button", { name: /click me/i }))
    expect(handleClick).toHaveBeenCalled()
  })
})

describe("useToast hook", () => {
  function TestComponent() {
    const { toasts, toast: showToast, dismiss } = useToast()

    return (
      <div>
        <button onClick={() => showToast({ title: "Test Toast" })}>
          Show Toast
        </button>
        <button onClick={() => dismiss()}>Dismiss All</button>
        <div data-testid="toast-count">{toasts.length}</div>
        {toasts.map((t) => (
          <div key={t.id} data-testid={`toast-${t.id}`}>
            {t.title as string}
          </div>
        ))}
      </div>
    )
  }

  // Reset toast state between tests
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("shows toast when toast function is called", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<TestComponent />)

    await user.click(screen.getByRole("button", { name: /show toast/i }))

    await waitFor(() => {
      expect(screen.getByText("Test Toast")).toBeInTheDocument()
    })
  })

  it("increments toast count", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<TestComponent />)

    expect(screen.getByTestId("toast-count")).toHaveTextContent("0")

    await user.click(screen.getByRole("button", { name: /show toast/i }))

    await waitFor(() => {
      expect(screen.getByTestId("toast-count")).toHaveTextContent("1")
    })
  })

  it("dismisses toasts when dismiss is called", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<TestComponent />)

    await user.click(screen.getByRole("button", { name: /show toast/i }))

    await waitFor(() => {
      expect(screen.getByTestId("toast-count")).toHaveTextContent("1")
    })

    await user.click(screen.getByRole("button", { name: /dismiss all/i }))

    await waitFor(() => {
      expect(screen.queryByText("Test Toast")).not.toBeInTheDocument()
    })
  })
})

describe("Toaster component", () => {
  function TestApp() {
    const showToast = () => {
      toast({
        title: "Success",
        description: "Your action was successful",
      })
    }

    return (
      <div>
        <button onClick={showToast}>Trigger Toast</button>
        <Toaster />
      </div>
    )
  }

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("renders toasts from toast function", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<TestApp />)

    await user.click(screen.getByRole("button", { name: /trigger toast/i }))

    await waitFor(() => {
      expect(screen.getByText("Success")).toBeInTheDocument()
      expect(screen.getByText("Your action was successful")).toBeInTheDocument()
    })
  })
})
