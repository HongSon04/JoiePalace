'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import HeaderSelect from './HeaderSelect';
import RequestBreadcrumbs from '@/app/_components/RequestBreadcrumbs';
import TableSkeleton from '@/app/_components/skeletons/TableSkeleton';
import RequestTable from './RequestTableForQuanLyTiec';
import useApiServices from '@/app/_hooks/useApiServices';
import { API_CONFIG } from '@/app/_utils/api.config';

const ChiTietTiecPage = ({ params }) => {
    const { slug } = params;
    const [branch, setBranch] = useState({});
    const { makeAuthorizedRequest } = useApiServices();

    const fetchBranchData = useCallback(async (id) => {
        try {
            const response = await makeAuthorizedRequest(API_CONFIG.BRANCHES.GET_BY_ID(id), 'GET');
            console.log("API response:", response);
            if (response.success && response.data) {
                setBranch(response.data[0]);
            }
        } catch (err) {
            console.error("Error fetching branch:", err);
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (storedUser?.branch_id) {
                fetchBranchData(storedUser.branch_id);
            }
        }
    }, [fetchBranchData]);

    console.log(branch)
    return (
        <div>
            <HeaderSelect title={'Quản lý tiệc'} slugOrID={branch?.name || 'Tên chi nhánh không xác định'} />
            <RequestBreadcrumbs requestId={slug} nameLink={'quan-ly-tiec'} pathLink={slug} namepath={branch?.name || 'Tên chi nhánh không xác định'} />
            <Suspense fallback={<TableSkeleton />}>
                <RequestTable />
            </Suspense>
        </div>
    );
};

export default ChiTietTiecPage;
