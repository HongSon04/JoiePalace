"use client";

import { Pagination } from "@nextui-org/react";

function CustomPagination({ total, onChange, page, className }) {
  return (
    <Pagination
      isCompact
      page={page}
      showControls
      onChange={onChange}
      total={total}
      initialPage={1}
      className={className}
      classNames={{
        base: "!flex-center mt-5",
        item: "!bg-whiteAlpha-200 text-gray-400",
        prev: "!bg-whiteAlpha-200 text-gray-400",
        next: "!bg-whiteAlpha-200 text-gray-400",
        cursor: "bg-gold",
      }}
    />
  );
}

export default CustomPagination;
