
import AdminHeader from '@/app/_components/AdminHeader';
import BranchesSkeleton from '@/app/_components/skeletons/BranchesSkeleton';
import {Image, Stack, Heading, Box } from '@chakra-ui/react';
import Link from 'next/link';
import { Suspense } from 'react';
import Branches from '../yeu-cau/Branches';
export const metadata = {
  title: 'Chi nhánh',
};

function PageChiNhanh() {
  return (
    <Box>
    <AdminHeader showBackButton={false}  title={'Chi nhánh'} />
      <Stack alignItems="start" spacing="8" direction={'row'} className='mt-5' >
        <Heading as='h1' size='lg' className=''>Chi nhánh / </Heading>
      </Stack>
      <Suspense fallback={<BranchesSkeleton />}>
        <Branches nameLink='chi-nhanh'/>
      </Suspense>
      <div className='h-48 flex w-full rounded-lg items-center justify-center bg-whiteAlpha-100 mt-5'>
        <Link href='/admin/chi-nhanh/add' className='p-3 flex items-center justify-center rounded-full text-xl font-semibold border hover:bg-whiteAlpha-400 hover:border-none transition-all'>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M15.8333 10.8333H10.8333V15.8333H9.16663V10.8333H4.16663V9.16667H9.16663V4.16667H10.8333V9.16667H15.8333V10.8333Z" fill="#F7F5F2"/>
      </svg>
        </Link>
      </div>
    </Box>
  );
}

export default PageChiNhanh;
