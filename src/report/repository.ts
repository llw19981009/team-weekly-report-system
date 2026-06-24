import {
  createWeeklyReport,
  type WeeklyReport,
  type WeeklyReportInput,
  updateWeeklyReport,
} from "./model.js";

export class InMemoryWeeklyReportRepository {
  private readonly reports = new Map<string, WeeklyReport>();

  create(input: WeeklyReportInput): WeeklyReport {
    const report = createWeeklyReport(input);
    this.reports.set(report.id, report);
    return report;
  }

  list(author?: string): WeeklyReport[] {
    const normalizedAuthor = author?.trim();
    const reports = Array.from(this.reports.values()).reverse();

    if (!normalizedAuthor) {
      return reports;
    }

    return reports.filter((report) => report.author === normalizedAuthor);
  }

  find(id: string): WeeklyReport | undefined {
    return this.reports.get(id);
  }

  update(id: string, input: WeeklyReportInput): WeeklyReport | undefined {
    const existing = this.find(id);

    if (!existing) {
      return undefined;
    }

    const updated = updateWeeklyReport(existing, input);
    this.reports.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.reports.delete(id);
  }
}
