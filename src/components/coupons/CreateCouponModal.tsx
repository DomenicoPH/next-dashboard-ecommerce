import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';

interface CreateCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  fetchCoupons: () => void;
}

const CreateCouponModal: React.FC<CreateCouponModalProps> = ({
  isOpen,
  onClose,
  fetchCoupons,
}) => {
  const [couponData, setCouponData] = useState({
    name: '',
    amount: '',
    value: '',
    unit: 'relative',
    endDate: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    setCouponData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateCoupon = async () => {
    const payload = {
      name: couponData.name,
      amount: Number(couponData.amount),
      value: Number(couponData.value),
      unit: couponData.unit,
      endDate: couponData.endDate,
    };

    console.log('📦 Payload enviado:', payload);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/coupons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Cupón creado:', result);
        await fetchCoupons();
        handleClose();
      } else {
        const errorText = await response.text();
        console.error('❌ Error al crear cupón:', errorText);
      }
    } catch (error) {
      console.error('❌ Error de red:', error);
    }
  };

  const handleClose = () => {
    setCouponData({
      name: '',
      amount: '',
      value: '',
      unit: 'relative',
      endDate: '',
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ color: 'text.primary' }}>Generar Nuevo Cupón</DialogTitle>
      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            name="name"
            label="Nombre del Cupón"
            value={couponData.name}
            onChange={handleInputChange}
            fullWidth
            size="small"
          />
          <TextField
            name="amount"
            label="Cantidad disponible"
            type="number"
            value={couponData.amount}
            onChange={handleInputChange}
            fullWidth
            size="small"
          />
          <TextField
            name="value"
            label="Valor del descuento"
            type="number"
            value={couponData.value}
            onChange={handleInputChange}
            fullWidth
            size="small"
          />
          <FormControl fullWidth size="small">
            <InputLabel id="unit-label">Unidad</InputLabel>
            <Select
              labelId="unit-label"
              id="unit"
              name="unit"
              value={couponData.unit}
              label="Unidad"
              onChange={handleInputChange}
            >
              <MenuItem value="relative">Porcentaje</MenuItem>
              <MenuItem value="absolute">Valor Fijo</MenuItem>
            </Select>
          </FormControl>
          <TextField
            name="endDate"
            label="Fecha de Vencimiento"
            type="date"
            value={couponData.endDate}
            onChange={handleInputChange}
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={handleCreateCoupon} sx={{ mr: 2, mb: 2 }}>
          Crear Cupón
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateCouponModal;