import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { useMemo } from "react";

const Header = () => {
  const theme = useTheme();

  const headerStyles = useMemo(
    () => ({
      bgcolor: "background.paper",
      color: "text.primary",
      boxShadow:
        "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      borderBottom: `1px solid ${theme.palette.divider}`,
    }),
    [theme.palette.divider]
  );

  return (
    <AppBar position="fixed" elevation={0} sx={headerStyles}>
      <Container maxWidth={false}>
        <Toolbar disableGutters sx={{ minHeight: 64 }}>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              mr: 2,
              display: "flex",
              fontWeight: 700,
              color: "primary.main",
              textDecoration: "none",
              flexGrow: { xs: 1, md: 0 },
            }}
          >
            AI Dashboard
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
