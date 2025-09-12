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
} from "@mui/material";
import { IconButton as MuiIconButton } from "@mui/material";
import { motion } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";
import { ExpandMore, ExpandLess, Home, Delete } from "@mui/icons-material";
import SectionHeader from "@/components/ui/SectionHeader";

export default function LandingPageCreateForm() {

    const boxShadow = '0 8px 24px rgba(0,0,0,0.1)'

    const [openDetails, setOpenDetails] = useState(true);
    const [openContent, setOpenContent] = useState(true);
    const [openSEO, setOpenSEO] = useState(true);

    const [title, setTitle] = useState("");
    const [headerText, setHeaderText] = useState("");
    const [headerImage, setHeaderImage] = useState<File | null>(null);
      const fileInputRef = useRef<HTMLInputElement>(null);//temp
    const [sections, setSections] = useState([{ content: "" }]);
    const [publish, setPublish] = useState(false);
    const [metaTitle, setMetaTitle] = useState("");
    const [metaDescription, setMetaDescription] = useState("");

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
      if(fileInputRef.current) fileInputRef.current.value = "";
    }
    
    const handleRemoveSection = (index: number) => {
        setSections(sections.filter((_, i) => i !== index));
    }

    const handleSubmit = () => {
      // Aquí la llamada a la API..
      toast.success("Landing Page creada!");
      console.log({ title, headerText, headerImage, sections, publish, metaTitle, metaDescription });
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

          {/* Detalles */}
          <Card sx={{ mb: 3, borderRadius: 4, boxShadow }}>
              <CardHeader
                title="Detalles"
                action={renderCollapseButton(openDetails, () => setOpenDetails(!openDetails))}
              />
          <Collapse in={openDetails}>
              <Divider />
              <Stack spacing={2} sx={{ p: 3 }}>
                  <TextField
                    label="Título de la Landing Page"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="Texto de encabezado"
                    value={headerText}
                    onChange={e => setHeaderText(e.target.value)}
                    fullWidth
                  />

                  {/* Input de imagen */}
                  <Button
                    variant="contained"
                    component="label"  // importante
                  >
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
                          style={{ maxWidth: "100%", maxHeight: 300, borderRadius: 8 }}
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
            action={renderCollapseButton(openContent, () => setOpenContent(!openContent))}
          />
          <Collapse in={openContent}>
            <Divider />
            <Stack spacing={2} sx={{ p: 3 }}>
                
                {sections.map((section, i) => (
                  <Stack key={i} direction="row" spacing={1} alignItems="flex-start">
                    <TextField
                      label={`Sección ${i + 1}`}
                      value={section.content}
                      onChange={e => handleSectionChange(i, e.target.value)}
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

              <Button variant="outlined" onClick={handleAddSection}>Agregar sección</Button>
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
              <TextField label="Meta título" value={metaTitle} onChange={e => setMetaTitle(e.target.value)} fullWidth />
              <TextField label="Meta descripción" value={metaDescription} onChange={e => setMetaDescription(e.target.value)} multiline rows={3} fullWidth />
              <FormControlLabel
                label="Publicar"
                control={<Switch checked={publish} onChange={e => setPublish(e.target.checked)} />}
              />
            </Stack>
          </Collapse>
        </Card>

        {/* Acciones */}
        <Stack direction="row" justifyContent="flex-end" spacing={2}>
          <Button variant="contained" onClick={handleSubmit}>Crear Landing Page</Button>
        </Stack>
      </div>
    );
}   
