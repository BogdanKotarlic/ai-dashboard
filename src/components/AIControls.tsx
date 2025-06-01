import { useState, useCallback, memo } from "react";
import {
  Box,
  Button,
  Stack,
  TextField,
  CircularProgress,
  Tooltip,
  Alert,
  Collapse,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Close as CloseIcon, Clear as ClearIcon } from "@mui/icons-material";

interface Props {
  onGenerate: (prompt: string) => Promise<void> | void;
  onSummarize: () => Promise<void> | void;
  isGenerating: boolean;
  isSummarizing: boolean;
  error?: string | null;
  onClearError?: () => void;
}

const AIControls = memo(
  ({
    onGenerate,
    onSummarize,
    isGenerating,
    isSummarizing,
    error = null,
    onClearError,
  }: Props) => {
    const [prompt, setPrompt] = useState("");
    const [localError, setLocalError] = useState<string | null>(null);
    const isAnyLoading = isGenerating || isSummarizing;

    const clearError = useCallback(() => {
      setLocalError(null);
      onClearError?.();
    }, [onClearError]);

    const handleGenerate = useCallback(async () => {
      if (!prompt.trim() || isGenerating) return;

      try {
        await onGenerate(prompt);
        setPrompt("");
      } catch (err) {
        setLocalError(
          err instanceof Error ? err.message : "Failed to generate content"
        );
      }
    }, [prompt, isGenerating, onGenerate]);

    const handleSummarize = useCallback(async () => {
      if (isSummarizing) return;

      try {
        await onSummarize();
      } catch (err) {
        setLocalError(
          err instanceof Error ? err.message : "Failed to summarize content"
        );
      }
    }, [isSummarizing, onSummarize]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey && prompt.trim()) {
          e.preventDefault();
          handleGenerate();
        }
      },
      [handleGenerate, prompt]
    );

    const displayError = error || localError;

    return (
      <Stack spacing={2} mb={2}>
        <Collapse in={!!displayError}>
          <Alert
            severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={clearError}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2 }}
          >
            {displayError}
          </Alert>
        </Collapse>

        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="AI Prompt (e.g., Create a report about...)"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isAnyLoading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setPrompt("")}
                    disabled={!prompt.trim()}
                    edge="end"
                    size="small"
                    sx={{ mr: -1 }}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Tooltip title="Generate a new draft based on your prompt">
            <Button
              variant="contained"
              onClick={handleGenerate}
              disabled={!prompt.trim() || isAnyLoading}
              startIcon={isGenerating ? <CircularProgress size={16} /> : null}
              sx={{ flex: 1 }}
            >
              {isGenerating ? "Generating..." : "Generate Draft"}
            </Button>
          </Tooltip>

          <Tooltip title="Summarize the current content">
            <Button
              variant="outlined"
              onClick={handleSummarize}
              disabled={isAnyLoading}
              startIcon={isSummarizing ? <CircularProgress size={16} /> : null}
              sx={{ flex: 1 }}
            >
              {isSummarizing ? "Summarizing..." : "Summarize"}
            </Button>
          </Tooltip>
        </Stack>
      </Stack>
    );
  }
);

export default AIControls;
