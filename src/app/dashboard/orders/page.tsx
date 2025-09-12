'use client';

import React, { useEffect, useState } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import { ShoppingCart } from '@mui/icons-material';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from '@mui/material';
import PaginationComponent from '@/components/ui/Pagination';

interface Order {
  id: string;
  purchaseNumber: number;
  totalPrice: string;
  status: string;
  orderDetails: {
    id: string;
    price: number;
    amount: number;
    article: {
      id: string;
      name: string;
      mainImage?: { imgUrl: string };
    };
  }[];
}

const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Estado para paginación
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders?limit=200`, {
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

  // Calcular paginación en frontend
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const paginatedOrders = orders.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 4, width: '100%' }}>
      <SectionHeader icon={<ShoppingCart fontSize="medium" />} title="Pedidos" />

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
        <>
          <Stack spacing={2} mt={2}>
            {paginatedOrders.length > 0 ? (
              paginatedOrders.map((order) => (
                <Card key={order.id} sx={{ borderRadius: 3, boxShadow: 3, width: '100%' }}>
                  <CardContent>
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="space-between"
                      alignItems={{ xs: 'flex-start', md: 'center' }}
                      gap={2}
                    >
                      {/* Contenido izquierdo */}
                      <Box
                        display="flex"
                        flexDirection={{ xs: 'column', md: 'row' }}
                        justifyContent={{ md: 'space-between' }}
                        alignItems={{ md: 'center' }}
                        gap={{ xs: 1, md: 4 }}
                        flex={1}
                      >
                        <Typography variant="h6" fontWeight="bold" display="flex" alignItems="center" gap={1}>
                          <ShoppingCart fontSize="medium" /> Pedido #{order.purchaseNumber}
                        </Typography>

                        <Typography variant="body2">
                          Total: <strong>S/ {parseFloat(order.totalPrice).toFixed(2)}</strong>
                        </Typography>

                        <Typography variant="body2" color="primary">
                          Estado: {order.status}
                        </Typography>

                        <Typography variant="body2">
                          Artículos: {order.orderDetails.length}
                        </Typography>
                      </Box>

                      {/* Botón a la derecha */}
                      <CardActions sx={{ p: 0, ml: { md: 4 } }}>
                        <Button
                          size="small"
                          color="primary"
                          variant="outlined"
                          onClick={() => setSelectedOrder(order)}
                        >
                          Ver Detalle
                        </Button>
                      </CardActions>
                    </Box>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography mt={4}>No hay pedidos registrados.</Typography>
            )}
          </Stack>

          {/* Paginación */}
          <PaginationComponent
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />

        </>
      )}

      {/* Modal de Detalle */}
      <Dialog
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedOrder && (
          <>
            <DialogTitle>
              Detalle del Pedido #{selectedOrder.purchaseNumber}
            </DialogTitle>
            <DialogContent dividers>
              <Typography variant="subtitle1" gutterBottom>
                Estado: {selectedOrder.status}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Total: S/ {parseFloat(selectedOrder.totalPrice).toFixed(2)}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Artículos
              </Typography>
              <Stack spacing={2}>
                {selectedOrder.orderDetails.map((detail) => (
                  <Box
                    key={detail.id}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ borderBottom: '1px solid #eee', pb: 1 }}
                  >
                    <Box>
                      <Typography variant="body1">{detail.article.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Cantidad: {detail.amount}
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      S/ {detail.price.toFixed(2)}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedOrder(null)} color="primary">
                Cerrar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default AdminOrdersPage;
