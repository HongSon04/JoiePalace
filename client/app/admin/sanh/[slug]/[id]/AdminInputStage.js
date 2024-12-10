import React from 'react';
import { Controller } from 'react-hook-form';

const AdminInputStage = ({ fields = [], title, heightTextarea, control }) => {
  return (
    <div className="p-4 w-[363px] bg-whiteAlpha-200 rounded-lg h-fit">
      <div className='flex gap-3 flex-col'>
        <span className="mb-5 font-bold leading-6 text-base text-white">{title}</span>
        {Array.isArray(fields) && fields.length > 0 ? (
          fields.map((field, index) => (
            <Controller
              key={index}
              name={field.name}
              control={control}
              render={({ field: inputProps, fieldState }) => (
                <>
                  {field.type === 'textarea' ? (
                    <textarea
                      {...inputProps}
                      placeholder={field.placeholder}
                      className={`px-[10px] py-3 bg-whiteAlpha-200 text-white rounded-md placeholder:text-gray-500 ${heightTextarea} w-full`}
                    />
                  ) : field.type === 'options' ? (
                                <select
                {...inputProps}
                className="px-[10px] py-3 bg-whiteAlpha-200 text-white rounded-md placeholder:text-gray-500 w-full"
                onChange={(e) => {
                    inputProps.onChange(e.target.value); // Cập nhật giá trị khi chọn chi nhánh mới
                }}
                value={inputProps.value || ""} // Giá trị hiện tại hoặc giá trị mặc định
            >
                <option value="" className='text-black' disabled>{field.placeholder}</option>
                {field.options.map(option => (
                    <option key={option.value} className='text-black' value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
                  ) : (
                    <input
                      {...inputProps}
                      type={field.type || 'text'}
                      placeholder={field.placeholder}
                      className="px-[10px] py-3 bg-whiteAlpha-200 text-white rounded-md placeholder:text-gray-500 w-full"
                    />
                  )}
                  {fieldState.error && (
                    <span className="text-red-500 text-sm font-semibold">
                      {fieldState.error.message}
                    </span>
                  )}
                </>
              )}
            />
          ))
        ) : (
          <span className="text-red-500">Không có trường nào để hiển thị.</span>
        )}
      </div>
    </div>
  );
};

export default AdminInputStage;
