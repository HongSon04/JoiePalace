// import custom components
import AdminHeader from "@/app/_components/AdminHeader";
import { Suspense } from "react";
import Loading from "../loading";

function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <AdminHeader title={"Yêu cầu"} showSearchForm={false} />
    </Suspense>
  );
}

export default Page;
