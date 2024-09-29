"use client";

import AdminHeader from "@/app/_components/AdminHeader";
import CustomInput from "@/app/_components/CustomInput";
import Dish from "@/app/_components/Dish";
import SaveIcon from "@/app/_components/SaveIcon";
import FileUploadButton from "@/app/_components/Uploader";
import { fetchMenu } from "@/app/_lib/features/menu/menuSlice";
import { dishCategories } from "@/app/_utils/config";
import { formatPrice } from "@/app/_utils/formaters";
import { capitalize } from "@/app/_utils/helpers";
import { _require } from "@/app/_utils/validations";
import docScan from "@/public/document_scanner.svg";
import pizza from "@/public/local_pizza.svg";
import restaurant from "@/public/restaurant.svg";
import setMeal from "@/public/set_meal.svg";
import textSnippet from "@/public/text_snippet.svg";
import {
  DocumentArrowUpIcon,
  SquaresPlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Button, Chip } from "@nextui-org/react";
import { Col, Row } from "antd";
import Image from "next/image";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import MenuBreadcrumbs from "./MenuBreadcrumbs";

function Page({ params }) {
  const methods = useForm();

  const { id } = params;
  // console.log(id);

  const { menu, status } = useSelector((store) => store.menu);

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchMenu(id));
  }, [dispatch, id]);

  // console.log(menu);

  return (
    <div>
      {/* HEADER */}
      <AdminHeader
        title="Chi tiết thực đơn"
        path="Thực đơn"
        showNotificationButton={true}
        showHomeButton={true}
        showSearchForm={false}
        className="flex-1"
      />

      {/* BREADCRUMBS */}
      <MenuBreadcrumbs menuId={id} />

      {/* MAIN CONTENT */}
      {status === "loading" && <p>Loading...</p>}
      {status === "failed" && <p>Failed to load data</p>}
      {status === "succeeded" && (
        <>
          <div className="flex gap-5 mt-8 w-fit">
            {/* IMAGE & UPLOADER */}
            <div className="w-fit relative h-fit">
              <Image
                src={menu.background}
                alt="background"
                width={345}
                height={440}
              />
              {/* ACTIONS */}
              <div className="flex p-5 gap-5 bg-whiteAlpha-300 rounded-md absolute bottom-3 left-3 right-3 flex-center">
                {/* DELETE */}
                <Button
                  startContent={<TrashIcon />}
                  className="bg-red-400 text-white rounded-full"
                >
                  Xóa
                </Button>
                {/* UPLOADER */}
                <FileUploadButton
                  size="md"
                  accept="image/*"
                  startContent={
                    <DocumentArrowUpIcon width={20} height={20} color="white" />
                  }
                  rejectProps={{
                    color: "danger",
                    startContent: <XMarkIcon />,
                  }}
                  onUpload={(files) => {
                    console.log(files[0]);
                  }}
                  className={"bg-teal-400 text-white rounded-full"}
                >
                  Upload
                </FileUploadButton>
              </div>
            </div>
            {/* SUMMARY */}
            <div className="summary p-5 h-fit rounded-md bg-whiteAlpha-100 text-white min-w-[345px]">
              <h2 className="pb-5 border-b-1 border-whiteAlpha-200">
                Tổng chi phí
              </h2>
              <div className="flex justify-between py-5">
                <h4>Khai vị:</h4>
                <span>4.000.000 VND</span>
              </div>
              <div className="flex justify-between py-5">
                <h4>Món chính:</h4>
                <span>4.000.000 VND</span>
              </div>
              <div className="flex justify-between py-5 border-b-1 border-whiteAlpha-200">
                <h4>Món tráng miệng:</h4>
                <span>4.000.000 VND</span>
              </div>
              <div className="flex justify-between pt-5">
                <h4 className="text-bold text-xl">Tổng tiền:</h4>
                <span className="text-bold text-xl">4.000.000 VND</span>
              </div>
            </div>
            {/* FORM */}
            <FormProvider {...methods}>
              <form className="form [&>div]:mb-5 [&>div>h4]:font-semibold [&>div>h4]:mb-3 [&>div>h4]:text-white p-5 rounded-md bg-whiteAlpha-100 min-w-[400px]">
                <div className="flex flex-col">
                  <h4 className="flex gap-3">
                    <Image src={docScan} width={20} height={20} alt="icon" />
                    Tên thực đơn
                  </h4>
                  <CustomInput
                    name="name"
                    value={menu.name}
                    validation={_require}
                    label=""
                    ariaLabel={"Tên thực đơn"}
                  ></CustomInput>
                </div>
                <div className="flex flex-col">
                  <h4 className="flex gap-3">
                    <SquaresPlusIcon width={20} height={20} color="white" />
                    Số lượng món tối đa
                  </h4>
                  <CustomInput
                    name="maxDishes"
                    value={menu.maxDishes}
                    validation={_require}
                    label=""
                    ariaLabel={"Tên thực đơn"}
                  ></CustomInput>
                </div>
                <div className="flex flex-col">
                  <h4 className="flex gap-3">
                    <Image src={pizza} width={20} height={20} alt="icon" />
                    Số lượng món khai vị
                  </h4>
                  <CustomInput
                    name="maxAppetizer"
                    value={menu.maxAppetizer}
                    validation={_require}
                    label=""
                    ariaLabel={"Số lượng món khai vị"}
                  ></CustomInput>
                </div>
                <div className="flex flex-col">
                  <h4 className="flex gap-3">
                    <Image src={restaurant} width={20} height={20} alt="icon" />
                    Số lượng món chính
                  </h4>
                  <CustomInput
                    name="maxMainCourse"
                    value={menu.maxMainCourse}
                    validation={_require}
                    label=""
                    ariaLabel={"Số lượng món chính"}
                  ></CustomInput>
                </div>
                <div className="flex flex-col">
                  <h4 className="flex gap-3">
                    <Image src={setMeal} width={20} height={20} alt="icon" />
                    Số lượng món tráng miệng
                  </h4>
                  <CustomInput
                    name="maxDessert"
                    value={menu.maxDessert}
                    validation={_require}
                    label=""
                    ariaLabel={"Số lượng món tráng miệng"}
                  ></CustomInput>
                </div>
                <div className="flex flex-col">
                  <h4 className="flex gap-3">
                    <Image
                      src={textSnippet}
                      width={20}
                      height={20}
                      alt="icon"
                    />
                    Mô tả thực đơn
                  </h4>
                  <CustomInput
                    name="description"
                    value={menu.description}
                    validation={_require}
                    label=""
                    ariaLabel={"Số lượng món khai vị"}
                    multiLine={true}
                  ></CustomInput>
                </div>
                <footer className="flex justify-end">
                  <Button
                    className="bg-teal-400 text-white font-semibold rounded-full"
                    size="medium"
                    color="primary"
                    startContent={<SaveIcon width={20} height={20} />}
                  >
                    Lưu
                  </Button>
                </footer>
              </form>
            </FormProvider>
          </div>
          {/* DISHES LIST */}
          <Row gutter={[20, 20]} className="mt-8">
            {dishCategories.map((category, index) => (
              <Col span={8} key={index}>
                {/* HEADER */}
                <div className="flex justify-between items-center w-full p-3 rounded-xl bg-whiteAlpha-100">
                  <div className="flex flex-col gap-1">
                    <h4 className="text-lg leading-7 font-semibold text-white">
                      {category.label} -{" "}
                      {menu[`max${capitalize(category.key)}`]} món
                    </h4>
                    <p className="text-md leading-6 font-normal text-white">
                      Tổng:{" "}
                      {formatPrice(
                        menu.dishes
                          .filter((dish) => dish.category === category.key)
                          .map((dish) => dish.price)
                          .reduce((a, b) => a + b, 0)
                      )}
                    </p>
                  </div>
                  <Chip className="bg-whiteAlpha-100 text-white">
                    {menu[`max${capitalize(category.key)}`] -
                      menu.dishes.filter(
                        (dish) => dish.category === category.key
                      ).length ===
                    0
                      ? menu[`max${capitalize(category.key)}`] -
                          menu.dishes.filter(
                            (dish) => dish.category === category.key
                          ).length <
                        0
                        ? "Đang thừa"
                        : "Đã đủ"
                      : "Chưa đủ"}
                  </Chip>
                </div>
                {/* DISHES LIST */}
                {menu.dishes
                  .map((dish) => dish.category === category.key)
                  .map((dish, index) => (
                    <Dish key={index} dish={dish} menuId={id} />
                  ))}
              </Col>
            ))}
          </Row>
        </>
      )}
    </div>
  );
}

export default Page;
