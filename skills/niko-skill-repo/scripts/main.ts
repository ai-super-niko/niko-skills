#!/usr/bin/env bun
import { existsSync, mkdirSync, readdirSync, writeFileSync } from "fs";
import { join, resolve } from "path";
import { execSync } from "child_process";

interface Options {
  name: string;
  owner: string;
  email: string;
  description: string;
  target: string;
  prefix: string;
  githubOwner: string;
  noGit: boolean;
  json: boolean;
}

function parseArgs(): Options {
  const args = process.argv.slice(2);
  const get = (flag: string): string | undefined => {
    const i = args.indexOf(flag);
    return i >= 0 && i + 1 < args.length ? args[i + 1] : undefined;
  };
  const has = (flag: string) => args.includes(flag);

  if (has("--help") || has("-h")) {
    console.log(`Usage: main.ts --name <name> --owner <owner> --email <email> --description <desc> --target <path> --prefix <prefix> --github-owner <gh> [--no-git] [--json]`);
    process.exit(0);
  }

  const name = get("--name");
  const owner = get("--owner");
  const email = get("--email");
  const description = get("--description");
  const target = get("--target");
  const prefix = get("--prefix");
  const githubOwner = get("--github-owner");

  if (!name || !owner || !email || !description || !target || !prefix || !githubOwner) {
    const missing = [
      !name && "--name", !owner && "--owner", !email && "--email",
      !description && "--description", !target && "--target",
      !prefix && "--prefix", !githubOwner && "--github-owner",
    ].filter(Boolean);
    error("missing_args", `Missing required arguments: ${missing.join(", ")}`);
  }

  return {
    name: name!, owner: owner!, email: email!,
    description: description!, target: resolve(target!),
    prefix: prefix!, githubOwner: githubOwner!,
    noGit: has("--no-git"), json: has("--json"),
  };
}
// PLACEHOLDER_CONTINUE

function error(kind: string, message: string): never {
  console.error(JSON.stringify({ status: "error", error_kind: kind, message }));
  process.exit(1);
}

function validate(opts: Options): void {
  if (!/^[a-z][a-z0-9-]*$/.test(opts.name)) {
    error("invalid_name", "Name must be lowercase letters, numbers, and hyphens, starting with a letter");
  }
  if (!/^[a-z][a-z0-9-]*-$/.test(opts.prefix)) {
    error("invalid_prefix", "Prefix must be lowercase, end with '-' (e.g., 'my-', 'acme-')");
  }
  if (existsSync(opts.target)) {
    const entries = readdirSync(opts.target);
    if (entries.length > 0) {
      error("target_exists", `Target directory is not empty: ${opts.target}`);
    }
  }
}

// --- Templates ---

function marketplaceJson(o: Options): string {
  return JSON.stringify({
    name: o.name,
    owner: { name: o.owner, email: o.email },
    metadata: { description: o.description, version: "0.1.0" },
    plugins: [{
      name: o.name,
      description: o.description,
      source: "./",
      strict: false,
      skills: [],
    }],
  }, null, 2) + "\n";
}

function packageJson(o: Options): string {
  return JSON.stringify({
    name: o.name,
    private: true,
    type: "module",
    workspaces: ["packages/*"],
    scripts: { test: "echo \"No tests configured yet\"" },
  }, null, 2) + "\n";
}
// PLACEHOLDER_TEMPLATES

function claudeMd(o: Options): string {
  return `# CLAUDE.md

${o.description}. Version: **0.1.0**.

## Architecture

Skills are exposed through the single \`${o.name}\` plugin in \`.claude-plugin/marketplace.json\`. Each skill is a self-contained directory under \`skills/\`.

## Running Skills

TypeScript via Bun (no build step). Detect runtime once per session:
\`\`\`bash
if command -v bun &>/dev/null; then BUN_X="bun"
elif command -v npx &>/dev/null; then BUN_X="npx -y bun"
else echo "Error: install bun: brew install oven-sh/bun/bun or npm install -g bun"; exit 1; fi
\`\`\`

Execute: \`\${BUN_X} skills/<skill>/scripts/main.ts [options]\`

## Skill Self-Containment

Each skill under \`skills/\` is distributed and consumed independently. Never link from \`SKILL.md\` or its \`references/\` to files outside the skill's own directory.

## Adding New Skills

All skills MUST use \`${o.prefix}\` prefix. See [docs/creating-skills.md](docs/creating-skills.md) for details.

## Release Process

1. Update \`CHANGELOG.md\` + \`CHANGELOG.zh.md\`
2. Bump version in \`marketplace.json\`
3. Update \`README.md\` + \`README.zh.md\` if applicable
4. Commit all files together before tag

## Code Style

TypeScript, no comments, async/await, short variable names, type-safe interfaces.
`;
}

function readmeMd(o: Options): string {
  return `# ${o.name}

${o.description}

## Installation

### Via npx (recommended)

\`\`\`bash
npx skills add ${o.githubOwner}/${o.name}
\`\`\`

### Via Claude Code plugin marketplace

\`\`\`bash
/plugin marketplace add ${o.githubOwner}/${o.name}
\`\`\`

## Skills

No skills yet. See [docs/creating-skills.md](docs/creating-skills.md) for how to add one.

## License

MIT
`;
}
// PLACEHOLDER_MORE_TEMPLATES

function readmeZhMd(o: Options): string {
  return `# ${o.name}

${o.description}

## 安装

### 通过 npx（推荐）

\`\`\`bash
npx skills add ${o.githubOwner}/${o.name}
\`\`\`

### 通过 Claude Code 插件市场

\`\`\`bash
/plugin marketplace add ${o.githubOwner}/${o.name}
\`\`\`

## Skills

暂无。参见 [docs/creating-skills.md](docs/creating-skills.md) 了解如何添加。

## 许可证

MIT
`;
}

function changelogMd(): string {
  return `# Changelog

## 0.1.0

- Initial scaffold
`;
}

function changelogZhMd(): string {
  return `# 更新日志

## 0.1.0

- 初始脚手架
`;
}

function releaseRcYml(): string {
  return `release:
  target_globs:
    - skills/*
`;
}

function gitignoreTpl(): string {
  return `node_modules/
dist/
.env
.env.*
.DS_Store
*.log
coverage/
.bun/
`;
}
// PLACEHOLDER_FINAL_TEMPLATES

function creatingSkillsMd(o: Options): string {
  return `# Creating New Skills

## Key Requirements

| Requirement | Details |
|-------------|---------|
| **Prefix** | All skills MUST use \`${o.prefix}\` prefix |
| **name field** | Max 64 chars, lowercase letters/numbers/hyphens only |
| **description** | Max 1024 chars, third person, include what + when to use |
| **SKILL.md body** | Keep under 500 lines; use \`references/\` for additional content |
| **References** | One level deep from SKILL.md; avoid nested references |

## SKILL.md Frontmatter Template

\`\`\`yaml
---
name: ${o.prefix}<name>
description: <Third-person description. What it does + when to use it.>
version: <semver matching marketplace.json>
metadata:
  requires:
    anyBins:
      - bun
      - npx
---
\`\`\`

## Steps

1. Create \`skills/${o.prefix}<name>/SKILL.md\` with YAML front matter
2. Add TypeScript in \`skills/${o.prefix}<name>/scripts/\` (if applicable)
3. Add reference docs in \`skills/${o.prefix}<name>/references/\` if needed
4. Register the skill in \`.claude-plugin/marketplace.json\` under the plugin's skills array

## Script Directory Template

Every SKILL.md with scripts MUST include:

\`\`\`markdown
## Script Directory

**Important**: All scripts are located in the \\\`scripts/\\\` subdirectory of this skill.

**Agent Execution Instructions**:
1. Determine this SKILL.md file's directory path as \\\`{baseDir}\\\`
2. Script path = \\\`{baseDir}/scripts/<script-name>.ts\\\`
3. Resolve \\\`\${BUN_X}\\\` runtime: if \\\`bun\\\` installed → \\\`bun\\\`; if \\\`npx\\\` available → \\\`npx -y bun\\\`; else suggest installing bun
4. Replace all \\\`{baseDir}\\\` and \\\`\${BUN_X}\\\` in this document with actual values
\`\`\`

## Writing Descriptions

Write in third person:

\`\`\`yaml
# Good
description: Generates cover images for blog posts. Use when user asks for "cover image" or "blog header".

# Bad
description: I can help you create cover images
\`\`\`
`;
}

function testWorkflowYml(): string {
  return `name: Test
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm test
`;
}

// --- Scaffold ---

function scaffold(opts: Options): number {
  const t = opts.target;
  const dirs = [
    t,
    join(t, ".claude-plugin"),
    join(t, "skills"),
    join(t, "packages"),
    join(t, "docs"),
    join(t, ".github", "workflows"),
  ];
  for (const d of dirs) mkdirSync(d, { recursive: true });

  const files: [string, string][] = [
    [join(t, ".claude-plugin", "marketplace.json"), marketplaceJson(opts)],
    [join(t, "package.json"), packageJson(opts)],
    [join(t, "CLAUDE.md"), claudeMd(opts)],
    [join(t, "README.md"), readmeMd(opts)],
    [join(t, "README.zh.md"), readmeZhMd(opts)],
    [join(t, "CHANGELOG.md"), changelogMd()],
    [join(t, "CHANGELOG.zh.md"), changelogZhMd()],
    [join(t, ".releaserc.yml"), releaseRcYml()],
    [join(t, ".gitignore"), gitignoreTpl()],
    [join(t, "docs", "creating-skills.md"), creatingSkillsMd(opts)],
    [join(t, ".github", "workflows", "test.yml"), testWorkflowYml()],
    [join(t, "skills", ".gitkeep"), ""],
    [join(t, "packages", ".gitkeep"), ""],
  ];

  for (const [path, content] of files) writeFileSync(path, content, "utf-8");
  return files.length;
}

function initGit(target: string): boolean {
  try {
    execSync("git --version", { stdio: "ignore" });
  } catch {
    return false;
  }
  try {
    execSync("git init", { cwd: target, stdio: "ignore" });
    execSync("git add -A", { cwd: target, stdio: "ignore" });
    execSync('git commit -m "chore: initial scaffold"', { cwd: target, stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

// --- Main ---

function main() {
  const opts = parseArgs();
  validate(opts);
  const fileCount = scaffold(opts);
  const gitOk = opts.noGit ? false : initGit(opts.target);

  const result = { status: "ok", path: opts.target, files: fileCount, git: gitOk };
  if (opts.json) {
    console.log(JSON.stringify(result));
  } else {
    console.log(`Created ${fileCount} files in ${opts.target}`);
    if (gitOk) console.log("Git repository initialized with initial commit.");
    else if (!opts.noGit) console.log("Warning: git init failed or git not available.");
    console.log(`\nNext steps:\n  cd ${opts.target}\n  # Create your first skill under skills/${opts.prefix}<name>/`);
  }
}

main();
