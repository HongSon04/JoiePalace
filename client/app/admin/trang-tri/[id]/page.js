'use client';

import AdminHeader from '@/app/_components/AdminHeader';
import useApiServices from '@/app/_hooks/useApiServices';
import useCustomToast from '@/app/_hooks/useCustomToast';
import { API_CONFIG } from '@/app/_utils/api.config';
import { Stack } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import AdminInputStage from '../../sanh/[slug]/[id]/AdminInputStage';
import AdminInputStageImg from '../../sanh/[slug]/[id]/AdminInputStageImg';
import { TitleSpanInfo } from '../../quan-ly-tiec/[slug]/[id]/ServiceMethod';
import { DropdownField } from './DropdownField';
import IconButtonSave from '@/app/_components/IconButtonSave';
import { updatingDecorsSuccess } from '@/app/_lib/decors/decorsSlice';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';

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
    images: z.array(z.string().url()).optional(),
    products: z.array(z.number()).optional(),
});

const Page = ({ params }) => {
    const { id } = params;
    const [decorsDetail, setDecorsDetail] = useState({});
    const { makeAuthorizedRequest } = useApiServices();
    const toast = useCustomToast();
    const [newImages, setNewImages] = useState([]);
    const [selectProducts, setSelectProducts] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const dispatch = useDispatch();
    const router = useRouter();


    const { handleSubmit, control, reset, formState: { errors } } = useForm({
        resolver: zodResolver(stageSchema),
        defaultValues,
    });

    const [products, setProducts] = useState([{
        svg: null,
        title: 'Dịch vụ trang trí',
        type: 'select',
        name: 'products',
        options: [{ value: null, label: 'Không chọn', id: 0 }],
    }]);

    const fetchData = async () => {
        try {
            const [productsResponse, decorsResponse] = await Promise.all([
                makeAuthorizedRequest(API_CONFIG.PRODUCTS.GET_SERVICES(), 'GET'),
                makeAuthorizedRequest(API_CONFIG.DECORS.GET_BY_ID(id), 'GET'),
            ]);

            if (productsResponse.statusCode === 200) {
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
                console.error('Không có dữ liệu hợp lệ từ productsResponse');
            }

            if (decorsResponse?.data?.length > 0) {
                const decorsData = decorsResponse.data[0];
                reset({
                    name: decorsData.name,
                    description: decorsData.description,
                    short_description: decorsData.short_description,
                    price: decorsData.price,
                    images: decorsData.images,
                    products: decorsData.products.map(product => product.id),
                });
                setDecorsDetail(decorsData);
            } else {
                throw new Error("No stage data found");
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
            toast({ title: "Lỗi", description: "Không thể tải dữ liệu.", status: "error" });
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    useEffect(() => {
        if (decorsDetail.products && products.length > 0) {
            const productValues = decorsDetail.products.map(product => product.id);
            const matchedProducts = products.flatMap(category =>
                category.options.filter(option => productValues.includes(option.value))
            );
            setSelectProducts(matchedProducts);
        }
    }, [products, decorsDetail]);

    const onSubmit = async (data) => {
        const formData = new FormData();
    
        if (decorsDetail?.images) {
            decorsDetail.images.forEach(image => {
                formData.append('images[]', image);
            });
        }
    
        newImages.forEach(image => {
            formData.append('images[]', image);
        });
    
        // Append other form fields
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('short_description', data.short_description);
    
        // Tính tổng giá của các sản phẩm
        const productIds = selectProducts.map(product => product.value); 
        const productPrices = selectProducts.map(product => product.price);
        const totalPrice = productPrices.reduce((total, price) => total + price, 0); 
    
        // Cập nhật trường price với tổng giá
        formData.append('price', totalPrice.toString()); // Gửi giá dưới dạng chuỗi
    
        formData.append('products', JSON.stringify(productIds)); // Gửi dưới dạng chuỗi JSON
    
        try {
            const response = await makeAuthorizedRequest(API_CONFIG.DECORS.UPDATE(decorsDetail.id), "PATCH", formData);
            if (response.success) {
                dispatch(updatingDecorsSuccess(response.data));
                toast({
                    title: "Cập nhật thành công",
                    description: response.message || "Đã chỉnh sửa lại dữ liệu mới.",
                    type: "success",
                });
                router.refresh()
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
                        title: "Cập nhật thất bại",
                        description: message || "Yêu cầu chưa được cập nhật trạng thái",
                        type: "error",
                    });
                }
            }
        } catch (error) {
            console.error("Error while submitting form: ", error);
            toast({ title: "Lỗi", description: "Đã xảy ra lỗi khi gửi dữ liệu.", type: "error" });
        }
    };

    const handleSelectProduct = (value) => {
        const selectedProduct = products
            .flatMap(category => category.options)
            .find(option => option.value === Number(value));

        if (selectedProduct) {
            setSelectedOption(value);
            setSelectProducts(selectProducts =>
                selectProducts.some(prod => prod.value === selectedProduct.value)
                    ? selectProducts.filter(prod => prod.value !== selectedProduct.value)
                    : [...selectProducts, selectedProduct]
            );
        }
    };


    const handleRemoveDish = useCallback((index) => {
        setSelectProducts(currentSelection => currentSelection.filter((_, i) => i !== index));
    }, []);

    return (
        <div>
            <AdminHeader showSearchForm={false} title={`Chi trang trí - ${decorsDetail?.name || "Loading..."}`} />
            <Stack alignItems="start" spacing="8" direction="row" className="mt-5">
                <h1 className="text-base leading-6 font-normal text-gray-400">
                    Thông tin trang trí / {decorsDetail.name || "Loading..."}
                </h1>
            </Stack>
            <form onSubmit={handleSubmit(onSubmit)}>

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
                <AdminInputStageImg
                    title="Hình ảnh trang trí"
                    inputId="input-image-upload-decors"
                    name='images'
                    initialImages={decorsDetail?.images || []}
                    onImageChange={setNewImages}
                />
            </div>
            <div className='flex flex-col gap-[22px] mt-5'>
                <TitleSpanInfo title={'Dịch vụ trang trí'} />
                <div className='grid grid-cols-3 gap-[30px]'>
                    <DropdownField
                        label=""
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

export default Page;
