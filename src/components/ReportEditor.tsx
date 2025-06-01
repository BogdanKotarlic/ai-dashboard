import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Box,
  LinearProgress,
  Typography,
  Tooltip,
} from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import AIControls from "./AIControls";
import { Report, UpdateReportDTO } from "../types/report";
import { TINYMCE_API_KEY } from "../config/editor";
import { debounce } from "lodash";
import { formatDistanceToNow } from "date-fns";
import type { Editor as TinyMCEEditor } from "tinymce";

declare global {
  interface Window {
    tinymce: any;
  }
}

interface Props {
  report: Report;
  open: boolean;
  onClose: () => void;
  onSave: (updates: UpdateReportDTO) => Promise<void> | void;
  autoSave?: boolean;
  autoSaveDelay?: number;
}

const DEFAULT_AUTO_SAVE_DELAY = 2000;

export const ReportEditor = ({
  report,
  open,
  onClose,
  onSave,
  autoSave = false,
  autoSaveDelay = DEFAULT_AUTO_SAVE_DELAY,
}: Props) => {
  const [content, setContent] = useState(report.content);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const editorRef = useRef<TinyMCEEditor | null>(null);

  const editorConfig = useMemo(
    () => ({
      height: "100%",
      menubar: false,
      plugins: [
        "advlist autolink lists link image charmap print preview anchor",
        "searchreplace visualblocks code fullscreen",
        "insertdatetime media table paste code help wordcount",
      ],
      toolbar:
        "undo redo | formatselect | " +
        "bold italic backcolor | alignleft aligncenter " +
        "alignright alignjustify | bullist numlist outdent indent | " +
        "removeformat | help",
      content_style: "body { font-family: Arial, sans-serif; font-size: 14px }",
      setup: (editor: TinyMCEEditor) => {
        editorRef.current = editor;
        editor.on("init", () => {
          setIsEditorReady(true);
        });

        const editorElement = editor.getContainer();
        if (editorElement) {
          editorElement.addEventListener(
            "touchstart",
            (e: Event) => {
              if (e.cancelable) {
                e.preventDefault();
              }
            },
            { passive: true }
          );
        }
      },
    }),
    []
  );

  const wordCount = useMemo(() => {
    if (!content) return 0;
    const text = content.replace(/<[^>]*>/g, " ");
    return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  }, [content]);

  useEffect(() => {
    if (report.content !== content) {
      setContent(report.content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [report.id]);

  useEffect(() => {
    if (!autoSave || !isEditorReady) return;

    const debouncedSave = debounce(async () => {
      if (content === report.content) return;

      try {
        setIsSaving(true);
        await onSave({ content });
        setLastSaved(new Date());
      } catch (error) {
        console.error("Failed to auto-save report:", error);
      } finally {
        setIsSaving(false);
      }
    }, autoSaveDelay);

    debouncedSave();
    return () => {
      debouncedSave.cancel();
    };
  }, [content, autoSave, autoSaveDelay, isEditorReady, onSave, report.content]);

  const handleSave = useCallback(async () => {
    if (content === report.content) return;

    try {
      setIsSaving(true);
      await onSave({
        content,
        updatedAt: new Date().toISOString(),
      } as UpdateReportDTO);
      setLastSaved(new Date());
    } catch (error) {
      console.error("Failed to save report:", error);
    } finally {
      setIsSaving(false);
    }
  }, [content, onSave, report.content]);

  useEffect(() => {
    setContent(report.content);
  }, [report]);

  const handleGenerateContent = useCallback(async (prompt: string) => {
    try {
      setIsGenerating(true);
      setAiError(null);

      await new Promise((resolve) => setTimeout(resolve, 1500));
      const generatedContent = `Generated content based on: ${prompt}`;
      setContent((prev) =>
        prev ? prev + "\n\n" + generatedContent : generatedContent
      );
    } catch (error) {
      console.error("Failed to generate draft:", error);
      setAiError("Failed to generate draft. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const handleSummarizeContent = useCallback(async () => {
    if (!content) {
      setAiError("No content to summarize");
      return;
    }

    try {
      setIsSummarizing(true);
      setAiError(null);

      await new Promise((resolve) => setTimeout(resolve, 1500));
      const summary = `Summary: ${content.substring(0, 100)}...`;
      setContent((prev) => `## Summary\n${summary}\n\n---\n\n${prev || ""}`);
    } catch (error) {
      console.error("Failed to summarize content:", error);
      setAiError("Failed to summarize content. Please try again.");
    } finally {
      setIsSummarizing(false);
    }
  }, [content]);

  const clearError = useCallback(() => setAiError(null), [setAiError]);
  return (
    <>
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={isSaving ? undefined : onClose}
        aria-labelledby="report-editor-dialog"
        PaperProps={{
          sx: {
            height: "90vh",
            maxHeight: "800px",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <DialogTitle id="report-editor-dialog" sx={{ pb: 1 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Tooltip title={report.title || "Untitled Report"}>
              <Typography variant="h6" noWrap sx={{ maxWidth: "70%" }}>
                {report.title || "Untitled Report"}
              </Typography>
            </Tooltip>
            <Box display="flex" alignItems="center" gap={1}>
              {isSaving ? (
                <Typography variant="caption" color="text.secondary">
                  Saving...
                </Typography>
              ) : lastSaved ? (
                <Tooltip
                  title={`Last saved ${formatDistanceToNow(
                    new Date(lastSaved),
                    { addSuffix: true }
                  )}`}
                >
                  <Typography variant="caption" color="text.secondary">
                    Saved{" "}
                    {formatDistanceToNow(new Date(lastSaved), {
                      addSuffix: true,
                    })}
                  </Typography>
                </Tooltip>
              ) : null}
              <Typography variant="caption" color="text.secondary">
                {wordCount} words
              </Typography>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent
          sx={{
            flex: 1,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <AIControls
            onGenerate={handleGenerateContent}
            onSummarize={handleSummarizeContent}
            isGenerating={isGenerating}
            isSummarizing={isSummarizing}
            error={aiError}
            onClearError={clearError}
          />

          <Box
            sx={{
              mt: 2,
              position: "relative",
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {!isEditorReady && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  zIndex: 10,
                }}
              >
                <LinearProgress />
              </Box>
            )}
            <Box
              sx={{
                flex: 1,
                opacity: isEditorReady ? 1 : 0.5,
                transition: "opacity 0.3s",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Editor
                apiKey={TINYMCE_API_KEY}
                value={content}
                onEditorChange={setContent}
                onInit={() => setIsEditorReady(true)}
                init={editorConfig}
                disabled={!isEditorReady}
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
          <Button onClick={onClose} disabled={isSaving} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            disabled={isSaving || content === report.content}
            startIcon={isSaving ? <CircularProgress size={20} /> : null}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ReportEditor;
