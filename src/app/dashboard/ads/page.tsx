"use client";
import { useEffect, useState, useMemo } from "react";
import { 
  Button, 
  CircularProgress, 
  Box 
} from "@mui/material";
import toast from "react-hot-toast";
import CampaignIcon from '@mui/icons-material/Campaign';
import AdsList from "@/components/ads/AdsList";
import CreateAdModal from "@/components/ads/CreateAdModal";
import PreviewAdModal from "@/components/ads/PreviewAdModal";
import SectionHeader from "@/components/ui/SectionHeader";
import AdsFilters from "@/components/ads/AdsFilters";
import { Ad, Category } from "@/interfaces/Ads";
import PrimaryButton from '@/components/ui/PrimaryButton';
import AddIcon from '@mui/icons-material/Add';
import AdsPageSkeleton from "@/components/ads/AdsPageSkeleton";

const API = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;
const token = localStorage.getItem('token');

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
      const res = await fetch(`${API}/ads?showAll=true`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
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
      const res = await fetch(`${API}/ads/categories?showAll=true`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
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
    return ads; // el orden viene del backend
  }, [ads, adsFilter]);

  if(loading) { return <AdsPageSkeleton /> };

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 4, width: '100%' }}>

        <SectionHeader
          icon={<CampaignIcon fontSize="medium" />}
          title="Gestión de Anuncios"
        />

        <div className="flex justify-between items-center mb-6">
          
          {/* FILTROS */}
          <AdsFilters adsFilter={adsFilter} onFilterChange={setAdsFilter} />

          <PrimaryButton
            label="Crear Anuncio"
            icon={<AddIcon />}
            onClick={() => setIsCreateModalOpen(true)}
          />
          
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
    </Box>
  );
};

export default AdsPage;
