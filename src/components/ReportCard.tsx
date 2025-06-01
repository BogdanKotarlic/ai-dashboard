import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
  Chip,
  useTheme,
  SxProps,
  Theme,
  Tooltip,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
  LockOutlined,
} from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";
import { Report } from "../types/report";
import { useAuth } from "../context/AuthContext";

interface Props {
  report: Report;
  onView: () => void;
  onEdit: () => void;
  onDelete?: () => void;
  variant?: "default" | "featured";
}

const ReportCard = ({
  report,
  onView,
  onEdit,
  onDelete,
  variant = "default",
}: Props) => {
  const theme = useTheme();
  const { isAdmin } = useAuth();

  const timeAgo = formatDistanceToNow(
    report.updatedAt ? new Date(report.updatedAt) : new Date(),
    { addSuffix: true }
  );

  const cardStyles: SxProps<Theme> = {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
    borderRadius: 2,
    minHeight: 220,
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: theme.shadows[8],
    },
    ...(variant === "featured" && {
      borderLeft: `4px solid ${theme.palette.primary.main}`,
      backgroundColor: theme.palette.background.paper,
    }),
  };

  const contentSx: SxProps<Theme> = {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    ...(variant === "featured" && {
      "&:last-child": {
        paddingBottom: 2,
      },
    }),
    overflow: "hidden",
  };

  const titleSx: SxProps<Theme> = {
    fontWeight: 600,
    mb: 1,
    display: "-webkit-box",
    WebkitLineClamp: variant === "featured" ? 3 : 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
    ...(variant === "featured" && {
      fontSize: "1.25rem",
      lineHeight: 1.4,
    }),
  };

  const excerpt = (() => {
    const div = document.createElement("div");
    div.innerHTML = report.content;
    const text = div.textContent || div.innerText || "";
    return text.length > 150 ? `${text.substring(0, 150)}...` : text;
  })();

  return (
    <Card sx={cardStyles} elevation={2}>
      <CardContent sx={contentSx}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1.5,
          }}
        >
          <Chip
            size="small"
            label={report.status || "draft"}
            color={report.status === "published" ? "primary" : "default"}
            variant="outlined"
          />
        </Box>

        <Typography variant="h6" component="h3" sx={titleSx}>
          {report.title}
        </Typography>

        {variant === "featured" && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {excerpt}
          </Typography>
        )}
      </CardContent>

      <CardActions
        sx={{
          mt: "auto",
          p: 2,
          pt: 1,
          borderTop: "1px solid",
          borderColor: "divider",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 1.5,
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", width: "100%", ml: 1.5 }}
        >
          <ScheduleIcon
            fontSize="small"
            sx={{ mr: 0.5, color: "text.secondary", fontSize: "1rem" }}
          />
          <Typography variant="caption" color="text.secondary">
            {timeAgo}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button
            size="small"
            onClick={onView}
            startIcon={<ViewIcon fontSize="small" />}
            sx={{
              textTransform: "none",
              color: "primary.main",
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
          >
            View
          </Button>
          {isAdmin ? (
            <>
              <Button
                size="small"
                onClick={onEdit}
                startIcon={<EditIcon fontSize="small" />}
                sx={{
                  textTransform: "none",
                  color: "text.secondary",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                Edit
              </Button>
              <Button
                size="small"
                onClick={onDelete}
                startIcon={<DeleteIcon fontSize="small" />}
                sx={{
                  textTransform: "none",
                  color: "error.main",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                Delete
              </Button>
            </>
          ) : (
            <>
              <Tooltip title="Viewer accounts cannot edit reports">
                <span>
                  <Button
                    size="small"
                    disabled
                    startIcon={<EditIcon fontSize="small" />}
                    endIcon={
                      <LockOutlined
                        fontSize="small"
                        sx={{ fontSize: "0.9rem" }}
                      />
                    }
                    sx={{
                      textTransform: "none",
                      color: "text.disabled",
                    }}
                  >
                    Edit
                  </Button>
                </span>
              </Tooltip>
              <Tooltip title="Viewer accounts cannot delete reports">
                <span>
                  <Button
                    size="small"
                    disabled
                    startIcon={<DeleteIcon fontSize="small" />}
                    endIcon={
                      <LockOutlined
                        fontSize="small"
                        sx={{ fontSize: "0.9rem" }}
                      />
                    }
                    sx={{
                      textTransform: "none",
                      color: "text.disabled",
                    }}
                  >
                    Delete
                  </Button>
                </span>
              </Tooltip>
            </>
          )}
        </Box>
      </CardActions>
    </Card>
  );
};

export default ReportCard;
