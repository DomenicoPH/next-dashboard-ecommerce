'use client';

import dynamic from 'next/dynamic';
import { Card, CardHeader, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import type { SxProps } from '@mui/system';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

type Props = {
  title?: string;
  subheader?: string;
  data: {
    label: string;
    value: number; // monto en soles
  }[];
  sx?: SxProps;
};

const formatCurrency = (value: number) =>
  `S/. ${value.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;

export function EcommerceSalesOverview({ title, subheader, data, sx }: Props) {
  const theme = useTheme();

  // Encontrar el valor máximo para escalar el eje
  const maxValue = Math.max(...data.map((item) => item.value));

  const series = [
    {
      data: data.map((item) => item.value),
    },
  ];

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      animations: {
        enabled: true,
        speed: 1000,
      },
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        barHeight: '80%',
      },
    },
    xaxis: {
      categories: data.map((item) => item.label),
      max: maxValue * 1, // margen extra para estética
      labels: {
        style: {
          colors: theme.palette.text.secondary,
          fontSize: '10px',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: theme.palette.text.primary, // Texto principal (tema claro/oscuro)
          fontSize: '14px',
          fontWeight: 500,
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'horizontal',
        gradientToColors: [theme.palette.primary.main],
        stops: [0, 100],
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => formatCurrency(val),
      style: {
        colors: [theme.palette.background.default],
        fontSize: '15px',
      },
    },
    colors: [theme.palette.primary.light],
    grid: {
      borderColor: theme.palette.divider,
    },
    tooltip: {
      shared: true,
      intersect: false,
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light'
    },
  };

  return (
    <Card sx={{ ...sx, borderRadius: 4 }}>
      <CardHeader title={title} subheader={subheader} />
      <Box sx={{ p: 3 }}>
        <ReactApexChart
          type="bar"
          series={series}
          options={options}
          height={data.length * 50 + 50}
        />
      </Box>
    </Card>
  );
}
