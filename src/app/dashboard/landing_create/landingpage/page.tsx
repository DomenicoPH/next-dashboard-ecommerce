"use client";
import React, { useState, useEffect } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { AddCircle, Home, Delete, Edit } from "@mui/icons-material";
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
  Typography,
  Box,
  Switch,
  Chip
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

import {
  getLandingPages,
  LandingPage,
  deleteLandingPages,
  updateLandingPage,
} from "@/app/lib/landingStore";
import { getCategorias, Categoria } from "@/app/lib/categoriaStore";

const LandingPageTable: React.FC = () => {
  const boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
  const router = useRouter();
  const theme = useTheme();

  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Cargar datos al montar
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [lps, cats] = await Promise.all([getLandingPages(), getCategorias()]);
        if (!mounted) return;
        setLandingPages(lps);
        setCategorias(cats);
      } catch (err) {
        console.error("Error cargando landing pages / categorias:", err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isSelected = (id: number) => selected.includes(id);
  const selectedLandingPages = landingPages.filter((lp) => selected.includes(lp.id));

  const handleDelete = async () => {
    try {
      await deleteLandingPages(selected);
      setLandingPages((prev) => prev.filter((lp) => !selected.includes(lp.id)));
      setIsConfirmOpen(false);
      setSelected([]);
    } catch (err) {
      console.error("Error eliminando landing pages:", err);
    }
  };

  const handleToggleStatus = async (id: number, checked: boolean) => {
    setLandingPages((prev) =>
      prev.map((lp) =>
        lp.id === id ? { ...lp, status: checked ? "Activo" : "Inactivo" } : lp
      )
    );
    // Guardar en localStorage
    const updated = landingPages.find((lp) => lp.id === id);
    if (updated) {
      await updateLandingPage({ ...updated, status: checked ? "Activo" : "Inactivo" });
    }
  };

  const handleTogglePublish = async (id: number, checked: boolean) => {
    setLandingPages((prev) =>
      prev.map((lp) => (lp.id === id ? { ...lp, publish: checked } : lp))
    );
    // Guardar en localStorage
    const updated = landingPages.find((lp) => lp.id === id);
    if (updated) {
      await updateLandingPage({ ...updated, publish: checked });
    }
  };

  const handleEdit = () => {
    if (selected.length === 1) {
      const id = selected[0];
      router.push(`/dashboard/landing_create/landingpage/${id}/edit`);
    }
  };

  return (
    <Box className="p-6 max-w-7xl mx-auto">
      <SectionHeader icon={<Home fontSize="medium" />} title="Landing Pages" />

      <Card sx={{ borderRadius: 4, boxShadow }}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            borderBottom: `1px solid ${
              theme.palette.mode === "dark" ? "#1e1b4b" : "#d1d5db"
            }`,
          }}
        >
          {selected.length === 1 && (
            <Tooltip title="Editar">
              <IconButton color="primary" size="large" onClick={handleEdit}>
                <Edit sx={{ fontSize: 28 }} />
              </IconButton>
            </Tooltip>
          )}
          {selected.length >= 1 && (
            <Tooltip title="Eliminar">
              <IconButton
                color="error"
                size="large"
                onClick={() => setIsConfirmOpen(true)}
              >
                <Delete sx={{ fontSize: 28 }} />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Crear Landing Page">
            <IconButton
              color="primary"
              size="large"
              onClick={() =>
                router.push("/dashboard/landing_create/landingpage/create")
              }
            >
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
                    indeterminate={
                      selected.length > 0 && selected.length < landingPages.length
                    }
                    checked={
                      landingPages.length > 0 &&
                      selected.length === landingPages.length
                    }
                    onChange={(e) =>
                      setSelected(
                        e.target.checked ? landingPages.map((lp) => lp.id) : []
                      )
                    }
                  />
                </TableCell>
                <TableCell>Preview</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Categoría</TableCell>
                <TableCell>Título</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell>UTM</TableCell>
                <TableCell>Fecha creación</TableCell>
                <TableCell>Fecha expiración</TableCell>
                <TableCell>Términos</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Publicado</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {landingPages.map((lp) => (
                <TableRow
                  key={lp.id}
                  hover
                  selected={isSelected(lp.id)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected(lp.id)}
                      onChange={() => toggleSelect(lp.id)}
                    />
                  </TableCell>

                  <TableCell>
                    <img
                      src={lp.imagen}
                      alt={lp.titulo}
                      style={{
                        width: 60,
                        height: 40,
                        objectFit: "contain",
                        borderRadius: 6,
                      }}
                    />
                  </TableCell>

                  <TableCell>{lp.id}</TableCell>
                  <TableCell>
                    {categorias.find((cat) => cat.id === lp.categoriaId)?.titulo ||
                      "Sin categoría"}
                  </TableCell>
                  <TableCell>{lp.titulo}</TableCell>
                  <TableCell>
                    <Typography
                      component="a"
                      href={`/landing/${lp.slug}`}
                      target="_blank"
                      sx={{
                        color: "primary.main",
                        textDecoration: "underline",
                      }}
                    >
                      {lp.slug}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    {lp.utmRules && lp.utmRules.length > 0 ? (
                      <Chip
                        label={`${lp.utmRules.length} reglas`}
                        color="primary"
                        size="small"
                      />
                    ) : (
                      <Chip label="N/A" size="small" />
                    )}
                  </TableCell>

                  <TableCell>
                    {lp.creationDate
                      ? new Date(lp.creationDate).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {lp.expirationDate
                      ? new Date(lp.expirationDate).toLocaleDateString()
                      : "-"}
                  </TableCell>

                  <TableCell>
                    {lp.termsUrl ? (
                      <Typography
                        component="a"
                        href={lp.termsUrl}
                        target="_blank"
                        sx={{
                          color: "primary.main",
                          textDecoration: "underline",
                        }}
                      >
                        Ver
                      </Typography>
                    ) : (
                      "-"
                    )}
                  </TableCell>

                  <TableCell>
                    <Switch
                      checked={lp.status === "Activo"}
                      onChange={(e) =>
                        handleToggleStatus(lp.id, e.target.checked)
                      }
                      color="success"
                    />
                  </TableCell>

                  <TableCell>
                    <Switch
                      checked={lp.publish}
                      onChange={(e) =>
                        handleTogglePublish(lp.id, e.target.checked)
                      }
                      color="primary"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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
    </Box>
  );
};

export default LandingPageTable;
