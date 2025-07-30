'use client';

import React from 'react';
import Image from 'next/image';
import { Box, Button, IconButton } from '@mui/material';
import NoPhotographyIcon from '@mui/icons-material/NoPhotography';
import DeleteIcon from '@mui/icons-material/Delete';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/thumbs';
import 'swiper/css/navigation';
import { styled } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';

const VisuallyHiddenInput = styled('input')(visuallyHidden);

interface ImageProps {
  name: string;
  url: string;
  isNew: boolean;
}

interface ArticleEditGalleryProps {
  images: ImageProps[];
  mainImageName: string;
  setMainImageName: (name: string) => void;
  thumbsSwiper: any;
  setThumbsSwiper: (swiper: any) => void;
  mainSwiper: any;
  setMainSwiper: (swiper: any) => void;
  isHovering: number | null;
  setIsHovering: (index: number | null) => void;
  isLoading: boolean;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageDelete: (img: ImageProps) => void;
  handlePinImage: (img: ImageProps) => void;
}

const ArticleEditGallery: React.FC<ArticleEditGalleryProps> = ({
  images,
  mainImageName,
  setMainImageName,
  thumbsSwiper,
  setThumbsSwiper,
  mainSwiper,
  setMainSwiper,
  isHovering,
  setIsHovering,
  isLoading,
  handleImageUpload,
  handleImageDelete,
  handlePinImage,
}) => {
  return (
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

                {/* Pin image */}
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

                {/* Delete button */}
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
  );
};

export default ArticleEditGallery;
