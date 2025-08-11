import React from 'react';
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
  ListItemSecondaryAction,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Category } from '@/interfaces/Category';

interface CategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
}

const CategoriesModal: React.FC<CategoriesModalProps> = ({ isOpen, onClose, categories }) => {
  const [newCategoryName, setNewCategoryName] = React.useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategoryName(e.target.value);
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    
    try {
      const res = await fetch(
        'https://nestjs-eccommercex-819245f6bb7d.herokuapp.com/api/v1/categories',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
          body: JSON.stringify({ name: newCategoryName.trim() }),
        }
      );
    
      if (!res.ok) {
        throw new Error('No se pudo crear la categoría');
      }
    
      const newCategory = await res.json();
    
      // TODO: actualizar lista en AdminArticlesPage (por ahora, solo limpiamos input)
      setNewCategoryName('');
      alert(`Categoría "${newCategory.name}" creada con éxito.`);
    } catch (error) {
      console.error(error);
      alert('Ocurrió un error al crear la categoría.');
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    // funcionalidad se implementará después
  };

  return (
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
                  <IconButton edge="end" onClick={() => handleDeleteCategory(category.id)}>
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
  );
};

export default CategoriesModal;
