"use client";
import { Skeleton } from "./skeleton";
import { useTheme } from "@mui/material/styles";

export default function CustomersTableSkeleton({ rows = 5 }: { rows?: number }) {
  const theme = useTheme();

  return (
    <div
      className={`rounded-lg overflow-hidden shadow-sm mt-4 ${
        theme.palette.mode === "dark" ? "bg-indigo-950" : "bg-gray-300"
      }`}
    >
      {/* Header */}
      <div className="grid grid-cols-6 gap-4 p-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-12 justify-self-center" />
      </div>

      {/* Body */}
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-6 gap-4 p-4"
        >
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full justify-self-center" />
        </div>
      ))}
    </div>
  );
}
