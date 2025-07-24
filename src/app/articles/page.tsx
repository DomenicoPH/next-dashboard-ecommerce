'use client';

import React, { useEffect, useMemo, useState } from 'react';
import ArticleItem from '@/components/articles/ArticleItem';
import CreateArticleModal from '@/components/articles/CreateArticleModal';
import ArticleOverview from '@/components/articles/ArticleOverview';
import ArticleDetailView from '@/components/articles/ArticleEdit';
import { Article } from '../../interfaces/Article';
import { Category } from '../../interfaces/Category';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import SectionHeader from '@/components/ui/SectionHeader';
import { Inventory2 } from '@mui/icons-material';
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

const API = "https://nestjs-eccommercex-819245f6bb7d.herokuapp.com/api/v1";

const AdminArticlesPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [products, setProducts] = useState<Article[]>([]);
  const [services, setServices] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedService, setSelectedService] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null);

  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [modalMode, setModalMode] = useState<'overview' | 'edit' | null>(null);

  const fetchArticles = async () => {
    //const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/articles`);
    const res = await fetch(`${API}/articles`);
    const data: Article[] = await res.json();
    setArticles(data);
    setSelectedArticle(data.find(a => a.id === selectedArticle?.id) ?? null);
  };

  const fetchCategories = async () => {
    //const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories`);
    const res = await fetch(`${API}/categories`);
    const data: Category[] = await res.json();
    setCategories(data);
  };

  const handleRequestDelete = (id: string) => {
    setArticleToDelete(id);
    setConfirmOpen(true);
  };


  // Eliminar artículo
  const handleConfirmDelete = async () => {
    if (!articleToDelete) return;

    try {
      const res = await fetch(`${API}/articles/${articleToDelete}`, {
        method: 'DELETE',
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

  useEffect(() => {
    const filtered = articles.filter(article => {
      const matchesSearch = article.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesService = selectedService === '' || (article.type.name === 'service' && article.name === selectedService);
      const matchesProduct = selectedProduct === '' || (article.type.name === 'product' && article.name === selectedProduct);
      const matchesType = selectedType === '' || article.type.name === selectedType;
      return matchesSearch && matchesService && matchesProduct && matchesType;
    });

    setProducts(filtered.filter(a => a.type.name === 'product'));
    setServices(filtered.filter(a => a.type.name === 'service'));
  }, [articles, searchTerm, selectedService, selectedProduct, selectedType]);

  return (
    <>
      <Box sx={{ px: { xs: 2, md: 4 }, py: 4, width: '100%' }}>

        <SectionHeader
          icon={<Inventory2 fontSize="large" />}
          title="Artículos"
        />

        <div className="flex flex-col items-center justify-between gap-4 mb-6">
          {/* Filtro de texto y botón */}
          <div className="flex items-center gap-2 w-full">
            <TextField
              label="Buscar por nombre..."
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
            />

            <Button
              onClick={() => setIsModalOpen(true)}
              variant="contained"
              color="primary"
              sx={{ minWidth: '200px', padding: 1.8 }}
            >
              Crear Artículo
            </Button>
          </div>

          {/* Radio buttons */}
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

          {/* Dropdowns */}
          <div className="flex items-center gap-4 w-full mt-2">
            {(selectedType === '' || selectedType === 'product') && (
              <FormControl fullWidth size="small">
                <InputLabel>Filtrar por producto</InputLabel>
                <Select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  label="Filtrar por producto"
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
                  label="Filtrar por servicio"
                >
                  <MenuItem value="">Todos</MenuItem>
                  {allServiceNames.map(name => (
                    <MenuItem key={name} value={name}>{name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </div>

          {/* Artículos con layout responsive */}
          <div className="flex flex-col lg:flex-row w-full gap-6 mt-8">
            {(selectedType === '' || selectedType === 'product') && (
              <div className={`flex flex-col ${selectedType === '' ? 'w-full lg:w-1/2' : 'w-full'}`}>
                <h2 className="text-xl font-bold">Productos</h2>
                <div className="mt-6 space-y-4">
                  {products.map(article => (
                    <ArticleItem
                      key={article.id}
                      article={article}
                      onView={() => {
                        setSelectedArticle(article);
                        setModalMode('overview');
                      }}
                      onEdit={() => {
                        setSelectedArticle(article);
                        setModalMode('edit');
                      }}
                      onDelete={() => {
                        handleRequestDelete(article.id)
                      }}
                    />
                  ))}
                  {products.length === 0 && (
                    <p>No se encontraron productos.</p>
                  )}
                </div>
              </div>
            )}

            {(selectedType === '' || selectedType === 'service') && (
              <div className={`flex flex-col ${selectedType === '' ? 'w-full lg:w-1/2' : 'w-full'}`}>
                <h2 className="text-xl font-bold">Servicios</h2>
                <div className="mt-6 space-y-4">
                  {services.map(article => (
                    <ArticleItem
                      key={article.id}
                      article={article}
                      onView={() => {
                        setSelectedArticle(article);
                        setModalMode('overview');
                      }}
                      onEdit={() => {
                        setSelectedArticle(article);
                        setModalMode('edit');
                      }}
                      onDelete={() => {
                        handleRequestDelete(article.id)
                      }}
                    />
                  ))}
                  {services.length === 0 && (
                    <p className="text-gray-400">No se encontraron servicios.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Box>

      {/* Modal para vista previa o edición */}
      <Modal
        open={!!selectedArticle}
        onClose={() => {
          setSelectedArticle(null);
          setModalMode(null);
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: 'auto' },
            maxHeight: '90vh',
            overflowY: 'auto',
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 4,
          }}
        >
          {selectedArticle && modalMode === 'overview' && (
            <ArticleOverview article={selectedArticle} fetchArticle={fetchArticles} />
          )}
          {selectedArticle && modalMode === 'edit' && (
            <ArticleDetailView article={selectedArticle} fetchArticle={fetchArticles} />
          )}
        </Box>
      </Modal>

      <CreateArticleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fetchArticles={fetchArticles}
        categories={categories}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Eliminar artículo"
        message="¿Estás seguro de que deseas eliminar este artículo? Esta acción no se puede deshacer."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />


    </>
  );
};

export default AdminArticlesPage;
