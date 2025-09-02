import React, { useState, useEffect } from 'react';
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
  SelectChangeEvent,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { Category } from '@/interfaces/Category';

interface CreateArticleModalProps {
  isOpen: boolean;
  categories: Category[];
  onClose: () => void;
  fetchArticles: () => void;
}

const token = localStorage.getItem('token');

const CreateArticleModal: React.FC<CreateArticleModalProps> = ({ isOpen, categories, onClose, fetchArticles }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    type: '',
    stock: '',
    size: '',
    brand: '',
    sessions: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        type: '',
        stock: '',
        size: '',
        brand: '',
        sessions: '',
      });
    }
  }, [isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTypeChange = (_: React.MouseEvent<HTMLElement>, newType: 'product' | 'service' | null) => {
    if (newType !== null) {
      setFormData((prev) => ({
        ...prev,
        type: newType,
        stock: '',
        size: '',
        brand: '',
        sessions: '',
      }));
    }
  };

  const handleCreate = async () => {
    setIsLoading(true);
    try {
      let body: any = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        categoryId: formData.category,
      };

      if (formData.type === 'product') {
        body = {
          ...body,
          stock: +formData.stock,
          size: formData.size,
          brand: formData.brand,
        };
      } else if (formData.type === 'service') {
        body = {
          ...body,
          sessions: +formData.sessions,
        };
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/articles/${formData.type}s`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        cache: 'no-store',
        body: JSON.stringify(body),
      });

      if (response.ok) {
        setFormData({
          name: '',
          description: '',
          price: '',
          category: '',
          type: '',
          stock: '',
          size: '',
          brand: '',
          sessions: '',
        });
        
        onClose();
        fetchArticles();
      }
    } catch (error) {
      // console.error('Error creating article:', error);
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ color: 'text.primary' }}>Crear Artículo</DialogTitle>
      <DialogContent dividers>

        <Box mt={2}>
          <Box mb={1} fontSize="0.875rem" fontWeight={500}>
            Selecciona un tipo:
          </Box>
          <ToggleButtonGroup
            value={formData.type}
            exclusive
            onChange={handleTypeChange}
            fullWidth
            disabled={isLoading}
            size="small"
          >
            <ToggleButton value="product">Producto</ToggleButton>
            <ToggleButton value="service">Servicio</ToggleButton>
          </ToggleButtonGroup>
        </Box>

      </DialogContent>

      <DialogContent dividers>

        <Box display="flex" gap={2} mt={1}>
          <TextField
            name="name"
            label="Nombre del artículo"
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
            disabled={isLoading}
            size="small"
          />
          <TextField
            name="price"
            label="Precio"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            fullWidth
            disabled={isLoading}
            size="small"
          />
        </Box>

        <TextField
          name="description"
          label="Descripción"
          value={formData.description}
          onChange={handleInputChange}
          multiline
          rows={3}
          fullWidth
          disabled={isLoading}
          margin="normal"
        />

        <FormControl fullWidth margin="dense" size="small">
          <InputLabel id="category-label">Categoría</InputLabel>
          <Select
            labelId="category-label"
            id="category"
            name="category"
            value={formData.category}
            label="Categoría"
            onChange={handleInputChange}
            disabled={isLoading || !formData.type}
          >
            <MenuItem value="">Seleccionar Categoría</MenuItem>
            {categories
              .filter( cat => cat.type?.name === formData.type )
              .map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {formData.type === 'product' && (
          <Box mt={2} display="flex" gap={2}>
            <TextField
              name="stock"
              label="Stock"
              type="number"
              value={formData.stock}
              onChange={handleInputChange}
              fullWidth
              disabled={isLoading}
              size="small"
            />
            <TextField
              name="size"
              label="Tamaño"
              value={formData.size}
              onChange={handleInputChange}
              fullWidth
              disabled={isLoading}
              size="small"
            />
          </Box>
        )}

        {formData.type === 'product' && (
          <TextField
            name="brand"
            label="Marca"
            value={formData.brand}
            onChange={handleInputChange}
            fullWidth
            disabled={isLoading}
            margin="normal"
            size="small"
          />
        )}

        {formData.type === 'service' && (
          <TextField
            name="sessions"
            label="Cantidad de sesiones"
            type="number"
            value={formData.sessions}
            onChange={handleInputChange}
            fullWidth
            disabled={isLoading}
            margin="normal"
            size="small"
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreate}
          disabled={isLoading}
        >
          {isLoading ? 'Creando...' : 'Crear'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateArticleModal;
