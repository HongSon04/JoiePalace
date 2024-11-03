"use client";

import { Grid, GridItem, Heading, Image } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

const AdminThemChiNhanhInputAndImg = ({ title, height, inputId, input = true }) => {
    const [description, setDescription] = useState([]);

    useEffect(() => {
        console.log(description);
    }, [description]);

    const handleAddDescription = (event) => {
        const files = Array.from(event.target.files);
        const newImages = [];

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                newImages.push(reader.result);
                if (newImages.length === files.length) {
                    setDescription((prev) => [...prev, ...newImages]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const renderImageItem = (item, index) => (
        <GridItem key={index} w="100%" className="rounded-lg">
            <div className="flex flex-col gap-5">
                <div className="relative">
                    <Image
                        src={item}
                        alt={`carousel-img-${index}`}
                        width="100%"
                        height="170px"
                        className="rounded-lg object-cover"
                    />
                    <span className="absolute top-4 left-4 bg-gray-500 text-white p-1 rounded-lg w-fit font-medium">
                        HALL {String.fromCharCode(65 + index)}
                    </span>
                </div>
                {input && (
                    <input
                        type="text"
                        placeholder="Tên không gian"
                        className="px-2 py-1 bg-whiteAlpha-200 text-white rounded-md placeholder:text-gray-500 w-full"
                    />
                )}
                <textarea
                    className="px-2 py-1 bg-whiteAlpha-200 text-white rounded-md placeholder:text-gray-500 h-[100px] w-full"
                    placeholder="Mô tả"
                />
            </div>
        </GridItem>
    );

    return (
        <div className="flex p-4 flex-col gap-2 bg-whiteAlpha-200 rounded-lg">
            <span className="font-bold text-white text-base">
                {title}
            </span>
            <Grid templateColumns="repeat(3, 1fr)" gap="20px" className="mt-2">
                {description.map(renderImageItem)}
                {description.length < 6 && (
                    <GridItem w="100%" className="rounded-lg" h={height}>
                        <div className="flex items-center justify-center bg-whiteAlpha-200 h-full rounded-lg">
                            <label
                                htmlFor={inputId}
                                className="flex items-center justify-center mt-5 rounded-full p-3 text-xl font-semibold bg-whiteAlpha-600 cursor-pointer transition-all"
                            >
                                <SVGIcon />
                            </label>
                            <input
                                id={inputId}
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
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

const SVGIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
        <path d="M16.3333 11.3333H11.3333V16.3333H9.66663V11.3333H4.66663V9.66663H9.66663V4.66663H11.3333V9.66663H16.3333V11.3333Z" fill="#4B5563" />
    </svg>
);

export default AdminThemChiNhanhInputAndImg;
