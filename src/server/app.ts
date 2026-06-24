import { join } from "node:path";
import express, { type Response } from "express";
import type { WeeklyReportInput } from "../report/model.js";
import { InMemoryWeeklyReportRepository } from "../report/repository.js";

type ErrorCode = "VALIDATION_ERROR" | "NOT_FOUND" | "BAD_REQUEST";

export function createApp(
  repository = new InMemoryWeeklyReportRepository(),
): express.Express {
  const app = express();

  app.use(express.json());

  app.get("/api/weekly-reports", (request, response) => {
    const author = readQueryString(request.query.author);
    response.json(repository.list(author));
  });

  app.post("/api/weekly-reports", (request, response) => {
    const input = readReportInput(request.body);
    const validation = validateInputShape(input, response);

    if (!validation) {
      return;
    }

    try {
      response.status(201).json(repository.create(input));
    } catch (error) {
      response.status(400).json(toValidationError(error));
    }
  });

  app.get("/api/weekly-reports/:id", (request, response) => {
    const report = repository.find(request.params.id);

    if (!report) {
      sendError(response, 404, "NOT_FOUND", ["周报不存在"]);
      return;
    }

    response.json(report);
  });

  app.put("/api/weekly-reports/:id", (request, response) => {
    const input = readReportInput(request.body);
    const validation = validateInputShape(input, response);

    if (!validation) {
      return;
    }

    try {
      const report = repository.update(request.params.id, input);

      if (!report) {
        sendError(response, 404, "NOT_FOUND", ["周报不存在"]);
        return;
      }

      response.json(report);
    } catch (error) {
      response.status(400).json(toValidationError(error));
    }
  });

  app.delete("/api/weekly-reports/:id", (request, response) => {
    const deleted = repository.delete(request.params.id);

    if (!deleted) {
      sendError(response, 404, "NOT_FOUND", ["周报不存在"]);
      return;
    }

    response.status(204).send();
  });

  app.use(express.static(join(process.cwd(), "public")));

  app.use((request, response) => {
    if (request.path.startsWith("/api/")) {
      sendError(response, 404, "NOT_FOUND", ["接口不存在"]);
      return;
    }

    response.status(404).send("Not Found");
  });

  return app;
}

function readReportInput(body: unknown): WeeklyReportInput {
  const value = isRecord(body) ? body : {};

  return {
    author: readBodyString(value.author),
    week: readBodyString(value.week),
    completed: readBodyString(value.completed),
    plan: readBodyString(value.plan),
    blocker: readBodyString(value.blocker),
  };
}

function validateInputShape(
  input: WeeklyReportInput,
  response: Response,
): boolean {
  if (input.author === undefined || input.week === undefined) {
    sendError(response, 400, "BAD_REQUEST", ["请求体格式错误"]);
    return false;
  }

  return true;
}

function readBodyString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function readQueryString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toValidationError(error: unknown): {
  error: ErrorCode;
  messages: string[];
} {
  const message = error instanceof Error ? error.message : "输入不合法";

  return {
    error: "VALIDATION_ERROR",
    messages: message.split("；"),
  };
}

function sendError(
  response: Response,
  status: number,
  error: ErrorCode,
  messages: string[],
): void {
  response.status(status).json({ error, messages });
}
