"use client";
import React, { useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { AddCircle, Home, Delete, Edit } from "@mui/icons-material";
import { IconButton, Checkbox } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

// 🟢 Interfaz para LandingPage
interface LandingPage {
  id: number;
  categoria: string;
  titulo: string;
  fechaCreacion: string;
  fechaExpiracion: string;
  terminos: string; // enlace
  imagen: string; // enlace
  status: string;
}

// 🔹 Datos de ejemplo
const landingPages: LandingPage[] = [
  {
    id: 1,
    categoria: "Día de la madre",
    titulo: "Landing Madre 2025",
    fechaCreacion: "04/05/2025",
    fechaExpiracion: "15/05/2025",
    terminos: "/terminos/madre",
    imagen: "/imagenes/madre.png",
    status: "Activo",
  },
  {
    id: 2,
    categoria: "Navidad 2025",
    titulo: "Landing Navidad",
    fechaCreacion: "01/12/2025",
    fechaExpiracion: "31/12/2025",
    terminos: "/terminos/navidad",
    imagen: "/imagenes/navidad.png",
    status: "Inactivo",
  },
];

const LandingPage: React.FC = () => {

  const router = useRouter();
  const theme = useTheme();
  const [selected, setSelected] = useState<number[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isSelected = (id: number) => selected.includes(id);

  const selectedLandingPages = landingPages.filter((lp) =>
    selected.includes(lp.id)
  );

  const handleDelete = () => {
    console.log("Eliminando landing pages:", selectedLandingPages);
    setIsConfirmOpen(false);
    setSelected([]);
  };

  return (
    <div className="p-6">
      {/* Encabezado */}
      <SectionHeader
        icon={<Home fontSize="large" />}
        title="Landing Page"
      />

      {/* Barra de acciones */}
      <div
        className={`flex justify-end items-center gap-2 mb-6 border-b pb-2 ${
          theme.palette.mode === "dark"
            ? "border-indigo-950"
            : "border-gray-300"
        }`}
      >
        {selected.length === 1 && (
          <IconButton 
            color="primary" 
            size="large" 
            onClick={() => console.log("Editar")}
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
        <IconButton 
          color="primary" 
          size="large" 
          onClick={() => router.push("/dashboard/landing_create/landingpage/create")}
        >
          <AddCircle sx={{ fontSize: 50 }} />
        </IconButton>
      </div>

      {/* Tabla de Landing Pages */}
      <div className="overflow-x-auto rounded-2xl overflow-hidden">
        <table
          className={`min-w-full text-sm border border-separate border-spacing-0 rounded-2xl ${
            theme.palette.mode === "dark" ? "border-indigo-950" : "border-gray-300"
          }`}
        >
          <thead
            className={`${
              theme.palette.mode === "dark" ? "bg-indigo-950" : "bg-gray-300"
            }`}
          >
            <tr
              className={`border-b ${
                theme.palette.mode === "dark"
                  ? "border-b-indigo-950"
                  : "border-b-gray-300"
              }`}
            >
              <th className="py-3 px-4 text-left w-12">
                <Checkbox
                  indeterminate={
                    selected.length > 0 && selected.length < landingPages.length
                  }
                  checked={selected.length === landingPages.length}
                  onChange={(e) =>
                    setSelected(
                      e.target.checked ? landingPages.map((lp) => lp.id) : []
                    )
                  }
                />
              </th>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Categoría</th>
              <th className="py-2 px-4 text-left">Título</th>
              <th className="py-2 px-4 text-left">Fecha creación</th>
              <th className="py-2 px-4 text-left">Fecha expiración</th>
              <th className="py-2 px-4 text-left">Términos</th>
              <th className="py-2 px-4 text-left">Imagen</th>
              <th className="py-2 px-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {landingPages.map((lp) => (
              <tr
                key={lp.id}
                className={`${
                  theme.palette.mode === "dark"
                    ? "hover:bg-indigo-950"
                    : "hover:bg-gray-50"
                } ${isSelected(lp.id) ? "bg-sky-50" : ""}`}
              >
                <td
                  className={`py-2 px-4 border-b ${
                    theme.palette.mode === "dark"
                      ? "border-b-indigo-950"
                      : "border-b-gray-300"
                  }`}
                >
                  <Checkbox
                    checked={isSelected(lp.id)}
                    onChange={() => toggleSelect(lp.id)}
                  />
                </td>
                <td
                  className={`py-2 px-4 border-b ${
                    theme.palette.mode === "dark"
                      ? "border-b-indigo-950"
                      : "border-b-gray-300"
                  }`}
                >
                  {lp.id}
                </td>
                <td
                  className={`py-2 px-4 border-b ${
                    theme.palette.mode === "dark"
                      ? "border-b-indigo-950"
                      : "border-b-gray-300"
                  }`}
                >
                  {lp.categoria}
                </td>
                <td
                  className={`py-2 px-4 border-b ${
                    theme.palette.mode === "dark"
                      ? "border-b-indigo-950"
                      : "border-b-gray-300"
                  }`}
                >
                  {lp.titulo}
                </td>
                <td
                  className={`py-2 px-4 border-b ${
                    theme.palette.mode === "dark"
                      ? "border-b-indigo-950"
                      : "border-b-gray-300"
                  }`}
                >
                  {lp.fechaCreacion}
                </td>
                <td
                  className={`py-2 px-4 border-b ${
                    theme.palette.mode === "dark"
                      ? "border-b-indigo-950"
                      : "border-b-gray-300"
                  }`}
                >
                  {lp.fechaExpiracion}
                </td>
                <td
                  className={`py-2 px-4 border-b text-blue-600 underline cursor-pointer ${
                    theme.palette.mode === "dark"
                      ? "border-b-indigo-950"
                      : "border-b-gray-300"
                  }`}
                >
                  <a href={lp.terminos} target="_blank">
                    Ver
                  </a>
                </td>
                <td
                  className={`py-2 px-4 border-b text-blue-600 underline cursor-pointer ${
                    theme.palette.mode === "dark"
                      ? "border-b-indigo-950"
                      : "border-b-gray-300"
                  }`}
                >
                  <a href={lp.imagen} target="_blank">
                    Ver
                  </a>
                </td>
                <td
                  className={`py-2 px-4 border-b ${
                    theme.palette.mode === "dark"
                      ? "border-b-indigo-950"
                      : "border-b-gray-300"
                  }`}
                >
                  {lp.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmación de eliminación */}
      <ConfirmDialog
        open={isConfirmOpen}
        title="¿Eliminar Landing Pages?"
        message={
          selectedLandingPages.length === 1 ? (
            `¿Estás seguro de que deseas eliminar la landing page '${selectedLandingPages[0].titulo}'?`
          ) : (
            <div>
              <p>¿Estás seguro de que deseas eliminar estas landing pages?</p>
              <ul>
                {selectedLandingPages.map((lp) => (
                  <li key={lp.id}>• {lp.titulo}</li>
                ))}
              </ul>
            </div>
          )
        }
        action="Eliminar"
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};

export default LandingPage;
