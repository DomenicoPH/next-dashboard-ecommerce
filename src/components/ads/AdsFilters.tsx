"use client";
import React from "react";
import { TextField, MenuItem } from "@mui/material";

interface AdsFiltersProps {
  adsFilter: "all" | "active" | "inactive";
  onFilterChange: (value: "all" | "active" | "inactive") => void;
}

const AdsFilters: React.FC<AdsFiltersProps> = ({ adsFilter, onFilterChange }) => {
  return (
    <div className="flex justify-end items-center">
      <TextField
        select
        size="small"
        label="Filtrar Anuncios"
        sx={{ minWidth: 200 }}
        value={adsFilter}
        onChange={(e) => onFilterChange(e.target.value as "all" | "active" | "inactive")}
      >
        <MenuItem value="all">Todos</MenuItem>
        <MenuItem value="active">Activos</MenuItem>
        <MenuItem value="inactive">Inactivos</MenuItem>
      </TextField>
    </div>
  );
};

export default AdsFilters;
