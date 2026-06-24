import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { InMemoryWeeklyReportRepository } from "../src/report/repository.js";

describe("InMemoryWeeklyReportRepository", () => {
  it("creates reports and lists newest first", () => {
    const repository = new InMemoryWeeklyReportRepository();

    const first = repository.create({
      author: "李雷",
      week: "2026-W25",
      completed: "完成原型",
      plan: "补充接口",
      blocker: "",
    });
    const second = repository.create({
      author: "韩梅梅",
      week: "2026-W26",
      completed: "完成测试",
      plan: "准备验收",
      blocker: "",
    });

    assert.deepEqual(
      repository.list().map((report) => report.id),
      [second.id, first.id],
    );
  });

  it("filters reports by trimmed author", () => {
    const repository = new InMemoryWeeklyReportRepository();
    repository.create({
      author: "李雷",
      week: "2026-W25",
      completed: "完成原型",
      plan: "补充接口",
      blocker: "",
    });
    repository.create({
      author: "韩梅梅",
      week: "2026-W26",
      completed: "完成测试",
      plan: "准备验收",
      blocker: "",
    });

    const reports = repository.list(" 李雷 ");

    assert.equal(reports.length, 1);
    assert.equal(reports[0]?.author, "李雷");
  });

  it("finds, updates and deletes a report", () => {
    const repository = new InMemoryWeeklyReportRepository();
    const created = repository.create({
      author: "王强",
      week: "2026-W26",
      completed: "完成接口",
      plan: "联调页面",
      blocker: "",
    });

    const updated = repository.update(created.id, {
      author: "王强",
      week: "2026-W27",
      completed: "完成联调",
      plan: "准备演示",
      blocker: "暂无",
    });

    assert.equal(updated?.week, "2026-W27");
    assert.equal(repository.find(created.id)?.blocker, "暂无");
    assert.equal(repository.delete(created.id), true);
    assert.equal(repository.find(created.id), undefined);
  });

  it("returns undefined or false for missing reports", () => {
    const repository = new InMemoryWeeklyReportRepository();

    assert.equal(repository.find("missing"), undefined);
    assert.equal(
      repository.update("missing", {
        author: "李雷",
        week: "2026-W26",
        completed: "完成原型",
        plan: "补充接口",
        blocker: "",
      }),
      undefined,
    );
    assert.equal(repository.delete("missing"), false);
  });
});
