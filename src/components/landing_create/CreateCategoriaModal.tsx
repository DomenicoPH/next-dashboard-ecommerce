"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { Categoria } from "@/app/lib/categoriaStore";

interface CreateCategoriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newCategoria: Categoria) => void
}

const CreateCategoriaModal: React.FC<CreateCategoriaModalProps> = ({
  isOpen,
  onClose,
  onCreate
}) => {
  const [titulo, setTitulo] = useState("");
  const [activo, setActivo] = useState(true);

  // Limpiar formulario al cerrar
  useEffect(() => {
    if (!isOpen) {
      setTitulo("");
      setActivo(true);
    }
  }, [isOpen]);

  const handleCreate = () => {
    const newCategoria: Categoria = {
      id: Date.now(),
      titulo,
      fecha: new Date().toISOString().split("T")[0], // YYYY-MM-DD
      status: activo ? "Activo" : "Inactivo",
    };

    onCreate(newCategoria);
    onClose();
  };


  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose} 
      fullWidth 
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 4
          }
        }    
      }}
    >
      <DialogTitle sx={{textAlign: 'center'}}>Crear categoría</DialogTitle>
      <DialogContent dividers sx={{paddingX: '50px'}}>
        {/* Campo título */}
        <TextField
          label="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          fullWidth
          margin="normal"
        />

        {/* Switch activo/inactivo */}
        <FormControlLabel
          control={
            <Switch
              checked={activo}
              onChange={(e) => setActivo(e.target.checked)}
              color="primary"
            />
          }
          label={activo ? "Activo" : "Inactivo"}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={handleCreate}>
          Crear
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateCategoriaModal;
