"use client";

import { Pagination } from "@nextui-org/react";

function CustomPagination({ total }) {
  return (
    <Pagination
      isCompact
      showControls
      total={total}
      initialPage={1}
      classNames={{
        base: "!flex-center mt-5",
        item: "!bg-whiteAlpha-200 text-gray-900",
        prev: "!bg-whiteAlpha-200 text-gray-900",
        next: "!bg-whiteAlpha-200 text-gray-900",
      }}
    />
  );
}

export default CustomPagination;
