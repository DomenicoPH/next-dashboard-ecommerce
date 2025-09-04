"use client";
import { Skeleton } from "./skeleton";

export default function AdsFiltersSkeleton() {
  return (
    <div className="flex gap-3">
      <Skeleton className="h-10 w-24 rounded-full" />
      <Skeleton className="h-10 w-24 rounded-full" />
      <Skeleton className="h-10 w-24 rounded-full" />
    </div>
  );
};