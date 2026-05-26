---
name: niko-example
description: A minimal example skill demonstrating the standard skill structure. Use as a template when creating new skills, or when user asks for "example", "示例", or "template skill".
version: 0.1.0
metadata:
  requires:
    anyBins:
      - bun
      - npx
---

# niko-example

A minimal example skill that demonstrates the standard structure for this repository. Use it as a starting point when creating new skills.

## User Input Tools

When this skill prompts the user, follow this tool-selection rule (priority order):

1. **Prefer built-in user-input tools** exposed by the current agent runtime — e.g., `AskUserQuestion`, `request_user_input`, `clarify`, `ask_user`, or any equivalent.
2. **Fallback**: if no such tool exists, emit a numbered plain-text message and ask the user to reply with the chosen number/answer for each question.
3. **Batching**: if the tool supports multiple questions per call, combine all applicable questions into a single call; if only single-question, ask them one at a time in priority order.

Concrete `AskUserQuestion` references below are examples — substitute the local equivalent in other runtimes.

## Script Directory

**Important**: All scripts are located in the `scripts/` subdirectory of this skill.

**Agent Execution Instructions**:
1. Determine this SKILL.md file's directory path as `{baseDir}`
2. Script path = `{baseDir}/scripts/main.ts`
3. Resolve `${BUN_X}` runtime: if `bun` installed → `bun`; if `npx` available → `npx -y bun`; else suggest installing bun
4. Replace all `{baseDir}` and `${BUN_X}` in this document with actual values

**Script Reference**:
| Script | Purpose |
|--------|---------|
| `scripts/main.ts` | Echoes a greeting message |

## Workflow

1. Ask the user for their name (or use "World" as default)
2. Run the script:
   ```bash
   ${BUN_X} {baseDir}/scripts/main.ts --name <name> [--json]
   ```
3. Display the greeting to the user

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--name` | Name to greet | `World` |
| `--json` | Output as JSON | `false` |

## Extension Support

No EXTEND.md configuration needed for this example skill.
