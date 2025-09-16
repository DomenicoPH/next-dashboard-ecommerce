"use client";

import React, { useState, useRef } from "react";
import {
  Card,
  CardHeader,
  Collapse,
  Divider,
  Stack,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  IconButton,
  Typography,
  Paper,
} from "@mui/material";
import { toast, Toaster } from "react-hot-toast";
import { ExpandMore, ExpandLess, Home, Delete } from "@mui/icons-material";
import SectionHeader from "@/components/ui/SectionHeader";

/*temp*/ import { addLandingPage } from "@/app/lib/landingStore";

export default function LandingPageCreateForm() {
  const boxShadow = "0 8px 24px rgba(0,0,0,0.1)";

  const [openDetails, setOpenDetails] = useState(true);
  const [openContent, setOpenContent] = useState(true);
  const [openSEO, setOpenSEO] = useState(true);

  const [title, setTitle] = useState("");
  const [headerText, setHeaderText] = useState("");
  const [headerImage, setHeaderImage] = useState<File | null>(null);
  /*temp*/ const fileInputRef = useRef<HTMLInputElement>(null);
  const [sections, setSections] = useState([{ content: "" }]);
  const [publish, setPublish] = useState(false);
  const [allowIndex, setAllowIndex] = useState(true);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [seoPreview, setSeoPreview] = useState<string | null>(null);
  const [expirationDate, setExpirationDate] = useState("");

  // handlers
  const handleAddSection = () => setSections([...sections, { content: "" }]);

  const handleSectionChange = (index: number, value: string) => {
    const newSections = [...sections];
    newSections[index].content = value;
    setSections(newSections);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setHeaderImage(e.target.files[0]);
  };

  const handleRemoveImage = () => {
    setHeaderImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSeoImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSeoPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const nuevaLanding = {
      id: Date.now(),
      categoria: "General",
      titulo: title,
      fechaCreacion: new Date().toLocaleDateString(),
      fechaExpiracion: expirationDate || "—",
      terminos: "/terminos/demo",
      imagen: headerImage ? URL.createObjectURL(headerImage) : "",
      status: publish ? "Activo" : "Inactivo",
    };

    addLandingPage(nuevaLanding);

    toast.success("Landing Page creada!");
  };

  const renderCollapseButton = (isOpen: boolean, toggle: () => void) => (
    <IconButton onClick={toggle}>
      {isOpen ? <ExpandLess /> : <ExpandMore />}
    </IconButton>
  );

  return (
    <div className="p-5 max-w-4xl mx-auto">
      {/* Encabezado */}
      <SectionHeader
        icon={<Home fontSize="medium" />}
        title="Creación de Landing Page"
      />

      <Toaster position="top-center" />

      {/* Vista previa en tiempo real */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 4,
          backgroundColor: "primary",
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ opacity: 0.5, paddingBottom: 4, fontStyle: "italic" }}>
          Vista previa
        </Typography>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          {headerImage && (
            <img
              src={URL.createObjectURL(headerImage)}
              alt="Header"
              style={{ maxWidth: "100%", borderRadius: 8, marginBottom: 16 }}
            />
          )}
          <Typography variant="h4" gutterBottom>
            {title || "Título de la Landing"}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {headerText || "Texto introductorio de la landing..."}
          </Typography>
        </div>

        {/* Secciones dinámicas */}
        <Stack spacing={3} sx={{ mt: 3 }}>
          {sections.map((s, i) => (
            <Paper
              key={i}
              sx={{ p: 2, borderRadius: 3, backgroundColor: "background.paper" }}
            >
              <Typography variant="body1">
                {s.content || `Sección ${i + 1} (vacía)`}
              </Typography>
            </Paper>
          ))}
        </Stack>

        {/* Meta info */}
        <Divider sx={{ my: 3 }} />
        <Typography variant="caption" color="textSecondary">
          <b>Slug:</b>{" "}
          tudominio.com/
          {metaTitle
            ? metaTitle.toLowerCase().replace(/\s+/g, "-")
            : "slug"}
        </Typography>
        <br />
        <Typography variant="caption" color="textSecondary">
          <b>Meta título:</b> {metaTitle || "Sin título"}
        </Typography>
        <br />
        <Typography variant="caption" color="textSecondary">
          <b>Meta descripción:</b> {metaDescription || "Sin descripción"}
        </Typography>
      </Paper>

      {/* Detalles */}
      <Card sx={{ mb: 3, borderRadius: 4, boxShadow }}>
        <CardHeader
          title="Detalles"
          action={renderCollapseButton(
            openDetails,
            () => setOpenDetails(!openDetails)
          )}
        />
        <Collapse in={openDetails}>
          <Divider />
          <Stack spacing={2} sx={{ p: 3 }}>
            <TextField
              label="Título de la Landing Page"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
            />
            <TextField
              label="Texto de encabezado"
              value={headerText}
              onChange={(e) => setHeaderText(e.target.value)}
              fullWidth
            />
            <TextField
              label="Fecha de expiración"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              fullWidth
            />

            {/* Input de imagen */}
            <Button variant="contained" component="label">
              Subir imagen
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageUpload}
                ref={fileInputRef}
              />
            </Button>

            {/* Preview de imagen */}
            {headerImage && (
              <div className="mt-2">
                <Typography variant="body2">Vista previa:</Typography>
                <img
                  src={URL.createObjectURL(headerImage)}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: 300,
                    borderRadius: 8,
                  }}
                />
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  sx={{ mt: 1 }}
                  onClick={handleRemoveImage}
                >
                  Quitar imagen
                </Button>
              </div>
            )}
          </Stack>
        </Collapse>
      </Card>

      {/* Contenido */}
      <Card sx={{ mb: 3, borderRadius: 4, boxShadow }}>
        <CardHeader
          title="Secciones"
          action={renderCollapseButton(
            openContent,
            () => setOpenContent(!openContent)
          )}
        />
        <Collapse in={openContent}>
          <Divider />
          <Stack spacing={2} sx={{ p: 3 }}>
            {sections.map((section, i) => (
              <Stack
                key={i}
                direction="row"
                spacing={1}
                alignItems="flex-start"
              >
                <TextField
                  label={`Sección ${i + 1}`}
                  value={section.content}
                  onChange={(e) => handleSectionChange(i, e.target.value)}
                  multiline
                  rows={4}
                  fullWidth
                />
                <IconButton
                  onClick={() => handleRemoveSection(i)}
                  sx={{
                    mt: 1,
                    color: "primary.main",
                    transition: "color 0.2s ease",
                    "&:hover": {
                      color: "error.main",
                    },
                  }}
                >
                  <Delete />
                </IconButton>
              </Stack>
            ))}

            <Button variant="outlined" onClick={handleAddSection}>
              Agregar sección
            </Button>
          </Stack>
        </Collapse>
      </Card>

      {/* SEO / Meta */}
      <Card sx={{ mb: 3, borderRadius: 4, boxShadow }}>
        <CardHeader
          title="SEO / Meta"
          action={renderCollapseButton(openSEO, () => setOpenSEO(!openSEO))}
        />
        <Collapse in={openSEO}>
          <Divider />
          <Stack spacing={2} sx={{ p: 3 }}>
            {/* Slug */}
            <TextField
              label="Slug (URL personalizada)"
              placeholder="zapatos-artesanales"
              fullWidth
            />

            {/* Meta Title */}
            <TextField
              label="Meta título"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              helperText={`${metaTitle.length}/60 caracteres`}
              fullWidth
            />

            {/* Meta Description */}
            <TextField
              label="Meta descripción"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              helperText={`${metaDescription.length}/160 caracteres`}
              multiline
              rows={3}
              fullWidth
            />

            {/* Imagen para redes sociales */}
            <Button variant="contained" component="label">
              Subir imagen para compartir
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleSeoImageUpload}
              />
            </Button>

            {/* Switch o Select para robots */}
            <FormControlLabel
              label="Permitir indexación en Google"
              control={
                <Switch
                  checked={allowIndex}
                  onChange={(e) => setAllowIndex(e.target.checked)}
                />
              }
            />

            {/* Opcional: vista previa */}
            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 12,
                maxWidth: 500,
              }}
            >
              <Typography variant="subtitle2" color="textSecondary">
                Vista previa (Google / redes)
              </Typography>

              {seoPreview && (
                <img
                  src={seoPreview}
                  alt="SEO Preview"
                  style={{
                    width: "100%",
                    maxHeight: 200,
                    objectFit: "cover",
                    borderRadius: 6,
                    marginBottom: 8,
                  }}
                />
              )}

              <Typography variant="h6">
                {metaTitle || "Título de ejemplo"}
              </Typography>
              <Typography variant="body2">
                {metaDescription || "Descripción de ejemplo..."}
              </Typography>
              <Typography variant="caption" color="primary">
                tudominio.com/slug
              </Typography>
            </div>
          </Stack>
        </Collapse>
      </Card>

      {/* Acciones */}
      <Stack
        direction="row"
        justifyContent="flex-end"
        spacing={2}
        alignItems="center"
        sx={{ mt: 2 }}
      >
        {/* Switch Publicar */}
        <FormControlLabel
          control={
            <Switch
              checked={publish}
              onChange={(e) => setPublish(e.target.checked)}
              color="primary"
            />
          }
          label="Publicar"
        />

        {/* Botón principal */}
        <Button variant="contained" onClick={handleSubmit}>
          Crear Landing Page
        </Button>
      </Stack>
    </div>
  );
}
