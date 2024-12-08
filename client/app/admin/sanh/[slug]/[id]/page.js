'use client'
import AdminHeader from '@/app/_components/AdminHeader';
import { IconButton, Stack } from '@chakra-ui/react';
import React, { useState, useEffect, useCallback } from 'react';
import useApiServices from '@/app/_hooks/useApiServices';
import { API_CONFIG } from '@/app/_utils/api.config';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AdminInputStage from './AdminInputStage';
import AdminInputStageImg from './AdminInputStageImg';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import IconButtonSave from '@/app/_components/IconButtonSave';
import useCustomToast from '@/app/_hooks/useCustomToast';
import { useDispatch } from 'react-redux';
import { updatingStageSuccess } from '@/app/_lib/features/stages/stagesSlice';

const defaultValues = {
    name: "",
    description: "",
    capacity_min: 0,
    capacity_max: 250,
    price: 0,
    images: [],
    branch_id: "",
};

const stageSchema = z.object({
    name: z.string().min(1, { message: "Tên sảnh là bắt buộc" }),
    description: z.string().optional(),
    capacity_min: z.number().min(0, { message: "Sức chứa tối thiểu không hợp lệ" }),
    capacity_max: z.number().min(1, { message: "Sức chứa tối đa không hợp lệ" }),
    price: z.number().min(0, { message: "Giá không hợp lệ" }),
    images: z.array(z.string().url()).optional(),
});

const Page = ({ params }) => {
    const { id } = params;
    const { makeAuthorizedRequest } = useApiServices();
    const [stageDetail, setStageDetail] = useState(null);
    const [branchIDStages, setBranchIDStages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const toast = useCustomToast();
    const dispatch = useDispatch();
    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(stageSchema),
        defaultValues,
    });

    const fetchStageData = useCallback(async () => {
        try {
            const response = await makeAuthorizedRequest(API_CONFIG.STAGES.GET_BY_ID(id));
            if (response && response.data && response.data.length > 0) {
                const stageData = response.data[0]; 
                reset(stageData); 
                setStageDetail(stageData);
            } else {
                throw new Error("No stage data found");
            }
        } catch (error) {
            console.error("Error fetching stage data: ", error);
        }
    }, [reset, id]);

    const fetchBranchIDStages = useCallback(async () => {
        try {
            const response = await makeAuthorizedRequest(API_CONFIG.BRANCHES.GET_ALL());
            if (response && response.data) {
                setBranchIDStages(response.data);
            } else {
                throw new Error("No branch ID stages data found");
            }
        } catch (error) {
            console.error("Error fetching branch ID stages data: ", error);
        }
    }, []);

    useEffect(() => {
        fetchStageData();
        fetchBranchIDStages(); 
    }, [fetchStageData, fetchBranchIDStages]);

    const onSubmit = async (data) => {
        const formData = new FormData();
        
        // Append existing images
        if (stageDetail?.images) {
            stageDetail.images.forEach(image => {
                formData.append('images[]', image);
            });
        }

        // Append new images
        newImages.forEach(image => {
            formData.append('images[]', image);
        });

        // Append other form data
        Object.keys(data).forEach((key) => {
            formData.append(key, data[key]);
        });

        try {
            const response = await makeAuthorizedRequest(API_CONFIG.STAGES.UPDATE(stageDetail.id), "POST", formData);
            if (response.success) {
                dispatch(updatingStageSuccess(response.data));
                toast({
                    title: "Cập nhật thành công",
                    description: message || "Đã chỉnh sửa lại dữ liệu mới.",
                    type: "success",
                  });
            } else {
                const { statusCode, message } = response.error || {}
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
            console.error("Error while submitting form: ", error);
        }
    };

    return (
        <div>
            <AdminHeader showSearchForm={false} title={`Chi tiết Sảnh - ${stageDetail?.name || "Loading..."}`} />
            <Stack alignItems="start" spacing="8" direction="row" className="mt-5">
                <h1 className="text-base leading-6 font-normal text-gray-400">
                    Thông tin Sảnh / {stageDetail ? stageDetail.name : "Loading..."}
                </h1>
            </Stack>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='mt-5 flex gap-5'>
                    <AdminInputStage
                        title="Thông tin sảnh"
                        control={control}
                        heightTextarea={'h-[120px]'}
                        fields={[
                            { type: "text", placeholder: "Tên sảnh", name: "name" },
                            { type: "textarea", placeholder: "Mô tả", name: "description" },
                            { type: "number", placeholder: "Sức chứa tối thiểu", name: "capacity_min" },
                            { type: "number", placeholder: "Sức chứa tối đa", name: "capacity_max" },
                            { type: "number", placeholder: "Giá", name: "price" },
                            { 
                                type: "options", 
                                placeholder: "Chi nhánh", 
                                name: "branch_id", 
                                options: branchIDStages.map(branch => ({ value: branch.id, label: branch.name })),
                                defaultValue: stageDetail?.branch_id || "", 
                            }
                        ]}
                        errors={errors}
                    />
                    <AdminInputStageImg 
                        title="Hình ảnh carousel"
                        inputId="input-image-upload-carousel"
                        name='images'
                        initialImages={Array.isArray(stageDetail?.images) ? stageDetail.images : []}
                        onImageChange={setNewImages} 
                    />
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