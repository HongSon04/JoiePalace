'use client';
import React, { useCallback, useEffect, useState } from 'react';
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
import useApiServices from '@/app/_hooks/useApiServices';
import { API_CONFIG, makeAuthorizedRequest } from '@/app/_utils/api.config';
import { inputInfoUser, inputOrganization, inputsCost } from './InputData';
import { buttons } from './buttons';
import useCustomToast from '@/app/_hooks/useCustomToast';
import { fetchFeedbacksFailure } from '@/app/_lib/features/feedbacks/feedbacksSlice';
import { useDispatch } from 'react-redux';
import { fetchBranchSuccess } from '@/app/_lib/features/branch/branchSlice';
import { formatFullDateTime } from '@/app/_utils/formaters';

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
    organization_date: z.string().nonempty({ message: "Ngày tổ chức là bắt buộc" }),
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
    // remainingAmountPaid: z
    //     .number()
    //     .int({ message: "Số tiền còn lại thanh toán phải là số nguyên" })
    //     .refine((val) => val >= 0, { message: "Số tiền còn lại thanh toán phải lớn hơn hoặc bằng 0" }),
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
const ChiTietTiecCuaChiNhanhPage = ({ params }) => {
    const { id } = params;
    const { makeAuthorizedRequest } = useApiServices();
    const [currentBranch, setCurrentBranch] = useState(null);
    const toast = useCustomToast();
    const showToast = (status, title, description) => {
        toast({ title, description, status });
      };
      const dispatch = useDispatch();
    const headers = ['Dịch vụ', 'Mô tả', 'Thành tiền (VND)'];

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
            options: [],
        },
    ])
    const [statusDeposit, setStatusDeposit] = useState([
        {
            svg: null,
            title: 'Trạng thái đặt cọc',
            type: 'select',
            name: 'is_deposit',
            options: [],
        },
    ])
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
            options: [],
        },
    ])

    const [selectedMenu, setSelectedMenu] = useState(menus[0]?.value || '');
    const [selectBranches, setSelectBranches] = useState(branches[0]?.value || '');
    const [selectedDecors, setSelectedDecors] = useState(decors[0]?.value || '');
    const [selectPartyTypes, setSelectPartyTypes] = useState(partyTypes[0]?.value || '');
    const [selectedStatus, setSelectedStatus] = useState(statusPayment[0]?.value || '');
    const [selectStatusDeposit, setSelectStatusDeposit] = useState(statusDeposit[0]?.value || '');
    
    const [foods, setFoods] = useState([]);
    const [modifiedFoods, setModifiedFoods] = useState([]);
    const [detailCostTable, setDetailCostTable] = useState([]);

    const fetchAllMenus = () => fetchOptions(API_CONFIG.MENU.GET_ALL(), setMenus, 'Menu', 'menu');
    const fetchAllBranches = () => fetchOptions(API_CONFIG.BRANCHES.GET_ALL(), setBranches, 'Sảnh', 'stages');
    const fetchAllDecors = () => fetchOptions(API_CONFIG.DECORS.GET_ALL(), setDecors, 'Decor', 'decors');
    const fetchAllPartyTypes = () => fetchOptions(API_CONFIG.PARTY_TYPES.GET_ALL(), setPartyTypes, 'Loại tiệc', 'partyTypes');

    const { control, handleSubmit, reset, formState: { errors }, trigger } = useForm({
        resolver: zodResolver(organizationSchema),
    });

    const fetchDataDetailsParty = useCallback(async () => {
        try {
            const response = await makeAuthorizedRequest(API_CONFIG.BOOKINGS.GET_BY_ID(id), 'GET');
            const partyData = response.data[0];
            setFoods(partyData.booking_details[0].menus.products);
            if (response) {
                const depositStatus = partyData.booking_details[0].deposit_status;
                const bookingDetails = partyData.booking_details[0];
                const branchId = partyData.branch_id;
                const paymentMethod = bookingDetails.deposits.payment_method;
                const paymentStatusMethod = partyData.status;
                const isDepositSuccessful = depositStatus === 'success';
                const isDeposit = partyData.is_deposit;

                

                setSelectedMenu(partyData.booking_details[0].menu_id);
                setSelectBranches(branchId);
                setSelectedDecors(partyData.booking_details[0].decor_id);
                setSelectPartyTypes(partyData.party_type_id)
                setSelectedStatus(paymentStatusMethod);
                setSelectStatusDeposit(isDeposit ? 'success' : 'pending');
                setPayment(prevPayment => [
                    {
                        ...prevPayment[0],
                        options: [
                            { value: 'momo', label: 'Momo', selected: paymentMethod === 'momo' },
                            { value: 'zalopay', label: 'ZaloPay', selected: paymentMethod === 'zalopay' },
                        ]
                    }
                ]);

                setStatusDeposit(prevStatus => [
                    {
                      ...prevStatus[0],
                      options: [
                        {
                          value: 'success',
                          label: 'Đã thanh toán',
                          selected: isDeposit && isDepositSuccessful,  
                        },
                        {
                          value: 'pending',
                          label: 'Chưa thanh toán',
                          selected: !isDeposit || (isDeposit && !isDepositSuccessful),  
                        },
                      ],
                    },
                  ]);

                setStatusPayment(prevStatus => [
                    {
                        ...prevStatus[0],
                        options: [
                            { value: 'pending', label: 'Đang chờ', selected: paymentStatusMethod === 'pending' },
                            { value: 'processing', label: 'Đang xử lý', selected: paymentStatusMethod === 'processing' },
                            { value: 'success', label: 'Thành công', selected: paymentStatusMethod === 'success' },
                            { value: 'cancel', label: 'Hủy', selected: paymentStatusMethod === 'cancel' },
                        ]
                    }
                ]);
                setDetailCostTable([
                    {
                        service: 'Menu',
                        description: partyData.booking_details[0].menus.products.map((product) => product.name),
                        cost: partyData.booking_details[0].menus.price.toLocaleString('vi', { style: 'currency', currency: 'VND' })
                    },
                    {
                        service: 'Decor',
                        description: partyData.booking_details[0].decors.name,
                        cost: partyData.booking_details[0].decors.price.toLocaleString('vi', { style: 'currency', currency: 'VND' })
                    },
                    {
                        service: 'Loại tiệc',
                        description: partyData.party_types.name,
                        cost: partyData.party_types.price.toLocaleString('vi', { style: 'currency', currency: 'VND' })
                    },
                    {
                        service: 'Âm thanh, ánh sáng, sân khấu, màn hình',
                        description: '',
                        cost: '5.000.000đ'
                    },
                    {
                        service: 'Phí thuê bàn ghế',
                        description: '',
                        cost: '1.000.000đ'
                    },
                    {
                        service: 'Bữa ăn nhẹ cho cô dâu - chú rể',
                        description: '',
                        cost: '100.000đ'
                    },
                    {
                        service: 'MC',
                        description: '',
                        cost: '500.000đ'
                    },
                ]);

                reset({
                    username: partyData.users.username,
                    company_name: partyData.company_name,
                    email: partyData.email || partyData.users.email,
                    phone: partyData.phone || partyData.users.phone,
                    party: partyData.name,
                    tables: Number(partyData.booking_details[0].table_count) || 0,
                    spareTables: Number(partyData.booking_details[0].spare_table_count) || 0,
                    customer: Number(partyData.number_of_guests) || 0,
                    customerAndChair: Number(partyData.booking_details[0].table_count) || 0,
                    partyDate: formatFullDateTime(partyData.created_at).date,
                    organization_date: formatFullDateTime(partyData.organization_date).date,
                    shift: partyData.shift, 
                    menu: partyData.booking_details[0].menu_id,
                    decor: partyData.booking_details[0].decor_id,
                    amountPayable: bookingDetails.total_amount,
                    depositAmount: bookingDetails.deposits.amount,
                    depositDate: formatFullDateTime(bookingDetails.deposits?.created_at).date,
                    // remainingAmountPaid: Number(Number(bookingDetails.total_amount) - Number(bookingDetails.deposits.amount)),
                    payment: bookingDetails.deposits.payment_method,
                    dataPay: formatFullDateTime(bookingDetails.deposits.created_at).date,
                    statusDeposit: isDepositSuccessful ? 'success' : 'pending',
                    statusPayment: statusPayment,
                    foods: partyData.booking_details[0].menus.products
                });
                console.log('organization_date:',formatFullDateTime(partyData.organization_date).date);
            }
        } catch (error) {
            console.error('Error fetching party details:', error);
        }
    }, [id, reset]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const branch = localStorage.getItem("currentBranch");
            if (branch) {
                setCurrentBranch(JSON.parse(branch));
            }
        }
    }, []);

    useEffect(() => {
        fetchDataDetailsParty();
        fetchAllBranches()
        fetchAllMenus();
        fetchAllDecors();
        fetchAllPartyTypes()
    }, [fetchDataDetailsParty]);
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

    const handleDeleteFood = (foodId) => {
        const updatedFoods = foods.filter(food => food.id !== foodId);
        setFoods(updatedFoods);
        setModifiedFoods(prev => [...prev, foodId]);
    };

    const onSubmit = async (data) => {
        const finalFoods = foods.filter(food => !modifiedFoods.includes(food.id));
        const formData = new FormData();
        finalFoods.map((food, index) => {
            formData.append(`foods[${index}][id]`, food.id);
            formData.append(`foods[${index}][name]`, food.name);
        });
        
        const dataform = {
            ...data,
            booking_id: selectBranches,
            branch_id: selectBranches,
            party_type_id: selectPartyTypes,
            decor_id: selectedDecors, 
            stage_id: selectBranches,
            menu_id: selectedMenu,
            name: data.username,
            phone: data.phone,
            email: data.email,
            company_name: data.company_name,
            number_of_guests: data.customer,
            table_count: data.tables,
            spare_table_count: data.spareTables,
            budget: null,
            note: '.',
            amount: data.depositAmount,
            booking_details: [
                    {
                        decor_id: selectedDecors, 
                        menu_id: selectedMenu,
                        table_count: data.tables,
                        spare_table_count: data.spareTables,
                        amount_booking: data.amount,
                        decors: selectedDecors,
                        menus: {
                            products: finalFoods,
                        },
                    }
                ],
            status: selectedStatus,
            is_confirm: selectStatusDeposit === 'success',
            is_deposit: selectStatusDeposit === 'success',
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

        console.log('Dữ liệu form hợp lệ:', dataform);
        console.log('Dữ liệu form hợp lệ:', data);
    };

    const handleError = (message) => {
        dispatch(fetchFeedbacksFailure());
        showToast("error", "Tạo dữ liệu không thành công", message);
      };

    return (
        <div>
            <HeaderSelect title={'Quản lý tiệc'} slugOrID={id} />
            <RequestBreadcrumbsForQuanLyTiec requestId={id} nameLink={currentBranch?.name} slugLink={currentBranch?.slug} />
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
                        <div className='flex flex-col gap-2'>
                            <span className='font-bold leading-6 text-base text-white'>Đồ uống</span>
                            <div className="flex flex-wrap gap-[10px]">
                                {foods.map((food) => (
                                    <div key={food.id} className="bg-white border-1 rounded-lg p-2 flex gap-[6px] text-gray-600 items-center w-fit">
                                        <span className="text-[12px] font-medium leading-4">{food.name}</span>
                                        <button onClick={() => handleDeleteFood(food.id)} className="text-red-500 hover:text-red-700">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
                                                <path opacity="0.5" d="M5 3.88906L8.88906 0L10 1.11094L6.11094 5L10 8.88906L8.88906 10L5 6.11094L1.11094 10L0 8.88906L3.88906 5L0 1.11094L1.11094 0L5 3.88906Z" fill="#1A202C" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
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
                <div className='p-4 mt-5 w-full bg-whiteAlpha-200 rounded-lg flex flex-col gap-[22px]'>
                    <TitleSpanInfo title={'Bảng chi phí chi tiết'} />
                    <TableDetail headers={headers} data={detailCostTable}></TableDetail>
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