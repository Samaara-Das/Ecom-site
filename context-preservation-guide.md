# How I Preserve Context Across Claude Code Sessions

This guide explains my system for maintaining context between Claude Code sessions using Task Master AI MCP, a custom context file, and slash commands.

---

## Overview

I use a four-part system:

1. **`/init` and `CLAUDE.md`** - Project instructions that Claude Code auto-loads every session
2. **Task Master AI MCP** - Tracks tasks, subtasks, and their statuses
3. **`.claude/task-context.md`** - Human-readable session notes with implementation details
4. **Custom slash commands** (`/get-context`, `/update-context`) - Quick access to read/update context

---

## 1. `/init` and CLAUDE.md

The `/init` command generates a `CLAUDE.md` file in your project root. This file contains project-specific instructions that Claude Code **automatically loads at the start of every session**.

### When to Run `/init`

I run `/init` in two situations:

1. **When starting a new project** - To generate the initial CLAUDE.md with project structure, commands, and patterns
2. **When the project significantly changes** - After major refactors, new modules, or architectural changes

### What CLAUDE.md Contains

The generated file typically includes:

- Project overview and purpose
- Common commands (build, test, run)
- Architecture and key modules
- Code patterns and conventions
- File structure overview

### Example

```markdown
# CLAUDE.md

## Project Overview
Python async web scraper that extracts Pine Script version history from TradingView.

## Commands

```bash
# Install dependencies
pip install -r requirements.txt

# Run with visible browser
python -m src.main

# Run headless
python -m src.main --headless
```

## Architecture

- `src/browser.py` - Playwright lifecycle, session persistence
- `src/scraper.py` - TradingView navigation, version extraction
- `src/database.py` - SQLite operations
```

Because Claude Code auto-loads this file, it always knows the project basics without being told.

---

## 2. Task Master AI MCP Setup

Task Master is an MCP server that manages structured tasks.

### Installation

```bash
npm install -g task-master-ai
```

### Adding to Claude Code

I added the MCP to Claude Code **without an API key** since I only use it for task tracking (Claude Code handles the AI calls).

In your MCP settings, add:

```json
{
  "mcpServers": {
    "task-master-ai": {
      "command": "npx",
      "args": ["-y", "task-master-ai"]
    }
  }
}
```

### Shortlisting MCP Capabilities

Task Master has many tools, but I only needed a subset. I shortlisted and selected only the ones relevant to my workflow:

- `get_tasks` - List all tasks with status
- `next_task` - Get the next available task
- `get_task` - View specific task details
- `set_task_status` - Mark tasks as pending/in-progress/done

I didn't need the AI-powered features like `parse_prd`, `expand_task`, or `analyze_complexity` since I manage task creation manually.

### Initializing in a Project

```bash
task-master init
```

This creates the `.taskmaster/` folder with `tasks/tasks.json` and `config.json`.

---

## 3. The Context File

**Location:** `.claude/task-context.md`

This file stores **implementation details** that Task Master doesn't capture - things like bugs fixed, working selectors, architectural decisions, and test commands.

### Structure

The file follows this structure:

```markdown
# Task Context Tracker

**Last Updated**: [date]
**Current Task Master Task**: [current task reference]

---

## Task Progress Summary

### Completed Tasks
- **Task N**: [description]

### In Progress Tasks
- **Task N**: [description]

### Pending Tasks
- **Task N**: [description]

---

## Session History (Chronological Order)

### [Task Name]

**Goal**: [what you were trying to achieve]

**How it was done**:
1. [step 1]
2. [step 2]

**Bugs Fixed**:
- [bug description]: [how it was fixed]

---

## Important Decisions Made

1. **[Decision]**: [reason for the decision]

---

## Key Reference Files

- **[Label]**: `path/to/file.py` - [description]

---

## Verified Selectors / Patterns

| Element | Selector/Pattern | Notes |
|---------|------------------|-------|
| [name]  | [selector]       | [notes] |

---

## Test Commands

```bash
# [description]
[command]
```
```

### Example

Here's a real example from my project:

```markdown
# Task Context Tracker

**Last Updated**: 2026-01-21
**Current Task Master Task**: Task 7 (Pending)

---

## Task Progress Summary

### Completed Tasks
- **Task 1**: Phase 1: Verify Selectors with Playwright MCP
- **Task 2**: Phase 2: Create SQLite Database Layer
- **Task 3**: Phase 3: Update Scraper Logic
- **Task 4**: Phase 4: Implement Multi-Context Parallel Scraping

### Pending Tasks
- **Task 7**: Test single script mode

---

## Session History (Chronological Order)

### Task 4: Multi-Context Parallel Scraping

**Goal**: Implement parallel scraping with multiple browser instances

**How it was done**:
1. Initially tried using multiple tabs in one BrowserContext
2. Discovered tabs interfered with each other (shared UI state)
3. Refactored to use isolated BrowserContexts per worker
4. Each worker creates its own context loaded from `session.json`

**Bugs Fixed**:
- **Clipboard permission dialog blocking scraping**: Added `context.grant_permissions(["clipboard-read", "clipboard-write"], origin="https://www.tradingview.com")`
- **Script name partial match**: "Trade Drawer" matched "Trade Drawer 2". Fixed with `exact=True` in `get_by_role()`

---

## Important Decisions Made

1. **Isolated BrowserContexts vs Tabs**: Chose isolated contexts over multiple tabs
   - Reason: Tabs in same context share UI state, causing workers to interfere

2. **No code validation**: Save all code regardless of length
   - User explicitly requested this to ensure no data is lost

---

## Key Reference Files

- **Parallel Scraper**: `src/parallel_scraper.py` - Multi-context orchestration
- **Single Scraper**: `src/scraper.py` - Core extraction logic
- **Database**: `src/database.py` - SQLite operations

---

## Verified Selectors

| Element | Selector | Notes |
|---------|----------|-------|
| Script name button | `div[role="button"]:has(h2)` | Not actual `<button>`, is `div` with role |
| Code textbox | `get_by_role("textbox", name="Editor content")` | Use `.last` for right panel |
| Recent script | `get_by_role("menuitemcheckbox", name=script_name, exact=True)` | Must use exact=True |

---

## Test Commands

```bash
# Parallel mode (default, 5 workers)
python -m src.main --no-pdf

# Single script only
python -m src.main --script "Premium Screener" --no-pdf

# Database commands (no browser needed)
python -m src.main --list
python -m src.main --status
```
```

---

## 4. Custom Slash Commands

### Location

`.claude/commands/`

### `/get-context`

**File:** `.claude/commands/get-context.md`

```markdown
Get context about what you did last by reading the @.claude\task-context.md file, the tasks via the task master ai MCP and the latest git commits
```

This tells Claude to:
1. Read the task-context.md file
2. Check Task Master for current task status
3. Look at recent git commits

### `/update-context`

**File:** `.claude/commands/update-context.md`

```markdown
---
description: Update the task-context.md file with current progress and notes
argument-hint: [what to update]
allowed-tools: Read, Write, Edit
---

You are updating the task context file to maintain session continuity.

Update instructions: $ARGUMENTS

## Task

1. Read the current `.claude/task-context.md` file
2. Update it based on the instructions: $ARGUMENTS
3. If no specific instructions provided, ask what should be updated:
   - Completed subtasks?
   - New accomplishments?
   - Current challenges/blockers?
   - Bugs that were fixed?
   - Important decisions made?
   - Next steps?

4. Update the "Last Updated" timestamp
5. Keep the format consistent and organized
6. Preserve all existing information unless explicitly asked to remove it

## Format Guidelines

Maintain these sections:
- **Current Task Master Task**: High-level task
- **Task Progress Summary**: Completed/In Progress/Pending subtasks
- **Recent Accomplishments**: What's been done
- **Current Challenges / Blockers**: What's blocking progress
- **Bugs Fixed**: Issues resolved
- **Important Decisions Made**: Architectural/design choices
- **Next Steps**: What to do next
- **Notes**: Additional context

## Important guidelines
- Do NOT hallucinate or make up information
- Only document what actually happened in this conversation
- Include actual error messages and code snippets where relevant
- Reference specific file paths and line numbers when applicable
- Keep the documentation concise but comprehensive
```

---

## 5. Workflow

### Setting Up a New Project

```
/init
```

Run this when starting a new project. It generates `CLAUDE.md` with project structure, commands, and patterns.

### After Major Project Changes

```
/init
```

Re-run `/init` when the project significantly changes (new modules, architectural shifts, major refactors). This regenerates `CLAUDE.md` to reflect the current state.

### Starting a New Session

```
/get-context
```

Claude reads the context file, checks Task Master, and knows exactly where you left off.

### During Work

I tell Claude Code to start a task or multiple tasks. For example:

- "Start working on task 7"
- "Let's do tasks 7.1 and 7.2"

Claude updates their statuses automatically:
- `pending` → `in-progress` when starting
- `in-progress` → `done` when completed

### When to Run `/update-context`

I run `/update-context` in three situations:

1. **At the end of a chat** - Before closing Claude Code
2. **When milestones are hit** - After completing a significant feature or fixing a tricky bug
3. **When context is about to be compacted** - When the conversation gets long and Claude warns about summarization

Example usage:

```
/update-context completed task 4, fixed clipboard permission bug, discovered need for exact=True on selectors
```

---

## 6. File Structure

```
project/
├── CLAUDE.md                    # Project instructions (generated by /init, auto-loaded)
├── .claude/
│   ├── task-context.md          # Session notes (THE KEY FILE)
│   └── commands/
│       ├── get-context.md       # /get-context command
│       └── update-context.md    # /update-context command
├── .taskmaster/
│   ├── tasks/
│   │   └── tasks.json           # Task database
│   └── config.json              # Task Master config
```

---

## Why This Works

| Component | What it handles |
|-----------|-----------------|
| **`/init` + CLAUDE.md** | Project basics - auto-loaded every session, re-run when project changes |
| **Task Master** | The "what" - structured task tracking with status |
| **task-context.md** | The "how" - implementation details, bugs, patterns |
| **Slash commands** | Frictionless access - one command to restore or save |

The combination means I can close Claude Code, come back days later, run `/get-context`, and Claude knows exactly what was working, what broke, and what to do next.
