'use client';

import { Heading, Stack } from '@chakra-ui/react';
import React, { useState } from 'react';

const AdminThemChiNhanhInput = ({ fields, typeADD, placeholderADD, title, heightTextarea, name }) => {
    const [inputs, setInputs] = useState(fields);

    return (
        <div className="p-4 w-[363px] bg-white rounded-lg h-fit">
            <Stack spacing={12}>
                <Heading as='h2' size='md' className="mb-5 font-bold leading-6 text-base text-gray-600">{title}</Heading>
                {inputs.map((field, index) => (
                    field.type === 'textarea' ? (
                        <textarea
                            key={index}
                            placeholder={field.placeholder}
                            className={`px-[10px] py-3 bg-blackAlpha-50 text-black rounded-md placeholder:text-gray-500 ${heightTextarea} w-full`}
                        />
                    ) : (
                        <input
                            key={index}
                            type={field.type || 'text'}
                            placeholder={field.placeholder}
                            name={name}
                            className="px-[10px] py-3 bg-blackAlpha-50 text-black rounded-md placeholder:text-gray-500 w-full"
                        />
                    )
                ))}
                {/* Uncomment to enable adding inputs dynamically */}
                {/* {inputs.length < 2 && (
                    <div className='w-full flex items-center justify-center mt-4'>
                        <button
                            onClick={() => handleAddInput()}
                            className='rounded-full p-3 bg-gray-600 flex items-center justify-center text-white font-medium text-xl'
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M15.8333 10.8333H10.8333V15.8333H9.16663V10.8333H4.16663V9.16667H9.16663V4.16667H10.8333V9.16667H15.8333V10.8333Z" fill="#F7F5F2"/>
                            </svg>
                        </button>
                    </div>
                )} */}
            </Stack>
        </div>
    );
};

export default AdminThemChiNhanhInput;
