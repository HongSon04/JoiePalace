// import custom components
import AdminHeader from "@/app/_components/AdminHeader";
import { Suspense } from "react";
import BranchesSkeleton from "@/app/_components/skeletons/BranchesSkeleton";
import Notification from "./notification";
import { Heading, Stack } from "@chakra-ui/react";

function Page() {
  return (
    <div>
      <AdminHeader title={"Thông báo"} showSearchForm={false} />
      <Stack alignItems="start" spacing="8" direction={'row'} className='mt-5' >
        <Heading as='h1' size='lg' className=''>Chi nhánh / </Heading>
      </Stack>
      <Notification/>
    </div>
  );
}

export default Page;
