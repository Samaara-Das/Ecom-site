# Kuwait Marketplace - UI/UX Specification

**Version**: 1.0
**Date**: 2026-01-30
**Status**: Final
**Platform**: Next.js 15 + Medusa v2 Starter Storefront

---

## Table of Contents

1. [Design System](#1-design-system)
2. [Page Layouts](#2-page-layouts)
3. [Component Library](#3-component-library)
4. [Responsive Breakpoints](#4-responsive-breakpoints)
5. [RTL/Arabic Support](#5-rtlarabic-support)
6. [Accessibility](#6-accessibility)

---

## 1. Design System

### 1.1 Tailwind CSS Configuration

The storefront uses Tailwind CSS with the Medusa UI preset as the foundation.

**Configuration File**: `storefront/tailwind.config.js`

```javascript
module.exports = {
  darkMode: "class",
  presets: [require("@medusajs/ui-preset")],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/modules/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@medusajs/ui/dist/**/*.{js,jsx,ts,tsx}",
  ],
  // Extended configuration below
}
```

### 1.2 Color Palette

#### Grey Scale (Primary Neutral Colors)

| Token | Hex Value | Usage |
|-------|-----------|-------|
| `grey-0` | `#FFFFFF` | Background, cards |
| `grey-5` | `#F9FAFB` | Subtle background |
| `grey-10` | `#F3F4F6` | Disabled states, dividers |
| `grey-20` | `#E5E7EB` | Borders, separators |
| `grey-30` | `#D1D5DB` | Placeholder text |
| `grey-40` | `#9CA3AF` | Muted icons |
| `grey-50` | `#6B7280` | Secondary text |
| `grey-60` | `#4B5563` | Body text |
| `grey-70` | `#374151` | Headings |
| `grey-80` | `#1F2937` | Primary text |
| `grey-90` | `#111827` | High emphasis text |

#### Medusa UI Semantic Colors

| Token | Usage |
|-------|-------|
| `ui-fg-base` | Primary foreground/text |
| `ui-fg-subtle` | Secondary text |
| `ui-fg-muted` | Tertiary/disabled text |
| `ui-fg-interactive` | Links, interactive elements |
| `ui-fg-on-color` | Text on colored backgrounds |
| `ui-bg-base` | Primary background |
| `ui-bg-subtle` | Secondary background |
| `ui-bg-field` | Form field background |
| `ui-bg-field-hover` | Form field hover state |
| `ui-border-base` | Default borders |
| `ui-border-interactive` | Interactive borders |

#### Accent Colors

| Color | Usage |
|-------|-------|
| Blue (`#3B82F6`) | Primary actions, links |
| Green (`#10B981`) | Success states, confirmations |
| Red/Rose (`#EF4444`) | Errors, required indicators |
| Yellow (`#F59E0B`) | Warnings, pending states |
| Purple (`#8B5CF6`) | Premium features |

### 1.3 Typography

#### Font Families

```css
/* Primary Font Stack (LTR) */
font-family: Inter, "Noto Sans Arabic", -apple-system, BlinkMacSystemFont,
             "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif;

/* Arabic Font Stack (RTL) */
font-family: "Noto Sans Arabic", Tahoma, Arial, sans-serif;
```

#### Type Scale

| Class | Size | Usage |
|-------|------|-------|
| `txt-compact-small` | 12px | Labels, captions |
| `txt-compact-medium` | 14px | Body text, form labels |
| `txt-compact-medium-plus` | 14px semi | Emphasized body |
| `txt-compact-large` | 16px | Large body |
| `txt-compact-xlarge-plus` | 18px semi | Brand name, navigation |
| `text-small-regular` | 14px | General text |
| `text-medium` | 16px | Default body |
| `text-base-regular` | 16px | Shipping options, pricing |
| `text-large-semi` | 18px semi | Modal titles |
| `text-xl-semi` | 20px semi | Section headers |
| `text-2xl-semi` | 24px semi | Page headers |
| `text-3xl` | 32px | Hero headings |
| `text-3xl-regular` | 32px | Step indicators |

### 1.4 Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-none` | 0px | Sharp corners |
| `rounded-soft` | 2px | Subtle rounding |
| `rounded-base` | 4px | Buttons, inputs |
| `rounded-rounded` | 8px | Cards, modals |
| `rounded-large` | 16px | Large containers |
| `rounded-circle` | 9999px | Avatars, badges |

### 1.5 Spacing System

Tailwind's default spacing scale is used:

| Token | Value | Usage |
|-------|-------|-------|
| `1` | 4px | Tight spacing |
| `2` | 8px | Compact spacing |
| `3` | 12px | Default gap |
| `4` | 16px | Standard padding |
| `6` | 24px | Section spacing |
| `8` | 32px | Large gaps |
| `12` | 48px | Section padding |
| `16` | 64px | Page sections |

### 1.6 Animations

| Animation | Duration | Easing | Usage |
|-----------|----------|--------|-------|
| `ring` | 2.2s | cubic-bezier(0.5, 0, 0.5, 1) | Loading spinner |
| `fade-in-right` | 0.3s | cubic-bezier(0.5, 0, 0.5, 1) | Slide-in content |
| `fade-in-top` | 0.2s | cubic-bezier(0.5, 0, 0.5, 1) | Dropdown appearance |
| `accordion-open` | 300ms | cubic-bezier(0.87, 0, 0.13, 1) | Expand content |
| `accordion-close` | 300ms | cubic-bezier(0.87, 0, 0.13, 1) | Collapse content |
| `enter` | 200ms | ease-out | Modal enter |
| `leave` | 150ms | ease-in | Modal exit |
| `slide-in` | 1.2s | cubic-bezier(.41,.73,.51,1.02) | Page transitions |

---

## 2. Page Layouts

### 2.1 Homepage

**Route**: `/[countryCode]/`
**Component**: `storefront/src/app/[countryCode]/(main)/page.tsx`

#### Hero Section

```
+----------------------------------------------------------+
|                                                          |
|                    [Full-Width Hero]                     |
|                      Height: 75vh                        |
|                                                          |
|     Welcome to Kuwait Marketplace                        |
|     Discover quality products from trusted vendors       |
|                                                          |
+----------------------------------------------------------+
```

**Specifications**:
- Height: 75vh (75% viewport height)
- Background: `ui-bg-subtle`
- Border: Bottom `ui-border-base`
- Content: Centered vertically and horizontally
- Typography:
  - H1: `text-3xl leading-10 text-ui-fg-base font-normal`
  - H2: `text-3xl leading-10 text-ui-fg-subtle font-normal`

#### Featured Products Section

```
+----------------------------------------------------------+
|  [Collection Title]                                       |
|  +--------+  +--------+  +--------+  +--------+          |
|  |  Img   |  |  Img   |  |  Img   |  |  Img   |          |
|  | Title  |  | Title  |  | Title  |  | Title  |          |
|  | Price  |  | Price  |  | Price  |  | Price  |          |
|  +--------+  +--------+  +--------+  +--------+          |
|                                                          |
|  [Collection Title]                                       |
|  +--------+  +--------+  +--------+  +--------+          |
|  |  ...   |  |  ...   |  |  ...   |  |  ...   |          |
|  +--------+  +--------+  +--------+  +--------+          |
+----------------------------------------------------------+
```

**Specifications**:
- Container: `py-12` (48px vertical padding)
- Product Rail: Horizontal scroll with `gap-x-6`
- Layout: Vertical stack of collection rails

### 2.2 Store/Category Page

**Route**: `/[countryCode]/store`
**Component**: `storefront/src/modules/store/templates/index.tsx`

```
+----------------------------------------------------------+
|  [Refinement List]  |  [All products]                    |
|  +--------------+   |  +--------+  +--------+  +--------+|
|  | Sort by      |   |  |  Img   |  |  Img   |  |  Img   ||
|  | - Latest     |   |  | Title  |  | Title  |  | Title  ||
|  | - Price Low  |   |  | Price  |  | Price  |  | Price  ||
|  | - Price High |   |  +--------+  +--------+  +--------+|
|  +--------------+   |  +--------+  +--------+  +--------+|
|                     |  |  ...   |  |  ...   |  |  ...   ||
|                     |  +--------+  +--------+  +--------+|
|                     |                                     |
|                     |  [Pagination]                       |
+----------------------------------------------------------+
```

**Layout Specifications**:
- Container: `content-container py-6`
- Mobile: Stack layout (`flex-col`)
- Desktop: Side-by-side (`small:flex-row small:items-start`)
- Refinement List: Left sidebar
- Product Grid: Full width main content

**Sort Options**:
- Latest Arrivals (`created_at`)
- Price: Low to High (`price_asc`)
- Price: High to Low (`price_desc`)

**Product Grid**:
- Skeleton loading state during data fetch
- Paginated results

### 2.3 Product Detail Page

**Route**: `/[countryCode]/products/[handle]`

```
+----------------------------------------------------------+
|                                                          |
|  +------------------+  +-----------------------------+   |
|  |                  |  | [Collection Link]           |   |
|  |   [Image        |  | Product Title               |   |
|  |    Gallery]     |  |                             |   |
|  |                  |  | Product description text    |   |
|  |   Aspect ratio: |  |                             |   |
|  |   29:34         |  | +-----------------------+   |   |
|  |                  |  | | Size: S M L XL       |   |   |
|  |                  |  | +-----------------------+   |   |
|  |                  |  | | Color: Red Blue      |   |   |
|  |                  |  | +-----------------------+   |   |
|  |                  |  |                             |   |
|  |                  |  | Price: KWD 25.00           |   |
|  |                  |  |                             |   |
|  |                  |  | [Add to Cart Button]       |   |
|  +------------------+  +-----------------------------+   |
|                                                          |
+----------------------------------------------------------+
```

**Image Gallery Specifications**:
- Aspect ratio: 29:34
- Responsive sizes: 280px (mobile) / 360px (sm) / 480px (md) / 800px (lg)
- Object fit: Cover
- Priority loading for first 3 images

**Product Info Specifications**:
- Max width: 500px on large screens
- Collection link: Muted text with hover state
- Title: `text-3xl leading-10 text-ui-fg-base`
- Description: `text-medium text-ui-fg-subtle whitespace-pre-line`

**Product Actions**:
- Option selects for variants (size, color, etc.)
- Price display with sale price support
- Add to Cart button: Full width, primary variant
- Mobile Actions: Fixed bottom bar when main actions scroll out of view

### 2.4 Cart Page

**Route**: `/[countryCode]/cart`
**Component**: `storefront/src/modules/cart/templates/index.tsx`

```
+----------------------------------------------------------+
|                                                          |
|  +--------------------------------+  +----------------+  |
|  | [Sign In Prompt - if guest]   |  |                |  |
|  |-------------------------------|  | Order Summary  |  |
|  | Vendor A                      |  |                |  |
|  | +---+ Product Name    $XX.XX  |  | Subtotal: $XX  |  |
|  | |Img| Variant: Size M         |  | Shipping: $XX  |  |
|  | +---+ Qty: [1] [-] [+] [X]    |  | Tax: $XX       |  |
|  |-------------------------------|  |                |  |
|  | Vendor B                      |  | Total: $XX     |  |
|  | +---+ Product Name    $XX.XX  |  |                |  |
|  | |Img| Variant: Color Red      |  | [Checkout Btn] |  |
|  | +---+ Qty: [1] [-] [+] [X]    |  +----------------+  |
|  +--------------------------------+                      |
|                                                          |
+----------------------------------------------------------+
```

**Layout Specifications**:
- Container: `py-12 content-container`
- Mobile: Stack layout
- Desktop: 2-column grid `grid-cols-[1fr_360px] gap-x-40`
- Items grouped by vendor
- Sticky summary on right column (`sticky top-12`)

**Empty Cart State**:
- Centered message
- Link to continue shopping

### 2.5 Checkout Flow

**Route**: `/[countryCode]/checkout`
**Component**: `storefront/src/modules/checkout/templates/checkout-form/index.tsx`

#### Step Flow

```
+----------------------------------------------------------+
|                                                          |
|  +--------------------------------+  +----------------+  |
|  |                                |  |                |  |
|  | 1. Addresses                   |  | Order Summary  |  |
|  |    [Shipping Address Form]     |  |                |  |
|  |    [Billing Address Form]      |  | Item 1    $XX  |  |
|  |    [ ] Same as shipping        |  | Item 2    $XX  |  |
|  |                                |  |                |  |
|  | 2. Delivery         [Edit]     |  | Subtotal: $XX  |  |
|  |    ( ) Standard Shipping $5    |  | Shipping: $XX  |  |
|  |    ( ) Express Shipping $15    |  | Tax: $XX       |  |
|  |    ( ) Store Pickup Free       |  |                |  |
|  |                                |  | Total: $XX     |  |
|  | 3. Payment          [Edit]     |  |                |  |
|  |    ( ) Credit Card             |  | [Discount]     |  |
|  |    ( ) PayPal                  |  +----------------+  |
|  |    ( ) Cash on Delivery        |                      |
|  |                                |                      |
|  | 4. Review                      |                      |
|  |    [Place Order Button]        |                      |
|  |                                |                      |
|  +--------------------------------+                      |
|                                                          |
+----------------------------------------------------------+
```

**Step States**:
- Active: Expanded with form fields
- Completed: Collapsed with summary and Edit button
- Disabled: Greyed out, non-interactive

**Step Indicators**:
- Completed: `CheckCircleSolid` icon
- Progress managed via URL query params (`?step=delivery`)

**Form Layout**:
- Grid: `w-full grid grid-cols-1 gap-y-8`
- Each step is a separate component

### 2.6 Account Pages

**Route**: `/[countryCode]/account`
**Layout**: `storefront/src/modules/account/templates/account-layout.tsx`

```
+----------------------------------------------------------+
|                                                          |
|  +-------------+  +----------------------------------+   |
|  | Account     |  |                                  |   |
|  |             |  | [Page Content]                   |   |
|  | - Overview  |  |                                  |   |
|  | - Profile   |  | Profile page:                    |   |
|  | - Addresses |  | - Name, Email, Phone             |   |
|  | - Orders    |  | - Edit inline                    |   |
|  |             |  |                                  |   |
|  | [Logout]    |  | Orders page:                     |   |
|  |             |  | - Order list with status         |   |
|  +-------------+  | - Order details on click         |   |
|                   |                                  |   |
|  +-------------------------------------------------+|   |
|  | Got questions?                 [Customer Service]|   |
|  +-------------------------------------------------+    |
|                                                          |
+----------------------------------------------------------+
```

**Layout Specifications**:
- Container: `content-container max-w-5xl mx-auto`
- Mobile: Stack layout with collapsible nav
- Desktop: 2-column grid `grid-cols-[240px_1fr]`
- Padding: `py-12`

**Navigation Items**:
- Overview (Dashboard)
- Profile
- Addresses
- Orders
- Logout

### 2.7 Vendor Portal

**Route**: `/[countryCode]/vendor/*`

#### Vendor Dashboard

```
+----------------------------------------------------------+
|                                                          |
|  Welcome back, [Vendor Name]                             |
|  Here's what's happening with your store today           |
|                                                          |
|  +----------+  +----------+  +----------+  +----------+  |
|  | Products |  |  Orders  |  | Revenue  |  |  Status  |  |
|  |    12    |  |    45    |  | KWD 500  |  | Verified |  |
|  +----------+  +----------+  +----------+  +----------+  |
|                                                          |
|  +---------------------------+  +--------------------+   |
|  | Recent Orders             |  | Quick Actions      |   |
|  | Order #123 - Pending      |  | + Add Product      |   |
|  | Order #122 - Shipped      |  | View All Orders    |   |
|  | Order #121 - Delivered    |  | Settings           |   |
|  +---------------------------+  +--------------------+   |
|                                                          |
|  +--------------------------------------------------+   |
|  | Tips for Success                                  |   |
|  | - Add high-quality images                         |   |
|  | - Respond to orders quickly                       |   |
|  | - Keep inventory updated                          |   |
|  +--------------------------------------------------+   |
|                                                          |
+----------------------------------------------------------+
```

**Stats Grid**:
- 4-column grid on desktop
- 2x2 grid on tablet
- Stack on mobile

**Content Grid**:
- Desktop: 3-column grid `grid-cols-1 lg:grid-cols-3`
- Recent Orders: 2 columns span
- Quick Actions: 1 column

#### Vendor Portal Pages

| Route | Purpose |
|-------|---------|
| `/vendor` | Vendor status/application |
| `/vendor/dashboard` | Main dashboard |
| `/vendor/products` | Product listing |
| `/vendor/products/new` | Create product |
| `/vendor/products/[id]` | Edit product |
| `/vendor/orders` | Order listing |
| `/vendor/orders/[id]` | Order details |
| `/vendor/settings` | Store settings |

---

## 3. Component Library

### 3.1 Navigation Components

#### Header/Nav

**File**: `storefront/src/modules/layout/templates/nav/index.tsx`

```
+----------------------------------------------------------+
| [Menu]     |     Kuwait Market     | [Locale] Account Cart|
+----------------------------------------------------------+
```

**Specifications**:
- Position: `sticky top-0 z-50`
- Height: `h-16` (64px)
- Background: `bg-white`
- Border: Bottom `border-ui-border-base`
- Brand: Uppercase, `txt-compact-xlarge-plus`

**Navigation Items**:
- Menu (hamburger/side menu trigger)
- Brand/Logo (center)
- Locale switcher (desktop only)
- Account link (desktop only)
- Cart button with count

#### Side Menu

**File**: `storefront/src/modules/layout/components/side-menu/index.tsx`

**Specifications**:
- Trigger: "Menu" text button
- Panel: Slide-in from left
- Width: `w-full` mobile / `sm:w-1/3 2xl:w-1/4` desktop
- Height: `h-[calc(100vh-1rem)]`
- Background: `bg-[rgba(3,7,18,0.5)]` with `backdrop-blur-2xl`
- Border radius: `rounded-rounded`

**Menu Items**:
- Home
- Store
- Account
- Cart

**Bottom Section**:
- Language selector
- Country/Region selector
- Copyright notice

#### Footer

**File**: `storefront/src/modules/layout/templates/footer/index.tsx`

```
+----------------------------------------------------------+
|                                                          |
| Kuwait Market                                            |
|                                                          |
| Categories       Collections      Support                |
| - Electronics    - Summer Sale    - Contact Us           |
| - Fashion        - New Arrivals   - FAQ                  |
| - Home           - Best Sellers   - Shipping Info        |
|                                    - Become a Seller     |
|                                                          |
+----------------------------------------------------------+
| (c) 2026 Kuwait Marketplace         Powered by Medusa    |
+----------------------------------------------------------+
```

**Specifications**:
- Border: Top `border-ui-border-base`
- Container: `content-container`
- Padding: `py-40` (160px)
- Grid: 2-3 columns responsive
- Categories: Dynamic from API
- Collections: Dynamic from API

### 3.2 Product Components

#### Product Card (Preview)

**File**: `storefront/src/modules/products/components/product-preview/index.tsx`

```
+------------------+
|                  |
|   [Thumbnail]    |
|                  |
+------------------+
| Title      Price |
+------------------+
```

**Specifications**:
- Container: Link wrapper with `group` class
- Thumbnail: Responsive aspect ratio
- Text: `txt-compact-medium`
- Title: `text-ui-fg-subtle`
- Price: Right-aligned

#### Product Thumbnail

**File**: `storefront/src/modules/products/components/thumbnail/index.tsx`

**Sizes**:
- `small`: 180x240
- `medium`: 290x384
- `large`: 440x585
- `full`: 100% width
- `square`: 1:1 aspect ratio

#### Product Price

**File**: `storefront/src/modules/products/components/product-preview/price.tsx`

**Specifications**:
- Original price: Line-through when on sale
- Sale price: Highlighted
- Currency formatting via locale

### 3.3 Form Components

#### Input

**File**: `storefront/src/modules/common/components/input/index.tsx`

```
+----------------------------------+
| Label                            |
| +------------------------------+ |
| | Input value                  | |
| +------------------------------+ |
+----------------------------------+
```

**Specifications**:
- Height: `h-11` (44px)
- Background: `bg-ui-bg-field`
- Border: `border-ui-border-base rounded-md`
- Hover: `hover:bg-ui-bg-field-hover`
- Focus: `focus:shadow-borders-interactive-with-active`
- Floating label pattern
- Password toggle support (eye icon)
- Required indicator: Red asterisk

#### Native Select

**File**: `storefront/src/modules/common/components/native-select/index.tsx`

**Specifications**:
- Custom dropdown arrow
- Full width
- Same styling as Input

#### Checkbox

**File**: `storefront/src/modules/common/components/checkbox/index.tsx`

**Specifications**:
- Custom styled checkbox
- Label alignment
- Checked state styling

#### Radio

**File**: `storefront/src/modules/common/components/radio/index.tsx`

**Specifications**:
- Custom radio button styling
- Used in shipping/payment selection
- Group support

#### Button

Uses `@medusajs/ui` Button component.

**Variants**:
- `primary`: Filled primary color
- `secondary`: Outlined
- `transparent`: Text only

**Sizes**:
- `small`
- `base` (default)
- `large`

**States**:
- Default
- Hover
- Disabled
- Loading (spinner)

### 3.4 Feedback Components

#### Modal

**File**: `storefront/src/modules/common/components/modal/index.tsx`

**Specifications**:
- Backdrop: `bg-opacity-75 backdrop-blur-md`
- Transition: Scale and fade
- Sizes: `small` (md), `medium` (xl), `large` (3xl)
- Close button: X icon in header

**Sub-components**:
- `Modal.Title`: Header with close button
- `Modal.Description`: Body text
- `Modal.Body`: Main content area
- `Modal.Footer`: Action buttons

#### Toast/Notifications

Uses Medusa UI toast system.

**Types**:
- Success (green)
- Error (red)
- Warning (yellow)
- Info (blue)

#### Loading Spinner

**File**: `storefront/src/modules/common/icons/spinner.tsx`

**Specifications**:
- Animation: `animate-ring`
- Color: Inherits text color
- Sizes: 16px, 20px, 24px

#### Skeleton Loaders

**Files**: `storefront/src/modules/skeletons/`

**Components**:
- `SkeletonProductGrid`: Product listing placeholder
- `SkeletonCartTotals`: Cart summary placeholder
- `SkeletonOrderSummary`: Checkout summary placeholder

---

## 4. Responsive Breakpoints

### 4.1 Custom Screen Sizes

```javascript
screens: {
  "2xsmall": "320px",   // Very small mobile
  "xsmall": "512px",    // Small mobile
  "small": "1024px",    // Tablet/small desktop
  "medium": "1280px",   // Desktop
  "large": "1440px",    // Large desktop
  "xlarge": "1680px",   // Extra large desktop
  "2xlarge": "1920px",  // Full HD+
}
```

### 4.2 Responsive Behavior

#### Mobile (< 640px)

- Single column layouts
- Full-width components
- Hamburger menu navigation
- Bottom sheet modals
- Mobile-specific actions (sticky bottom bar)
- Touch-optimized tap targets (min 44px)

#### Tablet (640px - 1024px)

- 2-column grids where applicable
- Side menu slides from left
- Some elements begin showing desktop layout
- Floating action buttons

#### Desktop (> 1024px)

- Multi-column layouts (2-3 columns)
- Side navigation visible
- Hover states enabled
- Full header navigation
- Wider content containers

### 4.3 Container Widths

```css
.content-container {
  max-width: 100rem; /* 8xl = 1600px */
  margin: 0 auto;
  padding: 0 1rem;
}
```

### 4.4 Responsive Patterns

| Pattern | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Nav | Hamburger | Hamburger | Full nav |
| Product Grid | 1 col | 2 col | 4 col |
| Cart | Stack | Stack | 2 col |
| Checkout | Stack | Stack | 2 col |
| Account | Stack | 2 col | 2 col |
| Vendor Dashboard | Stack | 2 col | 3 col |

---

## 5. RTL/Arabic Support

### 5.1 Language Configuration

**File**: `storefront/src/i18n/config.ts`

```typescript
export const locales = ['en', 'ar'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ar: 'العربية',
}

export const rtlLocales: Locale[] = ['ar']

export function isRtlLocale(locale: Locale): boolean {
  return rtlLocales.includes(locale)
}
```

### 5.2 Language Toggle

**File**: `storefront/src/modules/layout/components/language-select/index.tsx`

**Location**:
- Side menu (mobile)
- Header (desktop)

**Features**:
- Dropdown with flag icons
- Current language indicator
- Immediate page refresh on change

### 5.3 RTL Layout Adjustments

#### CSS Approach

```css
/* Applied when locale is Arabic */
html[dir="rtl"] {
  direction: rtl;
  text-align: right;
}
```

#### Component Considerations

| Component | LTR | RTL |
|-----------|-----|-----|
| Side Menu | Slides from left | Slides from right |
| Chevrons | Points right | Points left |
| Text alignment | Left | Right |
| Flex direction | row | row-reverse |
| Margins/Padding | Standard | Mirrored |
| Icons | Standard | Mirrored where needed |

#### Font Stack for Arabic

```css
.font-arabic {
  font-family: "Noto Sans Arabic", Tahoma, Arial, sans-serif;
}
```

### 5.4 Bidirectional Text Handling

- Product titles: Natural text direction
- Prices: LTR numbers even in RTL context
- Mixed content: `dir="auto"` attribute
- Currency symbols: Position adjusts for locale

---

## 6. Accessibility

### 6.1 ARIA Labels

#### Navigation

```jsx
// Main navigation
<nav aria-label="Main navigation">

// Side menu
<Popover.Button aria-label="Open menu">

// Cart button
<button aria-label="View cart with {count} items">
```

#### Forms

```jsx
// Input fields
<input
  aria-label="Email address"
  aria-required="true"
  aria-invalid={hasError}
  aria-describedby="email-error"
/>

// Error messages
<span id="email-error" role="alert">
  Please enter a valid email
</span>
```

#### Interactive Elements

```jsx
// Modals
<Dialog aria-labelledby="modal-title" aria-describedby="modal-description">

// Loading states
<div aria-live="polite" aria-busy="true">
  Loading...
</div>

// Notifications
<div role="alert" aria-live="assertive">
  Item added to cart
</div>
```

### 6.2 Keyboard Navigation

#### Focus Management

| Element | Focus Style |
|---------|-------------|
| Buttons | `focus:outline-none focus:ring-2 focus:ring-offset-2` |
| Links | `focus:text-ui-fg-base focus:underline` |
| Inputs | `focus:shadow-borders-interactive-with-active` |
| Cards | `focus-within:ring-2` |

#### Tab Order

1. Skip to main content link
2. Header navigation (logo, links, cart)
3. Main content
4. Footer links

#### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Tab` | Move forward through focusable elements |
| `Shift+Tab` | Move backward through focusable elements |
| `Enter/Space` | Activate buttons/links |
| `Escape` | Close modals/dropdowns |
| `Arrow keys` | Navigate within radio groups/dropdowns |

### 6.3 Screen Reader Support

#### Semantic HTML

```jsx
// Page structure
<header role="banner">
<main role="main">
<footer role="contentinfo">

// Navigation
<nav role="navigation" aria-label="Primary">

// Regions
<aside role="complementary" aria-label="Cart summary">
```

#### Hidden Content

```jsx
// Visually hidden but screen reader accessible
<span className="sr-only">
  Added to cart
</span>

// Decorative images
<img alt="" aria-hidden="true" />
```

### 6.4 Color Contrast

| Element | Foreground | Background | Ratio |
|---------|------------|------------|-------|
| Body text | `grey-80` | `grey-0` | 16:1 |
| Muted text | `grey-50` | `grey-0` | 6.5:1 |
| Links | Blue-600 | `grey-0` | 4.5:1 |
| Error text | Red-600 | `grey-0` | 4.5:1 |

**Minimum Requirements**:
- Normal text: 4.5:1
- Large text (18px+): 3:1
- Interactive elements: 3:1

### 6.5 Motion Preferences

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 6.6 Touch Targets

| Element | Minimum Size |
|---------|--------------|
| Buttons | 44x44px |
| Links (inline) | 44px height |
| Checkboxes | 44x44px touch area |
| Radio buttons | 44x44px touch area |
| Dropdown items | 44px height |

---

## Appendices

### A. Icon Library

Uses `@medusajs/icons` package plus custom icons in `storefront/src/modules/common/icons/`:

| Icon | File | Usage |
|------|------|-------|
| Back | `back.tsx` | Navigation |
| ChevronDown | `chevron-down.tsx` | Dropdowns, accordions |
| Eye/EyeOff | `eye.tsx`, `eye-off.tsx` | Password toggle |
| MapPin | `map-pin.tsx` | Addresses |
| Package | `package.tsx` | Orders |
| Refresh | `refresh.tsx` | Reload actions |
| Spinner | `spinner.tsx` | Loading states |
| Trash | `trash.tsx` | Delete actions |
| User | `user.tsx` | Account |
| X | `x.tsx` | Close, dismiss |

### B. Test IDs

Components include `data-testid` attributes for E2E testing:

| Test ID | Element |
|---------|---------|
| `nav-menu-button` | Menu trigger |
| `nav-store-link` | Store link |
| `nav-account-link` | Account link |
| `nav-cart-link` | Cart link |
| `product-wrapper` | Product card |
| `product-title` | Product title |
| `add-product-button` | Add to cart |
| `cart-container` | Cart page |
| `checkout-container` | Checkout page |
| `account-page` | Account section |
| `vendor-dashboard` | Vendor dashboard |

### C. File Structure Reference

```
storefront/src/
├── app/
│   └── [countryCode]/
│       ├── (checkout)/
│       │   └── checkout/
│       └── (main)/
│           ├── account/
│           ├── cart/
│           ├── categories/
│           ├── collections/
│           ├── products/
│           ├── store/
│           └── vendor/
├── modules/
│   ├── account/
│   ├── cart/
│   ├── checkout/
│   ├── collections/
│   ├── common/
│   │   ├── components/
│   │   └── icons/
│   ├── home/
│   ├── layout/
│   │   ├── components/
│   │   └── templates/
│   ├── order/
│   ├── products/
│   ├── skeletons/
│   ├── store/
│   └── vendor/
├── i18n/
├── lib/
└── styles/
```

---

## 7. Static Info Pages

Added 2026-02-22. All pages use the dark storefront theme (`bg-[#131921] text-white`) with `max-w-4xl mx-auto px-4 py-12` content container.

| Route | File | Type | Description |
|-------|------|------|-------------|
| `/[countryCode]/contact` | `app/[countryCode]/(main)/contact/page.tsx` | `"use client"` | Two-column: contact info card + send-message form with success state |
| `/[countryCode]/faq` | `app/[countryCode]/(main)/faq/page.tsx` | `"use client"` | Accordion with 10 Q&As (orders, payments, returns, shipping, vendor topics) |
| `/[countryCode]/shipping` | `app/[countryCode]/(main)/shipping/page.tsx` | Server component | Fee cards + 6-governorate delivery zones table + tracking steps |
| `/[countryCode]/customer-service` | `app/[countryCode]/(main)/customer-service/page.tsx` | Server component | Hub with stats bar + 4 service cards linking to FAQ/Contact/Shipping/Returns |

### Contact Form Pattern

The contact form (`contact/page.tsx`) uses local `useState` for sent state — no backend call is made. On submit it shows a success screen. This pattern avoids needing a backend email endpoint.

---

## 8. Store Filter Components

Added 2026-02-22. Located at `storefront/src/modules/store/components/refinement-list/`.

All three filters use the existing `FilterRadioGroup` component and set URL search params via `setQueryParams` / `setMultipleQueryParams` from `RefinementList`.

### CategoryFilter

**File**: `refinement-list/category-filter/index.tsx`

Options: All Categories, Electronics, Fashion, Health & Beauty, Food & Grocery, Home & Kitchen, Sports, Kids & Toys

Matches against `product.metadata?.category` (case-insensitive). Selecting a category sets the `category` URL param.

### PriceFilter

**File**: `refinement-list/price-filter/index.tsx`

Options: Any Price, Under KWD 10, KWD 10–50, KWD 50–150, KWD 150–500, Over KWD 500

Encodes min/max as a single `"min:max"` string (e.g. `"10:50"`), then splits on decode and sets both `minPrice` and `maxPrice` URL params in a single `router.push` via `setMultipleQueryParams`.

### RatingFilter

**File**: `refinement-list/rating-filter/index.tsx`

Options: Any Rating, 4★ & Up, 3★ & Up. Sets `rating` URL param. Filtered against `SOCIAL_PROOF_CONFIG[handle].rating`.

### Filter Combining

Filters use AND logic — all active filters must pass for a product to appear. When any filter is active, a "✕ Clear all filters" button appears at the top of `RefinementList`. The URL is shareable/bookmarkable with all filter state preserved.

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-30 | System | Initial specification |
| 1.1 | 2026-02-22 | System | Add static info pages (§7) and store filter components (§8) |

---

*This document serves as the authoritative reference for UI/UX implementation of the Kuwait Marketplace storefront.*
