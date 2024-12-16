'use client';
import AdminHeader from '@/app/_components/AdminHeader';
import { API_CONFIG } from '@/app/_utils/api.config';
import { Stack } from '@chakra-ui/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import AdminInputStage from '../../sanh/[slug]/[id]/AdminInputStage';
import AdminInputPackageImg from './AdminInputPackageImg';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux';
import useApiServices from '@/app/_hooks/useApiServices';
import useCustomToast from '@/app/_hooks/useCustomToast';
import { FoodsTitle, TitleSpanInfo } from '../../quan-ly-tiec/[slug]/[id]/ServiceMethod';
import { DropdownField } from './DropdownField';
import { inputInfoUser } from './InputSectionPackage';
import InputDetailCustomer from '../../quan-ly-tiec/[slug]/[id]/InputDetailCustomer';

const defaultValues = {
    name: "",
    username: "",
    email: "",
    phone: "",
    description: "",
    short_description: "",
    stage_id: 0,
    party_type_id: 0,
    menu_id: 0,
    decor_id: 0,
    price: 0,
    images: [],
    other_service: []
};

const stageSchema = z.object({
    name: z.string().min(1, { message: "Tên trang trí là bắt buộc" }),
    description: z.string().optional(),
    short_description: z.string().optional(),
    price: z.union([
        z.string().min(1, { message: "Giá không hợp lệ" }),
        z.number().min(0, { message: "Giá không hợp lệ" }),
    ]),
    images: z.array(z.string().url()).optional(),
    other_service: z.array(z.number()).optional(),
});

const Page = ({ params }) => {
    const { id } = params;
    const [packageDetail, setPackageDetail] = useState({});
    const { makeAuthorizedRequest } = useApiServices();
    const toast = useCustomToast();
    const dispatch = useDispatch();

    const [otherServices, setOtherServices] = useState([]);
    const [selectedOtherServices, setSelectedOtherServices] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const otherServiceRef = useRef(otherServices);

    const [menus, setMenus] = useState([]);
    const [foods, setFoods] = useState({
        nuocUong: [],
        monChinh: [],
        montrangMieng: [],
        monkhaivi: []

    });
    const menusRef = useRef(menus);
    const [newImages, setNewImages] = useState([]);
    const [selectedMenu, setSelectedMenu] = useState('');

    const [partyTypes, SetPartyTypes] = useState([]);
    const partyRef = useRef(partyTypes);
    const [selectPartyTypes, setSelectPartyTypes] = useState('');


    const { handleSubmit, control, reset, formState: { errors }, trigger } = useForm({
        resolver: zodResolver(stageSchema),
        defaultValues,
    });

    const fetchAllPartyTypes = async () => {
            try {
                const response = await makeAuthorizedRequest(API_CONFIG.PARTY_TYPES.GET_ALL(), 'GET');
                const partyTypeOptions = response.data.map(partyType => ({
                    value: partyType.id,
                    label: partyType.name,
                    price: partyType.price,
                }));

                console.log(partyTypeOptions)
    
                SetPartyTypes({ title: 'Dịch vụ tiệc', options: [{ value: '', label: 'Không chọn' }] }, ...partyTypeOptions);
                partyRef.current = partyTypeOptions;
                if (!selectPartyTypes && partyTypeOptions.length) {
                    setSelectPartyTypes(partyTypeOptions[0].value);
                }
            } catch (error) {
                console.error('Error fetching party types:', error);
            }
        };

        console.log(partyTypes)
    const fetchPackageForOtherServices = async () => {
        try {
            const response = await makeAuthorizedRequest(API_CONFIG.CATEGORIES.GET_BY_ID(9), 'GET');
            const childrenServices = response.data[0]?.childrens || [];

            const options = childrenServices.flatMap(child =>
                child.products.map(product => ({
                    value: product.id,
                    label: product.name,
                    price: product.price,
                }))
            );

            const optionsWithDefault = [
                { title: 'Dịch vụ thêm', options: [{ value: '', label: 'Không chọn' }] },
                ...options,
            ];

            setOtherServices(optionsWithDefault);
            otherServiceRef.current = optionsWithDefault;
        } catch (error) {
            console.error('Lỗi khi lấy dịch vụ khác:', error);
        }
    };
    const fetchAllMenus = async () => {
        try {
            const response = await makeAuthorizedRequest(API_CONFIG.MENU.GET_ALL({ itemsPerPage: '99' }), 'GET');
            const menuOptions = response.data.map(menu => ({
                value: menu.id,
                label: menu.name,
                price: menu.price,
            }));

            const updatedMenus = [{ title: 'Dịch vụ thêm', options: [{ value: '', label: 'Không chọn' }] }, ...menuOptions];

            setMenus(updatedMenus);
            menusRef.current = updatedMenus;
            if (!selectedMenu && menuOptions.length > 0) {
                setSelectedMenu(menuOptions[0].value);
                await fetchFoodsByMenuId(menuOptions[0].value);

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

    const fetchDataPackage = async () => {
        try {
            const response = await makeAuthorizedRequest(API_CONFIG.PACKAGES.GET_BY_ID(id), 'GET');
            const packageData = response.data[0];
            setPackageDetail(packageData);
            await fetchPackageForOtherServices();

            await fetchAllPartyTypes()

            // Gọi fetchAllMenus trước khi cập nhật selectedMenu
            await fetchAllMenus();

            if (packageData) {

                await fetchFoodsByMenuId(packageData.menu_id);

                const parsedOtherServices = JSON.parse(packageData.other_service);

                // Duyệt qua từng dịch vụ trong parsedOtherServices
                const selectedServices = [];

                parsedOtherServices.forEach(service => {
                    const matchedService = otherServiceRef.current.find(option => option.value === service.id);

                    if (matchedService) {
                        selectedServices.push({
                            ...matchedService,
                            quantity: service.quantity
                        });
                    }
                });

                setSelectedOtherServices(selectedServices);

                const menuExists = menusRef.current.find(menu => menu.value === packageData.menu_id);
                if (menuExists) {
                    setSelectedMenu(packageData.menu_id);
                }
                setSelectPartyTypes(packageData.party_type_id);

                reset({
                    name: packageData.name,
                    description: packageData.description,
                    short_description: packageData.short_description,
                    price: packageData.price,
                    images: packageData.images || [],
                    stage_id: packageData.stage_id,
                    party_type_id: packageData.party_type_id,
                    menu_id: packageData.menu_id,
                    decor_id: packageData.decor_id,
                    username: packageData.users.username,
                    email: packageData.users.email,
                    phone: packageData.users.phone,
                });
            }

        } catch (error) {
            console.error("Error fetching package data:", error);
            toast({ title: "Lỗi", description: "Không thể tải dữ liệu gói.", status: "error" });
        }
    };

    useEffect(() => {
        fetchDataPackage();
    }, [id]);


    const handleSelectService = (value) => {
        const allOptions = otherServices.flatMap(optionGroup => {
            if (Array.isArray(optionGroup.options)) {
                return optionGroup.options;
            }
            if (optionGroup.value && optionGroup.label) {
                return [{ value: optionGroup.value, label: optionGroup.label, price: optionGroup.price }];
            }
            return [];
        });
        const selectedService = allOptions.find(option => option.value === Number(value));
        if (selectedService) {
            setSelectedOption(selectedService.value);
            setSelectedOtherServices(selectedOtherServices => {
                const isAlreadySelected = selectedOtherServices.some(service => service.value === selectedService.value);
                return isAlreadySelected
                    ? selectedOtherServices.filter(service => service.value !== selectedService.value)
                    : [...selectedOtherServices, selectedService];
            });
        } else {
            console.warn('Dịch vụ không hợp lệ, không tìm thấy:', value);
        }
    };

    const handleSelectMenu = async (event) => {

        setSelectedMenu(Number(event));

        await fetchFoodsByMenuId(event);
    };
    const handlePartyTypeChange = async (event) => {
        setSelectPartyTypes(Number(event))
    };

    const handleRemoveService = useCallback((index) => {
        setSelectedOtherServices(currentSelection => currentSelection.filter((_, i) => i !== index));
    }, []);

    return (
        <div>
            <AdminHeader showSearchForm={false} title={`Gói combo - ${packageDetail?.name || "Loading..."}`} />
            <Stack alignItems="start" spacing="8" direction="row" className="mt-5">
                <h1 className="text-base leading-6 font-normal text-gray-400">
                    Thông tin gói / {packageDetail.name || "Loading..."}
                </h1>
            </Stack>

            <div className='flex mt-5 gap-5'>
                <AdminInputStage
                    title="Thông tin sảnh"
                    control={control}
                    heightTextarea={'h-[120px]'}
                    fields={[
                        { type: "text", placeholder: "Tên trang trí", name: "name" },
                        { type: "textarea", placeholder: "Mô tả dài", name: "description" },
                        { type: "textarea", placeholder: "Mô tả ngắn", name: "short_description" },
                        { type: "number", placeholder: "Giá tiền", name: "price" },
                    ]}
                    errors={errors}
                />
                <AdminInputPackageImg
                    title="Hình ảnh trang trí"
                    inputId="input-image-upload-decors"
                    name='images'
                    initialImages={packageDetail.images || []}
                    onImageChange={setNewImages}
                />
            </div>
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
                            control={control}
                            trigger={trigger}
                        />
                    ))}
                </div>
            </div>
            <div className='p-4 mt-5 w-full bg-whiteAlpha-200 rounded-lg flex flex-col gap-[22px]'>
                <TitleSpanInfo title={'Thực đơn'} />
                <div className='grid grid-cols-4 gap-[30px]'>
                    <DropdownField
                        label="Chọn dịch vụ"
                        name="menus"
                        options={menusRef.current || []}
                        value={selectedMenu}
                        onChange={(e) => handleSelectMenu(Number(e.target.value))}
                    />
                    <FoodsTitle title={'Món chính'} foodsMap={foods.monChinh} />
                    <FoodsTitle title={'Món khai vị'} foodsMap={foods.monkhaivi} />
                    <FoodsTitle title={'Món tráng miệng'} foodsMap={foods.montrangMieng} />
                </div>

            </div>
            <div className='p-4 mt-5 w-full bg-whiteAlpha-200 rounded-lg flex flex-col gap-[22px]'>
                <TitleSpanInfo title={'Dịch vụ tiệc'} />
                <div className='grid grid-cols-4 gap-[30px]'>
                    <DropdownField
                        label="Chọn dịch vụ"
                        name="partyTypes"
                        options={partyRef.current || []}
                        value={selectPartyTypes}
                        onChange={(e) => handlePartyTypeChange(Number(e.target.value))}
                    />
                </div>

            </div>

            <div className='p-4 mt-5 w-full bg-whiteAlpha-200 rounded-lg flex flex-col gap-[22px]'>
                <TitleSpanInfo title={'Dịch vụ trang trí'} />
                <div className='grid grid-cols-3 gap-[30px]'>
                    <DropdownField
                        label="Chọn dịch vụ"
                        name="other_service"
                        options={otherServices}
                        value={selectedOption}
                        onChange={(e) => handleSelectService(e.target.value)}
                    />
                    {selectedOtherServices.length > 0 && selectedOtherServices.map((service, index) => (
                        <div key={`${service.value}-${index}`} className="flex justify-between items-center bg-whiteAlpha-200 p-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
                            <div className="flex flex-col">
                                <span className="text-base font-semibold text-white">{service.label}</span>
                                <span className="text-base font-semibold text-white">{service.price}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    type="button"
                                    onClick={() => handleRemoveService(index)}
                                    className="bg-red-600 text-white px-3 h-[32px] rounded hover:bg-red-700 transition"
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Page;