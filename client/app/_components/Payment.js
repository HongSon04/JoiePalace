import React, { useEffect, useState } from 'react';
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import Image from 'next/image';
import AlertIcon from "@/public/AlertIcon.svg";
import Momo from "@/public/Momo.png";
import OnePay from "@/public/OnePay.png";
import VNPAY from "@/public/VNPAY.png";
import Zalopay from "@/public/Zalopay.png";
import { payment_method } from '@/app/_services/paymentServices';
import useCustomToast from "@/app/_hooks/useCustomToast";
import { useRouter } from 'next/navigation';

const PaymentMethod = ({
    countTables,
    priceMenu,
    pricecpartyTypes,
    priceDecoration,
    sparecountTables,
    deposits,
    deposit_Id
}) => {
    const [showAlert, setShowAlert] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertContent, setAlertContent] = useState('');
    const [totalamount, setTotalAmount] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showPaymentMethod, setShowPaymentMethod] = useState('');
    const [ linkPaymentMethod, setLinkPaymentMethod] = useState('');
    const toast = useCustomToast();
    const router = useRouter();

    const statementPrice = {
        statementtable: `(Bàn ${countTables} + bàn phụ ${sparecountTables} ) x 200.000đ  + Ghế ${(countTables + sparecountTables) * 10} x 50.000đ + Menu ${countTables + sparecountTables} x ${priceMenu.toLocaleString()}đ = ${(((countTables + sparecountTables) * priceMenu) + ((countTables + sparecountTables) * 10 * 50000) + (countTables * 200000)).toLocaleString()}đ`,
        statementPartyType: `Dịch vụ: ${(pricecpartyTypes).toLocaleString()}đ`,
        statementeDecoration: `Trang trí: ${(priceDecoration).toLocaleString()}đ`,
    };
    useEffect(() => {
        const total = ((countTables + sparecountTables) * priceMenu) +
            ((countTables + sparecountTables) * 10 * 50000) +
            ((countTables + sparecountTables) * 200000) +
            pricecpartyTypes + priceDecoration;
        setTotalAmount(total);
    }, [countTables, sparecountTables, priceMenu, pricecpartyTypes]);
    const fees = [
        {
            name: 'Chi phí bàn tiệc',
            totalPrice: ((countTables * 200000) + (countTables * 10 * 50000) + priceMenu + (countTables * priceMenu)).toLocaleString(),
            description: statementPrice.statementtable
        },
        {
            name: 'Chi phí dịch vụ',
            totalPrice: (pricecpartyTypes).toLocaleString(),
            description: statementPrice.statementPartyType
        },
        {
            name: 'Chi phí trang trí',
            totalPrice: (priceDecoration).toLocaleString(),
            description: statementPrice.statementeDecoration
        },
    ];

    const paymentMethods = [
        {
            src: VNPAY,
            alt: "VNPay",
            bgColor: "bg-gray-300",
            textColor: "text-gray-800",
            label: "VNPay",
            method: "vnpay",
        },
        {
            src: Momo,
            alt: "MoMo",
            bgColor: "bg-pink-500",
            textColor: "text-white",
            label: "MoMo",
            method: "momo",
        },
        {
            src: OnePay,
            alt: "OnePay",
            bgColor: "bg-gray-300",
            textColor: "text-gray-800",
            label: "OnePay",
            method: "onepay",
        },
        {
            src: Zalopay,
            alt: "ZaloPay",
            bgColor: "bg-blue-600",
            textColor: "text-white",
            label: "ZaloPay",
            method: "zalopay",
        },
    ];

    const handleAlertClick = (title, content) => {
        setAlertTitle(title);
        setAlertContent(content);
        setShowAlert(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const nextPay = (link) => {
        setIsModalOpen(false);
        window.open(link, '_blank');
    }

    const seendDepositId = async (depositId, method) => {
        switch (method) {
            case 'zalo':
                setShowPaymentMethod('Zalo');
                break;
            case 'vnpay':
                setShowPaymentMethod('VnPay');
                break;
            case 'onepay':
                setShowPaymentMethod('OnePay');
                break;
            case 'zalopay':
                setShowPaymentMethod('ZaloPay');
                break;

            default:
                setShowPaymentMethod('chưa có !!');
                break;
        }


        try {
            const response = await payment_method(method, depositId);
                console.log(response);
                
            if (response.status === 200) {
                 setLinkPaymentMethod(response.payUrl)
                setIsModalOpen(true);
                toast({
                    position: "top",
                    type: "success",
                    title: "Tiến hành thanh toán",
                    description: "Vui lòng tiếp tục thanh toán !!",
                    closable: true,
                });
               
            } else {
                toast({
                    position: "top",
                    type: "error",
                    title: "Tiến hành thanh toán thất bại!",
                    description: "Vui lòng chờ đợi tiệc của bạn đang được xử lý !!",
                    closable: true,
                });
            }
        } catch (error) {
            console.error("Error during payment method request:", error);
            toast({
                position: "top",
                type: "error",
                title: "Tiến hành thanh toán thất bại!",
                description: 'Vui lòng chờ đợi tiệc của bạn đang được xử lý !!',
                closable: true,
            });
        }
    };
    return (
        <>
            <Accordion>
                <AccordionItem
                    key="1"
                    aria-label="Thông tin thanh toán"
                    title={<span className="text-white">Thông tin thanh toán</span>}
                    className='bg-whiteAlpha-200 rounded-lg px-[16px] font-gilroy'
                    isOpen={true}
                >
                    <div className="flex flex-col md:flex-row justify-between p-3">
                        <div className="mb-8 md:mb-0 w-[40%]">
                            <h2 className="font-bold text-lg mb-4">Đặt cọc</h2>
                            <ul className="text-white space-y-2 ">
                                <li>• Tiền cọc: 30% tổng chi phí tiệc (đã tính thuế).</li>
                                <li>
                                    • Quý khách vui lòng kiểm tra thông tin trước khi tiến hành thanh toán
                                    tiền cọc.
                                </li>
                            </ul>
                            {showAlert && (
                                <div className="mt-4 p-4 bg-gray-800 text-white rounded-lg">
                                    <h3 className="font-bold text-lg">{alertTitle}</h3>
                                    <p>{alertContent}</p>
                                </div>
                            )}
                            <div className="mt-4 p-4 bg-gray-800 text-white rounded-lg">
                                <h3 className="font-bold text-lg">Cọc phí:</h3>
                                <div className="text-right">{deposits.toLocaleString()} VND</div>
                                <h3 className="font-bold text-lg mt-2">Tổng phí:</h3>
                                <div className="text-right">{totalamount.toLocaleString()} VND</div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h2 className="font-bold text-lg mb-2">Các khoản chi</h2>
                            <div className="space-y-1">
                                {fees.map((item, index) => (
                                    <div className="flex justify-between" key={index}>
                                        <span>{item.name}</span>
                                        <div className='flex items-start gap-1'>
                                            <span>{item.totalPrice}</span>
                                            <Image
                                                className='cursor-pointer'
                                                src={AlertIcon}
                                                alt='Alert Icon'
                                                objectFit='cover'
                                                onClick={() => handleAlertClick(item.name, item.description)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <h2 className="font-bold text-lg mt-4">Thanh toán</h2>
                            <p className="text-white">Lựa chọn hình thức thanh toán phù hợp</p>
                            <div className="space-y-2">
                                {paymentMethods.map((method, index) => (
                                    <button
                                        key={index}
                                        className={`flex items-center justify-between w-full ${method.bgColor} ${method.textColor} rounded-lg p-3`}
                                        onClick={() => seendDepositId(deposit_Id, method.method)}
                                    >
                                        <div className="w-[50px]">
                                            <Image src={method.src} alt={method.alt} className="object-cover w-[30px]" />
                                        </div>
                                        <span className={method.textColor}>
                                            Thanh toán qua <span className="px-1 font-bold text-ba">{method.label}</span>
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>


                </AccordionItem>
            </Accordion>
            {isModalOpen && (
                <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
                    <div className='bg-white rounded-lg p-6 w-1/3'>
                        {/* <div className='flex justify-end cursor-pointer' onClick={handleCancel}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="black" />
                            </svg>
                        </div> */}
                        <h2 className='text-xl font-bold mb-4 text-success text-center'>Tiến hành thanh toán</h2>
                        <p className='text-black text-center'>Phương thức thanh toán {showPaymentMethod}</p>
                        <div className='flex justify-center mt-4'>
                            <button
                                className='px-4 py-2 bg-gold text-white rounded-md hover:bg-gold/80'
                                onClick={() => nextPay(linkPaymentMethod)}
                            >
                                Tiếp tục thanh toán
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default PaymentMethod;
