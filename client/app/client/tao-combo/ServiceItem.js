import { CONFIG } from "@/app/_utils/config";
import NextImage from "next/image";

import "@/app/_styles/antDesignCustom.css";
import { EyeIcon } from "@heroicons/react/24/outline";
import { useDisclosure } from "@nextui-org/modal";
import React from "react";
import { Carousel, Col, Divider, Image, Modal, Row } from "antd";
import Link from "next/link";
import { Button } from "@nextui-org/react";
import ClientDish from "@/app/_components/ClientDish";

var settings = {
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  variableWidth: true,
  adaptiveHeight: true,
  swipeToSlide: true,
  accessibility: false,
};

const getDishCategoryName = (slug) => {
  if (!slug) return;

  switch (slug) {
    case "mon-chinh":
      return "Món chính";
      break;
    case "mon-khai-vi":
      return "Món khai vị";
      break;
    case "mon-trang-mieng":
      return "Món tráng miệng";
      break;
    case "nuoc-uong":
      return "Nước uống";
      break;

    default:
      break;
  }
};

function ServiceItem({ service, compairState, onChange, name, type }) {
  const carouselRef = React.useRef(null);
  const inputRef = React.useRef(null);

  const onCarouselChange = (currentSlide) => {
    console.log(currentSlide);
  };
  const [onOpen, setOnOpen] = React.useState(false);

  const handleOpen = () => {
    setOnOpen(true);
  };

  const handleClose = () => {
    setOnOpen(false);
  };

  let parsedState = null;
  try {
    parsedState = JSON.parse(compairState);
  } catch (e) {
    console.log("");
  }
  const isSelected = parsedState && parsedState.id == service.id;

  const handleSelectAndClose = () => {
    inputRef.current.click();
    handleClose();
  };

  return (
    <>
      <label
        className={`flex flex-col items-start gap-3 cursor-pointer p-3 rounded-lg max-w-[130px] group relative ${
          isSelected ? "bg-whiteAlpha-400" : ""
        }`}
      >
        <input
          ref={inputRef}
          type="radio"
          name={name || "service"}
          value={
            JSON.stringify(service) ||
            JSON.stringify({
              id: "",
              name: "",
              price: "",
            })
          }
          checked={isSelected}
          onChange={onChange}
          className="hidden"
        />
        <div
          className="w-[110px] h-[100px] relative overflow-hidden rounded-lg group"
          onClick={(e) => {
            e.preventDefault();
            handleOpen();
          }}
        >
          <div className="absolute inset-0 bg-blackAlpha-500 flex-center scale-0 group-hover:scale-100 z-30">
            <EyeIcon className="w-6 h-6 text-white" />
          </div>
          <NextImage
            fill
            sizes="100px"
            src={service.images.at(0) || CONFIG.DISH_IMAGE_PLACEHOLDER}
            alt={service.name}
            className="object-cover"
          />
        </div>
        <span className="text-white text-start w-full text-sm text-wrap">
          {service.name}
        </span>
        <span className="text-white text-start w-full text-sm text-wrap">
          {service.price.toLocaleString()} VNĐ
        </span>
      </label>
      <Modal
        // title={
        //   <h3 className="text-2xl font-bold text-center mb-5 text-gray-600">
        //     {service.name}
        //   </h3>
        // }
        centered
        open={onOpen}
        footer={[
          <Button
            key={"closeButton"}
            variant="light"
            radius="full"
            onPress={handleClose}
          >
            Đóng
          </Button>,
          <Button
            key={"selectButton"}
            radius="full"
            className="bg-gold text-white"
            onPress={handleSelectAndClose}
          >
            Chọn
          </Button>,
        ]}
        width={800}
        onOk={handleClose}
        onCancel={handleClose}
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Image
              src={service.images.at(0)}
              alt={service.name}
              height={"100%"}
              width={"100%"}
            ></Image>
          </Col>
          <Col span={12}>
            <h3 className="text-2xl font-bold mb-5 text-gray-800">
              {service.name}
            </h3>
            <p className="text-base text-gray-600">
              {service.short_description}
            </p>
            <p className="text-gray-600 text-start w-full text-base text-wrap">
              {service.description.split(".").map((item, index) => (
                <p className="text-md text-gray-600 mt-3" key={index}>
                  {item}
                </p>
              ))}
            </p>
            {service?.products && service?.products.length > 0 && (
              <>
                <Divider className="mt-5" />
                {service?.products.map((p) => (
                  <p className="text-base mt-3 text-gray-800" key={p.id}>
                    {p?.name}: {p?.price.toLocaleString()} VNĐ
                  </p>
                ))}
              </>
            )}
            <Divider className="mt-5 bg-gray-100" />
            <div className="flex flex-col mt-3 text-gray-800">
              <p className="text-base font-semibold text-inherit">
                Tổng giá trị: {service.price.toLocaleString()} VNĐ
              </p>
              {/* <Link
                className="text-gold text-base underline shrink-0 hover:text-gold hover:underline hover:brightness-90 mt-3"
                href={`/client/chi-tiet-thuc-don/${service.slug}`}
              >
                Xem chi tiết
              </Link> */}
            </div>
          </Col>
        </Row>
        {type === "decor" && (
          <Image.PreviewGroup>
            <h4 className="uppercase text-gold mt-8 mb-8 font-bold">
              Hình ảnh chi tiết
            </h4>
            <div className="columns-3">
              {service?.images?.length > 0 && (
                <Image
                  width={"100%"}
                  height={"auto"}
                  src={service.images.at(0)}
                  alt={name}
                  className="mb-3"
                  lazy
                />
              )}
              {service?.products &&
                service?.products.length > 0 &&
                service?.products.map((p, index) =>
                  p?.images.map((image, i) => (
                    <Image
                      key={i}
                      width={"100%"}
                      height={"auto"}
                      src={image}
                      alt={name}
                      className="mb-3"
                      lazy
                    />
                  ))
                )}
            </div>
          </Image.PreviewGroup>
        )}
        {type === "menu" &&
          service?.products &&
          Object.keys(service?.products).map(
            (key) =>
              service?.products[key]?.length > 0 && (
                <div key={key} className="mt-3">
                  <div className="flex justify-between w-full">
                    <h3 className="text-lg font-semibold text-gold uppercase">
                      {getDishCategoryName(key)} (
                      {service?.products[key]?.length} món)
                    </h3>
                    <div className="flex gap-3 items-center">
                      {/* <Button onClick={handlePrevious}>
                                <ArrowLeftCircleIcon />
                              </Button>
                              <Button onClick={handleNext}>
                                <ArrowRightCircleIcon />
                              </Button> */}
                    </div>
                  </div>
                  <Carousel
                    afterChange={onCarouselChange}
                    arrows
                    infinite={false}
                    draggable
                    ref={carouselRef}
                    className="mt-8"
                    slidesToShow={2}
                  >
                    {/* DISHES */}
                    {service.products[key].map((dish, index) => (
                      <ClientDish
                        className="select-none"
                        dish={dish}
                        key={index}
                        size="sm"
                        hideActions={true}
                      />
                    ))}
                  </Carousel>
                </div>
              )
          )}
      </Modal>
    </>
  );
}

export default ServiceItem;
