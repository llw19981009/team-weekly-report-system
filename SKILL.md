---
name: weekly-report-express-h5-flow
description: 用 Express、TypeScript 和原生 H5 完成最小团队周报系统，并按作业要求沉淀地图、计划、小步提交、验证证据和复用流程。
---

# 团队周报系统二版流程技能

## 适用边界

适用于两小时左右的最小 CRUD/H5 作业，尤其是要求同时交付项目地图、计划文档、Git 历史、命令证据、review findings 和截图的场景。不适用于真实生产权限、多租户、复杂审批流、真实数据库迁移或个人敏感信息处理系统。

## 技术栈建议

优先选择低环境风险技术栈。本技能示例使用：

- Node.js 24
- TypeScript
- Express
- 原生 H5
- Node 内置 `node:test`
- Biome
- 内存仓储

如果题目允许自由技术栈，必须先声明选择理由。选择 Express 的理由是路由清晰、学习成本低、API 测试容易落地；选择内存仓储的理由是降低数据库安装和迁移风险。

## 强制流程

1. 先读题并拆分功能要求和流程要求，不能只做页面。
2. 先写 `AGENTS.md` 项目地图，替代题目中的 `CLAUDE.md`。
3. 在计划文档中声明技术栈、文件清单、实现路径、失败点和验证命令。
4. 按测试优先推进领域模型、仓储和 API。
5. 单次 commit 尽量不超过 3 个文件，方便证明小步提交。
6. H5 页面直接进入工作台，不做营销首页。
7. API 至少覆盖列表、筛选、详情、创建、更新、删除、校验失败和 404。
8. 验证阶段必须运行 `pnpm test`、`pnpm typecheck`、`pnpm lint`，并记录真实退出码。
9. 截图必须来自实际页面，不用 mock 图片替代。
10. `docs/evidence.md` 按 6 项证据顺序整理输出。

## 输出清单

- `AGENTS.md`
- `docs/superpowers/plans/<日期>-<主题>.md`
- `src/**`
- `public/**`
- `tests/**`
- `docs/evidence.md`
- `docs/screenshots/h5-home.png`
- `SKILL.md`
- `reflection.md`

## 常见翻车点

- 只提交 H5，没有后端 API。
- 只写“已验证”，没有命令输出和退出码。
- `week` 正则接受 `W00` 或 `W99`。
- 一次 commit 塞入大量文件，导致小步提交证据不足。
- `SKILL.md` 写成个人感想，而不是可复用流程。
- 删除、更新接口只测成功路径，遗漏 404 和校验失败。
- 截图来自设计稿或空白页，而不是本地可运行页面。
