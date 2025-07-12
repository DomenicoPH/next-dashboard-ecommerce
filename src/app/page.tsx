'use client';

import React from 'react';
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
import { EcommerceWidgetSummary } from '@/sections/overview/e-commerce/ecommerce-widget-summary';

const salesData = {
  today: 1500,
  lastWeek: 8500,
  lastMonth: 30000,
  lastYear: 350000,
};

const bestSellingServices = [
  { id: '1', name: 'Depilación Láser', sales: 5000 },
  { id: '2', name: 'Blanqueamiento Láser', sales: 3000 },
  { id: '3', name: 'Faciales', sales: 2000 },
];

const bestSellingProducts = [
  { id: '1', name: 'Beauty Clarant', sales: 10000 },
  { id: '2', name: 'Hydra Cream', sales: 8000 },
  { id: '3', name: 'Facial Serum', sales: 7000 },
];

const AdminOverviewPage: React.FC = () => {
    const theme = useTheme();
  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 4, width: '100%' }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Resumen General
      </Typography>
    
        <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <EcommerceWidgetSummary
                title="Product sold"
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
                title="Total balance"
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
                title="Sales profit"
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

      {/* Ventas Totales */}
      <Box sx={{ mt: 4, width: '100%' }}>
        <Typography variant="h5" fontWeight="medium" gutterBottom>
          Ventas Totales
        </Typography>
        <Grid container spacing={3} sx={{ width: '100%' }}>
          {[
            { label: 'Hoy', value: salesData.today },
            { label: 'Última Semana', value: salesData.lastWeek },
            { label: 'Último Mes', value: salesData.lastMonth },
            { label: 'Último Año', value: salesData.lastYear },
          ].map((item, index) => (
            <Grid xs={12} sm={6} md={3} key={index} sx={{ width: '100%' }}>
              <Card elevation={2} sx={{ height: '100%' }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    {item.label}
                  </Typography>
                  <Typography variant="h5" color="success.main" fontWeight="bold">
                    S/. {item.value.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Servicios Más Vendidos */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" fontWeight="medium" gutterBottom>
          Servicios Más Vendidos
        </Typography>
        <Card elevation={2}>
          <CardContent>
            <List disablePadding>
              {bestSellingServices.map((service, index) => (
                <React.Fragment key={service.id}>
                  <ListItem
                    sx={{
                      py: 1.5,
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <ListItemText
                      primary={service.name}
                    />
                    <Typography fontWeight="bold" color="primary.main">
                      S/. {service.sales.toFixed(2)}
                    </Typography>
                  </ListItem>
                  {index < bestSellingServices.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>

      {/* Productos Más Vendidos */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" fontWeight="medium" gutterBottom>
          Productos Más Vendidos
        </Typography>
        <Card elevation={2}>
          <CardContent>
            <List disablePadding>
              {bestSellingProducts.map((product, index) => (
                <React.Fragment key={product.id}>
                  <ListItem
                    sx={{
                      py: 1.5,
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <ListItemText
                      primary={product.name}
                    />
                    <Typography fontWeight="bold" color="primary.main">
                      S/. {product.sales.toFixed(2)}
                    </Typography>
                  </ListItem>
                  {index < bestSellingProducts.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default AdminOverviewPage;