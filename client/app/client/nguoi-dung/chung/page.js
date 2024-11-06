'use client'
import React, { useEffect, useState } from 'react';
import AccountSectionClient from '@/app/_components/AccountSectionClient';
import PartySectionClient from '@/app/_components/PartySectionClient';
import { useRouter } from 'next/navigation';



const Page = () => {
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
    ]

    const parties = [
        {
            id: '1',
            nameParty: "Tiệc cưới của cô dâu Trần Thị A và chú rể Nguyễn Văn B",
            address: "447 Hoàng Văn Thụ, Quận Phú Nhuận, TP. HCM",
            phoneAddress: "0123456789",
            hostName: "Nguyễn Văn A",
            email: "example@example.com",
            phoneUser: "0987654321",
            idParty: "P001",
            typeParty: "Tiệc cưới",
            partyDate: "2024-10-15",
            dateOrganization: "2024-10-20",
            liveOrOnline: "Trực tiếp",
            numberGuest: 150,
            hall: "Sảnh A",
            session: "Buổi tối",
            tableNumber: 15,
            spareTables: 2,
            linkTo: "/party/1",
            showFull: true,
            showDetailLink: true,
            Collapsed: false,
            space: "Rộng rãi",
            decorate: "Hoa hồng đỏ và trắng",
            typeTable: "Tròn",
            typeChair: "Ghế nệm bọc vải",
            guestTable: "10 người/bàn",
            menu: "Thực đơn 5 món Á",
            drinks: "Bia Tiger, Nước ngọt Pepsi",
            payerName: "Nguyễn Văn A",
            paymentMethod: "Chuyển khoản",
            amountPayable: "150,000,000 VND",
            depositAmount: "50,000,000 VND",
            depositStatus: "Đã thanh toán",
            depositDay: "2024-10-10",
            remainingPaid: "100,000,000 VND",
            menuCostTable: "3,000,000 VND/bàn",
            paymentDay: "2024-10-20",
        },
    ];

    useEffect(() => {
        setUser(data[0]);
    }, []);
    console.log(user);
    
    return (
        <div className="flex flex-col gap-8">

            <span className="text-2xl font-bold text-white leading-6">Chung</span>

            <AccountSectionClient title="Tài khoản" nameUser={user?.name} phoneUser={user?.phone} emailUser={user?.email} partyBooked={3} waitingParty={3} totalMoney={"500.000.000 VND"} />

            <div className="w-full h-[1px] bg-whiteAlpha-300"></div>
            <span className="text-base font-bold leading-normal text-gold">Tiệc gần nhất</span>

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

export default Page;
