# niko-skills

Niko 的日常工作 Skill 合集，基于 Claude Code 插件体系发布。

## 安装

### 通过 npx（推荐）

```bash
npx skills add ai-super-niko/niko-skills
```

### 通过 Claude Code 插件市场

```bash
/plugin marketplace add ai-super-niko/niko-skills
```

## Skill 列表

| Skill | 说明 |
|-------|------|
| [niko-skill-repo](skills/niko-skill-repo/SKILL.md) | 一键脚手架：生成一个全新的空 Skill 仓库，开箱即用支持 Claude Code 插件市场与 `npx skills add` 安装。 |

## 仓库结构

```
.
├── .claude-plugin/marketplace.json   # 插件清单（注册所有 Skill）
├── skills/                           # 每个 Skill 一个独立目录
│   └── niko-skill-repo/
├── docs/creating-skills.md           # 新增 Skill 指南
├── packages/                         # 共享包预留目录
├── CLAUDE.md                         # Claude Code 项目指令
├── CHANGELOG.md / CHANGELOG.zh.md
└── README.md / README.zh.md
```

## 运行方式

TypeScript 通过 Bun 直接执行，无需构建步骤。会话中先一次性识别运行时：

```bash
if command -v bun &>/dev/null; then BUN_X="bun"
elif command -v npx &>/dev/null; then BUN_X="npx -y bun"
else echo "请先安装 bun: brew install oven-sh/bun/bun 或 npm install -g bun"; exit 1; fi
```

执行任意 Skill 脚本：

```bash
${BUN_X} skills/<skill>/scripts/main.ts [options]
```

## 新增 Skill

1. 所有 Skill 必须使用 `niko-` 前缀
2. 在 `skills/niko-<name>/SKILL.md` 写好 YAML frontmatter 与说明
3. 把脚本放在 `skills/niko-<name>/scripts/` 下
4. 在 `.claude-plugin/marketplace.json` 的 `skills` 数组里注册新路径

完整规范见 [docs/creating-skills.md](docs/creating-skills.md)。

## 发布流程

1. 更新 `CHANGELOG.md` 与 `CHANGELOG.zh.md`
2. 同步 `marketplace.json` 中的版本号
3. 必要时同步 `README.md` 与 `README.zh.md`
4. 一并提交所有改动后再打 tag

## 许可证

MIT
