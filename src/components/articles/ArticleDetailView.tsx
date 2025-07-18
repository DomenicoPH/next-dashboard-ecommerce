'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Typography,
  Box,
  IconButton,
  useTheme
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { styled } from '@mui/material/styles';
import { Article } from '@/interfaces/Article';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/thumbs';
import 'swiper/css/navigation';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
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
  const [imageChanges, setImageChanges] = useState<UpdateArticleImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovering, setIsHovering] = useState<number | null>(null);
  const [mainSwiper, setMainSwiper] = useState<any>(null);

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
    setMainImageName(article.mainImage?.name || '');

    setFormChanges({});
    setImageChanges([]);
    setImages(
      article.images.map((img) => ({
        name: img.name,
        url: img.imgUrl,
        isNew: false,
      }))
    );
    const defaultMain = article.mainImage?.name || (article.images[0] ? article.images[0].name : '');
    setMainImageName(defaultMain);
  };

  useEffect(() => {
  if (!mainSwiper || images.length === 0) return;

    // Buscar índice de la imagen marcada como principal
    const index = images.findIndex((img) => img.name === mainImageName);

    if (index >= 0) {
      mainSwiper.slideToLoop(index); // muestra la imagen marcada
    } else {
      mainSwiper.slideToLoop(0); // fallback: primera imagen
    }
  }, [mainImageName, images, mainSwiper]);


  const handleInputChange = (fieldName: string, value: any) => {
    setFormChanges((prev) => ({ ...prev, [fieldName]: value }));
  };

  useEffect(() => {
    loadArticleData();
  }, []);

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/articles/${article.type.name}s/${article.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formChanges,
            images: imageChanges.map((img) => ({
              name: img.name,
              action: img.action,
            })),
          }),
        }
      );
      if (!res.ok) throw new Error('Failed to save changes');
      await fetchArticle();

      setFormChanges({});
      setImageChanges([]);

    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscardChanges = async () => {
    for await (const image of imageChanges) {
      if (image.action === ArticleImageAction.ADD) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/files/temp/${image.name}`, {
          method: 'DELETE',
        });
      }
    }
    loadArticleData();
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  if (!event.target.files) return;

  const MAX_IMAGES = 4;
  if (images.length >= MAX_IMAGES) {
    alert(`Solo puedes subir un máximo de ${MAX_IMAGES} imágenes.`);
    return;
  }

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

    const newImage = {
      name: data.filename,
      url: data.tempUrl,
      isNew: true,
    };

    setImageChanges((prev) =>
      prev.concat({
        name: data.filename,
        url: data.tempUrl,
        action: ArticleImageAction.ADD,
      })
    );

    setImages((prevImages) => {
      const updatedImages = [...prevImages, newImage];

      if (!mainImageName && updatedImages.length > 0) {
        setMainImageName(updatedImages[0].name);
      }

      return updatedImages;
    });
  } finally {
    setIsLoading(false);
  }
};

const handleImageDelete = async (img: ImageProps) => {
  setIsLoading(true);
  try {
    if (img.isNew) {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/files/temp/${img.name}`, {
        method: 'DELETE',
      });

      setImageChanges((prev) => prev.filter((imgChange) => imgChange.name !== img.name));
    } else {
      setImageChanges((prev) =>
        prev.concat({
          name: img.name,
          url: img.url,
          action: ArticleImageAction.REMOVE,
        })
      );
    }

    setImages((prevImages) => {
      const updatedImages = prevImages.filter((image) => image.name !== img.name);

      if (img.name === mainImageName) {
        setMainImageName(updatedImages[0]?.name || '');
      }

      return updatedImages;
    });
  } finally {
    setIsLoading(false);
  }
};


  const handlePinImage = async (img: ImageProps) => {
    if (img.name === mainImageName) return;

    if (img.isNew) {
      alert('Primero guarda la imagen antes de marcarla como principal.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/articles/${article.type.name}s/${article.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            images: [
              {
                name: img.name,
                action: 'pin',
              },
            ],
          }),
        }
      );

      if (!res.ok) throw new Error('Error al marcar imagen como principal');

      setMainImageName(img.name);

      article.mainImage = {
        id: img.name,
        name: img.name,
        imgUrl: img.url,
      };

    } finally {
      setIsLoading(false);
    }
  };

  const theme = useTheme();

  return (
    <Grid
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
        <EditIcon /> {`Editar ${article.type.name === 'product' ? 'Producto' : 'Servicio'}`}
      </Typography>

      <Box className="px-10 py-5 w-full flex justify-center items-center">
        <Grid container spacing={4}>

          {/* IZQUIERDA: Galería Swiper */}
          <Grid size={{ xs: 12, lg: 4 }} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ width: '250px' }}>
              <Box sx={{ width: '100%', aspectRatio: '1 / 1', mb: 2 }}>
                <Swiper
                  onSwiper={setMainSwiper}
                  style={{ width: '100%', height: '100%', borderRadius: '8px' }}
                  loop={images.length > 1}
                  navigation
                  thumbs={{ swiper: thumbsSwiper }}
                  modules={[Thumbs, Navigation]}
                >
                  {images.length ? (
                    images.map((img, i) => (
                      <SwiperSlide key={i}>
                        <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                          <Image
                            src={img.url}
                            alt={`Image ${i + 1}`}
                            fill
                            priority
                            sizes='(max-width: 600px) 100vw, 50vw'
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
                  )}
                </Swiper>
              </Box>

              {images.length > 0 && (
                <Swiper
                  onSwiper={setThumbsSwiper}
                  slidesPerView={4}
                  spaceBetween={8}
                  watchSlidesProgress
                  modules={[Thumbs]}
                  style={{ paddingTop: '0.5rem' }}
                >
                  {images.map((img, i) => (
                    <SwiperSlide
                      key={`thumb-${i}`}
                      style={{ height: 64, cursor: 'pointer', position: 'relative' }}
                    >
                      <Box
                        onMouseEnter={() => setIsHovering(i)}
                        onMouseLeave={() => setIsHovering(null)}
                        sx={{
                          position: 'relative',
                          width: '100%',
                          height: 64,
                          border: '1px solid rgb(0 0 0 / .2)',
                          borderRadius: '5px',
                        }}
                      >
                        <Image
                          src={img.url}
                          alt={`Thumb ${i + 1}`}
                          priority
                          sizes="(max-width: 600px) 100vw, 50vw"
                          fill
                          style={{ objectFit: 'cover', borderRadius: '4px' }}
                        />

                        {/* Botón para marcar como principal */}
                        <IconButton
                          onClick={() => handlePinImage(img)}
                          aria-label="set-main"
                          sx={{
                            width: 18,
                            height: 18,
                            position: 'absolute',
                            top: 4,
                            left: 4,
                            backgroundColor:
                              mainImageName === img.name ? 'primary.main' : 'rgba(0,0,0,0.4)',
                            color: 'white',
                            fontSize: '1rem',
                            padding: '1px',
                            borderRadius: '4px',
                            '&:hover': { backgroundColor: 'primary.dark' },
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
                              '&:hover': { backgroundColor: 'error.main', color: 'white' },
                              borderRadius: '4px',
                              padding: '1px',
                            }}
                          >
                            <DeleteIcon sx={{ color: 'white', fontSize: '1rem' }} />
                          </IconButton>
                        )}
                      </Box>
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}

              <Box display="flex" justifyContent="flex-end" mt={2}>
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
          <Grid size={{ xs: 12, lg: 8 }} sx={{ maxWidth: 500, marginX: 'auto' }}>
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 6 }}>
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

              <Grid size={{ xs: 12, md: 6 }}>
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
                <Grid size={{ xs: 12, md: 4 }}>
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
              <Grid size={{ xs: 12, md: 4 }}>
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
              <Grid size={{ xs: 12, md: 4 }}>
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

            <Box display="flex" justifyContent="flex-end" mt={4} gap={2}>
              {(Object.keys(formChanges).length > 0 || imageChanges.length > 0) && (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleDiscardChanges}
                  disabled={isLoading}
                >
                  Descartar Cambios
                </Button>
              )}
              <Button
                variant="contained"
                color="success"
                onClick={handleSaveChanges}
                disabled={
                  isLoading ||
                  (Object.keys(formChanges).length === 0 && imageChanges.length === 0)
                }
              >
                Guardar
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
};

export default ArticleDetailView;
