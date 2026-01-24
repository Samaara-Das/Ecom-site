# Task ID: 61

**Title:** Build Search Autocomplete UI

**Status:** pending

**Dependencies:** 60

**Priority:** high

**Description:** Create search bar with instant autocomplete suggestions.

**Details:**

Framework Context:
- Use /senior-developer skill with TDD

Implementation Steps (TDD):
1. Write test for search input
2. Write test for suggestions dropdown
3. Write test for keyboard navigation
4. Implement SearchBar component
5. Add recent searches

Files:
- storefront/components/search/SearchBar.tsx
- storefront/components/search/SearchBar.test.tsx
- storefront/components/search/SearchSuggestions.tsx

**Test Strategy:**

TDD Test Cases:
- shows suggestions on type
- keyboard navigation works
- clicking suggestion navigates
- escape closes dropdown

Playwright Verification:
- Type in search
- Verify suggestions appear

Acceptance:
- [ ] Autocomplete works
- [ ] Fast response
- [ ] Keyboard accessible

Auto-Commit: /auto-commit
