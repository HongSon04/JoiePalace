"use client";

import AdminSidebar from "@/app/_components/AdminSidebar";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentBranch } from "../_lib/features/branch/branchSlice";

function Layout({ children }) {
  const { isSidebarOpen, size } = useSelector((state) => state.sidebar);
  const dispatch = useDispatch();

  function handleSidebar() {
    dispatch(toggleSidebar());
  }

  React.useEffect(() => {
    const storedBranch = JSON.parse(localStorage.getItem("currentBranch"));
    console.log(storedBranch);

    if (storedBranch) {
      dispatch(getCurrentBranch(storedBranch));
    }
  }, []);

  return (
    <div
      className="p-5 admin-main bg-darkGreen-primary overflow-hidden"
      style={{
        maxHeight: "calc(100vh)",
      }}
    >
      <div className="flex gap-5 py-3">
        <AdminSidebar
          isSidebarOpen={isSidebarOpen}
          handleSidebar={handleSidebar}
          size={size}
        />
        <div className="flex-1 admin-panel overflow-hidden">
          <main className="h-full max-h-[100vh] overflow-y-auto overflow-x-hidden relative pb-16">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

export default Layout;
