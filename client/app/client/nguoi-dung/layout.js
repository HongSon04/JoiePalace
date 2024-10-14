import SideBarUserClient from '@/app/_components/SideBarUserClient';
import React from 'react';

const Layout = ({ children }) => {
    return (
        <section className="section bg-primary min-h-screen block px-8 pt-[120px] md:pt-[120px]">
            <div className="flex justify-center">
                <div className='w-full max-w-[1130px] flex flex-col md:flex-row gap-[30px]'>
                    <aside className='w-full md:w-[25%] rounded-lg'>
                        <SideBarUserClient />
                    </aside>

                    <main className="flex-1">
                        {children}
                    </main>
                </div>
            </div>
        </section>
    );
};

export default Layout;
