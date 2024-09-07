
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
        <Link href='/admin/chi-nhanh/add' className='p-5 size-5 flex items-center justify-center rounded-full text-xl font-semibold   border hover:bg-whiteAlpha-400 hover:border-none transition-all'>
          +
        </Link>
      </div>
    </Box>
  );
}

export default PageChiNhanh;
