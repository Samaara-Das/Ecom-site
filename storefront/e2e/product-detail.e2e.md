# E2E Test: Product Detail Page Verification (V-5)

This document describes the E2E test scenarios for verifying the Product Detail Page functionality.

## Prerequisites

1. Backend services running on port 9000 (Medusa API)
2. Storefront running on port 3000 (Next.js)
3. At least one product seeded in the database

## Test Scenarios

### 1. Navigate to Product Detail from Home Page

**Steps:**
1. Open home page (http://localhost:3000)
2. Take snapshot to see available product cards
3. Click on a product card
4. Verify navigation to product detail page (/products/{id})

**Expected Results:**
- Product cards are visible on home page
- Clicking a product card navigates to /products/{id}
- URL contains /products/

### 2. Verify Product Detail Page Elements

**Steps:**
1. Navigate to a product detail page
2. Take snapshot to verify elements

**Expected Results:**
- Product title is displayed
- Product price is displayed (in KWD currency)
- Product description is shown (if available)
- Add to Cart button is present
- Continue Shopping button is present
- Breadcrumb navigation is visible

### 3. Add Product to Cart

**Steps:**
1. Navigate to a product detail page
2. Click Add to Cart button
3. Verify cart opens

**Expected Results:**
- Cart drawer opens after clicking Add to Cart
- Product is added to cart

### 4. Variant Selection (for products with multiple variants)

**Steps:**
1. Navigate to a product with multiple variants
2. Select different variant
3. Verify price updates accordingly

**Expected Results:**
- Variant selector is visible
- Selecting a variant updates the displayed price

### 5. Navigate Back to Home

**Steps:**
1. From product detail page
2. Click Continue Shopping button
3. Verify navigation back to home

**Expected Results:**
- Clicking Continue Shopping navigates to home page

### 6. Error Handling - Product Not Found

**Steps:**
1. Navigate to /products/invalid-product-id
2. Verify error message

**Expected Results:**
- Error message "Product Not Found" is displayed
- Back to Home button is present

## Browser Automation Commands

```bash
# Start browser and navigate to home
agent-browser open http://localhost:3000

# Take snapshot to see elements
agent-browser snapshot

# Click on a product card (example: @e1)
agent-browser click @e1

# Take screenshot for visual verification
agent-browser screenshot product-detail.png

# Get page content
agent-browser content

# Close browser
agent-browser close
```

## Test Data

Products are seeded in the Medusa backend with IDs like:
- prod_electronics_001
- prod_fashion_001
- prod_home_001

Each product has:
- Title
- Description
- Thumbnail (may be null)
- Variants with prices in KWD
