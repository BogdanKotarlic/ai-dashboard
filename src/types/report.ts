export type ReportStatus = "draft" | "published" | "archived";

export interface ReportBase {
  id: string;
  title: string;
  content: string;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  wordCount?: number;
}

export interface Report extends ReportBase {}

export interface CreateReportDTO
  extends Omit<ReportBase, "id" | "createdAt" | "updatedAt"> {
  // Additional fields specific to creation if needed
}

export interface UpdateReportDTO
  extends Partial<Omit<ReportBase, "id" | "createdAt">> {
  // Fields that can be updated
}
