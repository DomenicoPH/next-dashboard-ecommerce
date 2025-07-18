'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  useTheme
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Article } from '@/interfaces/Article';
import ArticleDetailView from './ArticleDetailView';
import Image from 'next/image';
import NoPhotographyIcon from '@mui/icons-material/NoPhotography';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface ArticleOverviewProps {
  article: Article;
  fetchArticle: () => Promise<void>;
}

const ArticleOverview: React.FC<ArticleOverviewProps> = ({ article, fetchArticle }) => {
  const [isEditing, setIsEditing] = useState(false);
  const theme = useTheme();

  if (isEditing) {
    return (
      <ArticleDetailView
        article={article}
        fetchArticle={async () => {
          await fetchArticle();
          setIsEditing(false);
        }}
      />
    );
  }

  const {
    name,
    description,
    price,
    discountPrice,
    category,
    type,
    stock,
    isActive,
    onDiscount,
    images,
  } = article;

  return (
    
    <Paper 
      elevation={0}
      sx={{
        p: 5,
        width: '100%',
        maxWidth: '100%',
        mx: 'auto',
        [theme.breakpoints.up('md')]: {
          minWidth: '700px',
        },
      }}
    >

      <Typography
        variant='h6'
        sx={{ pb: 4, opacity: 0.3, fontStyle: 'italic' }}
      >
        <VisibilityIcon /> {`Información de ${type.name === 'product' ? 'Producto' : 'Servicio'}`}
      </Typography>
      
      <Grid container spacing={{ xs: 2, md: 4 }}>

        {/* Imagen */}
        <Grid  
          size={{ xs: 12, md: 4 }}
          sx={{
            maxWidth: 500,
            marginX: 'auto'
          }}
          >
          <Box
            sx={{
              width: '100%',
              aspectRatio: '1 / 1',
              borderRadius: 2,
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            {
              article.images.length ? (
                <Image
                  src={article.mainImage?.imgUrl || images[0].imgUrl}
                  alt={name}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                />
              ) : (
                <Box
                  sx={{
                    position: 'relative',
                    width: '16rem',
                    height: '16rem',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgb(97, 97, 97)',
                    borderRadius: '8px',
                  }}
                >
                  <NoPhotographyIcon sx={{ fontSize: '6rem', color: 'rgb(237, 237, 237)' }} />
                </Box>
              )
            }
          </Box>
        </Grid>

        {/* Información */}
        <Grid  
          size={{ xs: 12, md: 8 }}
          sx={{
            maxWidth: 500,
            marginX: 'auto'
          }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {category.name} • {type.name === 'product' ? 'Producto' : 'Servicio'}
          </Typography>
          <Typography variant="body1" paragraph>
            {description}
          </Typography> {/* Text wraps by default */}

          <Typography variant="h6">
            Precio:{' '}
            {onDiscount ? (
              <>
                <del style={{ color: 'gray', marginRight: 8 }}>S/ {price.toFixed(2)}</del>
                <span style={{ color: '#2e7d32' }}>S/ {discountPrice.toFixed(2)}</span>
              </>
            ) : (
              <>S/ {price.toFixed(2)}</>
            )}
          </Typography>

          {type.name === 'product' && (
            <Typography variant="body2" mt={1}>
              Stock: {stock ?? 0} unidades
            </Typography>
          )}

          <Typography variant="body2" mt={1}>
            Estado: {isActive ? 'Activo' : 'Inactivo'} {onDiscount && '• Con Descuento'}
          </Typography>

          <Box mt={4}>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => setIsEditing(true)}
            >
              Editar
            </Button>
          </Box>
        </Grid>
        
      </Grid>
    </Paper>
  );
};

export default ArticleOverview;
