import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ProductGrid } from "./ProductGrid";
import { CartProvider } from "@/context/CartContext";

// Helper to wrap component with CartProvider
function renderWithCart(ui: React.ReactElement) {
  return render(<CartProvider>{ui}</CartProvider>);
}

describe("ProductGrid", () => {
  const mockProducts = [
    {
      id: "prod_1",
      title: "Product One",
      thumbnail: "https://example.com/prod1.jpg",
      variants: [
        {
          id: "var_1",
          prices: [{ amount: 1000, currency_code: "KWD" }],
        },
      ],
    },
    {
      id: "prod_2",
      title: "Product Two",
      thumbnail: null,
      variants: [
        {
          id: "var_2",
          prices: [{ amount: 2500, currency_code: "KWD" }],
        },
      ],
    },
    {
      id: "prod_3",
      title: "Product Three",
      thumbnail: "https://example.com/prod3.jpg",
      variants: [
        {
          id: "var_3",
          prices: [{ amount: 5000, currency_code: "KWD" }],
        },
      ],
    },
  ];

  beforeEach(() => {
    localStorage.clear();
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("with initialProducts", () => {
    it("renders all products from initialProducts", () => {
      renderWithCart(<ProductGrid initialProducts={mockProducts} />);

      expect(screen.getByText("Product One")).toBeInTheDocument();
      expect(screen.getByText("Product Two")).toBeInTheDocument();
      expect(screen.getByText("Product Three")).toBeInTheDocument();
    });

    it("renders correct number of ProductCards", () => {
      renderWithCart(<ProductGrid initialProducts={mockProducts} />);

      const addToCartButtons = screen.getAllByRole("button", {
        name: /add to cart/i,
      });
      expect(addToCartButtons).toHaveLength(3);
    });

    it("renders product prices correctly", () => {
      renderWithCart(<ProductGrid initialProducts={mockProducts} />);

      // 1000 cents = 10.00 KWD
      expect(screen.getByText(/10\.00/)).toBeInTheDocument();
      // 2500 cents = 25.00 KWD
      expect(screen.getByText(/25\.00/)).toBeInTheDocument();
      // 5000 cents = 50.00 KWD
      expect(screen.getByText(/50\.00/)).toBeInTheDocument();
    });

    it("does not show loading state", () => {
      renderWithCart(<ProductGrid initialProducts={mockProducts} />);

      // Should not have loading skeleton
      const skeletons = document.querySelectorAll(".animate-pulse");
      expect(skeletons.length).toBe(0);
    });
  });

  describe("empty state", () => {
    it("shows empty state when no products", () => {
      renderWithCart(<ProductGrid initialProducts={[]} />);

      expect(
        screen.getByText(/no products available/i)
      ).toBeInTheDocument();
    });

    it("shows empty icon in empty state", () => {
      const { container } = renderWithCart(<ProductGrid initialProducts={[]} />);

      // Should have an SVG icon
      const icon = container.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });
  });

  describe("loading state", () => {
    it("shows loading skeletons when fetching without initialProducts", () => {
      // Mock fetch to not resolve immediately
      vi.spyOn(global, "fetch").mockImplementation(
        () => new Promise(() => {})
      );

      const { container } = renderWithCart(<ProductGrid />);

      // Should have 8 loading skeleton placeholders
      const skeletons = container.querySelectorAll(".animate-pulse");
      expect(skeletons.length).toBe(8);
    });
  });

  describe("fetch products", () => {
    it("fetches products from backend when no initialProducts", async () => {
      const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: async () => ({ products: mockProducts }),
      } as Response);

      renderWithCart(<ProductGrid />);

      await waitFor(() => {
        expect(screen.getByText("Product One")).toBeInTheDocument();
      });

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/store/products"),
        expect.objectContaining({
          headers: { "Content-Type": "application/json" },
        })
      );
    });

    it("handles fetch error gracefully", async () => {
      vi.spyOn(global, "fetch").mockResolvedValue({
        ok: false,
        status: 500,
      } as Response);

      renderWithCart(<ProductGrid />);

      await waitFor(() => {
        expect(screen.getByText(/failed to load products/i)).toBeInTheDocument();
      });

      // Should have retry button
      expect(screen.getByText(/try again/i)).toBeInTheDocument();
    });

    it("handles network error gracefully", async () => {
      vi.spyOn(global, "fetch").mockRejectedValue(new Error("Network error"));

      renderWithCart(<ProductGrid />);

      await waitFor(() => {
        expect(screen.getByText(/failed to load products/i)).toBeInTheDocument();
      });
    });

    it("uses NEXT_PUBLIC_MEDUSA_BACKEND_URL when available", async () => {
      const originalEnv = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
      process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL = "http://custom-backend:9000";

      const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: async () => ({ products: [] }),
      } as Response);

      renderWithCart(<ProductGrid />);

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith(
          "http://custom-backend:9000/store/products",
          expect.any(Object)
        );
      });

      process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL = originalEnv;
    });
  });

  describe("grid layout", () => {
    it("renders products in responsive grid", () => {
      const { container } = renderWithCart(
        <ProductGrid initialProducts={mockProducts} />
      );

      const grid = container.querySelector(".grid");
      expect(grid).toBeInTheDocument();
      expect(grid).toHaveClass("grid-cols-2");
      expect(grid).toHaveClass("md:grid-cols-3");
      expect(grid).toHaveClass("lg:grid-cols-4");
    });
  });

  describe("product variant handling", () => {
    it("handles product with no variants", () => {
      const productNoVariants = {
        ...mockProducts[0],
        variants: [],
      };

      renderWithCart(<ProductGrid initialProducts={[productNoVariants]} />);

      expect(screen.getByText("Product One")).toBeInTheDocument();
      // Price should be 0 when no variants
      expect(screen.getByText(/0\.00/)).toBeInTheDocument();
    });

    it("handles product with no prices in variant", () => {
      const productNoPrices = {
        ...mockProducts[0],
        variants: [{ id: "var_1", prices: [] }],
      };

      renderWithCart(<ProductGrid initialProducts={[productNoPrices]} />);

      expect(screen.getByText("Product One")).toBeInTheDocument();
      // Price should be 0 when no prices
      expect(screen.getByText(/0\.00/)).toBeInTheDocument();
    });
  });
});
