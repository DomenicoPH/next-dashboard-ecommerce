"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Switch,
  FormControlLabel,
  Typography,
  CircularProgress,
} from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import VistaCarruselPreview from "@/components/ads/CarrouselPreview";
import { toast } from "react-hot-toast";
import { Category } from "@/interfaces/Ads";

interface CreateAdModalProps {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

const API = "https://nestjs-eccommercex-819245f6bb7d.herokuapp.com/api/v1";

const CreateAdModal: React.FC<CreateAdModalProps> = ({ open, onClose, onRefresh }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<"all" | "active" | "inactive">("active");

  useEffect(() => {
    if (open) fetchCategories();
  }, [open, categoryFilter]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API}/ads/categories?showAll=true`);
      const data = await res.json();
      if (!Array.isArray(data)) return toast.error("Error al cargar categorías");

      let filtered = data;
      if (categoryFilter === "active") {
        filtered = data.filter((c: Category) => c.isActive);
      } else if (categoryFilter === "inactive") {
        filtered = data.filter((c: Category) => !c.isActive);
      }

      setCategories(filtered);
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

  const toggleCategory = async () => {
    if (!selectedCategoryId) return;
    try {
      const res = await fetch(`${API}/ads/categories/toggle/${selectedCategoryId}`, { method: "PATCH" });
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
    const res = await fetch(`${API}/files/upload`, { method: "POST", body: formData });
    const data = await res.json();
    return data.filename;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast.error("Máximo 5MB");

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = categoryName || newCategory;
    if (!finalCategory.trim()) return toast.error("Seleccioná o creá una categoría");
    if (!imageFile) return toast.error("Seleccioná una imagen");

    try {
      setLoading(true);
      const imageName = await uploadImage(imageFile);
      const res = await fetch(`${API}/ads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryName: finalCategory, imageName, isActive }),
      });
      if (!res.ok) throw new Error();
      toast.success("Anuncio creado");
      resetForm();
      onRefresh();
      onClose();
    } catch {
      toast.error("Error al crear anuncio");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCategoryName("");
    setNewCategory("");
    setImageFile(null);
    setImagePreview(null);
    setIsActive(true);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle sx={{ fontWeight: "bold" }}>Crear Nuevo Anuncio</DialogTitle>
      <DialogContent dividers>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna 1: Categorías */}
          <div className="space-y-4">
            <TextField
              select
              fullWidth
              size="small"
              label="Filtrar Categorías"
              sx={{marginBottom: '10px'}}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
            >
              <MenuItem value="all">Todas</MenuItem>
              <MenuItem value="active">Activas</MenuItem>
              <MenuItem value="inactive">Inactivas</MenuItem>
            </TextField>

            <TextField
              select
              fullWidth
              label="Seleccioná una Categoría"
              sx={{marginBottom: '10px'}}
              value={categoryName}
              onChange={(e) => {
                const value = e.target.value;
                setCategoryName(value);
                const selectedCat = categories.find((c) => c.name === value);
                setSelectedCategoryId(selectedCat?.id || "");
                setNewCategory("");
              }}
            >
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.name}>
                  {cat.name} {cat.isActive ? "" : "(Inactiva)"}
                </MenuItem>
              ))}
            </TextField>

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

          {/* Columna 2: Crear Categoría + Imagen */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                fullWidth
                label="Nueva Categoría"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <Button variant="outlined" onClick={handleCreateCategory}>
                Crear Categoría
              </Button>
            </div>

            <div>
              <Typography variant="body2" color="textSecondary" className="mb-1">
                Imagen del Anuncio *
              </Typography>
              <input
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                className="text-sm text-zinc-300 file:bg-blue-600 file:text-white file:px-4 file:py-2 file:rounded file:cursor-pointer"
              />
            </div>

            <FormControlLabel
              control={
                <Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} color="primary" />
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
              {loading ? <CircularProgress size={20} /> : <><CheckCircle className="mr-2" /> Crear Anuncio</>}
            </Button>
          </div>

          {/* Columna 3: Vista Previa */}
          <div>
            <Typography variant="body2" color="textSecondary" className="mb-2">
              Vista Previa
            </Typography>
            {imagePreview ? (
              <VistaCarruselPreview imgUrl={imagePreview} categoryName={categoryName} />
            ) : (
              <div className="w-full h-64 bg-zinc-700 rounded-lg flex items-center justify-center text-zinc-400">
                Sin imagen
              </div>
            )}
          </div>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="secondary">
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateAdModal;
