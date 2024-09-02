"use client";

// import react hooks
import { useState } from "react";

// import custom components
import { Divider } from "@chakra-ui/react";
import AdminSidebarHeader from "./AdminSidebarHeader";
import AdminSidebarNav from "./AdminSidebarNav";

function AdminSidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const size = isSidebarOpen ? "big" : "small";

  function handleSidebar() {
    setIsSidebarOpen(!isSidebarOpen);
  }

  return (
    <div
      className={`admin-sidebar flex flex-col max-h-screen overflow-y-scroll relative ${
        size === "small" ? "-m-5" : ""
      }`}
    >
      <AdminSidebarHeader onSidebar={handleSidebar} size={size} />
      <Divider
        background={"rgba(255, 255, 255, 0.2)"}
        height={0.5}
        className={`${size === "small" ? "w-5/6" : ""} shrink-0`}
      />
      <AdminSidebarNav size={size}></AdminSidebarNav>
    </div>
  );
}

export default AdminSidebar;
