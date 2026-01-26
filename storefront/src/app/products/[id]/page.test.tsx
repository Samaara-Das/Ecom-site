import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ProductDetailPage from "./page";

// Mock the useParams hook
const mockProductId = "prod_test123";
vi.mock("next/navigation", () => ({
  useParams: () => ({ id: mockProductId }),
}));

// Mock the CartContext
const mockAddItem = vi.fn();
vi.mock("@/context/CartContext", () => ({
  useCart: () => ({
    addItem: mockAddItem,
    items: [],
    itemCount: 0,
    total: 0,
    isOpen: false,
    openCart: vi.fn(),
    closeCart: vi.fn(),
    toggleCart: vi.fn(),
    removeItem: vi.fn(),
    updateQuantity: vi.fn(),
    clearCart: vi.fn(),
  }),
}));

// Mock the Header, Footer, and CartDrawer components
vi.mock("@/components/layout/Header", () => ({
  Header: () => <header data-testid="mock-header">Header</header>,
}));

vi.mock("@/components/layout/Footer", () => ({
  Footer: () => <footer data-testid="mock-footer">Footer</footer>,
}));

vi.mock("@/components/cart/CartDrawer", () => ({
  CartDrawer: () => <div data-testid="mock-cart-drawer">CartDrawer</div>,
}));

// Mock next/image
vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

const mockProduct = {
  id: mockProductId,
  title: "Test Product",
  description: "This is a test product description.",
  thumbnail: "https://example.com/image.jpg",
  handle: "test-product",
  variants: [
    {
      id: "variant_1",
      title: "Default",
      prices: [
        {
          amount: 2500,
          currency_code: "KWD",
        },
      ],
    },
    {
      id: "variant_2",
      title: "Large",
      prices: [
        {
          amount: 3500,
          currency_code: "KWD",
        },
      ],
    },
  ],
};

describe("ProductDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset fetch mock
    global.fetch = vi.fn();
  });

  it("renders loading state initially", () => {
    global.fetch = vi.fn(() => new Promise(() => {})); // Never resolves
    render(<ProductDetailPage />);

    // Check for loading skeleton
    expect(screen.getByTestId("mock-header")).toBeInTheDocument();
    expect(document.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("renders product details after loading", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ product: mockProduct }),
    });

    render(<ProductDetailPage />);

    await waitFor(() => {
      expect(screen.getByTestId("product-title")).toBeInTheDocument();
    });

    expect(screen.getByTestId("product-title")).toHaveTextContent("Test Product");
    expect(screen.getByTestId("product-price")).toBeInTheDocument();
    expect(screen.getByTestId("product-description")).toHaveTextContent(
      "This is a test product description."
    );
    expect(screen.getByTestId("add-to-cart-button")).toBeInTheDocument();
  });

  it("renders error state when product not found", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    render(<ProductDetailPage />);

    await waitFor(() => {
      expect(screen.getByText("Product Not Found")).toBeInTheDocument();
    });

    expect(screen.getByRole("link", { name: /back to home/i })).toBeInTheDocument();
  });

  it("renders error state on fetch failure", async () => {
    global.fetch = vi.fn().mockRejectedValueOnce(new Error("Network error"));

    render(<ProductDetailPage />);

    await waitFor(() => {
      expect(screen.getByText("Error Loading Product")).toBeInTheDocument();
    });
  });

  it("shows variant selector when product has multiple variants", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ product: mockProduct }),
    });

    render(<ProductDetailPage />);

    await waitFor(() => {
      expect(screen.getByTestId("variant-selector")).toBeInTheDocument();
    });

    const selector = screen.getByTestId("variant-selector");
    expect(selector).toHaveValue("variant_1");
  });

  it("calls addItem when Add to Cart button is clicked", async () => {
    const user = userEvent.setup();

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ product: mockProduct }),
    });

    render(<ProductDetailPage />);

    await waitFor(() => {
      expect(screen.getByTestId("add-to-cart-button")).toBeInTheDocument();
    });

    const addToCartButton = screen.getByTestId("add-to-cart-button");
    await user.click(addToCartButton);

    expect(mockAddItem).toHaveBeenCalledWith({
      id: mockProductId,
      title: "Test Product",
      thumbnail: "https://example.com/image.jpg",
      price: 2500,
      variantId: "variant_1",
    });
  });

  it("renders breadcrumb navigation", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ product: mockProduct }),
    });

    render(<ProductDetailPage />);

    await waitFor(() => {
      expect(screen.getByLabelText("Breadcrumb")).toBeInTheDocument();
    });

    const breadcrumb = screen.getByLabelText("Breadcrumb");
    expect(breadcrumb).toBeInTheDocument();

    // Check breadcrumb links
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();

    // Product title appears in both breadcrumb and h1, so use getAllByText
    const productTitleElements = screen.getAllByText("Test Product");
    expect(productTitleElements.length).toBeGreaterThanOrEqual(2); // In breadcrumb and h1
  });

  it("renders Continue Shopping button", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ product: mockProduct }),
    });

    render(<ProductDetailPage />);

    await waitFor(() => {
      expect(screen.getByText("Continue Shopping")).toBeInTheDocument();
    });
  });

  it("formats price correctly in KWD", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ product: mockProduct }),
    });

    render(<ProductDetailPage />);

    await waitFor(() => {
      expect(screen.getByTestId("product-price")).toBeInTheDocument();
    });

    // Price is 2500 cents = 25.00 KWD
    const priceElement = screen.getByTestId("product-price");
    expect(priceElement.textContent).toMatch(/KWD|25/);
  });

  it("renders placeholder image when thumbnail is null", async () => {
    const productWithoutThumbnail = {
      ...mockProduct,
      thumbnail: null,
    };

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ product: productWithoutThumbnail }),
    });

    render(<ProductDetailPage />);

    await waitFor(() => {
      expect(screen.getByTestId("product-title")).toBeInTheDocument();
    });

    // Should not have an img element with the product image
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("hides variant selector when product has single variant", async () => {
    const singleVariantProduct = {
      ...mockProduct,
      variants: [mockProduct.variants[0]],
    };

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ product: singleVariantProduct }),
    });

    render(<ProductDetailPage />);

    await waitFor(() => {
      expect(screen.getByTestId("product-title")).toBeInTheDocument();
    });

    expect(screen.queryByTestId("variant-selector")).not.toBeInTheDocument();
  });
});
