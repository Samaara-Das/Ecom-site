# Task ID: 19

**Title:** Create ProductCard Component

**Status:** pending

**Dependencies:** 5, 12

**Priority:** high

**Description:** Build reusable ProductCard with image, title, price, vendor badge using TDD approach.

**Details:**

Framework Context:
- Use /senior-developer skill with TDD (RED → GREEN → REFACTOR)
- Follow atomic design (molecule component)
- Use accessible queries for testing

Implementation Steps (TDD):
1. RED: Write failing test for renders product image with alt text
2. GREEN: Implement minimal ProductCard with image
3. RED: Write test for displays formatted price with currency
4. GREEN: Add price display
5. RED: Write test for shows vendor name
6. GREEN: Add vendor badge
7. RED: Write test for links to product page
8. GREEN: Wrap in Next.js Link
9. REFACTOR: Add Tailwind styling, hover effects

Code Pattern:
// storefront/components/products/ProductCard.test.tsx
import { render, screen } from '@testing-library/react'
import { ProductCard } from './ProductCard'

const mockProduct = {
  id: '1',
  title: 'Test Product',
  handle: 'test-product',
  thumbnail: '/images/product.jpg',
  price: { amount: 2999, currency_code: 'KWD' },
  vendor: { name: 'Test Vendor' }
}

describe('ProductCard', () => {
  it('renders product image with alt text', () => {
    render(<ProductCard product={mockProduct} />)
    const image = screen.getByRole('img', { name: /test product/i })
    expect(image).toBeInTheDocument()
  })
})

Files:
- storefront/components/products/ProductCard.tsx
- storefront/components/products/ProductCard.test.tsx
- storefront/components/products/types.ts

**Test Strategy:**

TDD Cycle:
1. RED: npm test -- ProductCard (tests fail - component doesn't exist)
2. GREEN: Create minimal component to pass each test
3. REFACTOR: Add styling while keeping tests green

Test Commands:
npm test -- ProductCard.test.tsx
npm test -- --coverage ProductCard.test.tsx

Playwright Verification:
- mcp-cli call playwright/browser_navigate '{"url": "http://localhost:3000"}'
- mcp-cli call playwright/browser_snapshot '{}'
- Verify ProductCards render in grid with images, prices, vendors

Acceptance:
- [ ] All 5 TDD tests pass
- [ ] Accessible (keyboard navigable, screen reader friendly)
- [ ] Responsive (1-4 columns based on viewport)
- [ ] No console errors

Auto-Commit: /auto-commit
