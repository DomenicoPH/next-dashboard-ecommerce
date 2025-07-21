"use client";

import { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Divider,
  MenuItem,
  CircularProgress,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  AddCircleOutline,
  Image as ImageIcon,
  Refresh,
  CheckCircle,
  Visibility,
} from "@mui/icons-material";
import { toast } from "react-hot-toast";
import Image from "next/image";
import VistaCarruselPreview from "@/components/ads/CarrouselPreview";
import { Ad, Category } from "@/interfaces/Ads";

const API = "https://nestjs-eccommercex-819245f6bb7d.herokuapp.com/api/v1";

const AdsPage = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [allAds, setAllAds] = useState<Ad[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  //   const activeAds = allAds.filter(ad => ad.isActive);  //ACTIVAR PARA PONER EL AVISO DE QUE YA HAY 4 ANUNCIOS ACTIVOS PERO NO TOMA EN CUENTA TODAS LAS CATEGORIA, SOLO LA SELECCIONADA

  const [categoryName, setCategoryName] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedImageName, setUploadedImageName] = useState<string | null>(
    null
  );
  const [isActive, setIsActive] = useState(true);
  const [adsFilter, setAdsFilter] = useState<"all" | "active" | "inactive">(
    "all"
  );
  const [categoryFilter, setCategoryFilter] = useState<
    "all" | "active" | "inactive"
  >("active");

  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [previewCategoryName, setPreviewCategoryName] = useState<string | null>(
    null
  );
  const [searchCategory] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [categoryFilter]);

  useEffect(() => {
    if (categoryName) {
      fetchAllAds(categoryName);
    }
  }, [categoryName]);

  useEffect(() => {
    let filtered = allAds;

    if (adsFilter === "active") {
      filtered = allAds.filter((ad) => ad.isActive);
    } else if (adsFilter === "inactive") {
      filtered = allAds.filter((ad) => !ad.isActive);
    }

    if (adsFilter === "all") {
      filtered = [...allAds].sort((a, b) =>
        a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1
      );
    }

    setAds(filtered);
  }, [adsFilter, allAds]);

  const fetchAllAds = async (categoryToSearch?: string) => {
    const selected = categoryToSearch || searchCategory || categoryName;
    if (!selected) return;

    try {
      setLoading(true);
      const res = await fetch(
        `${API}/ads?categoryName=${encodeURIComponent(selected)}&showAll=true`
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      setAllAds(data);
      setAds(data);
    } catch {
      toast.error("Error al cargar anuncios");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      // traeme TODO, no solo las activas
      const res = await fetch(`${API}/ads/categories?showAll=true`);
      const data = await res.json();
      if (!Array.isArray(data)) {
        toast.error("Error al cargar categorías");
        return;
      }

      // filtrado client‑side según el dropdown
      let filtered = data;
      if (categoryFilter === "active") {
        filtered = data.filter((cat: Category) => cat.isActive);
      } else if (categoryFilter === "inactive") {
        filtered = data.filter((cat: Category) => !cat.isActive);
      }

      // setCategories(filtered);
      setCategories(
        filtered.sort((a, b) =>
          a.name.localeCompare(b.name, "es", { sensitivity: "base" })
        )
      );

      // si la categoría seleccionada ya no existe en filtered,
      // auto‑selecciona la primera
      const selected = filtered.find((cat) => cat.name === categoryName);
      if (!selected && filtered.length > 0) {
        setCategoryName(filtered[0].name);
        setSelectedCategoryId(filtered[0].id);
      }
    } catch {
      toast.error("Error al cargar categorías");
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategory.trim()) return toast.error("Nombre obligatorio");
    const exists = categories.some((c) => c.name === newCategory);
    if (exists) return toast.error("Ya existe esa categoría");

    try {
      const res = await fetch(`${API}/ads/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory, isActive: false }),
      });
      const data = await res.json();
      setCategories((prev) => [...prev, data]);
      setCategoryName(data.name);
      setSelectedCategoryId(data.id);
      setNewCategory("");
      toast.success("Categoría creada");
    } catch {
      toast.error("Error al crear categoría");
    }
  };

  const deleteAd = async (adId: string) => {
    toast.custom((t) => (
      <div className="bg-white text-black p-4 rounded shadow-lg flex flex-col gap-2 w-[300px]">
        <p>¿Estás seguro de que querés eliminar este anuncio?</p>
        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="text-sm text-gray-700 px-3 py-1 rounded hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id); // Cierra el toast actual
              try {
                const res = await fetch(`${API}/ads/${adId}`, {
                  method: "DELETE",
                });
                const result = await res.json();
                if (result.deleted) {
                  toast.success("Anuncio eliminado");
                  fetchAllAds();
                }
              } catch {
                toast.error("Error al eliminar anuncio");
              }
            }}
            className="bg-red-600 text-white text-sm px-3 py-1 rounded hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      </div>
    ));
  };

  const toggleCategory = async () => {
    if (!selectedCategoryId) return;
    try {
      const res = await fetch(
        `${API}/ads/categories/toggle/${selectedCategoryId}`,
        {
          method: "PATCH",
        }
      );
      const result = await res.json();
      if (result.updated) {
        toast.success("Categoría actualizada");
        fetchCategories();
      }
    } catch {
      toast.error("Error al actualizar categoría");
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API}/files/upload`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.filename;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast.error("Máximo 5MB");

    setImageFile(file);
    setUploadedImageName(null);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = categoryName || newCategory;
    if (!finalCategory.trim())
      return toast.error("Seleccioná o creá una categoría");
    if (!imageFile) return toast.error("Seleccioná una imagen");

    try {
      setLoading(true);
      const imageName = await uploadImage(imageFile);
      const res = await fetch(`${API}/ads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryName: finalCategory,
          imageName,
          isActive,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Anuncio creado");
      setCategoryName("");
      setNewCategory("");
      setImageFile(null);
      setImagePreview(null);
      setUploadedImageName(null);
      setIsActive(true);
      fetchAllAds();
      fetchCategories();
    } catch {
      toast.error("Error al crear anuncio");
    } finally {
      setLoading(false);
    }
  };

  const toggleAd = async (adId: string, currentState: boolean) => {
    try {
      const res = await fetch(`${API}/ads/toggle/${adId}`, { method: "PATCH" });
      const result = await res.json();
      if (result.updated) {
        toast.success(
          currentState ? "Anuncio desactivado" : "Anuncio activado"
        );
        fetchAllAds();
      }
    } catch {
      toast.error("Error al actualizar anuncio");
    }
  };

  //ACTIVAR PARA PONER EL AVISO DE QUE YA HAY 4 ANUNCIOS ACTIVOS PERO NO TOMA EN CUENTA TODAS LAS CATEGORIA, SOLO LA SELECCIONADA
  //   const toggleAd = async (adId: string, currentState: boolean) => {
  //   const activeAds = allAds.filter((ad) => ad.isActive);

  //   // Si el anuncio está INACTIVO y lo queremos activar, verificamos el límite
  //   if (!currentState && activeAds.length >= 4) {
  //     toast.custom((t) => (
  //       <div className="bg-white text-black p-4 rounded shadow-lg flex flex-col gap-2 w-[350px]">
  //         <p className="font-medium">Ya hay 4 anuncios activos.</p>
  //         <p className="text-sm text-gray-700">Para activar este anuncio, desactiva alguno de los siguientes:</p>

  //         <ul className="text-sm list-disc pl-5 my-2 text-gray-800">
  //           {activeAds.map((ad) => (
  //             <li key={ad.id}>{ad.category.name}</li>
  //           ))}
  //         </ul>

  //         <div className="flex justify-end gap-2 mt-2">
  //           <button
  //             onClick={() => toast.dismiss(t.id)}
  //             className="text-sm text-gray-700 px-3 py-1 rounded hover:bg-gray-200"
  //           >
  //             Entendido
  //           </button>
  //         </div>
  //       </div>
  //     ));
  //     return;
  //   }

  //   // Si no se supera el límite, continuar normalmente
  //   try {
  //     const res = await fetch(`${API}/ads/toggle/${adId}`, { method: "PATCH" });
  //     const result = await res.json();
  //     if (result.updated) {
  //       toast.success(currentState ? "Anuncio desactivado" : "Anuncio activado");
  //       fetchAllAds();
  //     }
  //   } catch {
  //     toast.error("Error al actualizar anuncio");
  //   }
  // };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <AddCircleOutline fontSize="large" className="text-blue-500" />
          </div>
          <h1 className="text-4xl font-bold">Gestión de Anuncios</h1>
          <p className="text-zinc-400 text-sm mt-2">
            Crea y administra anuncios para tu plataforma de forma fácil y
            rápida
          </p>
        </div>

        {/* FORMULARIO */}
        <div className="bg-gray-800 border border-zinc-700 rounded-lg p-6 shadow-xl mb-10">
          <Typography variant="h6" className="text-white mb-6">
            Crear Nuevo Anuncio
          </Typography>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* COLUMNA 1: SELECCIÓN Y FILTRO */}
            <div className="space-y-4 col-span-1">
              <div className="mt-4 mb-4">
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Filtrar Categorías"
                  value={categoryFilter}
                  onChange={(e) => {
                    const value = e.target.value as
                      | "all"
                      | "active"
                      | "inactive";
                    setCategoryFilter(value);
                  }}
                  InputProps={{ style: { color: "white" } }}
                  InputLabelProps={{ style: { color: "#bbb" } }}
                >
                  <MenuItem value="all">Todas</MenuItem>
                  <MenuItem value="active">Activas</MenuItem>
                  <MenuItem value="inactive">Inactivas</MenuItem>
                </TextField>
              </div>

              <div className="mb-4">
                <TextField
                  select
                  fullWidth
                  label="Seleccioná una Categoría"
                  value={categoryName}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCategoryName(value);
                    const selectedCat = categories.find(
                      (c) => c.name === value
                    );
                    setSelectedCategoryId(selectedCat?.id || "");
                    setNewCategory("");
                  }}
                  InputProps={{ style: { color: "white" } }}
                  InputLabelProps={{ style: { color: "#bbb" } }}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.name}>
                      {cat.name} {cat.isActive ? "" : "(Inactiva)"}
                    </MenuItem>
                  ))}
                </TextField>
              </div>

              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={toggleCategory}
                disabled={!selectedCategoryId}
              >
                {categories.find((c) => c.id === selectedCategoryId)?.isActive
                  ? "Desactivar Categoría"
                  : "Activar Categoría"}
              </Button>
            </div>

            {/* COLUMNA 2: CREAR NUEVA CATEGORÍA + IMAGEN + SWITCH */}
            <div className="space-y-4 col-span-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  fullWidth
                  label="Nueva Categoría"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  InputProps={{ style: { color: "white" } }}
                  InputLabelProps={{ style: { color: "#bbb" } }}
                />
                <Button
                  variant="outlined"
                  onClick={handleCreateCategory}
                  className="w-full"
                >
                  Crear Categoría
                </Button>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1">
                  Imagen del Anuncio *
                </label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="text-sm text-zinc-300 file:bg-blue-600 file:text-white file:px-4 file:py-2 file:rounded file:cursor-pointer"
                />
              </div>

              <FormControlLabel
                control={
                  <Switch
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    color="primary"
                  />
                }
                label="Anuncio Activo"
              />

              <Button
                variant="contained"
                type="submit"
                color="primary"
                disabled={loading}
                className="w-full"
              >
                <CheckCircle className="mr-2" /> Crear Anuncio
              </Button>
            </div>

            {/* COLUMNA 3: VISTA PREVIA */}
            <div className="col-span-1">
              <label className="text-sm text-zinc-400 block mb-2">
                Vista Previa
              </label>
              {imagePreview ? (
                <VistaCarruselPreview
                  imgUrl={imagePreview}
                  categoryName={categoryName}
                />
              ) : (
                <div className="w-full h-8/12 bg-zinc-700 rounded-lg flex items-center justify-center text-zinc-400">
                  Sin imagen
                </div>
              )}
            </div>
          </form>
        </div>

        {/* ANUNCIOS EXISTENTES */}
        <div className="bg-gray-800 border border-zinc-700 rounded-lg p-6 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <Typography variant="h6" className="text-white">
              Anuncios Existentes
            </Typography>
            <div className="flex flex-wrap gap-4">
              <TextField
                select
                value={adsFilter}
                onChange={(e) => setAdsFilter(e.target.value as any)}
                size="small"
                label="Filtrar"
                InputProps={{ style: { color: "white" } }}
                InputLabelProps={{ style: { color: "#bbb" } }}
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="active">Activos</MenuItem>
                <MenuItem value="inactive">Inactivos</MenuItem>
              </TextField>

              <Button
                onClick={() => fetchAllAds(searchCategory || categoryName)}
                variant="outlined"
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={20} />
                ) : (
                  <Refresh className="mr-2" />
                )}
                Actualizar
              </Button>
            </div>
          </div>

          <Divider className="bg-zinc-700 mb-6" />

          {ads.length === 0 ? (
            <div className="py-20 text-center text-zinc-400">
              <ImageIcon style={{ fontSize: 50 }} />
              <p className="mt-4">No hay anuncios aún</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {ads.map((ad) => (
                <div
                  key={ad.id}
                  className="bg-zinc-800 rounded-lg overflow-hidden shadow-md"
                >
                  <div className="relative w-full aspect-square">
                    <Image
                      src={ad.imgUrl}
                      alt={ad.category.name}
                      fill
                      className="object-cover"
                      sizes="100vw"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">
                      {ad.category.name}
                    </h3>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={ad.isActive}
                          onChange={() => toggleAd(ad.id, ad.isActive)}
                          color="primary"
                        />
                      }
                      label={ad.isActive ? "Activo" : "Inactivo"}
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      className="mt-2"
                      startIcon={<Visibility />}
                      onClick={() => {
                        setPreviewImageUrl(ad.imgUrl);
                        setPreviewCategoryName(ad.category.name);
                        setShowPreviewModal(true);
                      }}
                    >
                      Ver
                    </Button>

                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      className="mt-2 ml-2"
                      onClick={() => deleteAd(ad.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MODAL VISTA PREVIA */}
      {showPreviewModal && previewImageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-white text-black p-6 rounded-lg w-full max-w-6xl">
            <VistaCarruselPreview
              imgUrl={previewImageUrl}
              categoryName={previewCategoryName || undefined}
            />
            <div className="mt-4 text-right">
              <Button
                onClick={() => setShowPreviewModal(false)}
                variant="outlined"
                color="primary"
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdsPage;
