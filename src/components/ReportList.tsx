import { useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import ReportCard from "./ReportCard";
import { Report } from "../types/report";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";
import { useReports } from "../context/ReportsContext";

interface Props {
  reports: Report[];
  onView: (report: Report) => void;
  onEdit: (report: Report) => void;
}

const ReportList = ({ reports, onView, onEdit }: Props) => {
  const { reorderReports } = useReports();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
        delay: 50,
        tolerance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    })
  );
  const featuredReports = useMemo(() => {
    return reports
      .filter((report) => report.status === "published")
      .slice(0, 2);
  }, [reports]);

  const regularReports = useMemo(() => {
    const featured = new Set(featuredReports.map((r) => r.id));
    return reports.filter((report) => !featured.has(report.id));
  }, [reports, featuredReports]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      reorderReports(active.id as string, over.id as string);
    }

    setActiveId(null);
  };

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

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              measuring={{
                draggable: {
                  measure: (node) => {
                    return node.getBoundingClientRect();
                  },
                },
              }}
              modifiers={[]}
            >
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 3,
                  padding: 2,
                  backgroundColor: activeId
                    ? "rgba(0, 0, 0, 0.02)"
                    : "transparent",
                  borderRadius: 1,
                  transition: "background-color 0.2s ease",
                }}
              >
                <SortableContext
                  items={regularReports.map((report) => report.id)}
                  strategy={horizontalListSortingStrategy}
                >
                  {regularReports.map((report) => (
                    <Box
                      key={report.id}
                      sx={{
                        width: { xs: "100%", sm: "45%", md: "30%", lg: "22%" },
                      }}
                    >
                      <SortableItem
                        id={report.id}
                        report={report}
                        onView={() => onView(report)}
                        onEdit={() => onEdit(report)}
                      />
                    </Box>
                  ))}
                </SortableContext>
              </Box>

              <DragOverlay
                adjustScale={true}
                dropAnimation={{
                  duration: 300,
                  easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
                }}
              >
                {activeId ? (
                  <Box
                    sx={{
                      transform: "rotate(3deg)",
                      boxShadow: "0 5px 15px rgba(0,0,0,0.15)",
                      width: { xs: "100%", sm: "45%", md: "30%", lg: "22%" },
                      opacity: 0.9,
                    }}
                  >
                    <ReportCard
                      report={reports.find((r) => r.id === activeId)!}
                      onView={() => {}}
                      onEdit={() => {}}
                    />
                  </Box>
                ) : null}
              </DragOverlay>
            </DndContext>
          </>
        ) : null}
      </Box>
    </Box>
  );
};

export default ReportList;
