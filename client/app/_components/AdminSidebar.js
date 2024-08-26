"use client";

// import react hooks
import { useEffect, useRef, useState } from "react";

// import custom components
import AdminSidebarNav from "./AdminSidebarNav";
import AdminSidebarHeader from "./AdminSidebarHeader";
import { Divider } from "@chakra-ui/react";

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
