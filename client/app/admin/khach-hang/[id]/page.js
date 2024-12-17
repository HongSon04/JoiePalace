"use client"
import AdminHeader from "@/app/_components/AdminHeader";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { PiMedalLight } from "react-icons/pi";
import { login } from "@/app/_lib/features/authentication/accountSlice";
import { API_CONFIG, makeAuthorizedRequest } from "@/app/_utils/api.config";
import { getUserById } from "@/app/_services/apiServices";
import BookingsTable from "../BookingsTable";
import rankMemberships from '@/app/_components/RankMemberships';
import { formatPrice } from "@/app/_utils/formaters";
const Page = ({params}) => {
  const userID = params.id;
  const [rank, setRank] = useState([])
  const [dataUser, setDataUser] = useState(null);
  const [totalAmount, setTotalAmount] = useState(null)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // console.log(userID);
        const userData = await getUserById(userID);
        const dataUser = userData?.data[0]; ;
        
        // console.log(dataUser);
        const bookingUser = await makeAuthorizedRequest(
          API_CONFIG.BOOKINGS.GET_ALL({
            user_id: dataUser.id,
            status: "success",
            itemsPerPage: 1000
          }),
          "GET",
          null
        );
        const dataBooking = Array.isArray(bookingUser.data) ? bookingUser.data : []; // Kiểm tra xem bookingUser.data có phải là mảng không
        const total_amountUser = dataBooking.reduce((total, item) => {
            if (item.booking_details && item.booking_details[0]) {
                return total + item.booking_details[0].total_amount; // Kiểm tra nếu booking_details tồn tại và có ít nhất một phần tử
            }
            return total;
        }, 0);
        
        // Rank user based on total amount

        setTotalAmount(total_amountUser);
        rankuser(total_amountUser);
        setDataUser(dataUser); 
       
      } catch (error) {
        console.error("Error fetching data:", error);
      }    
    };
    fetchData();
  },[] );
  // console.log(userID);
  
  const rankuser = (total_amount) => {
    if (total_amount !== undefined && total_amount !== null) {
        // Tìm hạng thành viên dựa trên total_amount
        const foundRank = rankMemberships
            .slice()
            .sort((a, b) => b.condition - a.condition)
            .find(member => total_amount >= member.condition);

        // Nếu tìm thấy hạng, cập nhật trạng thái rank
        if (foundRank) {
            setRank(foundRank);
        } else {
            setRank(rankMemberships[0]);
        }
    } else {
        setRank(null);
    }
  };
  // console.log(rank);
  return (
    <main className="grid gap-6 p-4 text-white ">
      <AdminHeader title="Khách hàng" showSearchForm={false}></AdminHeader>
      <div className="flex justify-start items-center gap-2 text-base ">
        <p>Khách hàng</p>
        <p>/</p>
        <p>Thông tin chi tiết</p>
      </div>
       <div className="w-full  p-5 bg-whiteAlpha-100 rounded-lg grid gap-[22px]">
        <div className="flex  justify-between">
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
              <p className="text-sm mb-3 text-gray-400">Hạng thành viên</p>
                {rank?.imageRank ?
                  <div className='flex items-center gap-2'>
                      <div className="relative w-6 h-[14px]">
                          <Image
                              src={rank?.imageRank}
                              layout="fill"
                              alt="rank-img"
                              objectFit="cover"
                              quality={100}
                          />
                      </div>
                      <span className='text-base text-white font-medium'>{rank?.title}</span>
                  </div>
                  : <div className='flex items-center gap-2'>
                      <div className="relative w-[14px] h-[14px] animate-spin">
                          <div className="w-full h-full bg-gray-300 rounded-full"></div>
                      </div>
                      <span className='text-base text-white animate-pulse bg-gray-300 rounded w-10 h-4'></span>
                    </div>
                  }
                  
            </div>
          </div>
          <span className="text-base font-semibold text-white flex items-center gap-2">Tổng chi : <p className="text-[20px]">{formatPrice(totalAmount) || 0}</p> </span>
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
