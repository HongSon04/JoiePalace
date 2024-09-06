"use client";

import { Skeleton } from "@nextui-org/react";

function TableSkeleton() {
  return (
    <>
      <div className="flex flex-col w-full mt-8 border-gray-400 border-opacity-15 border p-3 gap-3 rounded-lg overflow-hidden">
        <div className="w-full flex gap-2">
          <Skeleton className="w-full rounded-md h-[40px] opacity-40" />
          <Skeleton className="w-full rounded-md h-[40px] opacity-40" />
          <Skeleton className="w-full rounded-md h-[40px] opacity-40" />
          <Skeleton className="w-full rounded-md h-[40px] opacity-40" />
          <Skeleton className="w-full rounded-md h-[40px] opacity-40" />
          <Skeleton className="w-full rounded-md h-[40px] opacity-40" />
        </div>
        <div className="w-full flex gap-2">
          <Skeleton className="w-full rounded-md h-[40px] opacity-40" />
          <Skeleton className="w-full rounded-md h-[40px] opacity-40" />
          <Skeleton className="w-full rounded-md h-[40px] opacity-40" />
          <Skeleton className="w-full rounded-md h-[40px] opacity-40" />
          <Skeleton className="w-full rounded-md h-[40px] opacity-40" />
          <Skeleton className="w-full rounded-md h-[40px] opacity-40" />
        </div>
        <div className="w-full flex gap-2">
          <Skeleton className="w-full rounded-md h-[40px] opacity-40" />
          <Skeleton className="w-full rounded-md h-[40px] opacity-40" />
          <Skeleton className="w-full rounded-md h-[40px] opacity-40" />
          <Skeleton className="w-full rounded-md h-[40px] opacity-40" />
          <Skeleton className="w-full rounded-md h-[40px] opacity-40" />
          <Skeleton className="w-full rounded-md h-[40px] opacity-40" />
        </div>
        <div className="w-full flex gap-2">
          <Skeleton className="w-full rounded-md h-[40px] opacity-40" />
          <Skeleton className="w-full rounded-md h-[40px] opacity-40" />
          <Skeleton className="w-full rounded-md h-[40px] opacity-40" />
          <Skeleton className="w-full rounded-md h-[40px] opacity-40" />
          <Skeleton className="w-full rounded-md h-[40px] opacity-40" />
          <Skeleton className="w-full rounded-md h-[40px] opacity-40" />
        </div>
        <div className="w-full flex gap-2">
          <Skeleton className="w-full rounded-md h-[40px] opacity-40" />
          <Skeleton className="w-full rounded-md h-[40px] opacity-40" />
          <Skeleton className="w-full rounded-md h-[40px] opacity-40" />
          <Skeleton className="w-full rounded-md h-[40px] opacity-40" />
          <Skeleton className="w-full rounded-md h-[40px] opacity-40" />
          <Skeleton className="w-full rounded-md h-[40px] opacity-40" />
        </div>
        <div className="w-full flex gap-2">
          <Skeleton className="w-full rounded-md h-[40px] opacity-40" />
          <Skeleton className="w-full rounded-md h-[40px] opacity-40" />
          <Skeleton className="w-full rounded-md h-[40px] opacity-40" />
          <Skeleton className="w-full rounded-md h-[40px] opacity-40" />
          <Skeleton className="w-full rounded-md h-[40px] opacity-40" />
          <Skeleton className="w-full rounded-md h-[40px] opacity-40" />
        </div>
      </div>
      <div className="flex-center mt-3 gap-2">
        <Skeleton className="w-[24px] rounded-md h-[24px] opacity-40" />
        <Skeleton className="w-[24px] rounded-md h-[24px] opacity-40" />
        <Skeleton className="w-[24px] rounded-md h-[24px] opacity-40" />
        <Skeleton className="w-[24px] rounded-md h-[24px] opacity-40" />
        <Skeleton className="w-[24px] rounded-md h-[24px] opacity-40" />
        <Skeleton className="w-[24px] rounded-md h-[24px] opacity-40" />
        <Skeleton className="w-[24px] rounded-md h-[24px] opacity-40" />
      </div>
    </>
  );
}

export default TableSkeleton;
