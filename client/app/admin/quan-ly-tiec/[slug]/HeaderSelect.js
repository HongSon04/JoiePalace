"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import IconButton from '@/app/_components/IconButton';
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import StatusSelect from './[id]/StatusSelect';
import AdminSidebarButton from '@/app/_components/AdminSidebarButton';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '@/app/_lib/features/sidebar/sidebarSlice';

const HeaderSelect = ({ title, slugOrID,  showBackButton = true }) => {
    const router = useRouter();

    const handleBack = () => {
            router.back();
    };
    const { size } = useSelector((state) => state.sidebar);
    const dispatch = useDispatch();
    const onSidebar = () => {
        dispatch(toggleSidebar());
      };
    return (
        <div className='flex w-full justify-between items-center'>
            <div className='flex gap-4 items-center'>
                <AdminSidebarButton
                onSidebar={onSidebar}
                size={size}
                // className={"absolute"}
            />
                <IconButton onClick={handleBack}>
                    <ArrowLeftIcon width={20} height={20} color='white' />
                </IconButton>
                <h1 className="text-2xl w-fit font-bold leading-8 flex-1 text-left text-white">
                    {title} <span className="font-bold">- #{slugOrID}</span>
                </h1>
            </div>
            {/* <div>
                <StatusSelect />
            </div> */}
        </div>
    );
};

export default HeaderSelect;
