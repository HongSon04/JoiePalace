
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
        <Heading as='h1' size='lg' className='text-gray-600'>Chi nhánh / </Heading>
      </Stack>
      <Suspense fallback={<BranchesSkeleton />}>
        <Branches nameLink='chi-nhanh'/>
      </Suspense>
      <div className='h-48 flex w-full rounded-lg items-center justify-center bg-blackAlpha-100 mt-5'>
        <Link href='/admin/chi-nhanh/add' className='p-3 flex items-center justify-center rounded-full text-xl font-semibold border bg-whiteAlpha-400 hover:bg-whiteAlpha-600 hover:border-none transition-all'>
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
          <path d="M16.3333 11.3333H11.3333V16.3333H9.66663V11.3333H4.66663V9.66663H9.66663V4.66663H11.3333V9.66663H16.3333V11.3333Z" fill="#4B5563"/>
        </svg>
        </Link>
      </div>
    </Box>
  );
}

export default PageChiNhanh;
