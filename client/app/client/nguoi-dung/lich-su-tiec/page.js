"use client";
import PartySectionClient from "@/app/_components/PartySectionClient";
import TitleHistoryPartyUser from "@/app/_components/TitleHistoryPartyUser";
import React, { useEffect, useState } from "react";
import AccountSectionClient from "@/app/_components/AccountSectionClient";
import { useRouter } from "next/navigation";
import { fecthDatabyMembershipId } from "@/app/_services/membershipsServices";
import {
  fetchAllBookingByUserId,
  fetchBookingById,
} from "@/app/_services/bookingServices";

import Link from "next/link";
import { Result } from "postcss";
import { Image } from '@nextui-org/react';

const page = () => {
  const [user, setUser] = useState();
  const [membershipId, setMembershipId] = useState(null);
  const [parties, setParties] = useState([]);
  const [partyAll, setPartyAll] = useState([]);
  const [partySuccess, setPartySuccess] = useState([]);
  const [partyPending, setPartyPending] = useState([]);
  const [partyOnlyPending, setPartyOnlyPending] = useState([]);
  const [partyCancel, setPartyCancel] = useState([]);
  const [partyOld, setPartyOld] = useState([]);
  const [partyNew, setPartyNew] = useState([]);
  const [partyProcessing, setPartyProcessing] = useState([]);
  const [totalAmount, setTotalAmount] = useState([]);
  const [reloadPage, setloadPage] = useState(false);
  const router = useRouter();
  const [branch_id, setBranch_id] = useState(0);

  useEffect(() => {
    const getData = async () => {
      const getUser = JSON.parse(localStorage.getItem("user"));
      if (getUser) {
        setUser(getUser);
      } else {
        router.push("/");
      }
      try {
        // Fetch membership data if available
        if (user?.memberships_id) {
          const fetchedDataByMembershipId = await fetchDatabyMembershipId(
            user.memberships_id
          );
          setMembershipId(fetchedDataByMembershipId);
        }

        // Fetch all bookings for the user
        const fetchedAllBookingsMembershipId = await fetchAllBookingByUserId(
          getUser.id
        );
        const fetchedAllBookingsSuccess = fetchedAllBookingsMembershipId.filter(
          (i) => i.status === "success"
        );
        const fetchedAllBookingsPending = fetchedAllBookingsMembershipId.filter(
          (i) => i.status === "pending" || i.status === "processing"
        );
        const fetchedAllBookingsOnlyProcessing =
          fetchedAllBookingsMembershipId.filter(
            (i) => i.status === "processing"
          );
        const fetchedAllBookingsOnlyPending =
          fetchedAllBookingsMembershipId.filter((i) => i.status === "pending");
        const fetchedAllBookingsCancel = fetchedAllBookingsMembershipId.filter(
          (i) => i.status === "cancel"
        );

        const fetchedAllBookingsOld = [...fetchedAllBookingsMembershipId].sort(
          (a, b) => {
            return new Date(a.created_at) - new Date(b.created_at);
          }
        );
        const fetchedAllBookingsNewest = [
          ...fetchedAllBookingsMembershipId,
        ].sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        });

        setPartyOld(fetchedAllBookingsOld);
        setPartyNew(fetchedAllBookingsNewest);
        setPartyOnlyPending(fetchedAllBookingsOnlyPending);
        setPartyAll(fetchedAllBookingsMembershipId);
        setPartyProcessing(fetchedAllBookingsOnlyProcessing);
        setPartySuccess(fetchedAllBookingsSuccess);
        setPartyPending(fetchedAllBookingsPending);
        setPartyCancel(fetchedAllBookingsCancel);

        pasteData(fetchedAllBookingsMembershipId, getUser);

        const total_amountUser = fetchedAllBookingsSuccess.reduce(
          (total, item) => {
            return total + item.booking_details[0].total_amount;
          },
          0
        );
        setTotalAmount(total_amountUser);
      } catch (error) {
        console.error("Chưa lấy được dữ liệu người dùng", error);
      }
    };
    getData();
  }, [reloadPage]);

  const handleDataFromChild = (data) => {
    setloadPage(data);
  };

  const pasteData = (data, user) => {
    if (data.length > 0) {
      const dataParty = data.map((item) => {
        const dataDetailBooking = item.booking_details;
        const dataStages = item.stages;
        const dataMenus = dataDetailBooking[0]?.menus;
        const datadePosits = dataDetailBooking[0]?.deposits;
        setBranch_id(item.branches.id);

        return {
          id: item.id,
          nameParty: item.name,
          address: item.company_name || 'Tiệc cá nhân',
          phoneAddress: item.phone,
          hostName: user?.name,
          email: user?.email,
          phoneUser: item.phone,
          idParty: `P${item.id}`,
          partyDate: formatDate(item.created_at),
          dateOrganization: formatDate(item.organization_date),
          numberGuest:
            dataDetailBooking[0]?.table_count * 10 || "Đang chờ xử lý",
          session: item.shift,
          tableNumber: dataDetailBooking[0]?.table_count || "Đang chờ xử lý",
          spareTables:
            dataDetailBooking[0]?.spare_table_count || "Đang chờ xử lý",
          linkTo: `/party/${item.id}`,
          showFull: true,
          showDetailLink: true,
          Collapsed: false,
          hall: dataStages?.name || "Đang chờ xử lý",
          typeParty: item.name,
          liveOrOnline: "Trực tiếp",
          space: 1,
          decorate: dataDetailBooking[0]?.decors?.name || "Không có trang trí",
          guestTable: "10 người/bàn",
          menu: dataMenus?.name,
          drinks: "Bia Tiger, Nước ngọt Pepsi",
          payerName: item.name,
          paymentMethod: `Chuyển khoản ${datadePosits?.payment_method}`,
          menuCostTable: `${dataMenus?.price} VND/bàn`,
          amountPayable: dataDetailBooking[0]?.total_amount
            ? `${dataDetailBooking[0].total_amount} VND`
            : "0 VND",
          depositAmount: item.is_deposit
            ? `${datadePosits?.amount} VND`
            : "0 VND",
          depositStatus: item.is_deposit ? "Đã thanh toán" : "Chưa thanh toán",
          depositDay: item.is_deposit
            ? new Date(datadePosits?.created_at).toISOString().split("T")[0]
            : "",
          remainingPaid:
            item.total_amount && item.depositAmount
              ? `${parseInt(item.total_amount) - parseInt(item.depositAmount)
              } VND`
              : "0 VND",
          paymentDay: item.organization_date
            ? item.organization_date.split("T")[0]
            : "",
          statusParty: item.status,
        };
      });

      setParties(dataParty);
    }
  };

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString)
      .toLocaleDateString("en-GB", options)
      .replace(/\//g, "/");
  };

  const clickFilter = (e) => {
    let filteredParties;
    switch (e.target.value) {
      case "old":
        filteredParties = partyOld;
        break;
      case "near":
        filteredParties = partyNew;
        break;
      case "all":
        filteredParties = partyAll;
        break;
      case "happening":
        const today = new Date().toISOString().split("T")[0];
        filteredParties = partyPending.filter((party) => {
          const partyDate = new Date(party.organization_date)
            .toISOString()
            .split("T")[0];
          return partyDate === today;
        });
        break;
      case "pending":
        filteredParties = partyOnlyPending;
        break;
      case "processing":
        filteredParties = partyProcessing;
        break;
      case "success":
        filteredParties = partySuccess;
        break;
      default:
        filteredParties = [];
        break;
    }

    if (filteredParties.length > 0) {
      pasteData(filteredParties, user);
    } else {
      setParties([]);
    }
  };

  return (
    <div className="flex flex-col gap-[30px]">
      <TitleHistoryPartyUser
        title={"Lịch sử tiệc"}
        partyBooked={partySuccess.length}
        waitingParty={partyPending.length}
        totalMoney={`${totalAmount.toLocaleString("vi-VN")} VND`}
      ></TitleHistoryPartyUser>
      <div className="w-full h-[1px] bg-whiteAlpha-300"></div>
      <div className="flex gap-[30px]">
        <div className="flex gap-3 items-center">
          <span className="text-sm font-normal leading-5">Lọc theo ngày</span>
          <select
            onChange={(e) => clickFilter(e)}
            className="px-3 py-[6px] w-[145px] bg-whiteAlpha-400 text-white text-sm leading-5"
          >
            <option className="bg-white bg-opacity-40 text-black" value="near">
              Gần nhất
            </option>
            <option className="bg-white bg-opacity-40 text-black" value="old">
              Cũ nhất
            </option>
          </select>
        </div>
        <div className="flex gap-3 items-center">
          <span className="text-sm font-normal leading-5">Trạng thái</span>
          <select
            name=""
            id=""
            className="px-3 py-[6px] w-[145px] bg-whiteAlpha-400 text-white text-sm leading-5"
            onChange={(e) => clickFilter(e)}
          >
            <option className="bg-white bg-opacity-40 text-black" value="all">
              Tất cả
            </option>
            <option
              className="bg-white bg-opacity-40 text-black"
              value="pending"
            >
              Đang chờ
            </option>
            <option
              className="bg-white bg-opacity-40 text-black"
              value="processing"
            >
              Đang xử lý
            </option>
            <option
              className="bg-white bg-opacity-40 text-black"
              value="happening"
            >
              Đang diễn ra
            </option>
            <option
              className="bg-white bg-opacity-40 text-black"
              value="success"
            >
              Hoàn thành
            </option>
            {/* <option className="bg-white bg-opacity-40 text-black" value="cancel">Hủy</option> */}
          </select>
        </div>
      </div>
      {parties && parties.length > 0 ? (
        parties.map((party) => (
          <div key={party.id} className="cursor-pointer">
            <PartySectionClient
              branch_id={branch_id}
              reloadPage={handleDataFromChild}
              showFull={false}
              Collapsed={true}
              showDetailLink={true}
              data={party}
              linkTo={`/client/nguoi-dung/lich-su-tiec/${party.id}`}
            />
          </div>
        ))
      ) : (
        <div className='absolute'>
          <div className='relative left-[400px] top-[263px]  w-[100px] h-[100px]'>
            <div>  <Image
              src='/notebook.png'
              alt="user-img"
              fill
              className="w-[200px] opacity-50"
            /></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default page;
