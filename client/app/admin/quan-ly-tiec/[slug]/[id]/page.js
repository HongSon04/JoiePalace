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
import { formatDateTime, formatFullDateTime } from '@/app/_utils/formaters';
import { organizationSchema } from './organizationSchema';
import { DropdownField } from './DropdownField';

const TitleSpanInfo = ({ title }) => (
    <span className="font-semibold text-xl leading-7 text-white">{title}</span>
);

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
    const [stages, setStages] = useState([
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
                { value: 'momo', label: 'Momo', selected: false },
                { value: 'zalopay', label: 'ZaloPay', selected: false },
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
                { value: 'success', label: 'Đã thanh toán', selected: false },
                { value: 'pending', label: 'Chưa thanh toán', selected: false },
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
            options: [],
        },
    ])

    const [selectedMenu, setSelectedMenu] = useState(menus[0]?.value || '');
    const [selectStages, setSelectStages] = useState(stages[0]?.value || '');
    const [selectedDecors, setSelectedDecors] = useState(decors[0]?.value || '');
    const [selectPartyTypes, setSelectPartyTypes] = useState(partyTypes[0]?.value || '');
    const [selectedStatus, setSelectedStatus] = useState(statusPayment[0]?.value || '');
    const [selectStatusDeposit, setSelectStatusDeposit] = useState(statusDeposit[0]?.value || '');

    const [foods, setFoods] = useState([]);
    const [menuPrice, setMenuPrice] = useState('');
    const [partyPrice, setPartyPrice] = useState('');
    const [stagePrice, setStagePrice] = useState('');
    const [decorPrice, setDecorPrice] = useState('');
    const [limitStages, setLimitStages] = useState('');
    const [modifiedFoods, setModifiedFoods] = useState([]);
    const [detailCostTable, setDetailCostTable] = useState([]);

    const [branch_id, setBranch_id] = useState();

    const fetchAllStages = async (id) => {
        try {
            const response = await makeAuthorizedRequest(API_CONFIG.STAGES.GET_ALL(id), 'GET');
            const stageData = response.data;
            const options = stageData.length === 0
                ? [{ value: '', label: 'Chưa có sảnh' }]
                : stageData.map(item => ({ value: item.id, label: item.name }));
            setStages([{
                title: 'Sảnh',
                type: 'select',
                options
            }]);
            const initialStage = options.find(option => option.value === setSelectStages) || options[0];
            setSelectStages(initialStage?.value || '');
        } catch (error) {
            console.log(error)
        }
    }
    const fetchAllMenus = () => fetchOptions(API_CONFIG.MENU.GET_ALL(), setMenus, 'Menu', 'menu');

    const fetchAllDecors = () => fetchOptions(API_CONFIG.DECORS.GET_ALL(), setDecors, 'Decor', 'decors');
    const fetchAllPartyTypes = () => fetchOptions(API_CONFIG.PARTY_TYPES.GET_ALL(), setPartyTypes, 'Loại tiệc', 'partyTypes');

    const { control, handleSubmit, setValue, reset, formState: { errors }, trigger } = useForm({
        resolver: zodResolver(organizationSchema),
        defaultValues: {
            menu: '',
            stages: '',
            decors: '',
            partyTypes: '',
            statusPayment: '',
            statusDeposit: '',
            payment: ''
        },
    });

    const fetchDataDetailsParty = useCallback(async () => {
        try {
            const response = await makeAuthorizedRequest(API_CONFIG.BOOKINGS.GET_BY_ID(id), 'GET');
            const partyData = response.data[0];
            fetchAllStages(partyData.stage_id)
            if (partyData) {

                const bookingDetails = partyData.booking_details[0] || {};
                const depositStatus = bookingDetails.deposit_status;
                setBranch_id(partyData.branch_id);
                const paymentMethod = bookingDetails.deposits?.payment_method;
                const paymentStatusMethod = partyData.status;
                const isDepositSuccessful = depositStatus === 'success';
                const isDeposit = partyData.is_deposit;

                setFoods(bookingDetails.menus?.products);
                setMenuPrice(bookingDetails.menus?.price || 0);
                setPartyPrice(partyData.party_types?.price || 0);
                setStagePrice(partyData.stages?.price || 0);
                setDecorPrice(bookingDetails.decors?.price || 0);

                setSelectedMenu(bookingDetails.menu_id);
                setLimitStages(partyData.stages.capacity_max)
                setSelectStages(partyData.stage_id);

                setSelectedDecors(bookingDetails.decor_id);
                setSelectPartyTypes(partyData.party_type_id);
                setSelectedStatus(paymentStatusMethod);
                setSelectStatusDeposit(isDeposit ? 'success' : 'pending');
                setPayment(prevPayment => [
                    {
                        ...prevPayment[0],
                        options: prevPayment[0].options.map(option => ({
                            ...option,
                            selected: option.value === paymentMethod,
                        })),
                    },
                ]);
                setStatusDeposit(prevStatus => [
                    {
                        ...prevStatus[0],
                        options: prevStatus[0].options.map(option => ({
                            ...option,
                            selected: option.value === (isDepositSuccessful ? 'success' : 'pending'),
                        })),
                    },
                ]);

                setStatusPayment(prevStatus => [
                    {
                        ...prevStatus[0],
                        options: prevStatus[0].options.map(option => ({
                            ...option,
                            selected: option.value === paymentStatusMethod,
                        })),
                    },
                ]);

                setDetailCostTable([
                    {
                        service: 'Menu',
                        description: bookingDetails.menus?.products.map((product) => product.name),
                        cost: bookingDetails.menus?.price.toLocaleString('vi', { style: 'currency', currency: 'VND' }) || 0
                    },
                    {
                        service: 'Decor',
                        description: bookingDetails.decors?.name || '',
                        cost: bookingDetails.decors?.price.toLocaleString('vi', { style: 'currency', currency: 'VND' }) || 0
                    },
                    {
                        service: 'Loại tiệc',
                        description: partyData.party_types?.name || '',
                        cost: partyData.party_types?.price.toLocaleString('vi', { style: 'currency', currency: 'VND' }) || 0
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
                    username: partyData.users.username || partyData.name || '',
                    company_name: partyData.company_name,
                    email: partyData.email || partyData.users?.email,
                    phone: partyData.phone || partyData.users?.phone,
                    party: partyData.name || '',
                    customerAndChair: 10,
                    tables: Number(bookingDetails.table_count) || 0,
                    spare_table_count: Number(bookingDetails.spare_table_count) || 0,
                    customer: Number(partyData.number_of_guests) || 0,
                    partyDate: partyData.created_at.slice(0, 10) || '',
                    organization_date: partyData.organization_date.slice(0, 10) || '',
                    shift: partyData.shift,
                    menu: bookingDetails.menu_id || 1,
                    decor: bookingDetails.decor_id || 1,
                    total_amount: bookingDetails.total_amount,
                    depositAmount: bookingDetails.deposits?.amount,
                    amount_booking: bookingDetails.amount_booking,
                    depositDate: bookingDetails.deposits?.created_at.slice(0, 10) || '',
                    payment: bookingDetails.deposits?.payment_method,
                    dataPay: bookingDetails.deposits?.created_at.slice(0, 10) || '',
                    statusDeposit: isDepositSuccessful ? 'success' : 'pending',
                    statusPayment: statusPayment,
                    foods: bookingDetails.menus?.products,
                    menus_price: bookingDetails.menus?.price || 0
                });
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
        fetchAllStages()
        fetchAllMenus();
        fetchAllDecors();
        fetchAllPartyTypes()
    }, [fetchDataDetailsParty]);
    const handleFieldChange = (fieldSetter, triggerField, resetField = null) => (event) => {
        const value = event.target.value;
        fieldSetter(value);

        if (resetField) {
            setValue(resetField, value);
        }

        trigger(triggerField);
    };

    const handleMenuChange = handleFieldChange(setSelectedMenu, 'menu');
    const handleStageChange = handleFieldChange(setSelectStages, 'stages');
    const handleDecorsChange = handleFieldChange(setSelectedDecors, 'decor');
    const handlePartyTypesChange = handleFieldChange(setSelectPartyTypes, 'partyTypes');
    const handlePaymentChange = handleFieldChange(() => { }, 'payment', 'payment');
    const handleStatusPaymentChange = handleFieldChange(setSelectedStatus, 'statusPayment', 'statusPayment');
    const handleStatusDepositChange = handleFieldChange(() => { }, 'statusDeposit', 'statusDeposit');

    const handleDeleteFood = (foodId) => {
        const updatedFoods = foods.filter(food => food.id !== foodId);
        setFoods(updatedFoods);
        setModifiedFoods(prev => [...prev, foodId]);
    };

    console.log(selectStages)

    const onSubmit = async (data) => {
        const finalFoods = foods.filter(food => !modifiedFoods.includes(food.id));

        // Định nghĩa các giá trị đơn giá
        const table_price = 200000; // Giá mỗi bàn
        const chair_price = 50000; // Giá mỗi ghế

        // Tổng tiền bàn chính
        const total_table_price = data.tables * table_price;

        // Tổng tiền bàn dự phòng
        const total_table_price_backup = data.spare_table_count * table_price;

        // Tổng tiền ghế chính
        const total_chair_price = data.tables * data.customerAndChair * chair_price;

        // Tổng tiền ghế dự phòng
        const total_chair_price_backup = data.spare_table_count * data.customerAndChair * chair_price;

        // Tổng tiền menu (cho bàn chính)
        const total_menus = data.tables * menuPrice;

        // Tính tổng tiền amount
        const total_amount_all = total_table_price + total_table_price_backup + total_chair_price + total_chair_price_backup + decorPrice + partyPrice + stagePrice + total_menus;

        console.log(total_amount_all)

        const dataform = {
            ...data,
            branch_id: branch_id,
            party_type_id: selectPartyTypes || 1,
            decor_id: Number(selectedDecors) || 1,
            stage_id: Number(selectStages) || 1,
            menu_id: Number(selectedMenu) || 1,
            name: data.username,
            phone: data.phone,
            email: data.email,
            company_name: data.company_name,
            number_of_guests: data.customer,
            table_count: data.tables,
            spare_table_count: data.spare_table_count,
            budget: null,
            note: '.',
            amount: total_amount_all,
            booking_details: [
                {
                    decor_id: Number(selectedDecors) || 1,
                    menu_id: Number(selectedMenu) || 1,
                    total_amount: data.total_amount,
                    table_count: data.tables,
                    spare_table_count: data.spare_table_count,
                    decors: selectedDecors,
                    menus: {
                        price: data.menus_price,
                        products: finalFoods,
                    },
                }
            ],
            status: selectedStatus,
            is_confirm: true,
            is_deposit: true,
        }
        try {
            const updateBranches = await makeAuthorizedRequest(API_CONFIG.BOOKINGS.UPDATE(id), "PATCH", dataform);

            if (updateBranches.success) {
                dispatch(fetchBranchSuccess(updateBranches.data));
                showToast("success", "Tạo dữ liệu chi nhánh thành công", "Phản hồi đã được duyệt. Đang lấy dữ liệu mới");
            } else {
                handleError("Đã xảy ra lỗi");
            }
        } catch (error) {
            console.log(error);
            handleError(error);
        }
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
            {limitStages && (
                <span className='text-red-400 font-medium text-base'>*Số lượng bàn chính thức của sảnh chỉ đối đa là {limitStages}</span>
            )}
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
                        {stages.map((stage, index) => (
                            <DropdownField
                                key={index}
                                label={stage.title}
                                name={stage.name}
                                options={stage.options}
                                value={selectStages}
                                onChange={handleStageChange}
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