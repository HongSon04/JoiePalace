import React from 'react';
import gear from '@/public/gear.svg'
import { Image } from '@chakra-ui/react';
const page = () => {
    return (
        <div className='flex flex-col gap-8'>
            <h1 className='text-2xl font-bold  leading-6'>Thực đơn của bạn</h1>
            <div className='grid grid-cols-2'>
                <div className='flex flex-col items-center gap-4 w-full'>
                    <span className='text-base font-bold uppercase leading-8'>GÓI TIỆC CƯỚI NGỌT NGÀO</span>
                    <p class="text-xl font-bold leading-5">50 - 100 <span class="text-sm font-medium leading-4">Triệu VND</span></p>
                    <div className='flex items-center gap-6 justify-center'>
                        <button class="mt-4 bg-gold text-white py-2 px-4 rounded-md transition text-sm leading-5 w-[200px] ">
                            LIÊN HỆ NGAY →
                        </button>
                        <div class="flex items-center bg-gray-500 p-2 rounded-lg">
                            <Image src={gear} alt='gear-icon' className='object-cover'></Image>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default page;