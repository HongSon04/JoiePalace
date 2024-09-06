// import custom components
import AdminHeader from "@/app/_components/AdminHeader";
import Branches from "./Branches";
import { Suspense } from "react";
import BranchesSkeleton from "@/app/_components/skeletons/BranchesSkeleton";

function Page() {
  return (
    <div>
      <AdminHeader title={"Yêu cầu"} showSearchForm={false} />
      <Suspense fallback={<BranchesSkeleton />}>
        <Branches />
      </Suspense>
    </div>
  );
}

export default Page;
