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

interface EditCategoriaModalProps {
  isOpen: boolean;
  categoria: Categoria | null;
  onClose: () => void;
  onSave: (updatedCategoria: Categoria) => void;
}

const EditCategoriaModal: React.FC<EditCategoriaModalProps> = ({
  isOpen,
  categoria,
  onClose,
  onSave,
}) => {
  const [titulo, setTitulo] = useState("");
  const [activo, setActivo] = useState(true);

  useEffect(() => {
    if (categoria) {
      setTitulo(categoria.titulo);
      setActivo(categoria.status === "Activo");
    }
  }, [categoria]);

  const handleSave = () => {
    if (!categoria) return;

    const newStatus: Categoria["status"] = activo ? "Activo" : "Inactivo";

    const updated: Categoria = {
      ...categoria,
      titulo,
      status: newStatus,
    };

    onSave(updated);
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
      <DialogTitle sx={{ textAlign: "center" }}>
        Editar categoría
      </DialogTitle>
      <DialogContent dividers>
        <TextField
          label="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          fullWidth
          margin="normal"
        />

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
      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button variant="outlined" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCategoriaModal;
