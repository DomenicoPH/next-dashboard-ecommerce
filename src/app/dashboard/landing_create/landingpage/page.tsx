"use client";
import React, { useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { AddCircle, Home, Delete, Edit } from "@mui/icons-material";
import {
  Card,
  CardHeader,
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
  Divider,
  Switch
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

/*temp*/import { getLandingPages, LandingPage } from "@/app/lib/landingStore";

const LandingPageTable: React.FC = () => {

  const boxShadow = '0 8px 24px rgba(0,0,0,0.1)'

  const router = useRouter();
  const theme = useTheme();
  const [selected, setSelected] = useState<number[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  /*temp*/const [landingPages, setLandingPages] = useState(getLandingPages());

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

  const handleToggleStatus = (id: number, checked: boolean) => {
    setLandingPages((prev) => prev.map((lp) => lp.id === id ? { ...lp, status: checked ? "Activo" : "Inactivo" } : lp ))
  }

  React.useEffect(() => {
    setLandingPages(getLandingPages());
  }, []);

  return (
    <Box className="p-6 max-w-6xl mx-auto">
      {/* Encabezado */}
      <SectionHeader
        icon={<Home fontSize="medium" />}
        title="Landing Pages"
      />

      {/* Card principal */}
      <Card sx={{ borderRadius: 4, boxShadow }}>
        {/* Barra de acciones */}
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
              <IconButton
                color="primary"
                size="large"
                onClick={() => console.log("Editar")}
              >
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

        {/* Contenido tabla */}
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selected.length > 0 &&
                      selected.length < landingPages.length
                    }
                    checked={selected.length === landingPages.length}
                    onChange={(e) =>
                      setSelected(
                        e.target.checked
                          ? landingPages.map((lp) => lp.id)
                          : []
                      )
                    }
                  />
                </TableCell>
                <TableCell>Imagen</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Categoría</TableCell>
                <TableCell>Título</TableCell>
                <TableCell>Fecha creación</TableCell>
                <TableCell>Fecha expiración</TableCell>
                <TableCell>Términos</TableCell>
                <TableCell>Imagen</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {landingPages.map((lp) => (
                <TableRow
                  key={lp.id}
                  hover
                  selected={isSelected(lp.id)}
                  sx={{
                    cursor: "pointer",
                  }}
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
                  {/* <TableCell>{lp.categoria}</TableCell> */}
                  <TableCell>{lp.titulo}</TableCell>
                  <TableCell>{lp.creationDate}</TableCell>
                  <TableCell>{lp.expirationDate}</TableCell>
                  <TableCell>
                    <Typography
                      component="a"
                      href={lp.termsUrl}
                      target="_blank"
                      sx={{
                        color: "primary.main",
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                    >
                      Ver
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      component="a"
                      href={lp.imagen}
                      target="_blank"
                      sx={{
                        color: "primary.main",
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                    >
                      Ver
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Switch
                      checked={lp.status === "Activo"}
                      onChange={(e) => handleToggleStatus(lp.id, e.target.checked)}
                      color="primary"
                    />
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Confirmación de eliminación */}
      <ConfirmDialog
        open={isConfirmOpen}
        title="¿Eliminar Landing Pages?"
        message={
          selectedLandingPages.length === 1 ? (
            `¿Estás seguro de que deseas eliminar la landing page '${selectedLandingPages[0].titulo}'?`
          ) : (
            <div>
              <p>
                ¿Estás seguro de que deseas eliminar estas landing pages?
              </p>
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
