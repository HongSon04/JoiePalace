'use client';
import { Box, Button, Image, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

const AdminInputStageImg = ({ title, inputId, initialImages = [] }) => {
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState(initialImages || []);

    useEffect(() => {
        imagePreviews.forEach((src) => URL.revokeObjectURL(src));
        setImagePreviews(initialImages);
    }, [initialImages]);

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        const newImagePreviews = files.map((file) => URL.createObjectURL(file));
        
       
        setImagePreviews((prevImages) => [...prevImages, ...newImagePreviews]);
        setImageFiles((prevFiles) => [...prevFiles, ...files]);
        onImageChange(files);
    };

    const handleDeleteImage = (index) => {
        // Revoke object URL to avoid memory leak
        URL.revokeObjectURL(imagePreviews[index]);
        
        setImagePreviews((prevPreviews) => 
            prevPreviews.filter((_, i) => i !== index)
        );

        setImageFiles((prevFiles) => 
            prevFiles.filter((_, i) => i !== index)
        );
    };

    return (
        <div className="flex-1 p-4 bg-whiteAlpha-200 rounded-lg h-fit">
            <h3 className="font-bold text-white leading-6 text-base">{title}</h3>
            <div className="grid grid-cols-2 gap-5 mt-[10px] w-full">
                {imagePreviews.length > 0 ? (
                    imagePreviews.map((src, index) => (
                        <Box key={index} className='relative'>
                            <Image src={src} alt={`carousel-img-${index}`} className="rounded-lg object-cover w-full" h='180px' />
                            <Button
                                className="absolute top-0 right-0 m-2"
                                colorScheme="red"
                                onClick={() => handleDeleteImage(index)}
                            >
                                X
                            </Button>
                        </Box>
                    ))
                ) : (
                    <Text className="text-gray-500 col-span-2">Chưa có hình ảnh nào được upload.</Text>
                )}
                <Box display="flex" alignItems="center" justifyContent="center" cursor="pointer" as="label" htmlFor={inputId} className="bg-whiteAlpha-200 rounded-lg" h='180px'>
                    <div className="p-3 rounded-full bg-whiteAlpha-600 flex items-center justify-center align-middle mx-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                            <path d="M16.3333 11.3333H11.3333V16.3333H9.66663V11.3333H4.66663V9.66663H9.66663V4.66663H11.3333V9.66663H16.3333V11.3333Z" fill="#4B5563" />
                        </svg>
                    </div>
                    <input id={inputId} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} multiple />
                </Box>
            </div>
        </div>
    );
};

export default AdminInputStageImg;