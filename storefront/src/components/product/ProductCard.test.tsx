import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProductCard } from "./ProductCard";
import { CartProvider } from "@/context/CartContext";

// Helper to wrap component with CartProvider
function renderWithCart(ui: React.ReactElement) {
  return render(<CartProvider>{ui}</CartProvider>);
}

describe("ProductCard", () => {
  const mockProduct = {
    id: "prod_123",
    title: "Test Product",
    thumbnail: "https://example.com/image.jpg",
    price: 1500, // 15.00 KWD in cents
  };

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it("renders product title correctly", () => {
    renderWithCart(<ProductCard {...mockProduct} />);
    expect(screen.getByText("Test Product")).toBeInTheDocument();
  });

  it("renders product price formatted correctly", () => {
    renderWithCart(<ProductCard {...mockProduct} />);
    // Price should be formatted as KWD (1500 cents = 15.00 KWD)
    const priceElement = screen.getByText(/15\.00/);
    expect(priceElement).toBeInTheDocument();
  });

  it("renders Add to Cart button", () => {
    renderWithCart(<ProductCard {...mockProduct} />);
    const button = screen.getByRole("button", { name: /add to cart/i });
    expect(button).toBeInTheDocument();
  });

  it("renders product thumbnail when provided", () => {
    renderWithCart(<ProductCard {...mockProduct} />);
    const image = screen.getByAltText("Test Product");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", expect.stringContaining("image.jpg"));
  });

  it("renders placeholder when thumbnail is null", () => {
    renderWithCart(
      <ProductCard {...mockProduct} thumbnail={null} />
    );
    // Should not have an image with product title as alt text
    const image = screen.queryByAltText("Test Product");
    expect(image).not.toBeInTheDocument();
    // Should have an SVG placeholder
    const placeholder = screen.getByRole("img", { hidden: true }) ||
                        document.querySelector("svg");
    expect(placeholder).toBeInTheDocument();
  });

  it("handles Add to Cart click", () => {
    renderWithCart(<ProductCard {...mockProduct} />);
    const button = screen.getByRole("button", { name: /add to cart/i });

    // Click should not throw
    expect(() => fireEvent.click(button)).not.toThrow();
  });

  it("renders with custom currency code", () => {
    renderWithCart(
      <ProductCard {...mockProduct} currencyCode="USD" price={1000} />
    );
    // Price should be formatted as USD (1000 cents = $10.00)
    const priceElement = screen.getByText(/\$10\.00/);
    expect(priceElement).toBeInTheDocument();
  });

  it("has proper card structure", () => {
    const { container } = renderWithCart(<ProductCard {...mockProduct} />);

    // Should have card with hover effects
    const card = container.querySelector(".hover\\:shadow-lg");
    expect(card).toBeInTheDocument();
  });

  it("formats zero price correctly", () => {
    renderWithCart(<ProductCard {...mockProduct} price={0} />);
    const priceElement = screen.getByText(/0\.00/);
    expect(priceElement).toBeInTheDocument();
  });

  it("renders product title with line clamp for long titles", () => {
    const longTitle = "This is a very long product title that should be truncated with line clamp";
    renderWithCart(<ProductCard {...mockProduct} title={longTitle} />);

    const titleElement = screen.getByText(longTitle);
    expect(titleElement).toHaveClass("line-clamp-2");
  });
});
