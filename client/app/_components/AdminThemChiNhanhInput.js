import { Heading, Stack, Button } from '@chakra-ui/react';
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
                                <Button
                                    onClick={handleAddInput}
                                    colorScheme="teal"
                                    size="lg"
                                    className='rounded-full size-5 p-5 bg-gray-600 flex items-center justify-center text-white font-medium text-xl'
                                >
                                    +
                                </Button>
                        </div>
                    )}
            </Stack>
        </div>
    );
};

export default AdminThemChiNhanhInput;
