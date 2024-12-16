"use client"
import AdminHeader from "@/app/_components/AdminHeader";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { PiMedalLight } from "react-icons/pi";
import { login } from "@/app/_lib/features/authentication/accountSlice";
import { API_CONFIG, makeAuthorizedRequest } from "@/app/_utils/api.config";
import { getUserById } from "@/app/_services/apiServices";
import BookingsTable from "../BookingsTable";
const Page = ({params}) => {
  const userID = params.id;

  
  const [dataUser, setDataUser] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // console.log(userID);
        const userData = await getUserById(userID);
        const dataUser = userData?.data[0]; ;
        // console.log(dataUser);
        setDataUser(dataUser); 
       
      } catch (error) {
        console.error("Error fetching data:", error);
      }    
    };
    fetchData();
  },[] );
  // console.log(dataUser);
  
  return (
    <main className="grid gap-6 p-4 text-white ">
      <AdminHeader title="Khách hàng" showSearchForm={false}></AdminHeader>
      <div className="flex justify-start items-center gap-2 text-base ">
        <p>Khách hàng</p>
        <p>/</p>
        <p>Thông tin chi tiết</p>
      </div>
       <div className="w-full  p-5 bg-whiteAlpha-100 rounded-lg grid gap-[22px]">
          
        <div className="flex gap-3 items-center">
            {dataUser?.avatar ? (
            <Image
              width={35}
              height={35}
              className="rounded-full w-[90px]"
              src={dataUser.avatar}
              alt="User Avatar"
            />
          ) : (
            <Image
              width={35}
              height={35}
              className="rounded-full w-[90px]"
              src="/image/user.jpg"
              alt="Default User Avatar"
            />
          )}

          <div>
            <p className="text-sm mb-3">Hạng thành viên</p>
              {dataUser?.memberships ? (
                <div className="flex gap-3 items-center text-base">
                  <Image width={24} height={24} src="/image/Group.svg" alt="Membership Group" />
                  <p>{dataUser?.memberships}</p>
                </div>
              ) : (
                <p className="text-xs text-gray-500">Chưa có hạng thành viên</p> 
              )}
          </div>
        </div>

        <div className="flex gap-4 justify-between w-full">
          <div className="p-3 bg-whiteAlpha-50 rounded-lg w-1/3">
            
            <p>{dataUser?.username || "N/A"}</p>
          </div>
          <div className="p-3 bg-whiteAlpha-50 rounded-lg w-1/3">
          
            <p>{dataUser?.email || "N/A"}</p> 
          </div>
          <div className="p-3 bg-whiteAlpha-50 rounded-lg w-1/3">
           
            <p>{dataUser?.phone || "N/A"}</p> 
          </div>
        </div>
      </div>
      <div className="flex justify-between gap-[30px]">
       
        <div className="rounded-lg bg-whiteAlpha-50 ">
          <div className="w-full grid p-4">
            <p className="text-lg font-bold">Danh sách tiệc</p>
            <div className='overflow-x-auto max-w-[1531px]  scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100'>
              <BookingsTable userId = {userID}  />
            </div>
            
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
