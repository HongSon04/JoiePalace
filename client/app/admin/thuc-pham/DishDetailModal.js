"use client";

import CustomInput from "@/app/_components/CustomInput";
import CustomSelect from "@/app/_components/CustomSelect";
import FileUploader from "@/app/_components/FileUploader";
import FormInput from "@/app/_components/FormInput";
import useApiServices from "@/app/_hooks/useApiServices";
import {
  fetchingSelectedDish,
  fetchingSelectedDishFailure,
  fetchingSelectedDishSuccess,
} from "@/app/_lib/features/dishes/dishesSlice";
import { getDishById, getProductById } from "@/app/_services/productsServices";
import { API_CONFIG } from "@/app/_utils/api.config";
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
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

function DishDetailModal({ isOpen, onOpenChange, onClose, onOpen }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data);
  };

  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  // console.log(id);
  const { selectedDish } = useSelector((store) => store.dishes);
  console.log("selected dish", selectedDish);

  const dispatch = useDispatch();
  const { makeAuthorizedRequest } = useApiServices();

  React.useEffect(() => {
    if (!id) return;

    const getDishById = async (id) => {
      dispatch(fetchingSelectedDish());

      const data = await makeAuthorizedRequest(
        API_CONFIG.PRODUCTS.GET_BY_ID(id),
        "GET",
        null
      );

      if (data.success) {
        console.log(data);
        dispatch(fetchingSelectedDishSuccess());
        onOpen();
      } else {
        console.log("error", data);
        dispatch(fetchingSelectedDishFailure(data.message));
      }
    };

    getDishById(id);

    return () => {};
  }, [id]);

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
              {selectedDish.id}. {selectedDish.name}
            </ModalHeader>
            <ModalBody>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full flex flex-col gap-5"
              >
                <FileUploader image={selectedDish.image || ""} />
                <FormInput
                  register={register}
                  errors={errors}
                  errorMessage={errors?.name?.message}
                  label="Tên món"
                  name="name"
                  wrapperClassName={"mt-0"}
                  labelClassName={"text-gray-800 font-semibold"}
                  className={
                    "w-full bg-slate-100 hover:bg-slate-200 focus:bg-slate-200 text-gray-800"
                  }
                  placeholder="Nhập tên món ăn"
                />
                <FormInput
                  register={register}
                  errors={errors}
                  errorMessage={errors?.price?.message}
                  label="Giá (VND/10 suất)"
                  name="price"
                  wrapperClassName={"mt-0"}
                  labelClassName={"text-gray-800 font-semibold"}
                  className={
                    "w-full bg-slate-100 hover:bg-slate-200 focus:bg-slate-200 text-gray-800"
                  }
                  placeholder="Nhập giá món ăn"
                />
                <div className="flex flex-col">
                  <h2 className="text-gray-600 font-semibold mb-3">
                    Danh mục món ăn
                  </h2>
                  <select
                    name="dishCategory"
                    id="dishCategory"
                    className="select !bg-blackAlpha-100 text-gray-600 hover:text-gray-400"
                  >
                    <option value="#">Danh mục món ăn</option>
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
                <ModalFooter>
                  <Button color="danger">Xóa món ăn</Button>
                  <Button
                    type="submit"
                    className="bg-blue-400 hover:bg-blue-500 text-white font-semibold"
                  >
                    Lưu
                  </Button>
                </ModalFooter>
              </form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default DishDetailModal;
