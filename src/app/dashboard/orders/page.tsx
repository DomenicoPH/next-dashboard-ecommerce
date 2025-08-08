'use client';

import React, { useEffect, useState } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import { ShoppingCart } from '@mui/icons-material';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
} from '@mui/material';

interface Order {
  id: string;
  user: {
    name: string;
    email: string;
  };
  total: number;
  status: string;
  createdAt: string;
}

const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Error al obtener pedidos');
      }

      const data: Order[] = await res.json();
      setOrders(data);
    } catch (err) {
      console.error('Error al cargar pedidos:', err);
      setError('No se pudieron cargar los pedidos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 4, width: '100%' }}>
      <SectionHeader icon={<ShoppingCart fontSize="large" />} title="Pedidos" />

      {loading && (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error" mt={4}>
          {error}
        </Typography>
      )}

      {!loading && !error && (
        <Grid container spacing={3} mt={2}>
          {orders.length > 0 ? (
            orders.map((order) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={order.id}>
                <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">
                      Pedido #{order.id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Cliente: {order.user?.name || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      Total: <strong>S/ {order.total.toFixed(2)}</strong>
                    </Typography>
                    <Typography variant="body2" color="primary">
                      Estado: {order.status}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Fecha: {new Date(order.createdAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      variant="outlined"
                      onClick={() => console.log('Ver detalle', order.id)}
                    >
                      Ver Detalle
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography mt={4}>No hay pedidos registrados.</Typography>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default AdminOrdersPage;
