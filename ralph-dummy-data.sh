#!/usr/bin/env bash

# =========================================================
# Ralph Wiggum — Kuwait Marketplace Demo Data + Amazon UX
# =========================================================
# Usage: ./ralph-dummy-data.sh [max_iterations]
# =========================================================

MAX_ITERATIONS=${1:-20}
DONE_SIGNAL="RALPH_ALL_DONE"
LOG_DIR="ralph_dummy_logs"
ITERATION=1

mkdir -p "$LOG_DIR"
mkdir -p "demo-screenshots"

echo "==========================================================="
echo " Ralph Wiggum — Kuwait Marketplace Demo Data + Amazon UX"
echo " Max iterations : $MAX_ITERATIONS"
echo " PRD            : PRD-dummy-data.md"
echo " Logs           : $LOG_DIR/"
echo " Screenshots    : demo-screenshots/"
echo "==========================================================="
echo ""
echo " Make sure Docker + backend are running first:"
echo "   docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d db redis"
echo "   cd backend && npm run dev   (separate terminal)"
echo "==========================================================="
echo ""
sleep 2

while [ $ITERATION -le $MAX_ITERATIONS ]; do
    LOG_FILE="$LOG_DIR/iteration-$ITERATION.log"
    START_TIME=$(date +%s)

    echo ""
    echo "==========================================================="
    echo " ITERATION $ITERATION/$MAX_ITERATIONS — $(date '+%H:%M:%S')"
    echo "==========================================================="

    # Use a heredoc so the prompt needs zero escaping — no quote-inside-quote issues
    RALPH_PROMPT=$(cat <<'RALPH_PROMPT_EOF'
You are Ralph, an autonomous coding agent for the Kuwait Marketplace — a Medusa v2 multi-vendor e-commerce platform built with Next.js 15.

Print "RALPH: <status>" before every major step so progress is visible in the terminal.

=== STEP 1: LOAD CONTEXT ===
Print: "RALPH: Loading project context..."

Key facts:
- Working dir: C:/Users/dassa/Work/Ecom Site for Bharat
- Backend: ./backend/  (Medusa v2, TypeScript, port 9000)
- Storefront: ./storefront/  (Next.js 15, TypeScript, port 8000)
- Seed scripts run with: cd backend && npx medusa exec ./src/scripts/<file>.ts
- Currency: KWD only — amounts in fils (1 KWD = 1000 fils, so 285 KWD = 285000 in DB)
- Locale: /kw prefix on all storefront routes
- Custom vendor module: ./backend/src/modules/vendor/
- GitHub CLI: always use "gh" not raw git remote calls
- Branch: feature/medusa-starter-storefront

Read these files for context:
1. .claude/task-context.md  — prior session notes
2. PRD-dummy-data.md        — full feature spec + all 13 verification methods (VERIFY-001 to VERIFY-013)
3. backend/src/scripts/seed-products.ts  — the pattern to follow for all seed scripts
4. backend/src/scripts/seed-vendors.ts   — vendor seeding pattern

=== STEP 2: LOAD SKILLS ===
Print: "RALPH: Loading Medusa and senior-developer skills..."

Load these skills now to get domain expertise:
/medusa
/senior-developer

Key patterns from these skills you will use:
- Seed scripts: export default async function name({ container }) — resolve services from container
- Medusa logger: container.resolve(ContainerRegistrationKeys.LOGGER)
- Medusa query: container.resolve(ContainerRegistrationKeys.QUERY)
- createProductsWorkflow from @medusajs/medusa/core-flows
- createInventoryLevelsWorkflow from @medusajs/medusa/core-flows
- Vendor service: container.resolve(VENDOR_MODULE) as VendorModuleService
- Next.js 15: use server components by default, "use client" only when needed
- Tailwind CSS only for styling — no inline styles
- TypeScript strict — always run npx tsc --noEmit after editing storefront files
- data-testid on every interactive element (for Playwright verification)

=== STEP 3: PICK ONE TASK ===
Print: "RALPH: Checking TaskList..."

Run TaskList and pick the LOWEST-ID pending task from this list:

  Task #1  — Seed 12 vendors           → backend/src/scripts/seed-vendors-v2.ts
  Task #2  — Seed 60 products           → backend/src/scripts/seed-products-v2.ts
  Task #3  — Seed 25 customers          → backend/src/scripts/seed-customers-v2.ts
  Task #4  — Seed 25 orders (4 states)  → backend/src/scripts/seed-orders-v2.ts
  Task #5  — ProductReviews component   → storefront/src/components/product/ProductReviews.tsx
  Task #6  — SocialProofBadge component → storefront/src/components/product/SocialProofBadge.tsx
  Task #7  — Amazon-style homepage      → storefront/src/app/[countryCode]/(main)/page.tsx + components/home/*
  Task #8  — Amazon-style search        → storefront/src/app/[countryCode]/(main)/search/page.tsx + components/search/*
  Task #9  — Playwright verifications   → demo-screenshots/ (13 screenshots per VERIFY-001..013)
  Task #10 — Build check + GitHub push  → npm run build must pass, then git push

Print: "RALPH: Working on Task #<N> — <title>"
Mark it in_progress: TaskUpdate taskId=<N> status=in_progress

=== STEP 4: IMPLEMENT ===

--- SEED SCRIPTS (Tasks #1-#4) ---

Follow this pattern exactly (from seed-products.ts):

  export default async function seedVendorsV2({ container }) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
    const query  = container.resolve(ContainerRegistrationKeys.QUERY)
    logger.info("Starting vendor seed v2...")
    // ... your logic
  }

CRITICAL — all seed scripts must be IDEMPOTENT:
- Vendors: before creating, check vendorService.findVendorByEmail(email) — skip if exists
- Products: check query.graph({ entity: "product", filters: { handle: handle } }) — skip if exists
- Customers: check customerModule.listCustomers({ email: email }) — skip if result length > 0
- Orders: skip customer if they already have >= 2 orders

VENDOR DATA (Task #1) — seed exactly these 12 vendors from PRD Section 3.1:
  1. TechZone Kuwait         Electronics    Kuwait City   premium    commission 10%
  2. Al-Sayer Electronics    Electronics    Salmiya       verified   commission 12%
  3. Moda Fashion Kuwait      Fashion        Hawalli       premium    commission 8%
  4. Al-Shaya Fashion         Fashion        The Avenues   verified   commission 9%
  5. Glow Beauty Kuwait       Health/Beauty  Salmiya       verified   commission 14%
  6. Oud & Rose Perfumery     Health/Beauty  Kuwait City   verified   commission 12%
  7. Tamr Dates & Specialty   Food/Grocery   Farwaniya     verified   commission 15%
  8. Kuwait Organic Market    Food/Grocery   Mishref       verified   commission 15%
  9. Hessa Home Goods         Home/Kitchen   Rumaithiya    pending    commission 16%
  10. FitLife Kuwait          Sports         Sabah Al-Salem verified  commission 13%
  11. Little Stars Kids       Kids/Toys      Salwa         pending    commission 18%
  12. AutoParts Gulf          Automotive     Fahaheel      suspended  commission 18%

Phones: +96550001001, +96550001002, etc.
Registrations: CR-KW-201, CR-KW-202, etc.

PRODUCT DATA (Task #2) — 60 products from PRD Section 3.2.
Use these Unsplash photo IDs for product images (they show the correct subject):
- Smartphones:  photo-1511707171634-5f897ff02aa9  and  photo-1592750475338-74b7b21085ab
- Laptops:      photo-1496181133206-80ce9b88a853  and  photo-1517336714731-489689fd1ca8
- Headphones:   photo-1505740420928-5e560c06d30e  and  photo-1546435770-a3e426bf472b
- Gaming:       photo-1606144042614-b2417e99c4e3  and  photo-1593305841991-05c297ba4575
- Tablets:      photo-1544244015-0df4b3ffc6b0  and  photo-1561154464-82e9adf32764
- Drone:        photo-1473968512647-3e447244af8f  and  photo-1527977966376-1c8408f9f108
- Watches:      photo-1524592094714-0f0654e359b1  and  photo-1508057198894-247b23fe5ade
- Shoes:        photo-1542291026-7eec264c27ff  and  photo-1491553895911-0055eca6402d
- Bags:         photo-1548036328-c9fa89d128fa  and  photo-1590874103328-eac38a683ce7
- Sunglasses:   photo-1572635196237-14b3f281503f  and  photo-1577803645773-f96470509666
- Fashion:      photo-1489987707025-afc232f7ea0f  and  photo-1556821840-3a63f15732ce
- Perfume:      photo-1588405748880-12d1d2a59f75  and  photo-1541643600914-78b084683702
- Skincare:     photo-1596462502278-27bfdc403348  and  photo-1571781926291-c477ebfd024b
- Makeup:       photo-1512496015851-a90fb38ba796  and  photo-1522338242992-e1a54906a8da
- Food/Dates:   photo-1609601442485-4522e0b06d7d  and  photo-1558618666-fcd25c85cd64
- Honey:        photo-1587049352846-4a222e784d38  and  photo-1558642891-54be180ea339
- Coffee:       photo-1447933601403-0c6688de566e  and  photo-1495474472287-4d71bcdd2085
- Rice/Grain:   photo-1516684732162-798a0062be99  and  photo-1586201375761-83865001e31c
- Fitness:      photo-1571019613454-1cb2f99b2d8b  and  photo-1534438327276-14e5300c3a48
- Yoga:         photo-1544367567-0f2fcb009e0b  and  photo-1506126613408-eca07ce68773
- Kitchen:      photo-1556909114-f6e7ad7d3136  and  photo-1565538810643-b5bdb6cc3f34
- TV:           photo-1593359677879-a4bb92f4834c  and  photo-1593642632559-0c6d3fc62b89

Image URL format: https://images.unsplash.com/photo-{ID}?w=600&h=600&fit=crop&auto=format
Fallback: https://picsum.photos/seed/{product-handle}/600/600

KWD pricing — always in fils: 285 KWD = 285000, 10 KWD = 10000, 5.5 KWD = 5500

CUSTOMER DATA (Task #3) — all 25 customers from PRD Section 3.3.
Password for ALL customers: Demo1234!
Use Medusa customer module: container.resolve(Modules.CUSTOMER) or similar

ORDER DATA (Task #4) — 25 orders, states: 12 completed, 6 processing, 4 pending, 3 cancelled.
Spread created_at over past 90 days (use Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
Each order: 1-4 line items from different products, realistic KWD totals

--- STOREFRONT COMPONENTS (Tasks #5-#8) ---

Before writing any component: read 2 existing components for patterns.
Read: storefront/src/modules/products/components/ for component style.

REVIEWS COMPONENT (Task #5):
File: storefront/src/components/product/ProductReviews.tsx
- Map of product-category → review array
- Determine category from product tags or handle prefix
- Reviews use names from the 25 seeded customers
- Add data-testid="review-card", data-testid="review-author", data-testid="verified-badge"
- Star breakdown: 5★/4★/3★/2★/1★ count display
- Import in the product detail template

SOCIAL PROOF (Task #6):
File: storefront/src/components/product/SocialProofBadge.tsx
File: storefront/src/lib/social-proof-config.ts
- Config: Record<string, { soldCount: number; rating: number; isBestseller: boolean; isNew: boolean }>
- Populated with all 60 product handles
- data-testid="bestseller-badge", data-testid="sold-count", data-testid="star-rating"

AMAZON HOMEPAGE (Task #7):
Create these files:
- storefront/src/components/home/HeroBannerCarousel.tsx  (5 slides, auto-rotate 4s)
- storefront/src/components/home/CategoryShortcuts.tsx   (8 categories, icon + label)
- storefront/src/components/home/DealTilesGrid.tsx       (4 deal blocks, 2x2 product thumbnails)
- storefront/src/components/home/ProductCarousel.tsx     (reusable horizontal scroll with arrows)
- storefront/src/components/home/VendorSpotlight.tsx     (5 vendor cards)

Update: storefront/src/app/[countryCode]/(main)/page.tsx
- Background: bg-[#131921] text-white
- Stack sections: sticky nav → hero carousel → category shortcuts → deal tiles → 3x product carousel → vendor spotlight
- data-testid on every section: "hero-carousel", "category-shortcuts", "deal-tiles", "product-carousel", "vendor-spotlight"
- All product carousels pull from Medusa store API (fetch with publishable key)
- Fully responsive: 375px mobile, 768px tablet, 1280px desktop

AMAZON SEARCH (Task #8):
Create:
- storefront/src/app/[countryCode]/(main)/search/page.tsx   (server component, reads searchParams)
- storefront/src/components/search/SearchFilters.tsx        (sidebar: category/price/rating/vendor)
- storefront/src/components/search/SearchResultCard.tsx     (product card with Add to Cart)
- storefront/src/components/search/SortDropdown.tsx         (Featured/Price asc/Price desc/Rating/Newest)
- storefront/src/components/search/SearchAutocomplete.tsx   (debounced, dropdown suggestions)

Update header to add:
- Category dropdown left of search input (All / Electronics / Fashion / Beauty / Food / Home / Sports / Kids)
- data-testid="search-input", "category-dropdown", "autocomplete-dropdown", "autocomplete-item"
- Search bar: white background, orange button (#FF9900)

Search results URL: /kw/search?q={query}&category={cat}&minPrice={n}&maxPrice={n}&rating={n}&sort={s}
Filter products client-side from Medusa /store/products?q={query}&limit=48
Empty state: show "No results found for 'X'" with a "Browse all products" link

=== STEP 5: VERIFY ===
Print: "RALPH: Running verification for Task #<N>..."

IMPORTANT: Use the Chrome DevTools MCP tools for ALL browser testing. Do NOT use Playwright.
The Chrome DevTools MCP tools are: mcp__chrome-devtools__navigate_page, mcp__chrome-devtools__take_snapshot,
mcp__chrome-devtools__take_screenshot, mcp__chrome-devtools__evaluate_script,
mcp__chrome-devtools__wait_for, mcp__chrome-devtools__click, mcp__chrome-devtools__fill,
mcp__chrome-devtools__list_console_messages, mcp__chrome-devtools__list_pages

For API checks (Tasks #1-#4) use curl via Bash tool — no browser needed.
For visual checks (Tasks #5-#9) use Chrome DevTools MCP — navigate, snapshot, screenshot.
Save screenshots with: mcp__chrome-devtools__take_screenshot filePath="demo-screenshots/verify-XXX-name.png"

--- VERIFY-001 (after Task #1): Vendor count ---
  API check — run via Bash tool:
    curl -s http://localhost:9000/admin/vendors -H "Authorization: Bearer $ADMIN_TOKEN" | head -200
  Chrome check — use mcp__chrome-devtools__navigate_page url="http://localhost:9000/app/vendors"
  Then mcp__chrome-devtools__wait_for text="Vendors"
  Then mcp__chrome-devtools__take_screenshot filePath="demo-screenshots/verify-001-vendors.png"
  Then mcp__chrome-devtools__take_snapshot and count table rows
  PASS: >= 12 vendor rows visible OR API returns >= 12 vendors

--- VERIFY-002 (after Task #2): Products + stock ---
  mcp__chrome-devtools__navigate_page url="http://localhost:8000/kw/store"
  mcp__chrome-devtools__wait_for text="KWD" timeout=10000
  mcp__chrome-devtools__take_screenshot filePath="demo-screenshots/verify-002-store.png"
  mcp__chrome-devtools__evaluate_script to count product cards:
    function: "() => document.querySelectorAll('[data-testid=product-card]').length"
  mcp__chrome-devtools__evaluate_script to check for out-of-stock:
    function: "() => document.body.innerText.includes('Out of stock')"
  PASS: card count >= 20 AND out-of-stock is false

--- VERIFY-003 (after Task #2): Images load ---
  (on same /kw/store page)
  mcp__chrome-devtools__evaluate_script:
    function: "() => { const imgs = document.querySelectorAll('img'); return Array.from(imgs).filter(i => i.naturalWidth === 0 && i.src).length; }"
  PASS: result == 0 (no broken images)

--- VERIFY-004 (after Task #3): Customer login ---
  Bash tool curl check:
    curl -s -X POST http://localhost:9000/store/auth/customer/emailpass \
      -H "Content-Type: application/json" \
      -d "{\"email\":\"m.alrashidi@gmail.com\",\"password\":\"Demo1234!\"}" | grep -c "token"
  PASS: output is "1" (token field present)

--- VERIFY-005 (after Task #4): Orders in admin ---
  mcp__chrome-devtools__navigate_page url="http://localhost:9000/app/orders"
  mcp__chrome-devtools__wait_for text="Orders" timeout=10000
  mcp__chrome-devtools__take_screenshot filePath="demo-screenshots/verify-005-orders.png"
  mcp__chrome-devtools__take_snapshot and count table rows
  PASS: >= 10 order rows visible

--- VERIFY-006 (after Task #5): Reviews render ---
  mcp__chrome-devtools__navigate_page url="http://localhost:8000/kw/products/samsung-galaxy-s25-ultra"
  (if that handle doesn't exist, use the first product handle from /kw/store)
  mcp__chrome-devtools__wait_for text="Customer Reviews" timeout=8000
  mcp__chrome-devtools__take_screenshot filePath="demo-screenshots/verify-006-reviews.png" fullPage=true
  mcp__chrome-devtools__evaluate_script:
    function: "() => document.querySelectorAll('[data-testid=review-card]').length"
  mcp__chrome-devtools__evaluate_script:
    function: "() => document.body.innerText.includes('Verified Purchase')"
  PASS: review count >= 5 AND Verified Purchase text present

--- VERIFY-007 (after Task #6): Social proof badges ---
  mcp__chrome-devtools__navigate_page url="http://localhost:8000/kw/store"
  mcp__chrome-devtools__wait_for text="KWD" timeout=8000
  mcp__chrome-devtools__take_screenshot filePath="demo-screenshots/verify-007-badges.png"
  mcp__chrome-devtools__evaluate_script:
    function: "() => document.querySelectorAll('[data-testid=bestseller-badge]').length"
  mcp__chrome-devtools__evaluate_script:
    function: "() => document.querySelectorAll('[data-testid=sold-count]').length"
  PASS: bestseller count >= 1 AND sold-count count >= 10

--- VERIFY-008 (after Task #7): Amazon homepage ---
  mcp__chrome-devtools__navigate_page url="http://localhost:8000/kw"
  mcp__chrome-devtools__wait_for text="KWD" timeout=10000
  mcp__chrome-devtools__take_screenshot filePath="demo-screenshots/verify-008-homepage.png" fullPage=true
  mcp__chrome-devtools__evaluate_script:
    function: "() => ({ carousel: !!document.querySelector('[data-testid=hero-carousel]'), carousels: document.querySelectorAll('[data-testid=product-carousel]').length, categories: !!document.querySelector('[data-testid=category-shortcuts]') })"
  Check console for errors: mcp__chrome-devtools__list_console_messages types=["error"]
  PASS: carousel exists, carousels >= 2, categories exist, no console errors

--- VERIFY-009 (after Task #8): Search autocomplete ---
  mcp__chrome-devtools__navigate_page url="http://localhost:8000/kw"
  mcp__chrome-devtools__wait_for text="Search" timeout=5000
  mcp__chrome-devtools__take_snapshot to find the search input uid
  mcp__chrome-devtools__fill uid=<search-input-uid> value="samsung"
  mcp__chrome-devtools__wait_for text="KWD" timeout=2000
  mcp__chrome-devtools__take_screenshot filePath="demo-screenshots/verify-009-autocomplete.png"
  mcp__chrome-devtools__evaluate_script:
    function: "() => !!document.querySelector('[data-testid=autocomplete-dropdown]')"
  PASS: autocomplete dropdown visible with suggestions

--- VERIFY-010 (after Task #8): Search results page ---
  mcp__chrome-devtools__navigate_page url="http://localhost:8000/kw/search?q=phone"
  mcp__chrome-devtools__wait_for text="results" timeout=8000
  mcp__chrome-devtools__take_screenshot filePath="demo-screenshots/verify-010-search-results.png"
  mcp__chrome-devtools__evaluate_script:
    function: "() => ({ cards: document.querySelectorAll('[data-testid=search-result-card]').length, hasFilters: !!document.querySelector('[data-testid=filter-sidebar]'), hasSort: !!document.querySelector('[data-testid=sort-dropdown]') })"
  PASS: cards >= 1, hasFilters true, hasSort true

--- VERIFY-011 (after Task #7): Mobile homepage ---
  mcp__chrome-devtools__emulate viewport={"width":375,"height":812}
  mcp__chrome-devtools__navigate_page url="http://localhost:8000/kw"
  mcp__chrome-devtools__take_screenshot filePath="demo-screenshots/verify-011-mobile.png"
  mcp__chrome-devtools__evaluate_script:
    function: "() => document.body.scrollWidth"
  mcp__chrome-devtools__emulate viewport={"width":1280,"height":800}
  PASS: scrollWidth <= 375

--- VERIFY-012 (after Task #10): Build passes ---
  Bash tool only (no browser):
    cd storefront && npm run build 2>&1 | tail -10
    npx tsc --noEmit 2>&1 | grep "error TS" | wc -l
  PASS: build exits 0, tsc error count is 0

--- VERIFY-013 (final): End-to-end demo walkthrough ---
  Step 1: mcp__chrome-devtools__navigate_page url="http://localhost:8000/kw"
          mcp__chrome-devtools__wait_for text="KWD"
          mcp__chrome-devtools__take_screenshot filePath="demo-screenshots/verify-013-step1-homepage.png"
  Step 2: mcp__chrome-devtools__take_snapshot → find search input uid
          mcp__chrome-devtools__fill uid=<uid> value="iphone"
          mcp__chrome-devtools__press_key key="Enter"
          mcp__chrome-devtools__wait_for text="results"
          mcp__chrome-devtools__take_screenshot filePath="demo-screenshots/verify-013-step2-search.png"
  Step 3: mcp__chrome-devtools__take_snapshot → find first result card uid
          mcp__chrome-devtools__click uid=<first-result-uid>
          mcp__chrome-devtools__wait_for text="Add to Cart"
          mcp__chrome-devtools__take_screenshot filePath="demo-screenshots/verify-013-step3-product.png"
  Step 4: mcp__chrome-devtools__take_snapshot → find "Add to Cart" button uid
          mcp__chrome-devtools__click uid=<add-to-cart-uid>
          mcp__chrome-devtools__take_screenshot filePath="demo-screenshots/verify-013-step4-cart-added.png"
  Step 5: mcp__chrome-devtools__navigate_page url="http://localhost:8000/kw/cart"
          mcp__chrome-devtools__wait_for text="KWD"
          mcp__chrome-devtools__take_screenshot filePath="demo-screenshots/verify-013-step5-cart.png"
  PASS: all 5 steps complete without errors, 5 screenshots saved

After all verifications: check console for errors on each page visited:
  mcp__chrome-devtools__list_console_messages types=["error"]
  If errors found: note them in task-context.md

If any VERIFY fails: fix the root cause, retry once. If still failing, log in task-context.md and continue.

=== STEP 6: COMMIT + WRAP UP ===
Print: "RALPH: Wrapping up Task #<N>..."

1. Mark task completed: TaskUpdate taskId=<N> status=completed
2. Commit:
   git add -A
   git commit -m "feat(dummy-data): <specific description>"
3. Append a note to .claude/task-context.md:
   "Task #<N> done: <what was seeded/built>"
4. Print: "RALPH: Task #<N> complete."

If ALL tasks #1-#10 are completed:
  - Run final VERIFY-012 + VERIFY-013
  - Push: git push origin feature/medusa-starter-storefront
  - Then output exactly on its own line: RALPH_ALL_DONE

Otherwise: print "RALPH: Next task is #<N>. Stopping for next iteration." and stop.

=== BACKEND NOT RUNNING? ===
If port 9000 is not reachable when running seed scripts:
  Print: "RALPH: WARNING — Backend not reachable on port 9000. Skipping seed tasks."
  Skip Tasks #1-#4 for this iteration.
  Work on Tasks #5-#8 (frontend, no backend needed) instead.
RALPH_PROMPT_EOF
)

    # Unset CLAUDECODE so the child claude process is not blocked by nested-session protection
    env -u CLAUDECODE claude --dangerously-skip-permissions --verbose -p "$RALPH_PROMPT" 2>&1 | tee "$LOG_FILE"

    END_TIME=$(date +%s)
    ELAPSED=$(( END_TIME - START_TIME ))
    echo ""
    echo "--- Iteration $ITERATION done in ${ELAPSED}s (log: $LOG_FILE) ---"

    if grep -q "$DONE_SIGNAL" "$LOG_FILE"; then
        echo ""
        echo "==========================================================="
        echo " ALL TASKS COMPLETE!"
        echo " Kuwait Marketplace now has:"
        echo "   12 vendors | 60 products | 25 customers | 25 orders"
        echo "   Amazon homepage | Amazon search | Reviews | Badges"
        echo "   13 Playwright screenshots in demo-screenshots/"
        echo ""
        echo " Storefront: http://localhost:8000/kw"
        echo " Admin:      http://localhost:9000/app"
        echo "==========================================================="
        break
    fi

    ((ITERATION++))
    echo "Pausing 3s before next iteration..."
    sleep 3
done

echo ""
echo "==========================================================="
echo " Ralph finished after $ITERATION iteration(s)"
echo " Logs: $LOG_DIR/ | Screenshots: demo-screenshots/"
echo "==========================================================="
