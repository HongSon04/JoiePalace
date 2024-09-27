"use client";

import AdminSidebar from "@/app/_components/AdminSidebar";
import { useSelector } from "react-redux";

function Layout({ children }) {
  const { isSidebarOpen, size } = useSelector((state) => state.sidebar);

  function handleSidebar() {
    dispatch(toggleSidebar());
  }

  return (
    <div className="p-3 admin-main bg-darkGreen-primary overflow-hidden">
      <div className="flex gap-5">
        <AdminSidebar
          isSidebarOpen={isSidebarOpen}
          handleSidebar={handleSidebar}
          size={size}
        />
        <div className="flex-1 admin-panel max-h-[100vh] overflow-hidden">
          <main className="h-full max-h-[100vh] overflow-y-auto overflow-x-hidden relative">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

export default Layout;
