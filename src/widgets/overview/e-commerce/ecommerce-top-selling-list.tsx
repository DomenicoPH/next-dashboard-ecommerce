'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Divider,
} from '@mui/material';
import Image from 'next/image';
import NoPhotographyIcon from '@mui/icons-material/NoPhotography';
import { Article } from '@/interfaces/Article';
import { mockDashboardData } from '@/data/mockDashboard';

type TopSellingItem = {
  label: string;
  value: number;
  imageUrl?: string; // ahora opcional
};

type Props = {
  title: string;
  type: 'product' | 'service'; // indica si muestra productos o servicios
  subheader?: string;
  currency?: string;
  sx?: object;
};

const formatCurrency = (value: number, currency: string) =>
  `${currency} ${value.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;

export function EcommerceTopSellingList({
  title,
  type,
  subheader,
  currency = 'S/.',
  sx,
}: Props) {
  const [data, setData] = useState<TopSellingItem[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/articles`);
        const articles: Article[] = await res.json();

        // Filtrar por tipo (product o service)
        const filtered = articles.filter((a) => a.category?.type?.name === type);

        // 3 artículos aleatorios
        const randomItems = filtered
          .sort(() => 0.5 - Math.random())
          .slice(0, 3)
          .map((article, index) => {
            const imageUrl = article.mainImage?.imgUrl || article.images[0]?.imgUrl;
          
            // Usar el monto del mock correspondiente
            const mockValue =
              type === 'service'
                ? mockDashboardData.bestSellingServices[index]?.value || 0
                : mockDashboardData.bestSellingProducts[index]?.value || 0;
          
            return {
              label: article.name,
              value: mockValue,
              imageUrl,
            };
          });

        setData(randomItems);
        
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, [type]);

  return (
    <Card sx={{ ...sx, borderRadius: 4 }}>
      <CardHeader title={title} subheader={subheader} />
      <List disablePadding>
        {data.map((item, index) => (
          <React.Fragment key={item.label}>
            <ListItem
              sx={{
                py: 1.5,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
                
              <ListItemAvatar>
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 1,
                    bgcolor: 'grey.200',
                    overflow: 'hidden',
                  }}
                >
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.label}
                      width={48}
                      height={48}
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <NoPhotographyIcon sx={{ fontSize: 24, color: 'grey.500' }} />
                  )}
                </Avatar>
              </ListItemAvatar>

              {/* Nombre */}
              <ListItemText primary={item.label} sx={{ flex: 1, ml: 1 }} />

              {/* Valor monetario */}
              <Typography fontWeight="bold" color="primary.main">
                {formatCurrency(item.value, currency)}
              </Typography>
            </ListItem>
            {index < data.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Card>
  );
}
