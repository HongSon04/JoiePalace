'use client';
import { Heading, Stack } from '@chakra-ui/react';
import React, { useState } from 'react';

const AdminThemChiNhanhInput = ({ fields, typeADD, placeholderADD, title }) => {
    const [inputs, setInputs] = useState(fields);

    const handleAddInput = () => {
        setInputs((prevInputs) => [
            ...prevInputs,
            { type: typeADD || 'text', placeholder: placeholderADD || '' }
        ]);
    };

    
    return (
        <div className="p-4 w-[363px] bg-blackAlpha-100 rounded-lg h-fit">
            <Stack spacing={12}>
                <Heading as='h2' size='md' className="mb-5 font-bold">{title}</Heading>
                {inputs.map((field, index) => (
                    field.type === 'textarea' ? (
                        <textarea
                            key={index}
                            placeholder={field.placeholder}
                            className="px-[10px] py-3 bg-whiteAlpha-100 text-white rounded-md placeholder:text-gray-200 h-[100px] w-full"
                        />
                    ) : (
                        <input
                            key={index}
                            type={field.type || 'text'}
                            placeholder={field.placeholder}
                            className="px-[10px] py-3 bg-whiteAlpha-100 text-white rounded-md placeholder:text-gray-200 w-full"
                        />
                    )
                ))}
                    {inputs.length < 2 && (
                        <div className='w-full flex items-center justify-center mt-4'>
                                <button
                                    onClick={handleAddInput}
                                    className='rounded-full p-3 bg-gray-600 flex items-center justify-center text-white font-medium text-xl'
                                >
                                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M15.8333 10.8333H10.8333V15.8333H9.16663V10.8333H4.16663V9.16667H9.16663V4.16667H10.8333V9.16667H15.8333V10.8333Z" fill="#F7F5F2"/>
                            </svg>
                                </button>
                        </div>
                    )}
            </Stack>
        </div>
    );
};

export default AdminThemChiNhanhInput;
