---
description: Launch a UAT testing team — uat-tester (chrome-devtools MCP) + bug-fixer — that loop until all features pass
argument-hint: "[feature name, task number, or leave blank to test all pending tasks]"
allowed-tools: Bash, Read, Glob, Grep, Task, TaskCreate, TaskUpdate, TaskList, TeamCreate, SendMessage
---

# Start UAT Testing: $ARGUMENTS

## Step 1 — Read Context

1. Run `TaskList` to see all tasks. Identify which are relevant to **$ARGUMENTS** (or all pending/in-progress tasks if no argument given).
2. Read `.claude/task-context.md` for background on what's been implemented.
3. If a mini PRD exists for the features being tested, read it for the exact test scenarios. Check:
   - `.claude/plans/vivid-weaving-snail.md` — snapshot bugs + All Symbols (#189/#190/#191/#193)
   - Any other plan files in `.claude/plans/` matching the feature

The PRD contains `TC-xxx` test scenarios with Given/When/Then steps. These are the test cases the uat-tester will execute.

## Step 2 — Verify Dev Server

```bash
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null)
echo "Dev server: $STATUS"
```

- `200` or `307` → Server is ready. Proceed.
- `000` → Server not running. Tell the user to start it with `npm run dev` and wait for it to be ready before continuing.

**A `307` redirect is NORMAL** — it means auth is working. Do NOT restart the server for a 307.

## Step 3 — Create the Agent Team

Use `TeamCreate` to set up a testing team:

```
TeamCreate {
  team_name: "uat-loop",
  description: "UAT test-fix loop for $ARGUMENTS"
}
```

## Step 4 — Spawn Both Agents as Teammates

Spawn **both agents simultaneously** (one Task call each, in the same message):

### UAT Tester
```
Task {
  subagent_type: "uat-tester",
  team_name: "uat-loop",
  name: "uat-tester",
  prompt: "
You are the UAT tester in a test-fix loop team. Your teammate is `bug-fixer`.

**What to test:** $ARGUMENTS
**PRD test scenarios:** Read `.claude/plans/vivid-weaving-snail.md` for the full TC-xxx test case list.
**App URL:** http://localhost:3000

## Your Loop

1. Use chrome-devtools MCP tools to test each TC-xxx scenario.
2. For each FAIL:
   a. Create a task: TaskCreate { subject: 'Bug: <short description>', description: '<exact steps to reproduce, expected vs actual, screenshot description>' }
   b. Message bug-fixer: 'Bug found — Task #<id>: <description>. Please fix.'
3. Wait for bug-fixer to reply 'ready to re-test'.
4. Re-test the fixed scenarios.
5. Repeat until all scenarios PASS.
6. When everything passes, message the team lead with a final report: all TC-xxx results (PASS/FAIL), any remaining known issues.

## Rules
- Use ONLY chrome-devtools MCP tools for browser interaction (take_snapshot, click, fill, navigate_page, take_screenshot, list_console_messages, etc.)
- Every test result MUST have a screenshot or snapshot as evidence
- Never mark a test as PASS without actually running it in the browser
- Test scenarios are in `.claude/plans/vivid-weaving-snail.md` — read them first
  "
}
```

### Bug Fixer
```
Task {
  subagent_type: "bug-fixer",
  team_name: "uat-loop",
  name: "bug-fixer",
  prompt: "
You are the bug fixer in a test-fix loop team. Your teammate is `uat-tester`.

**Current branch:** Check with: git -C /c/Users/dassa/Work/Stock-Buddy-App branch --show-current
**Working directory:** C:/Users/dassa/Work/Stock-Buddy-App

Wait for messages from `uat-tester`. When you receive a bug report:
1. Read the task with TaskGet
2. Fix the bug in the codebase
3. Run: npx tsc --project tsconfig.json --noEmit && npm run lint
4. Commit the fix (git commit --no-verify)
5. Mark the task complete with TaskUpdate
6. Message uat-tester: 'Fixed task #<id> — ready to re-test'

Follow all instructions in your agent definition at .claude/agents/bug-fixer.md
  "
}
```

## Step 5 — Monitor and Report

The two agents will communicate autonomously. Their messages will appear in this conversation as they work.

When the uat-tester sends you a final report, summarize it for the user:
- ✅ Tests passed
- ❌ Tests failed (with task IDs for remaining bugs)
- Any issues that were blocked and need human input

## Important Notes

- **No Playwright.** The uat-tester uses chrome-devtools MCP only.
- **No new branches.** The bug-fixer commits to the current branch.
- **The loop is automatic** — you don't need to intervene unless an agent gets stuck or asks for help.
- **Task IDs persist** — bugs found during this session become backlog items if not fixed.
