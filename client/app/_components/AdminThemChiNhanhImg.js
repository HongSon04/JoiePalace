"use client";

import { useEffect, useState } from 'react';
import { Box, Heading, Image } from '@chakra-ui/react';

const AdminThemChiNhanhImg = ({ title, inputId }) => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        console.log(images);
    }, [images]);

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);

        const readFiles = files.map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = () => reject(reader.error);

                reader.readAsDataURL(file);
            });
        });

        Promise.all(readFiles).then(newImages => {
            setImages((prevImages) => [...prevImages, ...newImages]);
        }).catch(error => {
            console.error("Error reading files:", error);
        });
    };

    const handleDeleteImage = (index) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    return (
        <div className="flex-1 p-4 bg-blackAlpha-100 rounded-lg h-fit">
            <Heading as='h2' className="font-bold">{title}</Heading>
            <div className="grid grid-cols-2 gap-5 mt-[10px] w-full">
                {images.map((src, index) => (
                    <Box key={index} position="relative">
                        <Image src={src} alt={`carousel-img-${index}`} className="rounded-lg object-cover w-full" h='170px' />
                        <button
                            className="absolute size-5 p-5 top-1 right-1 border-none outline-none text-white rounded-full bg-red-400 flex items-center justify-center font-medium text-center"
                            onClick={() => handleDeleteImage(index)}
                        >
                            X
                        </button>
                    </Box>
                ))}
                {images.length < 2 && (
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        cursor="pointer"
                        as="label"
                        htmlFor={inputId}
                        className="bg-blackAlpha-100 rounded-lg"
                        h='170px'
                    >
                        <div className="size-5 p-5 rounded-full bg-gray-600 flex items-center justify-center align-middle mx-auto">
                            <label htmlFor={inputId} className="text-xl font-medium text-center">+</label>
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
