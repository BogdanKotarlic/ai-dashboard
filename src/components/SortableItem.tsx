import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box } from "@mui/material";
import ReportCard from "./ReportCard";
import { Report } from "../types/report";
import React from "react";

interface Props {
  id: string;
  report: Report;
  onView: () => void;
  onEdit: () => void;
}

const SortableItem = ({ id, report, onView, onEdit }: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      sx={{ width: "100%" }}
    >
      <ReportCard report={report} onView={onView} onEdit={onEdit} />
    </Box>
  );
};

export default React.memo(SortableItem);
