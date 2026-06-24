# 团队周报系统二版 - 项目地图

## 项目目标

本项目交付一个可运行、可验证、可追溯提交历史的团队周报 H5 系统。它不只要求页面可见，还必须证明工程流程完整执行过：先声明技术栈，再规划实现，再小步提交，最后沉淀证据文档、`SKILL.md` 和可选反思。

## 技术栈声明

- Node.js 24
- TypeScript
- Express：负责 JSON API 与静态 H5 文件服务
- 原生 H5：HTML、CSS、浏览器 JavaScript
- Node 内置 `node:test`：覆盖领域规则、仓储行为和 API 合同
- Biome：统一 lint 与格式约束
- 内存仓储：降低环境复杂度，避免把时间消耗在数据库安装与迁移上

这个版本刻意选择 Express，而不是第一版的 Node 内置 `http` 路由。功能目标一致，但工程表达、路由组织、错误响应与页面结构保持独立。

## 功能范围

### 周报字段

- `id`：系统生成
- `author`：提交人，必填
- `week`：周次，格式为 `YYYY-Www`，例如 `2026-W26`
- `completed`：本周完成事项，必填
- `plan`：下周计划，必填
- `blocker`：风险或阻塞，可为空
- `createdAt`：创建时间
- `updatedAt`：更新时间

### API

- `GET /api/weekly-reports`
- `GET /api/weekly-reports?author=<name>`
- `GET /api/weekly-reports/:id`
- `POST /api/weekly-reports`
- `PUT /api/weekly-reports/:id`
- `DELETE /api/weekly-reports/:id`

### H5 页面

- 左侧为周报列表与作者筛选
- 右侧为创建/编辑共用表单
- 支持保存、编辑、删除和清空筛选
- 不做营销首页，首屏直接进入可操作工作台

## 目录说明

- `src/report/model.ts`：周报类型、输入校验、实体创建与更新
- `src/report/repository.ts`：内存仓储接口与实现
- `src/server/app.ts`：Express 应用、API 路由、错误响应与静态资源服务
- `src/server/index.ts`：服务启动入口
- `public/index.html`：H5 页面结构
- `public/styles.css`：响应式工作台样式
- `public/main.js`：浏览器端交互与 API 调用
- `tests/*.test.ts`：领域、仓储、API 测试
- `docs/evidence.md`：6 项证据文档
- `SKILL.md`：可复用流程技能
- `reflection.md`：可选 200 字对比反思

## 命令入口

- 安装依赖：`pnpm install`
- 构建：`pnpm build`
- 启动：`pnpm start`
- 开发运行：`pnpm dev`
- 测试：`pnpm test`
- 类型检查：`pnpm typecheck`
- Lint：`pnpm lint`

## 风险预警

- 不能只完成 H5 外观，API、测试、证据和提交历史同样是验收对象。
- `week` 正则不能过宽，`2026-W00` 与 `2026-W99` 都应拒绝。
- 单次 commit 不应堆太多文件，否则“小步提交”证据会变弱。
- 证据文档必须贴真实命令输出和退出码，不能用“已验证”替代。
- 内存仓储意味着服务重启后数据清空，这是本作业的有意取舍，应在文档里声明。
