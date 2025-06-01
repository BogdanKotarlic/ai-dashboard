import { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import ReportCard from "./ReportCard";
import { Report } from "../types/report";

interface Props {
  reports: Report[];
  onView: (report: Report) => void;
  onEdit: (report: Report) => void;
}

const ReportList = ({ reports, onView, onEdit }: Props) => {
  const featuredReports = useMemo(() => {
    return reports
      .filter((report) => report.status === "published")
      .slice(0, 2);
  }, [reports]);

  const regularReports = useMemo(() => {
    const featured = new Set(featuredReports.map((r) => r.id));
    return reports.filter((report) => !featured.has(report.id));
  }, [reports, featuredReports]);

  if (reports.length === 0) {
    return null;
  }

  return (
    <Box>
      {featuredReports.length > 0 && (
        <Box mb={4}>
          <Typography variant="h5" component="h2" gutterBottom>
            Featured Reports
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            {featuredReports.map((report) => (
              <Box key={report.id} sx={{ width: { xs: "100%", md: "48%" } }}>
                <ReportCard
                  report={report}
                  onView={() => onView(report)}
                  onEdit={() => onEdit(report)}
                  variant="featured"
                />
              </Box>
            ))}
          </Box>
        </Box>
      )}

      <Box>
        {regularReports.length > 0 ? (
          <>
            <Typography variant="h5" component="h2" gutterBottom>
              All Reports
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
              {regularReports.map((report) => (
                <Box
                  key={report.id}
                  sx={{
                    width: { xs: "100%", sm: "45%", md: "30%", lg: "22%" },
                  }}
                >
                  <ReportCard
                    report={report}
                    onView={() => onView(report)}
                    onEdit={() => onEdit(report)}
                  />
                </Box>
              ))}
            </Box>
          </>
        ) : null}
      </Box>
    </Box>
  );
};

export default ReportList;
