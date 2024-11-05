import FormInput from "@/app/_components/FormInput";
import "@/app/_styles/datePicker.css";
import {
  ArrowLeftIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserGroupIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";
import { Col, Row } from "antd";
import { useForm } from "react-hook-form";

import useApiServices from "@/app/_hooks/useApiServices";
import useCustomToast from "@/app/_hooks/useCustomToast";
import {
  fetchingRequestFailure,
  fetchingSelectedRequest,
  fetchingSelectedRequestFailure,
  fetchingSelectedRequestSuccess,
  updatingRequest,
  updatingRequestSuccess,
} from "@/app/_lib/features/requests/requestsSlice";
import { API_CONFIG } from "@/app/_utils/api.config";
import { partyTypes } from "@/app/_utils/config";
import Loading from "@/app/admin/loading";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import {
  fetchingPartyTypesFailure,
  fetchingPartyTypesSuccess,
} from "@/app/_lib/features/partyTypes/partyTypesSlice";
import { usePathname, useRouter } from "next/navigation";

const schema = z.object({
  status: z.string().nonempty("Vui lòng chọn trạng thái"),
});

function RequestDetail({ id }) {
  const {
    selectedRequest,
    isFetchingSelectedRequest,
    isFetchingSelectedRequestError,
  } = useSelector((store) => store.requests);
  const { partyTypes, isFetchingPartyTypes, isFetchingPartyTypesError } =
    useSelector((store) => store.partyTypes);
  const dispatch = useDispatch();
  const { makeAuthorizedRequest } = useApiServices();
  const router = useRouter();
  const pathname = usePathname();
  const backPath = pathname.split("/").slice(0, -1).join("/");
  const [status, setStatus] = React.useState(
    (selectedRequest && selectedRequest.status) || "pending"
  );
  const [hasChange, setHasChange] = React.useState(false);

  React.useEffect(() => {
    if (!selectedRequest) return;

    if (selectedRequest && status !== selectedRequest.status) {
      setHasChange(true);
    }
  }, [status, setHasChange, selectedRequest]);

  const handleBack = () => {
    router.push(backPath);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  // console.log(pathname);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const toast = useCustomToast();

  const fetchSelectedRequest = React.useCallback(async () => {
    dispatch(fetchingSelectedRequest());

    const data = await makeAuthorizedRequest(
      API_CONFIG.BOOKINGS.GET_BY_ID(id),
      "GET"
    );

    if (data.success) {
      dispatch(fetchingSelectedRequestSuccess(data.data.at(0)));

      await fetchPartyType(data.data.at(0).party_type_id);
    } else {
      dispatch(fetchingSelectedRequestFailure(data));
    }
  }, []);

  const fetchPartyType = React.useCallback(async (id) => {
    const data = await makeAuthorizedRequest(
      API_CONFIG.PARTY_TYPES.GET_BY_ID(id),
      "GET"
    );

    if (data.success) {
      dispatch(fetchingPartyTypesSuccess(data.data.at(0)));
    } else {
      dispatch(fetchingPartyTypesFailure(data));
    }
  }, []);

  const handleUpdateStatus = React.useCallback(async () => {
    // if (!hasChange) {
    //   toast({
    //     title: "Trạng thái không thay đổi",
    //     description: "Vui lòng chọn trạng thái khác để cập nhật",
    //     type: "warning",
    //   });
    // } else {
    const confirm = window.confirm(
      `Bạn có chắc chắn muốn cập nhật trạng thái yêu cầu #${id}?`
    );

    if (!confirm) return;

    if (confirm) {
      dispatch(updatingRequest());

      const data = await makeAuthorizedRequest(
        API_CONFIG.BOOKINGS.UPDATE_STATUS(selectedRequest.id),
        "PATCH",
        {
          is_confirm: true,
          is_deposit: false,
          status: "processing",
        }
      );

      if (data.success) {
        toast({
          title: "Cập nhật trạng thái thành công",
          description: "Yêu cầu đã được xử lý",
          type: "success",
        });

        dispatch(updatingRequestSuccess());

        router.push(backPath);
      } else {
        toast({
          title: "Cập nhật trạng thái thất bại",
          description: "Yêu cầu chưa được cập nhật",
          type: "error",
        });
        dispatch(fetchingRequestFailure());
      }
    }
    // }
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      await fetchSelectedRequest();
    };

    fetchData();

    return () => {};
  }, []);

  const onSubmit = async (data) => {
    await handleUpdateStatus();
  };

  if (isFetchingSelectedRequest) {
    return <Loading />;
  }

  return (
    <form className="mt-8">
      {isFetchingSelectedRequest && <Loading />}
      {selectedRequest && !isFetchingSelectedRequest && (
        <>
          <div className="flex justify-end">
            <label className="flex gap-2 items-center mb-5">
              <p className="text-medium text-gray-400">
                Trạng thái của yêu cầu:{" "}
              </p>
              <select
                value={status}
                onChange={handleStatusChange}
                className="select"
              >
                <option className="option" value="pending">
                  Chờ xử lý
                </option>
                <option className="option" value="processing">
                  Đang xử lý
                </option>
                <option className="option" value="cancel">
                  Hủy bỏ
                </option>
              </select>
            </label>
          </div>
          <section className="bg-whiteAlpha-100 rounded-xl p-4 flex flex-col gap-5">
            <h2 className="text-xl leading-7 font-semibold text-white">
              Thông tin liên hệ
            </h2>
            <Row gutter={[20, 20]} className="w-full">
              <Col span={8}>
                <FormInput
                  register={register}
                  errors={errors}
                  theme="light"
                  type={"text"}
                  name={"name"}
                  id={"name"}
                  ariaLabel={"name"}
                  label="Chủ tiệc"
                  value={selectedRequest.name}
                  readOnly
                  startContent={<UserIcon className="w-5 h-5 text-white" />}
                  wrapperClassName="!mt-0"
                  OnChange={() => {}}
                ></FormInput>
              </Col>
              <Col span={8}>
                <FormInput
                  register={register}
                  errors={errors}
                  type={"text"}
                  name={"phone"}
                  id={"phone"}
                  ariaLabel={"Số điện thoại"}
                  label="Số điện thoại"
                  readOnly
                  value={selectedRequest.phone}
                  startContent={<PhoneIcon className="w-5 h-5 text-white" />}
                  wrapperClassName="!mt-0"
                  OnChange={() => {}}
                ></FormInput>
              </Col>
              <Col span={8}>
                <FormInput
                  id={"email"}
                  register={register}
                  errors={errors}
                  type={"email"}
                  ariaLabel={"Email"}
                  name={"email"}
                  label="Email"
                  value={selectedRequest.email}
                  readOnly
                  startContent={<EnvelopeIcon className="w-5 h-5 text-white" />}
                  wrapperClassName="!mt-0"
                  OnChange={() => {}}
                ></FormInput>
              </Col>
            </Row>
          </section>
          <section className="bg-whiteAlpha-100 rounded-xl p-4 flex flex-col gap-5 mt-5">
            <h2 className="text-xl leading-7 font-semibold text-white">
              Thông tin tổ chức
            </h2>
            <Row gutter={[20, 20]} className="w-full">
              <Col span={8}>
                <FormInput
                  theme={"light"}
                  className="bg-whiteAlpha-100 hover:bg-whiteAlpha-200 focus:bg-whiteAlpha-200 !text-white !placeholder:text-gray-400"
                  name={"partyType"}
                  id={"partyType"}
                  register={register}
                  errors={errors}
                  ariaLabel={"Loại tiệc"}
                  label="Loại tiệc"
                  value={partyTypes.name}
                  wrapperClassName="!mt-0"
                  OnChange={() => {}}
                ></FormInput>
                {/* <div className="flex flex-col">
                  <h2 className="!text-white font-bold mb-3">Loại tiệc</h2>
                  <select
                    name="partyType"
                    id="partyType"
                    value={partyTypes[0].label}
                    className="select w-full h-[40px] overflow-hidden"
                    readOnly
                  >
                    {partyTypes.map((type) => (
                      <option
                        value={type.key}
                        key={type.key}
                        className="option"
                      >
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div> */}
              </Col>
              <Col span={8}>
                <FormInput
                  theme={"light"}
                  className="bg-whiteAlpha-100 hover:bg-whiteAlpha-200 focus:bg-whiteAlpha-200 !text-white !placeholder:text-gray-400"
                  id={"mainTable"}
                  register={register}
                  errors={errors}
                  name={"mainTable"}
                  label="Số lượng bàn chính thức"
                  value={selectedRequest.number_of_guests / 10}
                  readOnly
                  wrapperClassName="!mt-0"
                  OnChange={() => {}}
                ></FormInput>
              </Col>
              <Col span={8}>
                <FormInput
                  theme={"light"}
                  className="bg-whiteAlpha-100 hover:bg-whiteAlpha-200 focus:bg-whiteAlpha-200 !text-white !placeholder:text-gray-400"
                  name={"subTable"}
                  id={"subTable"}
                  register={register}
                  errors={errors}
                  ariaLabel={"Số lượng bàn dự phòng"}
                  label="Số lượng bàn dự phòng"
                  readOnly
                  wrapperClassName="!mt-0"
                  OnChange={() => {}}
                ></FormInput>
              </Col>
              <Col span={8}>
                <FormInput
                  theme={"light"}
                  className="bg-whiteAlpha-100 hover:bg-whiteAlpha-200 focus:bg-whiteAlpha-200 !text-white !placeholder:text-gray-400"
                  id={"number_of_guests"}
                  register={register}
                  errors={errors}
                  ariaLabel={"Số lượng khách dự kiến"}
                  name={"number_of_guests"}
                  label="Số lượng khách dự kiến"
                  value={selectedRequest.number_of_guests}
                  readOnly
                  wrapperClassName="!mt-0"
                  OnChange={() => {}}
                ></FormInput>
              </Col>
              <Col span={8} className="flex flex-col">
                <FormInput
                  theme={"light"}
                  className="bg-whiteAlpha-100 hover:bg-whiteAlpha-200 focus:bg-whiteAlpha-200 !text-white !placeholder:text-gray-400"
                  register={register}
                  errors={errors}
                  id={"created_at"}
                  name={"created_at"}
                  inputType="date"
                  label="Ngày đặt tiệc"
                  ariaLabel="Ngày đặt tiệc"
                  value={format(
                    new Date(selectedRequest.created_at),
                    "dd/MM/yyyy, hh:mm a"
                  )}
                  readOnly
                  wrapperClassName="!mt-0"
                  OnChange={() => {}}
                />
              </Col>
              <Col span={8} className="flex flex-col">
                <FormInput
                  theme={"light"}
                  className="bg-whiteAlpha-100 hover:bg-whiteAlpha-200 focus:bg-whiteAlpha-200 !text-white !placeholder:text-gray-400"
                  register={register}
                  errors={errors}
                  id={"organization_date"}
                  name={"organization_date"}
                  inputType="date"
                  label="Ngày tổ chức"
                  ariaLabel="Ngày tổ chức"
                  value={format(
                    new Date(selectedRequest.organization_date),
                    "dd/MM/yyyy, hh:mm a"
                  )}
                  readOnly
                  wrapperClassName="!mt-0"
                  OnChange={() => {}}
                />
              </Col>
            </Row>
          </section>
          <div className="flex justify-end mt-8 gap-5">
            <Button
              onClick={handleBack}
              className="leading-7 bg-whiteAlpha-100 text-white"
              startContent={<ArrowLeftIcon className="w-5 h-5" />}
            >
              Quay lại
            </Button>
            <Button
              onClick={handleUpdateStatus}
              className="bg-teal-400 text-white leading-7"
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
              Cập nhật trạng thái
            </Button>
          </div>
        </>
      )}
    </form>
  );
}

export default RequestDetail;
