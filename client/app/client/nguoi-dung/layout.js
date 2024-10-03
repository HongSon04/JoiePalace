import SideBarUser from '@/app/_components/SideBarUser';
import React from 'react';

const Layout = ({ children }) => {
    return (
        <div className="bg-primary min-h-screen">
            <div className="flex justify-center">
                <div className='w-full max-w-[1130px] flex gap-[30px] '>
                    <aside className='w-[25%] rounded-lg'>
                        <SideBarUser />
                    </aside>

                    <main className="flex-1">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Layout;
