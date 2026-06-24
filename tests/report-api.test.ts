import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import { describe, it } from "node:test";
import { InMemoryWeeklyReportRepository } from "../src/report/repository.js";
import { createApp } from "../src/server/app.js";

type JsonValue = Record<string, unknown>;

describe("weekly reports API", () => {
  it("creates, reads and lists reports", async () => {
    await withServer(async (baseUrl) => {
      const created = await requestJson<JsonValue>(
        `${baseUrl}/api/weekly-reports`,
        {
          method: "POST",
          body: JSON.stringify({
            author: "李雷",
            week: "2026-W26",
            completed: "完成 API 测试",
            plan: "补充 H5 页面",
            blocker: "",
          }),
        },
      );

      assert.equal(created.status, 201);
      assert.equal(created.body.author, "李雷");

      const detail = await requestJson<JsonValue>(
        `${baseUrl}/api/weekly-reports/${created.body.id}`,
      );

      assert.equal(detail.status, 200);
      assert.equal(detail.body.week, "2026-W26");

      const list = await requestJson<JsonValue[]>(
        `${baseUrl}/api/weekly-reports`,
      );

      assert.equal(list.status, 200);
      assert.equal(Array.isArray(list.body), true);
      assert.equal((list.body as JsonValue[]).length, 1);
    });
  });

  it("filters reports by author", async () => {
    await withServer(async (baseUrl) => {
      await createReport(baseUrl, "李雷", "2026-W26");
      await createReport(baseUrl, "韩梅梅", "2026-W27");

      const response = await requestJson<JsonValue[]>(
        `${baseUrl}/api/weekly-reports?author=${encodeURIComponent("李雷")}`,
      );

      assert.equal(response.status, 200);
      assert.equal((response.body as JsonValue[]).length, 1);
      assert.equal((response.body as JsonValue[])[0]?.author, "李雷");
    });
  });

  it("updates and deletes reports", async () => {
    await withServer(async (baseUrl) => {
      const created = await createReport(baseUrl, "王强", "2026-W26");

      const updated = await requestJson<JsonValue>(
        `${baseUrl}/api/weekly-reports/${created.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            author: "王强",
            week: "2026-W27",
            completed: "完成联调",
            plan: "整理证据",
            blocker: "暂无",
          }),
        },
      );

      assert.equal(updated.status, 200);
      assert.equal(updated.body.week, "2026-W27");

      const deleted = await requestJson<JsonValue>(
        `${baseUrl}/api/weekly-reports/${created.id}`,
        { method: "DELETE" },
      );

      assert.equal(deleted.status, 204);

      const missing = await requestJson<JsonValue>(
        `${baseUrl}/api/weekly-reports/${created.id}`,
      );

      assert.equal(missing.status, 404);
    });
  });

  it("returns validation errors and not-found responses", async () => {
    await withServer(async (baseUrl) => {
      const invalid = await requestJson<JsonValue>(
        `${baseUrl}/api/weekly-reports`,
        {
          method: "POST",
          body: JSON.stringify({
            author: "",
            week: "2026-W00",
            completed: "",
            plan: "",
            blocker: "",
          }),
        },
      );

      assert.equal(invalid.status, 400);
      assert.equal(invalid.body.error, "VALIDATION_ERROR");
      assert.deepEqual(invalid.body.messages, [
        "提交人不能为空",
        "周次格式必须为 YYYY-W01 至 YYYY-W53",
        "本周完成不能为空",
        "下周计划不能为空",
      ]);

      const missing = await requestJson<JsonValue>(
        `${baseUrl}/api/weekly-reports/missing`,
      );

      assert.equal(missing.status, 404);
      assert.equal(missing.body.error, "NOT_FOUND");
    });
  });

  it("rejects malformed report routes", async () => {
    await withServer(async (baseUrl) => {
      const created = await createReport(baseUrl, "李雷", "2026-W26");

      const response = await requestJson<JsonValue>(
        `${baseUrl}/api/weekly-reports/${created.id}/extra`,
      );

      assert.equal(response.status, 404);
      assert.equal(response.body.error, "NOT_FOUND");
    });
  });
});

async function withServer(
  callback: (baseUrl: string) => Promise<void>,
): Promise<void> {
  const app = createApp(new InMemoryWeeklyReportRepository());
  const server = app.listen(0);

  try {
    await new Promise<void>((resolve) => server.once("listening", resolve));
    const address = server.address() as AddressInfo;
    await callback(`http://127.0.0.1:${address.port}`);
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error?: Error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  }
}

async function createReport(
  baseUrl: string,
  author: string,
  week: string,
): Promise<JsonValue> {
  const response = await requestJson<JsonValue>(
    `${baseUrl}/api/weekly-reports`,
    {
      method: "POST",
      body: JSON.stringify({
        author,
        week,
        completed: "完成开发",
        plan: "准备验证",
        blocker: "",
      }),
    },
  );

  assert.equal(response.status, 201);
  return response.body;
}

async function requestJson<TBody = JsonValue | JsonValue[]>(
  url: string,
  init?: RequestInit,
): Promise<{ status: number; body: TBody }> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...init?.headers,
    },
  });

  if (response.status === 204) {
    return { status: response.status, body: {} as TBody };
  }

  return {
    status: response.status,
    body: (await response.json()) as TBody,
  };
}
