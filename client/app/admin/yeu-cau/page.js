"use client";

// import custom components
import AdminHeader from "@/app/_components/AdminHeader";
import Branches from "./Branches";
import { Suspense } from "react";
import BranchesSkeleton from "@/app/_components/skeletons/BranchesSkeleton";
import { useSelector } from "react-redux";

function Page() {
  const { currentBranch } = useSelector((state) => state.branch);
  console.log(currentBranch);

  return (
    <div>
      <AdminHeader title={"Yêu cầu"} showSearchForm={false} />
      <Suspense fallback={<BranchesSkeleton />}>
        <Branches nameLink={"yeu-cau"} />
      </Suspense>
    </div>
  );
}

export default Page;
