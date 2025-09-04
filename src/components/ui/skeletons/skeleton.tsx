"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@mui/material/styles";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    
    const theme = useTheme();
    
    return (
      <div
        className={cn(
            "animate-pulse rounded-md", 
            theme.palette.mode === 'dark' ? 'bg-indigo-900' : 'bg-gray-200',
            className
        )}
        {...props}
      />
    );
}

export { Skeleton };