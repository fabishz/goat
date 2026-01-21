"use client";
import { cn } from '@/lib/utils';

interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div className={cn('card-elevated rounded-xl overflow-hidden border border-border/50', className)}>
      {/* Image Skeleton */}
      <div className="h-48 animate-shimmer" />
      
      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        <div className="h-4 w-24 animate-shimmer rounded" />
        <div className="h-6 w-3/4 animate-shimmer rounded" />
        <div className="h-4 w-1/2 animate-shimmer rounded" />
        <div className="flex gap-4">
          <div className="h-4 w-16 animate-shimmer rounded" />
          <div className="h-4 w-16 animate-shimmer rounded" />
        </div>
        <div className="flex gap-2 pt-2">
          <div className="h-9 flex-1 animate-shimmer rounded" />
          <div className="h-9 w-9 animate-shimmer rounded" />
        </div>
      </div>
    </div>
  );
}
