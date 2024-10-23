'use client';

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const InputDetailCustomer = ({
    svg,
    title,
    type = 'text',
    placeholder,
    options = [],
    name,
    register = () => {},  // Set default register as a no-op function
    error,
    trigger = () => {}  // Default trigger as a no-op function
}) => {

    useEffect(() => {
        if (type === 'select' && options.length > 0 && !options.some(item => item.value === register[name]?.value)) {
            // Automatically set the first option as default (use React Hook Form's defaultValue instead)
        }
    }, [options, register, name, type]);

    return (
        <div className='flex flex-col gap-2'>
            <div className='flex gap-2 items-center'>
                {svg}
                <span className='font-bold leading-6 text-base text-white'>{title}</span>
            </div>

            {type === 'select' ? (
                <select
                    className="w-full bg-whiteAlpha-200 text-white rounded-md p-2 font-normal leading-6"
                    name={name}
                    {...register(name)}
                    onBlur={() => trigger(name)}
                >
                    {options.map(option => (
                        <option className='text-black' key={option.id} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : (
                <>
                    <input
                        id={name}
                        name={name}
                        type={type}
                        className='p-3 bg-whiteAlpha-200 rounded-lg text-white placeholder-gray-300'
                        placeholder={placeholder}
                        min={type === 'number' ? 1 : undefined}
                        onWheel={(e) => (type === 'number' || name === 'phone') && e.currentTarget.blur()}
                        {...register(name)}
                        onBlur={() => trigger(name)}
                    />
                    {error && <p className="text-red-500 text-sm">{error.message}</p>}
                </>
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
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
    })),
    name: PropTypes.string.isRequired,
    register: PropTypes.func,
    error: PropTypes.object,
    trigger: PropTypes.func,
};

export default InputDetailCustomer;
