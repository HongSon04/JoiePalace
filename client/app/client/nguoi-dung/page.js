'use client'
import React, { useEffect, useState } from 'react';
import AccountSectionClient from '@/app/_components/AccountSectionClient';
import PartySectionClient from '@/app/_components/PartySectionClient';
import { useRouter } from 'next/navigation';
import { fecthDatabyMembershipId } from '@/app/_services/membershipsServices';
import { fetchAllBookingByUserId, fetchBookingById } from '@/app/_services/bookingServices';

import Link from 'next/link';
import { Result } from 'postcss';


const Page = () => {
    const [user, setUser] = useState();
    const [membershipId, setMembershipId] = useState(null);
    const [party, setParty] = useState();
    const [partDetails, setPartyDetails] = useState([]);
    const [resonParty, setResonParty] = useState([]);
    const [partySuccess, setPartySuccess] = useState([]);
    const [partyPending, setPartyPending] = useState([]);
    const data = [
        {
            "id": 1,
            "branch_id": null,
            "username": "admin",
            "email": "admin1@gmail.com",
            "platform": null,
            "phone": "0315346764",
            "avatar": null,
            "role": "admin",
            "active": true,
            "verify_at": null,
            "created_at": "2024-10-24T08:11:32.239Z",
            "updated_at": "2024-10-31T02:38:12.031Z",
            "memberships_id": null,
            "memberships": null
        }
    ];


    // const parties = [
    //     {
    //         id: '1',
    //         nameParty: "Tiệc cưới của cô dâu Trần Thị A và chú rể Nguyễn Văn B",
    //         address: "447 Hoàng Văn Thụ, Quận Phú Nhuận, TP. HCM",
    //         phoneAddress: "0123456789",
    //         hostName: "Nguyễn Văn A",
    //         email: "example@example.com",
    //         phoneUser: "0987654321",
    //         idParty: "P001",
    //         typeParty: "Tiệc cưới",
    //         partyDate: "2024-10-15",
    //         dateOrganization: "2024-10-20",
    //         liveOrOnline: "Trực tiếp",
    //         numberGuest: 150,
    //         hall: "Sảnh A",
    //         session: "Buổi tối",
    //         tableNumber: 15,
    //         spareTables: 2,
    //         linkTo: "/party/1",
    //         showFull: true,
    //         showDetailLink: true,
    //         Collapsed: false,
    //         space: "Rộng rãi",
    //         decorate: "Hoa hồng đỏ và trắng",
    //         typeTable: "Tròn",
    //         typeChair: "Ghế nệm bọc vải",
    //         guestTable: "10 người/bàn",
    //         menu: "Thực đơn 5 món Á",
    //         drinks: "Bia Tiger, Nước ngọt Pepsi",
    //         payerName: "Nguyễn Văn A",
    //         paymentMethod: "Chuyển khoản",
    //         amountPayable: "150,000,000 VND",
    //         depositAmount: "50,000,000 VND",
    //         depositStatus: "Đã thanh toán",
    //         depositDay: "2024-10-10",
    //         remainingPaid: "100,000,000 VND",
    //         menuCostTable: "3,000,000 VND/bàn",
    //         paymentDay: "2024-10-20",
    //     },
    // ];

    useEffect(() => {
        const getData = async () => {
            try {
                // Set user data
                setUser(data[0]);

                // Fetch membership data if available
                if (data[0]?.memberships_id) {
                    const fetchedDataByMembershipId = await fetchDatabyMembershipId(data[0].memberships_id);
                    setMembershipId(fetchedDataByMembershipId);
                }

                // Fetch all bookings for the user
                const fetchedAllBookingsMembershipId = await fetchAllBookingByUserId(1);
                const fetchedAllBookingsSuccess = fetchedAllBookingsMembershipId.filter((i) => i.status === 'success');
                const fetchedAllBookingsPending = fetchedAllBookingsMembershipId.filter((i) => i.status === 'pending');

                if (fetchedAllBookingsPending.length > 0) {
                    const parties = fetchedAllBookingsPending.map((item) => {
                        const dataDetailBooking = item.booking_details;
                        const dataStages = item.stages;
                        const dataMenus = dataDetailBooking[0]?.menus;
                        const datadePosits = dataDetailBooking[0]?.deposits;

                        return {
                            id: item.id,
                            nameParty: item.name,
                            address: item.company_name,
                            phoneAddress: item.phone,
                            hostName: data[0]?.username,
                            email: data[0]?.email,
                            phoneUser: data[0]?.phone,
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
                    setResonParty(parties);
                }

                // Set successful and pending parties
                setPartySuccess(fetchedAllBookingsSuccess);
                setPartyPending(fetchedAllBookingsPending);
                setParty(fetchedAllBookingsMembershipId);
            } catch (error) {
                console.error('Chưa lấy được dữ liệu người dùng', error);
            }
        };

        getData();
    }, []); 




    // console.log('Data party full:', parties);

    return (
        <div className="flex flex-col gap-8">

            <span className="text-2xl font-bold text-white leading-6">Chung</span>

            <AccountSectionClient title="Tài khoản" nameUser={user?.name} phoneUser={user?.phone} emailUser={user?.email} imgUser={user?.avatar} total_amount={membershipId?.booking_total_amount} partyBooked={partySuccess?.length} waitingParty={partyPending?.length} totalMoney={`${membershipId?.booking_total_amount ? membershipId?.booking_total_amount : 0} VND`} />

            <div className="w-full h-[1px] bg-whiteAlpha-300"></div>
            <div className='flex justify-between'>
                <span className="text-base font-bold leading-normal text-gold">Tiệc gần nhất</span>
                <Link href={'nguoi-dung/lich-su-tiec'} className='underline text-gold text-base font-medium cursor-pointer'>Tiệc của bạn</Link>
            </div>

            {resonParty && resonParty.length > 0 ? (
                resonParty.map(party => (
                    <div key={party.id} className="cursor-pointer">
                        <PartySectionClient showFull={false} Collapsed={false} showDetailLink={true} data={party} linkTo={`/client/nguoi-dung/lich-su-tiec/${party.id}`} />
                    </div>
                ))
            ) : (
                <p className="text-white leading-6 text-xl font-medium">Không có tiệc đã đặt.</p>
            )}
        </div>
    );
};

export default Page;
