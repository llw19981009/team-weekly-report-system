# 团队周报系统二版实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: 使用 `superpowers:executing-plans` 按任务执行。每个任务完成后运行对应验证命令，并以小步 commit 固化结果。

**Goal:** 完成一套与第一版功能一致、但技术栈和实现细节不同的团队周报 H5 系统。

**Architecture:** 单个 Express 应用同时提供 JSON API 与静态 H5 页面。业务规则集中在 `src/report/model.ts`，数据暂存在内存仓储中，H5 使用原生 JavaScript 调用 REST API。

**Tech Stack:** Node.js 24、TypeScript、Express、原生 H5、`node:test`、Biome、内存仓储。

---

## 任务 1：项目地图与计划

**Files:**
- Create: `AGENTS.md`
- Create: `docs/superpowers/plans/2026-06-24-weekly-report-system-v2.md`

- [ ] 写明技术栈、功能范围、API、目录职责、命令入口和风险预警。
- [ ] 提交：`docs: add project map and v2 plan`

## 任务 2：工具链

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `biome.json`
- Create: `.gitignore`

- [ ] 声明 npm scripts：`build`、`start`、`dev`、`test`、`typecheck`、`lint`。
- [ ] 安装 Express、TypeScript、Biome、Node/Express 类型。
- [ ] 运行 `pnpm install` 生成锁文件。
- [ ] 提交：`chore: add express typescript toolchain`

## 任务 3：领域模型

**Files:**
- Create: `tests/report-model.test.ts`
- Create: `src/report/model.ts`

- [ ] 先写失败测试：创建有效周报、拒绝空作者、拒绝非法周次、拒绝缺失完成事项。
- [ ] 实现 `createWeeklyReport`、`updateWeeklyReport`、`validateWeeklyReportInput`。
- [ ] 运行 `pnpm test`。
- [ ] 提交：`feat: add weekly report domain rules`

## 任务 4：内存仓储

**Files:**
- Create: `tests/report-repository.test.ts`
- Create: `src/report/repository.ts`

- [ ] 先写失败测试：新增、列表倒序、按作者筛选、更新、删除、查无结果。
- [ ] 实现 `InMemoryWeeklyReportRepository`。
- [ ] 运行 `pnpm test`。
- [ ] 提交：`feat: add in-memory weekly report repository`

## 任务 5：API

**Files:**
- Create: `tests/report-api.test.ts`
- Create: `src/server/app.ts`
- Create: `src/server/index.ts`

- [ ] 先写失败测试：列表、筛选、详情、创建、更新、删除、校验错误、404、畸形路径。
- [ ] 实现 Express 路由与 JSON 错误响应。
- [ ] 运行 `pnpm test`。
- [ ] 提交：`feat: add weekly report express api`

## 任务 6：H5 页面

**Files:**
- Create: `public/index.html`
- Create: `public/styles.css`
- Create: `public/main.js`

- [ ] 实现左侧列表、作者筛选、右侧共用表单、编辑、删除。
- [ ] 使用不同于第一版的布局与视觉细节。
- [ ] 运行 H5 smoke 检查首页和 API 状态。
- [ ] 提交：`feat: add h5 weekly report workspace`

## 任务 7：证据与沉淀

**Files:**
- Create: `docs/evidence.md`
- Create: `SKILL.md`
- Create: `reflection.md`
- Create: `docs/screenshots/h5-home.png`

- [ ] 运行 `pnpm test`、`pnpm typecheck`、`pnpm lint` 并记录退出码。
- [ ] 截取 H5 首页。
- [ ] 记录 `git log --oneline` 和每次提交文件数。
- [ ] 做一次独立 review，修复 P0/P1 问题。
- [ ] 写中文证据文档、中文 `SKILL.md`、中文反思。
- [ ] 提交：`docs: add evidence skill and reflection`

## 验收清单

- [ ] Git 历史为多次小步提交，不能 squash。
- [ ] H5 页面可访问并可完成基本 CRUD。
- [ ] API 覆盖列表、筛选、详情、创建、更新、删除。
- [ ] 测试、类型检查、lint 均有真实输出和退出码。
- [ ] 证据文档按 6 项顺序整理截图与输出。
- [ ] `AGENTS.md` 替代题目中的 `CLAUDE.md`。
- [ ] `SKILL.md` 面向复用流程，而不是流水账总结。
