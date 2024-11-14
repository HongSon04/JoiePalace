'use client'
import { Image } from '@chakra-ui/react';
import React, { useState } from 'react';

const MenuItems = ({ data, imgMenu, nameMenu }) => {
    const [openMenus, setOpenMenus] = useState([]);
    const [activeMenus, setActiveMenus] = useState(new Set());

    const toggleMenu = (index) => {
        const newActiveMenus = new Set(activeMenus);

        if (newActiveMenus.has(index)) {
            newActiveMenus.delete(index);
            setOpenMenus(openMenus.filter(i => i !== index));
        } else {

            newActiveMenus.add(index);
            setOpenMenus([...openMenus, index]);
        }

        setActiveMenus(newActiveMenus); 
    };

    const handleMouseLeave = () => {
        setOpenMenus([]);
        setActiveMenus(new Set()); 
    };

    return (
        <div 
            className="relative w-[300px] h-[426px] overflow-hidden rounded-2xl shadow-lg group"
            onMouseLeave={handleMouseLeave} 
        >
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out bg-image group-hover:-translate-x-full">
                <Image 
                    src={`${imgMenu ? imgMenu : '/Alacarte-Menu-Thumbnail.png'}`} 
                    alt='menu' 
                    className='object-contain' 
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-end text-center text-white p-6 ">
                    <h1 className="text-2xl font-bold">WHITE PALACE</h1>
                    <p className="text-lg font-semibold mt-4">{nameMenu}</p>
                </div>
            </div>

            {/* Second half with menu items */}
            <div className={`absolute w-full h-full inset-0 bg-black bg-opacity-70 text-white p-6 transform transition-transform duration-500 ease-in-out ${openMenus.length > 0 ? 'translate-x-0' : 'translate-x-full'} group-hover:translate-x-0`}>
                <Image 
                    src='/Alacarte-Menu-Thumbnail.png' 
                    alt='menu' 
                    className='absolute inset-0 object-cover blur-md opacity-30' 
                />
                <div className="relative z-10 overflow-y-auto max-h-[300px] flex flex-col gap-5">
                    {data.map((menu, index) => (
                        <div key={index} className='flex flex-col'>
                            <h2 
                                className={`text-lg font-semibold flex items-center cursor-pointer hover:bg-whiteAlpha-200 p-2 ${activeMenus.has(index) ? 'bg-whiteAlpha-200' : ''} rounded-lg`} 
                                onClick={() => toggleMenu(index)}
                            >
                                <span className="mr-2 text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M3 13H5V11H3V13ZM3 17H5V15H3V17ZM3 9H5V7H3V9ZM7 13H21V11H7V13ZM7 17H21V15H7V17ZM7 7V9H21V7H7ZM3 13H5V11H3V13ZM3 17H5V15H3V17ZM3 9H5V7H3V9ZM7 13H21V11H7V13ZM7 17H21V15H7V17ZM7 7V9H21V7H7Z" fill="white"/>
                                    </svg>
                                </span> 
                                {menu.title}
                            </h2>
                            <ul className={`mt-2 space-y-1 overflow-hidden transition-all duration-300 ${openMenus.includes(index) ? 'max-h-40' : 'max-h-0'} flex flex-col gap-3`}>
                                {menu.items.map((item, itemIndex) => (
                                    <li key={itemIndex} className={`text-base transition-opacity duration-300 ${openMenus.includes(index) ? 'opacity-100' : 'opacity-0'}`}>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MenuItems;