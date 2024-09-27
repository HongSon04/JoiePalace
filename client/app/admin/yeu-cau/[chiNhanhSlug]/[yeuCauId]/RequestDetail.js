import CustomInput from "@/app/_components/CustomInput";
import "@/app/_styles/datePicker.css";
import {
  EnvelopeIcon,
  PhoneIcon,
  UserGroupIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";
import { Col, Row } from "antd";
import { FormProvider, useForm } from "react-hook-form";
import SelectPartyType from "./SelectPartyType";

import { _require } from "@/app/_utils/validations";
import { partyTypes } from "@/app/_utils/config";

function RequestDetail() {
  const request = {
    id: 1,
    name: "Nguyễn Văn A",
    phone: "0123456789",
    email: "a@gmail.com",
    address: "123 Nguyễn Văn A, Phường 1, Quận 1, TP.HCM",
    event: {
      type: "wedding",
      time: "12:00",
      guests: 300,
      budget: 10000000,
      note: "Ghi chú",
      mainTable: 30,
      subTable: 10,
      createdAt: "2021-10-10T00:00:00Z",
      orgDate: "2021-10-22T00:00:00Z",
    },
  };

  const methods = useForm();

  const onSubmit = methods.handleSubmit((data) => {
    console.log(data);
  });

  return (
    <FormProvider {...methods}>
      <form className="mt-8" onSubmit={(e) => e.preventDefault()} noValidate>
        <section className="bg-whiteAlpha-100 rounded-xl p-4 flex flex-col gap-5">
          <h2 className="text-xl leading-7 font-semibold text-white">
            Thông tin liên hệ
          </h2>
          <Row gutter={[20, 20]} className="w-full">
            <Col span={8}>
              <CustomInput
                name={"name"}
                label="Chủ tiệc"
                value={request.name}
                validation={{ ..._require }}
              >
                <UserIcon className="w-6 h-6 text-white" />
              </CustomInput>
            </Col>
            <Col span={8}>
              <CustomInput
                name={"phone"}
                label="Số điện thoại"
                value={request.phone}
              >
                <PhoneIcon className="w-6 h-6 text-white" />
              </CustomInput>
            </Col>
            <Col span={8}>
              <CustomInput name={"email"} label="Email" value={request.email}>
                <EnvelopeIcon className="w-6 h-6 text-white" />
              </CustomInput>
            </Col>
          </Row>
        </section>
        <section className="bg-whiteAlpha-100 rounded-xl p-4 flex flex-col gap-5 mt-5">
          <h2 className="text-xl leading-7 font-semibold text-white">
            Thông tin tổ chức
          </h2>
          <Row gutter={[20, 20]} className="w-full">
            <Col span={8}>
              <div className="flex flex-col">
                <h2 className="!text-white font-bold mb-3">Loại tiệc</h2>
                <select
                  name="partyType"
                  id="partyType"
                  value={partyTypes[0].label}
                  className="select w-full h-[40px] overflow-hidden"
                >
                  {partyTypes.map((type) => (
                    <option value={type.key} key={type.key} className="option">
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </Col>
            <Col span={8}>
              <CustomInput
                name={"mainTable"}
                label="Số lượng bàn chính thức"
                value={request.event.mainTable}
                className={"text-white"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M21.9601 9.73L20.5301 4.73C20.4101 4.3 20.0201 4 19.5701 4H4.43009C3.98009 4 3.59009 4.3 3.47009 4.73L2.04009 9.73C1.86009 10.36 2.34009 11 3.00009 11H5.20009L4.00009 20H6.00009L6.67009 15H17.3401L18.0001 20H20.0001L18.8001 11H21.0001C21.6601 11 22.1401 10.36 21.9601 9.73ZM6.93009 13L7.20009 11H16.8001L17.0701 13H6.93009Z"
                    fill="#fff"
                    fillOpacity="0.3"
                  />
                </svg>
              </CustomInput>
            </Col>
            <Col span={8}>
              <CustomInput
                name={"subTable"}
                label="Số lượng bàn dự phòng"
                value={request.event.subTable}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M21.9601 9.73L20.5301 4.73C20.4101 4.3 20.0201 4 19.5701 4H4.43009C3.98009 4 3.59009 4.3 3.47009 4.73L2.04009 9.73C1.86009 10.36 2.34009 11 3.00009 11H5.20009L4.00009 20H6.00009L6.67009 15H17.3401L18.0001 20H20.0001L18.8001 11H21.0001C21.6601 11 22.1401 10.36 21.9601 9.73ZM6.93009 13L7.20009 11H16.8001L17.0701 13H6.93009ZM4.33009 9L5.19009 6H18.8201L19.6801 9H4.33009Z"
                    fill="#fff"
                    fillOpacity="0.36"
                  />
                </svg>
              </CustomInput>
            </Col>
            <Col span={8}>
              <CustomInput
                name={"guests"}
                label="Số lượng khách dự kiến"
                value={request.event.guests}
              >
                <UserGroupIcon className="w-6 h-6 text-white" />
              </CustomInput>
            </Col>
            <Col span={8} className="flex flex-col">
              <CustomInput
                name={"createdAt"}
                inputType="date"
                label="Ngày đặt tiệc"
                value={request.event.createdAt}
                classNames={{
                  input: "!bg-blackAlpha-100",
                  inputWrapper: "!bg-blackAlpha-100 text-white",
                }}
              />
            </Col>
            <Col span={8} className="flex flex-col">
              <CustomInput
                name={"orgDate"}
                inputType="date"
                label="Ngày tổ chức"
                value={request.event.orgDate}
                classNames={{
                  input: "!bg-blackAlpha-100",
                  inputWrapper: "!bg-blackAlpha-100 text-white",
                }}
              />
            </Col>
          </Row>
        </section>
        <div className="flex justify-end mt-8 gap-5">
          <Button
            className="leading-7 font-semibold bg-red-400 text-white"
            startContent={<XMarkIcon className="w-6 h-6" />}
          >
            Hủy
          </Button>
          <Button
            onClick={onSubmit}
            className="bg-teal-400 text-white leading-7 font-semibold"
            startContent={
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.33398 2.66671C3.15717 2.66671 2.9876 2.73695 2.86258 2.86197C2.73756 2.98699 2.66732 3.15656 2.66732 3.33337V12.6667C2.66732 12.8435 2.73756 13.0131 2.86258 13.1381C2.9876 13.2631 3.15717 13.3334 3.33398 13.3334H12.6673C12.8441 13.3334 13.0137 13.2631 13.1387 13.1381C13.2637 13.0131 13.334 12.8435 13.334 12.6667V5.60952L10.3912 2.66671H3.33398ZM1.91977 1.91916C2.29484 1.54409 2.80355 1.33337 3.33398 1.33337H10.6673C10.8441 1.33337 11.0137 1.40361 11.1387 1.52864L14.4721 4.86197C14.5971 4.98699 14.6673 5.15656 14.6673 5.33337V12.6667C14.6673 13.1971 14.4566 13.7058 14.0815 14.0809C13.7065 14.456 13.1978 14.6667 12.6673 14.6667H3.33398C2.80355 14.6667 2.29484 14.456 1.91977 14.0809C1.5447 13.7058 1.33398 13.1971 1.33398 12.6667V3.33337C1.33398 2.80294 1.5447 2.29423 1.91977 1.91916Z"
                  fill="#F7F5F2"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4 8.66667C4 8.29848 4.29848 8 4.66667 8H11.3333C11.7015 8 12 8.29848 12 8.66667V14C12 14.3682 11.7015 14.6667 11.3333 14.6667C10.9651 14.6667 10.6667 14.3682 10.6667 14V9.33333H5.33333V14C5.33333 14.3682 5.03486 14.6667 4.66667 14.6667C4.29848 14.6667 4 14.3682 4 14V8.66667Z"
                  fill="#F7F5F2"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.66667 1.33337C5.03486 1.33337 5.33333 1.63185 5.33333 2.00004V4.66671H10C10.3682 4.66671 10.6667 4.96518 10.6667 5.33337C10.6667 5.70156 10.3682 6.00004 10 6.00004H4.66667C4.29848 6.00004 4 5.70156 4 5.33337V2.00004C4 1.63185 4.29848 1.33337 4.66667 1.33337Z"
                  fill="#F7F5F2"
                />
              </svg>
            }
          >
            Cập nhật
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}

export default RequestDetail;
