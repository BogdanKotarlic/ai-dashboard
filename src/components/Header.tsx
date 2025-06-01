import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  useTheme,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import LoginDialog from "./LoginDialog";

const Header = () => {
  const theme = useTheme();
  const { user, logout, isAdmin } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
  };

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
    <>
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

            <Box sx={{ flexGrow: 1 }} />

            {user ? (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  variant="body2"
                  sx={{ mr: 1, display: { xs: "none", sm: "block" } }}
                >
                  {user.name}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Tooltip title="Account settings">
                    <IconButton onClick={handleOpenUserMenu}>
                      <Avatar
                        sx={{
                          bgcolor: isAdmin ? "primary.main" : "secondary.main",
                          width: 32,
                          height: 32,
                          fontSize: "0.9rem",
                        }}
                      >
                        {isAdmin ? "A" : "V"}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Typography
                    variant="caption"
                    sx={{
                      ml: 1,
                      display: { xs: "none", sm: "block" },
                      bgcolor: isAdmin ? "primary.main" : "secondary.main",
                      color: "white",
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                    }}
                  >
                    {isAdmin ? "Admin" : "Viewer"}
                  </Typography>
                </Box>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleCloseUserMenu}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </Box>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setLoginDialogOpen(true)}
              >
                Login
              </Button>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <LoginDialog
        open={loginDialogOpen}
        onClose={() => setLoginDialogOpen(false)}
      />
    </>
  );
};

export default Header;
