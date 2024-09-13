"use client";

import AdminSidebar from "@/app/_components/AdminSidebar";
import StoreProvider from "./StoreProvider";
import { useState } from "react";
import AdminSidebarButton from "../_components/AdminSidebarButton";
import { useSelector } from "react-redux";

function Layout({ children }) {
  const { isSidebarOpen, size } = useSelector((state) => state.sidebar);

  function handleSidebar() {
    dispatch(toggleSidebar());
  }

  return (
      <div className="p-3 bg-gray-100 admin-main overflow-hidden">
        <div className="flex gap-5">
          <AdminSidebar
            isSidebarOpen={isSidebarOpen}
            handleSidebar={handleSidebar}
            size={size}
          />
          <div className="flex-1 admin-panel text-white max-h-[100vh]">
            <main className="h-full max-h-[100vh] overflow-y-auto overflow-x-hidden relative">
              {children}
            </main>
          </div>
        </div>
      </div>
  );
}

export default Layout;
