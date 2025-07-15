'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import {
  Card,
  CardHeader,
  useTheme,
  Box,
  Typography,
  MenuItem,
  Select,
} from '@mui/material';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

type Props = {
  title?: string;
  subheader?: string;
  chart: {
    colors?: string[];
    categories?: string[];
    series: {
      name: string;
      data: {
        name: string;
        data: number[];
      }[];
    }[];
  };
};

export function EcommerceYearlySales({ title, subheader, chart }: Props) {
  const theme = useTheme();

  const [selectedSeries, setSelectedSeries] = useState(chart.series[0]?.name || '');

  const currentSeries = chart.series.find((i) => i.name === selectedSeries);

  const handleChangeSeries = useCallback((event: any) => {
    setSelectedSeries(event.target.value);
  }, []);

  const chartOptions = {
    chart: {
      type: 'area',
      toolbar: { show: false },
      sparkline: { enabled: false },
    },
    colors: chart.colors ?? [theme.palette.primary.main, theme.palette.warning.main],
    xaxis: {
      categories: chart.categories,
      labels: { style: { colors: theme.palette.text.secondary } },
    },
    stroke: { curve: 'smooth', width: 2 },
    tooltip: {
      shared: true,
      intersect: false,
    },
    legend: { show: false },
  };

  return (
    <Card>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <Select
            size="small"
            value={selectedSeries}
            onChange={handleChangeSeries}
          >
            {chart.series.map((item) => (
              <MenuItem key={item.name} value={item.name}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        }
        sx={{ mb: 3 }}
      />

      <Box px={3} display="flex" justifyContent="space-between">
        {currentSeries?.data.map((item, idx) => (
          <Box key={idx}>
            <Typography variant="body2" color="text.secondary">
              {item.name}
            </Typography>
            <Typography variant="subtitle1">
              {item.data.reduce((sum, val) => sum + val, 0).toLocaleString()}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ pl: 1, py: 2.5, pr: 2.5 }}>
        <ReactApexChart
          type="area"
          series={currentSeries?.data || []}
          options={chartOptions}
          height={320}
        />
      </Box>
    </Card>
  );
}
