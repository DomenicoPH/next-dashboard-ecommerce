"use client";
import { Skeleton } from "./skeleton";

export default function SectionHeaderSkeleton() {
  return (
    <div className="flex items-center gap-3 mb-6">
      <Skeleton className="h-10 w-10 rounded-full" />
      <Skeleton className="h-6 w-40" />
    </div>
  );
};