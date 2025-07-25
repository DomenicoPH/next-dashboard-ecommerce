'use client';

import React from 'react';
import { Button, ButtonProps } from '@mui/material';

interface PrimaryButtonProps extends ButtonProps {
  label: string;
  icon?: React.ReactNode;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  icon,
  color = 'primary',
  variant = 'contained',
  sx,
  ...props
}) => {
  return (
    <Button
      color={color}
      variant={variant}
      startIcon={icon}
      sx={{
        minWidth: '160px',
        minHeight: '56px',
        padding: '10px 16px',
        fontWeight: 600,
        borderRadius: 2,
        textTransform: 'none',
        ...sx,
      }}
      {...props}
    >
      {label}
    </Button>
  );
};

export default PrimaryButton;
