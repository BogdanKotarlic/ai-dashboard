import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  Button,
  Card,
  CardContent,
  Snackbar,
  Alert,
} from "@mui/material";
import { Add, Search } from "@mui/icons-material";
import { useReports } from "../context/ReportsContext";
import { Report, UpdateReportDTO } from "../types/report";
import ReportList from "../components/ReportList";
import CreateReportDialog from "../components/dialogs/CreateReportDialog";
import ViewReportDialog from "../components/dialogs/ViewReportDialog";
import EditReportDialog from "../components/dialogs/EditReportDialog";
import ErrorBoundary from "../components/ErrorBoundary";

const Dashboard = () => {
  const { reports, addReport, updateReport } = useReports();

  const [searchTerm, setSearchTerm] = useState("");
  const [dialogState, setDialogState] = useState({
    view: { open: false, report: null as Report | null },
    edit: { open: false, report: null as Report | null },
    create: { open: false },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredReports = reports.filter((r: Report) =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddReport = async (title: string, content: string) => {
    setIsSubmitting(true);
    try {
      await addReport(title, content);
      setDialogState((prev) => ({ ...prev, create: { open: false } }));
      showSnackbar("Report created successfully", "success");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to add report";
      showSnackbar(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleUpdateReport = async (updates: UpdateReportDTO) => {
    if (!dialogState.edit.report) return;
    setIsSubmitting(true);
    try {
      await updateReport(dialogState.edit.report.id, updates);
      setDialogState((prev) => ({
        ...prev,
        edit: { ...prev.edit, open: false },
      }));
      showSnackbar("Report updated successfully", "success");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update report";
      showSnackbar(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openViewDialog = (report: Report) => {
    setDialogState({
      ...dialogState,
      view: { open: true, report },
    });
  };

  const openEditDialog = (report: Report) => {
    setDialogState({
      ...dialogState,
      edit: { open: true, report },
    });
  };

  const openCreateDialog = () => {
    setDialogState({
      ...dialogState,
      create: { open: true },
    });
  };

  const closeDialog = (dialog: keyof typeof dialogState) => {
    setDialogState((prev) => ({
      ...prev,
      [dialog]: { ...prev[dialog], open: false },
    }));
  };

  return (
    <Box sx={{ width: "100%" }}>
      <ErrorBoundary>
        <Card sx={{ mb: 3, borderRadius: 2 }}>
          <CardContent>
            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: { xs: "1fr", sm: "1fr auto" },
                alignItems: "center",
              }}
            >
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
              <Button
                fullWidth
                variant="contained"
                startIcon={<Add />}
                onClick={openCreateDialog}
                sx={{
                  height: 56,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                New Report
              </Button>
            </Box>
          </CardContent>
        </Card>
      </ErrorBoundary>

      {filteredReports.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 2,
            bgcolor: "background.paper",
          }}
        >
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No reports found
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {searchTerm
              ? "Try adjusting your search term"
              : "Create your first report to get started"}
          </Typography>
        </Paper>
      ) : (
        <ErrorBoundary>
          <ReportList
            reports={filteredReports}
            onView={openViewDialog}
            onEdit={openEditDialog}
          />
        </ErrorBoundary>
      )}

      <ErrorBoundary>
        <ViewReportDialog
          open={dialogState.view.open}
          report={dialogState.view.report}
          onClose={() => closeDialog("view")}
        />
      </ErrorBoundary>

      <ErrorBoundary>
        <EditReportDialog
          open={dialogState.edit.open}
          report={dialogState.edit.report}
          isSubmitting={isSubmitting}
          onClose={() => closeDialog("edit")}
          onSave={handleUpdateReport}
        />
      </ErrorBoundary>

      <ErrorBoundary>
        <CreateReportDialog
          open={dialogState.create.open}
          isSubmitting={isSubmitting}
          onClose={() => closeDialog("create")}
          onSubmit={handleAddReport}
        />
      </ErrorBoundary>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;
