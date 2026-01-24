# Task ID: 68

**Title:** Performance Optimization

**Status:** pending

**Dependencies:** 67

**Priority:** high

**Description:** Optimize Core Web Vitals: LCP, FID, CLS.

**Details:**

Framework Context:
- Use /senior-developer skill

Implementation Steps:
1. Run Lighthouse audit
2. Optimize images (next/image, WebP)
3. Add font optimization
4. Implement code splitting
5. Add loading skeletons

Files:
- storefront/next.config.js
- Various components

**Test Strategy:**

Run Lighthouse, target:
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1

Acceptance:
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals pass
- [ ] Fast initial load

Auto-Commit: /auto-commit
