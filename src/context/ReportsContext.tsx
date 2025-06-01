import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { Report, UpdateReportDTO } from "../types/report";
import { v4 as uuidv4 } from "uuid";
import { ReportsContextType, ReportsError } from "./types";

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

const STORAGE_KEY = "reports";
const MAX_REPORTS = 1000;

const getStoredReports = (): Report[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to parse stored reports", error);
    return [];
  }
};

export const ReportsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [reports, setReports] = useState<Report[]>(() => getStoredReports());
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<ReportsError | null>(null);

  const clearError = useCallback(() => setError(null), []);

  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    } catch (error) {
      console.error("Failed to save reports to localStorage", error);
    }
  }, [reports, isInitialized]);

  const addReport = useCallback(
    async (title: string, content: string): Promise<Report> => {
      try {
        if (!title.trim()) {
          throw new ReportsError("Title is required", "VALIDATION_ERROR");
        }

        if (reports.length >= MAX_REPORTS) {
          throw new ReportsError(
            "Maximum number of reports reached",
            "QUOTA_EXCEEDED"
          );
        }

        const newReport: Report = {
          id: uuidv4(),
          title: title.trim(),
          content,
          status: "draft",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setReports((prev) => [newReport, ...prev]);
        return newReport;
      } catch (err) {
        const error =
          err instanceof ReportsError
            ? err
            : new ReportsError(
                err instanceof Error ? err.message : "Failed to add report",
                "ADD_REPORT_ERROR",
                err
              );
        setError(error);
        throw error;
      }
    },
    [reports.length]
  );

  const updateReport = useCallback(
    async (id: string, updates: Partial<UpdateReportDTO>): Promise<void> => {
      try {
        if (updates.title && !updates.title.trim()) {
          throw new ReportsError("Title cannot be empty", "VALIDATION_ERROR");
        }

        setReports((prev) =>
          prev.map((report) =>
            report.id === id
              ? {
                  ...report,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : report
          )
        );
      } catch (err) {
        const error =
          err instanceof ReportsError
            ? err
            : new ReportsError(
                err instanceof Error ? err.message : "Failed to update report",
                "UPDATE_REPORT_ERROR",
                err
              );
        setError(error);
        throw error;
      }
    },
    []
  );

  const deleteReport = useCallback(async (id: string): Promise<void> => {
    try {
      setReports((prev) => prev.filter((report) => report.id !== id));
    } catch (err) {
      const error =
        err instanceof ReportsError
          ? err
          : new ReportsError(
              err instanceof Error ? err.message : "Failed to delete report",
              "DELETE_REPORT_ERROR",
              err
            );
      setError(error);
      throw error;
    }
  }, []);

  const getReport = useCallback(
    (id: string) => {
      return reports.find((report) => report.id === id);
    },
    [reports]
  );

  const value = useMemo(
    () => ({
      reports,
      addReport,
      updateReport,
      deleteReport,
      getReport,
      error,
      clearError,
    }),
    [
      reports,
      addReport,
      updateReport,
      deleteReport,
      getReport,
      error,
      clearError,
    ]
  );

  useEffect(() => {
    if (error) {
      console.error("ReportsContext error:", error);
    }
  }, [error]);

  return (
    <ReportsContext.Provider value={value}>{children}</ReportsContext.Provider>
  );
};

export const useReports = (): ReportsContextType => {
  const context = useContext(ReportsContext);
  if (context === undefined) {
    throw new ReportsError(
      "useReports must be used within a ReportsProvider",
      "CONTEXT_ERROR"
    );
  }
  return context;
};
