'use client';
import React, { useCallback, useEffect, useState } from 'react';
import IconButton from '@/app/_components/IconButton';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import IconButtonSave from '@/app/_components/IconButtonSave';
import ButtonCustomAdmin from '@/app/_components/ButtonCustomAdmin';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useApiServices from '@/app/_hooks/useApiServices';
import { API_CONFIG, makeAuthorizedRequest } from '@/app/_utils/api.config';
import { useDispatch } from 'react-redux';
import { fetchBranchSuccess } from '@/app/_lib/features/branch/branchSlice';
import HeaderSelect from '../[slug]/HeaderSelect';
import RequestBreadcrumbsForQuanLyTiec from '../[slug]/[id]/RequestBreadcrumbsForQuanLyTiec';
import InputDetailCustomer from '../[slug]/[id]/InputDetailCustomer';

import { buttons } from '../[slug]/[id]/buttons';
import { formatFullDateTime } from '@/app/_utils/formaters';
import { organizationSchema } from '../[slug]/[id]/organizationSchema';
import { DropdownField } from '../[slug]/[id]/DropdownField';
import { inputInfoUser, inputOrganization, inputsCost } from './InputDataADD';
import useCustomToast from '@/app/_hooks/useCustomToast';

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
const Page = () => {
    const { makeAuthorizedRequest } = useApiServices();
    const [currentBranch, setCurrentBranch] = useState(null);
    useEffect(() => {
        const branch = localStorage.getItem("currentBranch");
        if (typeof window !== "undefined") {
            if (branch) {
                setCurrentBranch(JSON.parse(branch));
            }
        }
    }, []);

    
    useEffect(() => {
        fetchAllDecors();
        fetchAllPartyTypes()
        fetchAllStages();
    }, [currentBranch]);

    const toast = useCustomToast();
    const dispatch = useDispatch();

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
    // const [statusDeposit, setStatusDeposit] = useState([
    //     {
    //         svg: null,
    //         title: 'Trạng thái đặt cọc',
    //         type: 'select',
    //         name: 'is_deposit',
    //         options: [
    //             { value: 'success', label: 'Đã thanh toán', selected: false },
    //             { value: 'pending', label: 'Chưa thanh toán', selected: false },
    //         ],
    //     },
    // ]);
    // const [statusPayment, setStatusPayment] = useState([
    //     {
    //         svg: null,
    //         title: 'Trạng thái thanh toán',
    //         type: 'select',
    //         name: 'statusPayment',
    //         options: [
    //             { value: 'pending', label: 'Đang chờ' },
    //             { value: 'processing', label: 'Đang xử lý' },
    //             { value: 'success', label: 'Thành công' },
    //             { value: 'cancel', label: 'Hủy' },
    //         ],
    //     },
    // ]);
    const [partyTypes, setPartyTypes] = useState([
        {
            svg: null,
            title: 'Loại tiệc',
            type: 'select',
            name: 'partyTypes',
            options: [],
        },
    ])

    const [selectStages, setSelectStages] = useState('');
    const [selectedDecors, setSelectedDecors] = useState('');
    const [selectPartyTypes, setSelectPartyTypes] = useState('');
    // const [selectedStatus, setSelectedStatus] = useState(statusPayment[0]?.value || '');
    // const [selectStatusDeposit, setSelectStatusDeposit] = useState(statusDeposit[0]?.value || '');
    const [limitStages, setLimitStages] = useState(0);

    const fetchLimitStages = async (stageId) => {
        try {
            const response = await makeAuthorizedRequest(API_CONFIG.STAGES.GET_ALL_BY_STAGE_ID(stageId), 'GET');
            const limitStagesData = response.data[0];
            setLimitStages(limitStagesData.capacity_max || 0);
        } catch (error) {
            console.error(error);
        }
    };
    const fetchAllStages = async () => {
        try {
            const response = await makeAuthorizedRequest(API_CONFIG.STAGES.GET_ALL_BY_BRANCH(currentBranch.id), 'GET');
            const stageData = response.data;
    
            const options = stageData.length === 0
                ? [{ value: '', label: 'Chưa có sảnh', capacity_max: 0 }]
                : stageData.map(item => ({
                    value: item.id,
                    label: item.name,
                    capacity_max: item.capacity_max,
                }));
            
            setStages([
                {
                    title: 'Sảnh',
                    type: 'select',
                    options,
                },
            ]);
            
            if (!selectStages) {
                const initialStage = options[0];
                setSelectStages(initialStage?.value || '');
                setLimitStages(initialStage?.capacity_max || 0);
            }
        } catch (error) {
            console.error(error);
        }
    };
    
    const fetchAllDecors = () => fetchOptions(API_CONFIG.DECORS.GET_ALL(), setDecors, 'Decor', 'decors');
    const fetchAllPartyTypes = () => fetchOptions(API_CONFIG.PARTY_TYPES.GET_ALL(), setPartyTypes, 'Loại tiệc', 'partyTypes');

    const { control, handleSubmit, reset, setValue, formState: { errors }, trigger } = useForm({
        resolver: zodResolver(organizationSchema),
        defaultValues: {
            menu: '',
            stages: '',
            decors: '',
            partyTypes: '',
            customerAndChair: 10,
            // statusPayment: '',
            // statusDeposit: '',
            payment: '',
            total_amount: 0,
            depositAmount: 0
        },
    });

    const handleFieldChange = (fieldSetter, triggerField, resetField = null) => (event) => {
        const value = event.target.value;
        fieldSetter(value);

        if (resetField) {
            setValue(resetField, value);
        }

        trigger(triggerField);
    };

    const handleStageChange = async (event) => {
        const selectedStageId = event.target.value;
        setSelectStages(selectedStageId);
        fetchLimitStages(selectedStageId);

    };
    const handleDecorChange = (event) => {
        const selectedDecorId = event.target.value;
        setSelectedDecors(selectedDecorId);

    };
    const handlePartyTypeChange = (event) => {
        const selectedPartyTypeId = event.target.value;
        setSelectPartyTypes(selectedPartyTypeId);
    };
    const handlePaymentChange = handleFieldChange(() => {}, 'payment', 'payment');
    // const handleStatusPaymentChange = handleFieldChange(setSelectedStatus, 'statusPayment', 'statusPayment');
    // const handleStatusDepositChange = handleFieldChange(setSelectStatusDeposit, 'statusDeposit', 'statusDeposit');

    const onSubmit = async (data) => {
        const user = JSON.parse(localStorage.getItem("user"));

        if(!user){
            toast({
                title: "Lỗi",
                description: "Vui lòng đăng nhập",
                type: "error",
              });
        }
        setValue('total_amount', 0);
        setValue('depositAmount', 0);

        const dataform = {
            ...data,
            user_id: user.id,
            branch_id: currentBranch.id,
            party_type_id: Number(selectPartyTypes),
            stage_id: Number(selectStages),
            name: data.username,
            phone: data.phone,
            email: data.email,
            company_name: data.company_name,
            shift: data.shift,
            organization_date: formatFullDateTime(data.organization_date).date,
            number_of_guests: data.customer,
            // status: setStatusPayment,
            amount: data.total_amount,
            "users": {
                id: user.id,
                username: data.username,
                email: data.email,
                phone: data.phone,
            },

        }
        try {
            const updateBranches = await makeAuthorizedRequest(API_CONFIG.BOOKINGS.CREATE, "POST", dataform);

            if (updateBranches.success) {
                dispatch(fetchBranchSuccess(updateBranches.data));
                toast({
                    title: "Tạo dữ liệu thành công",
                    description: "Đã xử lý thành công dữ liệu",
                    type: "success",
                    });
            } else{
                const { statusCode, message } = updateBranches.error || {};
                if (statusCode == 401) {
                    toast({
                      title: "Phiên đăng nhập đã hết hạn",
                      description: "Vui lòng đăng nhập lại để thực hiện tác vụ",
                      type: "error",
                    });
                  } else {
                    toast({
                      title: "Cập nhật thất bại",
                      description: message,
                      type: "error",
                    });
                  }
            }
        } catch (error) {
            console.log(error);
            const { message } = error.response?.data || { message: "Đã xảy ra lỗi" };
            toast("error", "Cập nhật thất bại", message);
        }
        console.log('Dữ liệu form hợp lệ:', dataform);
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
            {limitStages > 0 && (
                <span className='text-red-400 font-medium text-base'>
                    *Số lượng bàn chính thức và bàn dự phòng của sảnh chỉ tối đa là {limitStages}
                </span>
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
                                onChange={handlePartyTypeChange}
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
                                onChange={handleDecorChange}
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
                        {/* {statusPayment.map((payment, index) => (
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
                        ))} */}
                        {/* {statusDeposit.map((status, index) => (
                            <DropdownField
                                key={index}
                                label={status.title}
                                name={status.name}
                                options={status.options}
                                value={selectStatusDeposit} 
                                onChange={handleStatusDepositChange}
                            />
                        ))} */}
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