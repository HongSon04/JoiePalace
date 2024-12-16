"use client";
import SideBarUserClient from '@/app/_components/SideBarUserClient';
import React, { useState } from 'react';
import { useSelector } from "react-redux";
import keyboard_double_arrow_left from '@/public/keyboard_double_arrow_left.svg';
import keyboard_double_arrow_right from '@/public/keyboard_double_arrow_right.svg';
import Image from 'next/image';

const Layout = ({ children }) => {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const notificationCount = useSelector((state) => state.decors.notificationCount);

    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    };

    return (
        <section className="section bg-primary min-h-screen block pt-[120px] md:pt-[120px]">
            <div className="flex justify-center px-8 max-md:px-0 ">
                <div className='w-full max-w-[1130px] flex flex-col md:flex-row gap-[30px] '>
                    <aside className={`z-30 md:sticky max-md:fixed w-full px-8 max-md:px-0  md:w-[25%] rounded-lg top-[120px] h-fit bg-darkGreen-primary transition-transform duration-300 ease-in-out ${isNavOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                        <div className='max-md:shadow-md'>
                            {/* Pass setIsNavOpen */}
                            <SideBarUserClient unreadNotifications={notificationCount} offNav={setIsNavOpen} />
                            <button
                                aria-expanded={isNavOpen}
                                className={`flex justify-center items-center shadow-md gap-2 md:hidden border fixed -top-[10px] ${isNavOpen ? 'right-0  rounded-tr-none rounded-br-none border-l-0' : '-right-[30px]  rounded-tl-none rounded-bl-none'} z-50 bg-darkGreen-primary text-white p-2 rounded`}
                                onClick={toggleNav}
                            >
                                <Image
                                    src={isNavOpen ? keyboard_double_arrow_left : keyboard_double_arrow_right}
                                    alt={isNavOpen ? 'Close menu' : 'Open menu'}
                                />
                            </button>
                        </div>
                    </aside>

                    <main className="flex-1 px-8 ">
                        {children}
                    </main>
                </div>
            </div>
        </section>
    );
};

export default Layout;
