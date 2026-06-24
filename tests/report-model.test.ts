import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createWeeklyReport,
  updateWeeklyReport,
  validateWeeklyReportInput,
} from "../src/report/model.js";

describe("weekly report model", () => {
  it("creates a report with generated metadata", () => {
    const report = createWeeklyReport({
      author: "李雷",
      week: "2026-W26",
      completed: "完成登录页联调",
      plan: "推进周报列表页",
      blocker: "等待接口字段确认",
    });

    assert.match(report.id, /^weekly-/);
    assert.equal(report.author, "李雷");
    assert.equal(report.week, "2026-W26");
    assert.equal(report.completed, "完成登录页联调");
    assert.equal(report.plan, "推进周报列表页");
    assert.equal(report.blocker, "等待接口字段确认");
    assert.equal(report.createdAt, report.updatedAt);
  });

  it("rejects blank author", () => {
    const result = validateWeeklyReportInput({
      author: " ",
      week: "2026-W26",
      completed: "完成需求梳理",
      plan: "继续开发",
      blocker: "",
    });

    assert.equal(result.ok, false);
    assert.deepEqual(result.errors, ["提交人不能为空"]);
  });

  it("rejects week numbers outside ISO range", () => {
    const result = validateWeeklyReportInput({
      author: "韩梅梅",
      week: "2026-W99",
      completed: "完成样式调整",
      plan: "补充测试",
      blocker: "",
    });

    assert.equal(result.ok, false);
    assert.deepEqual(result.errors, ["周次格式必须为 YYYY-W01 至 YYYY-W53"]);
  });

  it("rejects missing completed and plan content", () => {
    const result = validateWeeklyReportInput({
      author: "韩梅梅",
      week: "2026-W26",
      completed: "",
      plan: " ",
      blocker: "",
    });

    assert.equal(result.ok, false);
    assert.deepEqual(result.errors, ["本周完成不能为空", "下周计划不能为空"]);
  });

  it("updates editable fields and refreshes updatedAt", () => {
    const original = createWeeklyReport({
      author: "王强",
      week: "2026-W25",
      completed: "完成 API 初稿",
      plan: "补充异常分支",
      blocker: "",
    });

    const updated = updateWeeklyReport(original, {
      author: "王强",
      week: "2026-W26",
      completed: "完成 API 测试",
      plan: "准备演示",
      blocker: "暂无",
    });

    assert.equal(updated.id, original.id);
    assert.equal(updated.createdAt, original.createdAt);
    assert.equal(updated.week, "2026-W26");
    assert.equal(updated.completed, "完成 API 测试");
    assert.equal(updated.blocker, "暂无");
    assert.notEqual(updated.updatedAt, "");
  });
});
