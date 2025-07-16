'use client';

import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';

type SalesSummaryItem = {
  label: string;
  value: number;
};

type Props = {
  item: SalesSummaryItem;
  title?: string;
};

const formatCurrency = (value: number) => `S/. ${value.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;

export function SalesSummaryCard({ title, item }: Props) {

    const valueColor = item.value >= 0 ? 'primary.main' : 'error.main';
    return (
      <Box sx={{ width: '100%' }}>
        {title && (
          <Typography variant="subtitle2">
            {title}
          </Typography>
        )}
        <Card elevation={2} sx={{ height: '100%' }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              <span className='text-blue-500'>Ventas:</span> {item.label}
            </Typography>
            <Typography 
                variant="h5" 
                color="success.main" 
                fontWeight="bold"
                sx={{ color: valueColor }}
                display="flex"
                justifyContent="flex-end"
            >
              {formatCurrency(item.value)}
            </Typography>
          </CardContent>
        </Card>
      </Box>
  );
}
