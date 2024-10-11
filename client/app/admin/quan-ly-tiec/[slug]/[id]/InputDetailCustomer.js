'use client';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const InputDetailCustomer = ({ svg, title, type = 'text', placeholder, options = [], name }) => {
    const [value, setValue] = useState('');

    useEffect(() => {
        if (options.length > 0 && !options.some(item => item.value === value)) {
            setValue(options[0].value);  // Đặt giá trị đầu tiên làm mặc định nếu chưa có giá trị hợp lệ
        }
    }, [options, value]);

    const handleInputChange = (e) => {
        let { value: inputValue } = e.target;

        if (type === 'number' || name === 'phone') {
            // Loại bỏ các ký tự không phải số
            inputValue = inputValue.replace(/[^\d]/g, '');
        }

        setValue(inputValue);
        console.log(inputValue, name);
    };

    return (
        <div className='flex flex-col gap-2'>
            <div className='flex gap-2 items-center'>
                {svg}
                <span className='font-bold leading-6 text-base text-white'>{title}</span>
            </div>
            {type === 'select' ? (
                <select
                    value={value}
                    onChange={handleInputChange}
                    className="w-full bg-whiteAlpha-200 text-white rounded-md p-2 font-normal leading-6"
                    name={name}
                >
                    {options.map(option => (
                        <option className='text-black' key={option.id} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    id={name}
                    name={name}
                    type={type}
                    className='p-3 bg-whiteAlpha-200 rounded-lg text-white placeholder-gray-300'
                    placeholder={placeholder}
                    min={type === 'number' ? 1 : undefined}
                    value={value}
                    onChange={handleInputChange}
                    aria-labelledby={name}
                    // Ngăn không cho cuộn thay đổi giá trị số
                    onWheel={(e) => (type === 'number' || name === 'phone') && e.currentTarget.blur()}
                />
            )}
        </div>
    );
};

InputDetailCustomer.propTypes = {
    svg: PropTypes.node,
    title: PropTypes.string.isRequired,
    type: PropTypes.string,
    placeholder: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
    })),
    name: PropTypes.string.isRequired,
};

export default InputDetailCustomer;
