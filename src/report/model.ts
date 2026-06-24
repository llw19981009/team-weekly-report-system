import { randomUUID } from "node:crypto";

export type WeeklyReportInput = {
  author: string;
  week: string;
  completed: string;
  plan: string;
  blocker?: string;
};

export type WeeklyReport = {
  id: string;
  author: string;
  week: string;
  completed: string;
  plan: string;
  blocker: string;
  createdAt: string;
  updatedAt: string;
};

type ValidationResult =
  | { ok: true; value: WeeklyReportInput }
  | { ok: false; errors: string[] };

const WEEK_PATTERN = /^\d{4}-W(0[1-9]|[1-4]\d|5[0-3])$/;

export function validateWeeklyReportInput(
  input: WeeklyReportInput,
): ValidationResult {
  const normalized = normalizeInput(input);
  const errors: string[] = [];

  if (!normalized.author) {
    errors.push("提交人不能为空");
  }

  if (!WEEK_PATTERN.test(normalized.week)) {
    errors.push("周次格式必须为 YYYY-W01 至 YYYY-W53");
  }

  if (!normalized.completed) {
    errors.push("本周完成不能为空");
  }

  if (!normalized.plan) {
    errors.push("下周计划不能为空");
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, value: normalized };
}

export function createWeeklyReport(input: WeeklyReportInput): WeeklyReport {
  const validation = validateWeeklyReportInput(input);

  if (!validation.ok) {
    throw new Error(validation.errors.join("；"));
  }

  const now = new Date().toISOString();

  return {
    id: `weekly-${randomUUID()}`,
    ...validation.value,
    blocker: validation.value.blocker ?? "",
    createdAt: now,
    updatedAt: now,
  };
}

export function updateWeeklyReport(
  existing: WeeklyReport,
  input: WeeklyReportInput,
): WeeklyReport {
  const validation = validateWeeklyReportInput(input);

  if (!validation.ok) {
    throw new Error(validation.errors.join("；"));
  }

  return {
    ...existing,
    ...validation.value,
    blocker: validation.value.blocker ?? "",
    updatedAt: new Date().toISOString(),
  };
}

function normalizeInput(input: WeeklyReportInput): WeeklyReportInput {
  return {
    author: input.author.trim(),
    week: input.week.trim(),
    completed: input.completed.trim(),
    plan: input.plan.trim(),
    blocker: input.blocker?.trim() ?? "",
  };
}
