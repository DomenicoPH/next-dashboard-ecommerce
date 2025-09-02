import React from 'react';
import {
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import PrimaryButton from '@/components/ui/PrimaryButton';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { Category } from '@/interfaces/Category';

interface ArticlesFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedType: string;
  setSelectedType: (value: string) => void;
  selectedProduct: string;
  setSelectedProduct: (value: string) => void;
  selectedService: string;
  setSelectedService: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  allProductNames: string[];
  allServiceNames: string[];
  onOpenCreateModal: () => void;
  onOpenCategoriesModal: () => void;
  categories: Category[];
}

const ArticlesFilters: React.FC<ArticlesFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedType,
  setSelectedType,
  selectedProduct,
  setSelectedProduct,
  selectedService,
  setSelectedService,
  selectedCategory,
  setSelectedCategory,
  allProductNames,
  allServiceNames,
  onOpenCreateModal,
  onOpenCategoriesModal,
  categories
}) => {
  return (
    <>
      <div className="flex items-center gap-2 w-full">

        <TextField
          label="Buscar por nombre..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          fullWidth
        />

        <div className="flex gap-2">
          <PrimaryButton 
            label="Crear Artículo" 
            icon={<AddIcon />} 
            onClick={onOpenCreateModal} 
          />
          <PrimaryButton 
            label="Categorías" 
            icon={<EditIcon />} 
            onClick={onOpenCategoriesModal} 
          />
        </div>

      </div>

      <div className="flex gap-6 mt-2 w-full">
        <RadioGroup
          row
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <FormControlLabel value="" control={<Radio />} label="Todos" />
          <FormControlLabel value="product" control={<Radio />} label="Productos" />
          <FormControlLabel value="service" control={<Radio />} label="Servicios" />
        </RadioGroup>
      </div>

      <div className="flex items-center gap-4 w-full mt-2">

        {(selectedType === '' || selectedType === 'product') && (
          <FormControl fullWidth size="small">
            <InputLabel>Filtrar por producto</InputLabel>
            <Select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              {allProductNames.map(name => (
                <MenuItem key={name} value={name}>{name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {(selectedType === '' || selectedType === 'service') && (
          <FormControl fullWidth size="small">
            <InputLabel>Filtrar por servicio</InputLabel>
            <Select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              {allServiceNames.map(name => (
                <MenuItem key={name} value={name}>{name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <FormControl size='small' sx={{ minWidth: 200 }}>
          <InputLabel>Filtrar por categoría</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            {categories.map(category => (
              <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

      </div>
    </>
  );
};

export default ArticlesFilters;
