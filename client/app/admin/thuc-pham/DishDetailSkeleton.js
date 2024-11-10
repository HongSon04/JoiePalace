"use client";

import { Modal, Skeleton } from "@nextui-org/react";

function DishDetailSkeleton() {
  return (
    <Modal backdrop="blur">
      <div className="w-[400px] bg-whiteAlpha-600 backdrop-blur-lg rounded-lg p-5">
        <Skeleton className="w-full h-[30px]" />
        <Skeleton className="w-full h-[46px] mt-5" />
        <Skeleton className="w-full h-[46px] mt-5" />
        <div className="flex items-center justify-end">
          <Skeleton className="w-[180px] h-[46px] mt-5" />
          <Skeleton className="w-[180px] h-[46px] mt-5" />
        </div>
      </div>
    </Modal>
  );
}

export default DishDetailSkeleton;
