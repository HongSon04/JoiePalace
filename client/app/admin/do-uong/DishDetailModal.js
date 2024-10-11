import CustomInput from "@/app/_components/CustomInput";
import CustomSelect from "@/app/_components/CustomSelect";
import FileUploader from "@/app/_components/FileUploader";
import { dishCategories } from "@/app/_utils/config";
import { _required } from "@/app/_utils/validations";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";

const options = [
  {
    value: 1,
    name: "Khai vị",
  },
  {
    value: 2,
    name: "Món chính",
  },
  {
    value: 3,
    name: "Món tráng miệng",
  },
];

async function DishDetailModal({ isOpen, onOpenChange, onClose, onOpen }) {
  const methods = useForm();

  const handleSubmit = methods.handleSubmit((data) => {
    console.log(data);
  });

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  // LATER: Fetch dish by id
  const dish = {
    id: 1,
    name: "Gỏi cuốn",
    price: 2600000,
    image:
      "https://plus.unsplash.com/premium_photo-1661771822467-e516ca075314?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZGlzaHxlbnwwfHwwfHx8MA%3D%3D",
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      classNames={{
        base: "bg-white",
        backdrop: "bg-blackAlpha-500",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-gray-600">
              {dish.id}. {dish.name}
            </ModalHeader>
            <ModalBody>
              <FormProvider {...methods}>
                <form
                  action="#"
                  noValidate
                  onSubmit={handleSubmit}
                  className="w-full flex flex-col gap-5"
                >
                  <FileUploader image={dish.image} />
                  <CustomInput
                    label="Tên món"
                    name="name"
                    value={dish.name}
                    validation={_required}
                    className={"w-full"}
                    classNames={{
                      input: "bg-blackAlpha-100",
                      label: "text-gray-600 font-semibold",
                    }}
                    placeholder="Nhập tên món ăn"
                  />
                  <CustomInput
                    label="Giá (VND/1 suất)"
                    name="price"
                    value={dish.price}
                    validation={_required}
                    className={"w-full mt-14"}
                    classNames={{
                      input: "bg-blackAlpha-100",
                      label: "text-gray-600 font-semibold",
                    }}
                    placeholder="Nhập giá món ăn"
                  />
                  <div className="flex flex-col">
                    <h2 className="text-gray-600 font-semibold mb-3">
                      Danh mục món ăn
                    </h2>
                    <select
                      name="dishCategory"
                      id="dishCategory"
                      value={dishCategories}
                      className="select !bg-blackAlpha-100 text-gray-600 hover:text-gray-400"
                    >
                      {dishCategories.map((category) => (
                        <option
                          value={category.id}
                          key={category.key}
                          className="option text-gray-600"
                        >
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </form>
              </FormProvider>
            </ModalBody>
            <ModalFooter>
              <Button color="danger">Xóa món ăn</Button>
              <Button className="bg-blue-400 hover:bg-blue-500 text-white font-semibold">
                Lưu
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default DishDetailModal;
