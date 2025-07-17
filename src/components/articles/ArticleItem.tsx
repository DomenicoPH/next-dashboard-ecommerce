'use client';

import React from 'react';
import { Article } from '@/interfaces/Article';
import {
  Card,
  Box,
  Stack,
  Typography,
  Tooltip,
  IconButton,
  Fab,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import NoPhotographyIcon from '@mui/icons-material/NoPhotography';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Image from 'next/image';

// Estilos para hover en el botón flotante
const HoverCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  '&:hover .hoverFab': {
    opacity: 1,
    transform: 'scale(1)',
  },
}));

interface ArticleItemProps {
  article: Article;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onAddToCart?: () => void;
}

const ArticleItem: React.FC<ArticleItemProps> = ({
  article,
  onView,
  onEdit,
  onDelete,
  onAddToCart,
}) => {
  const mainImageObj = article.images.find((img) => img.name === article.mainImage);
  const displayImageUrl = mainImageObj?.imgUrl || article.images[0]?.imgUrl || null;

  return (
    <HoverCard sx={{ borderRadius: 2, boxShadow: 3, pt: 2, px: 2, pb: 2 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'stretch',
          minHeight: { xs: 160, sm: 120 }, // Aumenta el alto mínimo en móvil
          height: 'auto',
        }}
      >
        {/* Bloque izquierdo: imagen + info */}
        <Box sx={{ display: 'flex', height: '100%', flex: 1 }}>
          {/* Imagen */}
          <Box
            sx={{
              minWidth: { xs: 60, sm: 120 },
              maxWidth: { xs: 60, sm: 120 },
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              height: { xs: 60, sm: '100%' },
              backgroundColor: '#334155',
              borderRadius: 2,
              mr: 2,
            }}
          >
            {displayImageUrl ? (
              <Image
                src={displayImageUrl}
                alt={article.name}
                width={200}
                height={200}
                priority
                style={{
                  objectFit: 'cover',
                  borderRadius: '8px',
                  width: '100%',
                  height: '100%',
                  aspectRatio: '1 / 1',
                  display: 'block',
                }}
              />
            ) : (
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 2,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  bgcolor: '#334155',
                  aspectRatio: '1 / 1',
                }}
              >
                <NoPhotographyIcon sx={{ fontSize: { xs: 32, sm: 48 }, color: 'grey.200' }} />
              </Box>
            )}
            {/* Botón flotante para agregar al carrito */}
            {onAddToCart && (
              <Fab
                color="warning"
                size="small"
                className="hoverFab"
                sx={{
                  position: 'absolute',
                  bottom: 8,
                  right: 8,
                  opacity: 0,
                  transform: 'scale(0)',
                  transition: 'all 0.3s ease',
                }}
                onClick={onAddToCart}
              >
                <ShoppingCartIcon />
              </Fab>
            )}
          </Box>
          {/* Info: nombre, categoría, stock y precio (en móvil) */}
          <Stack
            spacing={1}
            sx={{
              justifyContent: 'center',
              minHeight: { xs: 90, sm: '100%' }, // Aumenta el alto mínimo para el texto en móvil
              py: 1,
              flex: 1,
            }}
          >
            <Typography
              variant="subtitle1"
              noWrap={false}
              sx={{
                fontWeight: 600,
                fontSize: { xs: '1rem', sm: '1.1rem' },
                lineHeight: 1.2,
                wordBreak: 'break-word',
              }}
            >
              {article.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {article.category.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Stock: {article.stock !== undefined ? `${article.stock} unidades` : 'N/A'}
            </Typography>
            {/* Precio debajo del stock solo en móvil */}
            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
              <Typography variant="h6" color="text.primary">
                S/ {article.discountPrice.toFixed(2)}
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Bloque derecho */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            minWidth: { xs: 'auto', sm: 120 }, // Limita el ancho solo en desktop
            height: '100%',
            width: { xs: 'auto', sm: 120 }, // En móvil, el ancho se ajusta al contenido
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' }, // vertical en móvil, horizontal en desktop
              width: 'auto',
              alignSelf: 'flex-end',
              gap: 0,
              px: 2,
            }}
          >
            {onView && (
              <Tooltip title="Ver">
                <IconButton onClick={onView} sx={{ '&:hover': {color: 'primary.main'} }}>
                  <VisibilityIcon />
                </IconButton>
              </Tooltip>
            )}
            {onEdit && (
              <Tooltip title="Editar">
                <IconButton onClick={onEdit} sx={{ '&:hover': {color: 'primary.main'} }}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
            )}
            {onDelete && (
              <Tooltip title="Eliminar">
                <IconButton onClick={onDelete} sx={{ '&:hover': {color: 'error.main'} }}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
          {/* Precio solo en desktop */}
          <Box sx={{ display: { xs: 'none', sm: 'block' }, width: '100%', pt: 4 }}>
            <Typography variant="h5" color="text.primary" fontWeight={600}>
              S/ {article.discountPrice.toFixed(2)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </HoverCard>
  );
};

export default ArticleItem;
