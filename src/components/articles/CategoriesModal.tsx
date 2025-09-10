'use client';
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Category } from '@/interfaces/Category';
import ConfirmDialog from '../ui/ConfirmDialog';
import { useNotification } from '@/context/NotificationContext';

interface CategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  refreshCategories: () => Promise<void>;
}

const CategoriesModal: React.FC<CategoriesModalProps> = ({ isOpen, onClose, categories, refreshCategories }) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryType, setNewCategoryType] = useState<'service' | 'product'>('service');

  // confirmDialog
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategoryName(e.target.value);
  };

  const { notify } = useNotification();

  const handleCreateCategory = async () => {
    const token = localStorage.getItem('token');
    if (!newCategoryName.trim()) return;

    const typeMap: Record<typeof newCategoryType, number> = {
      service: 1,
      product: 2,
    };
    const typeId = typeMap[newCategoryType];

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
        body: JSON.stringify({
          categoryName: newCategoryName.trim(),
          typeName: newCategoryType
        }),
      });

      if (!res.ok) {
        throw new Error('No se pudo crear la categoría');
      }

      const newCategory = await res.json();

      setNewCategoryName('');
      setNewCategoryType('service'); // reset al default
      notify(`Categoría "${newCategory.name}" creada con éxito`, 'success');
      await refreshCategories();
    } catch (error) {
      console.error(error);
      notify('Ocurrió un error al crear la categoría', 'error');
    }
  };

  const requestDeleteCategory = (categoryId: string, categoryName: string) => {
    setSelectedCategoryId(categoryId);
    setSelectedCategoryName(categoryName);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    const token = localStorage.getItem('token');
    if (!selectedCategoryId) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories/${selectedCategoryId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
      });

      if (!res.ok) {
        throw new Error('No se pudo eliminar la categoría.');
      }

      notify('Categoría eliminada con éxito', 'success');
      await refreshCategories();
    } catch (error) {
      console.error(error);
      notify('Ocurrió un error al eliminar la categoría', 'error');
    } finally {
      setConfirmOpen(false);
      setSelectedCategoryId(null);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ color: 'text.primary' }}>Categorías</DialogTitle>

        <DialogContent dividers>
          {/* Campo para nueva categoría */}
          <Box display="flex" gap={2} mb={3}>
            <TextField
              label="Nombre de nueva categoría"
              fullWidth
              size="small"
              value={newCategoryName}
              onChange={handleInputChange}
              sx={{ width: 275 }}
            />

            <TextField
              select
              label="Tipo"
              size="small"
              value={newCategoryType}
              onChange={(e) => setNewCategoryType(e.target.value as 'service' | 'product')}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="service">Servicio</MenuItem>
              <MenuItem value="product">Producto</MenuItem>
            </TextField>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateCategory}
              disabled={!newCategoryName.trim()}
            >
              Crear
            </Button>
          </Box>

          {/* Lista de categorías existentes */}
          <Typography variant="subtitle1" fontWeight={500} gutterBottom>
            Categorías existentes:
          </Typography>

          <List dense disablePadding>
            {categories.length === 0 ? (
              <Typography variant="body2" color="text.secondary" mt={1}>
                No hay categorías creadas aún.
              </Typography>
            ) : (
              categories.map((category) => (
                <ListItem
                  key={category.id}
                  divider
                  secondaryAction={
                    <IconButton edge="end" onClick={() => requestDeleteCategory(category.id, category.name)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={category.name}
                    secondary={category.type?.name ? `Tipo: ${category.type.name === 'service' ? 'Servicio' : category.type.name === 'product' ? 'Producto' : 'Promoción'}` : undefined}
                  />
                </ListItem>
              ))
            )}
          </List>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} variant="outlined">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* ConfirmDialog */}
      <ConfirmDialog
        open={confirmOpen}
        title="Eliminar categoría"
        message={`¿Seguro que deseas eliminar la categoría ${selectedCategoryName}?`}
        action="Eliminar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
};

export default CategoriesModal;
