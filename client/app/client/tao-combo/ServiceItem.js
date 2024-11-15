import { CONFIG } from "@/app/_utils/config";
import { Col, Row } from "antd";
import Image from "next/image";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/react";
import { EyeIcon } from "@heroicons/react/24/outline";
import React from "react";

function ServiceItem({ service, compairState, onChange, name }) {
  const { isOpen, onOpenChange, onClose, onOpen } = useDisclosure();

  let parsedState = null;
  try {
    parsedState = JSON.parse(compairState);
  } catch (e) {
    console.log("");
  }
  const isSelected = parsedState && parsedState.id == service.id;

  const inputRef = React.useRef(null);

  const handleSelectAndClose = () => {
    inputRef.current.click();
    onClose();
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
          value={JSON.stringify(service)}
          checked={isSelected}
          onChange={onChange}
          className="hidden"
        />
        <div
          className="w-[110px] h-[100px] relative overflow-hidden rounded-lg group"
          onClick={(e) => {
            e.preventDefault();
            onOpen();
          }}
        >
          <div className="absolute inset-0 bg-blackAlpha-500 flex-center scale-0 group-hover:scale-100 z-30">
            <EyeIcon className="w-6 h-6 text-white" />
          </div>
          <Image
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
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {service.name}
              </ModalHeader>
              <ModalBody>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <div className="w-full h-[300px] relative overflow-hidden rounded-lg">
                      <Image
                        fill
                        sizes="300px"
                        src={
                          service.images.at(0) || CONFIG.DISH_IMAGE_PLACEHOLDER
                        }
                        alt={service.name}
                        className="object-cover"
                      />
                    </div>
                    <p className="text-md text-gray-600 mt-3">
                      {service.short_description}
                    </p>
                  </Col>
                  <Col span={12}>
                    <p className="text-gray-800 text-start w-full text-base text-wrap">
                      {service.description}
                    </p>
                    <p className="text-base mt-3">
                      Giá dịch vụ: {service.price.toLocaleString()} VNĐ
                    </p>
                    <p className="text-gold text-end w-full text-base text-wrap uppercase mt-3">
                      JOIE PALACE
                    </p>
                  </Col>
                </Row>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" radius="full" onPress={onClose}>
                  Đóng
                </Button>
                <Button
                  radius="full"
                  className="bg-gold text-white"
                  onPress={handleSelectAndClose}
                >
                  Chọn
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default ServiceItem;
