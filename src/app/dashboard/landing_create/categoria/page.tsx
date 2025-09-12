"use client";
import React, { useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader"; 
import { Category, AddCircle, Delete, Edit } from "@mui/icons-material";
import { IconButton, Checkbox } from "@mui/material";
import { useTheme } from '@mui/material/styles'
import CreateCategoriaModal from "@/components/landing_create/CreateCategoriaModal";
import EditCategoriaModal from "@/components/landing_create/EditCategoriaModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

interface Categoria {
  id: number;
  titulo: string;
  fecha: string;
  status: string;
}

const categorias: Categoria[] = [
  { id: 1, titulo: "Día de la madre", fecha: "04/05/2025", status: "Activo" },
  { id: 2, titulo: "Día del padre", fecha: "03/06/2025", status: "Inactivo" },
  { id: 3, titulo: "Fiestas patrias", fecha: "01/07/2025", status: "Inactivo" },
  { id: 4, titulo: "Navidad 2025", fecha: "01/12/2025", status: "Activo" },
];

const CategoriaPage: React.FC = () => {
    
    const theme = useTheme();
    const [selected, setSelected] = useState<number[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [categoriaToEdit, setCategoriaToEdit] = useState<Categoria | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const toggleSelect = (id: number) => {
      setSelected((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    };

    const isSelected = (id: number) => selected.includes(id);

    const selectedCategorias = categorias.filter(cat => selected.includes(cat.id));

    const handleDelete = () => {
      console.log('Eliminando categorías:', selectedCategorias);
      setIsConfirmOpen(false);
      setSelected([]);
    };

    const handleEditClick = () => {
      if(selected.length === 1){
        const cat = categorias.find( cat => cat.id === selected[0]) || null;
        setCategoriaToEdit(cat);
        setIsEditModalOpen(true);
      }
    };

    const handleSaveCategoria = (updated: Categoria) => {
      console.log("Categoria editada", updated);
    };

    return (
    <div className="p-6">
      {/* Encabezado */}
      <SectionHeader 
        icon={<Category fontSize="medium" />} 
        title="Categorías de Landing Page" 
      />

      {/* Barra de acciones */}
      <div className={`flex justify-end items-center gap-2 mb-6 border-b pb-2 ${theme.palette.mode === "dark" ? "border-indigo-950" : "border-gray-300"}`}>
        
        {/* Si hay selección, mostrar Editar/Eliminar */}
        {selected.length === 1 && (
          <IconButton 
            color="primary" 
            size="large"
            onClick={handleEditClick}
          >
            <Edit sx={{ fontSize: 32 }} />
          </IconButton>
        )}
        {selected.length >= 1 && (
          <IconButton 
            color="error" 
            size="large"
            onClick={() => setIsConfirmOpen(true)}
          >
            <Delete sx={{ fontSize: 32 }} />
          </IconButton>
        )}

        {/* Botón añadir */}
        <IconButton 
          color="primary" 
          size="large"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <AddCircle sx={{ fontSize: 50 }} />
        </IconButton>
      </div>

      {/* Tabla de categorías */}
      <div className="overflow-x-auto rounded-2xl overflow-hidden">
        <table className={`min-w-full text-sm border border-separate border-spacing-0 rounded-2xl ${theme.palette.mode === "dark" ? "border-indigo-950" : "border-gray-300"}`}>
          <thead className={`${theme.palette.mode === "dark" ? "bg-indigo-950" : "bg-gray-300"}`}>
            <tr className={`border-b ${theme.palette.mode === "dark" ? "border-b-indigo-950" : "border-b-gray-300"}`}>
              <th className="py-3 px-4 text-left w-12">
                <Checkbox
                  indeterminate={
                    selected.length > 0 &&
                    selected.length < categorias.length
                  }
                  checked={selected.length === categorias.length}
                  onChange={(e) =>
                    setSelected(
                      e.target.checked
                        ? categorias.map((c) => c.id)
                        : []
                    )
                  }
                />
              </th>
              <th className={`py-3 px-4 text-left`}>ID</th>
              <th className={`py-2 px-4 text-left`}>Título</th>
              <th className={`py-2 px-4 text-left`}>Fecha</th>
              <th className={`py-2 px-4 text-left`}>Status</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((cat) => (
              <tr
                key={cat.id}
                className={`${theme.palette.mode === "dark" ? "hover:bg-indigo-950" : "hover:bg-gray-50"} ${
                  isSelected(cat.id) ? "bg-sky-50" : ""
                }`}
              >
                <td className={`py-2 px-4 border-b ${theme.palette.mode === "dark" ? "border-b-indigo-950" : "border-b-gray-300"}`}>
                  <Checkbox
                    checked={isSelected(cat.id)}
                    onChange={() => toggleSelect(cat.id)}
                  />
                </td>
                <td className={`py-2 px-4 border-b ${theme.palette.mode === "dark" ? "border-b-indigo-950" : "border-b-gray-300"}`}>{cat.id}</td>
                <td className={`py-2 px-4 border-b ${theme.palette.mode === "dark" ? "border-b-indigo-950" : "border-b-gray-300"}`}>{cat.titulo}</td>
                <td className={`py-2 px-4 border-b ${theme.palette.mode === "dark" ? "border-b-indigo-950" : "border-b-gray-300"}`}>{cat.fecha}</td>
                <td className={`py-2 px-4 border-b ${theme.palette.mode === "dark" ? "border-b-indigo-950" : "border-b-gray-300"}`}>{cat.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de creación de categoría */}
      <CreateCategoriaModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Modal de edición de categoría */}
      <EditCategoriaModal 
        isOpen={isEditModalOpen}
        categoria={categoriaToEdit}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveCategoria}
      />

      {/* Confirmación de eliminación */}
      <ConfirmDialog 
        open={isConfirmOpen}
        title="¿Eliminar Categorias?"
        message={
          selectedCategorias.length === 1 ? (
            `¿Estás seguro de que deseas eliminar la categoría '${selectedCategorias[0].titulo}'?`
          ) : (
          <div>
            <p>¿Estás seguro de que deseas eliminar estas categorías?</p>
            <ul>
              {selectedCategorias.map( cat => (
                <li key={cat.id}>• {cat.titulo}</li>
              ))}
            </ul>
          </div>
          )}
        action="Eliminar"
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />

    </div>
  );
};

export default CategoriaPage;
