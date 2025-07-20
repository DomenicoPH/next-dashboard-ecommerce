import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  CardMedia,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface Coupon {
  id: string;
  name: string;
  value: number;
  unit: 'relative' | 'absolute';
  imageUrl?: string;
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

  const handleDeleteClick = () => {
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    onDelete(coupon.id);
    setOpenDialog(false);
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
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
        <CardMedia
          component="img"
          image={
            coupon.imageUrl ||
            'https://depilzoneblob.blob.core.windows.net/articles/placeholder.webp'
          }
          alt={coupon.name}
          sx={{
            width: { xs: '100%', sm: 250 },
            height: { xs: 180, sm: 180 },
            objectFit: 'cover',
            borderRadius: 1,
          }}
        />

        <CardContent sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: { xs: 'center', sm: 'flex-start' }, 
          }}>
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