"use client";
import { Skeleton } from "./skeleton";
import { useTheme } from "@mui/material/styles";

export default function AdsListSkeleton({ items = 8 }: { items?: number }) {
  const theme = useTheme();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
      {Array.from({ length: items }).map((_, i) => (
        <div
          key={i}
          className={`rounded-lg overflow-hidden shadow-sm p-2 ${
            theme.palette.mode === "dark" ? "bg-indigo-950" : "bg-gray-300"
          }`}
        >
          {/* Imagen cuadrada */}
          <div className="relative w-full pt-[100%]">
            <Skeleton className="absolute top-0 left-0 h-full w-full rounded-md" />
          </div>

          {/* Contenido */}
          <div className="p-3 space-y-3">
            <Skeleton className="h-4 w-2/3" /> {/* categoría */}
            <Skeleton className="h-6 w-1/2" /> {/* switch */}
            <div className="flex justify-end gap-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};