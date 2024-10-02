import SideBarUser from '@/app/_components/SideBarUser';
import React from 'react';

const Layout = ({ children }) => {
    return (
        <div className="bg-primary min-h-screen">
            <div className="flex justify-center">
                <div className='w-full max-w-[1170px] flex gap-[30px] '>
                    <aside className='w-[25%] bg-gray-800 rounded-lg'>
                        <SideBarUser />
                    </aside>

                    <main className="flex-1 bg-white p-6 rounded-lg shadow-lg">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Layout;
