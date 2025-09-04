"use client";
import { Skeleton } from "./skeleton";

export default function PaginationSkeleton() {
  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      <Skeleton className="h-8 w-8 rounded" />
      <Skeleton className="h-8 w-8 rounded" />
      <Skeleton className="h-8 w-8 rounded" />
      <Skeleton className="h-8 w-8 rounded" />
    </div>
  );
};