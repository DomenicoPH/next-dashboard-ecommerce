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

    const valueColor = item.value >= 0 ? 'text.primary' : 'error.main';

    return (
      <Box sx={{ width: '100%' }}>
        {title && (
          <Typography variant="subtitle2">
            {title}
          </Typography>
        )}
        <Card elevation={2} sx={{ height: '100%', borderRadius: 4 }}>
          <CardContent>
            <Typography color="text.primary" gutterBottom>
              <Box component="span" sx={{ color: 'text.secondary', fontWeight: 'light', opacity: 0.5 }}>
                Ventas:
              </Box>{' '}
              {item.label}
            </Typography>
            <Typography 
                variant="h5" 
                color="success.main" 
                fontWeight="bold"
                sx={{ color: valueColor, mr: 5 }}
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
