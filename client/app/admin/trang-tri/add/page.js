'use client';

import AdminHeader from '@/app/_components/AdminHeader';
import useApiServices from '@/app/_hooks/useApiServices';
import useCustomToast from '@/app/_hooks/useCustomToast';
import { API_CONFIG } from '@/app/_utils/api.config';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import AdminInputStage from '../../sanh/[slug]/[id]/AdminInputStage';
import { TitleSpanInfo } from '../../quan-ly-tiec/[slug]/[id]/ServiceMethod';
import IconButtonSave from '@/app/_components/IconButtonSave';
import { DropdownField } from '../[id]/DropdownField';
import AdminInputStageImgDecor from './AdminInputStageImg';

const defaultValues = {
    name: "",
    description: "",
    short_description: "",
    price: 0,
    images: [],
    products: [],
};

const stageSchema = z.object({
    name: z.string().min(1, { message: "Tên trang trí là bắt buộc" }),
    description: z.string().optional(),
    short_description: z.string().optional(),
    price: z.union([
        z.string().min(1, { message: "Giá không hợp lệ" }),
        z.number().min(0, { message: "Giá không hợp lệ" }),
    ]),
    images: z.array(z.instanceof(File)).optional(),
    products: z.array(z.number()).optional(),
});

const CreateDecorationPage = () => {
    const [products, setProducts] = useState([]);
    const [imagesData, setImagesData] = useState({
        images: [],
    });
    const [selectProducts, setSelectProducts] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    
    const { makeAuthorizedRequest } = useApiServices();
    const toast = useCustomToast();
    
    const { handleSubmit, control, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(stageSchema),
        defaultValues,
    });

    const fetchProducts = async () => {
        try {
            const productsResponse = await makeAuthorizedRequest(API_CONFIG.PRODUCTS.GET_SERVICES(), 'GET');
            if (productsResponse.statusCode === 200 && productsResponse.data) {
                const categories = Object.entries(productsResponse.data).map(([categoryName, services]) => ({
                    category: categoryName,
                    options: services.map(service => ({
                        value: service.id,
                        label: service.name,
                        price: service.price,
                    })),
                }));

                const optionsWithDefault = [
                    { category: 'Chọn dịch vụ', options: [{ value: '', label: 'Không chọn' }] },
                    ...categories,
                ];
                setProducts(optionsWithDefault);
            } else {
                console.error('Không có dữ liệu hợp lệ từ productsResponse', productsResponse);
            }
        } catch (error) {
            console.error("Error fetching products: ", error);
            toast({ title: "Lỗi", description: "Không thể tải dịch vụ.", status: "error" });
        }
    };
    
    useEffect(() => {
        fetchProducts();
    }, []);
    
    const handleImagesChange = (name, files) => {
        if (!name || !files) return;
        setImagesData((prev) => ({ ...prev, [name]: files }));
        setValue(name, files, { shouldValidate: true });
    };
    useEffect(() => {
        console.log(imagesData);
    }, [imagesData]);

    const onSubmit = async (data) => {
        const formData = new FormData();
        
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('short_description', data.short_description);

        // Add images to FormData
        Object.entries(imagesData).forEach(([key, files]) => {
            files.forEach((file) => formData.append(key, file));
        });

        const productIds = selectProducts.map(product => product.value);
        const productPrices = selectProducts.map(product => product.price);
        const totalPrice = productPrices.reduce((total, price) => total + price, 0);

        formData.append('price', totalPrice.toString());
        formData.append('products', JSON.stringify(productIds));

        try {
            const response = await makeAuthorizedRequest(API_CONFIG.DECORS.CREATE, "POST", formData);
            if (response.success) {
                toast({
                    title: "Tạo thành công",
                    description: "Đã tạo trang trí mới.",
                    type: "success",
                });
                // Optionally reset form or redirect
            } else {
                const { statusCode, message } = response.error || {};
                if (statusCode === 401) {
                    toast({
                        title: "Phiên đăng nhập đã hết hạn",
                        description: "Vui lòng đăng nhập lại để thực hiện tác vụ",
                        type: "error",
                    });
                } else {
                    toast({
                        title: "Tạo thất bại",
                        description: message || "Yêu cầu chưa được thực hiện.",
                        type: "error",
                    });
                }
            }
        } catch (error) {
            console.error("Error while creating decoration: ", error);
            toast({ title: "Lỗi", description: "Đã xảy ra lỗi khi gửi dữ liệu.", type: "error" });
        }
    };

    const handleSelectProduct = (value) => {
        const selectedProduct = products
            .flatMap(category => category.options)
            .find(option => option.value === Number(value));

        if (selectedProduct) {
            setSelectedOption(value);
            setSelectProducts(prevSelectProducts =>
                prevSelectProducts.some(prod => prod.value === selectedProduct.value)
                    ? prevSelectProducts.filter(prod => prod.value !== selectedProduct.value)
                    : [...prevSelectProducts, selectedProduct]
            );
        }
    };

    const handleRemoveDish = (index) => {
        setSelectProducts(currentSelection => currentSelection.filter((_, i) => i !== index));
    };

    
    return (
        <div>
            <AdminHeader showSearchForm={false} title="Tạo trang trí mới" />
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='flex mt-5 gap-5'>
                    <AdminInputStage
                        title="Thông tin trang trí"
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
                    <AdminInputStageImgDecor
                        title="Hình ảnh trang trí"
                        inputId="input-image-upload-decors"
                        onImagesChange={handleImagesChange} 
                        name={'images'}
                        initialImages={imagesData} 
                    />
                </div>
                <div className='flex flex-col gap-[22px] mt-5'>
                    <TitleSpanInfo title={'Dịch vụ trang trí'} />
                    <div className='grid grid-cols-3 gap-[30px]'>
                        <DropdownField
                            label="Dịch vụ trang trí"
                            name="service-select"
                            options={products}
                            value={selectedOption}
                            onChange={(e) => handleSelectProduct(e.target.value)}
                        />
                        {selectProducts.length > 0 && selectProducts.map((dish, index) => (
                            <div key={`${dish.value}-${index}`} className="flex justify-between items-center bg-whiteAlpha-200 p-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
                                <div className="flex flex-col">
                                    <span className="text-base font-semibold text-white">{dish.label}</span>
                                    <span className="text-base font-semibold text-white">{dish.price}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveDish(index)}
                                        className="bg-red-600 text-white px-3 h-[32px] rounded hover:bg-red-700 transition"
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex w-full mt-6">
                    <div className="ml-auto flex space-x-4">
                        <IconButtonSave title="Hủy" color="bg-red-400" type="button" />
                        <IconButtonSave title="Lưu" color="bg-teal-400" type="submit" />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateDecorationPage;