"use client";
import { useEffect, useState, useMemo } from "react";
import { Button, CircularProgress } from "@mui/material";
import { Refresh } from "@mui/icons-material";
import toast from "react-hot-toast";

import AdsList from "@/components/ads/AdsList";
import CreateAdModal from "@/components/ads/CreateAdModal";
import PreviewAdModal from "@/components/ads/PreviewAdModal";
import AdsHeader from "@/components/ads/AdsHeader";
import AdsFilters from "@/components/ads/AdsFilters";
import { Ad, Category } from "@/interfaces/Ads";

const API = "https://nestjs-eccommercex-819245f6bb7d.herokuapp.com/api/v1";

const AdsPage = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [previewAd, setPreviewAd] = useState<{ imgUrl: string; category: string } | null>(null);
  const [adsFilter, setAdsFilter] = useState<"all" | "active" | "inactive">("all");

  const fetchAds = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/ads?showAll=true`);
      const data = await res.json();
      setAds(data);
    } catch {
      toast.error("Error al cargar anuncios");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API}/ads/categories?showAll=true`);
      const data = await res.json();
      setCategories(data);
    } catch {
      toast.error("Error al cargar categorías");
    }
  };

  useEffect(() => {
    fetchAds();
    fetchCategories();
  }, []);

  const filteredAds = useMemo(() => {
    if (adsFilter === "active") return ads.filter((ad) => ad.isActive);
    if (adsFilter === "inactive") return ads.filter((ad) => !ad.isActive);
    return ads.sort((a, b) => (a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1));
  }, [ads, adsFilter]);

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto">

        <AdsHeader />

        <div className="flex justify-between mb-6">
          <Button variant="contained" color="primary" onClick={() => setIsCreateModalOpen(true)}>
            Crear Anuncio
          </Button>
          {/* FILTROS */}
          <AdsFilters adsFilter={adsFilter} onFilterChange={setAdsFilter} />

          <Button onClick={fetchAds} variant="outlined" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : <Refresh className="mr-2" />}
            Actualizar
          </Button>
        </div>


        {/* LISTADO DE ANUNCIOS */}
        <AdsList ads={filteredAds} onPreview={(ad) => setPreviewAd(ad)} onRefresh={fetchAds} />

        {/* MODALES */}
        <CreateAdModal
          open={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onRefresh={() => {
            fetchAds();
            fetchCategories();
          }}
        />

        {previewAd && (
          <PreviewAdModal
            imgUrl={previewAd.imgUrl}
            category={previewAd.category}
            onClose={() => setPreviewAd(null)}
          />
        )}
      </div>
    </div>
  );
};

export default AdsPage;
