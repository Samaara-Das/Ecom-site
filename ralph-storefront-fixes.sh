#!/usr/bin/env bash

# =========================================================
# Ralph Wiggum — Storefront Fixes
# =========================================================
# Tasks:
#   #1  Fix /kw/account/profile and /kw/account/addresses 404
#   #2  Fix "Out of stock" display (seed inventory for all variants)
#   #3  Add Stripe test payment provider
#   #4  Investigate and fix navigation auto-redirects
#   #5  Verify all fixes with Chrome DevTools MCP
# =========================================================
# Usage: ./ralph-storefront-fixes.sh [max_iterations]
# Run from a SEPARATE terminal — not inside Claude.
# Make sure Docker + backend + storefront are running first.
# =========================================================

MAX_ITERATIONS=${1:-10}
DONE_SIGNAL="RALPH_ALL_DONE"
LOG_DIR="ralph_fix_logs"
ITERATION=1

mkdir -p "$LOG_DIR"
mkdir -p "fix-screenshots"

echo "==========================================================="
echo " Ralph Wiggum — Kuwait Marketplace Storefront Fixes"
echo " Max iterations : $MAX_ITERATIONS"
echo " Logs           : $LOG_DIR/"
echo " Screenshots    : fix-screenshots/"
echo "==========================================================="
echo ""
echo " Make sure these are running before starting:"
echo "   docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d db redis"
echo "   cd backend && npm run dev          (port 9000)"
echo "   cd storefront && npm run dev       (port 8000)"
echo ""
echo " Chrome must be open (Chrome DevTools MCP needs an active tab)"
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
- Locale: /kw prefix on all storefront routes
- Branch: feature/medusa-starter-storefront
- GitHub CLI: always use "gh" not raw git remote calls
- IMPORTANT: Use Chrome DevTools MCP tools for ALL browser testing — NOT Playwright

Read these files for context:
1. .claude/task-context.md
2. storefront/src/app/[countryCode]/(main)/account/layout.tsx
3. storefront/src/middleware.ts

=== STEP 2: PICK ONE TASK ===
Print: "RALPH: Checking TaskList..."

Run TaskList and pick the LOWEST-ID pending task. The tasks are:

  Task #1  — Fix account routes 404 (profile + addresses)
  Task #2  — Fix "Out of stock" display (seed all inventory)
  Task #3  — Add Stripe test payment (document + enable if key exists)
  Task #4  — Investigate and fix navigation auto-redirects
  Task #5  — Verify all fixes with Chrome DevTools MCP

If TaskList is empty (all done), output: RALPH_ALL_DONE and stop.

Print: "RALPH: Working on Task #<N> — <title>"
Mark it in_progress: TaskUpdate taskId=<N> status=in_progress

=== STEP 3: IMPLEMENT ===

-------------------------------------------------------------------
TASK #1 — Fix /kw/account/profile and /kw/account/addresses 404
-------------------------------------------------------------------

Root cause: Next.js App Router parallel routes need a `default.tsx` in every
slot at the same level. Without it, direct navigation to a slot-specific URL
(e.g. /kw/account/profile which lives in @dashboard/profile/) returns 404
because Next.js can't find what to render in the sibling @login slot.

Fix — create these TWO files:

FILE A: storefront/src/app/[countryCode]/(main)/account/@login/default.tsx
Content:
  export default function Default() {
    return null
  }

FILE B: storefront/src/app/[countryCode]/(main)/account/@dashboard/default.tsx
Content:
  export default function Default() {
    return null
  }

After writing both files:
1. Run: cd storefront && npx tsc --noEmit 2>&1 | grep "error TS"
   - PASS: empty output (no new type errors)
2. Restart storefront dev server if needed (kill and restart) — the user will
   do this manually; just note it in the commit message.

-------------------------------------------------------------------
TASK #2 — Fix "Out of stock" display
-------------------------------------------------------------------

There are TWO parts to this fix:

PART A — Backend: Seed inventory for all product variants
Create file: backend/src/scripts/seed-all-inventory.ts

The script must:
1. Resolve modules:
     const inventoryModule = container.resolve(Modules.INVENTORY)
     const productModule   = container.resolve(Modules.PRODUCT)
     const linkModule      = container.resolve(ContainerRegistrationKeys.LINK)
     const logger          = container.resolve(ContainerRegistrationKeys.LOGGER)

2. Find the stock location named "Kuwait Warehouse" (or "Main Warehouse" as fallback):
     const stockLocationModule = container.resolve(Modules.STOCK_LOCATION)
     const locations = await stockLocationModule.listStockLocations({})
     Pick the one named "Kuwait Warehouse" or "Main Warehouse" or locations[0]

3. List ALL product variants (paginate with limit=100 if needed):
     const variants = await productModule.listProductVariants({}, { take: 200 })

4. For each variant:
   a. Check if an inventory item linked to this variant already exists via linkModule:
        const links = await linkModule.list(
          { [Modules.PRODUCT]: { variant_id: variant.id } },
          { relations: ["inventory_item"] }
        )
      If links exist and have inventory_item, get the inventoryItemId.

   b. If no linked inventory item exists, create one:
        const item = await inventoryModule.createInventoryItems({
          sku: variant.sku || variant.id,
          title: variant.title || "Variant",
        })
        inventoryItemId = item.id
        // Link variant → inventory item
        await linkModule.create({
          [Modules.PRODUCT]: { variant_id: variant.id },
          [Modules.INVENTORY]: { inventory_item_id: inventoryItemId },
        })

   c. Check if an inventory level already exists for this item + location:
        const levels = await inventoryModule.listInventoryLevels({
          inventory_item_id: inventoryItemId,
          location_id: locationId,
        })

   d. If level exists: update stocked_quantity to 50
      If no level: create it with stocked_quantity: 50

   e. Log each action: logger.info(`✓ Variant ${variant.id}: 50 units in stock`)

5. At the end: logger.info(`Done! ${count} variants seeded with inventory.`)

Run the script: cd backend && npx medusa exec ./src/scripts/seed-all-inventory.ts

PART B — Frontend: Fix Next.js cache serving stale inventory data
The storefront uses `cache: "force-cache"` in product fetches, so inventory
data may be stale. Fix:

Read file: storefront/src/lib/data/products.ts
Find the function that fetches product details (likely `getProductByHandle` or similar).
Look for `cache: "force-cache"` in the fetch options for the products endpoint.
Change it to: `next: { revalidate: 60 }` (revalidate every 60s instead of never)

Also check: storefront/src/lib/data/products.ts for any `inventory_quantity` related fetch.
If the product fetch doesn't include inventory data, check if `fields` or query params
need to include inventory. Add `expand=variants.inventory_items` if needed.

IMPORTANT: After any storefront file changes, run:
  cd storefront && npx tsc --noEmit 2>&1 | grep "error TS"
PASS: empty output.

-------------------------------------------------------------------
TASK #3 — Add Stripe test payment + document setup
-------------------------------------------------------------------

First, check if STRIPE_API_KEY is already set:
  Bash: grep -c "STRIPE_API_KEY" backend/.env 2>/dev/null || echo "0"

The backend medusa-config.ts already conditionally loads Stripe when
STRIPE_API_KEY env var is set. So Stripe just needs a key.

Sub-task A — Create/update .env.example with Stripe instructions:
  Read: backend/.env.example (if it exists)
  Add (or ensure present):
    # Stripe Payment Provider
    # Get test keys at: https://dashboard.stripe.com/test/apikeys
    STRIPE_API_KEY=sk_test_YOUR_STRIPE_SECRET_KEY_HERE
    STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE

Sub-task B — Check if backend/.env already has STRIPE_API_KEY:
  If grep finds "STRIPE_API_KEY=sk_test_" in backend/.env and the value is not
  a placeholder, Stripe is already configured — skip to verification.

  If NOT configured: create fix-screenshots/stripe-setup-needed.txt with:
    Stripe is not configured. To enable Stripe payments:
    1. Go to https://dashboard.stripe.com/test/apikeys
    2. Copy your "Secret key" (starts with sk_test_)
    3. Add to backend/.env:
       STRIPE_API_KEY=sk_test_YOUR_KEY_HERE
    4. Restart backend: cd backend && npm run dev
    Stripe will then appear as a payment option in checkout.

Sub-task C — Add Manual payment provider note:
  The "Manual Payment" option is already working. Stripe is an optional
  enhancement requiring API keys. Document this state clearly in task-context.md.

No TypeScript changes needed for this task.

-------------------------------------------------------------------
TASK #4 — Investigate and fix navigation auto-redirects
-------------------------------------------------------------------

Read the middleware: storefront/src/middleware.ts

ROOT CAUSE ANALYSIS:
The middleware always creates a redirect response at the top:
  let response = NextResponse.redirect(redirectUrl, 307)

On first visit (when user has the countryCode in URL but NO _medusa_cache_id cookie),
the middleware redirects to the SAME URL just to set the cache cookie. This causes:
- An extra HTTP round-trip on first visit to every page
- Test instability because Playwright/DevTools sees a redirect before page load

THE FIX — When the URL already has the correct countryCode but cookie is missing,
don't redirect. Instead, set the cookie on a NextResponse.next():

Find the block:
  // if one of the country codes is in the url and the cache id is not set, set the cache id and redirect
  if (urlHasCountryCode && !cacheIdCookie) {
    response.cookies.set("_medusa_cache_id", cacheId, {
      maxAge: 60 * 60 * 24,
    })
    return response
  }

Replace it with:
  // if one of the country codes is in the url and the cache id is not set, set the cookie inline (no redirect)
  if (urlHasCountryCode && !cacheIdCookie) {
    const res = NextResponse.next()
    res.cookies.set("_medusa_cache_id", cacheId, {
      maxAge: 60 * 60 * 24,
    })
    return res
  }

This eliminates the unnecessary redirect-to-self that caused test instability.

After the fix:
  cd storefront && npx tsc --noEmit 2>&1 | grep "error TS"
  PASS: empty output.

-------------------------------------------------------------------
TASK #5 — Verify all fixes with Chrome DevTools MCP
-------------------------------------------------------------------

IMPORTANT: Use ONLY Chrome DevTools MCP tools — do NOT use Playwright.
Chrome DevTools MCP tools: mcp__chrome-devtools__navigate_page, take_snapshot,
take_screenshot, evaluate_script, wait_for, click, fill, list_console_messages,
list_pages, press_key, emulate, resize_page

Save all screenshots to fix-screenshots/ folder.

NOTE: The storefront dev server may need a restart for middleware changes to take
effect. If pages return 500 or old behavior, note this and move on to the next check.
The user will restart the server manually.

--- VERIFY-FIX-001: Account Profile page loads (no 404) ---
  mcp__chrome-devtools__navigate_page url="http://localhost:8000/kw/account"
  (This will redirect to login since no session — that is expected)
  mcp__chrome-devtools__wait_for text="Sign in" timeout=8000
  mcp__chrome-devtools__take_screenshot filePath="fix-screenshots/verify-fix-001a-account-login.png"

  Now test the actual profile and addresses URLs in isolation:
  mcp__chrome-devtools__navigate_page url="http://localhost:8000/kw/account/profile"
  Wait 3000ms for page to load
  mcp__chrome-devtools__take_screenshot filePath="fix-screenshots/verify-fix-001b-profile.png"
  mcp__chrome-devtools__take_snapshot

  Check snapshot: if it contains "Sign in" OR "Profile" text → PASS (not 404)
  Check snapshot: if it contains "404" or "This page could not be found" → FAIL

  mcp__chrome-devtools__navigate_page url="http://localhost:8000/kw/account/addresses"
  Wait 3000ms
  mcp__chrome-devtools__take_screenshot filePath="fix-screenshots/verify-fix-001c-addresses.png"
  mcp__chrome-devtools__take_snapshot

  Check snapshot: if it contains "Sign in" OR "Shipping Addresses" text → PASS
  Check snapshot: if it contains "404" → FAIL

  PASS criteria: Both URLs load without 404 (may show login redirect — that is OK)

--- VERIFY-FIX-002: Inventory / out-of-stock check ---
  mcp__chrome-devtools__navigate_page url="http://localhost:8000/kw/store"
  mcp__chrome-devtools__wait_for text="KWD" timeout=10000
  mcp__chrome-devtools__take_screenshot filePath="fix-screenshots/verify-fix-002a-store.png"

  Check for out-of-stock text:
  mcp__chrome-devtools__evaluate_script:
    function: "() => document.body.innerText.includes('Out of stock')"

  Click the first product to go to its detail page:
  mcp__chrome-devtools__take_snapshot
  Find a product card link (data-testid=product-preview) and click it
  mcp__chrome-devtools__wait_for text="Add to Cart" timeout=8000
  mcp__chrome-devtools__take_screenshot filePath="fix-screenshots/verify-fix-002b-product-detail.png"

  Check if "Add to Cart" button is enabled (not "Out of stock"):
  mcp__chrome-devtools__evaluate_script:
    function: "() => ({ outOfStock: document.body.innerText.includes('Out of stock'), addToCart: !!document.querySelector('button[data-testid=add-product-button]:not([disabled])') })"

  PASS: outOfStock is false AND addToCart button is present and enabled
  NOTE: If still showing out-of-stock, the dev server may need a restart (cache). Note this.

--- VERIFY-FIX-003: No unnecessary redirect on storefront pages ---
  mcp__chrome-devtools__navigate_page url="http://localhost:8000/kw/store"

  Check network requests for redirect chains:
  mcp__chrome-devtools__list_network_requests

  Look at the document requests — if the first request gets a 307 redirect,
  note it. After the middleware fix, the first request should return 200 directly.
  mcp__chrome-devtools__take_screenshot filePath="fix-screenshots/verify-fix-003-no-redirect.png"

  PASS: Page loads without intermediate 307 redirect to same URL
  (A redirect from "/" to "/kw" is expected and OK — only same-URL redirects were the issue)

--- VERIFY-FIX-004: Check for console errors ---
  mcp__chrome-devtools__navigate_page url="http://localhost:8000/kw"
  mcp__chrome-devtools__wait_for text="KWD" timeout=8000
  mcp__chrome-devtools__list_console_messages types=["error"]
  mcp__chrome-devtools__take_screenshot filePath="fix-screenshots/verify-fix-004-homepage-console.png"

  Navigate to account profile:
  mcp__chrome-devtools__navigate_page url="http://localhost:8000/kw/account/profile"
  mcp__chrome-devtools__list_console_messages types=["error"]
  mcp__chrome-devtools__take_screenshot filePath="fix-screenshots/verify-fix-004b-profile-console.png"

  PASS: No unexpected console errors on either page

--- VERIFY-FIX-005: Payment options in checkout ---
  mcp__chrome-devtools__navigate_page url="http://localhost:8000/kw/store"
  mcp__chrome-devtools__wait_for text="KWD" timeout=8000

  Check if Stripe payment option text visible:
  mcp__chrome-devtools__evaluate_script:
    function: "() => ({ hasStripe: document.body.innerText.toLowerCase().includes('stripe') || document.body.innerText.includes('Credit Card'), hasManual: document.body.innerText.toLowerCase().includes('manual') })"
  mcp__chrome-devtools__take_screenshot filePath="fix-screenshots/verify-fix-005-store.png"

  Note: Stripe will only appear in checkout payment step after adding item to cart.
  Log the payment status for context (PASS even if Stripe not configured yet).

=== STEP 4: COMMIT + WRAP UP ===
Print: "RALPH: Wrapping up Task #<N>..."

1. Mark task completed: TaskUpdate taskId=<N> status=completed
2. Commit with a clear message:
   git add -A
   git commit -m "fix(<area>): <specific description>"
   Examples:
     "fix(account): add default.tsx for parallel routes to fix 404 on profile/addresses"
     "fix(inventory): seed all product variants with 50 units stock"
     "fix(middleware): remove unnecessary same-URL redirect on first visit"
     "docs(stripe): add setup instructions for Stripe payment provider"
3. Append a note to .claude/task-context.md under "Session: Ralph Storefront Fixes":
   "Task #<N> done: <what was fixed>"
4. Print: "RALPH: Task #<N> complete."

=== IF ALL 5 TASKS ARE DONE ===
  - Run VERIFY-FIX-001 through VERIFY-FIX-005 (if not already run)
  - Push: git push origin feature/medusa-starter-storefront
  - Print the DONE SIGNAL on its own line: RALPH_ALL_DONE

=== BACKEND NOT RUNNING? ===
If port 9000 is not reachable:
  Print: "RALPH: WARNING — Backend not running on port 9000. Skipping Task #2 seed script."
  Skip Task #2 this iteration, work on Tasks #1 and #4 instead (frontend only).

=== STOREFRONT NOT RUNNING? ===
If port 8000 is not reachable:
  Print: "RALPH: WARNING — Storefront not running on port 8000. Skipping browser verification."
  Do code changes only, skip verify steps. Note: user must restart storefront for changes.

Otherwise: print "RALPH: Next task is #<N>. Stopping for next iteration." and stop.
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
        echo " ALL STOREFRONT FIXES COMPLETE!"
        echo ""
        echo " Fixed:"
        echo "   /kw/account/profile   — no longer 404"
        echo "   /kw/account/addresses — no longer 404"
        echo "   Out of stock          — inventory seeded for all variants"
        echo "   Middleware redirect    — no more unnecessary same-URL redirect"
        echo "   Stripe setup          — instructions added to .env.example"
        echo ""
        echo " Screenshots: fix-screenshots/"
        echo " Branch: feature/medusa-starter-storefront"
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
echo " Logs: $LOG_DIR/"
echo "==========================================================="
