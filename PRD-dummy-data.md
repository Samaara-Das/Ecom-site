# PRD: Kuwait Marketplace — Realistic Demo Data + Amazon-style UX

**Version**: 1.1
**Date**: 2026-02-21
**Author**: Product Team
**Status**: Draft — Ready for Implementation
**File**: `PRD-dummy-data.md`

---

## 1. Overview

### Problem Statement

The Kuwait Marketplace is functionally complete (MVP 37/37 tasks done), but the storefront currently looks empty and unconvincing for investor and client demos. Without realistic data, it is impossible to communicate the full value proposition of the platform:

- The store page shows few or no products
- There are no vendors visible to browse
- No order history exists in the admin dashboard
- Products show "Out of Stock" due to missing inventory
- Product pages have no reviews or social proof
- The platform does not feel like a real, active marketplace

This PRD defines everything needed to make the site look like a thriving, live marketplace — specifically for investor demo and client presentation purposes.

### Target Users (of this feature)

| User | Context |
|------|---------|
| **Investors / stakeholders** | Viewing a live demo link — need to feel platform is real and working |
| **Client prospects** | Evaluating the platform — need to see realistic product variety and UX |
| **Internal developers** | Testing features against realistic data volumes |

---

## 2. Goals & Non-Goals

### Business Goals

- Make the site look like a real, busy Kuwait marketplace within one dev session
- Support investor demo conversations without explaining "this is just placeholder data"
- Demonstrate the multi-vendor architecture with visible vendor differentiation
- Show social proof signals (ratings, sold counts, reviews) on products

### User Goals (demo audience)

- Browse a marketplace with 12+ distinct vendor shops
- See 60+ products across electronics, fashion, beauty, food categories
- Read realistic product reviews from named customers
- See bestseller badges and sold-count signals on popular items
- View an admin dashboard that shows real order/revenue activity

### Non-Goals (explicitly out of scope)

- **Real transactions** — No actual payments, no real customer data
- **Live product images** — Images should come from free, stable sources (no paid CDNs)
- **Full review CRUD system** — Reviews are a static frontend component, not a backend module
- **Performance at scale** — Seeded data is for demo, not load testing
- **Arabic translations of seeded content** — All dummy content is English-only for now
- **Multi-region data** — Only Kuwait (KWD currency, /kw locale)

---

## 3. Feature Scope

### 3.1 Vendors — 12 Kuwaiti Businesses

Seed **12 vendor profiles** across the top 4 categories plus secondary categories.

**Priority categories**: Electronics & Tech, Fashion & Apparel, Health & Beauty, Food & Groceries
**Secondary**: Home & Kitchen, Sports & Outdoors, Kids & Toys, Automotive

**Each vendor must have:**
- Realistic Arabic and/or English business name
- Real Kuwait district (Kuwait City, Salmiya, Hawalli, Farwaniya, Fahaheel, Sabah Al-Salem, Rumaithiya, Mishref, Salwa, or Bayan)
- Kuwait phone number in format: `+965 XXXX XXXX`
- Business registration number: `CR-KW-XXX`
- Professional 2-sentence business description
- Status: 6 verified, 3 premium, 2 pending, 1 suspended
- Commission rates: 8–18% depending on category

**Required vendor roster (minimum):**

| # | Business Name | Category | District | Status |
|---|--------------|----------|----------|--------|
| 1 | TechZone Kuwait / تك زون | Electronics | Kuwait City | Premium |
| 2 | Al-Sayer Electronics | Electronics | Salmiya | Verified |
| 3 | Zara Kuwait (Unofficial) / مودة | Fashion | The Avenues | Premium |
| 4 | Al-Shaya Fashion | Fashion | Hawalli | Verified |
| 5 | Glow Beauty Kuwait | Health & Beauty | Salmiya | Verified |
| 6 | Oud & Rose Perfumery | Health & Beauty | Kuwait City | Verified |
| 7 | Tamr Dates & Specialty Foods | Food & Grocery | Farwaniya | Verified |
| 8 | Kuwait Organic Market | Food & Grocery | Mishref | Verified |
| 9 | Hessa Home Goods | Home & Kitchen | Rumaithiya | Pending |
| 10 | FitLife Kuwait | Sports & Outdoors | Sabah Al-Salem | Verified |
| 11 | Little Stars Kids | Kids & Toys | Salwa | Pending |
| 12 | AutoParts Gulf | Automotive | Fahaheel | Suspended |

---

### 3.2 Products — 60 Products with Realistic Details

Seed **60 products** distributed evenly across vendor categories.

**Branding strategy:**
- **Big-ticket items** (phones, laptops, gaming): Use real brand names (Samsung, Apple, Sony, PlayStation, LEGO)
- **Mid-range / fashion**: Mix of real and fictional (Nike, Adidas alongside "FitWear Pro")
- **Local / specialty**: Fictional brands with authentic Arabic-inspired names

**Image strategy:**
- Use Unsplash with specific photo IDs known to show the correct subject
- Format: `https://images.unsplash.com/photo-{PHOTO_ID}?w=600&h=600&fit=crop`
- Fallback: `https://picsum.photos/seed/{product-slug}/600/600`
- Every product must have at least 2 different images

**Variant strategy:**
- Electronics: Storage (128GB/256GB/512GB) or Color (Midnight Black/Pearl White/Titanium)
- Fashion: Size (XS/S/M/L/XL) + Color, OR just Color
- Food: Weight/Volume (250g/500g/1kg) or Pack size
- Beauty: Size (30ml/50ml/100ml) or Shade

**Pricing (KWD, amounts in fils — multiply by 1000):**
- Budget: 1–10 KWD (food, small accessories)
- Mid-range: 10–80 KWD (beauty, fashion basics)
- Premium: 80–300 KWD (phones, smartwatches, premium fashion)
- High-end: 300–1500 KWD (laptops, cameras, OLED TVs)

**Required product list (60 total):**

**Electronics (15 products):**
1. Samsung Galaxy S25 Ultra — 5 color variants — 285–295 KWD
2. Apple iPhone 16 Pro Max — 3 storage variants — 320–380 KWD
3. MacBook Pro 14" M4 — 2 config variants — 590–790 KWD
4. Sony WH-1000XM6 Headphones — 2 color variants — 110 KWD
5. iPad Air M2 — 3 storage variants — 195–280 KWD
6. PlayStation 5 Slim — 2 variants (Disc/Digital) — 180–160 KWD
7. Samsung 65" OLED 4K TV — 1 variant — 650 KWD
8. DJI Mini 4 Pro Drone — 2 kit variants — 290–360 KWD
9. Apple Watch Series 10 — 2 band variants — 145–165 KWD
10. Dyson V15 Detect Vacuum — 1 variant — 210 KWD
11. Nespresso Vertuo Next — 2 color variants — 75 KWD
12. Logitech MX Master 3S Mouse — 3 color variants — 45 KWD
13. Anker PowerBank 26800mAh — 2 variants — 22 KWD
14. Canon EOS R8 Camera — 2 kit variants — 520–650 KWD
15. JBL Flip 6 Speaker — 4 color variants — 38 KWD

**Fashion & Apparel (15 products):**
16. Nike Air Max 270 — Size 40–46 × 3 colors — 48 KWD
17. Adidas Ultraboost 24 — Size 39–45 × 2 colors — 55 KWD
18. Levi's 511 Slim Jeans — Sizes 30–36 × 2 washes — 28 KWD
19. Zara Oversized Linen Shirt — S/M/L/XL × 4 colors — 18 KWD
20. Ray-Ban Aviator Classic — 3 lens variants — 62 KWD
21. Fossil Gen 6 Smartwatch — 2 strap variants — 95 KWD
22. Michael Kors Leather Tote — 3 color variants — 145 KWD
23. Pandora Moments Bracelet — 3 size variants — 55 KWD
24. Under Armour Project Rock Hoodie — S/M/L/XL × 2 colors — 38 KWD
25. H&M Premium Abaya — S/M/L/XL — 22 KWD
26. Swarovski Crystal Earrings — 4 style variants — 35 KWD
27. Tommy Hilfiger Polo Shirt — S/M/L/XL × 3 colors — 32 KWD
28. Birkenstock Arizona Sandals — EU 36–44 × 2 materials — 45 KWD
29. Longchamp Le Pliage Bag — 3 color variants — 88 KWD
30. Cartier-style Love Bracelet — Gold/Silver/Rose Gold — 25 KWD

**Health & Beauty (12 products):**
31. Charlotte Tilbury Hollywood Flawless Filter — 6 shades — 28 KWD
32. La Mer Moisturizing Cream 60ml — 1 variant — 95 KWD
33. Jo Malone London Peony & Blush Suede — 30ml/100ml — 55–130 KWD
34. Olaplex No.3 Hair Perfector — 1 variant — 22 KWD
35. Fenty Beauty Pro Filt'r Foundation — 10 shades — 18 KWD
36. Drunk Elephant C-Firma Vitamin C Serum — 1 variant — 68 KWD
37. Dyson Airwrap Complete Long — 2 color variants — 295 KWD
38. Armani Si Passione EDP — 30ml/50ml/100ml — 38–95 KWD
39. NARS Orgasm Blush — 1 variant — 22 KWD
40. The Ordinary AHA 30% + BHA 2% — 1 variant — 8 KWD
41. Foreo LUNA 4 Face Cleanser — 3 skin type variants — 125 KWD
42. Laneige Lip Sleeping Mask — 4 flavor variants — 12 KWD

**Food & Groceries (10 products):**
43. Premium Ajwa Dates 1kg — 250g/500g/1kg — 3.5–12 KWD
44. Pure Saffron Threads — 1g/5g/10g — 4.5–38 KWD
45. Extra Virgin Olive Oil — 500ml/1L — 5.5–9 KWD
46. Organic Manuka Honey MGO 300+ — 250g/500g — 12–22 KWD
47. Ghee Butter (Organic) — 300g/1kg — 4.8–14 KWD
48. Al-Qassab Arabic Coffee Blend — 250g/500g — 3.8–7 KWD
49. Himalayan Pink Salt Grinder — 250g/500g/1kg — 2.5–7 KWD
50. Premium Basmati Rice — 2kg/5kg/10kg — 3–12 KWD
51. Imported Dark Chocolate Set — Box of 24/48 — 15–28 KWD
52. Garden of Life Protein Powder — Vanilla/Chocolate × 500g/1kg — 18–32 KWD

**Home & Kitchen (5 products):**
53. KitchenAid Artisan Stand Mixer — 3 color variants — 185 KWD
54. Instant Pot Duo 7-in-1 (6L) — 1 variant — 68 KWD
55. Philips Hue Starter Kit — 2 pack/4 pack — 42–78 KWD
56. SMEG Espresso Machine — 3 color variants — 145 KWD
57. Roomba j7+ Robot Vacuum — 1 variant — 320 KWD

**Sports (3 products):**
58. Garmin Fenix 7X Sapphire — 2 strap variants — 410 KWD
59. Lululemon Align Yoga Pants — XS/S/M/L × 4 colors — 68 KWD
60. TRX GO Suspension Trainer — 1 variant — 88 KWD

**Each product must have:**
- Title, handle (URL slug), status: published
- 3–5 sentence description with specific specs, materials, or features (no generic lorem ipsum)
- At least 2 images (correct Unsplash photo IDs for the subject)
- Options and variants per the list above
- KWD prices (primary currency)
- Inventory: 10–150 units per variant depending on product type
- Linked to a vendor from the vendor list above
- Category assigned

---

### 3.3 Customers — 25 Realistic People

Seed **25 customer accounts** reflecting Kuwait's demographic reality: ~60% Kuwaiti nationals, ~40% expats (South Asian, Western, Arab expats).

**Customer data requirements:**
- First name, last name
- Email: `firstname.lastname@gmail.com` or `name@hotmail.com`
- Phone: +965 for Kuwaitis, +91 for Indians, +44 for British, +1 for Americans
- Shipping address: Kuwait district, block number, street number, apartment/villa number
- Account created date: spread over past 12 months

**Required customer roster:**

| Name | Origin | Email | Phone prefix |
|------|--------|-------|-------------|
| Mohammed Al-Rashidi | Kuwaiti | m.alrashidi@gmail.com | +965 |
| Fatima Al-Sabah | Kuwaiti | fatima.alsabah@hotmail.com | +965 |
| Ahmed Al-Muftah | Kuwaiti | ahmed.almuftah@gmail.com | +965 |
| Nour Al-Harbi | Kuwaiti | nour.alharbi@gmail.com | +965 |
| Khalid Al-Enezi | Kuwaiti | k.alenezi@hotmail.com | +965 |
| Maryam Al-Jassem | Kuwaiti | maryam.aljassem@gmail.com | +965 |
| Abdullah Al-Mutairi | Kuwaiti | a.almutairi@gmail.com | +965 |
| Sara Al-Kandari | Kuwaiti | sara.alkandari@hotmail.com | +965 |
| Omar Al-Ajmi | Kuwaiti | omar.alajmi@gmail.com | +965 |
| Hessa Al-Fahad | Kuwaiti | hessa.alfahad@gmail.com | +965 |
| Zainab Al-Khatib | Kuwaiti | zainab.alkhatib@gmail.com | +965 |
| Faisal Al-Marzouk | Kuwaiti | faisal.almarzouk@hotmail.com | +965 |
| Dana Al-Sultani | Kuwaiti | dana.alsultani@gmail.com | +965 |
| Yousef Al-Bahar | Kuwaiti | yousef.albahar@gmail.com | +965 |
| Reem Al-Ghanem | Kuwaiti | reem.alghanem@hotmail.com | +965 |
| Raj Patel | Indian expat | raj.patel.kw@gmail.com | +91 |
| Priya Sharma | Indian expat | priya.sharma.kw@gmail.com | +91 |
| James Mitchell | British expat | j.mitchell.kuwait@gmail.com | +44 |
| Sarah Johnson | American expat | sarah.johnson.kw@gmail.com | +1 |
| Carlos Rodriguez | Spanish expat | carlos.rodriguez.kw@gmail.com | +34 |
| Maria Santos | Filipino expat | maria.santos.kw@gmail.com | +63 |
| David Kim | Korean expat | david.kim.kuwait@gmail.com | +82 |
| Emily Watson | Australian expat | emily.watson.kw@gmail.com | +61 |
| Tom Anderson | Canadian expat | tom.anderson.kw@gmail.com | +1 |
| Li Chen | Chinese expat | li.chen.kuwait@gmail.com | +86 |

**Kuwait addresses format:**
```
Block {3–12}, Street {1–20}, House/Villa {1–100}
{District}, Kuwait
```

---

### 3.4 Orders — 25 Orders Across All States

Seed **25 orders** linking seeded customers to seeded products.

**Order distribution by status:**

| Status | Count | Description |
|--------|-------|-------------|
| Completed (paid + fulfilled) | 12 | Historical orders — drives revenue on dashboard |
| Processing (paid, being shipped) | 6 | Recent orders — makes vendor dashboard look active |
| Pending (placed, awaiting payment) | 4 | Conversion funnel activity |
| Cancelled / Refunded | 3 | Realistic — every marketplace has some |

**Order data requirements:**
- Each order links to 1–4 products from various vendors
- Order totals between 5 KWD and 400 KWD
- Created timestamps: spread over past 3 months (not all on same day)
- Completed orders have a fulfilled_at date after created_at
- Cancelled orders have a cancellation reason
- Shipping address uses the customer's Kuwait address

---

### 3.5 Product Reviews — Static Frontend Component

Since Medusa v2 has no built-in review system, implement a **static React component** that displays realistic, hardcoded reviews on the product detail page.

**Component**: `storefront/src/components/product/ProductReviews.tsx`
**Integration**: Mount inside the product detail page below the product description

**Review data requirements:**
- 5–8 reviews per product (shown on product page)
- Reviewer names must match the seeded customers above
- Ratings: 85% are 4–5 stars, 15% are 3 stars (realistic distribution)
- Review text must be **specific to the product category** — no generic copy-paste:
  - Electronics: mention specific features (battery life, camera quality, screen)
  - Fashion: mention fit, material, colour accuracy
  - Food: mention taste, packaging, freshness
  - Beauty: mention skin type, results after X weeks
- Dates: spread over past 6 months, formatted as "15 January 2026"
- Include a "Verified Purchase" badge on all reviews
- Include a star rating breakdown summary (5★ X, 4★ X, etc.) at the top

**Review component UI:**
```
┌─────────────────────────────────────────┐
│  Customer Reviews                        │
│  ★★★★½  4.6 out of 5   (47 reviews)    │
│  ████████████ 5★ (28)                   │
│  ██████ 4★ (12)                         │
│  ██ 3★ (5)                              │
│  1★ (2)                                 │
├─────────────────────────────────────────│
│  ★★★★★  Mohammed Al-Rashidi            │
│  Verified Purchase · 12 Jan 2026        │
│  [Review text specific to product]      │
├─────────────────────────────────────────│
│  (more reviews...)                      │
└─────────────────────────────────────────┘
```

---

### 3.6 Social Proof Badges — Bestseller & Sold Count Display

Add **frontend-only** social proof signals to product cards on the store listing page.

**Signals to implement:**

| Signal | Condition | Display |
|--------|-----------|---------|
| Bestseller badge | Products with highest inventory sold (top 20%) | Orange "Bestseller" pill on card top-left |
| "X+ sold" count | All products | "120+ sold" text beneath price |
| Star rating | All products | ★ 4.6 (47) in small text beneath title |
| "New Arrival" badge | Products created in last 30 days | Green "New" pill |
| "Low Stock" warning | Variants with < 10 units | "Only 3 left!" in red |

**Implementation**: This can be driven by metadata fields set during seeding or by hardcoding a `SOCIAL_PROOF_CONFIG` map in the storefront keyed by product handle.

---

### 3.7 Visual QA — Playwright Screenshots as Evidence

After all seeding is complete, run a Playwright script that captures:

| Screenshot | URL | What to verify |
|-----------|-----|---------------|
| `demo-homepage.png` | `/kw` | Hero, featured products, vendor logos |
| `demo-store.png` | `/kw/store` | 60+ products visible, badges, grid layout |
| `demo-product-electronics.png` | `/kw/products/samsung-galaxy-s25-ultra` | Images, variants, reviews, social proof |
| `demo-product-fashion.png` | `/kw/products/nike-air-max-270` | Variant selector, size guide, reviews |
| `demo-product-food.png` | `/kw/products/premium-ajwa-dates-1kg` | Food-specific reviews, variants |
| `demo-cart.png` | `/kw/cart` | Multi-vendor cart grouping |
| `demo-vendor-list.png` | `/kw/vendors` | Vendor cards with logos/names |
| `demo-admin-dashboard.png` | `localhost:9000/app` | Orders, revenue, product count |

All screenshots saved to `demo-screenshots/` folder at project root.

---

## 4. User Stories

### US-001: Investor views a populated storefront

- **As an** investor viewing the demo
- **I want** to see a marketplace with many active products and vendors
- **So that** I can evaluate the platform's potential at scale

**Acceptance Criteria:**
- [ ] Store page shows at least 60 products with images, prices, and ratings
- [ ] At least 3 distinct vendor brands are visible on the homepage
- [ ] Each product has a star rating and sold count
- [ ] Bestseller badges appear on the top 12 products
- [ ] No "Out of Stock" labels on any seeded product
- [ ] Product images show the actual product type (not a random photo)

### US-002: Investor browses a product detail page

- **As an** investor
- **I want** to see a realistic product page with reviews
- **So that** I understand the full customer experience

**Acceptance Criteria:**
- [ ] Product has 2+ images that can be cycled
- [ ] Variant selector works (size, color, storage)
- [ ] Reviews section shows 5+ reviews with names and dates
- [ ] Star rating breakdown is shown
- [ ] "Verified Purchase" badge appears on reviews
- [ ] Review content is specific to the product (not generic)
- [ ] "Add to Cart" works and adds to cart

### US-003: Investor views admin dashboard

- **As an** investor
- **I want** to see an active admin dashboard with orders and revenue
- **So that** I can understand the business model

**Acceptance Criteria:**
- [ ] Admin dashboard at localhost:9000/app shows orders
- [ ] At least 12 completed orders are visible
- [ ] Order totals are in KWD
- [ ] Multiple order states (completed, processing, cancelled) are visible
- [ ] Product count shows 60+
- [ ] Vendor count shows 12+

### US-004: Investor browses vendor marketplace

- **As an** investor
- **I want** to see distinct vendor shops with different product categories
- **So that** I understand the multi-vendor model

**Acceptance Criteria:**
- [ ] Vendor profiles exist with name, description, district, status
- [ ] Verified and premium vendor badges are visible
- [ ] Products are linked to correct vendors
- [ ] Vendor dashboard (logged in as vendor) shows their products and orders

### US-005: Demo customer account works

- **As an** investor testing the checkout
- **I want** to log in as a demo customer and complete a purchase
- **So that** I can experience the end-to-end flow

**Acceptance Criteria:**
- [ ] Can log in with seeded customer account (e.g., m.alrashidi@gmail.com / Demo1234!)
- [ ] Customer's previous orders are visible in order history
- [ ] Cart checkout flows all the way to order placement
- [ ] KWD prices are displayed consistently

---

## 5. Feature Prioritization (MoSCoW)

### Must Have (blocks demo)

| ID | Feature | Why critical |
|----|---------|-------------|
| FR-001 | 12 vendors seeded | Multi-vendor is the core differentiator |
| FR-002 | 60 products with images | Empty store is unconvincing |
| FR-003 | All products in stock (inventory seeded) | "Out of Stock" kills the demo |
| FR-004 | 25 customers seeded | Needed for order data and login demos |
| FR-005 | 25 orders across all states | Admin dashboard must show activity |
| FR-006 | Products linked to vendors | Shows vendor attribution |

### Should Have (important for demo quality)

| ID | Feature | Why important |
|----|---------|--------------|
| FR-007 | Static product reviews component | Social proof is expected on any ecom site |
| FR-008 | Bestseller + sold count badges | Signals popularity, builds trust |
| FR-009 | Star ratings shown on product cards | Expected UX on any marketplace |
| FR-010 | Playwright screenshots as evidence | Needed for documentation and async sharing |

### Could Have (polish)

| ID | Feature | Notes |
|----|---------|-------|
| FR-011 | "New Arrival" and "Low Stock" badges | Extra polish, quick to add |
| FR-012 | Demo customer login credentials in README | Useful for handing off demo to others |
| FR-013 | Vendor profile pages in storefront | Shows vendor-specific catalog |

### Won't Have (out of scope)

- Real review CRUD API (too much backend work for demo)
- Automated order fulfillment simulation
- Product recommendation engine
- Real payment processing with seeded orders

---

## 6. Technical Considerations

### Integration Points

- **Medusa v2 Core Modules**: Product, Customer, Order, Inventory, Stock Location, Sales Channel
- **Custom Vendor Module**: `backend/src/modules/vendor/` — `VendorModuleService`
- **Seed script runner**: `npx medusa exec ./src/scripts/<file>.ts` (requires backend running)
- **Next.js Storefront**: `storefront/src/` — product pages, store listing, cart

### Seed Script Architecture

Each feature area gets its own seed script for modularity and re-runnability:

```
backend/src/scripts/
├── seed-vendors-v2.ts        # FR-001: 12 vendors
├── seed-products-v2.ts       # FR-002, FR-003: 60 products + inventory
├── seed-customers-v2.ts      # FR-004: 25 customers
├── seed-orders-v2.ts         # FR-005: 25 orders
└── seed-all.ts               # Orchestrator — runs all in correct order
```

All seed scripts must be **idempotent** — check for existing data before creating (by email, handle, SKU, or name) to allow safe re-runs without duplication.

### Storefront Component Architecture

```
storefront/src/
├── components/product/
│   ├── ProductReviews.tsx      # FR-007: Static reviews component
│   └── SocialProofBadge.tsx    # FR-008, FR-009: Badges + ratings
└── lib/
    └── social-proof-config.ts  # Maps product handle → sold count, rating
```

### Image Strategy

For product images, use Unsplash with specific photo IDs known to show relevant content. Build a lookup table in the seed script mapping product category → list of verified Unsplash photo IDs. Fallback to `picsum.photos/seed/{slug}` if Unsplash is unavailable.

**Known working Unsplash photo IDs by category:**
- Smartphones: `photo-1511707171634-5f897ff02aa9`, `photo-1592750475338-74b7b21085ab`
- Laptops: `photo-1496181133206-80ce9b88a853`, `photo-1517336714731-489689fd1ca8`
- Headphones: `photo-1505740420928-5e560c06d30e`, `photo-1546435770-a3e426bf472b`
- Fashion/Shoes: `photo-1542291026-7eec264c27ff`, `photo-1491553895911-0055eca6402d`
- Bags: `photo-1548036328-c9fa89d128fa`, `photo-1590874103328-eac38a683ce7`
- Beauty/Skincare: `photo-1596462502278-27bfdc403348`, `photo-1571781926291-c477ebfd024b`
- Food/Dates: `photo-1609601442485-4522e0b06d7d`
- Coffee: `photo-1447933601403-0c6688de566e`
- Watches: `photo-1524592094714-0f0654e359b1`, `photo-1508057198894-247b23fe5ade`

### Performance Requirements

- All 5 seed scripts must complete in under 10 minutes total
- Frontend badges and reviews must not add perceptible render delay
- Playwright screenshots must complete within 5 minutes

### Potential Challenges

- **Backend must be running** for seed scripts to execute — scripts must print a clear error if backend is unreachable
- **Duplicate detection** — re-running seeds must not create duplicates; check by SKU/email/handle
- **Vendor-product linking** — the Medusa link module must be used to associate products with vendors; this may fail silently
- **Order seeding complexity** — creating Medusa orders requires cart → payment → fulfillment flow or direct DB insert; the script must handle both approaches
- **KWD pricing** — all amounts are in fils (1 KWD = 1000 fils); validate that prices display correctly in storefront

---

## 7. Success Metrics

### Demo Readiness Metrics

| Metric | Target | Verification |
|--------|--------|-------------|
| Vendors in database | ≥ 12 | Admin panel → Vendor list |
| Products in database | ≥ 60 | Store page → count visible products |
| Products with stock > 0 | 100% | No "Out of Stock" labels on store |
| Customers in database | ≥ 25 | Admin panel → Customers |
| Orders in database | ≥ 25 | Admin panel → Orders |
| Reviews shown per product | 5–8 | Open any product page |
| Products with images | 100% | No broken image icons |
| Screenshot evidence | 8 files in demo-screenshots/ | Check folder exists |

### Technical Quality Metrics

| Metric | Target | Verification |
|--------|--------|-------------|
| TypeScript errors | 0 | `npm run build` passes in storefront |
| Lint errors | 0 | `npm run lint` passes |
| Seed scripts idempotent | Yes | Run twice, no duplicates created |
| Page load time (store) | < 3s | Browser DevTools |

---

## 8. Milestones

### Phase 1: Data Foundation (Backend Seeds)
- [ ] FR-001: seed-vendors-v2.ts written and executed successfully
- [ ] FR-002 + FR-003: seed-products-v2.ts written and executed successfully (60 products, inventory seeded)
- [ ] FR-004: seed-customers-v2.ts written and executed successfully
- [ ] FR-005: seed-orders-v2.ts written and executed successfully

### Phase 2: Frontend Enhancements (Storefront)
- [ ] FR-007: ProductReviews.tsx component built and integrated into product page
- [ ] FR-008 + FR-009: SocialProofBadge.tsx and social-proof-config.ts built, integrated into product cards

### Phase 3: QA & Evidence
- [ ] FR-010: Playwright screenshot script runs and produces 8 screenshots in demo-screenshots/
- [ ] Build check passes: `npm run build` and `npx tsc --noEmit`
- [ ] Git commit + push to GitHub on feature/medusa-starter-storefront

---

## 9. Open Questions

- [ ] Should the demo customer accounts have a standard password (e.g., `Demo1234!`) documented in a DEMO.md file for handoff?
- [ ] Should the orders be created via Medusa's internal workflow (requires running backend), or directly inserted via a migration script?
- [ ] Are there any real vendor logos/images to use, or should we use placeholder initials + brand color?
- [ ] Should we also add products to the storefront featured section (homepage hero) — if so, which product handles should be featured?
- [ ] Will the Playwright screenshots be run in CI or just locally?

---

---

## 11. Amazon-style Homepage Redesign

### 11.1 Overview

Redesign the storefront homepage (`/kw`) to match the layout and information density of Amazon.in. The goal is a **busy, content-rich homepage** that immediately communicates "real marketplace" — not a minimal hero page.

Reference screenshots: Amazon.in (dark theme, dense grid of content blocks, horizontal product carousels).

**Design principles from Amazon to replicate:**
- Dark/charcoal background (`#131921` or Tailwind `zinc-900`) with white text
- Content fills the viewport width — no large empty margins
- Multiple independently scrollable horizontal carousels
- Every product card shows: image, title (truncated), price, star rating, sold count
- Deal sections use high-contrast banners (orange, yellow, red accents)
- No hero image with just a tagline — the page starts with deals immediately

---

### 11.2 Homepage Section Breakdown

Build the homepage in vertical stacking sections in this order:

#### Section A — Sticky Top Navigation Bar

```
┌──────────────────────────────────────────────────────────────────┐
│ ☰ All  [All ▾ | 🔍 Search Kuwait Marketplace...]  Account  Cart 3│
│ Electronics  Fashion  Beauty  Food  Home  Sports  Deals  Vendors │
└──────────────────────────────────────────────────────────────────┘
```

**Requirements:**
- Logo left, full-width search bar center (see Section 12 for search spec), cart + account right
- Below the main bar: a horizontal category nav with 8 category links (no dropdown, just links)
- Category nav scrolls horizontally on mobile
- Sticky on scroll (stays at top)
- Background: `#131921` (Amazon dark navy)

#### Section B — Hero Promo Carousel

```
┌──────────────────────────────────────────────────────────────────┐
│  ◀  [  Banner: "Up to 50% off Electronics — Shop Now"        ] ▶ │
│       [  Banner: "Ramadan Deals — Free Delivery on 10+ KWD"  ]   │
│       [  Banner: "New Arrivals: Samsung Galaxy S25 Ultra"    ]   │
└──────────────────────────────────────────────────────────────────┘
```

**Requirements:**
- Full-width auto-rotating banner carousel (3–5 slides, rotates every 4 seconds)
- Each banner has: background colour, headline text, subtext, CTA button, optional right-side image
- Left/right arrow navigation
- Dot indicators below
- Banners are hardcoded (no CMS needed)
- Banner themes: Electronics sale, Fashion deals, Ramadan special, Free delivery promo, New arrivals

**Banner data (hardcode in component):**
```typescript
const banners = [
  { bg: "#FF9900", headline: "Up to 50% off Electronics", sub: "Samsung, Apple, Sony & more", cta: "Shop Now", ctaHref: "/kw/categories/electronics", img: "/banners/electronics.jpg" },
  { bg: "#146EB4", headline: "Ramadan Mega Sale", sub: "Free delivery on orders above 10 KWD", cta: "See Deals", ctaHref: "/kw/store?sort=price_asc", img: "/banners/ramadan.jpg" },
  { bg: "#1B7F2A", headline: "Fresh & Organic Groceries", sub: "Premium dates, saffron, honey — delivered today", cta: "Shop Grocery", ctaHref: "/kw/categories/food", img: "/banners/food.jpg" },
  { bg: "#8B008B", headline: "Designer Fashion Arrivals", sub: "Nike, Adidas, Ray-Ban & more", cta: "Browse Fashion", ctaHref: "/kw/categories/fashion", img: "/banners/fashion.jpg" },
  { bg: "#C7511F", headline: "Beauty Bestsellers", sub: "Charlotte Tilbury, La Mer, Dyson Airwrap", cta: "Shop Beauty", ctaHref: "/kw/categories/beauty", img: "/banners/beauty.jpg" },
]
```

#### Section C — Category Shortcuts Grid

```
┌─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┐
│ 📱  │ 👗  │ 💄  │ 🛒  │ 🏠  │ 🏋️  │ 🧸  │ 🚗  │
│Elec │Fash │Beau │Food │Home │Sprt │Kids │Auto │
└─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┘
```

**Requirements:**
- 8 category cards in a horizontal scrollable row (or 4×2 grid on desktop)
- Each card: icon (emoji or SVG), category name, links to `/kw/categories/{slug}`
- Card style: dark background, white text, coloured icon, subtle hover glow
- No images needed — icons only

#### Section D — Deal Tiles Grid ("Today's Deals")

```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ Up to 40% off│ Up to 60% off│ New Arrivals  │ Under 10 KWD │
│  Electronics │   Fashion    │  This Week    │   Deals      │
│  [4 product  │  [4 product  │  [4 product   │  [4 product  │
│   thumbnails]│   thumbnails]│   thumbnails] │   thumbnails]│
│  See more ›  │  See more ›  │  See more ›   │  See more ›  │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

**Requirements:**
- 4-column grid (2-column on mobile) of deal tile blocks
- Each tile: title (e.g. "Up to 40% off Electronics"), 2×2 grid of 4 product thumbnail images, "See more deals" link
- Tiles are hardcoded with product handles from seeded data
- Clicking a product thumbnail goes to that product page
- Tile background: `#1F2937` (dark card)

#### Section E — "Bestsellers" Horizontal Product Carousel

```
Bestsellers in Electronics                           [See all →]
┌──────┬──────┬──────┬──────┬──────┬──────┐  ▶
│ img  │ img  │ img  │ img  │ img  │ img  │
│Title │Title │Title │Title │Title │Title │
│★4.8  │★4.6  │★4.9  │★4.7  │★4.8  │★4.5  │
│45 KWD│22 KWD│95 KWD│38 KWD│68 KWD│12 KWD│
└──────┴──────┴──────┴──────┴──────┴──────┘
```

**Requirements:**
- Horizontal scrollable row of product cards (scroll with arrow buttons or drag)
- Show 6 cards visible at once on desktop, 2 on mobile
- Each card: product image, title (max 2 lines truncated), star rating, price in KWD, "Add to Cart" button
- At least 3 carousel rows on the homepage:
  1. "Bestsellers in Electronics" — top 12 electronics by inventory sold
  2. "Fashion Picks" — top 12 fashion products
  3. "Deals of the Day" — 12 products with biggest discount percentages
- Data source: pull from the seeded products via Medusa store API
- Fallback: if API fails, render from hardcoded product handles

#### Section F — Vendor Spotlight Row

```
Shop by Vendor                                      [See all vendors →]
┌──────────┬──────────┬──────────┬──────────┬──────────┐
│ TechZone │ Al-Shaya │  Glow    │ Tamr     │ FitLife  │
│ Kuwait   │ Fashion  │ Beauty   │  Dates   │ Kuwait   │
│ ⭐ Premium│ ✓Verified│ ✓Verified│ ✓Verified│ ✓Verified│
└──────────┴──────────┴──────────┴──────────┴──────────┘
```

**Requirements:**
- 5 vendor cards in a horizontal row
- Each card: vendor initial avatar (coloured circle), vendor name, status badge (Premium/Verified), district
- Clicking goes to `/kw/vendors/{id}` or `/kw/store?vendor={id}`
- Cards have a subtle border and hover state

#### Section G — "Under 20 KWD" Deals Row

Same carousel component as Section E but filtered to products priced < 20 KWD.

#### Section H — Footer

- Standard footer: logo, links (About, Sell on Marketplace, Help, Contact), social icons
- Copyright line: "© 2026 Kuwait Marketplace. All rights reserved."

---

### 11.3 Homepage File Structure

```
storefront/src/
├── app/[countryCode]/(main)/page.tsx          # Homepage — replace with Amazon layout
├── components/home/
│   ├── HeroBannerCarousel.tsx                 # Section B
│   ├── CategoryShortcuts.tsx                  # Section C
│   ├── DealTilesGrid.tsx                      # Section D
│   ├── ProductCarousel.tsx                    # Section E, G (reusable)
│   ├── VendorSpotlight.tsx                    # Section F
│   └── home-banner-data.ts                    # Hardcoded banner content
└── styles/
    └── homepage.css                           # Dark theme overrides if needed
```

---

## 12. Amazon-style Search

### 12.1 Search Bar with Category Dropdown

**Component**: Replace existing search bar in header

```
┌────────────────────────────────────────────────────┐
│ [All ▾] │ Search Kuwait Marketplace...          [🔍]│
└────────────────────────────────────────────────────┘
```

**Requirements:**
- Category dropdown on left side of search bar (inside the bar, like Amazon)
- Dropdown options: All, Electronics, Fashion, Health & Beauty, Food & Grocery, Home & Kitchen, Sports, Kids & Toys
- Selecting a category pre-filters the search results
- Search bar is full-width, white background, orange search button (`#FF9900`)
- On mobile: category dropdown collapses to just the search bar + button

**Files to modify:**
- `storefront/src/components/layout/nav/search-bar.tsx` (or equivalent header component)

### 12.2 Search Autocomplete / Suggestions

**Behaviour:**
- As user types (debounced 300ms), show a dropdown of suggestions beneath the bar
- Suggestions come from: product titles matching the query (via Medusa store API `/store/products?q=...`)
- Show max 8 suggestions
- Each suggestion shows: product name, category tag, price
- Clicking a suggestion navigates directly to that product page
- Pressing Enter or clicking 🔍 goes to full search results page

```
┌─────────────────────────────────────────┐
│ samsung                                  │
├─────────────────────────────────────────┤
│ Samsung Galaxy S25 Ultra  Electronics 285 KWD │
│ Samsung 65" OLED 4K TV    Electronics 650 KWD │
│ Samsung Galaxy Buds 3     Electronics  45 KWD │
└─────────────────────────────────────────┘
```

**Files to create:**
- `storefront/src/components/layout/nav/SearchAutocomplete.tsx`

### 12.3 Search Results Page

**Route**: `/kw/search?q={query}&category={cat}&minPrice={n}&maxPrice={n}&rating={n}&sort={s}`

**Layout:**

```
┌───────────────────────────────────────────────────────────┐
│ 1-48 of 127 results for "samsung"          Sort: Featured ▾│
├───────────┬───────────────────────────────────────────────┤
│ FILTERS   │  RESULTS GRID                                  │
│           │  ┌──────┬──────┬──────┬──────┐                │
│ Category  │  │ card │ card │ card │ card │                │
│ ○ All     │  ├──────┼──────┼──────┼──────┤                │
│ ○ Electr. │  │ card │ card │ card │ card │                │
│ ○ Fashion │  └──────┴──────┴──────┴──────┘                │
│           │                                                │
│ Price     │                                                │
│ [slider]  │                                                │
│ 0 — 500KWD│                                                │
│           │                                                │
│ Rating    │                                                │
│ ★★★★+ (42)│                                                │
│ ★★★+ (67) │                                                │
│           │                                                │
│ Vendor    │                                                │
│ □ TechZone│                                                │
│ □ Al-Sayer│                                                │
└───────────┴───────────────────────────────────────────────┘
```

**Left Sidebar Filters:**

| Filter | Type | Options |
|--------|------|---------|
| Category | Radio buttons | All + 8 categories |
| Price | Dual-handle range slider + preset buckets | Under 10, 10–50, 50–150, 150–500, 500+ |
| Customer Rating | Radio buttons | 4★ & up, 3★ & up, 2★ & up |
| Vendor | Checkboxes | List of all 12 vendors with product count |
| Availability | Checkbox | "In Stock Only" |

**Sort options (dropdown top-right):**
- Featured (default)
- Price: Low to High
- Price: High to Low
- Avg. Customer Review
- Newest Arrivals

**Result product card (Amazon-style):**
```
┌─────────────────────────────────────────────────┐
│  [Product Image 200×200]                         │
│                                                  │
│  Samsung Galaxy S25 Ultra — Titanium Black...    │  ← truncated at 2 lines
│  Sold by TechZone Kuwait                         │  ← vendor attribution
│  ★★★★★ 4.8  (127 reviews)                       │
│  120+ bought in past month                       │
│  KWD 285.000                ~~KWD 320.000~~      │  ← price + strikethrough original
│  Limited time deal  [-11%]                       │  ← deal badge
│  Free delivery Mon, 24 Feb                       │
│  [Add to Cart]                                   │
└─────────────────────────────────────────────────┘
```

**Files to create/modify:**
- `storefront/src/app/[countryCode]/(main)/search/page.tsx` — search results page
- `storefront/src/components/search/SearchFilters.tsx` — left sidebar
- `storefront/src/components/search/SearchResultCard.tsx` — product card
- `storefront/src/components/search/SortDropdown.tsx` — sort control
- `storefront/src/lib/search-utils.ts` — URL params parsing, filter logic

### 12.4 Search API Integration

Use Medusa's store products endpoint with query params:

```typescript
// GET /store/products?q={query}&category_id[]={id}&order=price_asc&limit=48
const response = await fetch(
  `${MEDUSA_BACKEND_URL}/store/products?q=${query}&limit=48&offset=${page * 48}`,
  { headers: { "x-publishable-api-key": PUBLISHABLE_KEY } }
)
```

Filter client-side for:
- Price range (filter returned products by variant prices)
- Rating (filter by product metadata rating if present, else show all)
- Vendor (filter by product metadata vendor_id)

---

## 13. User Stories — Amazon UX

### US-006: Shopper lands on homepage and immediately sees deals

- **As a** shopper (or investor demo viewer)
- **I want** to see a rich, Amazon-style homepage with deals and categories
- **So that** I understand this is a serious, busy marketplace

**Acceptance Criteria:**
- [ ] Hero carousel shows at least 3 banners and auto-rotates
- [ ] Left/right arrows navigate banners manually
- [ ] Category shortcuts show all 8 categories with icons and working links
- [ ] Deal tiles grid shows 4 blocks with product thumbnails
- [ ] At least 3 horizontal product carousels are visible on scroll
- [ ] Vendor spotlight shows at least 5 vendor cards
- [ ] Page background is dark (`#131921` or equivalent)
- [ ] Page loads in under 3 seconds (no spinner blocking content)
- [ ] No layout breaks at 375px (mobile), 768px (tablet), 1280px (desktop)

### US-007: Shopper searches for a product and filters results

- **As a** shopper
- **I want** to search with category pre-filtering and see relevant results with filters
- **So that** I find what I want quickly

**Acceptance Criteria:**
- [ ] Typing in search bar shows autocomplete suggestions within 500ms
- [ ] Autocomplete shows product name, category, and price
- [ ] Pressing Enter navigates to `/kw/search?q={term}`
- [ ] Search results page shows product count ("X results for Y")
- [ ] Left sidebar shows Category, Price, Rating, Vendor filters
- [ ] Selecting a price range filters products without page reload
- [ ] Sort dropdown changes product order immediately
- [ ] Each result card shows: image, title, vendor, rating, sold count, price, Add to Cart
- [ ] "Add to Cart" on search results page adds the product to cart directly
- [ ] Searching for a brand name (e.g. "samsung") returns relevant products

---

## 14. Updated Feature Prioritization (MoSCoW)

### Must Have — added in v1.1

| ID | Feature | Why critical |
|----|---------|-------------|
| FR-014 | Amazon-style homepage layout | First impression for investor demo |
| FR-015 | Hero banner carousel (5 slides) | Shows promotional capability |
| FR-016 | Category shortcuts grid | Navigation discoverability |
| FR-017 | Product carousels (3 rows) | Shows content density |
| FR-018 | Search bar with category dropdown | Core UX pattern investors expect |
| FR-019 | Search results page with sidebar filters | Comparable to any major ecom |

### Should Have — added in v1.1

| ID | Feature | Notes |
|----|---------|-------|
| FR-020 | Search autocomplete suggestions | Significant UX polish |
| FR-021 | Deal tiles grid ("Today's Deals") | Matches Amazon homepage feel |
| FR-022 | Vendor spotlight row | Showcases multi-vendor model |

### Could Have

| ID | Feature | Notes |
|----|---------|-------|
| FR-023 | "Under 20 KWD" deals carousel | Extra section |
| FR-024 | Dark mode consistent across all pages | Homepage is dark, rest of site may not be |

---

## 15. Updated Visual QA — Ralph Verification Methods

This section defines **exact, automated verification steps** for Ralph (the autonomous Claude agent) to run after each implementation task. Every step must be deterministic — pass/fail with no ambiguity.

---

### VERIFY-001: Vendors seeded correctly

```bash
# Step 1: API check — count vendors
curl -s http://localhost:9000/store/vendors \
  -H "x-publishable-api-key: $PUBLISHABLE_KEY" | jq '.vendors | length'
# PASS: output >= 12

# Step 2: Check vendor statuses
curl -s http://localhost:9000/store/vendors | jq '[.vendors[] | .status] | group_by(.) | map({status: .[0], count: length})'
# PASS: must include "verified", "premium", "pending"

# Step 3: Playwright — open admin panel and count vendors
# Navigate to http://localhost:9000/app/vendors
# Assert: table has >= 12 rows
```

**Screenshot**: `demo-screenshots/verify-001-vendors-admin.png`
**Pass condition**: ≥ 12 vendors visible in admin panel OR API returns ≥ 12

---

### VERIFY-002: Products seeded + in stock

```bash
# Step 1: API check — count products
curl -s "http://localhost:9000/store/products?limit=100" \
  -H "x-publishable-api-key: $PUBLISHABLE_KEY" | jq '.products | length'
# PASS: output >= 60

# Step 2: Check no product has 0 inventory
curl -s "http://localhost:9000/store/products?limit=100" \
  -H "x-publishable-api-key: $PUBLISHABLE_KEY" \
  | jq '[.products[] | select(.variants[].inventory_quantity == 0)] | length'
# PASS: output == 0 (no out-of-stock products)

# Step 3: Playwright — open /kw/store
# Assert: product grid shows >= 20 items visible
# Assert: NO element with text "Out of stock" exists on page
# Assert: each product card has an image (img src is not empty or broken)
```

**Screenshot**: `demo-screenshots/verify-002-store-products.png`
**Pass condition**: ≥ 60 products in DB, 0 out-of-stock

---

### VERIFY-003: Product images are not broken

```bash
# Playwright script:
# 1. Navigate to /kw/store
# 2. Get all img elements in product cards
# 3. For each img: check naturalWidth > 0 (means image loaded)
# 4. Count broken images (naturalWidth == 0)

const brokenImages = await page.evaluate(() => {
  const imgs = document.querySelectorAll('.product-card img')
  return Array.from(imgs).filter(img => img.naturalWidth === 0).length
})
# PASS: brokenImages == 0
```

**Screenshot**: `demo-screenshots/verify-003-product-images.png`
**Pass condition**: 0 broken images on store page

---

### VERIFY-004: Customers seeded correctly

```bash
# Step 1: API check (admin endpoint)
curl -s http://localhost:9000/admin/customers \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.customers | length'
# PASS: output >= 25

# Step 2: Check a specific customer exists
curl -s "http://localhost:9000/admin/customers?q=Mohammed" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.customers[0].email'
# PASS: output contains "alrashidi"

# Step 3: Verify a demo customer can log in
# POST /store/auth/customer/emailpass
curl -s -X POST http://localhost:9000/store/auth/customer/emailpass \
  -H "Content-Type: application/json" \
  -d '{"email":"m.alrashidi@gmail.com","password":"Demo1234!"}' | jq '.token'
# PASS: returns a non-null JWT token
```

**Pass condition**: ≥ 25 customers in DB, demo login works

---

### VERIFY-005: Orders seeded with correct states

```bash
# Step 1: Count orders
curl -s http://localhost:9000/admin/orders \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.orders | length'
# PASS: output >= 25

# Step 2: Check order state distribution
curl -s http://localhost:9000/admin/orders \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  | jq '[.orders[] | .status] | group_by(.) | map({status: .[0], count: length})'
# PASS: must have "completed" count >= 12, and at least 2 other statuses present

# Step 3: Admin panel visual check
# Playwright: navigate to http://localhost:9000/app/orders
# Assert: table shows >= 25 rows
# Assert: at least 3 different status badge colours visible
```

**Screenshot**: `demo-screenshots/verify-005-orders-admin.png`
**Pass condition**: ≥ 25 orders, all 4 statuses present

---

### VERIFY-006: ProductReviews component renders correctly

```bash
# Playwright steps:
# 1. Navigate to /kw/products/samsung-galaxy-s25-ultra
# 2. Scroll to bottom of page
# 3. Assert: element with text "Customer Reviews" exists
# 4. Assert: star rating summary section is visible
# 5. Assert: at least 5 review cards are rendered
# 6. Assert: each review card has: reviewer name, date, star rating, body text
# 7. Assert: "Verified Purchase" text appears on at least 1 review
# 8. Assert: review text contains product-specific words (e.g., "camera", "battery", "screen")

const reviewCards = await page.locator('[data-testid="review-card"]').count()
# PASS: reviewCards >= 5

const verifiedBadges = await page.locator('text=Verified Purchase').count()
# PASS: verifiedBadges >= 1
```

**Screenshot**: `demo-screenshots/verify-006-product-reviews.png`
**Pass condition**: ≥ 5 reviews visible with names, dates, and product-specific content

---

### VERIFY-007: Social proof badges on product cards

```bash
# Playwright steps:
# 1. Navigate to /kw/store
# 2. Assert: at least 1 element with text "Bestseller" exists (orange badge)
# 3. Assert: at least 1 element matching /\d+\+ sold/ exists (e.g., "120+ sold")
# 4. Assert: at least 1 element matching /★ \d\.\d/ exists (star rating)
# 5. Assert: at least 1 element with text "New" exists (green badge) — if products were seeded today

const bestsellers = await page.locator('text=Bestseller').count()
# PASS: bestsellers >= 1

const soldCounts = await page.locator('[data-testid="sold-count"]').count()
# PASS: soldCounts >= 10
```

**Screenshot**: `demo-screenshots/verify-007-social-proof-badges.png`
**Pass condition**: Bestseller badges and sold counts visible on store page

---

### VERIFY-008: Amazon-style homepage renders

```bash
# Playwright steps:
# 1. Navigate to /kw
# 2. Assert: hero carousel is visible (look for banner with text from banner data)
# 3. Assert: carousel has left/right arrow buttons
# 4. Click right arrow → assert slide changed (different background colour)
# 5. Assert: category shortcuts section is visible with at least 6 icons
# 6. Assert: at least 2 product carousels ("Bestsellers", "Deals") are visible
# 7. Assert: product carousel cards can be scrolled horizontally
# 8. Assert: vendor spotlight row shows at least 3 vendor cards
# 9. Assert: page background colour is dark (not white)
# 10. Assert: page does NOT contain text "No products found" or "Coming soon"

const heroBanner = await page.locator('[data-testid="hero-carousel"]').isVisible()
# PASS: true

const carousels = await page.locator('[data-testid="product-carousel"]').count()
# PASS: carousels >= 2

const categoryCards = await page.locator('[data-testid="category-card"]').count()
# PASS: categoryCards >= 6
```

**Screenshot**: `demo-screenshots/verify-008-homepage-full.png` (full page screenshot)
**Pass condition**: All 6 sections rendered, no empty/broken states

---

### VERIFY-009: Search bar with category dropdown

```bash
# Playwright steps:
# 1. Navigate to /kw
# 2. Assert: search bar is visible in header
# 3. Assert: category dropdown exists left of search input
# 4. Click dropdown → assert dropdown menu opens with category options
# 5. Select "Electronics" → assert dropdown closes, label shows "Electronics"
# 6. Type "samsung" in search bar
# 7. Assert: autocomplete dropdown appears within 1 second
# 8. Assert: at least 2 suggestions are shown
# 9. Assert: each suggestion shows product name + price
# 10. Press Escape → assert autocomplete closes
# 11. Press Enter → assert navigation to /kw/search?q=samsung

await page.fill('[data-testid="search-input"]', 'samsung')
await page.waitForSelector('[data-testid="autocomplete-dropdown"]', { timeout: 1000 })
const suggestions = await page.locator('[data-testid="autocomplete-item"]').count()
# PASS: suggestions >= 2
```

**Screenshot**: `demo-screenshots/verify-009-search-autocomplete.png`
**Pass condition**: Autocomplete shows within 1s, category dropdown works, Enter navigates to results

---

### VERIFY-010: Search results page with filters

```bash
# Playwright steps:
# 1. Navigate to /kw/search?q=samsung
# 2. Assert: results count text is visible (e.g., "X results for 'samsung'")
# 3. Assert: left sidebar is visible with at least 3 filter sections
# 4. Assert: product cards are rendered (count >= 1)
# 5. Assert: each card has image, title, price, rating
# 6. Assert: sort dropdown is visible top-right
# 7. Click sort "Price: Low to High" → assert first product is cheapest
# 8. Click Category filter "Electronics" → assert URL updates with category param
# 9. Assert: price range filter is interactable (slider or checkboxes)
# 10. Click "Add to Cart" on first result → assert cart count increments

# Filter test:
await page.click('[data-testid="filter-rating-4plus"]')
const resultCount = await page.locator('[data-testid="search-result-card"]').count()
# PASS: resultCount >= 1 (filtered results still show)

# Empty state test:
await page.goto('/kw/search?q=xyznonexistentproduct123')
const emptyMessage = await page.locator('text=No results found').isVisible()
# PASS: true (graceful empty state)
```

**Screenshot**: `demo-screenshots/verify-010-search-results.png`
**Pass condition**: Results render, filters work, sort works, Add to Cart works, empty state handled

---

### VERIFY-011: Mobile responsiveness

```bash
# Playwright steps:
# 1. Set viewport to 375×812 (iPhone 14)
await page.setViewportSize({ width: 375, height: 812 })

# 2. Navigate to /kw
# 3. Assert: hero carousel is full width (no horizontal scroll on body)
# 4. Assert: category shortcuts scroll horizontally without layout break
# 5. Assert: product carousels show 2 cards (not 6)
# 6. Assert: hamburger menu icon is visible (not desktop nav links)

# 7. Navigate to /kw/search?q=phone
# 8. Assert: filters are hidden by default (collapsed into "Filter" button)
# 9. Click "Filter" → assert sidebar opens as a modal/drawer

await page.setViewportSize({ width: 375, height: 812 })
await page.goto('/kw')
const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth)
# PASS: bodyScrollWidth <= 375 (no horizontal overflow)
```

**Screenshot**: `demo-screenshots/verify-011-mobile-homepage.png`
**Pass condition**: No horizontal overflow on mobile, carousels work, filters accessible

---

### VERIFY-012: Build passes with no TypeScript errors

```bash
# In storefront/
cd storefront && npm run build 2>&1 | tail -20
# PASS: exits with code 0, no "Error:" lines in output

npx tsc --noEmit 2>&1 | grep "error TS"
# PASS: output is empty (no TypeScript errors)

npm run lint 2>&1 | grep "error"
# PASS: output is empty (no lint errors)
```

**Pass condition**: All 3 commands complete with 0 errors

---

### VERIFY-013: Full demo walkthrough (end-to-end)

This is the final integration test Ralph runs after everything else passes:

```bash
# Playwright E2E script: demo-walkthrough.spec.ts

test('investor demo walkthrough', async ({ page }) => {
  // 1. Homepage loads and looks populated
  await page.goto('http://localhost:8000/kw')
  await expect(page.locator('[data-testid="hero-carousel"]')).toBeVisible()
  await expect(page.locator('[data-testid="product-carousel"]').first()).toBeVisible()

  // 2. Search for a product
  await page.fill('[data-testid="search-input"]', 'iphone')
  await page.press('[data-testid="search-input"]', 'Enter')
  await expect(page).toHaveURL(/search\?q=iphone/)
  await expect(page.locator('[data-testid="search-result-card"]').first()).toBeVisible()

  // 3. Open a product page
  await page.locator('[data-testid="search-result-card"]').first().click()
  await expect(page.locator('h1')).toBeVisible() // product title
  await expect(page.locator('[data-testid="review-card"]').first()).toBeVisible()

  // 4. Add to cart
  await page.locator('[data-testid="add-to-cart-button"]').click()
  await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1')

  // 5. View cart
  await page.goto('http://localhost:8000/kw/cart')
  await expect(page.locator('[data-testid="cart-item"]').first()).toBeVisible()
})
```

**Screenshot**: `demo-screenshots/verify-013-full-walkthrough.png`
**Pass condition**: All 5 steps pass without errors

---

### Ralph's Verification Execution Order

Ralph must run verifications in this sequence after each implementation phase:

| Phase | Tasks Completed | Run Verifications |
|-------|----------------|-------------------|
| Backend seeds | TASK 1–4 | VERIFY-001, 002, 003, 004, 005 |
| Frontend: reviews + badges | TASK 5–6 | VERIFY-006, 007 |
| Frontend: homepage | TASK 7 | VERIFY-008, 011 |
| Frontend: search | TASK 8 | VERIFY-009, 010 |
| Build + final check | TASK 9 | VERIFY-012, 013 |
| All passing | — | Commit + push to GitHub |

**Screenshot folder**: All 13 screenshots saved to `demo-screenshots/` at project root.

If a verification FAILS, Ralph must:
1. Print `RALPH: VERIFY-XXX FAILED — [error message]`
2. Attempt to fix the root cause (read the component, find the bug, fix it)
3. Re-run that specific verification
4. If still failing after 2 attempts: log in task-context.md and move on

---

## 10. Implementation Notes for Task-Master

When parsing this PRD into tasks, generate tasks in this order (respects dependencies):

1. **Seed vendors** — `seed-vendors-v2.ts` (no deps) → VERIFY-001
2. **Seed products + inventory** — `seed-products-v2.ts` (depends on vendors) → VERIFY-002, 003
3. **Seed customers** — `seed-customers-v2.ts` (no deps) → VERIFY-004
4. **Seed orders** — `seed-orders-v2.ts` (depends on products + customers) → VERIFY-005
5. **Build ProductReviews component** — `ProductReviews.tsx` (no deps) → VERIFY-006
6. **Build SocialProofBadge + config** — `SocialProofBadge.tsx` + config (no deps) → VERIFY-007
7. **Build Amazon-style homepage** — all home/ components → VERIFY-008, 011
8. **Build Amazon-style search** — search bar + results page → VERIFY-009, 010
9. **Build check + TypeScript validation** → VERIFY-012
10. **Full E2E demo walkthrough** → VERIFY-013
11. **Git commit + GitHub push** — only after VERIFY-012 and VERIFY-013 both pass

Each task must include:
- Exact file paths to create or edit
- The VERIFY-XXX command to run to confirm it worked
- Rollback: if seed script fails, check for duplicate detection and re-run; if frontend fails, revert the specific file
