'use client'
import PartySectionClient from '@/app/_components/PartySectionClient';
import TitleHistoryPartyUser from '@/app/_components/TitleHistoryPartyUser';
import React, { useEffect, useState } from 'react';
import AccountSectionClient from '@/app/_components/AccountSectionClient';
import { useRouter } from 'next/navigation';
import { fecthDatabyMembershipId } from '@/app/_services/membershipsServices';
import { fetchAllBookingByUserId, fetchBookingById } from '@/app/_services/bookingServices';

import Link from 'next/link';
import { Result } from 'postcss';


const page = () => {
    const [user, setUser] = useState();
    const [membershipId, setMembershipId] = useState(null);
    const [parties, setParties] = useState([]);
    const [partyAll, setPartyAll] = useState([]);
    const [partySuccess, setPartySuccess] = useState([]);
    const [partyPending, setPartyPending] = useState([]);
    const [partyCancel, setPartyCancel] = useState([]);
    const [partyOld, setPartyOld] = useState([]);
    const [partyNew, setPartyNew] = useState([]);
    const [totalAmount, setTotalAmount] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const getData = async () => {
            const getUser = JSON.parse(localStorage.getItem("user"));
            if (getUser) {
                setUser(getUser);
            } else {
                router.push('/');
            }
            try {
                // Fetch membership data if available
                if (user?.memberships_id) {
                    const fetchedDataByMembershipId = await fetchDatabyMembershipId(user.memberships_id);
                    setMembershipId(fetchedDataByMembershipId);
                }

                // Fetch all bookings for the user
                const fetchedAllBookingsMembershipId = await fetchAllBookingByUserId(getUser.id);
                const fetchedAllBookingsSuccess = fetchedAllBookingsMembershipId.filter((i) => i.status === 'success');
                const fetchedAllBookingsPending = fetchedAllBookingsMembershipId.filter((i) => i.status === 'pending'|| i.status === 'processing');
                const fetchedAllBookingsCancel = fetchedAllBookingsMembershipId.filter((i) => i.status === 'cancel');

                const fetchedAllBookingsOld = [...fetchedAllBookingsMembershipId].sort((a, b) => {
                    return new Date(a.created_at) - new Date(b.created_at);
                });
                const fetchedAllBookingsNewest = [...fetchedAllBookingsMembershipId].sort((a, b) => {
                    return new Date(b.created_at) - new Date(a.created_at);
                });

                setPartyOld(fetchedAllBookingsOld)
                setPartyNew(fetchedAllBookingsNewest)

                setPartyAll(fetchedAllBookingsMembershipId)

                setPartySuccess(fetchedAllBookingsSuccess);
                setPartyPending(fetchedAllBookingsPending);
                setPartyCancel(fetchedAllBookingsCancel)

                pasteData(fetchedAllBookingsMembershipId, getUser);

                const total_amountUser = fetchedAllBookingsSuccess.reduce((total, item) => {
                    return total + item.booking_details[0].total_amount;
                }, 0);
                setTotalAmount(total_amountUser)
            } catch (error) {
                console.error('Chưa lấy được dữ liệu người dùng', error);
            }
        };

        getData();
    }, []);

    const pasteData = (data, user) => {
        if (data.length > 0) {
            const dataParty = data.map((item) => {
                const dataDetailBooking = item.booking_details;
                const dataStages = item.stages;
                const dataMenus = dataDetailBooking[0]?.menus;
                const datadePosits = dataDetailBooking[0]?.deposits;

                return {
                    id: item.id,
                    nameParty: item.name,
                    address: item.company_name,
                    phoneAddress: item.phone,
                    hostName: user?.name,
                    email: user?.email,
                    phoneUser: user?.phone,
                    idParty: `P${item.id}`,
                    partyDate: new Date(item.created_at).toISOString().split("T")[0],
                    dateOrganization: new Date(item.organization_date).toISOString().split("T")[0],
                    numberGuest: item.number_of_guests,
                    session: item.shift,
                    tableNumber: Math.ceil(item.number_of_guests / 10),
                    spareTables: 2,
                    linkTo: `/party/${item.id}`,
                    showFull: true,
                    showDetailLink: true,
                    Collapsed: false,
                    hall: dataStages.name,
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
                    amountPayable: dataDetailBooking[0]?.total_amount ? `${dataDetailBooking[0].total_amount} VND` : "0 VND",
                    depositAmount: item.is_deposit ? `${datadePosits?.amount} VND` : "0 VND",
                    depositStatus: item.is_deposit ? "Đã thanh toán" : "Chưa thanh toán",
                    depositDay: item.is_deposit ? new Date(datadePosits?.created_at).toISOString().split("T")[0] : "",
                    remainingPaid: (item.total_amount && item.depositAmount) ? `${parseInt(item.total_amount) - parseInt(item.depositAmount)} VND` : "0 VND",
                    paymentDay: item.organization_date ? item.organization_date.split("T")[0] : "",
                };
            });

            setParties(dataParty);
        }
    }

    const clickFilter = (e) => {
        switch (e.target.value) {
            case "old":
                setParties(partyOld, user);
                break;
            case "near":
                setParties(partyNew, user);
                break;
            case "all":
                setParties(partyAll, user);
                break;
            case "happening":
                setParties(partyPending, user);
                break;
            case "cancel":
                setParties(partyCancel, user);
                break;
            default:
                break;
        }
    };

    return (
        <div className='flex flex-col gap-[30px]'>
            <TitleHistoryPartyUser title={'Lịch sử tiệc'} partyBooked={partySuccess.length} waitingParty={partyPending.length} totalMoney={`${totalAmount.toLocaleString('vi-VN')} VND`}></TitleHistoryPartyUser>
            <div className="w-full h-[1px] bg-whiteAlpha-300"></div>
            <div className='flex gap-[30px]'>
                <div className='flex gap-3 items-center'>
                    <span className='text-sm font-normal leading-5'>Lọc theo ngày</span>
                    <select
                        onChange={(e) => clickFilter(e)}
                        className='px-3 py-[6px] w-[145px] bg-whiteAlpha-400 text-white text-sm leading-5'
                    >
                        <option className="bg-white bg-opacity-40 text-black" value="near">Gần nhất</option>
                        <option className="bg-white bg-opacity-40 text-black" value="old">Cũ nhất</option>
                    </select>

                </div>
                <div className='flex gap-3 items-center'>
                    <span className='text-sm font-normal leading-5'>Trạng thái</span>
                    <select name="" id="" className='px-3 py-[6px] w-[145px] bg-whiteAlpha-400 text-white text-sm leading-5'
                        onChange={(e) => clickFilter(e)}
                    >
                        <option className="bg-white bg-opacity-40 text-black" value="all">Tất cả</option>
                        <option className="bg-white bg-opacity-40 text-black" value="happening">Đang diễn ra</option>
                        <option className="bg-white bg-opacity-40 text-black" value="cancel">Hủy</option>
                    </select>
                </div>
            </div>
            {parties && parties.length > 0 ? (
                parties.map(party => (
                    <div key={party.id} className="cursor-pointer">
                        <PartySectionClient showFull={false} Collapsed={true} showDetailLink={true} data={party} linkTo={`/client/nguoi-dung/lich-su-tiec/${party.id}`} />
                    </div>
                ))
            ) : (
                <p className="text-white leading-6 text-xl font-medium">Không có tiệc đã đặt.</p>
            )}
        </div>
    );
};

export default page;