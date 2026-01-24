# PRD: Kuwait Multi-Vendor Ecommerce Marketplace

## 1. Overview

- **Version**: 1.0
- **Date**: 2026-01-24
- **Author**: Product Team
- **Status**: Draft
- **Platform**: Medusa v2

### Problem Statement

The Kuwait ecommerce market is growing rapidly, but local vendors lack a unified platform to reach customers effectively. Existing solutions are either too expensive for small vendors, lack Arabic language support, or don't cater to Kuwait-specific payment and delivery preferences.

This marketplace aims to provide a comprehensive multi-vendor platform that enables local and international sellers to reach Kuwaiti consumers through a modern, bilingual (English/Arabic) shopping experience. The platform will support both physical and digital products, with integrated payment solutions popular in Kuwait and the GCC region.

The initial focus on Kuwait provides a strong foundation for expansion into other GCC countries and international markets, leveraging the multi-currency and multi-language architecture from day one.

### Target Users

1. **Shoppers (B2C)**: Kuwait residents seeking a unified marketplace for diverse products
2. **Vendors/Sellers**: Businesses wanting to sell products online without building their own infrastructure
3. **Marketplace Administrators**: Team managing the platform, vendors, and operations

---

## 2. Goals & Non-Goals

### Business Goals

- Launch MVP marketplace within 1-1.5 months
- Onboard minimum 10 vendors at launch
- Support 100+ products across multiple categories
- Enable seamless checkout with Stripe, Razorpay, and PayPal
- Provide bilingual experience (English/Arabic) from day one

### User Goals

**Shoppers:**
- Browse and purchase products from multiple vendors in one cart
- Pay using preferred payment methods (cards, PayPal)
- Track orders and manage deliveries
- Access the platform in their preferred language

**Vendors:**
- Easy onboarding with tiered verification
- Manage products, inventory, and orders independently
- View sales analytics and performance metrics
- Receive payouts on-demand or scheduled

**Administrators:**
- Approve/manage vendor applications
- Monitor marketplace health and metrics
- Configure commissions and platform rules
- Handle disputes and customer support escalations

### Non-Goals (Out of Scope for MVP)

- **Mobile native apps** - *Rationale: Web-first approach, responsive design covers mobile users*
- **AI-powered recommendations** - *Rationale: Start with advanced search, add ML later*
- **Live chat support** - *Rationale: Contact form sufficient for MVP*
- **Customer reviews/ratings** - *Rationale: Add post-MVP to reduce complexity*
- **Loyalty/rewards program** - *Rationale: Focus on core commerce first*
- **Buy Now Pay Later (BNPL)** - *Rationale: Integrate Tabby/Tamara post-MVP*
- **KNET integration** - *Rationale: Stripe/Razorpay cover card payments; add KNET in Phase 2*

---

## 3. User Personas

### Key User Types

| Persona | Description | Technical Level |
|---------|-------------|-----------------|
| **Fatima (Shopper)** | 28, Kuwait City resident, shops online frequently, prefers Arabic interface, uses mobile browser | Low |
| **Ahmed (Vendor)** | 35, small business owner selling electronics, wants online presence without technical overhead | Medium |
| **Sara (Power Vendor)** | 40, runs fashion boutique with 500+ products, needs bulk operations and analytics | Medium-High |
| **Omar (Admin)** | 30, marketplace operations manager, handles vendor approvals and platform configuration | High |

### Role-Based Access

| Role | Permissions | Key Actions |
|------|-------------|-------------|
| Guest | Browse, search, view products | Add to cart, view prices |
| Customer | All guest + account features | Checkout, order history, saved addresses |
| Vendor | Product/inventory management | CRUD products, manage orders, view analytics |
| Admin | Full platform access | Vendor management, settings, reports |
| Super Admin | Admin + system configuration | Payment config, commission rules |

---

## 4. User Stories

### Customer Stories

#### US-001: Browse Products
- **As a** shopper
- **I want** to browse products by category and filter by price, vendor, and attributes
- **So that** I can find products that match my needs

**Acceptance Criteria:**
- [ ] Products display with images, title, price, and vendor name
- [ ] Filters available: category, price range, vendor, availability
- [ ] Sort options: price (low/high), newest, popularity
- [ ] Pagination or infinite scroll for large result sets
- [ ] Arabic/English language toggle persists across sessions

#### US-002: Search Products
- **As a** shopper
- **I want** to search for products using keywords with autocomplete
- **So that** I can quickly find specific items

**Acceptance Criteria:**
- [ ] Search bar with autocomplete suggestions
- [ ] Search works in both English and Arabic
- [ ] Results show relevance scoring
- [ ] "No results" state with suggestions
- [ ] Search history saved for logged-in users

#### US-003: Add to Cart (Multi-Vendor)
- **As a** shopper
- **I want** to add products from multiple vendors to a single cart
- **So that** I can checkout once for all my purchases

**Acceptance Criteria:**
- [ ] Cart groups items by vendor
- [ ] Each vendor group shows subtotal
- [ ] Shipping calculated per vendor (if applicable)
- [ ] Cart persists for guest users (local storage)
- [ ] Cart merges when guest logs in

#### US-004: Checkout and Payment
- **As a** shopper
- **I want** to complete checkout with my preferred payment method
- **So that** I can receive my purchased items

**Acceptance Criteria:**
- [ ] Guest checkout supported (email required)
- [ ] Saved addresses for logged-in users
- [ ] Payment options: Stripe (cards), Razorpay, PayPal
- [ ] Order confirmation email sent
- [ ] Order confirmation page with order number

#### US-005: Track Orders
- **As a** customer
- **I want** to view my order history and track shipments
- **So that** I know when my items will arrive

**Acceptance Criteria:**
- [ ] Order list with status indicators
- [ ] Order detail page with item breakdown
- [ ] Tracking number linked (when available)
- [ ] Status updates: Pending, Processing, Shipped, Delivered

#### US-006: Customer Registration & Login
- **As a** visitor
- **I want** to create an account or login using email, social, or phone OTP
- **So that** I can save my preferences and order history

**Acceptance Criteria:**
- [ ] Email/password registration with verification
- [ ] Social login: Google, Apple, Facebook
- [ ] Phone OTP login (SMS verification)
- [ ] Password reset via email
- [ ] Account profile management

### Vendor Stories

#### US-007: Vendor Registration
- **As a** potential vendor
- **I want** to apply to sell on the marketplace
- **So that** I can reach more customers

**Acceptance Criteria:**
- [ ] Registration form: business name, contact, category
- [ ] Document upload for verification (optional for basic tier)
- [ ] Application status tracking
- [ ] Email notification on approval/rejection
- [ ] Tiered verification levels (Basic, Verified, Premium)

#### US-008: Product Management
- **As a** vendor
- **I want** to add, edit, and manage my products
- **So that** customers can purchase from me

**Acceptance Criteria:**
- [ ] Product creation with title, description, images, price
- [ ] Variant support (size, color, etc.)
- [ ] Category assignment (predefined marketplace categories)
- [ ] Inventory tracking with stock alerts
- [ ] Bulk import via CSV
- [ ] Digital product support (file upload, download limits)

#### US-009: Order Management
- **As a** vendor
- **I want** to view and process orders for my products
- **So that** customers receive their purchases

**Acceptance Criteria:**
- [ ] Order list filtered to vendor's products
- [ ] Order status updates (Processing, Shipped, Delivered)
- [ ] Shipping label generation / tracking number entry
- [ ] Customer notification on status change
- [ ] Order notes and internal comments

#### US-010: Vendor Dashboard & Analytics
- **As a** vendor
- **I want** to view my sales performance and analytics
- **So that** I can make informed business decisions

**Acceptance Criteria:**
- [ ] Dashboard: total sales, orders, revenue
- [ ] Time period filters (today, week, month, custom)
- [ ] Top selling products
- [ ] Order status breakdown
- [ ] Export reports (CSV)

#### US-011: Payout Management
- **As a** vendor
- **I want** to view my earnings and request payouts
- **So that** I receive payment for my sales

**Acceptance Criteria:**
- [ ] Earnings balance display (available, pending, paid)
- [ ] Payout request (on-demand)
- [ ] Scheduled payout settings (weekly/monthly)
- [ ] Payout history with status
- [ ] Bank account / payment details management

### Admin Stories

#### US-012: Vendor Approval Workflow
- **As an** admin
- **I want** to review and approve vendor applications
- **So that** only qualified sellers join the marketplace

**Acceptance Criteria:**
- [ ] Application queue with filters
- [ ] Vendor profile review (documents, business info)
- [ ] Approve / Reject with reason
- [ ] Request additional information
- [ ] Tier assignment (Basic, Verified, Premium)

#### US-013: Marketplace Configuration
- **As an** admin
- **I want** to configure marketplace settings
- **So that** the platform operates according to business rules

**Acceptance Criteria:**
- [ ] Commission rate configuration (global, per-category, per-vendor)
- [ ] Payment provider settings
- [ ] Shipping zone configuration
- [ ] Category management
- [ ] Tax settings

#### US-014: Admin Analytics Dashboard
- **As an** admin
- **I want** to view marketplace-wide analytics
- **So that** I can monitor platform health

**Acceptance Criteria:**
- [ ] GMV (Gross Merchandise Value) metrics
- [ ] Order volume and trends
- [ ] Vendor performance rankings
- [ ] Customer acquisition metrics
- [ ] Revenue and commission reports

---

## 5. Feature Prioritization (MoSCoW)

### Must Have (MVP Critical)

| ID | Feature | Description | Acceptance Criteria |
|----|---------|-------------|---------------------|
| FR-001 | Product Catalog | Browse/search products with filters | Products display with images, prices, vendor info |
| FR-002 | Multi-Vendor Cart | Add items from multiple vendors | Cart groups by vendor, calculates totals |
| FR-003 | Checkout Flow | Guest and customer checkout | Shipping address, payment selection, confirmation |
| FR-004 | Payment Integration | Stripe, Razorpay, PayPal | Successful payment creates order |
| FR-005 | Customer Auth | Email, Social, Phone OTP login | Users can register and authenticate |
| FR-006 | Vendor Portal | Product/order management for vendors | Vendors manage their catalog and orders |
| FR-007 | Vendor Registration | Application and approval workflow | Vendors apply, admins approve |
| FR-008 | Admin Dashboard | Basic marketplace management | Vendor approvals, order oversight |
| FR-009 | Bilingual Support | English and Arabic UI | Language toggle, RTL layout for Arabic |
| FR-010 | Multi-Currency | KWD, USD, EUR, GBP support | Prices display in selected currency |
| FR-011 | Order Management | Order lifecycle management | Create, process, ship, deliver orders |
| FR-012 | Inventory Management | Stock tracking per product/variant | Stock levels, low stock alerts |
| FR-013 | Advanced Search | Algolia/Meilisearch integration | Autocomplete, faceted search, relevance |
| FR-014 | Email Notifications | Transactional emails | Order confirmation, shipping updates |
| FR-015 | SMS Notifications | Critical updates via SMS | Order confirmation, delivery updates |

### Should Have (Post-MVP Phase 2)

| ID | Feature | Description | Acceptance Criteria |
|----|---------|-------------|---------------------|
| FR-016 | KNET Payment | Kuwait's local debit network | KNET payment option at checkout |
| FR-017 | Product Reviews | Customer ratings and reviews | Star ratings, written reviews, verified purchase badge |
| FR-018 | Vendor Reviews | Rate sellers | Vendor rating, trust indicators |
| FR-019 | Promotions Engine | Coupons, discounts, sales | Create/manage promotional campaigns |
| FR-020 | Wishlist | Save products for later | Add/remove from wishlist, share |
| FR-021 | Compare Products | Side-by-side comparison | Compare up to 4 products |
| FR-022 | Shipping Integration | Aramex, DHL API integration | Real-time rates, label generation |
| FR-023 | Returns Management | Return/refund workflow | Request return, process refund |

### Could Have (Phase 3)

| ID | Feature | Description | Acceptance Criteria |
|----|---------|-------------|---------------------|
| FR-024 | BNPL Integration | Tabby/Tamara | Buy now pay later at checkout |
| FR-025 | Live Chat Support | Intercom/Zendesk integration | Real-time customer support |
| FR-026 | Loyalty Program | Points and rewards | Earn/redeem points |
| FR-027 | Seller Badges | Trust indicators | Verified, top seller badges |
| FR-028 | WhatsApp Notifications | Order updates via WhatsApp | WhatsApp Business API integration |
| FR-029 | Advanced Analytics | GA4 enhanced ecommerce | Full funnel tracking |

### Won't Have (Out of Scope)

- **Native mobile apps** - *Web responsive sufficient for MVP*
- **AI recommendations** - *Future enhancement*
- **Subscription products** - *Not required for initial launch*
- **B2B pricing** - *Focus on B2C first*
- **Auction/bidding** - *Standard ecommerce model only*

---

## 6. User Experience

### Entry Points & First-Time Flow

1. **Homepage**: Featured products, categories, search bar, language toggle
2. **Category Browse**: Navigate via mega-menu or category cards
3. **Search**: Autocomplete search with instant results
4. **Guest Flow**: Browse → Add to Cart → Checkout (email required)
5. **Registration Prompt**: Shown after checkout or when accessing account features

### Core Shopping Experience

| Step | Action | System Response | Success State |
|------|--------|-----------------|---------------|
| 1 | User lands on homepage | Display featured products, categories | Page loads < 2s |
| 2 | User searches/browses | Show filtered results | Results display with pagination |
| 3 | User clicks product | Show product detail page | Images, variants, pricing visible |
| 4 | User adds to cart | Update cart icon, show mini-cart | Item added confirmation |
| 5 | User proceeds to checkout | Show checkout form | Address and payment forms |
| 6 | User completes payment | Process payment, create order | Confirmation page + email |

### Vendor Experience

| Step | Action | System Response | Success State |
|------|--------|-----------------|---------------|
| 1 | Vendor applies | Submit registration form | Application confirmation |
| 2 | Admin approves | Vendor notified, access granted | Vendor portal accessible |
| 3 | Vendor adds products | Product creation form | Product live on storefront |
| 4 | Order received | Notification to vendor | Order in vendor dashboard |
| 5 | Vendor ships | Update status, add tracking | Customer notified |
| 6 | Vendor requests payout | Payout initiated | Funds transferred |

### Edge Cases & Error States

- **Out of stock during checkout**: Remove item, notify user, offer alternatives
- **Payment failure**: Clear error message, retry option, alternative payment suggestion
- **Session timeout**: Preserve cart, prompt re-authentication
- **Vendor unavailable**: Products marked unavailable, existing orders still processed
- **Price change**: Show updated price before payment confirmation
- **Currency mismatch**: Auto-convert to cart currency with notice

### Pages & Screens

| Page | Purpose | Key Components |
|------|---------|----------------|
| Homepage | Discovery and navigation | Hero banner, featured products, categories, search |
| Category Page | Browse products by category | Product grid, filters sidebar, sort options |
| Search Results | Display search matches | Results grid, faceted filters, autocomplete |
| Product Detail | View product information | Images, variants, price, add to cart, vendor info |
| Cart | Review items before checkout | Item list by vendor, quantities, subtotals |
| Checkout | Complete purchase | Address form, shipping options, payment |
| Order Confirmation | Confirm successful order | Order number, summary, tracking info |
| Account Dashboard | Customer account management | Orders, addresses, profile settings |
| Vendor Dashboard | Vendor management hub | Stats, orders, products, payouts |
| Admin Dashboard | Platform management | Vendors, orders, analytics, settings |

---

## 7. Technical Considerations

### Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Backend | Medusa v2 | Headless commerce, modular, extensible |
| Frontend | Next.js 14+ | SSR/SSG, SEO, React ecosystem |
| Database | PostgreSQL | Medusa default, reliable, scalable |
| Cache/Queue | Redis | Sessions, caching, background jobs |
| Search | Meilisearch/Algolia | Fast, typo-tolerant, faceted search |
| File Storage | AWS S3 / Cloudflare R2 | Product images, digital downloads |
| Email | SendGrid | Transactional emails, templates |
| SMS | Twilio / MSG91 | OTP and notifications |
| CDN | Cloudflare / Vercel Edge | Global asset delivery |

### Integration Points

| Integration | Purpose | Priority |
|-------------|---------|----------|
| Stripe | Card payments | MVP |
| Razorpay | Card payments (backup) | MVP |
| PayPal | Alternative payment | MVP |
| SendGrid | Email notifications | MVP |
| Twilio/MSG91 | SMS notifications | MVP |
| Meilisearch | Search engine | MVP |
| Google Analytics 4 | Analytics | MVP |
| Aramex API | Shipping (Kuwait/GCC) | Phase 2 |
| DHL API | International shipping | Phase 2 |
| KNET | Local debit payment | Phase 2 |

### Data Storage & Privacy

**Customer Data:**
- Personal information (name, email, phone, addresses)
- Order history and preferences
- Authentication credentials (hashed)

**Vendor Data:**
- Business information and documents
- Product catalog and inventory
- Sales and payout records

**Privacy Considerations:**
- Data encrypted at rest and in transit (TLS 1.3)
- Kuwait data residency compliance
- GDPR-ready architecture for EU expansion
- Clear privacy policy and consent management
- Right to deletion (account closure)

**Retention Requirements:**
- Order data: 7 years (legal/tax compliance)
- Customer accounts: Until deletion requested
- Audit logs: 2 years

### Performance Requirements

| Metric | Target | Measurement |
|--------|--------|-------------|
| Page Load (LCP) | < 2.5s | Core Web Vitals |
| Time to Interactive | < 3s | Lighthouse |
| API Response (p95) | < 200ms | APM monitoring |
| Search Response | < 100ms | Search provider metrics |
| Checkout Completion | < 5s total | End-to-end timing |
| Uptime | 99.9% | Monitoring alerts |

### Potential Challenges

1. **RTL Layout Complexity**: Arabic requires right-to-left layouts, careful CSS handling
2. **Multi-Currency Pricing**: Real-time conversion vs. fixed prices per currency
3. **Multi-Vendor Order Splitting**: Orders span vendors, fulfillment coordination
4. **Search in Arabic**: Proper tokenization and relevance for Arabic text
5. **Payment Provider Availability**: Stripe/PayPal restrictions in some regions
6. **Vendor Payout Automation**: Banking integration complexity in Kuwait

---

## 8. Success Metrics

### User-Centric Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Conversion Rate | > 2% | Orders / Visitors |
| Cart Abandonment | < 70% | Abandoned carts / Total carts |
| Customer Retention | > 30% | Repeat customers in 90 days |
| NPS Score | > 40 | Customer surveys |
| Vendor Satisfaction | > 80% | Vendor surveys |

### Business Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| GMV (Month 1) | $10,000+ | Total order value |
| Active Vendors | 10+ | Vendors with 1+ sale |
| Product Listings | 100+ | Active products |
| Orders per Day | 10+ | Daily order count |
| Average Order Value | $50+ | GMV / Orders |

### Technical Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| API Availability | 99.9% | Uptime monitoring |
| Error Rate | < 0.1% | Error logs / Total requests |
| Page Performance | LCP < 2.5s | Real User Monitoring |
| Search Latency (p95) | < 100ms | Search analytics |

---

## 9. Milestones

### MVP Scope (Phase 1 - 1.5 months)

Based on Must Have requirements:
- Product catalog with search and filters
- Multi-vendor cart and checkout
- Stripe, Razorpay, PayPal payments
- Customer authentication (email, social, OTP)
- Vendor portal (products, orders)
- Admin dashboard (vendor approval, basic management)
- Bilingual support (EN/AR)
- Multi-currency (KWD, USD, EUR, GBP)
- Email + SMS notifications
- Advanced search (Meilisearch)

### Phase 1: MVP

**Complexity**: Large

**Week 1-2: Foundation**
- [ ] Medusa v2 project setup
- [ ] PostgreSQL + Redis configuration
- [ ] Next.js storefront scaffolding
- [ ] Basic authentication (email/password)
- [ ] Product module setup

**Week 3-4: Core Commerce**
- [ ] Product catalog with variants
- [ ] Category management
- [ ] Cart functionality (multi-vendor)
- [ ] Checkout flow
- [ ] Payment integration (Stripe first)

**Week 5: Vendor & Admin**
- [ ] Vendor registration/approval workflow
- [ ] Vendor product management
- [ ] Vendor order management
- [ ] Admin dashboard basics
- [ ] Razorpay + PayPal integration

**Week 6: Polish & Launch**
- [ ] Bilingual support (EN/AR, RTL)
- [ ] Multi-currency display
- [ ] Meilisearch integration
- [ ] Email + SMS notifications
- [ ] Performance optimization
- [ ] Security audit
- [ ] Staging deployment
- [ ] Production deployment

### Phase 2: Enhancement (Post-MVP)

**Complexity**: Medium

- [ ] KNET payment integration
- [ ] Product reviews and ratings
- [ ] Vendor reviews
- [ ] Promotions/coupons engine
- [ ] Wishlist functionality
- [ ] Shipping provider integration (Aramex, DHL)
- [ ] Returns management
- [ ] Enhanced vendor analytics

### Phase 3: Growth (Future)

**Complexity**: Medium-Large

- [ ] BNPL integration (Tabby/Tamara)
- [ ] Live chat support
- [ ] Loyalty program
- [ ] WhatsApp notifications
- [ ] Advanced analytics
- [ ] GCC market expansion
- [ ] International expansion features

---

## 10. Open Questions

- [ ] **Brand Name**: What is the marketplace name? (Needed for domain, branding)
- [ ] **Commission Structure**: What percentage commission per category/vendor tier?
- [ ] **Payout Schedule**: Default payout frequency (weekly/bi-weekly/monthly)?
- [ ] **Minimum Payout**: Minimum balance required for vendor payout?
- [ ] **Verification Documents**: What documents required for vendor verification?
- [ ] **Shipping Zones**: Which countries for international shipping in MVP?
- [ ] **Tax Configuration**: VAT rates for Kuwait (5% standard)?
- [ ] **Currency Conversion**: Real-time rates or fixed exchange rates?
- [ ] **SMS Provider**: Twilio vs MSG91 vs local Kuwaiti provider?
- [ ] **Hosting Region**: AWS/GCP region for Kuwait (me-south-1 Bahrain)?

---

## 11. Compliance & Legal

### Kuwait Ecommerce Regulations

- **Commercial Registration**: Vendors must provide CR number
- **Consumer Protection**: Clear return/refund policies required
- **Data Protection**: Kuwait Law No. 20 of 2014 on electronic transactions
- **VAT**: 5% VAT on goods and services (effective 2024)
- **Payment Security**: PCI DSS compliance for payment processing

### Platform Requirements

- [ ] Terms of Service for customers
- [ ] Terms of Service for vendors
- [ ] Privacy Policy (GDPR-ready)
- [ ] Cookie Policy
- [ ] Refund/Return Policy
- [ ] Vendor Agreement template
- [ ] PCI DSS compliance (via payment providers)

### Future Compliance (GCC Expansion)

- UAE: Federal Law No. 15 of 2020 on Consumer Protection
- Saudi Arabia: E-Commerce Law 2019
- Bahrain: Personal Data Protection Law 2018

---

## 12. Appendix

### A. Medusa v2 Commerce Modules Used

| Module | Usage |
|--------|-------|
| Product | Product catalog, variants, categories, collections |
| Cart | Shopping cart, line items, multi-vendor |
| Order | Order lifecycle, fulfillment tracking |
| Customer | Customer accounts, addresses, groups |
| Payment | Stripe, Razorpay, PayPal integration |
| Pricing | Multi-currency, price lists, sales |
| Inventory | Stock tracking, reservations |
| Fulfillment | Shipping options, zones, providers |
| Region | Kuwait, international regions, currencies |
| Sales Channel | Web storefront channel |
| Tax | Kuwait VAT configuration |
| Notification | Email (SendGrid), SMS (Twilio) |
| File | S3 storage for images/files |

### B. Custom Modules Required

| Module | Purpose |
|--------|---------|
| Vendor | Vendor registration, profiles, verification |
| Marketplace | Commission calculation, vendor payouts |
| Search | Meilisearch integration |
| Analytics | Vendor/admin dashboards |

### C. Shipping Recommendations for Kuwait

**Local Delivery (Kuwait):**
- Aramex (primary) - strong local presence
- Fetchr - last-mile delivery
- Manual/self-delivery option for vendors

**GCC Shipping:**
- Aramex - regional coverage
- SMSA Express - Saudi/GCC

**International:**
- DHL Express - global coverage
- FedEx - alternative international

### D. Wireframe References

*(To be added: Link to Figma/design files)*

### E. API Documentation

*(To be generated: OpenAPI spec from Medusa)*
