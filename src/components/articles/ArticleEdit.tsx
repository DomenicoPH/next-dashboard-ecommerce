'use client';

import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Box,
  useTheme
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Article } from '@/interfaces/Article';
import { ArticleImageAction, UpdateArticleImage } from '@/interfaces/UpdateArticleImage';
import ArticleEditGallery from './ArticleEditGallery';
import ArticleEditForm from './ArticleEditForm';

interface ArticleDetailViewProps {
  article: Article;
  fetchArticle: () => Promise<void>;
}

interface ImageProps {
  name: string;
  url: string;
  isNew: boolean;
}

const ArticleEdit: React.FC<ArticleDetailViewProps> = ({ article, fetchArticle }) => {
  const theme = useTheme();

  const [formChanges, setFormChanges] = useState({});
  const [imageChanges, setImageChanges] = useState<UpdateArticleImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovering, setIsHovering] = useState<number | null>(null);
  const [mainSwiper, setMainSwiper] = useState<any>(null);
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  const [images, setImages] = useState<ImageProps[]>([]);
  const [mainImageName, setMainImageName] = useState<string>('');

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    discountPrice: '',
    description: '',
    stock: 0,
    isActive: false,
    onDiscount: false,
  });

  const token = localStorage.getItem('token');

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"error" | "warning" | "info" | "success">("info");

  const showAlert = (message: string, severity: "error" | "warning" | "info" | "success" = "info") => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const loadArticleData = () => {
    
    setFormData({
      name: article.name,
      price: article.price.toFixed(2),
      discountPrice: article.discountPrice.toFixed(2),
      description: article.description,
      stock: article.stock || 0,
      isActive: article.isActive,
      onDiscount: article.onDiscount,
    });

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
    loadArticleData();
  }, [article]);

  useEffect(() => {
    if (!mainSwiper || images.length === 0) return;
    const index = images.findIndex((img) => img.name === mainImageName);
    mainSwiper.slideToLoop(index >= 0 ? index : 0);
  }, [mainImageName, images, mainSwiper]);

  const handleInputChange = (fieldName: string, value: any) => {
    setFormChanges((prev) => ({ ...prev, [fieldName]: value }));
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  // Guardado de cambios:
  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/articles/${article.type.name}s/${article.id}`,
        {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          cache: 'no-store',
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
      showAlert('Cambios guardados exitosamente', 'success');
    } catch {
      showAlert('Error al guardar los cambios', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscardChanges = async () => {
    for await (const image of imageChanges) {
      if (image.action === ArticleImageAction.ADD) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/files/temp/${image.name}`, {
          method: 'DELETE',
          headers: { 
            Authorization: `Bearer ${token}`
          },
          cache: 'no-store',
        });
      }
    }
    loadArticleData();
  };

  // Upload de imagen:
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const MAX_IMAGES = 4;
    if (images.length >= MAX_IMAGES) {
      showAlert(`Solo puedes subir un máximo de ${MAX_IMAGES} imágenes.`, "warning");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', event.target.files[0]);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/files/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`
        },
        cache: 'no-store',
      });
      if (!res.ok) throw new Error('Failed to upload image');

      const data = await res.json();
      const newImage = { name: data.filename, url: data.tempUrl, isNew: true };

      setImageChanges((prev) => prev.concat({
        name: data.filename,
        url: data.tempUrl,
        action: ArticleImageAction.ADD,
      }));

      setImages((prevImages) => {
        const updated = [...prevImages, newImage];
            
        if (!mainImageName || updated.length === 1) {
          setMainImageName(newImage.name);
          setImageChanges((prevChanges) => [
            ...prevChanges,
            {
              name: newImage.name,
              url: newImage.url,
              action: ArticleImageAction.PIN,
            },
          ]);
        }
        return updated;
      });

    } finally {
      setIsLoading(false);
    }
  };

  // Borrado de imagen:
  const handleImageDelete = async (img: ImageProps) => {
    setIsLoading(true);
    try {
      if (img.isNew) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/files/temp/${img.name}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          },
          cache: 'no-store',
        });
        setImageChanges((prev) => prev.filter((i) => i.name !== img.name));
      } else {
        setImageChanges((prev) => prev.concat({
          name: img.name,
          url: img.url,
          action: ArticleImageAction.REMOVE,
        }));
      }

      setImages((prev) => {
        const updated = prev.filter((i) => i.name !== img.name);
        if (img.name === mainImageName) {
          setMainImageName(updated[0]?.name || '');
        }
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Pin de imagen principal:
  const handlePinImage = async (img: ImageProps) => {
    if (img.name === mainImageName) return;
    if (img.isNew) {
      showAlert('Primero guarda la imagen antes de marcarla como principal.', 'info');
      return;
    }

    setIsLoading(true);
    try {

      await handleSaveChanges();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/articles/${article.type.name}s/${article.id}`,
        {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          cache: 'no-store',
          body: JSON.stringify({
            images: [{ name: img.name, action: 'pin' }],
          }),
        }
      );

      if (!res.ok) throw new Error('Error al marcar imagen como principal');

      setMainImageName(img.name);
      await fetchArticle();
      showAlert("Imagen principal actualizada", "success");

    } catch(err){
      showAlert("Ocurrió un error al actualizar la imagen principal", "error");
    } finally {
      setIsLoading(false);
    }
  };

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
      <Typography variant="h6" sx={{ pb: 4, opacity: 0.3, fontStyle: 'italic' }}>
        <EditIcon /> {`Editar ${article.type.name === 'product' ? 'Producto' : 'Servicio'}`}
      </Typography>

      <Box className="px-10 py-5 w-full flex justify-center items-center">
        <Grid container spacing={4}>
          {/* Galería */}
          <Grid size={{ xs: 12, lg: 4 }} sx={{ display: 'flex', justifyContent: 'center' }}>
            <ArticleEditGallery
              images={images}
              mainImageName={mainImageName}
              setMainImageName={setMainImageName}
              thumbsSwiper={thumbsSwiper}
              setThumbsSwiper={setThumbsSwiper}
              mainSwiper={mainSwiper}
              setMainSwiper={setMainSwiper}
              isHovering={isHovering}
              setIsHovering={setIsHovering}
              isLoading={isLoading}
              handleImageUpload={handleImageUpload}
              handleImageDelete={handleImageDelete}
              handlePinImage={handlePinImage}
            />
          </Grid>

          {/* Formulario */}
          <Grid size={{ xs: 12, lg: 8 }} sx={{ maxWidth: 500, marginX: 'auto' }}>
            <ArticleEditForm
              article={article}
              formData={formData}
              formChanges={formChanges}
              handleInputChange={handleInputChange}
              imageChanges={imageChanges}
              handleSaveChanges={handleSaveChanges}
              handleDiscardChanges={handleDiscardChanges}
              isLoading={isLoading}
              alertOpen={alertOpen}
              alertMessage={alertMessage}
              alertSeverity={alertSeverity}
              setAlertOpen={setAlertOpen}
            />
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
};

export default ArticleEdit;
