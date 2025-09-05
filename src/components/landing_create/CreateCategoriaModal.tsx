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

interface CreateCategoriaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateCategoriaModal: React.FC<CreateCategoriaModalProps> = ({
  isOpen,
  onClose,
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
    // hacer POST request aqui...
    console.log("Nueva categoría:", { titulo, status: activo ? "Activo" : "Inactivo" });
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
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
