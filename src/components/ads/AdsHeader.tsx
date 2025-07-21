"use client";
import React from "react";
import CampaignIcon from '@mui/icons-material/Campaign';

const AdsHeader = () => {
  return (
    <div className="text-center mb-12">
      
      <div className="flex justify-center mb-4">
        <CampaignIcon fontSize="large" />
        <h1 className="text-4xl font-bold ml-2">Gestión de Anuncios</h1>
      </div>
      
      <p className="text-sm mt-2">
        Crea y administra anuncios para tu plataforma de forma fácil y rápida
      </p>

    </div>
  );
};

export default AdsHeader;
