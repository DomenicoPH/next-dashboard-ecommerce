"use client";
import React from "react";
import SectionHeaderSkeleton from "../ui/skeletons/SectionHeaderSkeleton";
import FiltersSkeleton from "../ui/skeletons/FiltersSkeleton";
import ArticleItemSkeleton from "../ui/skeletons/ArticleItemSkeleton";
import PaginationSkeleton from "../ui/skeletons/PaginationSkeleton";
import { useTheme } from "@mui/material/styles";

export default function AdminArticlesSkeleton() {
  const theme = useTheme();
  return (
    <div className="px-4 md:px-6 py-6 w-full">
      {/* Header */}
      <SectionHeaderSkeleton />

      {/* Filtros */}
      <div className="mb-6">
        <FiltersSkeleton />
      </div>

      {/* Bloques productos / servicios */}
      <div className="flex flex-col lg:flex-row w-full gap-6 mt-8">
        {/* Productos */}
        <div className="flex flex-col w-full lg:w-1/2">
          <div className={`h-7 w-32 rounded mb-4 ${theme.palette.mode === 'dark' ? 'bg-indigo-950' : 'bg-gray-300'}`} />
          <div className="mt-4 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <ArticleItemSkeleton key={`prod-${i}`} />
            ))}
          </div>
        </div>

        {/* Servicios */}
        <div className="flex flex-col w-full lg:w-1/2">
          <div className={`h-7 w-32 rounded mb-4 ${theme.palette.mode === 'dark' ? 'bg-indigo-950' : 'bg-gray-300'}`} />
          <div className="mt-4 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <ArticleItemSkeleton key={`serv-${i}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Paginación */}
      <div className="mt-8">
        <PaginationSkeleton />
      </div>
    </div>
  );
}
