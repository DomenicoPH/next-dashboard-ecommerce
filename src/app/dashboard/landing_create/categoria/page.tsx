"use client";
import React, { useEffect, useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader"; 
import { Category, AddCircle, Delete, Edit } from "@mui/icons-material";
import {
  Card,
  CardContent,
  IconButton,
  Checkbox,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Toolbar,
  Tooltip,
  Box,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CreateCategoriaModal from "@/components/landing_create/CreateCategoriaModal";
import EditCategoriaModal from "@/components/landing_create/EditCategoriaModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

import { 
  getCategorias, 
  addCategoria, 
  updateCategoria, 
  deleteCategorias, 
  Categoria 
} from "@/app/lib/categoriaStore";

const CategoriaPage: React.FC = () => {
  const theme = useTheme();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [categoriaToEdit, setCategoriaToEdit] = useState<Categoria | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Cargar categorías al montar
  useEffect(() => {
    const fetchCategorias = async () => {
      const data = await getCategorias();
      setCategorias(data);
    };
    fetchCategorias();
  }, []);

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isSelected = (id: number) => selected.includes(id);
  const selectedCategorias = categorias.filter(cat => selected.includes(cat.id));

  const handleDelete = async () => {
    await deleteCategorias(selected);
    const updated = await getCategorias();
    setCategorias(updated);
    setSelected([]);
    setIsConfirmOpen(false);
  };

  const handleEditClick = () => {
    if (selected.length === 1) {
      const cat = categorias.find(cat => cat.id === selected[0]) || null;
      setCategoriaToEdit(cat);
      setIsEditModalOpen(true);
    }
  };

  const handleSaveCategoria = async (updated: Categoria) => {
    await updateCategoria(updated);
    const refreshed = await getCategorias();
    setCategorias(refreshed);
    setIsEditModalOpen(false);
  };

  const handleCreateCategoria = async (newCategoria: Categoria) => {
    await addCategoria(newCategoria);
    const refreshed = await getCategorias();
    setCategorias(refreshed);
    setIsCreateModalOpen(false);
  };

  return (
    <Box className="p-6 max-w-7xl mx-auto">
      <SectionHeader 
        icon={<Category fontSize="medium" />} 
        title="Categorías de Landing Page" 
      />

      <Card sx={{ borderRadius: 4, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
        <Toolbar 
          sx={{ 
            display: "flex", 
            justifyContent: "flex-end", 
            gap: 2, 
            borderBottom: `1px solid ${theme.palette.mode === "dark" ? "#1e1b4b" : "#d1d5db"}` 
          }}
        >
          {selected.length === 1 && (
            <Tooltip title="Editar">
              <IconButton color="primary" size="large" onClick={handleEditClick}>
                <Edit sx={{ fontSize: 28 }} />
              </IconButton>
            </Tooltip>
          )}
          {selected.length >= 1 && (
            <Tooltip title="Eliminar">
              <IconButton color="error" size="large" onClick={() => setIsConfirmOpen(true)}>
                <Delete sx={{ fontSize: 28 }} />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Crear Categoría">
            <IconButton color="primary" size="large" onClick={() => setIsCreateModalOpen(true)}>
              <AddCircle sx={{ fontSize: 40 }} />
            </IconButton>
          </Tooltip>
        </Toolbar>

        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < categorias.length}
                    checked={selected.length === categorias.length}
                    onChange={(e) =>
                      setSelected(e.target.checked ? categorias.map(c => c.id) : [])
                    }
                  />
                </TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Título</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categorias.map(cat => (
                <TableRow key={cat.id} hover selected={isSelected(cat.id)}>
                  <TableCell padding="checkbox">
                    <Checkbox checked={isSelected(cat.id)} onChange={() => toggleSelect(cat.id)} />
                  </TableCell>
                  <TableCell>{cat.id}</TableCell>
                  <TableCell>{cat.titulo}</TableCell>
                  <TableCell>{cat.fecha}</TableCell>
                  <TableCell>{cat.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CreateCategoriaModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateCategoria}
      />

      <EditCategoriaModal 
        isOpen={isEditModalOpen}
        categoria={categoriaToEdit}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveCategoria}
      />

      <ConfirmDialog
        open={isConfirmOpen}
        title="¿Eliminar Categorías?"
        message={
          selectedCategorias.length === 1 
          ? `¿Estás seguro de que deseas eliminar la categoría '${selectedCategorias[0].titulo}'?`
          : (
            <div>
              <p>¿Estás seguro de que deseas eliminar estas categorías?</p>
              <ul>
                {selectedCategorias.map(cat => <li key={cat.id}>• {cat.titulo}</li>)}
              </ul>
            </div>
          )
        }
        action="Eliminar"
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </Box>
  );
};

export default CategoriaPage;
