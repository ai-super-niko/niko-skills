# Creating New Skills

## Key Requirements

| Requirement | Details |
|-------------|---------|
| **Prefix** | All skills MUST use `niko-` prefix |
| **name field** | Max 64 chars, lowercase letters/numbers/hyphens only |
| **description** | Max 1024 chars, third person, include what + when to use |
| **SKILL.md body** | Keep under 500 lines; use `references/` for additional content |
| **References** | One level deep from SKILL.md; avoid nested references |

## SKILL.md Frontmatter Template

```yaml
---
name: niko-<name>
description: <Third-person description. What it does + when to use it.>
version: <semver matching marketplace.json>
metadata:
  requires:
    anyBins:
      - bun
      - npx
---
```

## Steps

1. Create `skills/niko-<name>/SKILL.md` with YAML front matter
2. Add TypeScript in `skills/niko-<name>/scripts/` (if applicable)
3. Add reference docs in `skills/niko-<name>/references/` if needed
4. Register the skill in `.claude-plugin/marketplace.json` under the plugin's skills array

## Script Directory Template

Every SKILL.md with scripts MUST include:

```markdown
## Script Directory

**Important**: All scripts are located in the \`scripts/\` subdirectory of this skill.

**Agent Execution Instructions**:
1. Determine this SKILL.md file's directory path as \`{baseDir}\`
2. Script path = \`{baseDir}/scripts/<script-name>.ts\`
3. Resolve \`${BUN_X}\` runtime: if \`bun\` installed → \`bun\`; if \`npx\` available → \`npx -y bun\`; else suggest installing bun
4. Replace all \`{baseDir}\` and \`${BUN_X}\` in this document with actual values
```

## Writing Descriptions

Write in third person:

```yaml
# Good
description: Generates cover images for blog posts. Use when user asks for "cover image" or "blog header".

# Bad
description: I can help you create cover images
```
