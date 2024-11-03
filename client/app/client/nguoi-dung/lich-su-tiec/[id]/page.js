'use client'
import React, { useEffect, useState } from 'react';
import clipBoard from "@/public/clipBoard.svg";
import DownloadIcon from "@/public/DownloadIcon.svg";
import OutlineFeedBack from "@/public/OutlineFeedBack.svg";
import Image from 'next/image';
import PartySectionClient from '@/app/_components/PartySectionClient';
import { fetchBookingById } from '@/app/_services/bookingServices';

const Page = ({ params }) => {
    const { id } = params;
    const [party, setParty] = useState([]);
    const [user, setUser] = useState();
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
    useEffect(() => {
        const getData = async () => {
            setUser(data[0]);
            try {
                const fetchData = await fetchBookingById(id);

                if (fetchData.length > 0) {
                    const parties = fetchData.map((item) => {
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
                            space: dataStages.name,
                            decorate: dataDetailBooking[0]?.decors?.name || "Không có trang trí",
                            guestTable: "10 người/bàn",
                            menu: dataMenus?.name,
                            drinks: "Bia Tiger, Nước ngọt Pepsi",
                            payerName: item.name,
                            paymentMethod: `Chuyển khoản ${datadePosits?.payment_method}`,
                            menuCostTable: datadePosits?.status ==='pending' ? 'Đang chờ thanh toán'  : "Chưa thanh toán",
                            amountPayable: dataDetailBooking[0]?.total_amount ? `${dataDetailBooking[0].total_amount.toLocaleString('vi-VN')} VND ` : "0 VND",
                            depositAmount: datadePosits?.amount ? `${datadePosits?.amount.toLocaleString('vi-VN')} VND` : "0 VND",
                            depositStatus: datadePosits?.status ==='pending' ? 'Đang chờ thanh toán'  : "Chưa thanh toán",
                            depositDay: formatDate(datadePosits?.created_at),
                            remainingPaid: (dataDetailBooking[0].total_amount && datadePosits?.amount) ? `${(parseInt(dataDetailBooking[0].total_amount) - parseInt(datadePosits?.amount)).toLocaleString('vi-VN')} VND` : `${dataDetailBooking[0].total_amount.toLocaleString('vi-VN')} VND`,
                            paymentDay: formatDate(datadePosits?.created_at),
                            typeTable: "Tùy chỉnh",
                            typeChair: "Tùy chỉnh",
                            // Chi phí khác
                            costTable: `${dataMenus?.price.toLocaleString('vi-VN')} VND/bàn`,
                            decorationCost: "15,000,000 VND",
                            soundStage: "20,000,000 VND",
                            hallRental: "30,000,000 VND",
                            tableRental: "7,500,000 VND",
                            chairRental: "4,500,000 VND",
                            paymentStatus: "Đã thanh toán",
                            snack: "Bánh ngọt, Trái cây",
                            vat: "10%",
                            drinksCost: "20,000,000 VND",
                            arise: "10,000,000 VND",

                        };
                    });
                    setParty(parties);
                }

            } catch (error) {
                console.error('Chưa lấy được dữ liệu người dùng', error);
            }
        };

        getData();
    }, [id]);

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options).replace(/\//g, '/');
    };

    // const parties = [
    //     {
    //         id: '1',
    //         nameParty: "Tiệc cưới của cô dâu Trần Thị A và chú rể Nguyễn Văn B",
    //         address: "447 Hoàng Văn Thụ, Quận Phú Nhuận, TP. HCM",
    //         phoneAddress: "0123456789",
    //         hostName: "Nguyễn Văn A",
    //         email: "nguyenvana@example.com",
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
    //         costTable: "3,500,000 VND",
    //         decorationCost: "15,000,000 VND",
    //         soundStage: "20,000,000 VND",
    //         hallRental: "30,000,000 VND",
    //         tableRental: "7,500,000 VND",
    //         chairRental: "4,500,000 VND",
    //         paymentStatus: "Đã thanh toán",
    //         snack: "Bánh ngọt, Trái cây",
    //         vat: "10%",
    //         drinksCost: "20,000,000 VND",
    //         arise: "10,000,000 VND",
    //     },
    // ];


    return (
        <div className='flex flex-col gap-6'>
            <div className='flex justify-between items-center'>
                <span className='text-2xl font-bold leading-[22px] text-white'>
                    Mã tiệc: <span className='text-gray-400'>{id}</span>
                </span>

                <div className='flex gap-3'>
                    <button className='px-4 py-3 rounded bg-white flex items-center justify-center'>
                        <Image src={clipBoard} alt='clipBoard' objectFit='cover'></Image>
                    </button>
                    <button className='px-4 py-3 rounded bg-white flex items-center justify-center'>
                        <Image src={DownloadIcon} alt='clipBoard' objectFit='cover'></Image>
                    </button>
                    <button className='px-4 py-3 rounded bg-white flex items-center justify-center'>
                        <Image src={OutlineFeedBack} alt='clipBoard' objectFit='cover'></Image>
                    </button>
                </div>
            </div>

            <div className='flex items-center'>
                <span className='text-cyan-400 text-base'>• Đã hoàn thành</span>
            </div>
            <div className="w-full h-[1px] bg-whiteAlpha-300"></div>
            {party && party.length > 0 ? (
                party.map(party => (
                    <div key={party.id} className="cursor-pointer">
                        <PartySectionClient showFull={true} Collapsed={false} showDetailLink={false} data={party} linkTo={`/client/nguoi-dung/lich-su-tiec/${party.id}`} />
                    </div>
                ))
            ) : (
                <p className="text-white leading-6 text-xl font-medium">Không có tiệc đã đặt.</p>
            )}
        </div>
    );
};

export default Page;
