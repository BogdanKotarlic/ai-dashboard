import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { UserRole, useAuth } from "../context/AuthContext";

interface Props {
  open: boolean;
  onClose: () => void;
}

const LoginDialog: React.FC<Props> = ({ open, onClose }) => {
  const { login } = useAuth();

  const handleLogin = (role: UserRole) => {
    login(role);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Select User Role</DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          Please select a role to continue:
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleLogin("admin")}
            fullWidth
            size="large"
          >
            Admin User
            <Typography
              variant="caption"
              sx={{
                display: "block",
                width: "100%",
                textAlign: "center",
                mt: 0.5,
              }}
            >
              Full access: create, edit, delete reports
            </Typography>
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleLogin("viewer")}
            fullWidth
            size="large"
          >
            Viewer User
            <Typography
              variant="caption"
              sx={{
                display: "block",
                width: "100%",
                textAlign: "center",
                mt: 0.5,
              }}
            >
              Read-only access
            </Typography>
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginDialog;
