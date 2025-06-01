import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import { Report } from "../../types/report";

interface ViewReportDialogProps {
  open: boolean;
  report: Report | null;
  onClose: () => void;
}

const ViewReportDialog = ({ open, report, onClose }: ViewReportDialogProps) => (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
    <DialogTitle>{report?.title}</DialogTitle>
    <DialogContent>
      <Box
        sx={{
          "& img": { maxWidth: "100%", height: "auto" },
          "& iframe": { maxWidth: "100%" },
        }}
        dangerouslySetInnerHTML={
          report ? { __html: report.content } : { __html: "" }
        }
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Close</Button>
    </DialogActions>
  </Dialog>
);

export default ViewReportDialog;
