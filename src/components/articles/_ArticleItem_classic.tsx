import React from 'react';
import { Article } from '@/interfaces/Article';
import { Box } from '@mui/material';
import NoPhotographyIcon from '@mui/icons-material/NoPhotography';

interface ArticleItemProps {
  article: Article;
  onView?: () => void;
  onEdit?: () => void;
}

const ArticleItem: React.FC<ArticleItemProps> = ({ article, onView, onEdit }) => {
  const mainImageObj = article.images.find(img => img.name === article.mainImage);
  const displayImageUrl = mainImageObj?.imgUrl || article.images[0]?.imgUrl || null;

  return (
    <div className="flex items-center bg-white rounded-lg shadow-md p-4 mb-4">
      {/* Image Section */}
      <div className="flex-shrink-0 mr-4">
        {displayImageUrl ? (
          <img
            src={displayImageUrl}
            alt={article.name}
            className="h-20 w-20 object-cover rounded-lg"
          />
        ) : (
          <Box
            sx={{
              position: 'relative',
              width: '5rem',
              height: '5rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgb(97, 97, 97)',
              borderRadius: '8px',
            }}
          >
            <NoPhotographyIcon sx={{ fontSize: '3rem', color: 'rgb(237, 237, 237)' }} />
          </Box>
        )}
      </div>

      {/* Nombre, Categoría, Stock */}
      <div className="flex-grow">
        <h3 className="text-lg font-semibold text-gray-800">{article.name}</h3>
        <p className="text-sm text-gray-600">{article.category.name}</p>
        <p className="text-sm text-gray-600">
          Stock: {article.stock !== undefined ? `${article.stock} unidades` : 'N/A'}
        </p>
      </div>

      {/* Precio */}
      <div className="flex-shrink-0 mr-4 flex flex-col items-end">
        <p className="text-sm text-gray-600">Precio Actual</p>
        <div className="text-lg font-bold text-gray-900">
          S/{article.discountPrice.toFixed(2)}
        </div>
      </div>

      {/* Acciones */}
      <div className="flex flex-col items-center space-y-2">
        {/* Ver artículo */}
        <button
          className="text-gray-500 hover:text-blue-600"
          aria-label="View Article"
          onClick={onView}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
            <path fillRule="evenodd" d="M.661 10c1.765-3.877 6.36-7.5 9.339-7.5 2.98 0 7.574 3.623 9.339 7.5-1.765 3.877-6.36 7.5-9.339 7.5-2.98 0-7.574-3.623-9.339-7.5zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Editar artículo */}
        <button
          className="text-gray-500 hover:text-green-600"
          aria-label="Edit Article"
          onClick={onEdit}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
            <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Eliminar artículo */}
        <button className="text-gray-500 hover:text-red-600" aria-label="Delete Article">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ArticleItem;
