'use client'
import React from "react";
import AdminHeader from "@/app/_components/AdminHeader";
import MemberShipBreadCrumbs from "./MemberShipBreadCrumbs";
import MemberShipTabs from "./MemberShipTabs";

const MemberShips = () => {
    return (
        <div className="relative">
        <AdminHeader title="Hạng thành viên" />
        <MemberShipBreadCrumbs/>
        <MemberShipTabs/>
    </div>
    )
}
export default MemberShips;