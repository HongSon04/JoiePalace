'use client';
import React from 'react';
import HeaderSelect from '../HeaderSelect';
import RequestBreadcrumbsForQuanLyTiec from './RequestBreadcrumbsForQuanLyTiec';
import InputDetailCustomer from './InputDetailCustomer';
import IconButton from '@/app/_components/IconButton';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import IconButtonSave from '@/app/_components/IconButtonSave';

const ChiTietTiecCuaChiNhanhPage = ({ params }) => {
    const { id } = params;

    const inputInfoUser = [
        {
            svg: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M18.39 14.56C16.71 13.7 14.53 13 12 13C9.47 13 7.29 13.7 5.61 14.56C4.61 15.07 4 16.1 4 17.22V20H20V17.22C20 16.1 19.39 15.07 18.39 14.56Z" fill="#4B5563" />
                    <path d="M9.78 12H14.22C15.43 12 16.36 10.94 16.2 9.74L15.88 7.29C15.57 5.39 13.92 4 12 4C10.08 4 8.43 5.39 8.12 7.29L7.8 9.74C7.64 10.94 8.57 12 9.78 12Z" fill="#4B5563" />
                </svg>
            ),
            name: 'name',
            title: 'Chủ tiệc',
            type: 'text',
            placeholder: 'Họ và Tên'
        },
        {
            svg: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="#4B5563" />
                </svg>
            ),
            name: 'email',
            title: 'Email',
            type: 'email',
            placeholder: 'Nhập email'
        },
        {
            svg: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M6.62 10.79C8.06 13.62 10.38 15.93 13.21 17.38L15.41 15.18C15.68 14.91 16.08 14.82 16.43 14.94C17.55 15.31 18.76 15.51 20 15.51C20.55 15.51 21 15.96 21 16.51V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z" fill="#4B5563" />
                </svg>
            ),
            name: 'phone',
            title: 'Số điện thoại',
            type: 'tel',
            placeholder: 'Nhập số điện thoại'
        },
    ];

    const inputOrganization = [
        {
            svg: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M13 9.5H18V7.5H13V9.5ZM13 16.5H18V14.5H13V16.5ZM19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H19C20.1 3 21 3.9 21 5V19C21 20.1 20.1 21 19 21ZM6 11H11V6H6V11ZM7 7H10V10H7V7ZM6 18H11V13H6V18ZM7 14H10V17H7V14Z" fill="#4B5563" />
            </svg>),
            title: 'Loại tiệc',
            type: 'select',
            name: 'party',
            options: [
                { value: 'wedding', label: 'Tiệc cưới' },
                { value: 'birthday', label: 'Tiệc sinh nhật' },
                { value: 'conference', label: 'Hội thảo' },
            ]
        },
        {
            svg: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M21.9601 9.73L20.5301 4.73C20.4101 4.3 20.0201 4 19.5701 4H4.43009C3.98009 4 3.59009 4.3 3.47009 4.73L2.04009 9.73C1.86009 10.36 2.34009 11 3.00009 11H5.20009L4.00009 20H6.00009L6.67009 15H17.3401L18.0001 20H20.0001L18.8001 11H21.0001C21.6601 11 22.1401 10.36 21.9601 9.73ZM6.93009 13L7.20009 11H16.8001L17.0701 13H6.93009Z" fill="#4B5563" />
                </svg>
            ),
            name: 'tables',
            title: 'Số lượng bàn chính thức',
            type: 'number',
            placeholder: 'Nhập số lượng bàn',
        },
        {
            svg: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M21.9601 9.73L20.5301 4.73C20.4101 4.3 20.0201 4 19.5701 4H4.43009C3.98009 4 3.59009 4.3 3.47009 4.73L2.04009 9.73C1.86009 10.36 2.34009 11 3.00009 11H5.20009L4.00009 20H6.00009L6.67009 15H17.3401L18.0001 20H20.0001L18.8001 11H21.0001C21.6601 11 22.1401 10.36 21.9601 9.73ZM6.93009 13L7.20009 11H16.8001L17.0701 13H6.93009ZM4.33009 9L5.19009 6H18.8201L19.6801 9H4.33009Z" fill="#4B5563" />
            </svg>),
            name: 'spareTables',
            title: 'Số lượng bàn dự phòng',
            type: 'number',
            placeholder: 'Nhập số lượng bàn dự phòng',
        },
        {
            svg: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" fill="#4B5563" />
            </svg>),
            name: 'customer',
            title: 'Số lượng khách dự kiến',
            type: 'number',
            placeholder: 'Nhập số lượng khách dự kiến',
        },
        {
            svg: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V10H19V20ZM9 14H7V12H9V14ZM13 14H11V12H13V14ZM17 14H15V12H17V14ZM9 18H7V16H9V18ZM13 18H11V16H13V18ZM17 18H15V16H17V18Z" fill="#4B5563" />
            </svg>),
            name: 'partyDate',
            title: 'Ngày đặt tiệc',
            type: 'date',
            placeholder: 'dd-mm-yyyy',
        },
        {
            svg: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V10H19V20ZM9 14H7V12H9V14ZM13 14H11V12H13V14ZM17 14H15V12H17V14ZM9 18H7V16H9V18ZM13 18H11V16H13V18ZM17 18H15V16H17V18Z" fill="#4B5563" />
            </svg>),
            name: 'DateOrganization',
            title: 'Ngày tổ chức',
            type: 'date',
            placeholder: 'dd-mm-yyyy',
        },
        {
            svg: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z" fill="#4B5563" />
                <path d="M12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" fill="#4B5563" />
            </svg>),
            name: 'time',
            title: 'Giờ tổ chức',
            type: 'time',
            placeholder: '00:00:00',
        },
    ];

    const inputsCost = [
        {
            svg: null,
            title: 'Menu',
            type: 'select',
            name: 'menu',
            options: [
                { value: 'wedding', label: 'Tiệc cưới' },
                { value: 'birthday', label: 'Tiệc sinh nhật' },
                { value: 'conference', label: 'Hội thảo' },
            ]
        },
        {
            svg: null,
            title: 'Sảnh',
            type: 'select',
            name: 'hall',
            options: [
                { value: 'wedding', label: 'Tiệc cưới' },
                { value: 'birthday', label: 'Tiệc sinh nhật' },
                { value: 'conference', label: 'Hội thảo' },
            ]
        },
        {
            svg: null,
            title: 'Decor',
            type: 'select',
            name: 'decor',
            options: [
                { value: 'wedding', label: 'Tiệc cưới' },
                { value: 'birthday', label: 'Tiệc sinh nhật' },
                { value: 'conference', label: 'Hội thảo' },
            ]
        },
        {
            svg: null,
            title: 'Bánh kem',
            type: 'select',
            name: 'cake',
            options: [
                { value: 1, label: 'có' },
                { value: 0, label: 'không' },
            ]
        },
        {
            svg: null,
            title: 'Champagne',
            type: 'select',
            name: 'champagne',
            options: [
                { value: 1, label: 'có' },
                { value: 0, label: 'không' },
            ]
        },
    ]

    const drinks = [
        { name: 'Nước suối Aquafina', quantity: 10, unit: 'Thùng' },
        { name: 'Nước ngọt Pepsi', quantity: 12, unit: 'Thùng' },
        { name: 'Bia lon Sài Gòn Bạc', quantity: 20, unit: 'Thùng' },
    ];

    
    return (
        <div>
            <HeaderSelect title={'Quản lý tiệc'} slugOrID={id} />
            <RequestBreadcrumbsForQuanLyTiec requestId={id} nameLink={'quan-ly-tiec'} />
            <div className='p-4 mt-[30px] w-full bg-white rounded-lg'>
                <h3 className='font-semibold text-xl leading-7 mb-[22px] text-gray-600'>Thông tin liên hệ</h3>
                <div className='grid grid-cols-3 gap-[30px]'>
                    {inputInfoUser.map((detail, index) => (
                        <InputDetailCustomer
                            key={index}
                            svg={detail.svg}
                            title={detail.title}
                            type={detail.type}
                            name={detail.name}
                            placeholder={detail.placeholder}

                        />
                    ))}
                </div>
            </div>
            <div className='p-4 mt-5 w-full bg-white rounded-lg'>
                <h3 className='font-semibold text-xl leading-7 mb-[22px] text-gray-600'>Thông tin tổ chức</h3>
                <div className='grid grid-cols-3 gap-[30px]'>
                    {inputOrganization.map((detail, index) => (
                        <InputDetailCustomer
                            key={index}
                            svg={detail.svg}
                            title={detail.title}
                            type={detail.type}
                            name={detail.name}
                            placeholder={detail.placeholder}
                            options={detail.options}
                        />
                    ))}
                </div>
            </div>
            <div className='p-4 mt-5 w-full bg-white rounded-lg'>
                <h3 className='font-semibold text-xl leading-7 mb-[22px] text-gray-600'>Chi phí</h3>
                <div className='grid grid-cols-3 gap-[30px]'>
                    {inputsCost.map((detail, index) => (
                        <InputDetailCustomer
                            key={index}
                            svg={detail.svg}
                            title={detail.title}
                            type={detail.type}
                            name={detail.name}
                            placeholder={detail.placeholder}
                            options={detail.options}
                        />
                    ))}
                    <div className='flex flex-col gap-[9px]'>
                        <span className='font-bold leading-6 text-base text-gray-600'>Đồ uống</span>
                        <div className='flex flex-col gap-[19px]'>
                            {drinks.map((drink, index) => (
                                <DrinkItem 
                                    key={index} 
                                    name={drink.name} 
                                    quantity={drink.quantity} 
                                    unit={drink.unit}
                                    index={index}
                                />
                            ))}
                        </div>
                    </div>
                    <div className='flex flex-col gap-3'>
                        <div className='flex gap-3 '>
                            <span className='text-gray-600 text-base font-semibold leading-6'>Bánh kem: </span>
                            <span className='text-base font-normal leading-6 text-gray-600'>000000 VND</span>
                        </div>
                        <div className='flex gap-3 '>
                            <span className='text-gray-600 text-base font-semibold leading-6'>Champagne: </span>
                            <span className='text-base font-normal leading-6 text-gray-600'>000000 VND</span>
                        </div>
                        <div className='flex gap-3 '>
                            <span className='text-gray-600 text-base font-semibold leading-6'>Đồ uống: </span>
                            <span className='text-base font-normal leading-6 text-gray-600'>000000 VND</span>
                        </div>
                        <div className='flex gap-3 '>
                            <span className='text-gray-600 text-base font-semibold leading-6'>Bàn tiệc: </span>
                            <span className='text-base font-normal leading-6 text-gray-600'>000000 VND</span>
                        </div>
                        <div className='flex gap-3 '>
                            <span className='text-gray-600 text-base font-semibold leading-6'>Tổng chi: </span>
                            <span className='text-base font-normal leading-6 text-gray-600'>000000 VND</span>
                        </div>
                    </div>
                </div>

            </div>
            <div className="flex mt-[30px] mr-[30px]">
                <IconButton className="bg-whiteAlpha-400 ">
                    <ArrowLeftIcon width={20} height={20} />
                </IconButton>
                <div className="ml-auto flex flex-shrink-0 gap-4">
                    <IconButtonSave title={'Hủy'} color={'bg-red-400'}></IconButtonSave>
                    <IconButtonSave title={'Lưu'} color={'bg-teal-400'}></IconButtonSave>
                </div>
            </div>
        </div>
    );
};

const DrinkItem = ({ name, quantity, unit, index }) => {
    return (
        <div className='flex items-center gap-3 text-gray-600'>
            <span>{`${index + 1}. ${name}`}</span>
            <div>
                <input type="number" className='w-[60px] text-center h-6 bg-blackAlpha-100 rounded' value={quantity} />
            </div>
            <span>{unit}</span>
        </div>
    );
};


export default ChiTietTiecCuaChiNhanhPage;