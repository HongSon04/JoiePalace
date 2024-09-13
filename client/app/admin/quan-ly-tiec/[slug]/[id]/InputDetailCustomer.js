'use client';
import React from 'react';
import { Select, SelectItem } from "@nextui-org/react";

const InputDetailCustomer = ({ svg, title, type = 'text', placeholder, options = [], name }) => {
    const handleInputChange = (e) => {
        const value = e.target.value;
        if (type === 'number') {
            if (/^\d*$/.test(value) || value === '') {
                e.target.value = value;
            } else {
                e.target.value = '';
            }
        }
        console.log(value, e.target.name);
    };

    return (
        <div className='flex flex-col gap-[9px]'>
            <div className='flex gap-[10px] items-center'>
                {svg}
                <span className='font-bold leading-6 text-base'>{title}</span>
            </div>
            {type === 'select' ? (
                <Select
                    aria-label={"Select"}
                    className='rounded-lg '
                    classNames={{
                        base: "!overflow-hidden !text-white",
                        trigger: "text-sm text-gray-100 !bg-white/20 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                        value: "text-sm !text-white",
                        innerWrapper: "!overflow-hidden",
                        popoverContent: "bg-white/20 backdrop-blur-lg gap-1 rounded-lg",
                    }}
                >
                    {options.map((option, index) => (
                        <SelectItem
                            className='p-3 text-white text-base font-medium'
                            key={index}
                            value={option.value}
                        >
                        
                            {option.label}
                        </SelectItem>
                    ))}
                </Select>
            ) : (
                <input
                    name={name}
                    type={type}
                    className='p-3 bg-whiteAlpha-200 rounded-lg appearance-none'
                    placeholder={placeholder}
                    min={type === 'number' ? 1 : undefined}
                    onChange={handleInputChange}
                />
            )}
        </div>
    );
};

export default InputDetailCustomer;