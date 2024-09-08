import React from 'react';
import IconButton from '@/app/_components/IconButton';
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import StatusSelect from './[id]/StatusSelect';

const HeaderSelect = ({title, slugOrID}) => {
    const handleBack = () => {
        router.back();
    };
    return (
        <div className='flex w-full justify-between items-center'>
            <div className='flex gap-4 items-center'>
                <IconButton onClick={handleBack}>
                    <ArrowLeftIcon width={20} height={20} />
                </IconButton>
                <h1 className="text-2xl w-fit font-bold leading-8 flex-1 text-left">
                    {title} <span className="font-bold">- {slugOrID}</span>
                </h1>
            </div>
            <div>
                <StatusSelect></StatusSelect>
            </div>
        </div>
    );
};

export default HeaderSelect;