'use client';

import React, { useState, useRef } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  IconButton,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ConfirmDialog from '../ui/ConfirmDialog';
import Image from 'next/image';
import DeleteButtonWithConfirm from '../ui/DeleteButton';

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
  fetchCoupons: () => Promise<void>;
}

const CouponItem: React.FC<CouponItemProps> = ({
  coupon,
  onView,
  onEdit,
  onDelete,
  fetchCoupons,
}) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openRemoveImageDialog, setOpenRemoveImageDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState(coupon.image?.imgUrl || '');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const token = localStorage.getItem('token');

  const handleDeleteCoupon = () => {
    onDelete(coupon.id);
    setOpenDeleteDialog(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImageUrl(previewUrl);

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/files/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`
        },
        cache: 'no-store'
      });

      if (!uploadRes.ok) throw new Error('Error al subir imagen');
      const uploadData = await uploadRes.json();

      const updateRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/coupons/images`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        cache: 'no-store',
        body: JSON.stringify({
          couponId: coupon.id,
          image: { name: uploadData.filename },
        }),
      });

      if (!updateRes.ok) throw new Error('Error al asociar imagen al cupón');

      await fetchCoupons();
    } catch (error) {
      console.error('Error al subir imagen:', error);
      alert('Hubo un problema al subir la imagen.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    try {
      setIsUploading(true);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/coupons/images`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        cache: 'no-store',
        body: JSON.stringify({
          couponId: coupon.id,
          image: {},
        }),
      });

      if (!res.ok) throw new Error('Error al eliminar imagen');

      setImageUrl('');
      await fetchCoupons();
    } catch (error) {
      console.error('Error al eliminar imagen:', error);
      alert('Hubo un problema al eliminar la imagen.');
    } finally {
      setIsUploading(false);
      setOpenRemoveImageDialog(false);
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
          pr: 5
        }}
      >
        {/* Imagen */}
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
              <Image
                width={300}
                height={300}
                priority
                src={imageUrl}
                alt={coupon.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
             
              <Box
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: .5,
                }}
              >
                <IconButton
                  onClick={handleUploadClick}
                  sx={{
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    color: '#fff',
                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.8)' },
                  }}
                >
                  <CloudUploadIcon fontSize="small" />
                </IconButton>
                <IconButton
                  onClick={() => setOpenRemoveImageDialog(true)}
                  sx={{
                    backgroundColor: 'rgba(255,0,0,0.6)',
                    color: '#fff',
                    '&:hover': { backgroundColor: 'rgba(255,0,0,0.8)' },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
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

        {/* Eliminar cupón */}
        <DeleteButtonWithConfirm
          onConfirm={() => onDelete(coupon.id)}
          confirmMessage={`¿Estás seguro de que deseas eliminar el cupón "${coupon.name}"? Esta acción no se puede deshacer.`}
          confirmTitle="Eliminar Cupón"
          buttonText="Eliminar"
          color="error"
          variant="outlined"
        />

      </Card>

      {/* Confirmación eliminar imagen */}
      <ConfirmDialog
        open={openRemoveImageDialog}
        title="Eliminar Imagen"
        message="¿Estás seguro de que deseas eliminar la imagen de este cupón?"
        action='Eliminar'
        onConfirm={handleRemoveImage}
        onCancel={() => setOpenRemoveImageDialog(false)}
      />

      {/* Confirmación eliminar cupón */}
      <ConfirmDialog
        open={openDeleteDialog}
        title="Eliminar Cupón"
        message={`¿Estás seguro de que deseas eliminar el cupón "${coupon.name}"? Esta acción no se puede deshacer.`}
        action='Eliminar'
        onConfirm={handleDeleteCoupon}
        onCancel={() => setOpenDeleteDialog(false)}
      />
    </>
  );
};

export default CouponItem;
