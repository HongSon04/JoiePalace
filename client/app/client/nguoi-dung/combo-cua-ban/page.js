'use client'
import React from 'react';
import WeedingSection from './WeedingSection';

const page = () => {
    return (
        <div className='flex flex-col gap-8'>
            <h1 className='text-2xl font-bold  leading-6'>Thực đơn của bạn</h1>
            <WeedingSection></WeedingSection>
        </div>
    );
};

export default page;