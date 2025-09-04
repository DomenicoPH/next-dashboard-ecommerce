"use client";

import SectionHeaderSkeleton from "../ui/skeletons/SectionHeaderSkeleton";
import AdsFiltersSkeleton from "../ui/skeletons/AdsFiltersSkeleton";
import AdsListSkeleton from "../ui/skeletons/AdsListSkeleton";
import PaginationSkeleton from "../ui/skeletons/PaginationSkeleton";
import PrimaryButtonSkeleton from "../ui/skeletons/PrimaryButtonSkeleton";
import { Box } from "@mui/material";

export default function AdsPageSkeleton() {
  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 4, width: "100%" }}>
      {/* Header */}
      <SectionHeaderSkeleton />

      {/* Barra de acciones */}
      <div className="flex justify-between items-center mb-6">
        <AdsFiltersSkeleton />
        <PrimaryButtonSkeleton />
      </div>

      {/* Listado de anuncios */}
      <AdsListSkeleton items={8} />

      {/* Paginación */}
      <div className="mt-8">
        <PaginationSkeleton />
      </div>
    </Box>
  );
}
