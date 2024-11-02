import AdminHeader from "@/app/_components/AdminHeader";
import React from "react";
import "../../../_styles/globals.css";
import Chart from "@/app/_components/Chart";
import { BsThreeDots } from "react-icons/bs";
import { PiShootingStarDuotone } from "react-icons/pi";

const page = () => {
  const data = {
    labels: ["Phạm Văn Đồng", "Hoàng Văn Thụ", "Võ Văn Kiệt"],
    datasets: [
      {
        label: "Doanh thu",
        data: [300000000, 500000000, 700000000],
      },
    ],
  };
  return (
    <main className=" grid gap-6 p-4 text-white">
      <AdminHeader
        title="Khách hàng"
        showBackButton={false}
        showSearchForm={false}
      ></AdminHeader>
      <div className="flex justify-start items-center gap-2 text-base text-gray-500       ">
        <p>Khách hàng</p>
      </div>
      <div className="flex justify-between gap-[30px] items-start ">
        <div className="w-[70%]">
          <div className="mb-[10px]">
            <p className="text-base font-semibold">Danh sách khách hàng</p>
          </div>
          <div className="w-full mt-2">
            <div className="overflow-y-auto max-h-72">
              <table className="table w-full rounded-lg">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tên</th>
                    <th>Cấp độ</th>
                    <th>Số điện thoại</th>
                    <th>Số tiệc</th>
                    <th>Tổng chi</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  <tr>
                    <td>#1IF39FP</td>
                    <td>Nguyễn Văn A</td>
                    <td>VIP</td>
                    <td>0939283829</td>
                    <td>12</td>
                    <td>2.000.000.000 VND</td>
                    <td>
                      <p className="text-teal-400 text-xs font-bold">
                        Chi tiết
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>#1IF39FP</td>
                    <td>Nguyễn Văn A</td>
                    <td>VIP</td>
                    <td>0939283829</td>
                    <td>12</td>
                    <td>2.000.000.000 VND</td>
                    <td>
                      <p className="text-teal-400 text-xs font-bold">
                        Chi tiết
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>#1IF39FP</td>
                    <td>Nguyễn Văn A</td>
                    <td>VIP</td>
                    <td>0939283829</td>
                    <td>12</td>
                    <td>2.000.000.000 VND</td>
                    <td>
                      <p className="text-teal-400 text-xs font-bold">
                        Chi tiết
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>#1IF39FP</td>
                    <td>Nguyễn Văn A</td>
                    <td>VIP</td>
                    <td>0939283829</td>
                    <td>12</td>
                    <td>2.000.000.000 VND</td>
                    <td>
                      <p className="text-teal-400 text-xs font-bold">
                        Chi tiết
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>#1IF39FP</td>
                    <td>Nguyễn Văn A</td>
                    <td>VIP</td>
                    <td>0939283829</td>
                    <td>12</td>
                    <td>2.000.000.000 VND</td>
                    <td>
                      <p className="text-teal-400 text-xs font-bold">
                        Chi tiết
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="w-[30%] p4 bg-whiteAlpha-100 h-full rounded-xl ">
          <div className="flex p-3 gap-[10px] items-center">
            <PiShootingStarDuotone className="text-3xl text-yellow-500" />
            <p className="text-base font-semibold ">Top khách hàng</p>
          </div>
          <div className="flex flex-col p-3 gap-3 max-h-[500px] overflow-y-auto hide-scrollbar">
            <div className="flex gap-5 items-center rounded-xl p-3 bg-whiteAlpha-50 bg-cover bg-center">
              <Image className="rounded-full w-[48px]" src="/image/user.jpg" />
              <div className="w-full flex justify-between items-center">
                <div>
                  <p className="text-sm  font-semibold mb-[10px]">
                    Tên khách hàng
                  </p>
                  <div className="flex gap-3 items-center text-xs ">
                    <Image src="/image/Group.svg" />
                    <p>Đồng</p>
                  </div>
                </div>
                <BsThreeDots className="text-xl" />
              </div>
            </div>
            <div className="flex gap-5 items-center rounded-xl p-3 bg-whiteAlpha-50 bg-cover bg-center">
              <Image className="rounded-full w-[48px]" src="/image/user.jpg" />
              <div className="w-full flex justify-between items-center">
                <div>
                  <p className="text-sm  font-semibold mb-[10px]">
                    Tên khách hàng
                  </p>
                  <div className="flex gap-3 items-center text-xs ">
                    <Image src="/image/Group.svg" />
                    <p>Đồng</p>
                  </div>
                </div>
                <BsThreeDots className="text-xl" />
              </div>
            </div>
            <div className="flex gap-5 items-center rounded-xl p-3 bg-whiteAlpha-50 bg-cover bg-center">
              <Image className="rounded-full w-[48px]" src="/image/user.jpg" />
              <div className="w-full flex justify-between items-center">
                <div>
                  <p className="text-sm  font-semibold mb-[10px]">
                    Tên khách hàng
                  </p>
                  <div className="flex gap-3 items-center text-xs ">
                    <Image src="/image/Group.svg" />
                    <p>Đồng</p>
                  </div>
                </div>
                <BsThreeDots className="text-xl" />
              </div>
            </div>
            <div className="flex gap-5 items-center rounded-xl p-3 bg-whiteAlpha-50 bg-cover bg-center">
              <Image className="rounded-full w-[48px]" src="/image/user.jpg" />
              <div className="w-full flex justify-between items-center">
                <div>
                  <p className="text-sm  font-semibold mb-[10px]">
                    Tên khách hàng
                  </p>
                  <div className="flex gap-3 items-center text-xs ">
                    <Image src="/image/Group.svg" />
                    <p>Đồng</p>
                  </div>
                </div>
                <BsThreeDots className="text-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default page;
