# The Ralph Wiggum Loop Pattern

Complete implementation guide for Geoffrey Huntley's Ralph Wiggum technique.

## File Structure

```
project-root/
├── loop.sh                 # Orchestration script
├── PROMPT_build.md         # Building mode instructions
├── PROMPT_plan.md          # Planning mode instructions
├── AGENTS.md               # Operational guide (loaded each iteration)
├── IMPLEMENTATION_PLAN.md  # Prioritized task list (persistent state)
├── specs/                  # Requirements (one per JTBD topic)
│   ├── [topic-a].md
│   └── [topic-b].md
└── src/                    # Application source code
```

## The Loop Script

### Minimal Form

```bash
while :; do cat PROMPT.md | claude ; done
```

### Enhanced Version (loop.sh)

```bash
#!/bin/bash

MODE=${1:-build}
MAX_ITERATIONS=${2:-0}
ITERATION=0

while true; do
    if [[ $MAX_ITERATIONS -gt 0 && $ITERATION -ge $MAX_ITERATIONS ]]; then
        echo "Max iterations ($MAX_ITERATIONS) reached"
        exit 0
    fi

    PROMPT_FILE="PROMPT_${MODE}.md"

    if [[ ! -f "$PROMPT_FILE" ]]; then
        echo "Error: $PROMPT_FILE not found"
        exit 1
    fi

    cat "$PROMPT_FILE" | claude -p --dangerously-skip-permissions

    ITERATION=$((ITERATION + 1))
    echo "Completed iteration $ITERATION"
done
```

**Usage**:
```bash
./loop.sh              # Build mode, unlimited
./loop.sh 20           # Build mode, max 20 iterations
./loop.sh plan         # Plan mode, unlimited
./loop.sh plan 5       # Plan mode, max 5 iterations
```

## PROMPT_plan.md Template

Focus on gap analysis without implementation:

```markdown
# Planning Mode

## Context Loading

0a. Study specs/* with parallel Sonnet subagents
0b. Study @IMPLEMENTATION_PLAN.md
0c. Study src/lib/* for existing utilities
0d. Reference: src/* contains application code

## Instructions

1. Compare specifications against existing source code
   - Do NOT implement anything
   - Do NOT assume functionality is missing; confirm first
   - Search codebase before adding tasks

2. Create/update @IMPLEMENTATION_PLAN.md with:
   - Prioritized task list
   - Dependencies between tasks
   - Acceptance criteria per task

3. Use Ultrathink mode for complex analysis

## Critical Rules

99999. Don't assume not implemented - always verify first
99999999. Only planning, never implementation
99999999999. Exit after updating IMPLEMENTATION_PLAN.md
```

## PROMPT_build.md Template

Focus on implementation with validation:

```markdown
# Building Mode

## Context Loading

0a. Study specs/* with parallel Sonnet subagents (up to 500)
0b. Study @IMPLEMENTATION_PLAN.md
0c. Reference: src/* contains source code

## Instructions

1. Select the highest priority incomplete task from IMPLEMENTATION_PLAN.md

2. Implement according to specifications
   - Search codebase first for existing patterns
   - Use up to 500 Sonnet subagents for reading
   - Use only 1 subagent for build/tests (backpressure)
   - Use Ultrathink for complex reasoning

3. Run tests after implementation
   - All tests must pass before proceeding
   - Fix failures immediately

4. Update @IMPLEMENTATION_PLAN.md
   - Mark task complete
   - Add learnings or notes
   - Capture the why, not just the what

5. Commit with descriptive message

6. Git push after successful tests

## Critical Rules

99999. One task per iteration only
99999999. Never commit with failing tests
99999999999. If functionality missing, add it (don't assume)
99999999999999. Exit after commit
```

## AGENTS.md Template

Operational knowledge loaded every iteration:

```markdown
# Operational Guide

## Build Commands

```bash
npm run build        # Build project
npm test            # Run tests
npm run lint        # Lint code
```

## Project Patterns

- Use TypeScript strict mode
- Follow existing error handling in src/utils/errors.ts
- Tests go in __tests__ directories

## Learned Patterns

(Add learnings discovered during implementation)

## Do Not Touch

- src/legacy/**
- *.lock files
- .env files
```

## Context Management Strategy

Context windows are the greatest constraint. Optimize through:

### Token Efficiency

- Reserve first ~5,000 tokens for specifications
- Use main agent as scheduler only
- Spawn subagents for expensive work
- Each subagent gets ~156KB that's garbage-collected
- Prefer Markdown over JSON for token efficiency

### Subagent Allocation

| Task Type | Subagents | Model |
|-----------|-----------|-------|
| Reading/Analysis | Up to 500 parallel | Sonnet |
| Build/Test | Exactly 1 | Sonnet |
| Complex Reasoning | As needed | Opus |

The single build subagent creates **backpressure** - test failures force fixes.

## Backpressure Mechanisms

Control through downstream validation:

1. **Type checks**: TypeScript catches type errors
2. **Linting**: ESLint/Prettier enforce style
3. **Tests**: Unit/integration tests verify behavior
4. **Build**: Compilation catches structural issues

When any check fails, the agent must fix before proceeding.

## Plan Regeneration Triggers

Regenerate IMPLEMENTATION_PLAN.md when:

- Ralph implements wrong things or duplicates work
- Plan feels stale or doesn't match current state
- Too much clutter from completed items
- Significant specification changes
- Confusion about actual completion status

**Cost**: One Planning loop iteration (cheap).

## Key Language Patterns

Geoff's specific phrasing matters for determinism:

| Use This | Not This |
|----------|----------|
| "study" | "read" or "look at" |
| "don't assume not implemented" | (critical - prevents duplicates) |
| "using parallel subagents" | generic parallelism |
| "up to N subagents" | unlimited |
| "only 1 subagent for build/tests" | multiple |
| "Ultrathink" | "think extra hard" |
| "capture the why" | just document |

## Topic Scope Test

Determine if something should be a single spec:

**Test**: "Can you describe it in one sentence without 'and'?"

- **Good**: "The color extraction system analyzes images to identify dominant colors"
- **Bad**: "The user system handles authentication, profiles, and billing" (three topics)

If 'and' is needed, split into multiple specs.

## Execution Philosophy

Your role shifts from implementer to environment engineer:

1. **Observe and course-correct**: Watch for failure patterns early
2. **Tune like a guitar**: React to failures, don't prescribe everything upfront
3. **Move outside the loop**: Ralph does all work including task selection
4. **Trust eventual consistency**: Building with Ralph requires faith

## Safety Measures

### Iteration Limits

Always set maximum iterations:
```bash
./loop.sh build 50  # Max 50 iterations
```

### Sandboxing

Run in isolated environments:
- Docker containers (local)
- Fly Sprites (remote)
- E2B sandboxes (production)

### Escape Hatches

- **Ctrl+C**: Stop the loop immediately
- **git reset --hard**: Revert uncommitted changes
- **git stash**: Save work for later

### API Key Hygiene

- Only provide keys needed for the task
- No access to private data beyond requirements
- Rotate credentials if previously committed

## Debugging Failed Loops

### Agent Not Progressing

1. Check IMPLEMENTATION_PLAN.md for clarity
2. Verify specs are specific enough
3. Look for circular dependencies
4. Check if tests are consistently failing

### Duplicate Implementation

1. Run planning mode to regenerate plan
2. Add "don't assume not implemented" emphasis
3. Verify search commands are finding existing code

### Context Overflow

1. Split large specs into smaller files
2. Use more subagents for reading
3. Clear completed items from plan
4. Consider fresh plan regeneration
