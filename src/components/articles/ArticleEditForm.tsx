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
import { Article } from '@/interfaces/Article';

interface ArticleEditFormProps {
  article: Article;
  formData: {
    name: string;
    price: string;
    discountPrice: string;
    description: string;
    stock: number;
    isActive: boolean;
    onDiscount: boolean;
  };
  formChanges: Record<string, any>;
  imageChanges: any[];
  isLoading: boolean;
  handleInputChange: (field: string, value: any) => void;
  handleSaveChanges: () => Promise<void>;
  handleDiscardChanges: () => Promise<void>;
}

export default function ArticleEditForm({
  article,
  formData,
  formChanges,
  imageChanges,
  isLoading,
  handleInputChange,
  handleSaveChanges,
  handleDiscardChanges,
}: ArticleEditFormProps) {
  
  return (
    <Grid size={{ xs: 12, lg: 8 }} sx={{ maxWidth: 500, marginX: 'auto' }}>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Nombre del Producto/Servicio"
            fullWidth
            size="small"
            value={formData.name}
            onChange={(e) => {
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
            value={formData.price}
            onChange={(e) => {
              handleInputChange('price', e.target.value);
            }}
          />
          {formData.onDiscount && (
            <Box mt={2}>
              <TextField
                label="Precio con Descuento"
                fullWidth
                size="small"
                value={formData.discountPrice}
                onChange={(e) => {
                  handleInputChange('discountPrice', e.target.value);
                }}
              />
            </Box>
          )}
        </Grid>
      </Grid>

      <Box mt={4}>
        <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>
          {article.category?.type?.name === 'product'
            ? 'Información del Producto'
            : 'Información del Servicio'}
        </Typography>
        <TextField
          label="Descripción"
          fullWidth
          multiline
          rows={4}
          size="small"
          value={formData.description}
          onChange={(e) => {
            handleInputChange('description', e.target.value);
          }}
        />
      </Box>

      <Grid container spacing={4} mt={2}>
        {article.category?.type?.name === 'product' && (
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label="Stock"
              type="number"
              fullWidth
              size="small"
              value={formData.stock}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                handleInputChange('stock', value);
              }}
            />
          </Grid>
        )}
        <Grid size={{ xs: 12, md: 4 }}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={() => {
                  handleInputChange('isActive', !formData.isActive);
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
                checked={formData.onDiscount}
                onChange={() => {
                  handleInputChange('onDiscount', !formData.onDiscount);
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

    </Grid>
  );
}
