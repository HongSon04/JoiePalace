"use client";

import FormInput from "@/app/_components/FormInput";
import {
  fetchingPartyTypesFailure,
  fetchingPartyTypesSuccess,
  getPartyTypes,
} from "@/app/_lib/features/partyTypes/partyTypesSlice";
import { fecthAllPartyTypes } from "@/app/_services/partyTypesServices";
import Loading from "@/app/loading";
import { zodResolver } from "@hookform/resolvers/zod";
import { Col, Row } from "antd";
import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import pattern from "@/public/line-group.svg";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

const partySizes = [
  {
    id: "50",
    name: "Dưới 50 khách",
  },
  {
    id: "50-100",
    name: "50 - 100 khách",
  },
  {
    id: "100-200",
    name: "100 - 200 khách",
  },
  {
    id: "200-500",
    name: "200 - 500 khách",
  },
  {
    id: ">500",
    name: "Trên 500 khách",
  },
];

const budgets = [
  {
    id: "50-100",
    name: "50 triệu - 100 triệu",
  },
  {
    id: "100-300",
    name: "Trên 100 triệu - 300 triệu",
  },
  {
    id: "300-500",
    name: "Trên 300 triệu - 500 triệu",
  },
  {
    id: "500-1000",
    name: "Trên 500 triệu -  1 tỷ",
  },
  {
    id: "1000",
    name: "Trên 1 tỷ",
  },
];

const schema = z.object({
  partyType: z.string().nonempty("Vui lòng chọn loại tiệc"),
  partySize: z.string().nonempty("Vui lòng chọn số lượng khách"),
  budget: z.string().nonempty("Vui lòng chọn mức dự chi"),
});

function Page() {
  const [partySize, setPartySize] = React.useState("");
  const [budget, setBudget] = React.useState("");
  const [partyType, setPartyType] = React.useState("");

  const { partyTypes, isFetchingPartyTypes, isFetchingPartyTypesError } =
    useSelector((store) => store.partyTypes);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fecthAllPartyTypes();
        dispatch(fetchingPartyTypesSuccess(data));
      } catch (error) {
        console.log(error);
        dispatch(fetchingPartyTypesFailure());
      }
    };

    fetchData();

    return () => {};
  }, [dispatch]);

  if (isFetchingPartyTypes) {
    return <Loading></Loading>;
  }

  return (
    <>
      {/* HERO SECTION */}
      <section className="translate-y-28 px-48 py-16 relative">
        <Image
          src={pattern}
          alt="joie palace pattern"
          className="absolute left-0 top-1/2 -translate-y-1/2"
        />
        <Row gutter={[20, 20]}>
          <Col span={12}>
            <h1 className="text-5xl text-gold font-gilroy font-semibold uppercase leading-normal">
              CÔNG CỤ TẠO COMBO <br /> VÀ DỰ CHI
            </h1>
            <p className="text-base leading-normal mt-4">
              Nắm bắt được tâm lý khách hàng, với tiêu chí “Tiện lợi- Nhanh gọn
              - Rõ ràng”, Joie Palace giới thiệu bộ công cụ tạo tiệc và dự chi
              hoàn toàn mới. Với mục tiêu mang đến cái nhìn tổng quát về những
              chi tiết, những thành phần cần thiết để tạo nên một bữa tiệc đang
              nhớ và thành công, chúng tôi ở đây để giúp bạn lựa chọn được những
              dịch vụ phù hợp với nhu cầu, cũng như đưa ra được con số hoàn hảo
              nhất, vừa vặn với tầm dự chi của bạn.
            </p>
          </Col>
          <Col span={12} className="flex justify-end">
            <form action="#" className="w-[400px]">
              {partyTypes && (
                <FormInput
                  register={register}
                  errors={errors}
                  errorMessage={errors?.name?.message}
                  wrapperClassName="!mt-0"
                  theme="dark"
                  label="Quý khách dự định tổ chức tiệc..."
                  ariaLabel="Loại tiệc"
                  id="partyType"
                  name="partyType"
                  type="select"
                  options={[
                    {
                      id: "",
                      name: "Chọn loại tiệc",
                    },
                    ...partyTypes,
                  ]}
                  onChange={(e) => setPartyType(e.target.value)}
                  value={partyType}
                ></FormInput>
              )}
              <FormInput
                register={register}
                errors={errors}
                errorMessage={errors?.name?.message}
                theme="dark"
                label="Với số lượng khách mời khoảng..."
                ariaLabel="Số lượng khách mời"
                id="partySize"
                name="partySize"
                type="select"
                options={[
                  {
                    id: "",
                    name: "Chọn số lượng khách mời",
                  },
                  ...partySizes,
                ]}
                onChange={(e) => setPartySize(e.target.value)}
                value={partySize}
              ></FormInput>
              <FormInput
                register={register}
                errors={errors}
                errorMessage={errors?.name?.message}
                theme="dark"
                label="Số tiền quý khách dự kiến chi khoảng..."
                ariaLabel="Mức dự chi"
                id="budget"
                name="budget"
                type="select"
                options={[
                  {
                    id: "",
                    name: "Chọn số lượng khách mời",
                  },
                  ...budgets,
                ]}
                onChange={(e) => setBudget(e.target.value)}
                value={budget}
              ></FormInput>

              {partyType && partySize && budget && (
                <AnimatePresence mode="wait" initial={false}>
                  <NextButton />
                </AnimatePresence>
              )}
            </form>
          </Col>
        </Row>
      </section>

      {/* COMBO SECTION */}
    </>
  );
}

const NextButton = () => {
  return (
    <motion.button
      {...framer_button}
      className="flex items-center gap-3 flex-center bg-gold text-white px-8 py-2 rounded-full mt-5 w-full"
      onClick={() => {}}
    >
      <ArrowRightIcon className="w-5 h-5 text-white"></ArrowRightIcon>
      Tiếp tục
    </motion.button>
  );
};

const framer_button = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
  transition: { duration: 0.3 },
};

export default Page;
