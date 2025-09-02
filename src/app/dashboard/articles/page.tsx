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
import PaginationComponent from '@/components/ui/Pagination';
import ArticlesFilters from '@/components/articles/ArticlesFilters';
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
  const [selectedCategory, setSelectedCategory] = useState<string>('');
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
    return [...new Set(articles.filter(a => a.category?.type?.name === 'service').map(a => a.name))];
  }, [articles]);

  const allProductNames = useMemo(() => {
    return [...new Set(articles.filter(a => a.category?.type?.name === 'product').map(a => a.name))];
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
      article.category?.type?.name === 'product' &&
      article.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedProduct === '' || article.name === selectedProduct) &&
      (selectedType === '' || article.category?.type?.name === selectedType) &&
      (selectedCategory === '' || article.category?.id === selectedCategory)
    );
  }, [articles, searchTerm, selectedProduct, selectedType]);

  const filteredServices = useMemo(() => {
    return articles.filter(article =>
      article.category?.type?.name === 'service' &&
      article.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedService === '' || article.name === selectedService) &&
      (selectedType === '' || article.category?.type?.name === selectedType) &&
      (selectedCategory === '' || article.category?.id === selectedCategory)
    );
  }, [articles, searchTerm, selectedService, selectedType, selectedCategory]);

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
          
          {/* Filtros */}
          <ArticlesFilters
            searchTerm={searchTerm}
            setSearchTerm={(val) => { setSearchTerm(val); setCurrentPage(1); }}
            selectedType={selectedType}
            setSelectedType={(val) => { setSelectedType(val); setCurrentPage(1); }}
            selectedProduct={selectedProduct}
            setSelectedProduct={(val) => { setSelectedProduct(val); setCurrentPage(1); }}
            selectedService={selectedService}
            setSelectedService={(val) => { setSelectedService(val); setCurrentPage(1); }}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            allProductNames={allProductNames}
            allServiceNames={allServiceNames}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
            onOpenCategoriesModal={() => setIsCategoriesModalOpen(true)}
            categories={categories}
          />

          {/* Bloque productos */}
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

            {/* Bloque servicios */}
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

          {/* paginación */}
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
          
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
        refreshCategories={fetchCategories}
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
