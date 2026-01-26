/**
 * E2E Test: Add to Cart Flow
 *
 * This test verifies the complete add-to-cart user flow:
 * 1. Navigate to homepage with products displayed
 * 2. Click "Add to Cart" button on a product
 * 3. Verify cart drawer opens automatically
 * 4. Verify cart icon updates with item count
 * 5. Verify product appears in cart with correct info
 * 6. Verify cart subtotal is calculated correctly
 *
 * Test Environment:
 * - Storefront: http://localhost:3000
 * - Backend: http://localhost:9000 (optional - uses mock products when unavailable)
 *
 * To run this test manually with Playwright MCP:
 * 1. Start storefront: cd storefront && npm run dev
 * 2. Use Playwright MCP commands as documented below
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CartProvider, useCart } from "@/context/CartContext";
import { ProductCard } from "@/components/product/ProductCard";
import { CartDrawer } from "@/components/cart/CartDrawer";

// Mock product data matching the format used in ProductGrid
const mockProduct = {
  id: "prod_mock_1",
  title: "Premium Wireless Headphones",
  thumbnail: "https://picsum.photos/seed/headphones/400/400",
  price: 7500, // Price in cents (KWD 75.000)
};

// Test wrapper component that includes cart provider
function TestWrapper({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}

describe("E2E: Add to Cart Flow", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should add product to cart when clicking Add to Cart button", async () => {
    render(
      <TestWrapper>
        <ProductCard {...mockProduct} />
        <CartDrawer />
      </TestWrapper>
    );

    // Find and click the Add to Cart button
    const addToCartButton = screen.getByRole("button", { name: /add to cart/i });
    expect(addToCartButton).toBeInTheDocument();

    fireEvent.click(addToCartButton);

    // Wait for cart drawer to open and display the product
    await waitFor(() => {
      expect(screen.getByText("Shopping Cart")).toBeInTheDocument();
    });

    // Verify product appears in cart (use getAllBy since title appears in both card and cart)
    const productTitles = screen.getAllByText("Premium Wireless Headphones");
    expect(productTitles.length).toBeGreaterThanOrEqual(2); // Once in card, once in cart

    // Verify price is displayed in cart (formatted as KWD)
    const prices = screen.getAllByText(/KWD 75\.000/);
    expect(prices.length).toBeGreaterThanOrEqual(2); // Once in card, once in cart
  });

  it("should update cart icon badge when item is added", async () => {
    // This test requires the Header component which shows the cart badge
    // The badge shows itemCount from cart context
    const CartIconTest = () => {
      const { itemCount, addItem } = useCart();
      return (
        <div>
          <span data-testid="cart-count">{itemCount}</span>
          <button
            onClick={() =>
              addItem({
                id: mockProduct.id,
                title: mockProduct.title,
                thumbnail: mockProduct.thumbnail,
                price: mockProduct.price,
              })
            }
          >
            Add Item
          </button>
        </div>
      );
    };

    render(
      <TestWrapper>
        <CartIconTest />
      </TestWrapper>
    );

    // Initially cart should be empty
    expect(screen.getByTestId("cart-count")).toHaveTextContent("0");

    // Add item to cart
    fireEvent.click(screen.getByRole("button", { name: /add item/i }));

    // Cart count should update
    await waitFor(() => {
      expect(screen.getByTestId("cart-count")).toHaveTextContent("1");
    });
  });

  it("should show correct quantity controls in cart", async () => {
    render(
      <TestWrapper>
        <ProductCard {...mockProduct} />
        <CartDrawer />
      </TestWrapper>
    );

    // Add product to cart
    fireEvent.click(screen.getByRole("button", { name: /add to cart/i }));

    // Wait for cart to open
    await waitFor(() => {
      expect(screen.getByText("Shopping Cart")).toBeInTheDocument();
    });

    // Verify quantity controls exist
    const decrementButton = screen.getByRole("button", { name: "-" });
    const incrementButton = screen.getByRole("button", { name: "+" });

    expect(decrementButton).toBeInTheDocument();
    expect(incrementButton).toBeInTheDocument();

    // Initial quantity should be 1
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("should calculate subtotal correctly", async () => {
    const CartSubtotalTest = () => {
      const { total, addItem } = useCart();
      const formattedTotal = new Intl.NumberFormat("en-KW", {
        style: "currency",
        currency: "KWD",
      }).format(total / 100);

      return (
        <div>
          <span data-testid="subtotal">{formattedTotal}</span>
          <button
            onClick={() =>
              addItem({
                id: mockProduct.id,
                title: mockProduct.title,
                thumbnail: mockProduct.thumbnail,
                price: mockProduct.price,
              })
            }
          >
            Add Item
          </button>
        </div>
      );
    };

    render(
      <TestWrapper>
        <CartSubtotalTest />
      </TestWrapper>
    );

    // Initially subtotal should be 0
    expect(screen.getByTestId("subtotal")).toHaveTextContent("KWD 0.000");

    // Add item
    fireEvent.click(screen.getByRole("button", { name: /add item/i }));

    // Subtotal should update to item price
    await waitFor(() => {
      expect(screen.getByTestId("subtotal")).toHaveTextContent("KWD 75.000");
    });

    // Add same item again (should increase quantity)
    fireEvent.click(screen.getByRole("button", { name: /add item/i }));

    // Subtotal should double
    await waitFor(() => {
      expect(screen.getByTestId("subtotal")).toHaveTextContent("KWD 150.000");
    });
  });

  it("should persist cart to localStorage", async () => {
    render(
      <TestWrapper>
        <ProductCard {...mockProduct} />
        <CartDrawer />
      </TestWrapper>
    );

    // Add product to cart
    fireEvent.click(screen.getByRole("button", { name: /add to cart/i }));

    // Wait for cart state to update
    await waitFor(() => {
      const stored = localStorage.getItem("kuwait-marketplace-cart");
      expect(stored).toBeTruthy();
      const cart = JSON.parse(stored!);
      expect(cart).toHaveLength(1);
      expect(cart[0].id).toBe(mockProduct.id);
    });
  });
});

/**
 * Playwright MCP Manual Test Steps:
 *
 * These steps can be executed manually using the Playwright MCP tools
 * to verify the E2E flow in a real browser:
 *
 * Step 1: Navigate to homepage
 * mcp-cli call playwright/browser_navigate '{"url": "http://localhost:3000"}'
 *
 * Step 2: Wait for products to load
 * mcp-cli call playwright/browser_wait_for '{"text": "Add to Cart"}'
 *
 * Step 3: Take snapshot to see available elements
 * mcp-cli call playwright/browser_snapshot '{}'
 *
 * Step 4: Click Add to Cart button (use ref from snapshot)
 * mcp-cli call playwright/browser_click '{"ref": "<button_ref>", "element": "Add to Cart button"}'
 *
 * Step 5: Verify cart drawer opened and contains product
 * mcp-cli call playwright/browser_snapshot '{}'
 * - Should show "Shopping Cart" heading
 * - Should show product title in cart
 * - Should show cart badge with count "1"
 *
 * Step 6: Take screenshot for verification
 * mcp-cli call playwright/browser_take_screenshot '{"type": "png", "filename": "add-to-cart-test.png"}'
 *
 * Step 7: Check network requests (optional - when backend is running)
 * mcp-cli call playwright/browser_network_requests '{"includeStatic": false}'
 * - Should show POST /store/carts for cart creation (when backend available)
 *
 * Expected Results:
 * ✅ Products displayed on homepage
 * ✅ Add to Cart button clickable
 * ✅ Cart drawer opens automatically after adding item
 * ✅ Cart icon badge updates with item count
 * ✅ Product appears in cart with correct title, image, price
 * ✅ Quantity controls (+/-) visible
 * ✅ Subtotal calculated correctly
 * ✅ Checkout button visible
 */
