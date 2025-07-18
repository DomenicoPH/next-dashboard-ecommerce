'use client';

import React from 'react';
import {
  Box,
  Card,
  CardHeader,
  LinearProgress,
  useTheme,
  alpha,
  Typography,
} from '@mui/material';

type Props = {
  title?: string;
  subheader?: string;
  data: {
    label: string;
    value: number; // porcentaje
    totalAmount: number;
  }[];
  sx?: object;
};

const formatCurrency = (value: number) =>
  `S/. ${value.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;

const formatPercent = (value: number) => `${value.toFixed(1)}%`;

export function EcommerceSalesOverview({ title, subheader, data, sx }: Props) {
  return (
    <Card sx={{ ...sx, borderRadius: 4 }}>
      <CardHeader title={title} subheader={subheader} />

      <Box
        sx={{
          gap: 4,
          px: 3,
          py: 4,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {data.map((progress) => (
          <Item key={progress.label} progress={progress} />
        ))}
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------

type ItemProps = {
  progress: Props['data'][number];
};

function Item({ progress }: ItemProps) {
  const theme = useTheme();

  const color =
    progress.label === 'Ganancia total'
      ? 'info'
      : progress.label === 'Gastos totales'
      ? 'error'
      : 'primary';

  return (
    <Box>
      <Box
        sx={{
          mb: 1,
          gap: 0.5,
          display: 'flex',
          alignItems: 'center',
          typography: 'subtitle2',
        }}
      >
        {/* Etiqueta */}
        <Box component="span" sx={{ flexGrow: 1 }}>
          {progress.label}
        </Box>

        {/* Valor total */}
        <Box component="span">{formatCurrency(progress.totalAmount)}</Box>

        {/* Porcentaje */}
        <Box component="span" sx={{ typography: 'body2', color: 'text.secondary' }}>
          ({formatPercent(progress.value)})
        </Box>
      </Box>

      {/* Barra de progreso */}
      <LinearProgress
        color={color as any}
        variant="determinate"
        value={progress.value}
        sx={{
          height: 8,
          bgcolor: alpha(theme.palette.grey[500], 0.16), // ✅ reemplazo de varAlpha
          borderRadius: 4,
        }}
      />
    </Box>
  );
}
