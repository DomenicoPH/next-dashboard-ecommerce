'use client';

import React, { useEffect, useMemo, useState } from 'react';
import ArticleItem from '@/components/articles/ArticleItem';
import CreateArticleModal from '@/components/articles/CreateArticleModal';
import ArticleOverview from '@/components/articles/ArticleOverview';
import ArticleDetailView from '@/components/articles/ArticleDetailView';
import { Article } from '../../interfaces/Article';
import { Category } from '../../interfaces/Category';

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

  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [modalMode, setModalMode] = useState<'overview' | 'edit' | null>(null);

  const fetchArticles = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/articles`);
    const data: Article[] = await res.json();
    setArticles(data);
    setSelectedArticle(
      data.find(a => a.id === selectedArticle?.id) ?? null
    );
  };
  
  const fetchCategories = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories`);
    const data: Category[] = await res.json();
    setCategories(data);
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
      console.log(articles)
      return matchesSearch && matchesService && matchesProduct && matchesType;
    });

    setProducts(filtered.filter(a => a.type.name === 'product'));
    setServices(filtered.filter(a => a.type.name === 'service'));
  }, [articles, searchTerm, selectedService, selectedProduct, selectedType]);

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-white">Artículos</h1>

        <div className="flex flex-col items-center justify-between gap-4 mb-6">

          {/* Filtro de texto y botón */}
          <div className="flex items-center gap-2 w-full">
            <TextField
              label="Buscar por nombre..."
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              sx={{
                input: { color: 'white' },
                label: { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'white',
                  },
                  '&:hover fieldset': {
                    borderColor: '#60a5fa',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#3b82f6',
                  },
                }
              }}
            />

            <Button
              onClick={() => setIsModalOpen(true)}
              variant="contained"
              color="primary"
              sx={{ minWidth: '150px', paddingY: 1.5 }}
            >
              Crear Artículo
            </Button>
          </div>

          {/* Radio buttons */}
          <div className="flex gap-6 mt-2 w-full text-white">
            <RadioGroup
              row
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <FormControlLabel value="" control={<Radio sx={{ color: 'white' }} />} label="Todos" sx={{ color: 'white' }} />
              <FormControlLabel value="product" control={<Radio sx={{ color: 'white' }} />} label="Productos" sx={{ color: 'white' }} />
              <FormControlLabel value="service" control={<Radio sx={{ color: 'white' }} />} label="Servicios" sx={{ color: 'white' }} />
            </RadioGroup>
          </div>

          {/* Dropdowns */}
          <div className="flex items-center gap-4 w-full mt-2">
            {(selectedType === '' || selectedType === 'product') && (
              <FormControl fullWidth size="small">
                <InputLabel sx={{ color: 'white' }}>Filtrar por producto</InputLabel>
                <Select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  label="Filtrar por producto"
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'white',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#60a5fa',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#3b82f6',
                    }
                  }}
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
                <InputLabel sx={{ color: 'white' }}>Filtrar por servicio</InputLabel>
                <Select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  label="Filtrar por servicio"
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'white',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#60a5fa',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#3b82f6',
                    }
                  }}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {allServiceNames.map(name => (
                    <MenuItem key={name} value={name}>{name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </div>

          {/* Artículos con layout dinámico */}
          <div className="flex w-full gap-4">
            {(selectedType === '' || selectedType === 'product') && (
              <div className={`flex flex-col ${selectedType === '' ? 'w-1/2' : 'w-full'}`}>
                <h2 className="text-xl font-bold mt-8 text-white">Productos</h2>
                <div className="mt-8 space-y-4">
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
                        console.log('eliminando artículo', article.id);
                      }}
                    />
                  ))}
                  {products.length === 0 && (
                    <p className="text-gray-400">No se encontraron productos.</p>
                  )}
                </div>
              </div>
            )}

            {(selectedType === '' || selectedType === 'service') && (
              <div className={`flex flex-col ${selectedType === '' ? 'w-1/2' : 'w-full'}`}>
                <h2 className="text-xl font-bold mt-8 text-white">Servicios</h2>
                <div className="mt-8 space-y-4">
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
                        console.log('eliminando artículo', article.id);
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
      </div>

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
            //minWidth: '90%',
            maxHeight: '90vh',
            overflowY: 'auto',
            bgcolor: 'background.paper',
            //bgcolor: '#00b0ff',
            boxShadow: 24,
            //p: 2,
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
    </>
  );
};

export default AdminArticlesPage;
