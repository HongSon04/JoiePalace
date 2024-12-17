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
import { API_CONFIG } from '@/app/_utils/api.config';
import { inputInfoUser, inputOrganization, inputsCost } from './InputData';
import { buttons } from './buttons';
import useCustomToast from '@/app/_hooks/useCustomToast';
import { useDispatch } from 'react-redux';
import { fetchBranchSuccess } from '@/app/_lib/features/branch/branchSlice';
import { organizationSchema } from './organizationSchema';
import { DropdownField } from './DropdownField';
import { DropDownSelect2 } from './DropDownSelect2';
import { FoodsTitle, TitleSpanInfo } from './ServiceMethod';
import { useRouter } from 'next/navigation';

const Page = ({ params }) => {
    const { id } = params;
    const { makeAuthorizedRequest } = useApiServices();
    const [currentBranch, setCurrentBranch] = useState(null);
    const toast = useCustomToast();
    const router = useRouter();
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
            title: 'Decors - Trang trí',
            type: 'select',
            name: 'decor',
            options: [],
        },
    ]);

    const [statusDeposit, setStatusDeposit] = useState([
        {
            svg: null,
            title: 'Trạng thái đặt cọc',
            type: 'select',
            name: 'is_deposit',
            options: [
                { value: true, label: 'Đã đặt cọc', selected: false },
                { value: false, label: 'Chưa đặt cọc', selected: false },
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
    const [statusBookings, setStatusBookings] = useState([
        {
            svg: null,
            title: 'Trạng thái tiệc',
            type: 'select',
            name: 'statusBookings',
            options: [
                { value: 'pending', label: 'Đang chờ' },
                { value: 'processing', label: 'Đang xử lý' },
                { value: 'success', label: 'Thành công' },
                { value: 'cancel', label: 'Hủy' },
            ],
        },
    ])

    const [extraServices, setExtraServices] = useState([
        {
            svg: null,
            title: 'Dịch vụ phát sinh',
            type: 'select',
            name: 'extra_service',
            options: [
                { value: null, label: 'Không chọn', id: 0 },
            ],
        },
    ]);
    const [otherServices, setOtherServices] = useState([
        {
            svg: null,
            title: 'Dịch vụ thêm',
            type: 'select',
            name: 'other_service',
            options: [
                { value: null, label: 'Không chọn', id: 0 },
            ],
        },
    ]);

    const [selectedMenu, setSelectedMenu] = useState('');
    const [selectStages, setSelectStages] = useState('');
    const [selectedDecors, setSelectedDecors] = useState('');
    const [selectPartyTypes, setSelectPartyTypes] = useState('');
    const [selectStatusBookings, setSelectStatusBookings] = useState('');
    const [selectStatusDeposit, setSelectStatusDeposit] = useState(false);

    const [selectExtraServices, setSelectExtraServices] = useState(null);
    const [selectExtraDishes, setSelectExtraDishes] = useState([]);

    const [selectOtherServices, setSelectOtherServices] = useState(null);
    const [selectOtherDishes, setSelectOtherDishes] = useState([]);
    const [bookingDetails, setBookingDetails] = useState(null);

    const [foods, setFoods] = useState({
        nuocUong: [],
        monChinh: [],
        montrangMieng: [],
        monkhaivi: []

    });
    const [menuPrice, setMenuPrice] = useState(0);
    const [partyPrice, setPartyPrice] = useState(0);
    const [stagePrice, setStagePrice] = useState(0);
    const [decorPrice, setDecorPrice] = useState(0);
    const [limitStages, setLimitStages] = useState(0);
    const [detailCostTable, setDetailCostTable] = useState([]);

    const [branch_id, setBranch_id] = useState();

    const { control, handleSubmit, setValue, reset, formState: { errors }, trigger } = useForm({
        resolver: zodResolver(organizationSchema),
        defaultValues: {
            customerAndChair: 10,
            total_amount: 0,
            depositAmount: 0,
            table_count: 0,
            spare_table_count: 0,
        },
    });
    const fetchAllStages = async (branchId) => {
        try {
            const response = await makeAuthorizedRequest(API_CONFIG.STAGES.GET_ALL_BY_BRANCH(branchId), 'GET');
    
            if (!response.data || response.data.length === 0) {
                setStages([{ title: 'Sảnh', type: 'select', options: [{ value: '', label: 'Chưa có sảnh', capacity_max: 0 }] }]);
                setSelectStages('');
                setLimitStages(0);
                setStagePrice(0);
                return;
            }
    
            const options = response.data.map(item => ({
                value: item.id,
                label: item.name,
                price: item.price,
                capacity_max: item.capacity_max,
            }));
    
            setStages([{ title: 'Sảnh', type: 'select', options: options }]);
    
            if (options.length === 1) {
                const firstStage = options[0];
                setSelectStages(firstStage.value);
                setStagePrice(firstStage.price || 0);
                setLimitStages(firstStage.capacity_max || 0);
            } else if (!selectStages && options.length > 0) {
                const firstStage = options[0];
                setSelectStages(firstStage.value);
                setStagePrice(firstStage.price || 0);
                setLimitStages(firstStage.capacity_max || 0);
            }
        } catch (error) {
            console.error('Error fetching stages:', error);
        }
    };
    const fetchAllMenus = async () => {
        try {
            const response = await makeAuthorizedRequest(API_CONFIG.MENU.GET_ALL({itemsPerPage: '99'}), 'GET');
            const menuOptions = response.data.map(menu => ({
                value: menu.id,
                label: menu.name,
                price: menu.price,
            }));
    
            setMenus([{ ...menus[0], options: menuOptions }]);
            if (!selectedMenu && menuOptions.length > 0) {
                const firstMenu = menuOptions[0];
                setSelectedMenu(firstMenu.value);
                setMenuPrice(firstMenu.price);
                await fetchFoodsByMenuId(firstMenu.value);
            }
        } catch (error) {
            console.error('Error fetching menus:', error);
        }
    };
    
    const fetchFoodsByMenuId = async (menuId) => {
        if (!menuId) {
            return;
        }
        try {
            const response = await makeAuthorizedRequest(API_CONFIG.MENU.GET_BY_ID(menuId), 'GET');

            if (response.data && response.data.length > 0) {
                const products = response.data[0].products;

                const categorizedFoods = {
                    nuocUong: products['nuoc-uong'] || products['do-uong'] || [],
                    monChinh: products['mon-chinh'] || [],
                    montrangMieng: products['trang-mieng'] || [],
                    monkhaivi: products['mon-khai-vi'] || [],
                };

                setFoods(categorizedFoods);
            } else {
                console.warn('Không có sản phẩm trong phản hồi:', response.data);
                setFoods({
                    nuocUong: [],
                    monChinh: [],
                    montrangMieng: [],
                    monkhaivi: [],
                });
            }
        } catch (error) {
            console.error('Error fetching foods:', error);
            setFoods({
                nuocUong: [],
                monChinh: [],
                montrangMieng: [],
                monkhaivi: [],
            });
        }
    };
    const fetchAllDecors = async () => {
        try {
            const response = await makeAuthorizedRequest(API_CONFIG.DECORS.GET_ALL(), 'GET');
            const decorOptions = response.data.map(decor => ({
                value: Number(decor.id),
                label: decor.name,
                price: decor.price,
            }));

            setDecors(prevDecors => [{ ...prevDecors[0], options: decorOptions }]);

            if (decorOptions.length === 1) {
                setSelectedDecors(decorOptions[0].value);
                setDecorPrice(decorOptions[0].price);
            } else if (!selectedDecors && decorOptions.length > 0) {
                setSelectedDecors(decorOptions[0].value);
                setDecorPrice(decorOptions[0].price);
            }

            return decorOptions;
        } catch (error) {
            console.error('Error fetching decors:', error);
            return []; // Trả về mảng rỗng nếu có lỗi
        }
    };
    const fetchAllPartyTypes = async () => {
        try {
            const response = await makeAuthorizedRequest(API_CONFIG.PARTY_TYPES.GET_ALL(), 'GET');
            const partyTypeOptions = response.data.map(partyType => ({
                value: partyType.id,
                label: partyType.name,
                price: partyType.price,
            }));

            setPartyTypes([{ ...partyTypes[0], options: partyTypeOptions }]);

            if (!selectPartyTypes && partyTypeOptions.length) {
                setSelectPartyTypes(partyTypeOptions[0].value);
                setPartyPrice(partyTypeOptions[0].price);
            }
        } catch (error) {
            console.error('Error fetching party types:', error);
        }
    };
    const fetchPackageForExtraServices = async () => {
        try {
            const response = await makeAuthorizedRequest(API_CONFIG.PRODUCTS.GET_SERVICES(), 'GET');
            if (response.statusCode === 200) {
                const categories = Object.entries(response.data).map(([categoryName, services]) => ({
                    category: categoryName,
                    items: services.map(service => ({
                        value: service.id,
                        label: service.name,
                        price: service.price,
                    })),
                }));

                const optionsWithDefault = [
                    { category: 'Chọn dịch vụ', items: [{ value: '', label: 'Không chọn' }] },
                    ...categories,
                ];

                setExtraServices(prev => [{ ...prev[0], options: optionsWithDefault }]);
            } else {
                console.error('Không có dữ liệu hợp lệ');
            }
        } catch (error) {
            console.error('Lỗi khi lấy dịch vụ phát sinh:', error);
        }
    };

    const fetchPackageForOtherServices = async () => {
        try {
            const response = await makeAuthorizedRequest(API_CONFIG.CATEGORIES.GET_BY_ID(9), 'GET');
            const childrenServices = response.data[0]?.childrens || [];
            if (childrenServices.length === 0) {
                console.error('Không có dịch vụ con nào trong childrenServices');
                return;
            }
            const options = childrenServices.flatMap(child =>
                child.products.map(product => ({
                    value: product.id,
                    label: product.name,
                    price: product.price,
                }))
            );

            const optionsWithDefault = [
                { category: 'Chọn dịch vụ', items: [{ value: '', label: 'Không chọn' }] },
                ...options,
            ];
            setOtherServices(prev => [{ ...prev[0], options: optionsWithDefault }]);
        } catch (error) {
            console.error('Lỗi khi lấy dịch vụ khác:', error);
        }
    };
    const getServiceNameById = (id, services) => {
        const allServices = services.flatMap(service => service.options || []);
        const service = allServices.find(service => service.value === id);
        return service ? service.label : 'Không xác định';
    };
    
    const fetchPackageByID = async (packageId) => {
        try {
            const response = await makeAuthorizedRequest(API_CONFIG.PACKAGES.GET_BY_ID(packageId), 'GET');
            const packageData = response.data[0];
            setSelectedMenu(packageData.menu_id);
            await fetchFoodsByMenuId(packageData.menu_id);
            setSelectPartyTypes(packageData.party_type_id);
            setSelectStages(packageData.stage_id);
            setSelectedDecors(packageData.decor_id);
    
            const selectedMenuOption = menus[0]?.options?.find(option => option.value === packageData.menu_id);
            setMenuPrice(selectedMenuOption ? selectedMenuOption.price : 0);
    
            // Lấy giá của stage
            const selectedStageOption = stages[0]?.options?.find(option => String(option.value) === String(packageData.stage_id));
            setStagePrice(selectedStageOption ? selectedStageOption.price : 0);
    
            // Lấy giá của decor
            const selectedDecorOption = decors[0]?.options?.find(option => option.value === packageData.decor_id);
            setDecorPrice(selectedDecorOption ? selectedDecorOption.price : 0);
    
            // Lấy giá của party type
            const selectedPartyTypeOption = partyTypes[0]?.options?.find(option => option.value === packageData.party_type_id);
            setPartyPrice(selectedPartyTypeOption ? selectedPartyTypeOption.price : 0);
    
            // Xử lý other_service nếu có
            if (packageData.other_service) {
                const otherServicesFromAPI = JSON.parse(packageData.other_service);
                const updatedOtherDishes = otherServicesFromAPI.map((service) => ({
                    id: service.id,
                    name: getServiceNameById(service.id, otherServices),
                    price: service.price || 0,
                    quantity: service.quantity,
                }));

                setSelectOtherDishes(updatedOtherDishes);
            } else {
                setSelectOtherDishes([]);
            }
    
            // Xử lý extra_service nếu có
            if (packageData.extra_service) {
                const extraServicesFromAPI = JSON.parse(packageData.extra_service);
                const updatedExtraDishes = extraServicesFromAPI.map((service) => ({
                    id: service.id,
                    name: getServiceNameById(service.id, extraServices),
                    price: service.price || 0,
                    quantity: service.quantity,
                }));
    
                setSelectExtraDishes(updatedExtraDishes);
            } else {
                setSelectExtraDishes([]);
            }
        } catch (error) {
            console.error('Lỗi khi lấy gói dịch vụ:', error);
        }
    };

    
    
    const fetchAllServices = async () => {
        try {
            await Promise.all([
                fetchPackageForExtraServices(),
                fetchPackageForOtherServices(),
            ]);
        } catch (err) {
            console.error('Lỗi khi lấy dịch vụ:', err);
        }
    };

    const fetchDataDetailsParty = async () => {
        try {
            const response = await makeAuthorizedRequest(API_CONFIG.BOOKINGS.GET_BY_ID(id), 'GET');
            const partyData = response.data[0];
            if (partyData) {
                await fetchAllServices();
                await fetchAllStages(partyData.branch_id);
                const decorOptions = await fetchAllDecors();

                const paymentStatusMethod = partyData.payment_status;
                const bookingDetails = partyData.booking_details[0] || {};
                const selectedMenuId = bookingDetails.menu_id || selectedMenu;
                const options = stages[0]?.options || [];
                // Kiểm tra package_id
                if (partyData.package_id) {
                    await fetchPackageByID(partyData.package_id);
                } 
                    if(partyData.stage_id){
                        setSelectStages(partyData.stage_id)
                        const selectedStage = options.find(option => String(option.value) === String(partyData.stage_id));
                      
                        if (selectedStage) {
                            setSelectStages(selectedStage.value);
                            setStagePrice(selectedStage.price || 0);
                            setLimitStages(selectedStage.capacity_max || 0);
                        } else {
                            const firstStage = options[0];
                            if (firstStage) {
                                setSelectStages(firstStage.value);
                                setStagePrice(firstStage.price || 0);
                                setLimitStages(firstStage.capacity_max || 0);
                            }
                        }
                    }else {
                        const firstStage = options[0];
                        if (firstStage) {
                            setSelectStages(firstStage.value);
                            setStagePrice(firstStage.price || 0);
                            setLimitStages(firstStage.capacity_max || 0);
                        }
                    }
                    if (bookingDetails.menu_id) {
                        setSelectedMenu(bookingDetails.menu_id);
                        const selectedMenuOption = menus[0].options.find(option => option.value === bookingDetails.menu_id);
                        setMenuPrice(selectedMenuOption ? selectedMenuOption.price : 0);
                        await fetchFoodsByMenuId(bookingDetails.menu_id);
                       
                    }
                setBookingDetails(bookingDetails);
                checkServices(bookingDetails);
                checkSelectedDecor(decorOptions, partyData);
                // Xử lý party types
                if (!selectPartyTypes) {
                    setSelectPartyTypes(partyData.party_type_id);
                    const selectedPartyTypeOption = partyTypes[0]?.options?.find(option => option.value === partyData.party_type_id);
                    if (selectedPartyTypeOption) {
                        setPartyPrice(selectedPartyTypeOption.price);
                    }
                }

                // Cập nhật giá trị khác
                setSelectStatusBookings(partyData.status || '');
                setBranch_id(partyData.branch_id);
                setPartyPrice(partyData.party_types?.price || partyPrice);
                setStagePrice(partyData.stages?.price || stagePrice);
                
                const isDepositSuccessful = bookingDetails.deposit_status === 'success';
                setSelectStatusDeposit(isDepositSuccessful);
                setStatusDeposit(prevStatus => [
                    {
                        ...prevStatus[0],
                        options: prevStatus[0].options.map(option => ({
                            ...option,
                            selected: option.value === isDepositSuccessful,
                        })),
                    },
                ]);

                setDetailCostTable([
                    {
                        service: 'Menu',
                        description: bookingDetails.menus?.products.map(product => product.name).join(', ') || '',
                        cost: bookingDetails.menus?.price.toLocaleString('vi', { style: 'currency', currency: 'VND' }) || 0,
                    },
                    {
                        service: 'Decor',
                        description: bookingDetails.decors?.name || '',
                        cost: bookingDetails.decors?.price.toLocaleString('vi', { style: 'currency', currency: 'VND' }) || 0,
                    },
                    {
                        service: 'Loại tiệc',
                        description: partyData.party_types?.name || '',
                        cost: partyData.party_types?.price.toLocaleString('vi', { style: 'currency', currency: 'VND' }) || 0,
                    },
                    {
                        service: 'Sảnh',
                        description: partyData.stages?.name || '',
                        cost: partyData.stages?.price.toLocaleString('vi', { style: 'currency', currency: 'VND' }) || 0,
                    },
                    {
                        service: 'Âm thanh, ánh sáng, sân khấu, màn hình',
                        description: '',
                        cost: '5.000.000đ',
                    },
                    {
                        service: 'Phí thuê bàn ghế',
                        description: '',
                        cost: '1.000.000đ',
                    },
                    {
                        service: 'Bữa ăn nhẹ cho cô dâu - chú rể',
                        description: '',
                        cost: '100.000đ',
                    },
                    {
                        service: 'MC',
                        description: '',
                        cost: '500.000đ',
                    },
                ]);

                setValue('customer', partyData.number_of_guests / 10);
                setValue('total_amount', partyData.total_amount || 0);
                setValue('depositAmount', bookingDetails.deposits?.amount || 0);

                resetForm(partyData, bookingDetails, selectedMenuId, isDepositSuccessful)
            }
        } catch (error) {
            console.error('Error fetching party details:', error);
        }
    };
    const resetForm = (partyData, bookingDetails, selectedMenuId, isDepositSuccessful) => {
        const shiftValue = partyData.shift.toLowerCase() === 'tối' ? 'tối' : 'sáng';
        reset({
            status: partyData.status || '',
            username: partyData.name || '',
            company_name: partyData.company_name || '',
            email: partyData.email || partyData.users?.email,
            phone: partyData.phone || partyData.users?.phone,
            customerAndChair: 10,
            table_count: Number(bookingDetails.table_count) || 0,
            spare_table_count: Number(bookingDetails.spare_table_count) || 0,
            customer: Number(partyData.number_of_guests) || 0,
            partyDate: partyData.created_at.slice(0, 10) || '',
            organization_date: partyData.organization_date.slice(0, 10) || '',
            shift: shiftValue,
            menu: selectedMenuId,
            decor: selectedMenuId,
            stage_id: partyData.stage_id || '',
            total_amount: bookingDetails.total_amount,
            depositAmount: bookingDetails.deposits?.amount,
            amount_booking: bookingDetails.amount_booking,
            depositDate: bookingDetails.deposits?.created_at.slice(0, 10) || '',
            payment: bookingDetails.deposits?.payment_method,
            dataPay: bookingDetails.deposits?.created_at.slice(0, 10) || '',
            statusDeposit: isDepositSuccessful ? 'success' : 'pending',
            statusPayment: partyData.payment_status,
            foods: bookingDetails.menus?.products || [],
            menus_price: bookingDetails.menus?.price || 0,
            other_service: partyData.other_service || null,
            extra_service: partyData.extra_service || null,
        });
    };
    const memoizedCheckServices = useCallback((details) => {
        checkServices(details);
    }, [otherServices, extraServices])

    useEffect(() => {
        if (otherServices[0]?.options.length > 1 && extraServices[0]?.options.length > 1 && bookingDetails) {
            memoizedCheckServices(bookingDetails);
        }
    }, [otherServices, extraServices, bookingDetails, memoizedCheckServices]);

    const checkSelectedDecor = (decorOptions, partyData) => {
        if (!Array.isArray(decorOptions) || decorOptions.length === 0) {
            console.error('No decor options available');
            return;
        }

        const selectedDecorId = partyData.booking_details[0]?.decor_id;
        const selectedDecorOption = decorOptions.find(option => option.value === selectedDecorId);

        if (selectedDecorOption) {
            setSelectedDecors(selectedDecorOption.value);
            setDecorPrice(selectedDecorOption.price);
        } else {
            // Default to the first decor option
            setSelectedDecors(decorOptions[0].value);
            setDecorPrice(decorOptions[0].price);
        }
    };

    const checkServices = (bookingDetails) => {
        const allOtherOptions = otherServices[0]?.options || [];
        const allExtraOptions = extraServices[0]?.options || [];

        const otherServicesData = parseServicesData(bookingDetails.other_service, 'other_service');
        const extraServicesData = parseServicesData(bookingDetails.extra_service, 'extra_service');

        const updatedOtherDishes = mapServicesData(otherServicesData, allOtherOptions);
        setSelectOtherDishes(updatedOtherDishes);

        const updatedExtraDishes = mapServicesData(extraServicesData, allExtraOptions);
        setSelectExtraDishes(updatedExtraDishes);
    };

    const parseServicesData = (serviceData, serviceType) => {
        if (!serviceData) return [];
        try {
            return typeof serviceData === 'string' ? JSON.parse(serviceData) : serviceData;
        } catch (error) {
            console.error(`Error parsing ${serviceType}:`, error);
            return [];
        }
    };

    const mapServicesData = (servicesData, allOptions) => {
        return Array.isArray(servicesData) ? servicesData.map(service => {
            const option = allOptions.find(opt => opt.value === service.id);
            return {
                id: service.id,
                name: option ? option.label : 'Không xác định',
                price: option ? option.price : 0,
                quantity: service.quantity,
            };
        }) : [];
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            const branch = localStorage.getItem("currentBranch");
            if (branch) {
                setCurrentBranch(JSON.parse(branch));
            }
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([
                    fetchAllMenus(),
                    fetchAllPartyTypes(),
                    fetchAllDecors(),
                    fetchAllServices(),
                ]);
               
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu:', error);
            }
        };
        fetchData();
    }, [id, reset]);
    
    useEffect(() => {
        async function getMenu() {
            if (menus[0]?.options.length > 0) {
                await fetchDataDetailsParty();
            }
        }
        getMenu()
    }, [menus]);

    useEffect(() => {
        const selectedStage = stages[0]?.options.find(option => String(option.value) === String(selectStages));
        if (selectedStage) {
            setStagePrice(selectedStage.price || 0);
            setLimitStages(selectedStage.capacity_max || 0);
        } else {
            setStagePrice(0);
            setLimitStages(0);
        }
    }, [selectStages, stages]);

    const handleMenuChange = async (event) => {
        const selectedMenuId = event.target.value; 
        console.log('Selected Menu ID:', selectedMenuId); 
        setSelectedMenu(selectedMenuId);
        
        const selectedMenuOption = menus[0].options.find(option => option.value === Number(selectedMenuId));
    
        if (selectedMenuOption) {
            console.log('Selected Menu Option:', selectedMenuOption); 
            setMenuPrice(selectedMenuOption.price);
        } else {
            console.log('No matching option found'); 
            setMenuPrice(0);
        }
    
        if (selectedMenuId) {
            await fetchFoodsByMenuId(selectedMenuId);
        }
    };

    const handleChangeQuantity = (id, selectedDishesState, setSelectedDishesState, change) => {
        setSelectedDishesState(selectedDishesState.map(dish =>
            dish.id === id ? { ...dish, quantity: dish.quantity + change } : dish
        ));
    };
    const handleDecreaseQuantity = (id) => {
        setSelectExtraDishes(selectExtraDishes.map(dish =>
            dish.id === id && dish.quantity > 1 ? { ...dish, quantity: dish.quantity - 1 } : dish
        ));
    };

    const handleDecreaseOtherQuantity = (id) => {
        setSelectOtherDishes(selectOtherDishes.map(dish =>
            dish.id === id && dish.quantity > 1 ? { ...dish, quantity: dish.quantity - 1 } : dish
        ));
    };

    const handleRemoveDish = (id, selectedDishesState, setSelectedDishesState) => {
        setSelectedDishesState(selectedDishesState.filter(dish => dish.id !== id));
    };

    // Handle extra service change
    const handleExtraService = (event) => {
         const selectedValue = event.target.value; // Hoặc cách bạn lấy giá trị từ event
         console.log('Selected Extra Service Value:', selectedValue);
        handleServiceChange(event, extraServices, selectExtraDishes, setSelectExtraDishes, setSelectExtraServices);
    };

    // Handle other services change
    const handleOtherServices = (event) => {
        handleServiceChange(event, otherServices, selectOtherDishes, setSelectOtherDishes, setSelectOtherServices);
    };

    const handleStageChange = useCallback((event) => {
        const selectedStageId = event.target.value;
        setSelectStages(selectedStageId);

        const selectedStage = stages[0]?.options.find(option => String(option.value) === String(selectedStageId));
        
        if (selectedStage) {
            setStagePrice(selectedStage.price || 0);
            setLimitStages(selectedStage.capacity_max || 0);
        } else {
            setStagePrice(0);
            setLimitStages(0);
        }
    }, [stages]);

    const handleDecorChange = (event) => {
        const selectedDecorId = Number(event.target.value);
        setSelectedDecors(selectedDecorId);

        const selectedDecorOption = decors[0].options.find(option => option.value === selectedDecorId);
        if (selectedDecorOption) {
            setDecorPrice(selectedDecorOption.price);
        } else {
            setDecorPrice(0);
        }
    };
    const handlePartyTypeChange = (event) => {
        const selectedPartyTypeId = event.target.value;
        setSelectPartyTypes(selectedPartyTypeId);

        const selectedPartyTypeOption = partyTypes[0].options.find(option => String(option.value) === parseInt(selectedPartyTypeId));

        if (selectedPartyTypeOption) {
            setPartyPrice(selectedPartyTypeOption.price);
        } else {
            setPartyPrice(0);
        }
    };

    const handleStatusBookings = (event) => {
        const selectedValue = event.target.value;
        setSelectStatusBookings(selectedValue);

        setStatusBookings(prevStatus => [
            {
                ...prevStatus[0],
                options: prevStatus[0].options.map(option => ({
                    ...option,
                    selected: option.value === selectedValue,
                })),
            },
        ]);
    };

    const handleStatusDepositChange = (event) => {
        const selectedValue = event.target.value === 'true';
        setSelectStatusDeposit(selectedValue);
    };
    const handleServiceChange = (event, services, selectedDishesState, setSelectedDishesState, setSelectService) => {
        const packageId = event.target.value;
        if (packageId === "" || packageId === "null") {
            setSelectedDishesState([]);
            setSelectService(null);
            return;
        }

        const options = services.flatMap(service =>
            service.options.flatMap(option => option.items ? option.items : option)
        );

        const selectedOption = options.find(item => item.value == packageId);

        if (!selectedOption) {
            console.error('Tùy chọn không hợp lệ:', packageId);
            return;
        }

        const existingDish = selectedDishesState.find(dish => dish.id == packageId);

        if (existingDish) {
            handleChangeQuantity(packageId, selectedDishesState, setSelectedDishesState, 1);
        } else {
            setSelectedDishesState([...selectedDishesState, { id: Number(packageId), name: selectedOption.label, price: selectedOption.price, quantity: 1 }]);
        }

        setSelectService(packageId);
    };

    const onSubmit = async (data) => {
        const formattedOtherDishes = selectOtherDishes.map(dish => ({
            id: dish.id,
            quantity: dish.quantity,
        }));
        const formattedExtraDishes = selectExtraDishes.map(dish => ({
            id: dish.id,
            quantity: dish.quantity,
        }));

        const totalOtherServicesPrice = selectOtherDishes.reduce((total, dish) => total + (dish.price * dish.quantity), 0);
        const totalExtraServicesPrice = selectExtraDishes.reduce((total, dish) => total + (dish.price * dish.quantity), 0);
        
        // Định nghĩa các giá trị đơn giá
        const table_price = 200000; // Giá mỗi bàn
        const chair_price = 50000; // Giá mỗi ghế

        // Tổng tiền bàn chính
        const total_table_price = data.table_count * table_price;

        // Tổng tiền bàn dự phòng
        const total_table_price_backup = data.spare_table_count * table_price;

        // Tổng tiền ghế chính
        const total_chair_price = data.table_count * 10 * chair_price;

        // Tổng tiền ghế dự phòng
        const total_chair_price_backup = data.spare_table_count * 10 * chair_price;

        // Tổng tiền menu (cho bàn chính)
        const total_menus = data.table_count * menuPrice;

        //Tổng tiền menu cho bàn phụ
        const total_menus_backup = data.spare_table_count * menuPrice;

        // Tính tổng tiền amount
        const total_amount_all =
            total_table_price +
            total_table_price_backup +
            total_chair_price +
            total_chair_price_backup +
            decorPrice +
            partyPrice +
            stagePrice +
            total_menus +
            total_menus_backup +
            totalOtherServicesPrice + 
            (data.is_deposit ? totalExtraServicesPrice : 0);

        console.log(total_amount_all)

        const dataform = {
            ...data,
            branch_id: branch_id,
            party_type_id: selectPartyTypes,
            stage_id: Number(selectStages),
            decor_id: Number(selectedDecors),
            menu_id: Number(selectedMenu),
            name: data.username,
            phone: data.phone,
            email: data.email,
            company_name: data.company_name,
            number_of_guests: data.customer,
            table_count: data.table_count,
            spare_table_count: data.spare_table_count,
            amount: total_amount_all,
            other_service: formattedOtherDishes,
            extra_service: formattedExtraDishes,
            is_confirm: true,
            is_deposit: selectStatusDeposit,
            status: selectStatusBookings,
        }

        console.log("Giá tiền menu" + menuPrice)
        console.log("Menu" + selectedMenu)
        console.log(data.table_count)
        console.log(data.spare_table_count)


        console.log("Tổng tiền bàn chính" + total_table_price)
        console.log("Tổng tiền bàn phụ" + total_table_price_backup)
        console.log("Tổng tiền ghế chính" + total_chair_price)
        console.log("Tổng tiền ghế dự phòng " + total_chair_price_backup)
        console.log("Tổng tiền menu cho bàn chính" + total_menus)
        console.log("Tổng tiền menu cho bàn phụ" + total_menus_backup)
        console.log("DecorPrice" + decorPrice)
        console.log("partyPrice" + partyPrice)
        console.log("stagePrice" + stagePrice)
        console.log(selectOtherDishes)
        console.log("Tổng số tiền của other_service" + totalOtherServicesPrice)

        try {
            const updateBranches = await makeAuthorizedRequest(API_CONFIG.BOOKINGS.UPDATE(id), "PATCH", dataform);

            if (updateBranches.success) {
                dispatch(fetchBranchSuccess(updateBranches.data));
                toast({
                    title: "Cập nhật thành công",
                    description: "Đã sử lý thông tin cập nhật của khách",
                    type: "success",
                });
                // router.refresh()
            } else {
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
                        description: message || "Yêu cầu chưa được cập nhật trạng thái",
                        type: "error",
                    });
                }
            }
        } catch (error) {
            console.log(error);
            const { message } = error.response?.data || { message: "Đã xảy ra lỗi" };
            toast("error", "Cập nhật thất bại", message);
        }
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
                        {menus.map((meu, index) => (
                            <DropdownField
                                key={index}
                                label={meu.title}
                                name={meu.name}
                                options={meu.options}
                                value={selectedMenu}
                                onChange={handleMenuChange}
                            />
                        ))}
                        {statusBookings.map((menu, index) => (
                            <DropdownField
                                key={index}
                                label={menu.title}
                                name={menu.name}
                                options={menu.options}
                                value={selectStatusBookings || ''}
                                onChange={handleStatusBookings}
                            />
                        ))}
                        <FoodsTitle title={'Món chính'} foodsMap={foods.monChinh} />
                        <FoodsTitle title={'Món khai vị'} foodsMap={foods.monkhaivi} />
                        <FoodsTitle title={'Món tráng miệng'} foodsMap={foods.montrangMieng} />
                    </div>
                </div>
                {/* other_service */}
                <div className='p-4 mt-5 w-full bg-whiteAlpha-200 rounded-lg flex flex-col gap-[22px]'>
                    <TitleSpanInfo title={'Thêm dịch vụ khác'} />
                    <div className='grid grid-cols-3 gap-[30px]'>

                        {otherServices.map((service, index) => (
                            <DropdownField
                                key={index}
                                label={service.title}
                                name={`service-${service.id}`}
                                options={service.options || []}
                                value={selectOtherServices}
                                onChange={handleOtherServices}
                            />
                        ))}
                        {selectOtherDishes.length > 0 &&
                            selectOtherDishes.map((dish, index) => (
                                <div key={`${dish.id}-${index}`} className="flex justify-between items-center bg-whiteAlpha-200 p-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
                                    <div className="flex flex-col">
                                        <span className="text-base font-semibold text-white">{dish.name}</span>
                                        <span className="text-gray-400">Số lượng: <span className='text-base font-semibold'>{dish.quantity}</span></span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => handleDecreaseOtherQuantity(dish.id)}
                                            className="bg-whiteAlpha-400 text-white w-[34px] h-[32px] rounded hover:bg-whiteAlpha-600 transition text-base font-bold"
                                        >
                                            -
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleChangeQuantity(dish.id, selectOtherDishes, setSelectOtherDishes, 1)}
                                            className="bg-whiteAlpha-400 text-white w-[34px] h-[32px] rounded hover:bg-whiteAlpha-600 transition text-base font-bold"
                                        >
                                            +
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveDish(dish.id, selectOtherDishes, setSelectOtherDishes)}
                                            className="bg-red-600 text-white px-3 h-[32px] rounded hover:bg-red-700 transition"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className='p-4 mt-5 w-full bg-whiteAlpha-200 rounded-lg flex flex-col gap-[22px]'>
                    <TitleSpanInfo title={'Thêm mới dịch vụ - Chỉ thêm khi tiệc đã hoàn thành'} />
                    <div className='grid grid-cols-3 gap-[30px]'>
                    {extraServices.map((service, index) => (
                        <DropDownSelect2
                            key={index}
                            label={service.title}
                            name={`service-${service.id}`}
                            options={service.options || []}
                            value={selectExtraServices}
                            onChange={handleExtraService}
                        />
                    ))}
                        {selectExtraDishes.length > 0 &&
                            selectExtraDishes.map((dish, index) => (
                                <div key={`${dish.id}-${index}`} className="flex justify-between items-center bg-whiteAlpha-200 p-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
                                    <div className="flex flex-col">
                                        <span className="text-base font-semibold text-white">{dish.name}</span>
                                        <span className="text-gray-400">Số lượng: <span className='text-base font-semibold'>{dish.quantity}</span></span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => handleDecreaseQuantity(dish.id)}
                                            className="bg-whiteAlpha-400 text-white w-[34px] h-[32px] rounded hover:bg-whiteAlpha-600 transition text-base font-bold"
                                        >
                                            -
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleChangeQuantity(dish.id, selectExtraDishes, setSelectExtraDishes, 1)}
                                            className="bg-whiteAlpha-400 text-white w-[34px] h-[32px] rounded hover:bg-whiteAlpha-600 transition text-base font-bold"
                                        >
                                            +
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveDish(dish.id, selectExtraDishes, setSelectExtraDishes)}
                                            className="bg-red-600 text-white px-3 h-[32px] rounded hover:bg-red-700 transition"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            ))
                        }
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
                        {statusDeposit.map((status, index) => (
                            <DropdownField
                                key={index}
                                label={status.title}
                                name={status.name}
                                options={status.options}
                                value={selectStatusDeposit.toString()}
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

export default Page;