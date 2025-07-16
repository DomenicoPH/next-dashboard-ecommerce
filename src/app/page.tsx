'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  useTheme
} from '@mui/material';
import { EcommerceWidgetSummary } from '@/widgets/overview/e-commerce/ecommerce-widget-summary';
import { EcommerceYearlySales } from '@/widgets/overview/e-commerce/ecommerce-yearly-sales';
import { EcommerceSaleByGender } from '@/widgets/overview/e-commerce/ecommerce-sale-by-gender';
import { EcommerceSalesOverview } from '@/widgets/overview/e-commerce/ecommerce-sales-overview';
import { SalesSummaryCard } from '@/widgets/overview/e-commerce/ecommerce-sales-sumary-card';
import { EcommerceTopSellingList } from '@/widgets/overview/e-commerce/ecommerce-top-selling-list';

import { mockDashboardData } from '@/data/mockDashboard';

//...imports


const AdminOverviewPage: React.FC = () => {

  const theme = useTheme();
  const [ecommerceSalesOverview, setEcommerceSalesOverview] = useState(mockDashboardData.overviewStats);

  return (

    <Box sx={{ px: { xs: 2, md: 4 }, py: 4, width: '100%' }}>

      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Resumen General
      </Typography>
    
      {/* Fila 1 - Productos vendidos / balance total / ganancias */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <EcommerceWidgetSummary
            title="Productos vendidos"
            percent={2.6}
            total={765}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [22, 8, 35, 50, 82, 84, 77, 12],
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <EcommerceWidgetSummary
            title="Balance total"
            percent={-0.1}
            total={18765}
            chart={{
              colors: [theme.palette.warning.light, theme.palette.warning.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 47, 40, 62, 73, 30, 23, 54],
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <EcommerceWidgetSummary
            title="Ganancia de ventas"
            percent={0.6}
            total={4876}
            chart={{
              colors: [theme.palette.error.light, theme.palette.error.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [40, 70, 75, 70, 50, 28, 7, 64],
            }}
          />
        </Grid>
      </Grid>


      {/* Fila 2 - Resumen de Ventas: por Género / Anuales */}
      <Grid container spacing={3} sx={{ mt: 4 }}>
        
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <EcommerceSaleByGender
            title="Ventas por Género"
            total={2324}
            chart={{
              series: [
                { label: 'Hombres', value: 25 },
                { label: 'Mujeres', value: 50 },
              ],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }} >
          <EcommerceYearlySales title="Ventas Anuales" subheader="(+43%) que el año pasado" chart={mockDashboardData.yearlySales} />
        </Grid>

      </Grid>


      {/* Fila 3 - Resumen de Ventas / totales */}
      <Grid container spacing={3} sx={{ mt: 4 }}>

        <Grid size={{ xs: 12 }}>
          <EcommerceSalesOverview title="Resumen de ventas" data={ecommerceSalesOverview} />
        </Grid>

      </Grid>


      {/* Fila 4 - Resumen de Ventas / Cards */}
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {mockDashboardData.salesData.map((item, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 6 }} key={index}>
              <SalesSummaryCard item={item} />
            </Grid>
        ))}
      </Grid>


      {/* Fila 5 - Servicios/Productos más vendidos */}
      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <EcommerceTopSellingList title="Servicios más vendidos" type="service" />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <EcommerceTopSellingList title="Productos más vendidos" type="product" />
        </Grid>
      </Grid>

    </Box>
  );
};

export default AdminOverviewPage;