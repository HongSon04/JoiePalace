"use client";

import AdminHeader from "@/app/_components/AdminHeader";
import Dish from "@/app/_components/Dish";
import FormInput from "@/app/_components/FormInput";
import SaveIcon from "@/app/_components/SaveIcon";
import Uploader from "@/app/_components/Uploader";
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
  ExclamationCircleIcon,
  PlusIcon,
  SquaresPlusIcon,
} from "@heroicons/react/24/outline";
import { Button, Chip, useDisclosure } from "@nextui-org/react";
import { Col, Row } from "antd";
import Image from "next/image";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import DishesModal from "../[id]/DishesModal";
import Breadcrumbs from "./Breadcrumbs";
import { AnimatePresence, motion } from "framer-motion";
import useRoleGuard from "@/app/_hooks/useRoleGuard";

const schema = z.object({
  name: z.string({ required_error: "Tên thực đơn không được để trống" }),
  maxDishes: z
    .number({
      required_error: "Số lượng món tối đa không được để trống",
    })
    .min(1, { message: "Số lượng món tối thiểu là 1" })
    .max(8, { message: "Số lượng món tối đa là 8" }),
  maxAppetizer: z.number({
    required_error: "Số lượng món khai vị không được để trống",
  }),
});

const MAX_FILE_SIZE = 5000000;
function checkFileType(file) {
  if (file?.name) {
    const fileType = file.name.split(".").pop();
    if (fileType === "jpg" || fileType === "jpeg" || fileType === "png")
      return true;
  }
  return false;
}

function Page() {
  const { isLoading } = useRoleGuard();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [dishCategory, setDishCategory] = React.useState([]);
  const [selectedMenuDishes, setSelectedMenuDishes] = React.useState([]);
  const [imageSrc, setImageSrc] = React.useState("");
  const [appetizer, setAppetizer] = React.useState([]);
  const [mainCourse, setMainCourse] = React.useState([]);
  const [dessert, setDessert] = React.useState([]);
  const [isImagesEmpty, setIsImagesEmpty] = React.useState(false);
  const [isImageOverSize, setIsImageOverSize] = React.useState(false);
  const [isFormatAccepted, setIsFormatAccepted] = React.useState(false);
  const [isDishesEmpty, setIsDishesEmpty] = React.useState(true);
  const [menuDishes, setMenuDishes] = React.useState({
    appetizer,
    mainCourse,
    dessert,
  });
  const [files, setFiles] = React.useState([]);
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    getValues,
  } = useForm();
  const { status } = useSelector((store) => store.menu);
  const dispatch = useDispatch();

  const handleFileChange = (files) => {
    setFiles(files);
  };

  const handleAddingDishes = (dishes, category) => {
    setMenuDishes((prevMenuDishes) => {
      return {
        ...prevMenuDishes,
        [category]: [...dishes],
      };
    });
  };

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValue(name, value);
  };

  // Function to handle form submission
  const onSubmit = (data) => {
    console.log(data);
  };

  React.useEffect(() => {
    const dishCategory = searchParams.get("dishesCategory");
    setDishCategory(dishCategory);
  }, [searchParams]);

  React.useEffect(() => {
    setMenuDishes({
      appetizer,
      mainCourse,
      dessert,
    });
  }, [appetizer, mainCourse, dessert]);

  return (
    <div>
      {/* HEADER */}
      <AdminHeader
        title="Tạo thực đơn"
        path="Thực đơn"
        showNotificationButton={true}
        showHomeButton={true}
        showSearchForm={false}
        className="flex-1"
      />

      {/* BREADCRUMBS */}
      <Breadcrumbs></Breadcrumbs>
      <>
        <div className="flex gap-5 mt-8 w-fit">
          {/* IMAGE & UPLOADER */}
          <div className="flex flex-col">
            <Uploader
              id={"menu-images"}
              name={"menu-images"}
              register={register}
              files={files}
              setFiles={setFiles}
              onFileChange={handleFileChange}
            />
            <AnimatePresence>
              {isImagesEmpty && (
                <motion.div
                  key={"isImagesEmpty"}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-400 text-sm font-normal mt-2 mb-2"
                >
                  <ExclamationCircleIcon className="w-4 h-4 mr-1 inline" />{" "}
                  {"Hãy chọn ít nhất một ảnh cho thực đơn của bạn nhé!"}
                </motion.div>
              )}
              {isImageOverSize && (
                <motion.div
                  key={"isImageOverSize"}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-400 text-sm font-normal mt-2 mb-2"
                >
                  <ExclamationCircleIcon className="w-4 h-4 mr-1 inline" />{" "}
                  {"Hãy chọn ảnh có dung lượng nhỏ hơn 5MB nhé!"}
                </motion.div>
              )}
              {!isFormatAccepted && (
                <motion.div
                  key={"isFormatAccepted"}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-400 text-sm font-normal mt-2 mb-2"
                >
                  <ExclamationCircleIcon className="w-4 h-4 mr-1 inline" />{" "}
                  {"Vui lòng chọn ảnh có định dạng jpg, jpeg hoặc png!"}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* FORM */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="form h-fit [&>div]:mb-5 [&>div>h4]:font-semibold [&>div>h4]:mb-3 [&>div>h4]:text-white p-5 rounded-md bg-whiteAlpha-100 min-w-[400px]"
          >
            {/* MENU NAME */}
            <div className="flex flex-col">
              <h4 className="flex gap-3">
                <Image src={docScan} width={20} height={20} alt="icon" />
                Tên thực đơn
              </h4>
              <FormInput
                register={register}
                errors={errors}
                theme="dark"
                brna
                name="name"
                value={watch("name")}
                label=""
                type="text"
                ariaLabel={"Tên thực đơn"}
                onChange={handleInputChange}
                placeholder="Ex: Thực đơn tiệc cưới"
                wrapperClassName="!mt-0"
              ></FormInput>
            </div>
            {/* MAX OF DISHES */}
            <div className="flex flex-col">
              <h4 className="flex gap-3">
                <SquaresPlusIcon width={20} height={20} color="white" />
                Số lượng món tối đa
              </h4>
              <FormInput
                register={register}
                errors={errors}
                theme="dark"
                className="!bg-whiteAlpha-50 hover:!bg-whiteAlpha-100"
                name="maxDishes"
                value={watch("maxDishes")}
                label=""
                type="number"
                onChange={handleInputChange}
                wrapperClassName="!mt-0"
              ></FormInput>
            </div>
            {/* MAX OF APPETIZER */}
            <div className="flex flex-col">
              <h4 className="flex gap-3">
                <Image src={pizza} width={20} height={20} alt="icon" />
                Số lượng món khai vị
              </h4>
              <FormInput
                register={register}
                errors={errors}
                theme="dark"
                className="!bg-whiteAlpha-50 hover:!bg-whiteAlpha-100"
                name="maxAppetizer"
                value={watch("maxAppetizer")}
                label=""
                type="number"
                ariaLabel={"Số lượng món khai vị"}
                onChange={handleInputChange}
                wrapperClassName="!mt-0"
              ></FormInput>
            </div>
            {/* MAX OF MAIN COURSE */}
            <div className="flex flex-col">
              <h4 className="flex gap-3">
                <Image src={restaurant} width={20} height={20} alt="icon" />
                Số lượng món chính
              </h4>
              <FormInput
                register={register}
                errors={errors}
                theme="dark"
                className="!bg-whiteAlpha-50 hover:!bg-whiteAlpha-100"
                value={watch("maxMainCourse")}
                label=""
                type="number"
                ariaLabel={"Số lượng món chính"}
                onChange={handleInputChange}
                wrapperClassName="!mt-0"
              ></FormInput>
            </div>
            {/* MAX OF DESSERT */}
            <div className="flex flex-col">
              <h4 className="flex gap-3">
                <Image src={setMeal} width={20} height={20} alt="icon" />
                Số lượng món tráng miệng
              </h4>
              <FormInput
                register={register}
                errors={errors}
                theme="dark"
                className="!bg-whiteAlpha-50 hover:!bg-whiteAlpha-100"
                name="maxDessert"
                value={watch("maxDessert")}
                label=""
                ariaLabel={"Số lượng món tráng miệng"}
                onChange={handleInputChange}
                wrapperClassName="!mt-0"
              ></FormInput>
            </div>
            {/* MENU DESCRIPTION */}
            <div className="flex flex-col">
              <h4 className="flex gap-3">
                <Image src={textSnippet} width={20} height={20} alt="icon" />
                Mô tả thực đơn
              </h4>
              <FormInput
                register={register}
                errors={errors}
                theme="dark"
                className="!bg-whiteAlpha-50 hover:!bg-whiteAlpha-100"
                name="description"
                value={watch("description")}
                label=""
                type="textarea"
                ariaLabel={"Số lượng món khai vị"}
                onChange={handleInputChange}
                placeholder="Ex: Thực đơn giành cho chú rể Nguyễn Văn A và cô dâu Trần Thị B"
                wrapperClassName="!mt-0"
              ></FormInput>
            </div>
            <footer className="flex justify-end">
              <Button
                className="bg-teal-400 text-white font-semibold rounded-full"
                size="medium"
                color="primary"
                startContent={<SaveIcon width={20} height={20} />}
                type="submit"
                onClick={handleSubmit}
              >
                Lưu
              </Button>
            </footer>
          </form>
          {/* DISHES LIST */}
          <Row gutter={[20, 20]}>
            {dishCategories.map((category, index) => (
              <Col span={24} key={index}>
                {/* HEADER */}
                <div className="flex justify-between items-center w-full p-3 rounded-xl bg-whiteAlpha-100">
                  <div className="flex flex-col gap-1">
                    <h4 className="text-lg leading-7 font-semibold text-white">
                      {category.label} -{" "}
                      {getValues(`max${capitalize(category.key)}`)} món
                    </h4>
                    <p className="text-md leading-6 font-normal text-white">
                      Tổng:{" "}
                      {formatPrice(
                        menuDishes[category.key]
                          .filter((dish) => dish.category === category.key)
                          .map((dish) => dish.price)
                          .reduce((a, b) => a + b, 0)
                      )}
                    </p>
                  </div>
                  <Chip className="bg-whiteAlpha-100 text-white">
                    {(() => {
                      const maxDishes = Number(
                        getValues(`max${capitalize(category.key)}`)
                      );
                      const currentDishes = Number(
                        menuDishes[category.key].length
                      );
                      const remainingDishes = maxDishes - currentDishes;
                      return remainingDishes > 0
                        ? `Còn ${remainingDishes}`
                        : "Đã đủ";
                    })()}
                  </Chip>
                </div>
                {/* DISHES LIST */}
                {menuDishes[category.key].map((dish) => {
                  if (dish.category === category.key) {
                    return (
                      <Dish
                        key={dish.id}
                        dish={dish}
                        className={"mt-3 !h-fit !hover:brightness-95"}
                      />
                    );
                  }
                })}
                <>
                  <Button
                    isIconOnly
                    onClick={() => {
                      router.push(
                        pathname +
                          "?" +
                          createQueryString("dishesCategory", category.key)
                      );
                      onOpen();
                    }}
                    className="bg-whiteAlpha-100 p-3 group rounded-lg shadow-md flex items-center hover:whiteAlpha-200 cursor-pointer flex-center h-fit w-full mt-3"
                    radius="full"
                  >
                    <PlusIcon className="w-5 h-5 text-white font-semibold" />
                  </Button>
                  <DishesModal
                    category={dishCategory}
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    onAddingDishes={handleAddingDishes}
                    menuDishes={menuDishes}
                    // menuInfo={formState}
                    selectedMenuDishes={selectedMenuDishes}
                    setSelectedMenuDishes={setSelectedMenuDishes}
                  />
                </>
              </Col>
            ))}
          </Row>
        </div>
      </>
    </div>
  );
}

export default Page;
