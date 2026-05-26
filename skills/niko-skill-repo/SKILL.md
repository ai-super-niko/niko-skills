---
name: niko-skill-repo
description: Scaffolds a new empty skill repository compatible with Claude Code plugin marketplace and npx installation. Use when user asks to "create a skill repo", "scaffold a skills project", "new skill repository", "init skills repo", "脚手架", or "新建 skill 仓库".
version: 0.1.0
metadata:
  requires:
    anyBins:
      - bun
      - npx
---

# niko-skill-repo

Generates a complete, empty skill repository that supports both Claude Code plugin marketplace (`npx skills add`) and direct plugin installation. The generated repo includes marketplace.json, package.json, CLAUDE.md, release config, CI workflow, and documentation templates — ready for the user to add their first skill.

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
| `scripts/main.ts` | Generates the scaffold repository |

## Workflow

### Step 1 — Load Preferences (EXTEND.md)

Check EXTEND.md in priority order — the first one found wins:

| Priority | Path | Scope |
|----------|------|-------|
| 1 | `{baseDir}/EXTEND.md` | Same directory as SKILL.md |
| 2 | `${XDG_CONFIG_HOME:-$HOME/.config}/niko-skill-repo/EXTEND.md` | XDG user config |
| 3 | `$HOME/.niko-skill-repo/EXTEND.md` | User home fallback |

**EXTEND.md supported fields** (YAML or markdown list):
- `default_owner` — Owner display name
- `default_email` — Owner email
- `default_github_owner` — GitHub org or username
- `default_prefix` — Default skill prefix for generated repos (e.g., `my-`)
- `default_workspace_dir` — Parent directory for new repos (e.g., `~/workspace`)

| Result | Action |
|--------|--------|
| Found | Read, parse, use values as defaults for Step 2 |
| Not found | Proceed with no defaults; ask all fields in Step 2 |

### Step 2 — Gather Configuration

Ask the user (batch into a single call if possible):

1. **Repository name** — lowercase, hyphens allowed (e.g., `my-skills`)
2. **Owner display name** — shown in marketplace.json (e.g., `Jane Doe`)
3. **Owner email** — shown in marketplace.json
4. **GitHub owner** — org or username, used for `npx skills add {githubOwner}/{name}`
5. **Description** — one sentence describing the skill collection
6. **Skill prefix** — prefix for skills in the generated repo (e.g., `my-`, `acme-`); must end with `-`
7. **Target directory** — where to create the repo. Suggest:
   - `{default_workspace_dir}/{name}` (if EXTEND.md provides workspace dir)
   - `./{name}` (current working directory)
   - Custom path

### Step 3 — Confirm

Display a summary showing:
- All configuration values
- Target path (absolute)
- List of files that will be created

Ask user to confirm before proceeding.

### Step 4 — Execute Script

```bash
${BUN_X} {baseDir}/scripts/main.ts \
  --name <repo-name> \
  --owner <owner-name> \
  --email <owner-email> \
  --description <description> \
  --target <absolute-path> \
  --prefix <skill-prefix> \
  --github-owner <github-owner> \
  --json
```

### Step 5 — Report Results

Parse the JSON output. Report to user:
- Repository path
- Number of files created
- Whether git was initialized
- Next steps:
  1. `cd {path}`
  2. Edit `CLAUDE.md` to customize project instructions
  3. Create first skill under `skills/{prefix}<name>/`
  4. Push to GitHub: `git remote add origin ...` + `git push -u origin main`

## Generated Structure

The script creates the following files in the target directory:

| File | Description |
|------|-------------|
| `.claude-plugin/marketplace.json` | Plugin manifest (version 0.1.0, empty skills array) |
| `package.json` | Private monorepo root (type: module, workspaces) |
| `CLAUDE.md` | Project instructions for Claude Code |
| `README.md` | English readme with installation instructions |
| `README.zh.md` | Chinese readme |
| `CHANGELOG.md` | English changelog |
| `CHANGELOG.zh.md` | Chinese changelog |
| `.releaserc.yml` | Release config targeting `skills/*` |
| `.gitignore` | Standard Node.js gitignore |
| `docs/creating-skills.md` | Guide for adding new skills |
| `.github/workflows/test.yml` | Minimal CI workflow |
| `skills/.gitkeep` | Placeholder for skills directory |
| `packages/.gitkeep` | Placeholder for shared packages |

## Extension Support

Custom configurations via EXTEND.md. See **Step 1** for paths and supported options.
