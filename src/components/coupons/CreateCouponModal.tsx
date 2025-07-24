'use client';

import React, { useState, useRef } from 'react';
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
  CircularProgress,
  IconButton,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Image from 'next/image';

interface CreateCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  fetchCoupons: () => void;
  onShowAlert: (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void;
}

const CreateCouponModal: React.FC<CreateCouponModalProps> = ({
  isOpen,
  onClose,
  fetchCoupons,
  onShowAlert
}) => {
  const [couponData, setCouponData] = useState({
    name: '',
    amount: '',
    value: '',
    unit: 'relative',
    endDate: '',
  });

  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageName, setImageName] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    setCouponData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/files/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) throw new Error('Error al subir imagen');
      const uploadData = await uploadRes.json();

      setImageName(uploadData.filename); // guarda nombre para el payload
      onShowAlert('Imagen subida correctamente', 'success');
    } catch (error) {
      console.error('Error al subir imagen:', error);
      onShowAlert('Hubo un problema al subir la imagen.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateCoupon = async () => {
    const payload = {
      name: couponData.name,
      amount: Number(couponData.amount),
      value: Number(couponData.value),
      unit: couponData.unit,
      endDate: couponData.endDate,
      ...(imageName && { imageName }), // si hay imagen, la incluye
    };

    console.log('payload enviado:', payload);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/coupons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await fetchCoupons();
        onShowAlert('Cupón creado con éxito', 'success');
        handleClose();
      } else {
        onShowAlert('Error al crear cupón', 'error');
      }
    } catch (error) {
      onShowAlert('Error de red. Intenta nuevamente.', 'error');
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
    setImagePreview('');
    setImageName('');
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

          {/* Área de imagen con overlay */}
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: 180,
              borderRadius: 2,
              backgroundColor: '#f0f0f0',
              overflow: 'hidden',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mt: 1,
            }}
          >
            {isUploading ? (
              <CircularProgress />
            ) : imagePreview ? (
              <>
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  style={{ objectFit: 'cover' }}
                />
                <IconButton
                  onClick={handleUploadClick}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    color: '#fff',
                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.8)' },
                  }}
                >
                  <CloudUploadIcon fontSize="small" />
                </IconButton>
              </>
            ) : (
              <IconButton
                onClick={handleUploadClick}
                sx={{
                  width: 80,
                  height: 80,
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  borderRadius: '50%',
                }}
              >
                <CloudUploadIcon sx={{ fontSize: 40, color: '#777' }} />
              </IconButton>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateCoupon}
          disabled={isUploading}
          sx={{ mr: 2, mb: 2 }}
        >
          Crear Cupón
        </Button>
      </DialogActions>

    </Dialog>
  );
};

export default CreateCouponModal;