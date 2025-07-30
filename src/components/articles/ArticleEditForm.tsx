'use client';

import {
  Grid,
  TextField,
  Typography,
  Box,
  FormControlLabel,
  Switch,
  Button,
} from '@mui/material';
import CustomAlert from '../ui/CustomAlert';
import { Article } from '@/interfaces/Article';

interface ArticleEditFormProps {
  article: Article;
  name: string;
  setName: (value: string) => void;
  price: string;
  setPrice: (value: string) => void;
  discountPrice: string;
  setDiscountPrice: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  stock: number;
  setStock: (value: number) => void;
  isActive: boolean;
  setIsActive: (value: boolean) => void;
  isDiscountActive: boolean;
  setIsDiscountActive: (value: boolean) => void;
  formChanges: Record<string, any>;
  imageChanges: any[];
  isLoading: boolean;
  handleInputChange: (field: string, value: any) => void;
  handleSaveChanges: () => Promise<void>;
  handleDiscardChanges: () => Promise<void>;
  alertOpen: boolean;
  alertMessage: string;
  alertSeverity: 'error' | 'warning' | 'info' | 'success';
  setAlertOpen: (value: boolean) => void;
}

export default function ArticleEditForm({
  article,
  name,
  setName,
  price,
  setPrice,
  discountPrice,
  setDiscountPrice,
  description,
  setDescription,
  stock,
  setStock,
  isActive,
  setIsActive,
  isDiscountActive,
  setIsDiscountActive,
  formChanges,
  imageChanges,
  isLoading,
  handleInputChange,
  handleSaveChanges,
  handleDiscardChanges,
  alertOpen,
  alertMessage,
  alertSeverity,
  setAlertOpen,
}: ArticleEditFormProps) {
  return (
    <Grid size={{ xs: 12, lg: 8 }} sx={{ maxWidth: 500, marginX: 'auto' }}>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Nombre del Producto/Servicio"
            fullWidth
            size="small"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              handleInputChange('name', e.target.value);
            }}
          />
          <Box mt={2}>
            <Typography variant="body2" fontWeight="bold" sx={{ color: 'text.primary' }}>
              Categoría:
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.primary' }}>
              {article.category.name}
            </Typography>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Precio"
            fullWidth
            size="small"
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
              handleInputChange('price', e.target.value);
            }}
          />
          {isDiscountActive && (
            <Box mt={2}>
              <TextField
                label="Precio con Descuento"
                fullWidth
                size="small"
                value={discountPrice}
                onChange={(e) => {
                  setDiscountPrice(e.target.value);
                  handleInputChange('discountPrice', e.target.value);
                }}
              />
            </Box>
          )}
        </Grid>
      </Grid>

      <Box mt={4}>
        <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>
          {article.type.name === 'product'
            ? 'Información del Producto'
            : 'Información del Servicio'}
        </Typography>
        <TextField
          label="Descripción"
          fullWidth
          multiline
          rows={4}
          size="small"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            handleInputChange('description', e.target.value);
          }}
        />
      </Box>

      <Grid container spacing={4} mt={2}>
        {article.type.name === 'product' && (
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label="Stock"
              type="number"
              fullWidth
              size="small"
              value={stock}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setStock(value);
                handleInputChange('stock', value);
              }}
            />
          </Grid>
        )}
        <Grid size={{ xs: 12, md: 4 }}>
          <FormControlLabel
            control={
              <Switch
                checked={isActive}
                onChange={() => {
                  setIsActive(!isActive);
                  handleInputChange('isActive', !isActive);
                }}
                color="success"
              />
            }
            label={<Typography sx={{ color: 'text.primary' }}>Activo</Typography>}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <FormControlLabel
            control={
              <Switch
                checked={isDiscountActive}
                onChange={() => {
                  setIsDiscountActive(!isDiscountActive);
                  handleInputChange('onDiscount', !isDiscountActive);
                }}
                color="primary"
              />
            }
            label={<Typography sx={{ color: 'text.primary' }}>Con Descuento</Typography>}
          />
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="flex-end" mt={4} gap={2}>
        {(Object.keys(formChanges).length > 0 || imageChanges.length > 0) && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleDiscardChanges}
            disabled={isLoading}
          >
            Descartar Cambios
          </Button>
        )}
        <Button
          variant="contained"
          color="success"
          onClick={handleSaveChanges}
          disabled={
            isLoading ||
            (Object.keys(formChanges).length === 0 && imageChanges.length === 0)
          }
        >
          Guardar
        </Button>
      </Box>

      <CustomAlert
        open={alertOpen}
        message={alertMessage}
        severity={alertSeverity}
        onClose={() => setAlertOpen(false)}
      />
    </Grid>
  );
}
