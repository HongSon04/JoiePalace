import React from 'react';
import Image from "next/image";
import AccountSection from '@/app/_components/AccountSection';
import PartySection from '@/app/_components/PartySection';

const Page = () => {
    const parties = [
        {
            nameParty: "Tiệc cưới của cô dâu Trần Thị A và chú rể Nguyễn Văn B",
            address: "Địa chỉ: Tổ chức tại: Chi nhánh 1, số 447, Hoàng Văn Thụ, Quận Phú Nhuận, TP. HCM",
            phoneAddress: "0123456789",
            hostName: "Nguyễn Văn A",
            email: "example@example.com",
            phoneUser: "0987654321",
            idParty: "P001",
            typeParty: "Sinh nhật",
            partyDate: "2024-10-15",
            dateOrganization: "2024-10-20",
            liveOrOnline: "Trực tiếp",
            numberGuest: 50,
            hall: "Sảnh A",
            session: "Buổi tối",
            tableNumber: 5,
            spareTables: 2,
        },
    ];
    return (
        <div className="flex flex-col gap-8">
            {/* Section Title */}
            <span className="text-2xl font-bold text-white leading-6">Chung</span>

            {/* Account Section */}
            <AccountSection title="Tài khoản" />

            {/* Bottom Divider */}
            <div className="w-full h-[1px] bg-whiteAlpha-300"></div>

            {/* Party Section */}
                <PartySection title="Tiệc gần nhất" data={parties}></PartySection>
        </div>
    );
};

export default Page;
