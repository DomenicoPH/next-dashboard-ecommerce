"use client";
import { Skeleton } from "./skeleton";

export default function FiltersSkeleton() {
  return (
    <div className="flex flex-col gap-4 w-full mb-6">
      <Skeleton className="h-12 w-full" />
      <div className="flex gap-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
};