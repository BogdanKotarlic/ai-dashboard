import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { Report, UpdateReportDTO } from "../../types/report";
import ReportEditor from "../ReportEditor";

interface EditReportDialogProps {
  open: boolean;
  report: Report | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSave: (updates: UpdateReportDTO) => Promise<void>;
}

const EditReportDialog = ({
  open,
  report,
  isSubmitting,
  onClose,
  onSave,
}: EditReportDialogProps) => (
  <Dialog
    open={open}
    onClose={isSubmitting ? undefined : onClose}
    maxWidth="md"
    fullWidth
    disableEscapeKeyDown={isSubmitting}
  >
    <DialogTitle>Edit Report</DialogTitle>
    <DialogContent>
      {report && (
        <ReportEditor
          report={report}
          open={open}
          onClose={onClose}
          onSave={(updates) => onSave(updates)}
        />
      )}
    </DialogContent>
  </Dialog>
);

export default EditReportDialog;
