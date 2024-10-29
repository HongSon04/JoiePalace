import React from 'react';
import { Controller } from 'react-hook-form';

const AdminThemChiNhanhInput = ({ fields, title, heightTextarea, control }) => {
  return (
    <div className="p-4 w-[363px] bg-whiteAlpha-200 rounded-lg h-fit">
      <div className='flex gap-3 flex-col'>
        <span className="mb-5 font-bold leading-6 text-base text-white">{title}</span>
        {fields.map((field, index) => (
          <Controller
            key={index}
            name={field.name}
            control={control}
            defaultValue=""
            render={({ field: inputProps, fieldState }) => (
              <>
                {field.type === 'textarea' ? (
                  <textarea
                    {...inputProps}
                    placeholder={field.placeholder}
                    className={`px-[10px] py-3 bg-whiteAlpha-200 text-white rounded-md placeholder:text-gray-500 ${heightTextarea} w-full`}
                  />
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
        ))}
      </div>
    </div>
  );
};

export default AdminThemChiNhanhInput;
