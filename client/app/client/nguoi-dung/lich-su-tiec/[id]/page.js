'use client'
import React, { useEffect, useState } from 'react';
import clipBoard from "@/public/clipBoard.svg";
import DownloadIcon from "@/public/DownloadIcon.svg";
import OutlineFeedBack from "@/public/OutlineFeedBack.svg";
import { Image } from '@nextui-org/react';
import PartySectionClient from '@/app/_components/PartySectionClient';
import { fetchBookingById } from '@/app/_services/bookingServices';
import { useRouter } from 'next/navigation';
import PaymentMethod from '@/app/_components/Payment';
import { fetchCategoriesById } from '@/app/_services/productsServices';
import { getProductById } from '@/app/_services/productsServices';


const Page = ({ params }) => {
    const { id } = params;
    const [party, setParty] = useState([]);
    const [partyPartyDetails, setPartyDetails] = useState([]);
    const [user, setUser] = useState();
    const router = useRouter();
    const [countTables, setCountTables] = useState(0)
    const [statusParty, setStatusParty] = useState(0);
    const [priceMenu, setPriceMenu] = useState(0);
    const [priceStages, setPriceStages] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [pricePartyTypes, setPricePartyTypes] = useState(0);
    const [priceDecoration, setPriceDecoration] = useState(0);
    const [spareCountTables, setSpareCountTables] = useState(0);
    const [deposits, setDeposits] = useState(0);
    const [showPaymentMethod, setShowPaymentMethod] = useState(false);
    const [deponsit_id, setDeponsit_id] = useState();
    const [partyStatus, setPartyStatus] = useState();
    const [order_service, setOrder_service] = useState();

    useEffect(() => {
        const getData = async () => {
            const getUser = JSON.parse(localStorage.getItem("user"));

            if (getUser) {
                setUser(getUser);
            } else {
                router.push('/');
            }
            try {
                const fetchData = await fetchBookingById(id);
                console.log('fetchData', fetchData);

                setPartyDetails(fetchData)
                // console.log('Do dai cua fetchData', fetchData.length);

                if (fetchData.length > 0) {
                    const parties = await Promise.all(fetchData.map(async (item) => {
                        const dataDetailBooking = item.booking_details;
                        const dataStages = item.stages || dataDetailBooking[0]?.stage_detail;
                        const dataMenus = dataDetailBooking[0]?.menus;
                        const drinksPrice = dataMenus?.products.reduce((total, item) => {
                            if (item.category_id == 1) {
                                return total + (item.price || 0);
                            }
                            return total;
                        }, 0);
                        const dataDecors = dataDetailBooking[0]?.decors;
                        const datadePosits = dataDetailBooking[0]?.deposits;
                        const dataMenu = dataDetailBooking[0]?.menu_detail;

                        const otherService = dataDetailBooking[0]?.other_service;
                        // console.log('otherService',otherService);
                        let dataOtherService = [];
                        if (otherService != null) {
                            const products = await Promise.all(
                                otherService.map(service => getProductById(service.id))
                            );

                             dataOtherService = products.flat().map((product, index) => ({
                                name: product.name,
                                quantity: otherService[index].quantity
                            }));
                        }else{
                            dataOtherService = [];
                        }

                        // Nước uống
                        const drinkShow = dataMenus?.products.filter((item) => {
                            return item.category_id === 1;
                        });
                        const dessert = dataMenus?.products.filter((item) => {
                            return item.category_id === 15;
                        });
                        // console.log(drinkShow);


                        // Tính chi phí bàn và ghế
                        const tableCount = dataDetailBooking[0]?.table_count || 0;
                        const tablePrice = tableCount * 200000;
                        const chairPrice = tableCount * 10 * 50000;

                        // Chi phí menu
                        const menuCost = dataMenus?.price || 0;

                        // Chi phí bàn và ghế dự phòng
                        const spareTableCount = dataDetailBooking[0]?.spare_table_count;

                        const spareTableCost = spareTableCount * 200000;
                        const spareChairCost = spareTableCount * 10 * 50000;

                        // Các chi phí cụ thể khác
                        const decorCost = dataDecors?.price || 0;
                        const stageCost = dataStages?.price || 0;


                        const partyTypeCost = item.party_types.price || 0;


                        const additionalServiceCost = 0;

                        // Chi phí dịch vụ khác
                        const otherServicesCost = item.other_services?.reduce((total, service) => {
                            return total + (service.price * service.quantity);
                        }, 0) || 0;


                        // Chi phí dịch vụ thêm (chỉ tính khi is_deposit là true)
                        // if (item.status ) {
                        //     const extraServicesCost = item.extra_services?.reduce((total, service) => {
                        //         if (service.is_deposit) {
                        //             return total + (service.price * service.quantity);
                        //         }
                        //         return total;
                        //     }, 0) || 0;
                        // }



                        // Tính tổng chi phí
                        const amount =
                            tablePrice +                  // Tổng chi phí bàn
                            chairPrice +                  // Tổng chi phí ghế
                            decorCost +                   // Chi phí trang trí
                            partyTypeCost +               // Chi phí loại tiệc
                            stageCost +                   // Chi phí sảnh
                            menuCost +                    // Chi phí menu
                            drinksPrice +                 // Chi phí nước
                            spareTableCost +              // Chi phí bàn dự phòng
                            spareChairCost +              // Chi phí ghế dự phòng
                            additionalServiceCost +       // Chi phí dịch vụ bổ sung
                            otherServicesCost;          // Chi phí dịch vụ khác 
                        // console.log('amount',amount);
                        // console.log("tablePrice",tablePrice);
                        // console.log("chairPrice",chairPrice);
                        // console.log("decorCost",decorCost);
                        // console.log("partyTypeCost",partyTypeCost);
                        // console.log("stageCost",stageCost);
                        // console.log("menuCost",menuCost);
                        // console.log("drinksPrice",drinksPrice);
                        // console.log("spareTableCost",spareTableCost);
                        // console.log("additionalServiceCost",additionalServiceCost);
                        // console.log("otherServicesCost",otherServicesCost);
                        // console.log("extraServicesCost",extraServicesCost);
                        setStatusParty(item.status);
                        setPriceMenu(dataMenus?.price);
                        setPriceStages(dataStages?.price);
                        setPriceDecoration(dataDecors?.price);
                        setCountTables(dataDetailBooking[0]?.table_count);
                        setSpareCountTables(spareTableCount);
                        setDeponsit_id(datadePosits?.transactionID);
                        setDeposits(datadePosits?.amount)
                        setShowPaymentMethod(item.status === 'processing');
                        setPartyStatus(item.status);
                        setTotalAmount(dataDetailBooking[0]?.total_amount);


                        return {
                            id: item.id,
                            nameParty: item?.name,
                            address: item.company_name,
                            phoneAddress: item.phone,
                            hostName: item.company_name,
                            email: getUser?.email,
                            phoneUser: item.phone,
                            idParty: `P${item.id}`,
                            partyDate: formatDate(item.created_at),
                            dateOrganization: formatDate(item.organization_date),
                            numberGuest: (dataDetailBooking[0]?.table_count * 10),
                            session: item.shift,
                            tableNumber: dataDetailBooking[0]?.table_count,
                            spareTables: spareTableCount,
                            linkTo: `/party/${item.id}`,
                            showFull: true,
                            showDetailLink: true,
                            Collapsed: false,
                            hall: dataStages?.name,
                            typeParty: item.name,
                            liveOrOnline: "Trực tiếp",
                            space: dataStages.name,
                            decorate: dataDetailBooking[0]?.decors?.name || "Không có trang trí",
                            guestTable: "10 người/bàn",
                            menu: dataMenus?.name,
                            drinks: drinkShow.map(i => i.name).join(', '),
                            payerName: item.name,
                            paymentMethod: `${datadePosits?.payment_method || "Chưa có"} `,
                            menuCostTable: datadePosits?.status === 'pending' ? 'Đang chờ thanh toán' : "Đã thanh toán",
                            amountPayable: dataDetailBooking[0]?.total_amount ? `${dataDetailBooking[0].total_amount.toLocaleString('vi-VN')} VND ` : "0 VND",
                            depositAmount: datadePosits?.amount ? `${datadePosits?.amount.toLocaleString('vi-VN')} VND` : "0 VND",
                            depositStatus: item.is_deposit ? 'Đã cọc' : "Chưa đặt cọc",
                            depositDay: item.is_deposit ? formatDate(datadePosits?.created_at) : '--/--/--',
                            remainingPaid: (dataDetailBooking[0].total_amount && datadePosits?.amount) ? `${(parseInt(dataDetailBooking[0].total_amount) - parseInt(datadePosits?.amount)).toLocaleString('vi-VN')} VND` : `${dataDetailBooking[0].total_amount.toLocaleString('vi-VN')} VND`,
                            paymentDay: item.status == 'success' ? formatDate(datadePosits?.created_at) : '--/--/--',
                            typeTable: "Tùy chỉnh",
                            typeChair: "Tùy chỉnh",
                            // Chi phí khác
                            costTable: `${(Math.floor(amount / tableCount) / 1000000).toFixed(1) === "1.0" ? "1 triệu" : (amount / tableCount / 1000000).toFixed(1).replace('.', ',')} triệu / bàn`,
                            decorationCost: `${dataDecors?.price.toLocaleString('vi-VN')} VND`,
                            soundStage: `${dataStages?.price === 0 ? '0 VND' : `${dataStages?.price.toLocaleString('vi-VN')} VND`}`,
                            hallRental: `${dataStages?.price === 0 ? '0 VND' : `${dataStages?.price.toLocaleString('vi-VN')} VND`}`,
                            tableRental: "200.000 VND / 1 bàn",
                            chairRental: "50.000 VND / 1 ghế",
                            paymentStatus: `${(dataMenu.price).toLocaleString('vi-VN')} VND / bàn` || 0,
                            snack: dessert.map(i => i.name).join(', '),
                            vat: "10%",
                            drinksCost: `${drinksPrice.toLocaleString('vi-VN')} VND / bàn` || 0,
                            arise: dataOtherService?.length > 0
                                ? dataOtherService?.map(
                                    (i) => (<div>{i.name} x{i.quantity}</div>)
                                )
                                : 'Chưa có',
                            statusParty: item.status
                        };
                    }));
                    console.log('vao dc roi');


                    setParty(parties);
                }

            } catch (error) {
                console.error('Chưa lấy được dữ liệu người dùng', error);
            }
        };

        getData();
    }, [id]);
    console.log('detail party', party);

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options).replace(/\//g, '/');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'success':
                return 'text-green-500';
            case 'processing':
                return 'text-blue-300';
            case 'peding':
                return 'text-yellow-300';
            default:
                return 'text-gray-500';
        }
    };
    return (
        <div className='flex flex-col gap-6'>
            <div className='flex justify-between items-center'>
                <span className='text-2xl font-bold leading-[22px] text-white'>
                    Mã tiệc: <span className='text-gray-400'>{id}</span>
                </span>

                <div className='flex gap-3'>
                    {/* <button className='px-4 py-3 rounded bg-white flex items-center justify-center'>
                        <Image src={clipBoard} alt='clipBoard' objectFit='cover'></Image>
                    </button>
                    <button className='px-4 py-3 rounded bg-white flex items-center justify-center'>
                        <Image src={DownloadIcon} alt='clipBoard' objectFit='cover'></Image>
                    </button> */}

                    {partyStatus == 'success' ? <button className='px-4 py-3 rounded bg-white flex items-center justify-center' onClick={() => router.push(`/client/form-danh-gia-gop-y/${partyPartyDetails[0].branch_id}/${partyPartyDetails[0].id}`)}>
                        <Image src={OutlineFeedBack} alt='clipBoard' objectFit='cover'></Image>
                    </button> : ''}

                </div>

            </div>

            <div className='flex items-center'>
                <span className={`${getStatusColor(statusParty)} text-base`}>
                    • {statusParty === 'success' ? 'Đã hoàn thành' : statusParty === 'pending' ? 'Chưa giải quyết' : statusParty === 'cancel' ? 'Đã Hủy' : 'Đang chờ xử lý'}
                </span>
            </div>
            {showPaymentMethod && countTables > 0 ? (
                <PaymentMethod
                    countTables={countTables}
                    sparecountTables={spareCountTables}
                    priceMenu={priceMenu}
                    pricecpartyTypes={pricePartyTypes}
                    priceDecoration={priceDecoration}
                    totalAmount={totalAmount}
                    statusParty={statusParty}
                    deposits={deposits}
                    deposit_Id={deponsit_id}
                    partyStatus={partyStatus}
                />
            ) : ''}
            <div className="w-full h-[1px] bg-whiteAlpha-300"></div>
            {party && party.length > 0 ? (
                party.map(party => (
                    <div key={party.id} className="cursor-pointer">
                        <PartySectionClient showFull={true} Collapsed={false} showDetailLink={false} data={party} linkTo={`/client/nguoi-dung/lich-su-tiec/${party.id}`} />
                    </div>
                ))
            ) : (
                <p className="text-white leading-6 text-xl font-medium">Tiệc của bạn đang được chúng tôi xử lý.</p>
            )}
        </div>
    );
};

export default Page;
