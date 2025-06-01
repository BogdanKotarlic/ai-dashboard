import React, { useMemo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box } from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import ReportCard from "./ReportCard";
import { Report } from "../types/report";

interface Props {
  id: string;
  report: Report;
  onView: (report: Report) => void;
  onEdit: (report: Report) => void;
}

const SortableItem = ({ id, report, onView, onEdit }: Props) => {
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
  });

  const style = useMemo(
    () => ({
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.6 : 1,
      zIndex: isDragging ? 1000 : 1,
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
      <ReportCard
        report={report}
        onView={() => onView(report)}
        onEdit={() => onEdit(report)}
      />
    </Box>
  );
};

export default React.memo(SortableItem);
