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
                    defaultValue={options[0]?.value || ''} // Giá trị mặc định để tránh undefined
                    render={({ field }) => (
                        <select
                            className="w-full bg-whiteAlpha-200 text-white rounded-md p-2 font-normal leading-6"
                            {...field}
                            value={field.value || ''} // Đảm bảo `value` luôn có giá trị
                        >
                            <option className='option' value="" disabled>
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
                    defaultValue={name === 'customerAndChair' ? 10 : ''} // Giá trị mặc định cho `customerAndChair`
                    render={({ field }) => (
                        <input
                            {...field}
                            type={type}
                            value={name === 'customerAndChair' ? 10 : field.value} // Đặt giá trị cố định là 10
                            readOnly={name === 'customerAndChair'} // Không cho phép chỉnh sửa
                            disabled={name === 'customerAndChair'} // Vô hiệu hóa trường
                            className="p-3 bg-whiteAlpha-200 rounded-lg text-white placeholder-gray-300"
                            placeholder={placeholder}
                            min={type === 'number' ? 1 : undefined}
                            onWheel={(e) => (type === 'number' || name === 'phone') && e.currentTarget.blur()}
                        />
                    )}
                />
            )}

            {error && <p className="text-red-500 text-sm">{error.message}</p>}
        </div>
    );
};

export default InputDetailCustomer;
