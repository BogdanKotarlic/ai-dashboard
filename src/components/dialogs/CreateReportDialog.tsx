import { useState } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import { TINYMCE_API_KEY } from "../../config/editor";

interface CreateReportDialogProps {
  open: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (title: string, content: string) => Promise<void>;
}

const CreateReportDialog = ({
  open,
  isSubmitting,
  onClose,
  onSubmit,
}: CreateReportDialogProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    if (!title.trim()) return;
    await onSubmit(title, content);
    setTitle("");
    setContent("");
  };

  return (
    <Dialog
      open={open}
      onClose={isSubmitting ? undefined : onClose}
      maxWidth="md"
      fullWidth
      disableEscapeKeyDown={isSubmitting}
    >
      <DialogTitle>Create New Report</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
          disabled={isSubmitting}
        />
        <Box mt={2}>
          <Editor
            apiKey={TINYMCE_API_KEY}
            value={content}
            onEditorChange={setContent}
            init={{
              height: 400,
              menubar: true,
              plugins: [
                "advlist autolink lists link image charmap print preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table paste code help wordcount",
              ],
              toolbar:
                "undo redo | formatselect | bold italic backcolor | " +
                "alignleft aligncenter alignright alignjustify | " +
                "bullist numlist outdent indent | removeformat | help",
              content_style:
                "body { font-family:Inter,sans-serif; font-size:14px }",
            }}
            disabled={isSubmitting}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
        <Button onClick={onClose} disabled={isSubmitting} sx={{ mr: 1 }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!title.trim() || isSubmitting}
          startIcon={
            isSubmitting ? <CircularProgress size={20} color="inherit" /> : null
          }
        >
          {isSubmitting ? "Creating..." : "Create Report"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateReportDialog;
