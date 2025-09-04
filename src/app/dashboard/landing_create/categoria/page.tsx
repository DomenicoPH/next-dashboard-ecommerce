"use client";
import React, { useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader"; 
import { AddCircleOutline, AddCircle, Delete, Edit } from "@mui/icons-material";
import { IconButton, Checkbox } from "@mui/material";
import { useTheme } from '@mui/material/styles'

interface Categoria {
  id: number;
  titulo: string;
  fecha: string;
  status: string;
}

const mockCategorias: Categoria[] = [
  { id: 1, titulo: "Día de la madre", fecha: "04/05/2025", status: "Activo" },
  { id: 2, titulo: "Día del padre", fecha: "03/06/2025", status: "Inactivo" },
  { id: 3, titulo: "Navidad", fecha: "01/12/2025", status: "Activo" },
];

const CategoriaPage: React.FC = () => {
    
    const theme = useTheme();
    const [selected, setSelected] = useState<number[]>([]);

    const toggleSelect = (id: number) => {
      setSelected((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    };

    const isSelected = (id: number) => selected.includes(id);

    return (
    <div className="p-6">
      {/* Encabezado */}
      <SectionHeader 
        icon={<AddCircleOutline fontSize="large" />} 
        title="Categorías de Landing Page" 
      />

      {/* Barra de acciones */}
      <div className={`flex justify-end items-center gap-2 mb-6 border-b pb-2 ${theme.palette.mode === "dark" ? "border-indigo-950" : "border-gray-300"}`}>
        {/* Si hay selección, mostrar Editar/Eliminar */}
        {selected.length === 1 && (
          <IconButton color="primary" size="large">
            <Edit sx={{ fontSize: 32 }} />
          </IconButton>
        )}
        {selected.length >= 1 && (
          <IconButton color="error" size="large">
            <Delete sx={{ fontSize: 32 }} />
          </IconButton>
        )}

        {/* Botón añadir */}
        <IconButton color="primary" size="large">
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
                    selected.length < mockCategorias.length
                  }
                  checked={selected.length === mockCategorias.length}
                  onChange={(e) =>
                    setSelected(
                      e.target.checked
                        ? mockCategorias.map((c) => c.id)
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
            {mockCategorias.map((cat) => (
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
    </div>
  );
};

export default CategoriaPage;
