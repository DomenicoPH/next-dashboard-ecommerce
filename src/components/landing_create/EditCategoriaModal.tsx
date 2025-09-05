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

interface Categoria {
  id: number;
  titulo: string;
  fecha: string;
  status: string;
}

interface EditCategoriaModalProps {
  isOpen: boolean;
  categoria: Categoria | null;   // la categoría a editar
  onClose: () => void;
  onSave: (updatedCategoria: Categoria) => void; // callback al guardar
}

const EditCategoriaModal: React.FC<EditCategoriaModalProps> = ({
  isOpen,
  categoria,
  onClose,
  onSave,
}) => {
  const [titulo, setTitulo] = useState("");
  const [activo, setActivo] = useState(true);

  // Inicializar valores cuando cambia la categoría
  useEffect(() => {
    if (categoria) {
      setTitulo(categoria.titulo);
      setActivo(categoria.status === "Activo");
    }
  }, [categoria]);

  const handleSave = () => {
    if (!categoria) return;
    const updated = {
      ...categoria,
      titulo,
      status: activo ? "Activo" : "Inactivo",
    };
    onSave(updated);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
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
