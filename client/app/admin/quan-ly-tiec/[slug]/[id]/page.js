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
import { useDispatch } from 'react-redux';
import { fetchBranchSuccess } from '@/app/_lib/features/branch/branchSlice';
import { organizationSchema } from './organizationSchema';
import { DropdownField } from './DropdownField';
import { DropDownSelect2 } from './DropDownSelect2';

const TitleSpanInfo = ({ title }) => (
    <span className="font-semibold text-xl leading-7 text-white">{title}</span>
);
const handleServiceChange = (event, services, selectedDishesState, setSelectedDishesState, setSelectService) => {
    const packageId = event.target.value;

    // Handle "Không chọn" option
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
        handleChangeQuantity(packageId, selectedDishesState, setSelectedDishesState, 1); // Increase quantity
    } else {
        setSelectedDishesState([...selectedDishesState, { id: packageId, name: selectedOption.label, price: selectedOption.price, quantity: 1 }]);
    }

    setSelectService(packageId);
};

const FoodsTitle = ({ title, foodsMap, handleDeleteFood }) => {
    return (
        <div className="flex flex-col gap-2">
            <span className="font-bold leading-6 text-base text-white">{title}</span>
            <div className="flex flex-wrap gap-[10px]">
                {foodsMap && foodsMap.length > 0 ? (
                    foodsMap.map((food) => (
                        <div key={food.id} className="bg-white border-1 rounded-lg p-2 flex gap-[6px] text-gray-600 items-center w-fit transition-transform transform hover:scale-105">
                            <span className="text-[12px] font-medium leading-4">{food.name}</span>
                            <button type='button'
                            // onClick={() => handleDeleteFood(food.id)}
                             className="text-red-500 hover:text-red-700">
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
                                    <path opacity="0.5" d="M5 3.88906L8.88906 0L10 1.11094L6.11094 5L10 8.88906L8.88906 10L5 6.11094L1.11094 10L0 8.88906L3.88906 5L0 1.11094L1.11094 0L5 3.88906Z" fill="#1A202C" />
                                </svg>
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-white font-semibold text-base">Chưa có món ăn nào cho menu này.</p>
                )}
            </div>
        </div>
    );
};

const ChiTietTiecCuaChiNhanhPage = ({ params }) => {
    const { id } = params;
    const { makeAuthorizedRequest } = useApiServices();
    const [currentBranch, setCurrentBranch] = useState(null);
    const toast = useCustomToast();

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
            name: 'stages',
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
                { value: null, label: 'Không chọn' },
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
                { value: null, label: 'Không chọn' },
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
    const [selectedDishes, setSelectedDishes] = useState([]);

    const [selectOtherServices, setSelectOtherServices] = useState(null);
    const [selectOtherDishes, setSelectOtherDishes] = useState([]);

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
    const [otherServicePrice, setOtherServicePrice] = useState(0);
    const [limitStages, setLimitStages] = useState(0);
    const [modifiedFoods, setModifiedFoods] = useState([]);
    const [detailCostTable, setDetailCostTable] = useState([]);

    const [branch_id, setBranch_id] = useState();

    const fetchLimitStages = async (stageId) => {
        try {
            const response = await makeAuthorizedRequest(API_CONFIG.STAGES.GET_ALL_BY_STAGE_ID(stageId), 'GET');
            const limitStagesData = response.data[0];
            setLimitStages(limitStagesData.capacity_max || 0);
        } catch (error) {
            console.error(error);
        }
    };
    const fetchAllStages = async (branchId) => {
        try {
            const response = await makeAuthorizedRequest(API_CONFIG.STAGES.GET_ALL_BY_BRANCH(branchId), 'GET');
            const stageData = response.data;

            const options = stageData.length === 0
                ? [{ value: '', label: 'Chưa có sảnh', capacity_max: 0 }]
                : stageData.map(item => ({
                    value: item.id,
                    label: item.name,
                    price: item.price,
                    capacity_max: item.capacity_max,
                }));

            setStages([{ title: 'Sảnh', type: 'select', options }]);

            // Automatically select the first option if there is only one
            if (options.length === 1) {
                setSelectStages(options[0].value);
                setLimitStages(options[0].capacity_max || 0);
                setStagePrice(options[0].price || 0);
            } else {
                // If there are no selected stages, set to the first option if available
                if (!selectStages && options.length > 0) {
                    setSelectStages(options[0].value);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };
    const fetchAllMenus = async () => {
        try {
            const response = await makeAuthorizedRequest(API_CONFIG.MENU.GET_ALL(), 'GET');
            const menuOptions = response.data.map(menu => ({
                value: menu.id,
                label: menu.name,
                price: menu.price,
            }));

            setMenus([{ ...menus[0], options: menuOptions }]);
            if (!selectedMenu && menuOptions.length) {
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

            // Automatically select the first option if only one available
            if (decorOptions.length === 1) {
                setSelectedDecors(decorOptions[0].value);
                setDecorPrice(decorOptions[0].price);
            } else if (!selectedDecors && decorOptions.length > 0) {
                // Select the first option if no decor is currently selected
                setSelectedDecors(decorOptions[0].value);
            }
        } catch (error) {
            console.error('Error fetching decors:', error);
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
                if (typeof response.data !== 'object') {
                    console.error('Dữ liệu không hợp lệ:', response.data);
                    return;
                }

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
            console.error('Lỗi khi lấy dịch vụ khác:', error);
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
            setOtherServices(prev => {
                const newOptions = [
                    { category: 'Chọn dịch vụ', items: [{ value: '', label: 'Không chọn' }] },
                    ...options,
                ];
                return [{ ...prev[0], options: newOptions }];
            });
        } catch (error) {
            console.error('Lỗi khi lấy dịch vụ khác:', error);
        }
    };


    const { control, handleSubmit, setValue, reset, formState: { errors }, trigger } = useForm({
        resolver: zodResolver(organizationSchema),
        defaultValues: {
            other_services: null,
            customerAndChair: 10,
            total_amount: 0,
            depositAmount: 0,
            spare_table_count: 0,
        },
    });

    const fetchDataDetailsParty = async () => {
        try {
            const response = await makeAuthorizedRequest(API_CONFIG.BOOKINGS.GET_BY_ID(id), 'GET');
            const partyData = response.data[0];

            if (partyData) {
                const paymentStatusMethod = partyData.payment_status;
                await fetchAllStages(partyData.branch_id);
                const bookingDetails = partyData.booking_details[0] || {};

                const initialStageId = partyData.stage_id || (partyData.booking_details[0]?.stage_detail?.id || '');
                const selectedMenuId = bookingDetails.menu_id || selectedMenu;
                const selectedDecorId = bookingDetails.decor_id || selectedDecors;

                if (stages[0]?.options.length === 1) {
                    setSelectStages(stages[0].options[0].value);
                } else if (initialStageId) {
                    const selectedStage = stages[0]?.options.find(option => option.value === initialStageId);

                    if (selectedStage) {
                        setSelectStages(selectedStage.value);
                        setLimitStages(selectedStage.capacity_max || 0);
                        setStagePrice(selectedStage.price || 0);
                    } else {
                        setSelectStages(stages[0].options[0]?.value);
                        setStagePrice(0);
                    }
                } else if (stages[0]?.options.length > 0) {
                    setSelectStages(stages[0].options[0].value);
                }

                if (!selectedMenu) {
                    setSelectedMenu(bookingDetails.menu_id);
                    if (bookingDetails.menu_id) {
                        await fetchFoodsByMenuId(bookingDetails.menu_id);
                    }
                }

                if (decors[0]?.options.length === 1) {
                    setSelectedDecors(decors[0].options[0].value);
                    setDecorPrice(decors[0].options[0].price);
                } else if (selectedDecorId) {
                    const selectedDecorOption = decors[0].options.find(option => option.value === Number(selectedDecorId));

                    if (selectedDecorOption) {
                        setSelectedDecors(selectedDecorOption.value);
                        setDecorPrice(selectedDecorOption.price);
                    } else {
                        setSelectedDecors(decors[0]?.options[0]?.value);
                    }
                } else if (decors[0]?.options.length > 0) {
                    setSelectedDecors(decors[0].options[0].value);
                }

                if (!selectPartyTypes) {
                    setSelectPartyTypes(partyData.party_type_id);
                    const selectedPartyTypeOption = partyTypes[0]?.options?.find(option => option.value === partyData.party_type_id);
                    if (selectedPartyTypeOption) {
                        setPartyPrice(selectedPartyTypeOption.price);
                    }
                }
                setSelectStatusBookings(partyData.status || '')
                setBranch_id(partyData.branch_id);
                setPartyPrice(partyData.party_types?.price || partyPrice);
                setStagePrice(partyData.stages?.price || 0);

                const depositStatus = bookingDetails.deposit_status;
                const isDepositSuccessful = depositStatus === 'success';

                setSelectStatusDeposit(isDepositSuccessful ? true : false);
                setStatusDeposit(prevStatus => [
                    {
                        ...prevStatus[0],
                        options: prevStatus[0].options.map(option => ({
                            ...option,
                            selected: option.value === (isDepositSuccessful ? true : false),
                        })),
                    },
                ]);

                setDetailCostTable([
                    {
                        service: 'Menu',
                        description: bookingDetails.menus?.products.map(product => product.name).join(', '),
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

                // Cập nhật giá trị cho form
                setValue('total_amount', partyData.total_amount || 0);
                setValue('depositAmount', bookingDetails.deposits?.amount || 0);
                const shiftValue = partyData.shift.toLowerCase() === 'tối' ? 'tối' : 'sáng';

                // Reset form với dữ liệu từ API
                reset({
                    status: partyData.status || '',
                    username: partyData.name || '',
                    company_name: partyData.name || '',
                    email: partyData.email || partyData.users?.email,
                    phone: partyData.phone || partyData.users?.phone,
                    customerAndChair: 10,
                    tables: Number(bookingDetails.table_count) || 0,
                    spare_table_count: Number(bookingDetails.spare_table_count) || 0,
                    customer: Number(partyData.number_of_guests) || 0,
                    partyDate: partyData.created_at.slice(0, 10) || '',
                    organization_date: partyData.organization_date.slice(0, 10) || '',
                    shift: shiftValue,
                    menu: selectedMenuId,
                    decor: selectedDecorId,
                    total_amount: bookingDetails.total_amount,
                    depositAmount: bookingDetails.deposits?.amount,
                    amount_booking: bookingDetails.amount_booking,
                    depositDate: bookingDetails.deposits?.created_at.slice(0, 10) || '',
                    payment: bookingDetails.deposits?.payment_method,
                    dataPay: bookingDetails.deposits?.created_at.slice(0, 10) || '',
                    statusDeposit: isDepositSuccessful ? 'success' : 'pending',
                    statusPayment: paymentStatusMethod,
                    foods: bookingDetails.menus?.products,
                    menus_price: bookingDetails.menus?.price || 0,
                });
            }
        } catch (error) {
            console.error('Error fetching party details:', error);
        }
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            const branch = localStorage.getItem("currentBranch");
            if (branch) {
                setCurrentBranch(JSON.parse(branch));
            }
        }
    }, []);

    const handleMenuChange = async (event) => {
        const selectedMenuId = event.target.value;
        setSelectedMenu(selectedMenuId);
        const selectedMenuOption = menus[0].options.find(option => option.value === parseInt(selectedMenuId));

        if (selectedMenuOption) {
            setMenuPrice(selectedMenuOption.price);
        } else {
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
        setSelectedDishes(selectedDishes.map(dish =>
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
        handleServiceChange(event, extraServices, selectedDishes, setSelectedDishes, setSelectExtraServices);
    };

    // Handle other services change
    const handleOtherServices = (event) => {
        handleServiceChange(event, otherServices, selectOtherDishes, setSelectOtherDishes, setSelectOtherServices);
    };

    // Tạo object mới chứa id và quantity
    const createPayload = () => {
        return selectedDishes.map(dish => ({
            id: dish.id,
            quantity: dish.quantity
        }));
    };

    const handleStageChange = (event) => {
        const selectedStageId = event.target.value;
        setSelectStages(selectedStageId);
        fetchLimitStages(selectedStageId);

        const selectedStage = stages[0]?.options.find(option => option.value === selectedStageId);
        if (selectedStage) {
            setLimitStages(selectedStage.capacity_max || 0);
            setStagePrice(selectedStage.price);
        } else {
            setStagePrice(0);
        }
    };
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

        const selectedPartyTypeOption = partyTypes[0].options.find(option => option.value === parseInt(selectedPartyTypeId));

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

    const handleDeleteFood = (foodId) => {
        const updatedFoods = foods.filter(food => food.id !== foodId);
        setFoods(updatedFoods);
        setModifiedFoods(prev => [...prev, foodId]);
    };

    useEffect(() => {
        fetchPackageForExtraServices()
        fetchPackageForOtherServices()
        fetchDataDetailsParty();
        fetchAllMenus();
        fetchAllDecors();
        fetchAllPartyTypes()
    }, [id, reset]);

    const onSubmit = async (data) => {
        // const finalFoods = foods.filter(food => !modifiedFoods.includes(food.id));

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

        //Tổng tiền menu cho bàn phụ
        const total_menus_backup = data.spare_table_count * menuPrice;

        // Tính tổng tiền amount
        const total_amount_all = total_table_price + total_table_price_backup + total_chair_price + total_chair_price_backup + decorPrice + partyPrice + stagePrice + total_menus + total_menus_backup;

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
            table_count: data.tables,
            spare_table_count: data.spare_table_count,
            amount: total_amount_all,
            other_service: null,
            extra_service: null,
            is_confirm: true,
            is_deposit: selectStatusDeposit,
            status: selectStatusBookings,
        }

        console.log("total_chair_price_backup" + total_chair_price_backup)
        console.log("total_chair_price" + total_chair_price)
        console.log("total_table_price" + total_table_price)
        console.log("total_table_price_backup" + total_table_price_backup)
        console.log("menus" + total_menus)
        console.log("decorPrice" + decorPrice)
        console.log("partyPrice" + partyPrice)
        console.log("stagePrice" + stagePrice)
        console.log("total_menus_backup" + total_menus_backup)
        try {
            const updateBranches = await makeAuthorizedRequest(API_CONFIG.BOOKINGS.UPDATE(id), "PATCH", dataform);

            if (updateBranches.success) {
                dispatch(fetchBranchSuccess(updateBranches.data));
                toast({
                    title: "Cập nhật thành công",
                    description: "Đã sử lý thông tin cập nhật của khách",
                    type: "success",
                });
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
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
        console.log(dataform)
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

                        {/* <FoodsTitle title={'Món chính'} foodsMap={foods.monChinh} handleDeleteFood={handleDeleteFood} />
                        <FoodsTitle title={'Món khai vị'} foodsMap={foods.monkhaivi} handleDeleteFood={handleDeleteFood} />
                        <FoodsTitle title={'Món tráng miệng'} foodsMap={foods.montrangMieng} handleDeleteFood={handleDeleteFood} /> */}
                        <FoodsTitle title={'Món chính'} foodsMap={foods.monChinh} />
                        <FoodsTitle title={'Món khai vị'} foodsMap={foods.monkhaivi} />
                        <FoodsTitle title={'Món tráng miệng'} foodsMap={foods.montrangMieng}/>
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
                        {selectedDishes.length > 0 &&
                            selectedDishes.map(dish => (
                                <div key={dish.id} className="flex justify-between items-center bg-whiteAlpha-200 p-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
                                    <div className="flex flex-col">
                                        <span className="text-base font-semibold text-white">{dish.name}</span>
                                        <span className="text-gray-400">Số lượng: <span className='text-base font-semibold'>{dish.quantity}</span></span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => handleDecreaseOtherQuantity(dish.id)} // Call the specific decrease function for other dishes
                                            className="bg-whiteAlpha-400 text-white w-[34px] h-[32px] rounded hover:bg-whiteAlpha-600 transition text-base font-bold"
                                        >
                                            -
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleChangeQuantity(dish.id, selectOtherDishes, setSelectOtherDishes, 1)} // Increase function
                                            className="bg-whiteAlpha-400 text-white w-[34px] h-[32px] rounded hover:bg-whiteAlpha-600 transition text-base font-bold"
                                        >
                                            +
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveDish(dish.id)}
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
                            selectOtherDishes.map(dish => (
                                <div key={dish.id} className="flex justify-between items-center bg-whiteAlpha-200 p-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
                                    <div className="flex flex-col">
                                        <span className="text-base font-semibold text-white">{dish.name}</span>
                                        <span className="text-gray-400">Số lượng: <span className='text-base font-semibold'>{dish.quantity}</span></span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => handleDecreaseOtherQuantity(dish.id)} // Call the specific decrease function for other dishes
                                            className="bg-whiteAlpha-400 text-white w-[34px] h-[32px] rounded hover:bg-whiteAlpha-600 transition text-base font-bold"
                                        >
                                            -
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleChangeQuantity(dish.id, selectOtherDishes, setSelectOtherDishes, 1)} // Increase function
                                            className="bg-whiteAlpha-400 text-white w-[34px] h-[32px] rounded hover:bg-whiteAlpha-600 transition text-base font-bold"
                                        >
                                            +
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveDish(dish.id)}
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

export default ChiTietTiecCuaChiNhanhPage;