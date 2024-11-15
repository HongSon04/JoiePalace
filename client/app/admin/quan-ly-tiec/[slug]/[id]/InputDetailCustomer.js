import React from 'react';
import { Controller } from 'react-hook-form';

const InputDetailCustomer = ({
    svg,
    title,
    type = 'text',
    placeholder,
    options = [],
    name,
    control,
    error,
}) => {
    // Check if the field should be read-only based on `name`
    const isReadOnlyField = name === 'customerAndChair' || name === 'total_amount' || name === 'depositAmount';

    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center">
                {svg}
                <span className="font-bold leading-6 text-base text-white">{title}</span>
            </div>

            {type === 'select' ? (
                <Controller
                    name={name}
                    control={control}
                    defaultValue={options[0]?.value || ''}
                    render={({ field }) => (
                        <select
                            className="w-full bg-whiteAlpha-200 text-white rounded-md p-3 font-normal leading-6"
                            {...field}
                            value={field.value || ''}
                        >
                            <option className="option" value="" disabled>
                                Chọn {title}
                            </option>
                            {options.map((option, index) => (
                                <option className="text-black" key={index} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    )}
                />
            ) : (
                <Controller
                    name={name}
                    control={control}
                    defaultValue={name === 'customerAndChair' ? 10 : ''}
                    render={({ field }) => (
                        <input
                            {...field}
                            type={type}
                            value={
                                name === 'customerAndChair'
                                    ? 10 // Giá trị cố định cho `customerAndChair`
                                    : field.value || ''
                            }
                            readOnly={isReadOnlyField}
                            disabled={isReadOnlyField}
                            className="p-3 bg-whiteAlpha-200 rounded-lg text-white placeholder-gray-300"
                            placeholder={placeholder}
                            min={type === 'number' ? 1 : undefined}
                            onWheel={(e) => (type === 'number') && e.currentTarget.blur()}
                        />
                    )}
                />
            )}

            {error && <p className="text-red-500 text-sm">{error.message}</p>}
        </div>
    );
};

export default InputDetailCustomer;