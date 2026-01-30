## Project Documentation Reference

**Always consult these docs during development and planning.** Located in `/docs`:

| Document | When to Use |
|----------|-------------|
| **PRD.md** | Understanding features, user stories, acceptance criteria, priority levels |
| **TECHNICAL_SPEC.md** | Architecture decisions, tech stack details, security requirements |
| **API_REFERENCE.md** | Building/consuming APIs, endpoint signatures, request/response formats |
| **DATA_MODELS.md** | Database schema, entity relationships, field types, migrations |
| **INTEGRATION_GUIDE.md** | Setting up Stripe, PayPal, Twilio, S3, Redis; webhook configs |
| **DEPLOYMENT.md** | Environment setup, Docker, CI/CD, environment variables checklist |
| **UI_UX_SPEC.md** | Component patterns, layouts, responsive design, RTL/Arabic, accessibility |
| **IMPLEMENTATION_GUIDE.md** | Code patterns, Medusa module creation, testing, troubleshooting |
| **ROADMAP.md** | Outstanding issues, planned features, priorities, timeline |

### Quick Reference by Task Type

**Adding a feature?** → PRD.md (requirements) → TECHNICAL_SPEC.md (architecture) → IMPLEMENTATION_GUIDE.md (patterns)

**Building an API endpoint?** → API_REFERENCE.md (existing patterns) → DATA_MODELS.md (schema)

**Working on UI?** → UI_UX_SPEC.md (components, layouts) → IMPLEMENTATION_GUIDE.md (storefront patterns)

**Setting up integrations?** → INTEGRATION_GUIDE.md (step-by-step) → DEPLOYMENT.md (env vars)

**Debugging issues?** → IMPLEMENTATION_GUIDE.md (troubleshooting) → ROADMAP.md (known issues)

**Planning work?** → ROADMAP.md (priorities) → PRD.md (scope)

### Keeping Docs Current

**Update documentation when the project changes.** After significant changes:

| Change Type | Update These Docs |
|-------------|-------------------|
| New API endpoint | API_REFERENCE.md |
| Database schema change | DATA_MODELS.md |
| New integration added | INTEGRATION_GUIDE.md |
| New feature implemented | PRD.md, ROADMAP.md |
| UI component added/changed | UI_UX_SPEC.md |
| New pattern established | IMPLEMENTATION_GUIDE.md |
| Bug fixed / issue resolved | ROADMAP.md |
| Environment config changed | DEPLOYMENT.md |

**Rule**: If you add, remove, or significantly modify something, update the relevant doc before closing the task.

---

## Context Preservation System

This project uses a context preservation system to maintain continuity across sessions.

### Key Files
- **`CLAUDE.md`** - This file, auto-loaded every session
- **`.claude/task-context.md`** - Session notes with implementation details, bugs fixed, patterns discovered
- **`.claude/commands/get-context.md`** - `/get-context` command
- **`.claude/commands/update-context.md`** - `/update-context` command

### Workflow

**Starting a session:**
```
/get-context
```
This reads task-context.md, checks TaskList, and shows recent git commits.

**During work:**
- Use `TaskCreate` to create new tasks
- Use `TaskUpdate` to mark tasks in_progress or completed
- Use `TaskList` to see all tasks

**Ending a session:**
```
/update-context [what was accomplished]
```
This updates task-context.md with session progress.

---

## Task Management Tools

Use Claude's native task tools:
- `TaskCreate` - Creates a new task with metadata
- `TaskUpdate` - Modify any aspect of an existing task
- `TaskGet` - Retrieve full details of a specific task
- `TaskList` - See all tasks at once

### When to Use Tasks
- Multi-step work (3+ steps)
- Anything with dependencies
- Work that might span sessions
- Complex refactors or features
- Delegating to multiple agents

### When to Skip
- Quick one-off questions
- Simple single-file edits
- Anything you'll finish in one shot

## Task Master AI Instructions
**Import Task Master's development workflow commands and guidelines, treat as if import is in the main CLAUDE.md file.**
@./.taskmaster/CLAUDE.md
