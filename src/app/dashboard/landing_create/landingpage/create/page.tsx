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
  Grid,
  Select,
  MenuItem,
} from "@mui/material";
import { toast, Toaster } from "react-hot-toast";
import { ExpandMore, ExpandLess, Home, Delete } from "@mui/icons-material";
import SectionHeader from "@/components/ui/SectionHeader";

/*temp*/ import { addLandingPage, LandingPage, ContentField, FormField } from "@/app/lib/landingStore";

export default function LandingPageCreateForm() {
  const boxShadow = "0 8px 24px rgba(0,0,0,0.1)";

  // Secciones abiertas
  const [openDetails, setOpenDetails] = useState(true);
  const [openContent, setOpenContent] = useState(true);
  const [openForm, setOpenForm] = useState(true);
  const [openSEO, setOpenSEO] = useState(true);
  const [openTerms, setOpenTerms] = useState(true);

  // Estado principal
  const [title, setTitle] = useState("");
  const [subtitleTop, setSubtitleTop] = useState("Desde");
  const [price, setPrice] = useState("S/.100");
  const [subtitleBottom, setSubtitleBottom] = useState("por la compra de...");
  const [headerImage, setHeaderImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formFields, setFormFields] = useState<FormField[]>([
    { label: "Nombre completo", type: "text", required: true },
    { label: "Teléfono celular", type: "tel", required: true },
  ]);
  const [formButtonText, setFormButtonText] = useState("Enviar");

  const [contentFields, setContentFields] = useState<ContentField[]>([
    { label: "Texto superior", value: "", variant: "subtitle" },
    { label: "Precio", value: "", variant: "highlight" },
    { label: "Texto inferior", value: "", variant: "subtitle" },
  ]);

  const [termsUrl, setTermsUrl] = useState("");

  // SEO
  const [allowIndex, setAllowIndex] = useState(true);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [seoPreview, setSeoPreview] = useState<string | null>(null);
  const [expirationDate, setExpirationDate] = useState("");

  // Publicación
  const [publish, setPublish] = useState(false);

  // Handlers
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

  // Form
  const handleAddFormField = () => {
    setFormFields([...formFields, { label: "", type: "text", required: false }]);
  };

  const handleFormFieldChange = (
    index: number,
    key: "label" | "type" | "required",
    value: string | boolean
  ) => {
    const updated = [...formFields];
    (updated[index] as any)[key] = value;
    setFormFields(updated);
  };

  const handleRemoveFormField = (index: number) => {
    setFormFields(formFields.filter((_, i) => i !== index));
  };

  // Content
  const handleContentFieldChange = (
    index: number,
    key: keyof ContentField,
    value: string
  ) => {
    const updated = [...contentFields];
    updated[index] = {
      ...updated[index],
      [key]: key === "variant" ? (value as ContentField["variant"]) : value,
    };
    setContentFields(updated);
  };

  const handleAddContentField = () => {
    setContentFields([...contentFields, { label: "", value: "", variant: "subtitle" }]);
  };

  const handleRemoveContentField = (index: number) => {
    setContentFields(contentFields.filter((_, i) => i !== index));
  }

  // Submit
  const handleSubmit = () => {
    const nuevaLanding: LandingPage = {
      id: Date.now(),
      titulo: title,
      expirationDate,
      creationDate: new Date().toLocaleDateString("es-PE"),
      status: publish ? "Activo" : "Inactivo",
      imagen: headerImage ? URL.createObjectURL(headerImage) : "",
      publish,
      metaTitle,
      metaDescription,
      allowIndex,
      contentFields,
      formFields,
      formButtonText,
      termsUrl,
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
    <div className="p-5 max-w-6xl mx-auto">
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
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{ opacity: 0.5, paddingBottom: 4, fontStyle: "italic" }}
        >
          Vista previa
        </Typography>

        <Grid container spacing={4}>
          {/* Columna izquierda - Imagen */}
          <Grid size={{xs: 12, md: 6}}>
            {headerImage ? (
              <img
                src={URL.createObjectURL(headerImage)}
                alt="Landing"
                style={{
                  width: 450,
                  maxHeight: 450,
                  borderRadius: 24,
                  objectFit: "cover",
                }}
              />
            ) : (
              <Paper
                sx={{
                  width: 450,
                  maxHeight: 450,
                  height: 450,
                  borderRadius: 24,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "grey.100",
                }}
              >
                <Typography variant="body2" color="textSecondary">
                  Imagen de la landing
                </Typography>
              </Paper>
            )}
          </Grid>

          {/* Columna derecha - Contenido + Form */}
          <Grid size={{xs: 12, md: 6}}>
            <Typography variant="h3" color="primary" fontWeight={700} textAlign={"center"} gutterBottom>
              {title || "Título de la Landing"}
            </Typography>

            {contentFields.map((field, i) => (
              <Typography
                key={i}
                sx={{ textAlign: "center" }}
                variant={
                  field.variant === "title" ? "h4" :
                  field.variant === "highlight" ? "h3" :
                  "subtitle2"
                }
                color={
                  field.variant === "highlight" ? "primary" : 
                  field.variant === "title" ? "primary" : 
                  "textSecondary"}
                fontWeight={
                  field.variant === "highlight" ? 700 :
                  field.variant === "subtitle" ? 500 :
                  400
                }
                gutterBottom
              >
                {field.value || field.label}
              </Typography>
            ))}

            {/* Formulario (preview): usa placeholder = label definido por admin */}
            <Paper sx={{ p: 3, mt: 2, borderRadius: 2 }}>
              <Stack spacing={2}>
                {formFields.map((field, i) => (
                  <TextField
                    key={i}
                    placeholder={field.label || `Campo ${i + 1}`}
                    type={field.type}
                    required={field.required}
                    fullWidth
                    variant="outlined"
                  />
                ))}

                <Button variant="contained" color="primary">
                  {formButtonText}
                </Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {/* Meta info */}
        <Divider sx={{ my: 3 }} />
        <Typography variant="caption" color="textSecondary">
          <b>Slug:</b>{" "}
          tudominio.com/
          {metaTitle ? metaTitle.toLowerCase().replace(/\s+/g, "-") : "slug"}
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
                    maxHeight: 100,
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
          title="Contenido"
          action={renderCollapseButton(
            openContent,
            () => setOpenContent(!openContent)
          )}
        />
        <Collapse in={openContent}>
          <Divider />
          <Stack spacing={2} sx={{ p: 3 }}>
            {contentFields.map((field, i) => (
              <Stack key={i} direction="row" spacing={1} alignItems="flex-start">
                <TextField
                  label={field.label || `Campo ${i + 1}`}
                  value={field.value}
                  onChange={(e) => handleContentFieldChange(i, "value", e.target.value)}
                  fullWidth
                />
                <Select
                  value={field.variant}
                  onChange={(e) => handleContentFieldChange(i, "variant", e.target.value)}
                  sx={{ minWidth: 160 }}
                >
                  <MenuItem value="title">Título grande</MenuItem>
                  <MenuItem value="subtitle">Texto secundario</MenuItem>
                  <MenuItem value="highlight">Precio destacado</MenuItem>
                </Select>
                <IconButton onClick={() => handleRemoveContentField(i)}>
                  <Delete />
                </IconButton>
              </Stack>
            ))}

            <Button variant="outlined" onClick={handleAddContentField}>
              Agregar campo
            </Button>

          </Stack>
        </Collapse>
      </Card>

      {/* Formulario */}
      <Card sx={{ mb: 3, borderRadius: 4, boxShadow }}>
        <CardHeader
          title="Formulario"
          action={renderCollapseButton(
            openForm,
            () => setOpenForm(!openForm)
          )}
        />
        <Collapse in={openForm}>
          <Divider />
          <Stack spacing={2} sx={{ p: 3 }}>
            {formFields.map((field, i) => (
              <Stack
                key={i}
                direction="row"
                spacing={1}
                alignItems="flex-start"
              >
                {/* Etiqueta: placeholder */}
                <TextField
                  label="Etiqueta"
                  value={field.label}
                  onChange={(e) =>
                    handleFormFieldChange(i, "label", e.target.value)
                  }
                  sx={{ minWidth: 220 }}
                />

                {/* Tipo: tipo de input */}
                <Select
                  value={field.type}
                  onChange={(e) =>
                    handleFormFieldChange(i, "type", e.target.value as string)
                  }
                  displayEmpty
                  sx={{ minWidth: 160 }}
                >
                  <MenuItem value="text">Texto</MenuItem>
                  <MenuItem value="tel">Teléfono</MenuItem>
                  <MenuItem value="email">Correo electrónico</MenuItem>
                  <MenuItem value="number">Número</MenuItem>
                  <MenuItem value="password">Contraseña</MenuItem>
                </Select>

                <FormControlLabel
                  control={
                    <Switch
                      checked={field.required}
                      onChange={(e) =>
                        handleFormFieldChange(i, "required", e.target.checked)
                      }
                    />
                  }
                  label="Requerido"
                />
                <IconButton onClick={() => handleRemoveFormField(i)}>
                  <Delete />
                </IconButton>
              </Stack>
            ))}
            <Button variant="outlined" onClick={handleAddFormField}>
              Agregar campo
            </Button>
            <TextField
              label="Texto del botón"
              value={formButtonText}
              onChange={(e) => setFormButtonText(e.target.value)}
            />
          </Stack>
        </Collapse>
      </Card>

      {/* Términos y condiciones */}
      <Card sx={{ mb: 3, borderRadius: 4, boxShadow }}>
        <CardHeader
          title="Términos y Condiciones"
          action={renderCollapseButton(
            openTerms,
            () => setOpenTerms(!openTerms)
          )}
        />
        <Collapse in={openTerms}>
          <Divider />
          <Stack spacing={2} sx={{ p: 3 }}>
            <TextField
              label="Enlace al PDF de Términos y Condiciones"
              value={termsUrl}
              onChange={(e) => setTermsUrl(e.target.value)}
              placeholder="https://misarchivos.com/terminos.pdf"
              fullWidth
            />
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
            <TextField
              label="Meta título"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              helperText={`${metaTitle.length}/60 caracteres`}
              fullWidth
            />

            <TextField
              label="Meta descripción"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              helperText={`${metaDescription.length}/160 caracteres`}
              multiline
              rows={3}
              fullWidth
            />

            <Button variant="contained" component="label">
              Subir imagen para compartir
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleSeoImageUpload}
              />
            </Button>

            <FormControlLabel
              label="Permitir indexación en Google"
              control={
                <Switch
                  checked={allowIndex}
                  onChange={(e) => setAllowIndex(e.target.checked)}
                />
              }
            />

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

        <Button variant="contained" onClick={handleSubmit}>
          Crear Landing Page
        </Button>
      </Stack>
    </div>
  );
}
