# Task ID: 67

**Title:** Build Homepage

**Status:** pending

**Dependencies:** 65, 66, 19

**Priority:** high

**Description:** Create marketplace homepage with hero, categories, featured products.

**Details:**

Framework Context:
- Use /senior-developer skill

Implementation Steps:
1. Create app/page.tsx
2. Add hero banner section
3. Add category cards
4. Add featured products grid
5. Add promotional sections

Files:
- storefront/app/page.tsx
- storefront/components/home/HeroBanner.tsx
- storefront/components/home/CategoryCards.tsx
- storefront/components/home/FeaturedProducts.tsx

**Test Strategy:**

Playwright Verification:
- mcp-cli call playwright/browser_navigate '{"url": "http://localhost:3000"}'
- mcp-cli call playwright/browser_take_screenshot '{"type": "png", "filename": "homepage.png"}'

Acceptance:
- [ ] All sections render
- [ ] Images optimized
- [ ] Links work

Auto-Commit: /auto-commit
