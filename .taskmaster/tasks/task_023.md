# Task ID: 23

**Title:** Build Product Detail Page - Image Gallery

**Status:** pending

**Dependencies:** 4

**Priority:** high

**Description:** Create product image gallery with thumbnails, zoom, and swipe on mobile.

**Details:**

Framework Context:
- Use /senior-developer skill with TDD

Implementation Steps (TDD):
1. Write test for main image display
2. Write test for thumbnail click
3. Write test for zoom on hover
4. Implement ImageGallery component
5. Add mobile swipe support

Files:
- storefront/components/products/ImageGallery.tsx
- storefront/components/products/ImageGallery.test.tsx

**Test Strategy:**

TDD Test Cases:
- displays main image
- clicking thumbnail changes main
- zoom works on desktop
- swipe works on mobile

Playwright Verification:
- Navigate to product page
- Click thumbnails, verify main changes

Acceptance:
- [ ] Gallery renders images
- [ ] Thumbnails work
- [ ] Mobile swipe works

Auto-Commit: /auto-commit
