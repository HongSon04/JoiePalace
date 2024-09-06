"use client";

import { Skeleton, Stack } from "@chakra-ui/react";

function BranchesSkeleton() {
  return (
    <Stack className="w-full" direction={"row"} spacing={20}>
      <Skeleton width={"100%"} height="200px" />
      <Skeleton width={"100%"} height="200px" />
      <Skeleton width={"100%"} height="200px" />
    </Stack>
  );
}

export default BranchesSkeleton;
