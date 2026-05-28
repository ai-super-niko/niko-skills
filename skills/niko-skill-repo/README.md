# niko-skill-repo

一键脚手架工具，生成一个全新的空 Skill 仓库，开箱即用支持 Claude Code 插件市场与 `npx skills add` 安装。

## 功能

- 生成完整的 Skill 仓库结构（13 个文件）
- 自动初始化 Git 仓库并创建首次提交
- 支持自定义 Skill 前缀、GitHub owner、仓库描述等
- 生成的仓库即刻可用，无需额外配置

## 使用方式

安装 `niko-skills` 插件后，在 Claude Code 中说：

- "创建一个 skill 仓库"
- "scaffold a skills project"
- "新建 skill 仓库"
- "脚手架"

Skill 会引导你填写仓库名称、owner 信息、描述、前缀等，确认后自动生成。

## 生成的文件

| 文件 | 说明 |
|------|------|
| `.claude-plugin/marketplace.json` | 插件清单 |
| `package.json` | Node.js monorepo 根配置 |
| `CLAUDE.md` | Claude Code 项目指令 |
| `README.md` / `README.zh.md` | 中英文文档 |
| `CHANGELOG.md` / `CHANGELOG.zh.md` | 中英文更新日志 |
| `.releaserc.yml` | 发布自动化配置 |
| `.gitignore` | 标准 Node.js 忽略规则 |
| `docs/creating-skills.md` | 新增 Skill 指南 |
| `.github/workflows/test.yml` | GitHub Actions CI |
| `skills/.gitkeep` | Skills 目录占位 |
| `packages/.gitkeep` | 共享包目录占位 |

## 配置持久化（EXTEND.md）

可通过 EXTEND.md 预设默认值，避免每次重复输入。按优先级查找：

1. Skill 目录下的 `EXTEND.md`
2. `${XDG_CONFIG_HOME:-$HOME/.config}/niko-skill-repo/EXTEND.md`
3. `$HOME/.niko-skill-repo/EXTEND.md`

支持字段：

```yaml
default_owner: Niko
default_email: hello@niko.dev
default_github_owner: ai-super-niko
default_prefix: niko-
default_workspace_dir: ~/workspace
```

## 依赖

需要 `bun` 或 `npx`（会自动检测）。

## 许可证

MIT
