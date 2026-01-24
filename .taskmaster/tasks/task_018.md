# Task ID: 18

**Title:** Set Up Development Environment Scripts

**Status:** pending

**Dependencies:** 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17

**Priority:** low

**Description:** Create npm scripts for common development tasks, Docker compose for local services.

**Details:**

Implementation Steps:
1. Create docker-compose.yml for Postgres + Redis
2. Add npm scripts: dev, build, seed, test
3. Create .env.example files
4. Add README with setup instructions

Files:
- docker-compose.yml
- backend/package.json
- storefront/package.json
- README.md

**Test Strategy:**

Verify all scripts work on clean checkout

Acceptance:
- [ ] docker-compose up works
- [ ] npm run dev starts both services
- [ ] README complete

Auto-Commit: /auto-commit
