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
import { useNotification } from "@/context/NotificationContext";
import ConfirmDialog from "../ui/ConfirmDialog";
import VistaCarruselPreview from "@/components/ads/CarrouselPreview";
import { Category } from "@/interfaces/Ads";

// Constantes
const API = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;

interface CreateAdModalProps {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

// Componente
const CreateAdModal: React.FC<CreateAdModalProps> = ({ open, onClose, onRefresh }) => {
  // Estados
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "active" | "inactive">("active");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const token = localStorage.getItem("token");
  const { notify } = useNotification();

  // Efectos
  useEffect(() => {
    if (open) fetchCategories();
  }, [open, categoryFilter]);

  // Funciones de Categorías
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API}/ads/categories?showAll=true`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!Array.isArray(data)) return notify("Error al cargar categorías", "error");

      let filtered = data;
      if (categoryFilter === "active") filtered = data.filter((c: Category) => c.isActive);
      if (categoryFilter === "inactive") filtered = data.filter((c: Category) => !c.isActive);

      setCategories(filtered);

      // Ajustar selección si la actual ya no existe
      const selected = filtered.find((cat) => cat.name === categoryName);
      if (!selected && filtered.length > 0) {
        setCategoryName(filtered[0].name);
        setSelectedCategoryId(filtered[0].id);
      }
    } catch {
      notify("Error al cargar categorías", "error")
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategory.trim()) return notify("Nombre obligatorio", "error");
    const exists = categories.some((c) => c.name === newCategory);
    if (exists) return notify("Ya existe esa categoría", "error");

    try {
      const res = await fetch(`${API}/ads/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: newCategory, isActive: false }),
      });
      const data = await res.json();
      setCategories((prev) => [...prev, data]);
      setCategoryName(data.name);
      setSelectedCategoryId(data.id);
      setNewCategory("");
      notify("Categoría creada", "success");
    } catch {
      notify("Error al crear categoría", "error");
    }
  };

  const toggleCategory = async () => {
    if (!selectedCategoryId) return;
    try {
      const res = await fetch(`${API}/ads/categories/toggle/${selectedCategoryId}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (result.updated) {
      notify("Categoría actualizada", "success");
        fetchCategories();
      }
    } catch {
    notify("Error al actualizar categoría", "error");
    }
  };

  const handleDeleteClick = (categoryId: string) => {
    setCategoryToDelete(categoryId);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      const res = await fetch(`${API}/ads/categories/${categoryToDelete}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      notify("Categoría eliminada", "success");
      fetchCategories();
      setCategoryName("");
      setSelectedCategoryId("");
    } catch {
      notify("Error al eliminar categoría", "error");
    } finally {
      setConfirmOpen(false);
      setCategoryToDelete(null);
    }
  };



  // Funciones de Imagen y Form
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API}/files/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!res.ok) throw new Error("Error al subir imagen");
    const data = await res.json();
    return data.filename;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return notify("Máximo 5MB", "error");

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = categoryName || newCategory;
    if (!finalCategory.trim()) return notify("Seleccioná o creá una categoría", "error");
    if (!imageFile) return notify("Seleccioná una imagen", "error");

    try {
      setLoading(true);
      const imageName = await uploadImage(imageFile);
      const res = await fetch(`${API}/ads`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        cache: "no-store",
        body: JSON.stringify({ categoryName: finalCategory, imageName, isActive }),
      });
      if (!res.ok) throw new Error();
      notify("Anuncio creado", "success");
      resetForm();
      onRefresh();
      onClose();
    } catch {
      notify("Error al crear anuncio", "error");
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

  // Render
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
              sx={{ marginBottom: "10px" }}
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
              sx={{ marginBottom: "10px" }}
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

            <Button variant="outlined" color="secondary" fullWidth onClick={toggleCategory} disabled={!selectedCategoryId}>
              {categories.find((c) => c.id === selectedCategoryId)?.isActive ? "Desactivar Categoría" : "Activar Categoría"}
            </Button>

            <Button
              variant="outlined"
              color="error"
              fullWidth
              onClick={() => handleDeleteClick(selectedCategoryId)}
              disabled={!selectedCategoryId}
            >
              Eliminar Categoría
            </Button>

          </div>

          {/* Columna 2: Crear Categoría + Imagen */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField fullWidth label="Nueva Categoría" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
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
              control={<Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} color="primary" />}
              label="Anuncio Activo"
            />

            <Button variant="contained" type="submit" color="primary" disabled={loading} className="w-full">
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

      <ConfirmDialog
        open={confirmOpen}
        title="Eliminar Categoría"
        message="¿Estás seguro de que quieres eliminar esta categoría? Esta acción no se puede deshacer."
        action="Eliminar"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />

    </Dialog>
  );
};

export default CreateAdModal;
