'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Typography,
  Box,
  Grid,
  IconButton,
} from '@mui/material';
import {
  visuallyHidden,
} from '@mui/utils';
import { styled } from '@mui/material/styles';
import { Article } from '@/interfaces/Article';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/thumbs';
import 'swiper/css/navigation';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import NoPhotographyIcon from '@mui/icons-material/NoPhotography';
import { ArticleImageAction, UpdateArticleImage } from '@/interfaces/UpdateArticleImage';

const VisuallyHiddenInput = styled('input')(visuallyHidden);

interface ArticleDetailViewProps {
  article: Article;
  fetchArticle: () => Promise<void>;
}

interface ImageProps {
  name: string;
  url: string;
  isNew: boolean;
}

const ArticleDetailView: React.FC<ArticleDetailViewProps> = ({ article, fetchArticle }) => {
  const [formChanges, setFormChanges] = useState({});
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isDiscountActive, setIsDiscountActive] = useState(false);
  const [imageChanges, setImageChanges] = useState<UpdateArticleImage[]>([])

  const [isLoading, setIsLoading] = useState(false);
  const [isHovering, setIsHovering] = useState<number | null>(null);

  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [images, setImages] = useState<ImageProps[]>([]);
  const [mainImageName, setMainImageName] = useState<string>('');

  const loadArticleData = () => {
    setName(article.name);
    setPrice(article.price.toFixed(2));
    setDiscountPrice(article.discountPrice.toFixed(2));
    setDescription(article.description);
    setStock(article.stock || 0);
    setIsActive(article.isActive);
    setIsDiscountActive(article.onDiscount);
    setMainImageName(article.images[0]?.name || '');

    setFormChanges({});
    setImageChanges([]);
    setImages(
      article.images.map(
        (img) => ({
          name: img.name,
          url: img.imgUrl,
          isNew: false,
        })
      )
    )
  };

  const handleInputChange = (fieldName: string, value: any) => {
    setFormChanges((prev) => ({ ...prev, [fieldName]: value }));
  };

  useEffect(() => {
    loadArticleData();

    return () => {
      handleDiscardChanges();
    };
  }, [article]);

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/articles/${article.type.name}s/${article.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formChanges,
          mainImage: mainImageName, // 👈 nuevo campo
          images: imageChanges.map((img) => ({
            name: img.name,
            action: img.action,
          })),
        }),
      });
      if (!res.ok) throw new Error('Failed to save changes');
      await fetchArticle();
    } finally {
      setIsLoading(false);
    }
  };  

  const handleDiscardChanges = async () => {
    for await (const image of imageChanges) {
      if (image.action === ArticleImageAction.ADD) {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/files/temp/${image.name}`, 
          { method: 'DELETE' },
        );
      }
    }

    loadArticleData();
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files)
      return;

    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', event.target.files[0]);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/files/upload`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to upload image');
      
      const data = await res.json();
      console.log(data)

      setImageChanges(
        imageChanges.concat({
          name: data.filename,
          url: data.tempUrl,
          action: ArticleImageAction.ADD,
        })
      );

      setImages(
        images.concat({
          name: data.filename,
          url: data.tempUrl,
          isNew: true,
        })
      );
    } catch (error) {
      // console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageDelete = async (img: ImageProps) => {
    if (img.isNew) {
      setIsLoading(true);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/files/temp/${img.name}`, 
          { method: 'DELETE' },
        );

        if (!res.ok) throw new Error('Failed to delete image');

        setImageChanges(imageChanges.filter(
          (imgChange) => imgChange.name !== img.name
        ));
        
        setImages(images.filter(
          (image) => image.name !== img.name
        ));
      } finally {
        setIsLoading(false);
      }
    } else {
      setImageChanges(imageChanges.concat(
        {
          name: img.name,
          url: img.url,
          action: ArticleImageAction.REMOVE,
        }
      ));
        
      setImages(images.filter(
        (image) => image.name !== img.name
      ));
    }
  }

  return (
    <div>
      <Typography variant="h5" fontWeight="normal" gutterBottom sx={{ mb: 3, paddingX: '20px', paddingTop: '20px', color: 'primary.main' }}>
        Editar artículo
      </Typography>

    <Box className="bg-white p-5 pt-10 rounded-lg shadow-md w-full flex justify-center items-center">
      
      <Grid container spacing={4}>

        {/* IZQUIERDA: Galería Swiper */}
        <Grid
          item 
          xs={12} 
          md={4}
          sx={{
            maxWidth: 350,
            marginX: 'auto',
            paddingX: '15px',
          }}
        >
          <Box sx={{ width: '300px' }}>
            <Box sx={{ width: '100%', aspectRatio: '1 / 1', mb: 2 }}>
              <Swiper
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '8px',
                }}
                loop
                navigation
                thumbs={{ swiper: thumbsSwiper }}
                modules={[Thumbs, Navigation]}
              >
                {
                  images.length ? (
                    images.map((img, i) => (
                      <SwiperSlide key={i}>
                        <Box
                          sx={{
                            position: 'relative',
                            width: '100%',
                            height: '100%',
                          }}
                        >
                          <Image
                            src={img.url}
                            alt={`Image ${i + 1}`}
                            fill
                            style={{ objectFit: 'cover', borderRadius: '8px' }}
                          />
                        </Box>
                      </SwiperSlide>
                    ))
                  ) : (
                    <SwiperSlide>
                      <Box
                        sx={{
                          position: 'relative',
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: 'rgb(97, 97, 97)',
                          borderRadius: '8px',
                        }}
                      >
                        <NoPhotographyIcon sx={{ fontSize: '6rem', color: 'rgb(237, 237, 237)' }} />
                      </Box>
                    </SwiperSlide>
                  )
                }
              </Swiper>
            </Box>
              
            {
              images.length > 0 && (
                <Swiper
                  onSwiper={setThumbsSwiper}
                  slidesPerView={4}
                  spaceBetween={8}
                  watchSlidesProgress
                  modules={[Thumbs]}
                  style={{ paddingTop: '0.5rem' }}
                >
                  {images.map((img, i) => (
                    <SwiperSlide key={`thumb-${i}`} style={{ height: 64, cursor: 'pointer', position: 'relative' }}>
                      <Box
                        onMouseEnter={() => setIsHovering(i)}
                        onMouseLeave={() => setIsHovering(null)}
                        sx={{ position: 'relative', width: '100%', height: 64, border: '1px solid rgb(0 0 0 / .2)', borderRadius: '5px' }}
                      >
                        <Image
                          src={img.url}
                          alt={`Thumb ${i + 1}`}
                          fill
                          style={{ objectFit: 'cover', borderRadius: '4px' }}
                        />

                        {/* Botón para marcar como principal */}
                        <IconButton
                          onClick={() => setMainImageName(img.name)}
                          aria-label="set-main"
                          sx={{
                            width: 18,
                            height: 18,
                            position: 'absolute',
                            top: 4,
                            left: 4,
                            backgroundColor: mainImageName === img.name ? 'primary.main' : 'rgba(0,0,0,0.4)',
                            color: 'white',
                            fontSize: '1rem',
                            padding: '1px',
                            borderRadius: '4px',
                            '&:hover': {
                              backgroundColor: 'primary.dark',
                            }
                          }}
                        >
                          {mainImageName === img.name ? '★' : '☆'}
                        </IconButton>
                        
                        {/* Botón para eliminar imagen */}
                        {isHovering === i && (
                          <IconButton
                            onClick={() => handleImageDelete(img)}
                            aria-label="delete"
                            sx={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              backgroundColor: 'rgba(255, 0, 0, 0.4)',
                              '&:hover': {
                                backgroundColor: 'error.main',
                                color: 'white'
                              },
                              borderRadius: '4px',
                              padding: '1px',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <DeleteIcon sx={{ color: 'white', fontSize: '1rem' }} />
                          </IconButton>
                        )}
                      </Box>
                    </SwiperSlide>
                  ))}
                </Swiper>

              )
            }
            
            <Box
              display="flex"
              justifyContent="flex-end"
              mt={2}
              sx={{ cursor: 'pointer' }}
            >
              <Button component="label" variant="outlined" size="small">
                Subir Imagen
                <VisuallyHiddenInput
                  disabled={isLoading}
                  onChange={handleImageUpload}
                  accept="image/*"
                  type="file"
                />
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* DERECHA: Formulario */}
        <Grid 
          item
          xs={12} 
          md={8}
          sx={{
            maxWidth: 500,
            marginX: 'auto'
          }}
        >
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Nombre del Producto/Servicio"
                fullWidth
                size="small"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  handleInputChange('name', e.target.value);
                }}
              />
              <Box mt={2}>
                <Typography variant="body2" fontWeight="bold" sx={{ color: 'text.primary' }}>
                  Categoría:
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.primary' }}>
                  {article.category.name}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Precio"
                fullWidth
                size="small"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  handleInputChange('price', e.target.value);
                }}
              />
              {isDiscountActive && (
                <Box mt={2}>
                  <TextField
                    label="Precio con Descuento"
                    fullWidth
                    size="small"
                    value={discountPrice}
                    onChange={(e) => {
                      setDiscountPrice(e.target.value);
                      handleInputChange('discountPrice', e.target.value);
                    }}
                  />
                </Box>
              )}
            </Grid>
          </Grid>

          <Box mt={4}>
            <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>
              {article.type.name === 'product'
                ? 'Información del Producto'
                : 'Información del Servicio'}
            </Typography>
            <TextField
              label="Descripción"
              fullWidth
              multiline
              rows={4}
              size="small"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                handleInputChange('description', e.target.value);
              }}
            />
          </Box>

          <Grid container spacing={4} mt={2}>
            {article.type.name === 'product' && (
              <Grid item xs={12} md={4}>
                <TextField
                  label="Stock"
                  type="number"
                  fullWidth
                  size="small"
                  value={stock}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setStock(value);
                    handleInputChange('stock', value);
                  }}
                />
              </Grid>
            )}
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isActive}
                    onChange={() => {
                      setIsActive(!isActive);
                      handleInputChange('isActive', !isActive);
                    }}
                    color="success"
                  />
                }
                label={<Typography sx={{ color: 'text.primary' }}>Activo</Typography>}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isDiscountActive}
                    onChange={() => {
                      setIsDiscountActive(!isDiscountActive);
                      handleInputChange('onDiscount', !isDiscountActive);
                    }}
                    color="primary"
                  />
                }
                label={<Typography sx={{ color: 'text.primary' }}>Con Descuento</Typography>}
              />
            </Grid>
          </Grid>

          <Grid container spacing={4} mt={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                Ingresos Generados (total)
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.primary' }}>
                S/. 2800.00
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                Ingresos Generados (mes actual)
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.primary' }}>
                S/. 800.00
              </Typography>
            </Grid>
          </Grid>

          <Box display="flex" justifyContent="flex-end" mt={4} gap={2}>
            {
              (
                Object.keys(formChanges).length > 0 ||
                imageChanges.length > 0
              ) &&
              (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleDiscardChanges}
                  disabled={isLoading}
                >
                  Descartar Cambios
                </Button>
              )
            }
            <Button
              variant="contained"
              color="success"
              onClick={handleSaveChanges}
              disabled={
                isLoading || (
                  Object.keys(formChanges).length === 0 &&
                  imageChanges.length === 0
                )
              }
            >
              Guardar
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
    </div>
  );
};

export default ArticleDetailView;
