'use client';

import { Suspense } from 'react';
import HeaderSelect from './HeaderSelect';
import RequestBreadcrumbs from '@/app/_components/RequestBreadcrumbs';
import StatusSelectDay from './StatusSelectDay';
import TableSkeleton from '@/app/_components/skeletons/TableSkeleton';
import TableGrab from '@/app/_components/TableGrab';
import Link from 'next/link';

const ChiTietTiecPage = ({ params }) => {
    const {slug} = params;


    return (
        <div>
            <HeaderSelect title={'Quản lý tiệc'} slugOrID={`${slug}`} />
            <RequestBreadcrumbs requestId={slug} nameLink={'quan-ly-tiec'} />
            <div className='flex justify-between items-center w-full mt-8'>
                <h1 className='text-lg font-bold leading-8 flex-1 text-left'>Danh sách tiệc</h1>
                <div>
                    <StatusSelectDay />
                </div>
            </div>
            <div>
            <Suspense fallback={<TableSkeleton/>}>
                <TableGrab></TableGrab>
            </Suspense>

            </div>
            
        </div>
    );
};

export default ChiTietTiecPage;
