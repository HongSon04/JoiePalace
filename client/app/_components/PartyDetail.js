'use client'

import Image from 'next/image';
import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

const PartyDetail = ({
    nameParty,
    address,
    phoneAddress,
    hostName,
    email,
    phoneUser,
    idParty,
    typeParty,
    partyDate,
    dateOrganization,
    liveOrOnline,
    numberGuest,
    hall,
    session,
    tableNumber,
    spareTables,
}) => {
    const [isCollapsed, setIsCollapsed] = useState(true);

    const toggleDetails = useCallback(() => {
        setIsCollapsed(prevState => !prevState);
    }, []);

    return (
        <div className="flex flex-col w-full gap-5">
            <header className="flex justify-between">
                <div className='flex gap-3'>
                    <div className='h-full w-2 bg-gold' />
                    <span className='text-base font-medium leading-normal'>Thông tin tiệc</span>
                </div>
                <div className="flex gap-5 items-center">
                    <span className="underline text-gold text-xs font-medium cursor-pointer">Chi tiết</span>
                    <span className="flex items-center text-[#93A2B7] text-xs font-medium cursor-pointer" onClick={toggleDetails}>
                        {isCollapsed ? 'Mở rộng' : 'Thu gọn'}
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 17" fill="none">
                            <path d={isCollapsed ? "M4 11.0303L4.94 11.9703L8 8.91669L11.06 11.9703L12 11.0303L8 7.0303L4 11.0303Z" : "M12 6.97003L11.06 6.03003L8 9.08336L4.94 6.03003L4 6.97003L8 10.97L12 6.97003Z"} fill="#9BA2AE" />
                        </svg>
                    </span>
                </div>
            </header>

            {/* Party Image Section */}
            <div className="flex gap-8">
                {!isCollapsed && (
                    <div className='flex gap-8 justify-between w-full'>
                        <div className='flex flex-col max-w-[450px] gap-5'>
                            <div className="relative h-52 w-[450px]">
                                <Image
                                    src="/auth_background.jpg"
                                    alt="info-state"
                                    layout="fill"
                                    objectFit="cover"
                                    priority
                                />
                            </div>
                            <span className='text-base font-medium leading-normal'>{nameParty}</span>
                            <span className='text-base font-medium leading-normal'>{address}</span>
                            <div className='flex flex-col gap-[14px]'>
                                {/* Contact Information */}
                                {[
                                    {
                                        icon: (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path d="M5.51667 8.99167C6.71667 11.35 8.65 13.275 11.0083 14.4833L12.8417 12.65C13.0667 12.425 13.4 12.35 13.6917 12.45C14.625 12.7583 15.6333 12.925 16.6667 12.925C17.125 12.925 17.5 13.3 17.5 13.7583V16.6667C17.5 17.125 17.125 17.5 16.6667 17.5C8.84167 17.5 2.5 11.1583 2.5 3.33333C2.5 2.875 2.875 2.5 3.33333 2.5H6.25C6.70833 2.5 7.08333 2.875 7.08333 3.33333C7.08333 4.375 7.25 5.375 7.55833 6.30833C7.65 6.6 7.58333 6.925 7.35 7.15833L5.51667 8.99167Z" fill="white"/>
                                            </svg>
                                        ),
                                        text: phoneAddress
                                    },
                                    {
                                        icon: (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path d="M16.668 3.33337H3.33464C2.41797 3.33337 1.6763 4.08337 1.6763 5.00004L1.66797 15C1.66797 15.9167 2.41797 16.6667 3.33464 16.6667H16.668C17.5846 16.6667 18.3346 15.9167 18.3346 15V5.00004C18.3346 4.08337 17.5846 3.33337 16.668 3.33337ZM16.668 6.66671L10.0013 10.8334L3.33464 6.66671V5.00004L10.0013 9.16671L16.668 5.00004V6.66671Z" fill="white"/>
                                            </svg>
                                        ),
                                        text: email
                                    }
                                ].map(({ icon, text }, idx) => (
                                    <ContactInfo key={idx} icon={icon} text={text} />
                                ))}
                            </div>
                        </div>

                        {/* Party Details Section */}
                        <div className={`transition-all duration-300 ease-in-out ${isCollapsed ? 'max-h-0 overflow-hidden' : 'max-h-screen'}`}>
                            <PartyDetails {...{ idParty, typeParty, partyDate, dateOrganization, liveOrOnline, numberGuest, hall, session, tableNumber, spareTables }} />
                        </div>
                    </div>
                )}
            </div>

            {/* Customer Information */}
            {!isCollapsed && (
                <CustomerInfo {...{ hostName, email, phoneUser }} />
            )}
        </div>
    );
};

const ContactInfo = ({ icon, text }) => (
    <div className='flex gap-2 items-center'>
        {icon}
        <span className='text-base font-normal leading-normal text-gray-400'>{text}</span>
    </div>
);

const PartyDetails = ({
    idParty,
    typeParty,
    partyDate,
    dateOrganization,
    liveOrOnline,
    numberGuest,
    hall,
    session,
    tableNumber,
    spareTables
}) => (
    <div className='flex flex-col gap-[23px] w-full'>
        {[
            { label: 'ID tiệc:', value: idParty },
            { label: 'Loại tiệc:', value: typeParty },
            { label: 'Ngày đặt tiệc:', value: partyDate },
            { label: 'Ngày tổ chức:', value: dateOrganization },
            { label: 'Trực tiếp / Trực tuyến:', value: liveOrOnline },
            { label: 'Số lượng khách:', value: numberGuest },
            { label: 'Sảnh:', value: hall },
            { label: 'Buổi:', value: session },
            { label: 'Số lượng bàn chính thức:', value: tableNumber },
            { label: 'Số lượng bàn dự phòng:', value: spareTables },
        ].map((item, index) => (
            <div className='flex gap-[10px]' key={index}>
                <span className='text-base font-normal text-white'>{item.label}</span>
                <span className='text-base text-gray-400'>{item.value}</span>
            </div>
        ))}
    </div>
);

const CustomerInfo = ({ hostName, email, phoneUser }) => (
    <div className="flex flex-col gap-4">
        <div className='flex gap-3'>
            <div className='h-6 w-2 bg-gold'></div>
            <span className='text-base font-medium leading-normal'>Thông tin khách hàng</span>
        </div>
        <div className="flex justify-between text-base font-normal text-gray-400">
            <div className="flex flex-col gap-2">
                <span>Tên chủ tiệc:</span>
                <span className="text-white">{hostName}</span>
            </div>
            <div className="flex flex-col gap-2">
                <span>Email:</span>
                <span className="text-white">{email}</span>
            </div>
            <div className="flex flex-col gap-2">
                <span>Số điện thoại:</span>
                <span className="text-white">{phoneUser}</span>
            </div>
        </div>
    </div>
);

PartyDetail.propTypes = {
    nameParty: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    phoneAddress: PropTypes.string.isRequired,
    hostName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phoneUser: PropTypes.string.isRequired,
    idParty: PropTypes.string.isRequired,
    typeParty: PropTypes.string.isRequired,
    partyDate: PropTypes.string.isRequired,
    dateOrganization: PropTypes.string.isRequired,
    liveOrOnline: PropTypes.string.isRequired,
    numberGuest: PropTypes.number.isRequired,
    hall: PropTypes.string.isRequired,
    session: PropTypes.string.isRequired,
    tableNumber: PropTypes.number.isRequired,
    spareTables: PropTypes.number.isRequired
};

export default PartyDetail;
