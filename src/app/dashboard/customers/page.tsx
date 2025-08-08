'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Alert,
  TableContainer,
} from '@mui/material';
import { Customer } from '@/interfaces/Customer';
import CustomerRow from '@/components/customers/CustomerRow';
import {People} from '@mui/icons-material';
import SectionHeader from '@/components/ui/SectionHeader';

const AdminCustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch clientes
  const fetchCustomers = async () => {
    try {
      
      const token = localStorage.getItem('token');
      if(!token){
        throw new Error('No se encontró el token de autenticación.');
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/customers`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${token}`
        },
        cache: 'no-store',
      });

      if (!res.ok) {
        throw new Error(`Error al obtener clientes: ${res.status}`);
      }

      const data: Customer[] = await res.json();
      setCustomers(data);
    } catch (err) {
      console.error(err);
      setError('No se pudo cargar la lista de clientes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // colores para estado
  const getStatusColor = (status: Customer['status']) => {
    switch (status) {
      case 'Frecuente':
        return { bgColor: '#C8E6C9', textColor: '#256029' }; // Verde
      case 'Nuevo':
        return { bgColor: '#BBDEFB', textColor: '#0D47A1' }; // Azul
      case 'Inactivo':
        return { bgColor: '#FFCDD2', textColor: '#B71C1C' }; // Rojo
      default:
        return { bgColor: '#E0E0E0', textColor: '#424242' }; // Gris
    }
  };

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 4, width: '100%' }}>

      <SectionHeader
        icon={<People fontSize="large" />}
        title="Clientes"
      />

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
          <Table>
            <TableHead>
              <TableRow
                sx={(theme) => ({
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                })}
              >
                <TableCell sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>DNI</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Teléfono</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  Detalle
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((customer) => (
                <CustomerRow
                  key={customer.id}
                  customer={customer}
                  getStatusColor={getStatusColor}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AdminCustomersPage;
