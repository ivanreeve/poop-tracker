import React from 'react';

export const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`animate-pulse rounded-md bg-gray-200 ${className || ''}`}
    {...props}
  />
);

export const StatCardSkeleton = () => (
  <div className="bg-white rounded-2xl p-3 sm:p-4 md:p-5 border-2 border-gray-100 shadow-sm flex items-center gap-3 sm:gap-4">
    <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-6 w-16 sm:w-20 rounded" />
      <Skeleton className="h-3 w-24 sm:w-32 rounded" />
    </div>
  </div>
);

export const LogCardSkeleton = () => (
  <div className="bg-white p-3 sm:p-4 rounded-2xl border-2 border-gray-100 flex flex-col items-center text-center gap-2">
    <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl" />
    <Skeleton className="h-4 w-16 sm:w-20 rounded" />
    <Skeleton className="h-3 w-12 sm:w-16 rounded" />
    <Skeleton className="h-3 w-10 sm:w-12 rounded" />
  </div>
);

export const FriendCardSkeleton = () => (
  <div className="flex items-center gap-3 bg-[#F7FAFA] border-2 border-[#E8F4F3] rounded-2xl p-3">
    <Skeleton className="h-10 w-10 rounded-xl" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-32 rounded" />
      <Skeleton className="h-3 w-40 rounded" />
    </div>
  </div>
);

export const BarChartSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-4 w-12 rounded" />
          </div>
          <Skeleton className="h-3 sm:h-4 w-full rounded-full" />
        </div>
      </div>
    ))}
  </div>
);

export const SectionHeaderSkeleton = () => (
  <div className="space-y-2">
    <Skeleton className="h-8 w-48 rounded" />
    <Skeleton className="h-4 w-32 rounded" />
  </div>
);

export const InsightCardSkeleton = () => (
  <div className="bg-white/70 rounded-2xl p-3 sm:p-4 border border-white/50">
    <div className="flex items-center gap-2 sm:gap-3">
      <Skeleton className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-40 sm:w-48 rounded" />
        <Skeleton className="h-3 w-52 sm:w-60 rounded" />
      </div>
    </div>
  </div>
);
