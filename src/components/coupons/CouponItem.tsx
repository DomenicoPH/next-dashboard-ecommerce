'use client';

import React, { useState, useRef } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EditIcon from '@mui/icons-material/Edit';

interface Coupon {
  id: string;
  name: string;
  value: number;
  unit: 'relative' | 'absolute';
  image?: {
    id: string;
    name: string;
    imgUrl: string;
  };
}

interface CouponItemProps {
  coupon: Coupon;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const CouponItem: React.FC<CouponItemProps> = ({
  coupon,
  onView,
  onEdit,
  onDelete,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState(coupon.image?.imgUrl || '');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDeleteClick = () => setOpenDialog(true);
  const handleConfirmDelete = () => {
    onDelete(coupon.id);
    setOpenDialog(false);
  };
  const handleCancelDelete = () => setOpenDialog(false);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // ✅ Preview inmediato
    const previewUrl = URL.createObjectURL(file);
    setImageUrl(previewUrl);

    setIsUploading(true);
    try {
      // 1️⃣ Subir imagen temporal
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/files/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) throw new Error('Error al subir imagen');
      const uploadData = await uploadRes.json();

      // 2️⃣ Asociar imagen al cupón
      const updateRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/coupons/images`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          couponId: coupon.id,
          image: { name: uploadData.filename },
        }),
      });

      if (!updateRes.ok) throw new Error('Error al asociar imagen al cupón');
      const updatedCoupon = await updateRes.json();

      // ✅ Usa la URL real del backend, con fallback a temp/
      if (updatedCoupon.image?.imgUrl) {
        setImageUrl(updatedCoupon.image.imgUrl);
      } else {
        // Fallback a temp
        setImageUrl(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/files/temp/${uploadData.filename}`);
      }

    } catch (error) {
      console.error('❌ Error al subir imagen:', error);
      alert('Hubo un problema al subir la imagen.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <Card
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { sm: 'center' },
          width: '100%',
          overflow: 'hidden',
          borderRadius: 4,
          p: 1,
        }}
      >
        {/* Imagen o upload */}
        <Box
          sx={{
            position: 'relative',
            width: { xs: '100%', sm: 250 },
            height: { xs: 180, sm: 180 },
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f0f0f0',
            borderRadius: 1,
            overflow: 'hidden',
          }}
        >
          {isUploading ? (
            <CircularProgress />
          ) : imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt={coupon.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  // Fallback si la URL principal falla
                  if (coupon.image?.name) {
                    (e.currentTarget as HTMLImageElement).src =
                      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/files/temp/${coupon.image.name}`;
                  }
                }}
              />
              <IconButton
                onClick={handleUploadClick}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  color: '#fff',
                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
                }}
              >
                <EditIcon fontSize="small" />
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

        {/* Información */}
        <CardContent
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: { xs: 'center', sm: 'flex-start' },
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {coupon.name}
          </Typography>
          <Typography variant="body1" color="text.primary">
            <strong>Código:</strong> {coupon.name}
          </Typography>
          <Typography variant="h6" color="success.main" fontWeight="bold">
            {coupon.unit === 'relative'
              ? `${coupon.value}% de descuento`
              : `S/.${coupon.value} de descuento`}
          </Typography>
        </CardContent>

        {/* Eliminar */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: { xs: 'center', sm: 'flex-start' },
            gap: 1,
            pr: { sm: 2 },
            pb: { xs: 2, sm: 0 },
          }}
        >
          <Button
            variant="outlined"
            color="error"
            onClick={handleDeleteClick}
            endIcon={<DeleteIcon />}
          >
            Eliminar
          </Button>
        </Box>
      </Card>

      {/* Confirmación eliminación */}
      <Dialog open={openDialog} onClose={handleCancelDelete}>
        <DialogTitle>Eliminar Cupón</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar el cupón "<strong>{coupon.name}</strong>"? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CouponItem;
