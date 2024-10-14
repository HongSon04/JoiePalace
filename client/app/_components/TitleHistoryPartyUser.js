import React from 'react';

const TitleHistoryPartyUser = ({title, partyBooked, waitingParty, totalMoney}) => {
    return (
        <div className='flex justify-between items-center w-full'>
            <h1 className='text-2xl font-bold'>{title}</h1>
            <div className='flex justify-between gap-[100px]'>
                <div className='flex flex-col gap-[14px]'>
                    <span className='text-base font-medium text-white'>{partyBooked}</span>
                    <span className='text-xs font-light text-gray-300'>Tiệc đã đặt</span>
                </div>
                <div className='flex flex-col gap-[14px]'>
                    <span className='text-base font-medium text-white'>{waitingParty}</span>
                    <span className='text-xs font-light text-gray-300'>Tiệc chờ</span>
                </div>
                <div className='flex flex-col gap-[14px]'>
                    <span className='text-base font-medium text-white'>{totalMoney}</span>
                    <span className='text-xs font-light text-gray-300'>Tổng chi</span>
                </div>
            </div>
    </div>
    );
};

export default TitleHistoryPartyUser;