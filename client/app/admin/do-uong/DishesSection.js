import Dish from "@/app/_components/Dish";
import { EnvelopeIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button, Input, Select, SelectItem, Spinner } from "@nextui-org/react";
import { Col, Row } from "antd";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { Suspense } from "react";
import CustomInput from "@/app/_components/CustomInput";
import { _require } from "@/app/_utils/validations";
import CustomSelect from "@/app/_components/CustomSelect";
import { FormProvider, useForm } from "react-hook-form";

function DishesSection({ dishesType }) {
  const dishes = {
    "Nước suối": [
      {
        id: 1,
        name: "Gỏi cuốn",
        price: 2600000,
        image:
          "https://plus.unsplash.com/premium_photo-1661771822467-e516ca075314?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZGlzaHxlbnwwfHwwfHx8MA%3D%3D",
      },
      {
        id: 2,
        name: "Gỏi ngó súng",
        price: 2600000,
        image:
          "https://plus.unsplash.com/premium_photo-1661771822467-e516ca075314?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZGlzaHxlbnwwfHwwfHx8MA%3D%3D",
      },
      {
        id: 3,
        name: "Gỏi ngó sen",
        price: 2600000,

        image:
          "https://plus.unsplash.com/premium_photo-1661771822467-e516ca075314?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZGlzaHxlbnwwfHwwfHx8MA%3D%3D",
      },
      {
        id: 4,
        name: "Gỏi ngó súng",
        price: 2600000,
        image:
          "https://plus.unsplash.com/premium_photo-1661771822467-e516ca075314?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZGlzaHxlbnwwfHwwfHx8MA%3D%3D",
      },
    ],
    "Đồ uống có ga": [
      {
        id: 3,
        name: "Cá kho tộ",
        price: 100000,
        image:
          "https://plus.unsplash.com/premium_photo-1661771822467-e516ca075314?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZGlzaHxlbnwwfHwwfHx8MA%3D%3D",
      },
      {
        id: 4,
        name: "Gà nướng",
        price: 100000,
        image:
          "https://plus.unsplash.com/premium_photo-1661771822467-e516ca075314?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZGlzaHxlbnwwfHwwfHx8MA%3D%3D",
      },
    ],
    "Đồ uống có cồn": [
      {
        id: 5,
        name: "Chè",
        price: 30000,
        image:
          "https://plus.unsplash.com/premium_photo-1661771822467-e516ca075314?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZGlzaHxlbnwwfHwwfHx8MA%3D%3D",
      },
      {
        id: 6,
        name: "Kem",
        price: 20000,
        image:
          "https://plus.unsplash.com/premium_photo-1661771822467-e516ca075314?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZGlzaHxlbnwwfHwwfHx8MA%3D%3D",
      },
    ],
  }[dishesType];

  const categories = [
    {
      id: 1,
      value: 1,
      name: "Nước suối",
    },
    {
      id: 2,
      value: 2,
      name: "Đồ uống có ga",
    },
    {
      id: 3,
      value: 3,
      name: "Đồ uống có cồn",
    },
  ];

  const methods = useForm();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">{dishesType}</h2>
        <Button
          radius="full"
          className="glass text-white font-semibold !shrink-0"
          isIconOnly
        >
          <PlusIcon width={20} height={20} />
        </Button>
      </div>
      <Row gutter={[12, 12]} className="mt-3">
        {dishes.map((dish, index) => (
          <Dish key={index} dish={dish} />
        ))}
        {/* Add button */}
        <Col
          span={8}
          md={{
            span: 6,
          }}
        >
          <div className="bg-whiteAlpha-100 p-3 group rounded-lg shadow-md flex items-center hover:whiteAlpha-200 cursor-pointer flex-center h-full">
            <Button
              onPress={onOpen}
              isIconOnly
              className="!bg-transparent"
              radius="full"
            >
              <PlusIcon className="w-5 h-5 text-white font-semibold" />
            </Button>
          </div>
        </Col>
      </Row>

      {/* MODAL */}
      {isOpen && (
        <Suspense fallback={<Spinner color="secondary" />}>
          <>
            <Modal
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              placement="top-center"
            >
              <ModalContent>
                {(onClose) => (
                  <FormProvider {...methods}>
                    <form>
                      <ModalHeader className="flex flex-col gap-1">
                        Thêm món ăn
                      </ModalHeader>
                      <ModalBody>
                        <CustomInput
                          name="name"
                          autoFocus={true}
                          label="Tên món"
                          placeholder="Nhập tên món"
                          variant="bordered"
                          validation={_require}
                        />
                        <CustomInput
                          name="price"
                          label="Giá món / 1 suất"
                          placeholder="Nhập giá món"
                          type="password"
                          variant="bordered"
                          validation={_require}
                          className={"mt-5"}
                        />
                        <CustomSelect
                          labelClassName={"text-white"}
                          labelPlacement="outside"
                          label="Danh mục món ăn"
                          areaLabel="Danh mục món ăn"
                          name="category"
                          value="1"
                          options={categories}
                        ></CustomSelect>
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          color="danger"
                          onPress={onClose}
                          startContent={<XMarkIcon />}
                        >
                          Hủy
                        </Button>
                        <Button
                          className="bg-blue-400 hover:bg-blue-500 text-white"
                          onPress={onClose}
                          startContent={<PlusIcon />}
                        >
                          Thêm
                        </Button>
                      </ModalFooter>
                    </form>
                  </FormProvider>
                )}
              </ModalContent>
            </Modal>
          </>
        </Suspense>
      )}
    </div>
  );
}

export default DishesSection;
