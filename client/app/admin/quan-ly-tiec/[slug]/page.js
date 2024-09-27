'use client';

import { Suspense } from 'react';
import HeaderSelect from './HeaderSelect';
import RequestBreadcrumbs from '@/app/_components/RequestBreadcrumbs';
import TableSkeleton from '@/app/_components/skeletons/TableSkeleton';
import TableGrab from '@/app/_components/TableGrab';
import StatusSelectDay from './StatusSelectDay';

const ChiTietTiecPage = ({ params }) => {
    const {slug} = params;
    const options = [
        { id: 1, value: 1, name: "Theo tuần" },
        { id: 2, value: 2, name: "Theo tháng" },
        { id: 3, value: 3, name: "Theo năm" },
      ];

    return (
        <div>
            <HeaderSelect title={'Quản lý tiệc'} slugOrID={`${slug}`} />
            <RequestBreadcrumbs requestId={slug} nameLink={'quan-ly-tiec'} />
            <div className='flex justify-between items-center w-full mt-8'>
                <h1 className='text-lg font-bold leading-8 flex-1 text-left text-black'>Danh sách tiệc</h1>
                    <select className="border w-[200px] bg-white border-gray-300 rounded-md p-2 font-medium text-black leading-6">
                        {options.map(option => (
                            <option key={option.id} value={option.value}>
                                {option.name}
                            </option>
                        ))}
                    </select>
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
