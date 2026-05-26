# CLAUDE.md

Niko's skill collection for daily work. Version: **0.1.0**.

## Architecture

Skills are exposed through the single `niko-skills` plugin in `.claude-plugin/marketplace.json`. Each skill is a self-contained directory under `skills/`.

## Running Skills

TypeScript via Bun (no build step). Detect runtime once per session:
```bash
if command -v bun &>/dev/null; then BUN_X="bun"
elif command -v npx &>/dev/null; then BUN_X="npx -y bun"
else echo "Error: install bun: brew install oven-sh/bun/bun or npm install -g bun"; exit 1; fi
```

Execute: `${BUN_X} skills/<skill>/scripts/main.ts [options]`

## Skill Self-Containment

Each skill under `skills/` is distributed and consumed independently. Never link from `SKILL.md` or its `references/` to files outside the skill's own directory.

## Adding New Skills

All skills MUST use `niko-` prefix. See [docs/creating-skills.md](docs/creating-skills.md) for details.

## Release Process

1. Update `CHANGELOG.md` + `CHANGELOG.zh.md`
2. Bump version in `marketplace.json`
3. Update `README.md` + `README.zh.md` if applicable
4. Commit all files together before tag

## Code Style

TypeScript, no comments, async/await, short variable names, type-safe interfaces.
