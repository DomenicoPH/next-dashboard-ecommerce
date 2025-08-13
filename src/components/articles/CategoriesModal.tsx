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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Category } from '@/interfaces/Category';
import CustomAlert from '../ui/CustomAlert';
import ConfirmDialog from '../ui/ConfirmDialog';

interface CategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  refreshCategories: () => Promise<void>;
}

const CategoriesModal: React.FC<CategoriesModalProps> = ({ isOpen, onClose, categories, refreshCategories }) => {

  const [newCategoryName, setNewCategoryName] = React.useState('');
  const token = localStorage.getItem('token');
  // customAlert
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'error'|'warning'|'info'|'success'>('info');
  // confirmDialog
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string|null>(null);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategoryName(e.target.value);
  };

  const showAlert = (message:string, severity:'error'|'warning'|'info'|'success') => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  }

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          cache: 'no-store',
          body: JSON.stringify({ categoryName: newCategoryName.trim() }),
        }
      );
    
      if (!res.ok) {
        throw new Error('No se pudo crear la categoría');
      }
    
      const newCategory = await res.json();
    
      setNewCategoryName('');
      showAlert(`Categoría "${newCategory.name}" creada con éxito`, 'success');
      await refreshCategories();
    
    } catch (error) {
      console.error(error);
      showAlert(`Ocurrió un error al crear la categoría`, 'error');
    }
  };

  const requestDeleteCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setConfirmOpen(true);
  }

  const handleConfirmDelete = async () => {

    if(!selectedCategoryId) return;

    try {
      
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories/${selectedCategoryId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          },
          cache: 'no-store',
        }
      );

      if(!res.ok){
        throw new Error('No se pudo eliminar la categoría.');
      }

      showAlert('Categoría eliminada con éxito', 'success');
      await refreshCategories();

    } catch (error) {
      console.error(error);
      showAlert('Ocurrió un error al eliminar la categoría', 'error');
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
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateCategory}
              disabled={!newCategoryName.trim()}
            >
              Crear categoría
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
                    <IconButton edge="end" onClick={() => requestDeleteCategory(category.id)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText primary={category.name} />
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

      {/* CustomAlert */}
      <CustomAlert 
        open={alertOpen}
        message={alertMessage}
        severity={alertSeverity}
        onClose={() => setAlertOpen(false)}
      />

      {/* ConfirmDialog */}
      <ConfirmDialog 
        open={confirmOpen}
        title='Eliminar categoría'
        message='¿Seguro que deseas eliminar esta categoría?'
        action='Eliminar'
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />

    </>
  );
};

export default CategoriesModal;
