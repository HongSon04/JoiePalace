"use client";

import { useEffect, useState } from 'react';
import { Box, Heading, Image } from '@chakra-ui/react';


const readFilesAsDataURLs = (files) => {
    const readFilePromises = Array.from(files).map(file => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
        });
    });
    return Promise.all(readFilePromises);
};


const AdminThemChiNhanhImg = ({ title, inputId }) => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        console.log(images);
    }, [images]);

    const handleImageUpload = async (event) => {
        try {
            const newImages = await readFilesAsDataURLs(event.target.files);
            setImages(prevImages => [...prevImages, ...newImages]);
        } catch (error) {
            console.error("Error reading files:", error);
        }
    };

    const handleDeleteImage = (index) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    const isUploadLimitReached = images.length >= 2;

    return (
        <div className="flex-1 p-4 bg-white rounded-lg h-fit">
            <Heading as='h2' className="font-bold text-gray-600 leading-6 text-base">{title}</Heading>
            <div className="grid grid-cols-2 gap-5 mt-[10px] w-full">
                {images.map((src, index) => (
                    <Box key={index} position="relative">
                        <Image src={src} alt={`carousel-img-${index}`} className="rounded-lg object-cover w-full" h='180px' />
                        <button
                            className="absolute size-5 p-5 top-1 right-1 border-none outline-none text-white rounded-full bg-red-400 flex items-center justify-center font-medium text-center"
                            onClick={() => handleDeleteImage(index)}
                        >
                            X
                        </button>
                    </Box>
                ))}
                {!isUploadLimitReached  && (
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        cursor="pointer"
                        as="label"
                        htmlFor={inputId}
                        className="bg-blackAlpha-100 rounded-lg"
                        h='180px'
                    >
                        <div className="p-3 rounded-full bg-whiteAlpha-600 flex items-center justify-center align-middle mx-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
          <path d="M16.3333 11.3333H11.3333V16.3333H9.66663V11.3333H4.66663V9.66663H9.66663V4.66663H11.3333V9.66663H16.3333V11.3333Z" fill="#4B5563"/>
        </svg>
                        </div>
                        <input
                            id={inputId}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleImageUpload}
                            multiple
                        />
                    </Box>
                )}
            </div>
        </div>
    );
};

export default AdminThemChiNhanhImg;
