"use client";
import React from "react";
import { Dialog, DialogContent, DialogActions, Button } from "@mui/material";
import VistaCarruselPreview from "@/components/ads/CarrouselPreview";

interface PreviewAdModalProps {
  imgUrl: string;
  category: string;
  onClose: () => void;
}

const PreviewAdModal: React.FC<PreviewAdModalProps> = ({
  imgUrl,
  category,
  onClose,
}) => {
  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="md">
      <DialogContent>
        <VistaCarruselPreview imgUrl={imgUrl} categoryName={category} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="primary">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PreviewAdModal;
