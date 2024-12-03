'use client';
import React, { Suspense, useCallback, useEffect, useState } from 'react';
import RequestBreadcrumbs from '@/app/_components/RequestBreadcrumbs';
import TableSkeleton from '@/app/_components/skeletons/TableSkeleton';
import RequestTable from './RequestTableForSanh';
import HeaderSelect from '../../quan-ly-tiec/[slug]/HeaderSelect';
import useApiServices from '@/app/_hooks/useApiServices';
import { API_CONFIG } from '@/app/_utils/api.config';

const Page = ({ params }) => {
    const [branch, setBranch] = useState({});
    const { makeAuthorizedRequest } = useApiServices();

    const fetchBranchData = useCallback(async (id) => {
        try {
            const response = await makeAuthorizedRequest(API_CONFIG.BRANCHES.GET_BY_ID(id), 'GET');
            if (response.success && response.data) {
                setBranch(response.data[0]);
            }
        } catch (err) {
            console.error("Error fetching branch:", err);
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUser = JSON.parse(localStorage.getItem('currentBranch'));
            if (storedUser?.id) {
                fetchBranchData(storedUser.id);
            }
        }
    }, [fetchBranchData]);

    return (
        <div>
            <HeaderSelect title={'Sảnh'} slugOrID={branch?.name || 'Tên chi nhánh không xác định'} />
            
            <Suspense fallback={<TableSkeleton />}>
                <RequestTable />
            </Suspense>
        </div>
    );
};

export default Page;