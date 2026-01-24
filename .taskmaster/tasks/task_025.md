# Task ID: 25

**Title:** Build Product Detail Page - Full Page

**Status:** pending

**Dependencies:** 23, 24

**Priority:** high

**Description:** Assemble full product detail page with gallery, info, variants, add to cart.

**Details:**

Framework Context:
- Use /senior-developer skill

Implementation Steps:
1. Create app/(shop)/products/[handle]/page.tsx
2. Fetch product data from Medusa
3. Assemble ImageGallery + VariantSelector
4. Add product description
5. Add vendor info section
6. Add Add to Cart button

Files:
- storefront/app/(shop)/products/[handle]/page.tsx
- storefront/components/products/ProductInfo.tsx
- storefront/components/products/AddToCartButton.tsx

**Test Strategy:**

Playwright Verification:
- mcp-cli call playwright/browser_navigate '{"url": "http://localhost:3000/products/sample-product"}'
- mcp-cli call playwright/browser_snapshot '{}'
- mcp-cli call playwright/browser_take_screenshot '{"type": "png", "filename": "product-detail.png"}'

Acceptance:
- [ ] All sections render
- [ ] Variants selectable
- [ ] Add to cart works

Auto-Commit: /auto-commit
