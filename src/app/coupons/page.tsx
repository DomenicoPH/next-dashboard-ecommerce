'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import CouponItem from '@/components/coupons/CouponItem';
import CreateCouponModal from '@/components/coupons/CreateCouponModal';

interface Coupon {
  id: string;
  name: string;
  amount: number;
  value: number;
  unit: 'relative' | 'absolute';
  endDate: string;
  image?: {
    id: string;
    name: string;
    imgUrl: string;
  };
}

const AdminCouponsPage: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCoupons = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/coupons?limit=200`);
      const data = await response.json();
      setCoupons(data);
    } catch (error) {
      console.error('Error al obtener cupones:', error);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleView = (id: string) => {
    console.log('Ver cupón', id);
  };

  const handleEdit = (id: string) => {
    console.log('Editar cupón', id);
  };

  const handleDelete = async (id: string) => {
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/coupons/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('✅ Cupón eliminado');
        await fetchCoupons();
      } else {
        const errorText = await response.text();
        console.error('❌ Error al eliminar cupón:', errorText);
      }
    } catch (error) {
      console.error('❌ Error de red al eliminar cupón:', error);
    }
  };

  return (
    <Box sx={{ width: '100%', px: { xs: 2, md: 6 }, py: 4 }}>

      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Cupones
      </Typography>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h5" fontWeight="medium" gutterBottom>
          Activos: {coupons.length}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2, mb: 4 }}
          onClick={() => setIsModalOpen(true)}
        >
          Generar Cupón
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {coupons.map((coupon) => (
          <CouponItem
            key={coupon.id}
            coupon={coupon}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </Box>

      <CreateCouponModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        fetchCoupons={fetchCoupons}
      />
      
    </Box>
  );
};

export default AdminCouponsPage;