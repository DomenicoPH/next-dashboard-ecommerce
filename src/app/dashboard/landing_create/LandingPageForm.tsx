"use client";

import React, { useEffect, useRef, useState } from "react";
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
  Select,
  MenuItem,
} from "@mui/material";
import { toast } from "react-hot-toast";
import { ExpandMore, ExpandLess, Home, Delete } from "@mui/icons-material";
import SectionHeader from "@/components/ui/SectionHeader";
import { LandingPage, ContentField, FormField } from "@/app/lib/landingStore";
import { Categoria } from "@/app/lib/categoriaStore";

interface Props {
    initialData?: LandingPage | null;
    categorias: Categoria[];
    onSubmit: (lp: LandingPage) => Promise<void>;
    onSuccess?: () => void;
}

export default function LandingPageForm({
    initialData = null,
    categorias,
    onSubmit,
    onSuccess,
}: Props) {
    const boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Refs
    const detallesRef = useRef<HTMLDivElement>(null);
    const contenidoRef = useRef<HTMLDivElement>(null);
    const formularioRef = useRef<HTMLDivElement>(null);
    const termsRef = useRef<HTMLDivElement>(null);
    const seoRef = useRef<HTMLDivElement>(null);

    const scrollToRef = (ref: React.RefObject<HTMLDivElement | null>) => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

  // ----------------------
  // Estados principales
  // ----------------------
  const [title, setTitle] = useState(initialData?.titulo ?? "");
  const [headerImage, setHeaderImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(initialData?.imagen ?? "");

  const [formFields, setFormFields] = useState<FormField[]>(
    initialData?.formFields ?? [
      { label: "Nombre completo", type: "text", required: true },
      { label: "Teléfono celular", type: "tel", required: true },
    ]
  );
  const [formButtonText, setFormButtonText] = useState(
    initialData?.formButtonText ?? "Enviar"
  );

  const [contentFields, setContentFields] = useState<ContentField[]>(
    initialData?.contentFields ?? [
      { label: "Texto superior", value: "", variant: "subtitle" },
      { label: "Precio", value: "", variant: "highlight" },
      { label: "Texto inferior", value: "", variant: "subtitle" },
    ]
  );

  const [termsUrl, setTermsUrl] = useState(initialData?.termsUrl ?? "");
  const [allowIndex, setAllowIndex] = useState(initialData?.allowIndex ?? true);
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(
    initialData?.metaDescription ?? ""
  );
  const [expirationDate, setExpirationDate] = useState(
    initialData?.expirationDate ?? ""
  );
  const [publish, setPublish] = useState(initialData?.publish ?? false);
  const [categoriaId, setCategoriaId] = useState<number | null>(
    initialData?.categoriaId ?? null
  );

  // ----------------------
  // UI (colapsables)
  // ----------------------
  const [openDetails, setOpenDetails] = useState(true);
  const [openContent, setOpenContent] = useState(true);
  const [openForm, setOpenForm] = useState(true);
  const [openSEO, setOpenSEO] = useState(true);
  const [openTerms, setOpenTerms] = useState(true);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.titulo);
      setImagePreview(initialData.imagen ?? "");
      setFormFields(initialData.formFields ?? []);
      setFormButtonText(initialData.formButtonText ?? "Enviar");
      setContentFields(initialData.contentFields ?? []);
      setTermsUrl(initialData.termsUrl ?? "");
      setAllowIndex(initialData.allowIndex ?? true);
      setMetaTitle(initialData.metaTitle ?? "");
      setMetaDescription(initialData.metaDescription ?? "");
      setExpirationDate(initialData.expirationDate ?? "");
      setPublish(initialData.publish ?? false);
      setCategoriaId(initialData.categoriaId ?? null);
    }
  }, [initialData]);

  // ----------------------
  // Handlers
  // ----------------------
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHeaderImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setHeaderImage(null);
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAddFormField = () =>
    setFormFields([
      ...formFields,
      { label: "", type: "text", required: false },
    ]);

  const handleFormFieldChange = (
    index: number,
    key: "label" | "type" | "required",
    value: any
  ) => {
    const updated = [...formFields];
    (updated[index] as any)[key] = value;
    setFormFields(updated);
  };

  const handleRemoveFormField = (index: number) =>
    setFormFields((f) => f.filter((_, i) => i !== index));

  const handleContentFieldChange = (
    index: number,
    key: keyof ContentField,
    value: string
  ) => {
    const updated = [...contentFields];
    updated[index] = {
      ...updated[index],
      [key]:
        key === "variant" ? (value as ContentField["variant"]) : value,
    };
    setContentFields(updated);
  };

  const handleAddContentField = () =>
    setContentFields([
      ...contentFields,
      { label: "", value: "", variant: "subtitle" },
    ]);

  const handleRemoveContentField = (index: number) =>
    setContentFields((c) => c.filter((_, i) => i !== index));

  const handleSubmit = async () => {

    // validaciones básicas..
    if (!title.trim()) {
      toast.error("Debes ingresar un título");
      scrollToRef(detallesRef);
      return;
    }

    if (!expirationDate) {
      toast.error("Debes seleccionar una fecha de expiración");
      scrollToRef(detallesRef);
      return;
    }

    if (categoriaId === null) {
      toast.error("Debes seleccionar una categoría");
      scrollToRef(detallesRef);
      return;
    }

    if (!imagePreview) {
      toast.error("Debes subir una imagen para la landing");
      scrollToRef(detallesRef);
      return;
    }

    if (contentFields.some((c) => !c.value.trim())) {
      toast.error("Debes completar todos los campos de contenido");
      scrollToRef(contenidoRef);
      return;
    }

    if (formFields.some((f) => !f.label.trim())) {
      toast.error("Todos los campos del formulario deben tener etiqueta");
      scrollToRef(formularioRef);
      return;
    }

    if (!metaTitle.trim() || !metaDescription.trim()) {
      toast.error("Debes completar los campos SEO");
      scrollToRef(seoRef);
      return;
    }

    const now = new Date().toISOString();
    const lp: LandingPage = {
      id: initialData?.id ?? Date.now(),
      titulo: title,
      expirationDate,
      creationDate: initialData?.creationDate ?? now,
      status: publish ? "Activo" : "Inactivo",
      imagen: imagePreview || "",
      publish,
      termsUrl,
      metaTitle,
      metaDescription,
      allowIndex,
      contentFields,
      formFields,
      formButtonText,
      categoriaId,
    };

    try {
      await onSubmit(lp);
      toast.success(initialData ? "Landing actualizada" : "Landing creada");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar la landing");
    }
  };

  const renderCollapseButton = (isOpen: boolean, toggle: () => void) => (
    <IconButton onClick={toggle}>
      {isOpen ? <ExpandLess /> : <ExpandMore />}
    </IconButton>
  );

  // ----------------------
  // Render
  // ----------------------
  return (
    <div className="p-5 max-w-6xl mx-auto">
      <SectionHeader
        icon={<Home fontSize="medium" />}
        title={initialData ? "Editar Landing Page" : "Creación de Landing Page"}
      />

      {/* Vista previa */}
      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 4 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ opacity: 0.5, paddingBottom: 4, fontStyle: "italic" }}
        >
          Vista previa
        </Typography>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {imagePreview ? (
              <img
                src={imagePreview}
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
          </div>
          <div>
            <Typography
              variant="h3"
              color="primary"
              fontWeight={700}
              textAlign={"center"}
              gutterBottom
            >
              {title || "Título de la Landing"}
            </Typography>

            {contentFields.map((field, i) => (
              <Typography
                key={i}
                sx={{ textAlign: "center" }}
                variant={
                  field.variant === "title"
                    ? "h4"
                    : field.variant === "highlight"
                    ? "h3"
                    : "subtitle2"
                }
                gutterBottom
              >
                {field.value || field.label}
              </Typography>
            ))}

            <Paper sx={{ p: 3, mt: 2, borderRadius: 2 }}>
              <Stack spacing={2}>
                {formFields.map((field, i) => (
                  <TextField
                    key={i}
                    placeholder={field.label || `Campo ${i + 1}`}
                    type={field.type}
                    required={field.required}
                    fullWidth
                  />
                ))}
                <Button variant="contained">{formButtonText}</Button>
              </Stack>
            </Paper>
          </div>
        </div>
      </Paper>

      {/* ---- Detalles ---- */}
      <Card id='detalles' ref={detallesRef} sx={{ mb: 3, borderRadius: 4, boxShadow }}>
        <CardHeader
          title="Detalles"
          action={renderCollapseButton(openDetails, () =>
            setOpenDetails(!openDetails)
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
            <Select
              value={categoriaId ?? ""}
              onChange={(e) => setCategoriaId(Number(e.target.value))}
              displayEmpty
              fullWidth
            >
              <MenuItem value="">Seleccione una categoría</MenuItem>
              {categorias.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.titulo}
                </MenuItem>
              ))}
            </Select>

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
            {imagePreview && (
              <div>
                <Typography variant="body2">Vista previa:</Typography>
                <img
                  src={imagePreview}
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

      {/* ---- Contenido ---- */}
      <Card id='contenido' ref={contenidoRef} sx={{ mb: 3, borderRadius: 4, boxShadow }}>
        <CardHeader
          title="Contenido"
          action={renderCollapseButton(openContent, () =>
            setOpenContent(!openContent)
          )}
        />
        <Collapse in={openContent}>
          <Divider />
          <Stack spacing={2} sx={{ p: 3 }}>
            {contentFields.map((field, i) => (
              <Stack
                key={i}
                direction="row"
                spacing={1}
                alignItems="flex-start"
              >
                <TextField
                  label={field.label || `Campo ${i + 1}`}
                  value={field.value}
                  onChange={(e) =>
                    handleContentFieldChange(i, "value", e.target.value)
                  }
                  fullWidth
                />
                <Select
                  value={field.variant}
                  onChange={(e) =>
                    handleContentFieldChange(i, "variant", e.target.value)
                  }
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

      {/* ---- Formulario ---- */}
      <Card id='formulario' ref={formularioRef} sx={{ mb: 3, borderRadius: 4, boxShadow }}>
        <CardHeader
          title="Formulario"
          action={renderCollapseButton(openForm, () =>
            setOpenForm(!openForm)
          )}
        />
        <Collapse in={openForm}>
          <Divider />
          <Stack spacing={2} sx={{ p: 3 }}>
            {formFields.map((field, i) => (
              <Stack key={i} direction="row" spacing={1} alignItems="flex-start">
                <TextField
                  label="Etiqueta"
                  value={field.label}
                  onChange={(e) =>
                    handleFormFieldChange(i, "label", e.target.value)
                  }
                  sx={{ minWidth: 220 }}
                />
                <Select
                  value={field.type}
                  onChange={(e) =>
                    handleFormFieldChange(i, "type", e.target.value as string)
                  }
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

      {/* ---- Términos ---- */}
      <Card id='terms' ref={termsRef} sx={{ mb: 3, borderRadius: 4, boxShadow }}>
        <CardHeader
          title="Términos y Condiciones"
          action={renderCollapseButton(openTerms, () =>
            setOpenTerms(!openTerms)
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

      {/* ---- SEO ---- */}
      <Card id='seo' ref={seoRef} sx={{ mb: 3, borderRadius: 4, boxShadow }}>
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
            <FormControlLabel
              label="Permitir indexación en Google"
              control={
                <Switch
                  checked={allowIndex}
                  onChange={(e) => setAllowIndex(e.target.checked)}
                />
              }
            />
          </Stack>
        </Collapse>
      </Card>

      {/* ---- Acciones ---- */}
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
          {initialData ? "Guardar cambios" : "Crear Landing Page"}
        </Button>
      </Stack>
    </div>
  );
}
