'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import CouponItem from '@/components/coupons/CouponItem';
import CreateCouponModal from '@/components/coupons/CreateCouponModal';
import {LocalOffer} from '@mui/icons-material';
import SectionHeader from '@/components/ui/SectionHeader';
import CustomAlert from '@/components/ui/CustomAlert';
import PrimaryButton from '@/components/ui/PrimaryButton';
import AddIcon from '@mui/icons-material/Add';

interface Coupon {
  id: string;
  name: string;
  amount: number;
  value: number;
  unit: 'relative' | 'absolute';
  endDate: string;
  startDate: string;
  image?: {
    id: string;
    name: string;
    imgUrl: string;
  };
}

const AdminCouponsPage: React.FC = () => {

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

   // estados de alerta
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'error' | 'success' | 'info' | 'warning'>('info');

  const showAlert = (message: string, severity: 'error' | 'success' | 'info' | 'warning' = 'info') => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const fetchCoupons = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/coupons?limit=200`
      );

      if (!response.ok) throw new Error('Error al obtener cupones');

      const data: Coupon[] = await response.json();

      // ordena por fecha de creación (startDate), más reciente primero
      const sortedCoupons = data.sort(
        (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );

      setCoupons(sortedCoupons);
    } catch (error) {
      console.error('Error al cargar cupones:', error);
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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/coupons/${id}`,
        { method: 'DELETE' }
      );

      if (response.ok) {
        console.log('Cupón eliminado');
        await fetchCoupons();
      } else {
        const errorText = await response.text();
        console.error('Error al eliminar cupón:', errorText);
      }
    } catch (error) {
      console.error('Error de red al eliminar cupón:', error);
    }
  };

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 4, width: '100%' }}>

      <SectionHeader
        icon={<LocalOffer fontSize="large" />}
        title="Cupones"
      />

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
        }}
      >
        <Typography variant="h5" fontWeight="medium">
          Cupones Activos: {coupons.length}
        </Typography>

        <PrimaryButton
          label="Generar Cupón"
          icon={<AddIcon />}
          onClick={() => setIsModalOpen(true)}
        />
        
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {coupons.map((coupon) => (
          <CouponItem
            key={coupon.id}
            coupon={coupon}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            fetchCoupons={fetchCoupons}
          />
        ))}
      </Box>

      <CreateCouponModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        fetchCoupons={fetchCoupons}
        onShowAlert={(msg, severity) => showAlert(msg, severity)}
      />


      <CustomAlert
        open={alertOpen}
        message={alertMessage}
        severity={alertSeverity}
        onClose={() => setAlertOpen(false)}
      />

    </Box>
  );
};

export default AdminCouponsPage;
