'use client';
import React, { useCallback, useEffect, useState } from 'react';
import IconButton from '@/app/_components/IconButton';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import IconButtonSave from '@/app/_components/IconButtonSave';
import TableDetail from '@/app/_components/TableDetailCost';
import ButtonCustomAdmin from '@/app/_components/ButtonCustomAdmin';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useApiServices from '@/app/_hooks/useApiServices';
import { API_CONFIG, makeAuthorizedRequest } from '@/app/_utils/api.config';
import useCustomToast from '@/app/_hooks/useCustomToast';
import { fetchFeedbacksFailure } from '@/app/_lib/features/feedbacks/feedbacksSlice';
import { useDispatch } from 'react-redux';
import { fetchBranchSuccess } from '@/app/_lib/features/branch/branchSlice';
import HeaderSelect from '../[slug]/HeaderSelect';
import RequestBreadcrumbsForQuanLyTiec from '../[slug]/[id]/RequestBreadcrumbsForQuanLyTiec';
import InputDetailCustomer from '../[slug]/[id]/InputDetailCustomer';
import { inputInfoUser, inputOrganization, inputsCost } from '../[slug]/[id]/InputData';
import { buttons } from '../[slug]/[id]/buttons';

const TitleSpanInfo = ({ title }) => (
    <span className="font-semibold text-xl leading-7 text-white">{title}</span>
);

const DropdownField = ({ label, name, options, value, onChange }) => (
    <div className="flex flex-col gap-2">
        <label className="font-bold leading-6 text-base text-white">{label}</label>
        <select
            name={name}
            value={value || ''}
            onChange={onChange}
            className="w-full bg-whiteAlpha-200 text-white rounded-md p-2 font-normal leading-6"
        >
            {options.map(option => (
                <option key={option.value} className="text-black" value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    </div>
);

const organizationSchema = z.object({
    company_name: z.string().optional(),
    email: z.string().email({ message: "Email không hợp lệ" }),
    phone: z
        .string()
        .regex(/^\d+$/, { message: "Số điện thoại phải là số" })
        .min(10, { message: "Số điện thoại phải có ít nhất 10 ký tự" }),
    username: z.string().min(1, { message: "Họ và Tên là bắt buộc" }),
    party: z.string().nonempty({ message: "Loại tiệc không được để chống" }),
    tables: z
        .coerce.number()
        .int({ message: "Số lượng bàn chính phải là số nguyên" })
        .min(1, { message: "Số lượng bàn chính phải lớn hơn 0" }),
    spareTables: z
        .coerce.number()
        .int({ message: "Số bàn dự phòng phải là số nguyên" })
        .min(1, { message: "Số bàn dự phòng phải lớn hơn 0" }),
    customer: z
        .number()
        .int({ message: "Số lượng khách phải là số nguyên" })
        .refine((val) => val > 0, { message: "Số lượng khách lớn hơn 0" }),
    customerAndChair: z
        .coerce.number()
        .int({ message: "Số lượng khách / bàn phải là số nguyên" })
        .min(1, { message: "Số lượng khách / bàn phải lớn hơn 0" }),
    partyDate: z.string().nonempty({ message: "Ngày đặt tiệc là bắt buộc" }),
    dateOrganization: z.string().nonempty({ message: "Ngày tổ chức là bắt buộc" }),
    shift: z.string().nonempty({ message: "Ca hoạt động là bắt buộc" }),
    amountPayable: z
        .number()
        .int({ message: "Số tiền phải thanh toán phải là số nguyên" })
        .refine((val) => val > 0, { message: "Số tiền phải thanh toán lớn hơn 0" }),
    depositAmount: z
        .number()
        .int({ message: "Số tiền cọc phải là số nguyên" })
        .refine((val) => val > 0, { message: "Số tiền cọc lớn hơn 0" }),
    depositDate: z.string().nonempty({ message: "Ngày đặt cọc là bắt buộc" }),
    remainingAmountPaid: z
        .number()
        .int({ message: "Số tiền còn lại thanh toán phải là số nguyên" })
        .refine((val) => val >= 0, { message: "Số tiền còn lại thanh toán phải lớn hơn hoặc bằng 0" }),
    dataPay: z.string().nonempty({ message: "Ngày thanh toán là bắt buộc" }),
});

const fetchOptions = async (apiConfig, setState, title, name) => {
    try {
        const response = await makeAuthorizedRequest(apiConfig, "GET");
        const options = response.data.map(item => ({ value: item.id, label: item.name }));
        setState([{ svg: null, title, type: 'select', name, options }]);
    } catch (error) {
        console.error(`Error fetching ${name} data:`, error);
    }
};
const Page = ({ params }) => {
    const { id } = params;
    const { makeAuthorizedRequest } = useApiServices();
    const [currentBranch, setCurrentBranch] = useState(null);
    const toast = useCustomToast();
    const showToast = (status, title, description) => {
        toast({ title, description, status });
      };
      const dispatch = useDispatch();

    const [menus, setMenus] = useState([
        {
            svg: null,
            title: 'Menu',
            type: 'select',
            name: 'menu',
            options: [],
        },
    ]);
    const [branches, setBranches] = useState([
        {
            svg: null,
            title: 'Sảnh',
            type: 'select',
            name: 'stages',
            options: [],
        },
    ]);
    const [decors, setDecors] = useState([
        {
            svg: null,
            title: 'Sảnh',
            type: 'select',
            name: 'stages',
            options: [],
        },
    ]);
    const [payment, setPayment] = useState([
        {
            svg: null,
            title: 'Hình thức thanh toán',
            type: 'select',
            name: 'payment',
            options: [
                { value: 'momo', label: 'Momo' },
                { value: 'zalopay', label: 'ZaloPay' },
            ],
        },
    ]);
    const [statusDeposit, setStatusDeposit] = useState([
        {
            svg: null,
            title: 'Trạng thái đặt cọc',
            type: 'select',
            name: 'is_deposit',
            options: [
                { value: true, label: 'Đã thanh toán' },
                { value: false, label: 'Chưa thanh toán' },
            ],
        },
    ]);
    const [statusPayment, setStatusPayment] = useState([
        {
            svg: null,
            title: 'Trạng thái thanh toán',
            type: 'select',
            name: 'statusPayment',
            options: [
                { value: 'pending', label: 'Đang chờ' },
                { value: 'processing', label: 'Đang xử lý' },
                { value: 'success', label: 'Thành công' },
                { value: 'cancel', label: 'Hủy' },
            ],
        },
    ]);
    const [partyTypes, setPartyTypes] = useState([
        {
            svg: null,
            title: 'Loại tiệc',
            type: 'select',
            name: 'partyTypes',
            options: [
               
            ],
        },
    ]);

    const [selectedMenu, setSelectedMenu] = useState(menus[0]?.value || '');
    const [selectBranches, setSelectBranches] = useState(branches[0]?.value || '');
    const [selectedDecors, setSelectedDecors] = useState(decors[0]?.value || '');
    const [selectPartyTypes, setSelectPartyTypes] = useState(partyTypes[0]?.value || '');
    const [selectedStatus, setSelectedStatus] = useState(statusPayment[0]?.value || '');
    const [selectStatusDeposit, setSelectStatusDeposit] = useState(statusDeposit[0]?.value || '');

    const fetchAllMenus = () => fetchOptions(API_CONFIG.MENU.GET_ALL(), setMenus, 'Menu', 'menu');
    const fetchAllBranches = () => fetchOptions(API_CONFIG.BRANCHES.GET_ALL(), setBranches, 'Sảnh', 'stages');
    const fetchAllDecors = () => fetchOptions(API_CONFIG.DECORS.GET_ALL(), setDecors, 'Decor', 'decors');
    const fetchAllPartyTypes = () => fetchOptions(API_CONFIG.PARTY_TYPES.GET_ALL(), setPartyTypes, 'Loại tiệc', 'partyTypes');

    const { control, handleSubmit, reset, formState: { errors }, trigger } = useForm({
        resolver: zodResolver(organizationSchema),
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            const branch = localStorage.getItem("currentBranch");
            if (branch) {
                setCurrentBranch(JSON.parse(branch));
            }
        }
    }, []);

    useEffect(() => {
        fetchAllBranches()
        fetchAllMenus();
        fetchAllDecors();
        fetchAllPartyTypes()
    }, []);
    const handleFieldChange = (fieldSetter, triggerField, resetField = null) => (event) => {
        const value = event.target.value;
        fieldSetter(value);
    
        if (resetField) {
            reset({ [resetField]: value });
        }
        trigger(triggerField);
    };
    
    const handleMenuChange = handleFieldChange(setSelectedMenu, 'menu');
    const handleBranchChange = handleFieldChange(setSelectBranches, 'stages');
    const handleDecorsChange = handleFieldChange(setSelectedDecors, 'decor');
    const handlePartyTypesChange = handleFieldChange(setSelectPartyTypes, 'partyTypes');
    const handlePaymentChange = handleFieldChange(() => {}, 'payment', 'payment');
    const handleStatusPaymentChange = handleFieldChange(setSelectedStatus, 'statusPayment', 'statusPayment');
    const handleStatusDepositChange = handleFieldChange(() => {}, 'statusDeposit', 'statusDeposit');

    const onSubmit = async (data) => {
        const dataform = {
            
        }

        try {
            const updateBranches = await makeAuthorizedRequest(API_CONFIG.BOOKINGS.UPDATE(id), "PATCH", dataform);

            if (updateBranches.success) {
                dispatch(fetchBranchSuccess(updateBranches.data));
                showToast("success", "Tạo dữ liệu chi nhánh thành công", "Phản hồi đã được duyệt. Đang lấy dữ liệu mới");
            }
        } catch (error) {
            console.log(error);
            handleError("Đã xảy ra lỗi");
        }

        console.log('Dữ liệu form hợp lệ:', data);
    };

    const handleError = (message) => {
        dispatch(fetchFeedbacksFailure());
        showToast("error", "Tạo dữ liệu không thành công", message);
      };

    return (
        <div>
            <HeaderSelect title={'Quản lý tiệc'} slugOrID={'Thêm tiệc'} />
            <RequestBreadcrumbsForQuanLyTiec requestId={''} nameLink={currentBranch?.name} slugLink={''} />
            <div className='flex gap-[10px]'>
                <div className='ml-auto flex gap-[10px]'>
                    {buttons.map((button, index) => (
                        <ButtonCustomAdmin key={index} title={button.title} svg={button.svg} bgColor={button.bg} textColor={button.textColor} onClick={buttons.onClick}></ButtonCustomAdmin>
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
                                error={errors[detail.name]}
                                trigger={trigger}
                                control={control}
                            />
                        ))}
                    </div>
                </div>
                <div className='p-4 mt-5 w-full bg-whiteAlpha-200 rounded-lg flex flex-col gap-[22px]'>
                    <TitleSpanInfo title={'Thông tin tổ chức'} />
                    <div className='grid grid-cols-3 gap-[30px]'>
                        {partyTypes.map((party, index) => (
                            <DropdownField
                                key={index}
                                label={party.title}
                                name={party.name}
                                options={party.options}
                                value={selectPartyTypes}
                                onChange={handlePartyTypesChange}
                            />
                        ))}
                        {inputOrganization.map((detail, index) => (
                            <InputDetailCustomer
                                key={index}
                                svg={detail.svg}
                                title={detail.title}
                                type={detail.type}
                                name={detail.name}
                                placeholder={detail.placeholder}
                                options={detail.options}
                                error={errors[detail.name]}
                                trigger={trigger}
                                control={control}
                            />
                        ))}
                        {decors.map((decor, index) => (
                            <DropdownField
                                key={index}
                                label={decor.title}
                                name={decor.name}
                                options={decor.options}
                                value={selectedDecors}
                                onChange={handleDecorsChange}
                            />
                        ))}
                        {branches.map((branch, index) => (
                            <DropdownField
                                key={index}
                                label={branch.title}
                                name={branch.name}
                                options={branch.options}
                                value={selectBranches}
                                onChange={handleBranchChange}
                            />
                        ))}
                        {menus.map((menu, index) => (
                            <DropdownField
                                key={index}
                                label={menu.title}
                                name={menu.name}
                                options={menu.options}
                                value={selectedMenu}
                                onChange={handleMenuChange}
                            />
                        ))}
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
                                error={errors[detail.name]}
                                trigger={trigger}
                                control={control}
                            />
                        ))}
                        {payment.map((payment, index) => (
                            <DropdownField
                                key={index}
                                label={payment.title}
                                name={payment.name}
                                options={payment.options}
                                value={payment.value}
                                onChange={handlePaymentChange}
                            />
                        ))}
                        {statusPayment.map((payment, index) => (
                            <div className='flex flex-col gap-2' key={index}>
                                <label className='font-bold leading-6 text-base text-white'>{payment.title}</label>
                                {payment.type === 'select' && (
                                    <select
                                        name={payment.name}
                                        value={selectedStatus}
                                        onChange={handleStatusPaymentChange}
                                        className="w-full bg-whiteAlpha-200 text-white rounded-md p-2 font-normal leading-6"
                                    >
                                        {payment.options.map(option => (
                                            <option key={option.value} className="text-black" value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        ))}
                        {statusDeposit.map((status, index) => (
                            <DropdownField
                                key={index}
                                label={status.title}
                                name={status.name}
                                options={status.options}
                                value={selectStatusDeposit} 
                                onChange={handleStatusDepositChange}
                            />
                        ))}
                    </div>
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

export default Page;