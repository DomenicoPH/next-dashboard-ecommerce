'use client';

import {
  Box,
  Card,
  useTheme,
  Typography,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
//import ReactApexChart from 'react-apexcharts';
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

type WidgetProps = {
  title: string;
  total: number;
  percent: number;
  chart: {
    categories: string[];
    series: number[];
    colors?: string[];
  };
};

export function EcommerceWidgetSummary({ title, total, percent, chart }: WidgetProps) {
  const theme = useTheme();

  const chartOptions = {
    chart: {
      sparkline: { enabled: true },
    },
    stroke: {
      width: 2,
    },
    xaxis: {
      categories: chart.categories,
      labels: { show: false },
    },
    tooltip: {
      enabled: true,
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light'
    },
    colors: [theme.palette.primary.main],
  };

  const TrendIcon = percent >= 0 ? TrendingUpIcon : TrendingDownIcon;
  const trendColor = percent >= 0 ? 'success.main' : 'error.main';

  return (
    <Card sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 4 }}>
      <Box>
        <Typography variant="subtitle2">{title}</Typography>
        <Typography variant="h3" sx={{ my: 1.5 }}>
          {total.toLocaleString()}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendIcon sx={{ color: trendColor }} />
          <Typography variant="subtitle2" sx={{ color: trendColor }}>
            {(percent > 0 ? '+' : '') + percent.toFixed(1) + '%'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            último reporte
          </Typography>
        </Box>
      </Box>

      <Box sx={{ width: 100, height: 66 }}>
        <ReactApexChart
          type="line"
          series={[{ data: chart.series }]}
          options={chartOptions}
          width={100}
          height={66}
        />
      </Box>
    </Card>
  );
}