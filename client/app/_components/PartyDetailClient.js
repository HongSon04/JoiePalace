'use client'

import Image from 'next/image';
import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import AlertIcon from "@/public/AlertIcon.svg";
import phoneicon from '@/public/phoneicon.svg';
import mailicon from '@/public/mailicon.svg';
import { API_CONFIG } from "@/app/_utils/api.config";
import useApiServices from "@/app/_hooks/useApiServices";
import useCustomToast from "@/app/_hooks/useCustomToast";
import { useRouter } from 'next/navigation';
import 'animate.css';

const PartyDetailClient = ({
  showDetailLink,
  Collapsed,
  nameParty,
  address,
  phoneAddress,
  hostName,
  email,
  phoneUser,
  showFull,
  idParty,
  typeParty,
  partyDate,
  dateOrganization,
  liveOrOnline,
  numberGuest,
  hall,
  session,
  tableNumber,
  spareTables,
  linkTo,
  space, decorate, typeTable, typeChair, guestTable, menu, drinks,
  payerName, paymentMethod, amountPayable, depositAmount, depositStatus, depositDay, remainingPaid, menuCostTable, paymentDay,
  costTable, decorationCost, soundStage, hallRental, tableRental, chairRental, paymentStatus, snack, vat, drinksCost, arise, statusParty,
  reloadPage,
  branch_id,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(Collapsed);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contentCancel, setcontentCancel] = useState('');
  const [button1, setButton1] = useState('Tiếp tục');
  const [button2, setButton2] = useState('Hủy');
  const [clickModule, setClickModule] = useState(1);
  const id = idParty.substring(1);
  const toast = useCustomToast();
  const { makeAuthorizedRequest } = useApiServices();
  const router = useRouter();

  const toggleDetails = useCallback(() => {
    setIsCollapsed(prevState => !prevState);
  }, []);

  const oncLickDelete = (data) => {
    setcontentCancel('Sự thành công của buổi tiệc luôn là niềm vui và là sự ưu tiên của Joie Palace')
    setIsModalOpen(true);
  };

  const handleContinue = (data) => {
    setcontentCancel('Nếu quý khách chỉ muốn thay đổi chi tiết tiệc hoặc thay đổi địa điểm tổ chức. Hãy liên hệ ngay với chúng tôi')
    setButton1('Hủy tiệc');
    setButton2('Liên hệ ngay');
    setClickModule(2);
  };
  const handleLast = (data) => {
    setcontentCancel('Nếu quý khách chỉ muốn thay đổi chi tiết tiệc hoặc thay đổi địa điểm tổ chức. Hãy liên hệ ngay với chúng tôi')
    setButton1('Quay lại');
    setButton2('Hủy tiệc');
    setClickModule(3);
  };

  const handleConfirm = async (id) => {
    setIsModalOpen(true);
    setClickModule(1)
    try {
      const response = await makeAuthorizedRequest(
        API_CONFIG.BOOKINGS.DELETE(id),
        "DELETE",
        '',
        null,
        '/client/dang-nhap'
      );

      if (response?.success) {
        setIsModalOpen(false);
        toast({
          position: "top",
          type: "success",
          title: "Xóa thành công!",
          description: 'Cảm ơn bạn đã quan tâm chúng tôi.',
          closable: true,
        });
        reloadPage(true);
      } else {
        toast({
          position: "top",
          type: "error",
          title: "Cập nhật thất bại!",
          description: response?.error?.message || "Vui lòng thử lại sau.",
          closable: true,
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsModalOpen(false);
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const clickfeedback = () => {
    router.push(`/client/form-danh-gia-gop-y/${branch_id}/${id}`);
  }

  const PopupCancel = ({ content, button1, button2, clickButton1, clickButton2 }) => {
    return (
      <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 '>
        <div className='bg-white rounded-lg p-6 w-1/3 animate__animated animate__bounce'>
          <h2 className='text-lg font-bold mb-4 text-warning-500'>!!! Quý khách có chắc với quyết định hủy tiệc của mình?</h2>
          <p className='text-black'>{content}</p>
          <div className='flex justify-end mt-4'>
            <button
              onClick={clickButton1}
              className='mr-2 px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400'
            >
              {button1}
            </button>
            <button
              onClick={clickButton2}
              className='px-4 py-2 bg-gold text-white rounded-md hover:bg-gold/80'
            >
              {button2}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'text-green-500';
      case 'processing':
        return 'text-yellow-300';
      case 'cancel':
        return 'text-red-300';
      case 'pending':
        return 'text-yellow-300';
      default:
        return 'text-gray-500';
    }
  };
  const getStatustext = (status) => {
    switch (status) {
      case 'success':
        return 'Hoàn thành';
      case 'processing':
        return 'Đang chờ xử lý';
      case 'cancel':
        return 'Hủy';
      case 'pending':
        return 'Đang chờ';
      default:
        return 'Đã có trang thái';
    }
  };

  return (
    <div className='flex flex-col w-full gap-5'>
      {/* Header Section */}
      <header className='flex justify-between'>
        <div className='flex flex-col gap-3'>
          <div className='flex gap-3'>
            <div className='h-full w-2 bg-gold' />
            <span className='text-base font-medium leading-normal'>{nameParty}</span>
          </div>
          <div className={`${getStatusColor(statusParty)}`}>{getStatustext(statusParty)}</div>
        </div>
        <div className='flex gap-5 items-center'>
          {showDetailLink && (
            <>
              {statusParty === 'success' ? (
                <div className='underline text-gold text-xs font-medium cursor-pointer'
                  onClick={clickfeedback}>
                  Gửi đánh giá
                </div>
              ) : statusParty === 'pending' ? (
                <div className='underline text-red-500 text-xs font-medium cursor-pointer'
                  onClick={oncLickDelete}
                >
                  Hủy
                </div>
              ) : ''}
              <Link href={linkTo} className='underline text-gold text-xs font-medium cursor-pointer'>
                Chi tiết
              </Link>
            </>
          )}
          {Collapsed && (
            <span className='flex items-center text-[#93A2B7] text-xs font-medium cursor-pointer' onClick={toggleDetails}>
              {isCollapsed ? 'Mở rộng' : 'Thu gọn'}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 17" fill="none">
                <path
                  d={
                    isCollapsed
                      ? "M12 6.97003L11.06 6.03003L8 9.08336L4.94 6.03003L4 6.97003L8 10.97L12 6.97003Z"
                      : "M4 11.0303L4.94 11.9703L8 8.91669L11.06 11.9703L12 11.0303L8 7.0303L4 11.0303Z"
                  }
                  fill="#9BA2AE"
                />
              </svg>
            </span>
          )}
        </div>
      </header>

      {/* Party Image and Details Section */}
      <div className='flex flex-col lg:flex-row gap-8'>
        {!isCollapsed && (
          <div className='flex flex-col lg:flex-row gap-8 w-full'>
            <div className='flex flex-col max-w-full lg:max-w-[500px] gap-5'>
              <div className='relative h-52 w-full'>
                <Image
                  src="/auth_background.jpg"
                  alt="info-state"
                  layout="fill"
                  objectFit="cover"
                  priority
                />
              </div>
              <span className='text-base font-medium leading-normal'>{nameParty}</span>
              <span className='text-base font-medium leading-normal'>{address}</span>
              <div className='flex flex-col gap-[14px]'>
                {/* Contact Information */}
                {[{ icon: phoneicon, text: phoneAddress }, { icon: mailicon, text: email }].map(({ icon, text }, idx) => (
                  <ContactInfo key={idx} icon={icon} text={text} />
                ))}
              </div>
            </div>

            {/* Party Details */}
            <div className={`transition-all duration-300 ease-in-out ${isCollapsed ? 'max-h-0 overflow-hidden' : 'max-h-screen'}`}>
              <PartyDetails
                idParty={idParty}
                typeParty={typeParty}
                partyDate={partyDate}
                dateOrganization={dateOrganization}
                liveOrOnline={liveOrOnline}
                numberGuest={numberGuest}
                hall={hall}
                session={session}
                tableNumber={tableNumber}
                spareTables={spareTables}
              />
            </div>
          </div>
        )}
      </div>

      {/* Customer Information */}
      {!showFull && !isCollapsed && <CustomerInfo title="Thông tin khách hàng" hostName={hostName} email={email} phoneUser={phoneUser} />}
      {!isCollapsed && <div className="w-full h-[1px] bg-whiteAlpha-300"></div>}

      {showFull && (
        <div className='flex flex-col gap-[60px]'>
          <CustomerInfo title="Thông tin khách hàng" hostName={hostName} email={email} phoneUser={phoneUser} />
          <CustomerOrganizationalInformation
            title="Thông tin tổ chức"
            space={space}
            decorate={decorate}
            typeTable={typeTable}
            typeChair={typeChair}
            guestTable={guestTable}
            menu={menu}
            drinks={drinks}
          />
          <CustomerInfoPayment
            title="Thông tin thanh toán"
            payerName={payerName}
            paymentMethod={paymentMethod}
            amountPayable={amountPayable}
            depositAmount={depositAmount}
            depositStatus={depositStatus}
            depositDay={depositDay}
            remainingPaid={remainingPaid}
            menuCostTable={menuCostTable}
            paymentDay={paymentDay}
          />
          <CustomerInfoDetailPayment
            title="Thông tin chi tiết thanh toán"
            costTable={costTable}
            decorationCost={decorationCost}
            soundStage={soundStage}
            hallRental={hallRental}
            tableRental={tableRental}
            chairRental={chairRental}
            paymentStatus={paymentStatus}
            snack={snack}
            vat={vat}
            drinksCost={drinksCost}
            arise={arise}
          />
        </div>
      )}
      {isModalOpen && (
        <PopupCancel
          content={contentCancel}
          button1={button1}
          button2={button2}
          clickButton1={clickModule === 1 ? handleContinue : clickModule === 2 ? handleLast : handleCancel}   //handleLast
          clickButton2={clickModule === 1 ? handleCancel : clickModule === 2 ? handleContinue : clickModule === 3 ? () => handleConfirm(id) : null}
        />
      )}
    </div>
  );
};

const ContactInfo = ({ icon, text }) => (
  <div className='flex gap-2 items-center'>
    <Image src={icon} alt={'icon'} objectFit='cover' width={24} height={24} />
    <span className='text-base font-normal leading-normal text-gray-400'>{text}</span>
  </div>
);
const TitleInfo = ({ title, info, textColor = 'text-gray-400' }) => (
  <div className="flex flex-col gap-2">
    <span className='text-base text-white'>{title}:</span>
    <span className={`${textColor} text-base `}>{info}</span>
  </div>
)
const PartyDetails = ({
  idParty,
  typeParty,
  partyDate,
  dateOrganization,
  liveOrOnline,
  numberGuest,
  hall,
  session,
  tableNumber,
  spareTables,
}) => (
  <div className='flex flex-col gap-[23px] w-full'>
    {[
      { label: 'ID tiệc:', value: idParty },
      { label: 'Loại tiệc:', value: typeParty },
      { label: 'Ngày đặt tiệc:', value: partyDate },
      { label: 'Ngày tổ chức:', value: dateOrganization },
      { label: 'Trực tiếp / Trực tuyến:', value: liveOrOnline },
      { label: 'Số lượng khách:', value: numberGuest },
      { label: 'Sảnh:', value: hall },
      { label: 'Buổi:', value: session },
      { label: 'Số lượng bàn chính thức:', value: tableNumber },
      { label: 'Số lượng bàn dự phòng:', value: spareTables },
    ].map((item, index) => (
      <div className='flex gap-[10px]' key={index}>
        <span className='text-base font-normal text-white'>{item.label}</span>
        <span className='text-base text-gray-400'>{item.value}</span>
      </div>
    ))}
  </div>
);

const CustomerInfo = ({ title, hostName, email, phoneUser }) => (
  <div className="flex flex-col gap-[20px]">
    <div className='flex gap-3'>
      <div className='h-6 w-2 bg-gold'></div>
      <span className='text-base font-medium leading-normal'>{title}</span>
    </div>
    <div className="grid grid-cols-3 gap-[60px] text-base font-normal text-gray-400">
      <TitleInfo title={'Tên chủ tiệc'} info={hostName} />
      <TitleInfo title={'Email'} info={email} />
      <TitleInfo title={'Số điện thoại'} info={phoneUser} />
    </div>
  </div>
);

const CustomerOrganizationalInformation = ({ title, space, decorate, typeTable, typeChair, guestTable, menu, drinks }) => (
  <div className="flex flex-col gap-[20px]">
    <div className='flex gap-3'>
      <div className='h-6 w-2 bg-gold'></div>
      <span className='text-base font-medium leading-normal'>{title}</span>
    </div>
    <div className="grid grid-cols-3 gap-[60px] text-base font-normal text-gray-400">
      <TitleInfo title={'Không gian'} info={space} />
      <TitleInfo title={'Trang trí'} info={decorate} />
      <TitleInfo title={'Loại bàn'} info={typeTable} />
      <TitleInfo title={'Loại ghế'} info={typeChair} />
      <TitleInfo title={'Lượng khách / bàn'} info={guestTable} />
      <TitleInfo title={'Menu'} info={menu} />
      <TitleInfo title={'Đồ uống'} info={drinks} />
    </div>
  </div>
);

const CustomerInfoPayment = ({ title, payerName, paymentMethod, amountPayable, depositAmount, depositStatus, depositDay, remainingPaid, menuCostTable, paymentDay }) => (
  <div className="flex flex-col gap-4">
    <div className='flex gap-3'>
      <div className='h-6 w-2 bg-gold'></div>
      <span className='text-base font-medium leading-normal'>{title}</span>
    </div>
    <div className="grid grid-cols-3 gap-[60px] text-base font-normal text-gray-400">
      <TitleInfo title={'Tên người thanh toán'} info={payerName} />
      <TitleInfo title={'Hình thức thanh toán'} info={paymentMethod} />
      <TitleInfo title={'Tổng số tiền'} info={amountPayable} />
      <TitleInfo title={'Số tiền đặt cọc (30%)'} info={depositAmount} />
      <TitleInfo title={'Trạng thái đặt cọc'} info={depositStatus} textColor='text-cyan-400' />
      <TitleInfo title={'Ngày đặt cọc'} info={depositDay} />
      <TitleInfo title={'Còn lại phải thanh toán'} info={remainingPaid} />
      <TitleInfo title={'Trạng thái thanh toán'} info={menuCostTable} textColor='text-cyan-400' />
      <TitleInfo title={'Ngày thanh toán'} info={paymentDay} />
    </div>
  </div>
);
const CustomerInfoDetailPayment = ({ title, costTable, decorationCost, soundStage, hallRental, tableRental, chairRental, paymentStatus, snack, vat, drinksCost, arise }) => (
  <div className="flex flex-col gap-[20px]">
    <div className='flex gap-3'>
      <div className='h-6 w-2 bg-gold'></div>
      <span className='text-base font-medium leading-normal'>{title}</span>
    </div>
    <div className='flex flex-col gap-[60px]'>
      <div className="grid grid-cols-3 gap-[60px] text-base font-normal text-gray-400">
        <div className='flex gap-[10px] items-center'>
          <TitleInfo title={'Chi phí / bàn'} info={costTable} />
          <Image src={AlertIcon} alt='AlertIcon' objectFit='cover'></Image>

        </div>
        <TitleInfo title={'Chi phí trang trí'} info={decorationCost} />
        <TitleInfo title={'Âm thanh & Sân khấu'} info={soundStage} />
        <TitleInfo title={'Chi phí thuê sảnh'} info={hallRental} />
        <TitleInfo title={'Chi phí thuê bàn'} info={tableRental} />
        <TitleInfo title={'Chi phí thuê ghế'} info={chairRental} />
        <TitleInfo title={'Chi phí thực đơn / bàn'} info={paymentStatus} />
        <TitleInfo title={'Bữa ăn nhẹ'} info={snack} />
        <TitleInfo title={'VAT'} info={vat} />
      </div>
      <div className='grid grid-cols-2 gap-[60px] w-full'>
        <TitleInfo title={'Chi phí đồ uống'} info={drinksCost} />
        <TitleInfo title={'Phát sinh'} info={arise} />
      </div>

    </div>
  </div>
);

PartyDetailClient.propTypes = {
  nameParty: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  phoneAddress: PropTypes.string.isRequired,
  hostName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  phoneUser: PropTypes.string.isRequired,
  idParty: PropTypes.string.isRequired,
  typeParty: PropTypes.string.isRequired,
  partyDate: PropTypes.string.isRequired,
  dateOrganization: PropTypes.string.isRequired,
  liveOrOnline: PropTypes.string.isRequired,
  numberGuest: PropTypes.number.isRequired,
  hall: PropTypes.string.isRequired,
  session: PropTypes.string.isRequired,
  tableNumber: PropTypes.number.isRequired,
  spareTables: PropTypes.number.isRequired,
  linkTo: PropTypes.string.isRequired,
  showFull: PropTypes.bool,
  showDetailLink: PropTypes.bool,
  Collapsed: PropTypes.bool,
  space: PropTypes.string,
  decorate: PropTypes.string,
  typeTable: PropTypes.string,
  typeChair: PropTypes.string,
  guestTable: PropTypes.string,
  menu: PropTypes.string,
  drinks: PropTypes.string,
  payerName: PropTypes.string,
  paymentMethod: PropTypes.string,
  amountPayable: PropTypes.string,
  depositAmount: PropTypes.string,
  depositStatus: PropTypes.string,
  depositDay: PropTypes.string,
  remainingPaid: PropTypes.string,
  menuCostTable: PropTypes.string,
  paymentDay: PropTypes.string,
  payerName: PropTypes.string,
  paymentMethod: PropTypes.string,
  amountPayable: PropTypes.string,
  depositAmount: PropTypes.string,
  depositStatus: PropTypes.string,
  depositDay: PropTypes.string,
  remainingPaid: PropTypes.string,
  menuCostTable: PropTypes.string,
  paymentDay: PropTypes.string,
  costTable: PropTypes.string,

};

export default PartyDetailClient;