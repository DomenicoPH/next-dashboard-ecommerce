'use client';

import { useRouter } from 'next/navigation';
import { Customer } from '@/interfaces/Customer';
import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Chip,
  Paper,
  List,
  ListItem,
  Divider,
} from '@mui/material';

interface CustomerDetailViewProps {
  customer: Customer;
}

const CustomerDetailView: React.FC<CustomerDetailViewProps> = ({ customer }) => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nDni, setnDni] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  const [editableFields, setEditableFields] = useState<Record<string, boolean>>({});
  const [imagePanelHeight, setImagePanelHeight] = useState<number | null>(null);

  const router = useRouter();
  const imagePanelRef = useRef<HTMLDivElement>(null);

  const purchaseHistory = [
    { date: '10/07/2025', amount: 150.0, description: 'Depilación Piernas' },
    { date: '02/07/2025', amount: 80.0, description: 'Depilación Axilas' },
    { date: '25/06/2025', amount: 120.0, description: 'Depilación Brazos' },
    { date: '15/06/2025', amount: 200.0, description: 'Depilación Completa' },
    { date: '10/06/2025', amount: 90.0, description: 'Depilación Rostro' },
    { date: '05/06/2025', amount: 50.0, description: 'Depilación Ceja' },
    { date: '30/05/2025', amount: 70.0, description: 'Depilación Labio' },
    { date: '25/05/2025', amount: 120.0, description: 'Depilación Brazos' },
    { date: '20/05/2025', amount: 80.0, description: 'Depilación Axilas' },
  ];

  useEffect(() => {
    if (customer) {
      setName(customer.name || '');
      setLastName(customer.lastName || '');
      setnDni(customer.nDni || '');
      setPhone(customer.phone || '');
      setEmail(customer.email || '');
      setAddress(customer.address || '');
      setNotes('');
    }
  }, [customer]);

  useLayoutEffect(() => {
    if (imagePanelRef.current) {
      setImagePanelHeight(imagePanelRef.current.offsetHeight);
    }
  }, [customer]);

  const handleEditClick = (field: string) => {
    setEditableFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const getStatusColor = (status: Customer['status']) => {
    switch (status) {
      case 'Frecuente':
        return { bgColor: '#C8E6C9', textColor: '#256029' };
      case 'Nuevo':
        return { bgColor: '#BBDEFB', textColor: '#0D47A1' };
      case 'Inactivo':
        return { bgColor: '#FFCDD2', textColor: '#B71C1C' };
      default:
        return { bgColor: '#E0E0E0', textColor: '#424242' };
    }
  };

  const statusColors = getStatusColor(customer.status);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight="bold" mb={4}>
        Detalle del Cliente
      </Typography>

    {/* Contenedor con Imagen y Historial */}
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        mb: 1,
        alignItems: 'flex-start',
        flexDirection: { xs: 'column', md: 'row' }
      }}
    >
      {/* Imagen y Estado */}
      <Paper
        ref={imagePanelRef}
        sx={{
          p: 3,
          width: { xs: '100%', md: 280 },
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 4,
        }}
      >
        <Avatar
          src="/favicon.ico"
          alt="Profile Image"
          sx={{ width: 128, height: 128, mb: 2 }}
        />
        <Chip
          label={customer.status}
          sx={{
            backgroundColor: statusColors.bgColor,
            color: statusColors.textColor,
            fontWeight: 'bold',
            mb: 1,
          }}
        />
        <Typography variant="body2" color="text.secondary">
          Última compra: DD/MM/YYYY S/. XXXX.XX
        </Typography>
      </Paper>
        
      {/* Historial de Compras */}
      <Paper
        sx={{
          p: 2,
          flex: 1,
          width: { xs: '100%', md: 'auto' },
          height: { xs: 'auto', md: imagePanelHeight ? `${imagePanelHeight}px` : 'auto' },
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 4,
        }}
      >
        {/* Título */}
        <Typography variant="h6" fontWeight="bold" mb={1}>
          Historial de Compras
        </Typography>
    
        {/* Encabezado */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            fontWeight: 'bold',
            px: 1,
            mb: 1,
          }}
        >
          <Typography sx={{ flex: 2 }}>Producto</Typography>
          <Typography sx={{ flex: 1, textAlign: 'center' }}>Fecha de compra</Typography>
          <Typography sx={{ flex: 1, textAlign: 'right', paddingRight: '10px' }}>Monto</Typography>
        </Box>
        <Divider />
        
        {/* Contenido scrollable */}
        <Box sx={{ flex: 1, overflowY: 'auto', mt: 1 }}>
          <List dense disablePadding>
            {purchaseHistory.map((purchase, index) => (
              <React.Fragment key={index}>
                <ListItem
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    px: 1,
                    py: 0.5,
                  }}
                >
                  <Typography sx={{ flex: 2 }}>{purchase.description}</Typography>
                  <Typography sx={{ flex: 1, textAlign: 'center' }}>{purchase.date}</Typography>
                  <Typography sx={{ flex: 1, textAlign: 'right' }}>
                    S/. {purchase.amount.toFixed(2)}
                  </Typography>
                </ListItem>
                {index < purchaseHistory.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Paper>
    </Box>

      {/* Datos del Cliente */}
      <Paper sx={{ p: 3, mb: 1, borderRadius: 4, }}>
        <Grid container spacing={2}>
          {[
            { key: 'name', label: 'Nombre', value: name, setValue: setName },
            { key: 'lastName', label: 'Apellido', value: lastName, setValue: setLastName },
            { key: 'nDni', label: 'DNI', value: nDni, setValue: setnDni },
            { key: 'phone', label: 'Teléfono', value: phone, setValue: setPhone },
            { key: 'email', label: 'Email', value: email, setValue: setEmail },
            { key: 'address', label: 'Dirección', value: address, setValue: setAddress },
          ].map((field) => (
            <Grid size={{ xs: 12 }} key={field.key}>
              <Box display="flex" gap={1}>
                <TextField
                  fullWidth
                  label={field.label}
                  variant="outlined"
                  size="small"
                  value={field.value}
                  onChange={(e) => field.setValue(e.target.value)}
                  disabled={!editableFields[field.key]}
                />
                <Button
                  variant="outlined"
                  color={editableFields[field.key] ? 'success' : 'primary'}
                  sx={{ whiteSpace: 'nowrap' }}
                  onClick={() => handleEditClick(field.key)}
                >
                  {editableFields[field.key] ? 'Ok' : 'Editar'}
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Notas */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 4, }}>
        <Typography variant="subtitle1" mb={1}>
          Notas/Aclaraciones
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="Escribe tus notas aquí..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </Paper>

      {/* Botones principales */}
      <Box display="flex" justifyContent="center" gap={2} mb={4}>
        <Button variant="contained" color="primary">
          Enviar Mail
        </Button>
        <Button variant="contained" color="success">
          Whatsapp
        </Button>
        <Button variant="contained" color="secondary">
          Generar Cupón
        </Button>
      </Box>

      {/* Botones finales */}
      <Box display="flex" justifyContent="flex-end" gap={2}>
        <Button
          variant="outlined"
          color="inherit"
          onClick={() => router.push('/customers')}
        >
          Cerrar
        </Button>
        <Button variant="contained" color="primary">
          Guardar
        </Button>
      </Box>
    </Box>
  );
};

export default CustomerDetailView;
