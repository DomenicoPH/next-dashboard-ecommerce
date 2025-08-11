'use client';

import React, { useEffect, useMemo, useState } from 'react';
import ArticleItem from '@/components/articles/ArticleItem';
import CreateArticleModal from '@/components/articles/CreateArticleModal';
import CategoriesModal from '@/components/articles/CategoriesModal';
import ArticleOverview from '@/components/articles/ArticleOverview';
import ArticleEdit from '@/components/articles/ArticleEdit';
import { Article } from '../../../interfaces/Article';
import { Category } from '../../../interfaces/Category';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import SectionHeader from '@/components/ui/SectionHeader';
import { Inventory2 } from '@mui/icons-material';
import PrimaryButton from '@/components/ui/PrimaryButton';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import {
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Modal,
  Box
} from '@mui/material';

const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

const AdminArticlesPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedService, setSelectedService] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null);

  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [modalMode, setModalMode] = useState<'overview' | 'edit' | null>(null);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const MAX_PER_TYPE = 5;
  const MAX_PER_PAGE = 10;

  const fetchArticles = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/articles?limit=50`);
    const data: Article[] = await res.json();
    setArticles(data);
    setSelectedArticle(data.find(a => a.id === selectedArticle?.id) ?? null);
  };

  const fetchCategories = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories`);
    const data: Category[] = await res.json();
    setCategories(data);
  };

  const handleRequestDelete = (id: string) => {
    setArticleToDelete(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!articleToDelete) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/articles/${articleToDelete}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        },
        cache: 'no-store'
      });
      if (!res.ok) throw new Error('Error al eliminar el artículo');
      await fetchArticles();
    } catch (error) {
      console.error('Error eliminando artículo:', error);
      alert('Hubo un error al eliminar el artículo');
    } finally {
      setConfirmOpen(false);
      setArticleToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setArticleToDelete(null);
  };

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, []);

  const allServiceNames = useMemo(() => {
    return [...new Set(articles.filter(a => a.type.name === 'service').map(a => a.name))];
  }, [articles]);

  const allProductNames = useMemo(() => {
    return [...new Set(articles.filter(a => a.type.name === 'product').map(a => a.name))];
  }, [articles]);

  useEffect(() => {
    if (selectedProduct) setSelectedService('');
  }, [selectedProduct]);

  useEffect(() => {
    if (selectedService) setSelectedProduct('');
  }, [selectedService]);

  // Filtrar artículos según búsqueda y filtros
  const filteredProducts = useMemo(() => {
    return articles.filter(article =>
      article.type.name === 'product' &&
      article.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedProduct === '' || article.name === selectedProduct) &&
      (selectedType === '' || article.type.name === selectedType)
    );
  }, [articles, searchTerm, selectedProduct, selectedType]);

  const filteredServices = useMemo(() => {
    return articles.filter(article =>
      article.type.name === 'service' &&
      article.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedService === '' || article.name === selectedService) &&
      (selectedType === '' || article.type.name === selectedType)
    );
  }, [articles, searchTerm, selectedService, selectedType]);

  // Calcular páginas y datos mostrados
  const totalPages = Math.max(
    1,
    Math.max(
      Math.ceil(filteredProducts.length / MAX_PER_TYPE),
      Math.ceil(filteredServices.length / MAX_PER_TYPE)
    )
  );

  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * MAX_PER_TYPE,
    (currentPage - 1) * MAX_PER_TYPE + MAX_PER_TYPE
  );

  const displayedServices = filteredServices.slice(
    (currentPage - 1) * MAX_PER_TYPE,
    (currentPage - 1) * MAX_PER_TYPE + MAX_PER_TYPE
  );

  return (
    <>
      <Box sx={{ px: { xs: 2, md: 4 }, py: 4, width: '100%' }}>
        
        <SectionHeader 
          icon={<Inventory2 fontSize="large" />} 
          title="Artículos" 
        />

        <div className="flex flex-col items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 w-full">

            <TextField
              label="Buscar por nombre..."
              variant="outlined"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              fullWidth
            />

            <div className="flex gap-2">
              <PrimaryButton 
                label="Crear Artículo" 
                icon={<AddIcon />} 
                onClick={() => setIsCreateModalOpen(true)} 
              />
              <PrimaryButton 
                label="Categorías" 
                icon={<EditIcon />} 
                onClick={() => setIsCategoriesModalOpen(true)} 
              />
            </div>

          </div>

          <div className="flex gap-6 mt-2 w-full">
            <RadioGroup row value={selectedType} onChange={(e) => { setSelectedType(e.target.value); setCurrentPage(1); }}>
              <FormControlLabel value="" control={<Radio />} label="Todos" />
              <FormControlLabel value="product" control={<Radio />} label="Productos" />
              <FormControlLabel value="service" control={<Radio />} label="Servicios" />
            </RadioGroup>
          </div>

          <div className="flex items-center gap-4 w-full mt-2">

            {(selectedType === '' || selectedType === 'product') && (
              <FormControl fullWidth size="small">
                <InputLabel>Filtrar por producto</InputLabel>
                <Select value={selectedProduct} onChange={(e) => { setSelectedProduct(e.target.value); setCurrentPage(1); }}>
                  <MenuItem value="">Todos</MenuItem>
                  {allProductNames.map(name => <MenuItem key={name} value={name}>{name}</MenuItem>)}
                </Select>
              </FormControl>
            )}

            {(selectedType === '' || selectedType === 'service') && (
              <FormControl fullWidth size="small">
                <InputLabel>Filtrar por servicio</InputLabel>
                <Select value={selectedService} onChange={(e) => { setSelectedService(e.target.value); setCurrentPage(1); }}>
                  <MenuItem value="">Todos</MenuItem>
                  {allServiceNames.map(name => <MenuItem key={name} value={name}>{name}</MenuItem>)}
                </Select>
              </FormControl>
            )}
            
          </div>

          <div className="flex flex-col lg:flex-row w-full gap-6 mt-8">
            {(selectedType === '' || selectedType === 'product') && (
              <div className={`flex flex-col ${selectedType === '' ? 'w-full lg:w-1/2' : 'w-full'}`}>
                <h2 className="text-xl font-bold">Productos</h2>
                <div className="mt-6 space-y-4">
                  {displayedProducts.map(article => (
                    <ArticleItem
                      key={article.id}
                      article={article}
                      onView={() => { setSelectedArticle(article); setModalMode('overview'); }}
                      onEdit={() => { setSelectedArticle(article); setModalMode('edit'); }}
                      onDelete={() => { handleRequestDelete(article.id) }}
                    />
                  ))}
                  {displayedProducts.length === 0 && <p>No se encontraron productos.</p>}
                </div>
              </div>
            )}

            {(selectedType === '' || selectedType === 'service') && (
              <div className={`flex flex-col ${selectedType === '' ? 'w-full lg:w-1/2' : 'w-full'}`}>
                <h2 className="text-xl font-bold">Servicios</h2>
                <div className="mt-6 space-y-4">
                  {displayedServices.map(article => (
                    <ArticleItem
                      key={article.id}
                      article={article}
                      onView={() => { setSelectedArticle(article); setModalMode('overview'); }}
                      onEdit={() => { setSelectedArticle(article); setModalMode('edit'); }}
                      onDelete={() => { handleRequestDelete(article.id) }}
                    />
                  ))}
                  {displayedServices.length === 0 && <p className="text-gray-400">No se encontraron servicios.</p>}
                </div>
              </div>
            )}
          </div>

          {/* Controles de paginación */}
          <div className="flex justify-center items-center gap-4 mt-6">
            
            <Button 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(p => p - 1)}
            >Anterior</Button>

            <span>Página {currentPage} de {totalPages}</span>
            
            <Button 
              disabled={currentPage === totalPages} 
              onClick={() => setCurrentPage(p => p + 1)}
            >Siguiente</Button>

          </div>
        </div>
      </Box>

      {/* Modales */}
      <Modal 
        open={!!selectedArticle} 
        onClose={() => { setSelectedArticle(null); setModalMode(null); }}
      >
        <Box sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          width: { xs: 'auto' }, 
          maxHeight: '90vh', 
          overflowY: 'auto', 
          bgcolor: 'background.paper', 
          boxShadow: 24, 
          borderRadius: 4 
        }}>
          {selectedArticle && modalMode === 'overview' && (
            <ArticleOverview article={selectedArticle} fetchArticle={fetchArticles} />
          )}
          {selectedArticle && modalMode === 'edit' && (
            <ArticleEdit article={selectedArticle} fetchArticle={fetchArticles} />
          )}
        </Box>
      </Modal>

      <CreateArticleModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        fetchArticles={fetchArticles} 
        categories={categories} 
      />
      <CategoriesModal 
        isOpen={isCategoriesModalOpen} 
        onClose={() => setIsCategoriesModalOpen(false)} 
        categories={categories} 
      />
      <ConfirmDialog 
        open={confirmOpen} 
        title="Eliminar artículo" 
        message="¿Estás seguro de que deseas eliminar este artículo? Esta acción no se puede deshacer." 
        action='Eliminar' 
        onConfirm={handleConfirmDelete} 
        onCancel={handleCancelDelete} 
      />

    </>
  );
};

export default AdminArticlesPage;
