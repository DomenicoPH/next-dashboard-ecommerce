'use client';

import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Box
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message: string | React.ReactNode;
  action: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title = 'Confirmación',
  message,
  action,
  onConfirm,
  onCancel
}) => {

  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      slotProps={{
        paper: {
          sx: { 
            p: 3, 
            borderRadius: 2 
          }
        }
      }}
    >
      <DialogTitle 
        id="confirm-dialog-title"
        sx={{ fontSize: 24 }}
      >{title}</DialogTitle>
      <DialogContent>
        <DialogContentText 
          id="confirm-dialog-description"
          component={Box}
          sx={{ fontSize: 14, color: theme.palette.text.secondary }}
        >
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary" variant="outlined">
          Cancelar
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" autoFocus>
          {action}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
