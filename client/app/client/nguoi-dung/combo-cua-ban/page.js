'use client'
import React from 'react';
import WeedingSection from './WeedingSection';
import Link from 'next/link';

const page = () => {
    return (
        <div className='flex flex-col gap-8'>
            <div className='flex justify-between'>
                <h1 className='text-2xl font-bold  leading-6 max-sm:text-center'>Gói combo tiệc</h1>
                <Link className="underline text-xs sm:text-sm lg:text-base font-normal hover:text-gold text-gold cursor-pointer"
                    href={'/client/tao-combo'}
                >Tạo gói tiệc</Link>

            </div>

            <WeedingSection></WeedingSection>
        </div>
    );
};

export default page;