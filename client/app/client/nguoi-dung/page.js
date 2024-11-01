import AccountSectionClient from '@/app/_components/AccountSectionClient';
import PartySectionClient from '@/app/_components/PartySectionClient';
import React from 'react';

const parties = [
    {
        id: '1',
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

const Page = () => {
    return (
        <div className="flex flex-col gap-8">
        
        {/* Section Title */}
        <span className="text-2xl font-bold text-white leading-6">Chung</span>

        {/* Account Section */}
        <AccountSectionClient title="Tài khoản" nameUser={"Hồ Duy Hoàng Giang"} phoneUser={"0337678852"} emailUser={"hoduyhoanggiang08@gmail.com"} partyBooked={3} waitingParty={3} totalMoney={"500.000.000 VND"}/>

        {/* Bottom Divider */}
        <div className="w-full h-[1px] bg-whiteAlpha-300"></div>

        {/* Party Section */}
        {parties && parties.length > 0 ? (
                parties.map(party => (
                    <div key={party.id} className="cursor-pointer">
                        <PartySectionClient  showFull={false} Collapsed={true} showDetailLink={true} data={party} linkTo={`/client/nguoi-dung/lich-su-tiec/${party.id}`} />
                    </div>
                ))
            ) : (
                <p className="text-white leading-6 text-xl font-medium">Không có tiệc đã đặt.</p>
            )}

    </div>
    );
};

export default Page;