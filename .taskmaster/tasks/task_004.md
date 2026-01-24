# Task ID: 4

**Title:** Create Next.js 14 Storefront Project

**Status:** pending

**Dependencies:** 1

**Priority:** high

**Description:** Scaffold Next.js 14 storefront with App Router, TypeScript, Tailwind CSS, and shadcn/ui.

**Details:**

Framework Context:
- Use /senior-developer skill for frontend setup
- Docs: mcp-cli call context7/query-docs '{"libraryId": "/websites/medusajs_learn", "topic": "nextjs storefront"}'

Implementation Steps:
1. Run: npx create-next-app@latest storefront --typescript --tailwind --app
2. Install shadcn/ui: npx shadcn-ui@latest init
3. Configure path aliases in tsconfig.json
4. Set up Medusa JS SDK
5. Create lib/medusa.ts client
6. Add environment variables

Files:
- storefront/app/layout.tsx
- storefront/lib/medusa.ts
- storefront/tailwind.config.ts
- storefront/.env.local

**Test Strategy:**

TDD: Write test for homepage rendering

Playwright Verification:
- mcp-cli call playwright/browser_navigate '{"url": "http://localhost:3000"}'
- mcp-cli call playwright/browser_snapshot '{}'
- mcp-cli call playwright/browser_take_screenshot '{"type": "png", "filename": "storefront-init.png"}'

Acceptance:
- [ ] npm run dev starts storefront
- [ ] Tailwind styles working
- [ ] Medusa SDK configured

Auto-Commit: /auto-commit
