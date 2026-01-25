import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "./card"

describe("Card", () => {
  it("renders card with children", () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText("Card content")).toBeInTheDocument()
  })

  it("applies default styles", () => {
    render(<Card data-testid="card">Content</Card>)
    const card = screen.getByTestId("card")
    expect(card).toHaveClass("rounded-lg")
    expect(card).toHaveClass("border")
    expect(card).toHaveClass("bg-card")
    expect(card).toHaveClass("shadow-sm")
  })

  it("allows custom className", () => {
    render(<Card className="custom-class">Content</Card>)
    expect(screen.getByText("Content").parentElement || screen.getByText("Content")).toHaveClass("custom-class")
  })
})

describe("CardHeader", () => {
  it("renders header with children", () => {
    render(<CardHeader>Header content</CardHeader>)
    expect(screen.getByText("Header content")).toBeInTheDocument()
  })

  it("applies padding styles", () => {
    render(<CardHeader data-testid="header">Header</CardHeader>)
    const header = screen.getByTestId("header")
    expect(header).toHaveClass("p-6")
  })

  it("allows custom className", () => {
    render(<CardHeader className="custom-header">Header</CardHeader>)
    expect(screen.getByText("Header")).toHaveClass("custom-header")
  })
})

describe("CardTitle", () => {
  it("renders title text", () => {
    render(<CardTitle>My Title</CardTitle>)
    expect(screen.getByText("My Title")).toBeInTheDocument()
  })

  it("applies title styles", () => {
    render(<CardTitle data-testid="title">Title</CardTitle>)
    const title = screen.getByTestId("title")
    expect(title).toHaveClass("text-2xl")
    expect(title).toHaveClass("font-semibold")
  })

  it("allows custom className", () => {
    render(<CardTitle className="custom-title">Title</CardTitle>)
    expect(screen.getByText("Title")).toHaveClass("custom-title")
  })
})

describe("CardDescription", () => {
  it("renders description text", () => {
    render(<CardDescription>My description</CardDescription>)
    expect(screen.getByText("My description")).toBeInTheDocument()
  })

  it("applies description styles", () => {
    render(<CardDescription data-testid="desc">Description</CardDescription>)
    const desc = screen.getByTestId("desc")
    expect(desc).toHaveClass("text-sm")
    expect(desc).toHaveClass("text-muted-foreground")
  })

  it("allows custom className", () => {
    render(<CardDescription className="custom-desc">Desc</CardDescription>)
    expect(screen.getByText("Desc")).toHaveClass("custom-desc")
  })
})

describe("CardContent", () => {
  it("renders content children", () => {
    render(<CardContent>Card body content</CardContent>)
    expect(screen.getByText("Card body content")).toBeInTheDocument()
  })

  it("applies content padding styles", () => {
    render(<CardContent data-testid="content">Content</CardContent>)
    const content = screen.getByTestId("content")
    expect(content).toHaveClass("p-6")
    expect(content).toHaveClass("pt-0")
  })

  it("allows custom className", () => {
    render(<CardContent className="custom-content">Content</CardContent>)
    expect(screen.getByText("Content")).toHaveClass("custom-content")
  })
})

describe("CardFooter", () => {
  it("renders footer children", () => {
    render(<CardFooter>Footer content</CardFooter>)
    expect(screen.getByText("Footer content")).toBeInTheDocument()
  })

  it("applies footer styles", () => {
    render(<CardFooter data-testid="footer">Footer</CardFooter>)
    const footer = screen.getByTestId("footer")
    expect(footer).toHaveClass("flex")
    expect(footer).toHaveClass("items-center")
    expect(footer).toHaveClass("p-6")
    expect(footer).toHaveClass("pt-0")
  })

  it("allows custom className", () => {
    render(<CardFooter className="custom-footer">Footer</CardFooter>)
    expect(screen.getByText("Footer")).toHaveClass("custom-footer")
  })
})

describe("Card composition", () => {
  it("renders a complete card with all parts", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card description here</CardDescription>
        </CardHeader>
        <CardContent>Main content goes here</CardContent>
        <CardFooter>Footer actions</CardFooter>
      </Card>
    )

    expect(screen.getByText("Card Title")).toBeInTheDocument()
    expect(screen.getByText("Card description here")).toBeInTheDocument()
    expect(screen.getByText("Main content goes here")).toBeInTheDocument()
    expect(screen.getByText("Footer actions")).toBeInTheDocument()
  })
})
