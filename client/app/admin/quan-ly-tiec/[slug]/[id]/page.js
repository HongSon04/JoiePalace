'use client';
import React from 'react';
import HeaderSelect from '../HeaderSelect';
import RequestBreadcrumbsForQuanLyTiec from './RequestBreadcrumbsForQuanLyTiec';
import InputDetailCustomer from './InputDetailCustomer';
import IconButton from '@/app/_components/IconButton';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import IconButtonSave from '@/app/_components/IconButtonSave';
import TableDetail from '@/app/_components/TableDetailCost';
import ButtonCustomAdmin from '@/app/_components/ButtonCustomAdmin';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const TitleSpanInfo = ({ title }) => (
    <span className="font-semibold text-xl leading-7 text-white">{title}</span>
);

const userSchema = z.object({
  nameHost: z.string().min(1, { message: "Họ và Tên là bắt buộc" }),
  email: z.string().email({ message: "Email không hợp lệ" }),
  phone: z
    .string()
    .regex(/^\d+$/, { message: "Số điện thoại phải là số" })
    .min(10, { message: "Số điện thoại phải có ít nhất 10 ký tự" }),
});

const organizationSchema = z.object({
  party: z.enum(['wedding', 'birthday', 'conference'], { message: "Loại tiệc không hợp lệ" }),
  tables: z.number().min(1, { message: "Số lượng bàn chính thức phải lớn hơn 0" }),
  spareTables: z.number().min(0, { message: "Số lượng bàn dự phòng không được âm" }),
  customer: z.number().min(1, { message: "Số lượng khách dự kiến phải lớn hơn 0" }),
  customerAndChair: z.number().min(1, { message: "Số lượng khách / bàn phải lớn hơn 0" }),
  partyDate: z.string().nonempty({ message: "Ngày đặt tiệc là bắt buộc" }), 
  dateOrganization: z.string().nonempty({ message: "Ngày tổ chức là bắt buộc" }),
  timeEvent: z.string().nonempty({ message: "Giờ tổ chức là bắt buộc" }),
  menu: z.enum(['menu1', 'menu2', 'menu3'], { message: "Menu không hợp lệ" }),
  snack: z.enum(['1', '0'], { message: "Bữa ăn nhẹ không hợp lệ" }),
  tableType: z.enum(['1', '0'], { message: "Loại bàn không hợp lệ" }),
  chairType: z.enum(['1', '0'], { message: "Loại ghế không hợp lệ" }),
  decor: z.enum(['wedding', 'birthday', 'conference'], { message: "Trang trí không hợp lệ" }),
  color: z.string().min(1, { message: "Màu chủ đạo là bắt buộc" }),
  hall: z.enum(['hallA', 'hallB', 'hallC'], { message: "Sảnh không hợp lệ" }),
  danceTroupe: z.enum(['1', '0'], { message: "Vũ đoàn không hợp lệ" }),
  StageAndLed: z.enum(['1', '0'], { message: "Sân khấu & màn hình led không hợp lệ" }),
  cake: z.enum(['1', '0'], { message: "Bánh kem không hợp lệ" }),
  champagne: z.number().min(1, { message: "Champagne là bắt buộc" }),
  namePayer: z.string().min(1, { message: "người thanh toán là bắt buộc" }),
  amountPayable: z.number().min(1, { message: "Số tiền phải thanh toán là bắt buộc" }),
  depositAmount: z.number().min(1, { message: "Số tiền cọc là bắt buộc" }),
  depositDate: z.string().nonempty(1, { message: "Ngày đặt cọc là bắt buộc" }),
  remainingAmountPaid: z.number().min(1, { message: "Số tiền còn lại thanh toán là bắt buộc" }),
  dataPay: z.string().nonempty(1, { message: "Ngày thanh toán là bắt buộc" }),
  
});

const formSchema = userSchema.merge(organizationSchema);



const ChiTietTiecCuaChiNhanhPage = ({ params }) => {
    const { id } = params;

    const inputInfoUser = [
        {
            svg: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M18.39 14.56C16.71 13.7 14.53 13 12 13C9.47 13 7.29 13.7 5.61 14.56C4.61 15.07 4 16.1 4 17.22V20H20V17.22C20 16.1 19.39 15.07 18.39 14.56Z" fill="white" />
                    <path d="M9.78 12H14.22C15.43 12 16.36 10.94 16.2 9.74L15.88 7.29C15.57 5.39 13.92 4 12 4C10.08 4 8.43 5.39 8.12 7.29L7.8 9.74C7.64 10.94 8.57 12 9.78 12Z" fill="white" />
                </svg>
            ),
            name: 'nameHost',
            title: 'Chủ tiệc',
            type: 'text',
            placeholder: 'Họ và Tên'
        },
        {
            svg: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="white" />
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
                    <path d="M6.62 10.79C8.06 13.62 10.38 15.93 13.21 17.38L15.41 15.18C15.68 14.91 16.08 14.82 16.43 14.94C17.55 15.31 18.76 15.51 20 15.51C20.55 15.51 21 15.96 21 16.51V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z" fill="white" />
                </svg>
            ),
            name: 'phone',
            title: 'Số điện thoại',
            type: 'phone',
            placeholder: 'Nhập số điện thoại'
        },
    ];

    const inputOrganization = [
        {
            svg: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M13 9.5H18V7.5H13V9.5ZM13 16.5H18V14.5H13V16.5ZM19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H19C20.1 3 21 3.9 21 5V19C21 20.1 20.1 21 19 21ZM6 11H11V6H6V11ZM7 7H10V10H7V7ZM6 18H11V13H6V18ZM7 14H10V17H7V14Z" fill="white" />
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
                    <path d="M21.9601 9.73L20.5301 4.73C20.4101 4.3 20.0201 4 19.5701 4H4.43009C3.98009 4 3.59009 4.3 3.47009 4.73L2.04009 9.73C1.86009 10.36 2.34009 11 3.00009 11H5.20009L4.00009 20H6.00009L6.67009 15H17.3401L18.0001 20H20.0001L18.8001 11H21.0001C21.6601 11 22.1401 10.36 21.9601 9.73ZM6.93009 13L7.20009 11H16.8001L17.0701 13H6.93009Z" fill="white" />
                </svg>
            ),
            name: 'tables',
            title: 'Số lượng bàn chính thức',
            type: 'number',
            placeholder: 'Nhập số lượng bàn',
        },
        {
            svg: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M21.9601 9.73L20.5301 4.73C20.4101 4.3 20.0201 4 19.5701 4H4.43009C3.98009 4 3.59009 4.3 3.47009 4.73L2.04009 9.73C1.86009 10.36 2.34009 11 3.00009 11H5.20009L4.00009 20H6.00009L6.67009 15H17.3401L18.0001 20H20.0001L18.8001 11H21.0001C21.6601 11 22.1401 10.36 21.9601 9.73ZM6.93009 13L7.20009 11H16.8001L17.0701 13H6.93009ZM4.33009 9L5.19009 6H18.8201L19.6801 9H4.33009Z" fill="white" />
            </svg>),
            name: 'spareTables',
            title: 'Số lượng bàn dự phòng',
            type: 'number',
            placeholder: 'Nhập số lượng bàn dự phòng',
        },
        {
            svg: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" fill="white" />
            </svg>),
            name: 'customer',
            title: 'Số lượng khách dự kiến',
            type: 'number',
            placeholder: 'Nhập số lượng khách dự kiến',
        },
        {
            svg: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" fill="white" />
            </svg>),
            name: 'customerAndChair',
            title: 'Số lượng khách / bàn',
            type: 'number',
            placeholder: 'Nhập số lượng khách / bàn',
        },
        {
            svg: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V10H19V20ZM9 14H7V12H9V14ZM13 14H11V12H13V14ZM17 14H15V12H17V14ZM9 18H7V16H9V18ZM13 18H11V16H13V18ZM17 18H15V16H17V18Z" fill="white" />
            </svg>),
            name: 'partyDate',
            title: 'Ngày đặt tiệc',
            type: 'date',
            placeholder: 'dd-mm-yyyy',
        },
        {
            svg: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V10H19V20ZM9 14H7V12H9V14ZM13 14H11V12H13V14ZM17 14H15V12H17V14ZM9 18H7V16H9V18ZM13 18H11V16H13V18ZM17 18H15V16H17V18Z" fill="white" />
            </svg>),
            name: 'dateOrganization',
            title: 'Ngày tổ chức',
            type: 'date',
            placeholder: 'dd-mm-yyyy',
        },
        {
            svg: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z" fill="white" />
                <path d="M12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" fill="white" />
            </svg>),
            name: 'timeEvent',
            title: 'Giờ tổ chức',
            type: 'time',
            placeholder: '00:00:00',
        },
        {
            svg: null,
            title: 'Menu',
            type: 'select',
            name: 'menu',
            options: [
                { value: 'wedding', label: 'A La Carte' },
                { value: 'birthday', label: 'Tiệc sinh nhật' },
                { value: 'conference', label: 'Hội thảo' },
            ]
        },
        {
            svg: null,
            title: 'Bữa ăn nhẹ',
            type: 'select',
            name: 'snack',
            options: [
                { value: '1', label: 'Có' },
                { value: '0', label: 'Không' },
            ]
        },
        {
            svg: null,
            title: 'Loại bàn',
            type: 'select',
            name: 'tableType',
            options: [
                { value: '1', label: 'Bàn tròn tiêu chuẩn' },
                { value: '0', label: 'Không' },
            ]
        },
        {
            svg: null,
            title: 'Loại ghế',
            type: 'select',
            name: 'chairType',
            options: [
                { value: '1', label: 'Ghế tựa tiêu chuẩn' },
                { value: '0', label: 'Không' },
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
            title: 'Màu chủ đạo',
            type: 'input',
            name: 'color',
            placeholder: 'Vàng',
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
            title: 'Vũ đoàn',
            type: 'select',
            name: 'danceTroupe',
            options: [
                { value: '1', label: 'Có' },
                { value: '0', label: 'Không' },
            ]
        },
        {
            svg: null,
            title: 'Sân khấu & màn hình led',
            type: 'select',
            name: 'StageAndLed',
            options: [
                { value: '1', label: 'Có' },
                { value: '0', label: 'Không' },
            ]
        },
        {
            svg: null,
            title: 'Bánh kem',
            type: 'select',
            name: 'cake',
            options: [
                { value: '1', label: 'có' },
                { value: '0', label: 'không' },
            ]
        },
        {
            svg: null,
            title: 'Champagne',
            type: 'number',
            name: 'champagne',
            placeholder: '2'
        },

    ];

    const inputsCost = [
        {
            svg: null,
            title: 'Họ tên người thanh toán',
            type: 'input',
            name: 'namePayer',
            placeholder: 'Nguyễn văn A'
        },
        {
            svg: null,
            title: 'Hình thức thanh toán',
            type: 'select',
            name: 'payment',
            options: [
                { value: '0', label: 'Momo' },
                { value: '1', label: 'ZaloPay' },
            ]
        },
        {
            svg: null,
            title: 'Số tiền phải thanh toán',
            type: 'input',
            name: 'amountPayable',
            placeholder: '1000000'
        },
        {
            svg: null,
            title: 'Số tiền cọc (30%)',
            type: 'input',
            name: 'depositAmount',
            placeholder: '1000000'
        },
        {
            svg: null,
            title: 'Trạng thái đã cọc',
            type: 'select',
            name: 'depositStatus',
            options: [
                { value: '1', label: 'Đã đặt cọc' },
                { value: '0', label: 'Chưa đặt cọc' },
            ]
        },
        {
            svg: null,
            title: 'Ngày đặt cọc',
            type: 'date',
            name: 'depositDate',
            placeholder: '29/12/2024'
        },
        {
            svg: null,
            title: 'Số tiền còn lại phải thanh toán',
            type: 'input',
            name: 'remainingAmountPaid',
            placeholder: '10000000000'
        },
        {
            svg: null,
            title: 'Trạng thái thanh toán',
            type: 'select',
            name: 'statusPayment',
            options: [
                { value: '1', label: 'Đã thanh toán' },
                { value: '0', label: 'Chưa thanh toán' },
            ]
        },
        {
            svg: null,
            title: 'Ngày thanh toán',
            type: 'date',
            name: 'dataPay',
            placeholder: '29/12/2024'
        },
    ]

    const headers = ['Dịch vụ', 'Mô tả', 'Thành tiền (VND)'];
    const data = [
        { service: 'Menu', description: '4.000.000 VND / 1 bàn * 10 bàn', cost: '40.000.000' },
        {
            service: 'Đồ uống',
            description: ['Bia: 10 thùng tiger', 'Pepsi: 5 thùng', 'Nước suối: 5 thùng'],
            cost: '10.000.000',
        },
        { service: 'Bánh kem', description: '', cost: '1.000.000' },
        { service: 'Trang trí', description: 'Màu vàng', cost: '3.000.000' },
        { service: 'Âm thanh, ánh sáng, sân khấu, màn hình', description: '', cost: '5.000.000' },
        { service: 'Phí thuê bàn ghế', description: '', cost: '1.000.000' },
        { service: 'Phí thuê sảnh tiệc', description: '3 giờ', cost: '20.000.000' },
        { service: 'Bữa ăn nhẹ cho cô dâu - chú rể', description: '', cost: '100.000' },
        { service: 'MC', description: '', cost: '500.000' },
        { service: 'Chi phí phát sinh', description: 'Thêm 1 bàn tiệc', cost: '4.000.000' },
        { service: 'Tổng chi phí', description: '', cost: '999.000.000' },
        { service: 'VAT', description: '10%', cost: '99.000.000' },
        { service: 'Tổng chi phí bao gồm VAT', description: '', cost: '1.000.000.000' },
    ];
    const buttons = [
        {
            title: 'Xem hợp đồng',
            svg: (<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M11.6665 0H2.33317V1.16667H11.6665V0ZM2.33317 14H11.6665V12.8333H2.33317V14ZM11.6665 2.33333H2.33317C1.6915 2.33333 1.1665 2.85833 1.1665 3.5V10.5C1.1665 11.1417 1.6915 11.6667 2.33317 11.6667H11.6665C12.3082 11.6667 12.8332 11.1417 12.8332 10.5V3.5C12.8332 2.85833 12.3082 2.33333 11.6665 2.33333ZM6.99984 3.9375C7.72317 3.9375 8.31234 4.52667 8.31234 5.25C8.31234 5.97333 7.72317 6.5625 6.99984 6.5625C6.2765 6.5625 5.68734 5.97333 5.68734 5.25C5.68734 4.52667 6.2765 3.9375 6.99984 3.9375ZM9.9165 9.91667H4.08317V9.04167C4.08317 8.0675 6.02567 7.58333 6.99984 7.58333C7.974 7.58333 9.9165 8.0675 9.9165 9.04167V9.91667Z" fill="white" />
            </svg>),
            id: '',
            bg: 'bg-teal-400',
            textColor: 'text-white'

        },
        {
            title: 'Xuất hợp đồng',
            svg: (<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M2.84375 3.0625H11.1576C11.563 3.06371 11.9514 3.22529 12.2381 3.51195C12.5247 3.79861 12.6863 4.18705 12.6875 4.59244L12.6875 4.59375L12.6875 8.96875L12.6875 8.97006C12.6863 9.37545 12.5247 9.76389 12.2381 10.0506C11.9514 10.3372 11.563 10.4988 11.1576 10.5L11.1562 10.5H10.5V9.625H11.1556C11.3296 9.62431 11.4963 9.55489 11.6193 9.43183C11.7424 9.30878 11.8118 9.14209 11.8125 8.96808V4.59442C11.8118 4.42041 11.7424 4.25372 11.6193 4.13067C11.4963 4.0076 11.3295 3.93817 11.1555 3.9375H2.84449C2.67046 3.93817 2.50374 4.0076 2.38067 4.13067C2.2576 4.25374 2.18817 4.42046 2.1875 4.59449V8.96801C2.18817 9.14204 2.2576 9.30876 2.38067 9.43183C2.50372 9.55489 2.67041 9.62431 2.84442 9.625H3.5V10.5H2.84375L2.84244 10.5C2.43705 10.4988 2.04861 10.3372 1.76195 10.0506C1.47529 9.76389 1.31371 9.37545 1.3125 8.97006L1.3125 8.96875V4.59244C1.31371 4.18705 1.47529 3.79861 1.76195 3.51195C2.04861 3.22529 2.43705 3.06371 2.84244 3.0625L2.84375 3.0625Z" fill="white" />
                <path fillRule="evenodd" clipRule="evenodd" d="M4.165 7C4.03936 7 3.9375 7.10186 3.9375 7.2275V11.585C3.9375 11.7106 4.03936 11.8125 4.165 11.8125H9.835C9.96064 11.8125 10.0625 11.7106 10.0625 11.585V7.2275C10.0625 7.10186 9.96064 7 9.835 7H4.165ZM3.0625 7.2275C3.0625 6.61861 3.55611 6.125 4.165 6.125H9.835C10.4439 6.125 10.9375 6.61861 10.9375 7.2275V11.585C10.9375 12.1939 10.4439 12.6875 9.835 12.6875H4.165C3.55611 12.6875 3.0625 12.1939 3.0625 11.585V7.2275Z" fill="white" />
                <path fillRule="evenodd" clipRule="evenodd" d="M4.59375 1.3125H9.40756C9.81295 1.31371 10.2014 1.47529 10.4881 1.76195C10.7747 2.04861 10.9363 2.43705 10.9375 2.84244L10.9375 2.84375L10.9375 3.5H10.0625V2.84442C10.0618 2.67041 9.99239 2.50372 9.86933 2.38067C9.74626 2.2576 9.57954 2.18817 9.40551 2.1875H4.59449C4.42046 2.18817 4.25374 2.2576 4.13067 2.38067C4.0076 2.50374 3.93817 2.67046 3.9375 2.84449V3.5H3.0625V2.84244C3.06371 2.43705 3.22529 2.04861 3.51195 1.76195C3.79861 1.47529 4.18705 1.31371 4.59244 1.3125L4.59375 1.3125Z" fill="white" />
            </svg>),
            id: '',
            bg: 'bg-teal-400',
            textColor: 'text-white'
        },
        {
            title: 'Xuất hợp đồng',
            svg: (<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M4.08317 1.74998H2.33317V3.49998H1.1665V0.583313H4.08317V1.74998ZM12.8332 3.49998V0.583313H9.9165V1.74998H11.6665V3.49998H12.8332ZM4.08317 12.25H2.33317V10.5H1.1665V13.4166H4.08317V12.25ZM11.6665 10.5V12.25H9.9165V13.4166H12.8332V10.5H11.6665ZM9.9165 3.49998H4.08317V10.5H9.9165V3.49998ZM11.0832 10.5C11.0832 11.1416 10.5582 11.6666 9.9165 11.6666H4.08317C3.4415 11.6666 2.9165 11.1416 2.9165 10.5V3.49998C2.9165 2.85831 3.4415 2.33331 4.08317 2.33331H9.9165C10.5582 2.33331 11.0832 2.85831 11.0832 3.49998V10.5ZM8.74984 4.66665H5.24984V5.83331H8.74984V4.66665ZM8.74984 6.41665H5.24984V7.58331H8.74984V6.41665ZM8.74984 8.16665H5.24984V9.33331H8.74984V8.16665Z" fill="black" />
            </svg>),
            id: '',
            bg: 'bg-white',
            textColor: 'text-gray-600'
        },
        {
            title: 'Xuất hóa đơn',
            svg: (<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M2.84375 3.0625H11.1576C11.563 3.06371 11.9514 3.22529 12.2381 3.51195C12.5247 3.79861 12.6863 4.18705 12.6875 4.59244L12.6875 4.59375L12.6875 8.96875L12.6875 8.97006C12.6863 9.37545 12.5247 9.76389 12.2381 10.0506C11.9514 10.3372 11.563 10.4988 11.1576 10.5L11.1562 10.5H10.5V9.625H11.1556C11.3296 9.62431 11.4963 9.55489 11.6193 9.43183C11.7424 9.30878 11.8118 9.14209 11.8125 8.96808V4.59442C11.8118 4.42041 11.7424 4.25372 11.6193 4.13067C11.4963 4.0076 11.3295 3.93817 11.1555 3.9375H2.84449C2.67046 3.93817 2.50374 4.0076 2.38067 4.13067C2.2576 4.25374 2.18817 4.42046 2.1875 4.59449V8.96801C2.18817 9.14204 2.2576 9.30876 2.38067 9.43183C2.50372 9.55489 2.67041 9.62431 2.84442 9.625H3.5V10.5H2.84375L2.84244 10.5C2.43705 10.4988 2.04861 10.3372 1.76195 10.0506C1.47529 9.76389 1.31371 9.37545 1.3125 8.97006L1.3125 8.96875V4.59244C1.31371 4.18705 1.47529 3.79861 1.76195 3.51195C2.04861 3.22529 2.43705 3.06371 2.84244 3.0625L2.84375 3.0625Z" fill="black" />
                <path fillRule="evenodd" clipRule="evenodd" d="M4.165 7C4.03936 7 3.9375 7.10186 3.9375 7.2275V11.585C3.9375 11.7106 4.03936 11.8125 4.165 11.8125H9.835C9.96064 11.8125 10.0625 11.7106 10.0625 11.585V7.2275C10.0625 7.10186 9.96064 7 9.835 7H4.165ZM3.0625 7.2275C3.0625 6.61861 3.55611 6.125 4.165 6.125H9.835C10.4439 6.125 10.9375 6.61861 10.9375 7.2275V11.585C10.9375 12.1939 10.4439 12.6875 9.835 12.6875H4.165C3.55611 12.6875 3.0625 12.1939 3.0625 11.585V7.2275Z" fill="black" />
                <path fillRule="evenodd" clipRule="evenodd" d="M4.59375 1.3125H9.40756C9.81295 1.31371 10.2014 1.47529 10.4881 1.76195C10.7747 2.04861 10.9363 2.43705 10.9375 2.84244L10.9375 2.84375L10.9375 3.5H10.0625V2.84442C10.0618 2.67041 9.99239 2.50372 9.86933 2.38067C9.74626 2.2576 9.57954 2.18817 9.40551 2.1875H4.59449C4.42046 2.18817 4.25374 2.2576 4.13067 2.38067C4.0076 2.50374 3.93817 2.67046 3.9375 2.84449V3.5H3.0625V2.84244C3.06371 2.43705 3.22529 2.04861 3.51195 1.76195C3.79861 1.47529 4.18705 1.31371 4.59244 1.3125L4.59375 1.3125Z" fill="black" />
            </svg>),
            id: '',
            bg: 'bg-white',
            textColor: 'text-gray-600'
        },
    ]

    const { register, handleSubmit, formState: { errors }, trigger } = useForm({
        resolver: zodResolver(formSchema),  // Sử dụng schema đã kết hợp
    });

    const onSubmit = (data) => {
        console.log('Dữ liệu form hợp lệ:', data);
    };

    return (
        <div>
            <HeaderSelect title={'Quản lý tiệc'} slugOrID={id} />
            <RequestBreadcrumbsForQuanLyTiec requestId={id} nameLink={'quan-ly-tiec'} />
            <div className='flex gap-[10px]'>
                <div className='ml-auto flex gap-[10px]'>
                    {buttons.map((button, index) => (
                        <ButtonCustomAdmin key={index} title={button.title} svg={button.svg} bgColor={button.bg} textColor={button.textColor}></ButtonCustomAdmin>

                    ))}
                </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='p-4 mt-[30px] w-full bg-whiteAlpha-200 rounded-lg flex flex-col gap-[22px]'>
                    <TitleSpanInfo title={'Thông tin liên hệ'} />
                    <div className='grid grid-cols-3 gap-[30px]'>
                        {inputInfoUser.map((detail, index) => (
                            <InputDetailCustomer
                                key={index}
                                svg={detail.svg}
                                title={detail.title}
                                type={detail.type}
                                name={detail.name}
                                placeholder={detail.placeholder}
                                register={register}
                                error={errors[detail.name]}
                                trigger={trigger}
                            />
                        ))}
                    </div>
                </div>
                <div className='p-4 mt-5 w-full bg-whiteAlpha-200 rounded-lg flex flex-col gap-[22px]'>
                    <TitleSpanInfo title={'Thông tin tổ chức'} />
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
                                register={register}
                                error={errors[detail.name]}
                        trigger={trigger}
                            />
                        ))}
                        <div className='flex flex-col gap-2'>
                            <span className='font-bold leading-6 text-base text-white'>Đồ uống</span>
                            <div className='flex flex-wrap gap-[10px] w-fit'>
                                <div className='bg-white border-1 rounded-lg p-2 flex gap-[6px] text-gray-600 items-center'>
                                    <span className='text-[12px] font-medium leading-4'>Nước uống Aquafina</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
                                        <path opacity="0.5" d="M5 3.88906L8.88906 0L10 1.11094L6.11094 5L10 8.88906L8.88906 10L5 6.11094L1.11094 10L0 8.88906L3.88906 5L0 1.11094L1.11094 0L5 3.88906Z" fill="#1A202C" />
                                    </svg>
                                </div>
                                <div className='bg-white border-1 rounded-lg p-2 flex gap-[6px] text-gray-600 items-center'>
                                    <span className='text-[12px] font-medium leading-4'>Pepsi</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
                                        <path opacity="0.5" d="M5 3.88906L8.88906 0L10 1.11094L6.11094 5L10 8.88906L8.88906 10L5 6.11094L1.11094 10L0 8.88906L3.88906 5L0 1.11094L1.11094 0L5 3.88906Z" fill="#1A202C" />
                                    </svg>
                                </div>
                                <div className='bg-white border-1 rounded-lg p-2 flex gap-[6px] text-gray-600 items-center'>
                                    <span className='text-[12px] font-medium leading-4'>Bia sài gòn bạc</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
                                        <path opacity="0.5" d="M5 3.88906L8.88906 0L10 1.11094L6.11094 5L10 8.88906L8.88906 10L5 6.11094L1.11094 10L0 8.88906L3.88906 5L0 1.11094L1.11094 0L5 3.88906Z" fill="#1A202C" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='p-4 mt-5 w-full bg-whiteAlpha-200 rounded-lg flex flex-col gap-[22px]'>
                    <TitleSpanInfo title={'Thông tin thanh toán'} />
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
                                register={register}
                                error={errors[detail.name]}
                        trigger={trigger}
                            />
                        ))}
                    </div>
                </div>
                <div className='p-4 mt-5 w-full bg-whiteAlpha-200 rounded-lg flex flex-col gap-[22px]'>
                    <TitleSpanInfo title={'Bảng chi phí chi tiết'} />
                    <TableDetail headers={headers} data={data}></TableDetail>
                </div>
                <div className="flex mt-[30px] mr-[30px]">
                    <IconButton className="bg-whiteAlpha-400 ">
                        <ArrowLeftIcon width={20} height={20} color='white' />
                    </IconButton>
                    <div className="ml-auto flex flex-shrink-0 gap-4">
                        <IconButtonSave title={'Hủy'} color={'bg-red-400'}></IconButtonSave>
                        <IconButtonSave title={'Lưu'} color={'bg-teal-400'} type={'submit'}></IconButtonSave>
                    </div>
                </div>

            </form>
        </div>
    );
};

export default ChiTietTiecCuaChiNhanhPage;