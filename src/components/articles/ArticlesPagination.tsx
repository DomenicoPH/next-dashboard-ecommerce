import React from 'react';
import { Button } from '@mui/material';

interface ArticlesPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

const ArticlesPagination: React.FC<ArticlesPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="flex justify-center items-center gap-4 mt-6">
      <Button 
        disabled={currentPage === 1} 
        onClick={() => onPageChange(currentPage - 1)}
      >
        Anterior
      </Button>

      <span>Página {currentPage} de {totalPages}</span>

      <Button 
        disabled={currentPage === totalPages} 
        onClick={() => onPageChange(currentPage + 1)}
      >
        Siguiente
      </Button>
    </div>
  );
};

export default ArticlesPagination;
