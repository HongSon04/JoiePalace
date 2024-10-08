"use client";

import CustomInput from "@/app/_components/CustomInput";
import { _require } from "@/app/_utils/validations";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { Button, ButtonGroup } from "@nextui-org/react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

function AddDishCategory() {
  const [categoryName, setCategoryName] = useState("");

  const methods = useForm();

  const handleSubmit = methods.handleSubmit((data) => {
    console.log("data:", data);
    // LATER: perform submit logic here
  });

  return (
    <Popover
      placement="bottom-end"
      offset={10}
      classNames={{
        content: "bg-white shadow-md",
      }}
    >
      <PopoverTrigger>
        <Button
          radius="full"
          className="bg-whiteAlpha-100 hover:bg-whiteAlpha-200 text-white font-medium !shrink-0"
          startContent={
            <PlusIcon className="w-5 h-5 text-white font-semibold shrink-0" />
          }
        >
          Thêm danh mục món ăn
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-4">
        <FormProvider {...methods}>
          <form
            action="#"
            className="w-full flex gap-4 flex-col items-end"
            onSubmit={(e) => e.preventDefault()}
            noValidate
          >
            <CustomInput
              name={"categoryName"}
              ariaLabel={"Tên danh mục"}
              validation={{ ..._require }}
              label="Tên danh mục"
              placeholder="Nhập tên danh mục"
              autoFocus={true}
              value={categoryName}
              errorMessage="Vui lòng điền tên danh mục"
              classNames={{
                input: "w-full",
                label: "text-gray-600 font-semibold",
              }}
              onChange={(e) => setCategoryName(e.target.value)}
            />
            <div className="flex w-full justify-end items-center gap-5">
              <Button
                className="bg-gray-100 hover:brightness-95 text-gray-600 font-semibold shadow-sm"
                startContent={
                  <XMarkIcon className="w-5 h-5 text-gray-600 font-semibold shrink-0" />
                }
              >
                Hủy
              </Button>
              <Button
                className="bg-blue-400 hover:bg-blue-500 text-white font-semibold"
                startContent={
                  <PlusIcon className="w-5 h-5 text-white font-semibold shrink-0" />
                }
                onClick={handleSubmit}
              >
                Thêm
              </Button>
            </div>
          </form>
        </FormProvider>
      </PopoverContent>
    </Popover>
  );
}

export default AddDishCategory;
