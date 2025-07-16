'use client';

import dynamic from 'next/dynamic';
import { Card, Divider, CardHeader, useTheme, Box, Typography } from '@mui/material';
import type { SxProps } from '@mui/system';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

type Props = {
  title?: string;
  subheader?: string;
  total: number;
  chart: {
    colors?: string[][];
    series: {
      label: string;
      value: number;
    }[];
  };
  sx?: SxProps;
};

export function EcommerceSaleByGender({ title, subheader, total, chart }: Props) {
  const theme = useTheme();

  const chartSeries = chart.series.map((item) => item.value);
  const chartLabels = chart.series.map((item) => item.label);

  const chartColors =
    chart.colors ??
    [
      [theme.palette.primary.light, theme.palette.primary.main],
      [theme.palette.error.light, theme.palette.error.main],
      //[theme.palette.warning.light, theme.palette.warning.main],
    ];

  const chartOptions = {
    chart: { sparkline: { enabled: true } },
    labels: chartLabels,
    colors: chartColors.map((color) => color[1]),
    stroke: { width: 0 },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        colorStops: chartColors.map((color) => [
          { offset: 0, color: color[0], opacity: 1 },
          { offset: 100, color: color[1], opacity: 1 },
        ]),
      },
    },
    plotOptions: {
      radialBar: {
        hollow: { size: '32%' },
        track: {
          margin: 10,
          background: theme.palette.grey[200],
        },
        dataLabels: {
          name: { fontSize: '14px' },
          value: { fontSize: '18px', offsetY: 4 },
          total: {
            show: true,
            label: 'Total',
            formatter: () => total.toLocaleString(),
          },
        },
      },
    },
    legend: { show: false },
  };

  return (
    <Card sx={{height: '100%'}}>
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ my: 2, mx: 'auto', width: { xs: 300, xl: 320 }, height: { xs: 300, xl: 320 } }}>
        <ReactApexChart type="radialBar" series={chartSeries} options={chartOptions} height={320} />
      </Box>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3, gap: 3 }}>
        {chart.series.map((item, index) => (
          <Box key={index} textAlign="center">
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                backgroundColor: chartColors[index][1],
                display: 'inline-block',
                mr: 1,
              }}
            />
            <Typography variant="body2" color="text.secondary">
              {item.label}: {item.value.toLocaleString()}
            </Typography>
          </Box>
        ))}
      </Box>
    </Card>
  );
}
