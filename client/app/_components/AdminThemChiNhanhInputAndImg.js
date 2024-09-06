'use client';

import { Grid, GridItem, Heading, Image } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

const AdminThemChiNhanhInputAndImg = ({ title, height, inputId, input = true }) => {
    const [description, setDescription] = useState([]);

    useEffect(() => {
        console.log(description);
    }, [description]);

    const getLabelForIndex = (index) => {
        return String.fromCharCode(65 + index);
    };

    const handleAddDescription = (event) => {
        const files = Array.from(event.target.files);

        const readFiles = files.map((file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = () => reject(reader.error);

                reader.readAsDataURL(file);
            });
        });

        Promise.all(readFiles)
            .then((newImages) => {
                setDescription((prevImages) => [...prevImages, ...newImages]);
            })
            .catch((error) => {
                console.error('Error reading files:', error);
            });
    };


    return (
        <div className="flex p-4 flex-col gap-[10px] bg-blackAlpha-100 rounded-lg">
            <Heading as="h2" size="md" className="font-bold">
                {title}
            </Heading>
            <Grid templateColumns="repeat(3, 1fr)" gap="20" className="mt-[10px]">
                {description.map((item, index) => (
                    <GridItem key={index} w="100%" className="rounded-lg">
                        <div className="flex flex-col gap-5">
                            <div className="relative">
                                <Image
                                    src={item} alt={`carousel-img-${index}`}
                                    w="100%"
                                    h="170px"
                                    className="rounded-lg object-cover"
                                />
                                <span className="absolute top-4 left-[19px] bg-blackAlpha-400 p-1 rounded-lg w-fit font-medium">
                                    HALL {getLabelForIndex(index)}
                                </span>
                            </div>
                            {input && (
                                <input
                                    key={index}
                                    type='text'
                                    placeholder='Tên không gian'
                                    className="px-[10px] py-3 bg-whiteAlpha-100 text-white rounded-md placeholder:text-gray-200 w-full"
                                />
                            )}
                            <textarea
                                className="px-[10px] py-3 bg-whiteAlpha-100 text-white rounded-md placeholder:text-gray-200 h-[100px] w-full"
                                placeholder="Mô tả"
                            ></textarea>
                        </div>
                    </GridItem>
                ))}
                {description.length < 6 && (
                    <GridItem w="100%" className="rounded-lg" h={height}>
                        <div className="flex items-center justify-center bg-blackAlpha-100 h-full rounded-lg">
                            <label
                                htmlFor={inputId}
                                className="flex items-center justify-center mt-5 rounded-full p-5 size-5 text-xl font-semibold bg-gray-600 cursor-pointer transition-all"
                            >
                                +
                            </label>
                            <input
                                id={inputId}
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleAddDescription}
                                multiple
                            />
                        </div>
                    </GridItem>
                )}
            </Grid>
        </div>
    );
};

export default AdminThemChiNhanhInputAndImg;
