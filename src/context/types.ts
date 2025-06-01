import { Report } from "../types/report";

export interface ReportsContextType {
  reports: Report[];
  addReport: (title: string, content: string) => Promise<Report>;
  updateReport: (id: string, updates: Partial<Report>) => Promise<void>;
  deleteReport: (id: string) => Promise<void>;
  getReport: (id: string) => Report | undefined;
  reorderReports: (activeId: string, overId: string) => void;
  error: ReportsError | null;
  clearError: () => void;
}

export class ReportsError extends Error {
  public readonly code: string;
  public readonly details?: unknown;

  constructor(message: string, code: string, details?: unknown) {
    super(message);
    this.name = "ReportsError";
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, ReportsError.prototype);
  }
}
