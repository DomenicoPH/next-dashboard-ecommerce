"use client";
import React from "react";
import Image from "next/image";
import {
  Button,
  Switch,
  FormControlLabel,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  useTheme,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { Ad } from "@/interfaces/Ads";
import { toast } from "react-hot-toast";
import { useConfirmDialog } from "@/context/ConfirmDialogContext";

interface AdsListProps {
  ads: Ad[];
  onPreview: (ad: { imgUrl: string; category: string }) => void;
  onRefresh: () => void;
}

const API = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;
const token = localStorage.getItem('token');

const AdsList: React.FC<AdsListProps> = ({ ads, onPreview, onRefresh }) => {

  const theme = useTheme();
  const confirm = useConfirmDialog();

  const deleteAd = async (adId: string) => {
    const ok = await confirm({
      title: "Eliminar Anuncio",
      message: "¿Estás seguro de que quieres eliminar este anuncio?",
      action: "Eliminar",
    });

    if (!ok) return;

    try {
      const res = await fetch(`${API}/ads/${adId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (result.deleted) {
        toast.success("Anuncio eliminado");
        onRefresh();
      }
    } catch {
      toast.error("Error al eliminar anuncio");
    }
  };

  const toggleAd = async (adId: string, currentState: boolean) => {
    const ok = await confirm({
      title: currentState ? "Desactivar anuncio" : "Activar anuncio",
      message: currentState
        ? "¿Seguro que quieres desactivar este anuncio?"
        : "¿Seguro que quieres activar este anuncio?",
      action: currentState ? "Desactivar" : "Activar",
    });

    if (!ok) return;

    try {
      const res = await fetch(`${API}/ads/toggle/${adId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (result.updated) {
        toast.success(currentState ? "Anuncio desactivado" : "Anuncio activado");
        onRefresh();
      }
    } catch {
      toast.error("Error al actualizar anuncio");
    }
  };


  if (ads.length === 0) {
    return (
      <Box textAlign="center" py={10}>
        <Typography color="text.secondary">No hay anuncios aún</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {ads.map((ad) => (
        <Grid size={{ xs:12, sm:6, md:3 }} key={ad.id}>
          <Card
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: theme.shadows[3],
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Imagen cuadrada */}
            <Box
              sx={{
                position: "relative",
                width: "100%",
                pt: "100%", // Aspect ratio 1:1
              }}
            >
              <Image
                src={ad.imgUrl}
                alt={ad.category.name}
                fill
                style={{ objectFit: "cover" }}
                sizes="300px"
                priority
              />
            </Box>

            {/* Contenido */}
            <CardContent sx={{ p: 2 }}>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{ mb: 1 }}
              >
                {ad.category.name}
              </Typography>

              <FormControlLabel
                sx={{ display: "block", mb: 2 }}
                control={
                  <Switch
                    checked={ad.isActive}
                    onChange={() => toggleAd(ad.id, ad.isActive)}
                    color="primary"
                  />
                }
                label={ad.isActive ? "Activo" : "Inactivo"}
              />

              {/* Botones alineados a la derecha */}
              <Box display="flex" justifyContent="flex-end" gap={1}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Visibility />}
                  onClick={() =>
                    onPreview({ imgUrl: ad.imgUrl, category: ad.category.name })
                  }
                >
                  Ver
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => deleteAd(ad.id)}
                >
                  Eliminar
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default AdsList;
