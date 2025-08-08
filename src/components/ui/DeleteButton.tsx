'use client';

import React, { useState } from 'react';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmDialog from './ConfirmDialog';

interface DeleteButtonWithConfirmProps {
  onConfirm: () => void;
  confirmMessage: string;
  confirmTitle?: string;
  buttonText?: string;
  color?: 'error' | 'primary' | 'secondary';
  loading?: boolean;
  variant?: 'contained' | 'outlined' | 'text';
}

const DeleteButtonWithConfirm: React.FC<DeleteButtonWithConfirmProps> = ({
  onConfirm,
  confirmMessage,
  confirmTitle = 'Confirmación',
  buttonText = 'Eliminar',
  color = 'error',
  loading = false,
  variant = 'outlined',
}) => {
  const [open, setOpen] = useState(false);

  const handleOpenDialog = () => setOpen(true);
  const handleCloseDialog = () => setOpen(false);
  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <>
      <Button
        variant={variant}
        color={color}
        endIcon={<DeleteIcon />}
        onClick={handleOpenDialog}
        disabled={loading}
      >
        {loading ? 'Eliminando...' : buttonText}
      </Button>

      <ConfirmDialog
        open={open}
        title={confirmTitle}
        message={confirmMessage}
        action="Eliminar"
        onConfirm={handleConfirm}
        onCancel={handleCloseDialog}
      />
    </>
  );
};

export default DeleteButtonWithConfirm;
