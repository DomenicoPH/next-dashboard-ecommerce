"use client";

import React, { useEffect } from "react";
import { Alert, Snackbar } from "@mui/material";

interface CustomAlertProps {
  open: boolean;
  message: string;
  severity?: "error" | "warning" | "info" | "success";
  autoHideDuration?: number;
  onClose: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  open,
  message,
  severity = "info",
  autoHideDuration = 3000,
  onClose,
}) => {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose();
      }, autoHideDuration);
      return () => clearTimeout(timer);
    }
  }, [open, autoHideDuration, onClose]);

  return (
    <Snackbar
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        severity={severity}
        variant="filled"
        onClose={onClose}
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomAlert;
