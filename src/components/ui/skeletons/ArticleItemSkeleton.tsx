"use client";
import { Skeleton } from "./skeleton";
import { useTheme } from "@mui/material/styles";

export default function ArticleItemSkeleton() {
  const theme = useTheme();

  return (
    <div className={`p-4 rounded-lg shadow-sm flex items-center gap-4 ${theme.palette.mode === 'dark' ? 'bg-indigo-950' : 'bg-gray-300'}`}>
      <Skeleton className="h-16 w-16 rounded-md" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <Skeleton className="h-8 w-20" />
    </div>
  );
};