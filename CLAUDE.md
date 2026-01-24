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