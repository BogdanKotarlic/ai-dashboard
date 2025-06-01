import React, { useMemo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box, Tooltip } from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ReportCard from "./ReportCard";
import { Report } from "../types/report";
import { useAuth } from "../context/AuthContext";

interface Props {
  id: string;
  report: Report;
  onView: (report: Report) => void;
  onEdit: (report: Report) => void;
  onDelete: (report: Report) => void;
}

const SortableItem = ({ id, report, onView, onEdit, onDelete }: Props) => {
  const { isAdmin } = useAuth();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    animateLayoutChanges: () => false,
    disabled: !isAdmin,
  });

  const style = useMemo(
    () => ({
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging && transform ? 0.6 : 1,
      zIndex: isDragging && transform ? 1000 : 1,
      position: "relative" as const,
    }),
    [transform, transition, isDragging]
  );

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{ width: "100%", position: "relative" }}
    >
      {isAdmin ? (
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 10,
            cursor: "grab",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.08)",
            },
          }}
          {...attributes}
          {...listeners}
        >
          <DragIndicatorIcon fontSize="small" />
        </Box>
      ) : (
        <Tooltip title="Viewer accounts cannot reorder reports">
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 10,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              opacity: 0.5,
            }}
          >
            <LockOutlinedIcon fontSize="small" />
          </Box>
        </Tooltip>
      )}
      <ReportCard
        report={report}
        onView={() => onView(report)}
        onEdit={() => onEdit(report)}
        onDelete={() => onDelete(report)}
      />
    </Box>
  );
};

export default React.memo(SortableItem);
