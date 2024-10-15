import PartySectionClient from '@/app/_components/PartySectionClient';
import TitleHistoryPartyUser from '@/app/_components/TitleHistoryPartyUser';
import React from 'react';

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
const page = () => {
    return (
        <div className='flex flex-col gap-[30px]'>
            <TitleHistoryPartyUser title={'Lịch sử tiệc'} partyBooked={'3'} waitingParty={'3'} totalMoney={'700.000.000 VNĐ'}></TitleHistoryPartyUser>
            <div className="w-full h-[1px] bg-whiteAlpha-300"></div>
            <div className='flex gap-[30px]'>
                <div className='flex gap-3 items-center'>
                    <span className='text-sm font-normal leading-5'>Lọc theo ngày</span>
                    <select name="" id="" className='px-3 py-[6px] w-[145px] bg-whiteAlpha-400 text-white text-sm leading-5'>
                        <option className="bg-white bg-opacity-40 text-black" value="">Gần nhất</option>
                        <option className="bg-white bg-opacity-40 text-black" value="">Cũ nhất</option>
                    </select>
                </div>
                <div className='flex gap-3 items-center'>
                    <span className='text-sm font-normal leading-5'>Trạng thái</span>
                    <select name="" id="" className='px-3 py-[6px] w-[145px] bg-whiteAlpha-400 text-white text-sm leading-5'>
                        <option className="bg-white bg-opacity-40 text-black" value="">Tất cả</option>
                        <option className="bg-white bg-opacity-40 text-black" value="">Đang diễn ra</option>
                        <option className="bg-white bg-opacity-40 text-black" value="">Hủy</option>
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