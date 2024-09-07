import AdminHeader from '@/app/_components/AdminHeader';
import { Box, Heading, Stack, } from '@chakra-ui/react';
import React, { Suspense } from 'react';
import Branches from '../yeu-cau/Branches';
import BranchesSkeleton from '@/app/_components/skeletons/BranchesSkeleton';

const QuanLyTiecPage = () => {
    return (
        <Box>
        <AdminHeader showBackButton={false}  title={'Quản lý tiệc'} />
          <Stack alignItems="start" spacing="8" direction={'row'} className='mt-5' >
            <Heading as='h1' size='lg' className=''>Quản lý tiệc / </Heading>
          </Stack>
          <Suspense fallback={<BranchesSkeleton />}>
            <Branches nameLink='quan-ly-tiec'/>
        </Suspense>

        </Box>
    );
};

export default QuanLyTiecPage;