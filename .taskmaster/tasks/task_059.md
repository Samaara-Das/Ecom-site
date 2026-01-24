# Task ID: 59

**Title:** Implement Multi-Currency Display

**Status:** pending

**Dependencies:** 15

**Priority:** high

**Description:** Show prices in user's selected currency with proper formatting.

**Details:**

Framework Context:
- Use /senior-developer skill

Implementation Steps:
1. Create currency context/hook
2. Fetch exchange rates
3. Format prices per currency
4. Add currency selector
5. Persist selection

Files:
- storefront/hooks/useCurrency.ts
- storefront/lib/currency.ts
- storefront/components/CurrencySelector.tsx

**Test Strategy:**

Playwright Verification:
- Switch currencies
- Verify prices update

Acceptance:
- [ ] All currencies work
- [ ] Formatting correct
- [ ] Persists selection

Auto-Commit: /auto-commit
